package engine

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"image"
	"log"
	"math/rand"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/config"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/gemini"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/httpclient"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/logic"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/models"
	"google.golang.org/genai"
)

type Analyzer interface {
	Process(ctx context.Context, img []byte, mimeType string) (*models.MenuResponse, error)
}

type ScraperEngine struct {
	Analyzer                 Analyzer
	Config                   *config.AppConfig
	ProcessedImagesCachePath string
}

func NewScraperEngine(analyzer *gemini.ImageAnalyzer, config *config.AppConfig) *ScraperEngine {
	return &ScraperEngine{
		Analyzer: analyzer,
		Config:   config,
	}
}

func (e *ScraperEngine) Run(ctx context.Context, storyAPIUrl string, retryDelay int) ([]*models.MenuResponse, error) {
	client := httpclient.New()

	log.Printf("Fetching stories from API...")

	images, err := logic.FetchStories(client, storyAPIUrl)
	if err != nil {
		return nil, err
	}

	if len(images) == 0 {
		return nil, fmt.Errorf("no images found")
	}

	log.Printf("Found %d images, starting analysis...", len(images))

	return e.AnalyzeImages(ctx, client, images, false, retryDelay)
}

func (e *ScraperEngine) RunWithoutAnalyze(ctx context.Context, storyAPIUrl string) ([]string, error) {
	client := httpclient.New()

	log.Printf("Fetching stories from API without analyzing...")

	images, err := logic.FetchStories(client, storyAPIUrl)
	if err != nil {
		return nil, err
	}

	if len(images) == 0 {
		return nil, fmt.Errorf("no images found")
	}

	return images, nil
}

func (e *ScraperEngine) AnalyzeImages(ctx context.Context, client *http.Client, images []string, isLocal bool, retryDelay int) ([]*models.MenuResponse, error) {
	var (
		wg        sync.WaitGroup
		resultsCh = make(chan *models.MenuResponse, len(images))
		errorsCh  = make(chan error, len(images))
		sem       = make(chan struct{}, e.Config.MaxConcurrency)
	)

	var cache *ProcessedImagesCache
	if e.ProcessedImagesCachePath != "" {
		cache = LoadCache(e.ProcessedImagesCachePath)
		log.Printf("Loaded cache with %d known images", len(cache.Hashes))
	}

	for _, imgSource := range images {
		if cache != nil && cache.IsProcessed(imgSource) {
			log.Printf("Skipping already processed image: %s", imgSource)
			continue
		}

		sem <- struct{}{}
		wg.Add(1)
		go func(source string) {
			defer wg.Done()
			defer func() { <-sem }()

			if !isLocal && e.Config.RequestDelayMs > 0 {
				jitter := time.Duration(rand.Intn(e.Config.RequestDelayMs)) * time.Millisecond
				time.Sleep(jitter)
			}

			var img []byte
			var err error

			if isLocal {
				img, err = os.ReadFile(source)
			} else {
				img, err = logic.FetchImage(client, source)
			}

			if err != nil {
				errorsCh <- fmt.Errorf("getting image %s: %w", source, err)
				return
			}

			debugImage("ORIGINAL", img)

			resizedImg, err := logic.ResizeImage(img)
			if err == nil {
				debugImage("RESIZED", resizedImg)
				img = resizedImg
			}

			mimeType := http.DetectContentType(img)

			resp, err := e.analyzeWithRetry(ctx, source, img, mimeType, retryDelay)
			if err != nil {
				errorsCh <- err
				return
			}

			if resp.IsMenu {
				resp.PopulateCommonAllergens()
				resultsCh <- resp
			}

			if cache != nil {
				cache.MarkProcessed(source)
			}
		}(imgSource)
	}

	go func() {
		wg.Wait()
		close(resultsCh)
		close(errorsCh)
	}()

	var results []*models.MenuResponse

	for r := range resultsCh {
		results = append(results, r)
	}

	if len(results) == 0 && len(errorsCh) > 0 {
		return nil, <-errorsCh
	}

	if cache != nil {
		cache.Save()
		log.Printf("Saved cache with %d total images", len(cache.Hashes))
	}

	return results, nil
}

func isRateLimitError(err error) bool {
	var apiErr *genai.APIError

	if errors.As(err, &apiErr) {
		return apiErr.Code == 429 || apiErr.Status == "RESOURCE_EXHAUSTED"
	}

	return false
}

func (e *ScraperEngine) analyzeWithRetry(ctx context.Context, source string, img []byte, mimeType string, retryDelay int) (*models.MenuResponse, error) {
	const maxRetries = 2

	for attempt := range maxRetries {
		resp, err := e.Analyzer.Process(ctx, img, mimeType)
		if err == nil {
			return resp, nil
		}

		if !isRateLimitError(err) || attempt == maxRetries-1 {
			return nil, fmt.Errorf("analyzing %s: %w", source, err)
		}

		log.Printf("Warning: rate limit hit on %s, waiting %ds before retry (attempt %d/%d)", source, retryDelay, attempt+1, maxRetries)

		time.Sleep(time.Duration(retryDelay) * time.Second)
	}

	return nil, fmt.Errorf("analyzing %s: max retries exceeded", source)
}

func debugImage(label string, data []byte) {
	sizeKB := float64(len(data)) / 1024

	config, _, err := image.DecodeConfig(bytes.NewReader(data))
	if err != nil {
		log.Printf("[%s] size: %.2f KB | resolution: unknown (%v)\n", label, sizeKB, err)
		return
	}

	log.Printf("[%s] size: %.2f KB | resolution: %dx%d\n", label, sizeKB, config.Width, config.Height)
}
