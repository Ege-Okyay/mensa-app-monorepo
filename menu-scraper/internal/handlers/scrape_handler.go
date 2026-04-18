package handlers

import (
	"bytes"
	"context"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/gemini"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/httpclient"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/logic"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/models"
	"github.com/gofiber/fiber/v2"
	_ "golang.org/x/image/webp"
)

func ScrapeAndAnalyze(analyzer *gemini.ImageAnalyzer, ctx context.Context) fiber.Handler {
	return func(c *fiber.Ctx) error {
		url := os.Getenv("IG_STORY_API_URL")

		client := httpclient.New()
		headers := httpclient.DefaultHeaders()

		html, err := logic.FetchHTML(client, url, headers)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		images, err := logic.ExtactImagesFromHTML(html)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		if len(images) == 0 {
			return c.Status(fiber.StatusInternalServerError).SendString("Empty images array")
		}

		results, err := analyzeImages(ctx, analyzer, images, false)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		return c.JSON(results)
	}
}

func TestAnalyze(analyzer *gemini.ImageAnalyzer, ctx context.Context) fiber.Handler {
	return func(c *fiber.Ctx) error {
		testDir := "test"
		entries, err := os.ReadDir(testDir)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(fmt.Sprintf("failed to read test dir: %v", err))
		}

		var images []string
		for _, entry := range entries {
			if !entry.IsDir() {
				images = append(images, filepath.Join(testDir, entry.Name()))
			}
		}

		if len(images) == 0 {
			return c.Status(fiber.StatusInternalServerError).SendString("Empty test images array")
		}

		results, err := analyzeImages(ctx, analyzer, images, true)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		return c.JSON(results)
	}
}

func analyzeImages(ctx context.Context, analyzer *gemini.ImageAnalyzer, images []string, isLocal bool) ([]*models.MenuResponse, error) {
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

			var img []byte
			var err error
			if isLocal {
				img, err = os.ReadFile(source)
			} else {
				img, err = logic.FetchImage(source)
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

			resp, err := analyzer.Process(ctx, img, mimeType)
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
	var errs []error

	for r := range resultsCh {
		results = append(results, r)
	}

	for e := range errorsCh {
		errs = append(errs, e)
	}

	if len(results) == 0 && len(errs) > 0 {
		return nil, errs[0]
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
