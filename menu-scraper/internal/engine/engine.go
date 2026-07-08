package engine

import (
	"bytes"
	"context"
	"fmt"
	"image"
	"log"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/config"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/gemini"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/httpclient"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/logic"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/models"
)

type ScraperEngine struct {
	Analyzer *gemini.ImageAnalyzer
	Config   *config.AppConfig
}

func NewScraperEngine(analyzer *gemini.ImageAnalyzer, config *config.AppConfig) *ScraperEngine {
	return &ScraperEngine{
		Analyzer: analyzer,
		Config:   config,
	}
}

func (e *ScraperEngine) Run(ctx context.Context, storyAPIUrl string) ([]*models.MenuResponse, error) {
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

	return e.AnalyzeImages(ctx, client, images, false)
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

func (e *ScraperEngine) AnalyzeImages(ctx context.Context, client *http.Client, images []string, isLocal bool) ([]*models.MenuResponse, error) {
	var (
		wg        sync.WaitGroup
		resultsCh = make(chan *models.MenuResponse, len(images))
		errorsCh  = make(chan error, len(images))
		sem       = make(chan struct{}, 3)
	)

	for _, imgSource := range images {
		wg.Add(1)
		go func(source string) {
			defer wg.Done()

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

			sem <- struct{}{}
			defer func() { <-sem }()

			debugImage("ORIGINAL", img)

			resizedImg, err := logic.ResizeImage(img)
			if err == nil {
				debugImage("RESIZED", resizedImg)
				img = resizedImg
			}

			ext := filepath.Ext(source)
			mimeType := "image/jpeg"

			switch strings.ToLower(ext) {
			case ".png":
				mimeType = "image/png"
			case ".webp":
				mimeType = "image/webp"
			}

			resp, err := e.Analyzer.Process(ctx, img, mimeType)
			if err != nil {
				errorsCh <- fmt.Errorf("analyzing %s: %w", source, err)
				return
			}

			if resp.IsMenu {
				resp.PopulateCommonAllergens()
				resultsCh <- resp
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

	return results, nil
}

func debugImage(label string, data []byte) {
	sizeKB := float64(len(data)) / 1024

	config, _, err := image.DecodeConfig(bytes.NewReader(data))
	if err != nil {
		fmt.Printf("[%s] size: %.2f KB | resolution: unknown (%v)\n", label, sizeKB, err)
		return
	}

	fmt.Printf("[%s] size: %.2f KB | resolution: %dx%d\n", label, sizeKB, config.Width, config.Height)
}
