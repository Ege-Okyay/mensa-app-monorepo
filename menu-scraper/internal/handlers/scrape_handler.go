package handlers

import (
	"context"
	"fmt"
	"os"
	"sync"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/gemini"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/httpclient"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/logic"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/models"
	"github.com/gofiber/fiber/v2"
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

		results, err := analyzeImages(ctx, analyzer, images)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		return c.JSON(results)
	}
}

func analyzeImages(ctx context.Context, analyzer *gemini.ImageAnalyzer, images []string) ([]*models.MenuResponse, error) {
	var (
		wg        sync.WaitGroup
		resultsCh = make(chan *models.MenuResponse, len(images))
		errorsCh  = make(chan error, len(images))
		sem       = make(chan struct{}, 5)
	)

	for _, imgURL := range images {
		wg.Add(1)
		go func(url string) {
			defer wg.Done()

			sem <- struct{}{}
			defer func() { <-sem }()

			img, err := logic.FetchImage(url)
			if err != nil {
				errorsCh <- fmt.Errorf("fetching %s: %w", url, err)
				return
			}

			resp, err := analyzer.Process(ctx, img, "image/jpeg")
			if err != nil {
				errorsCh <- fmt.Errorf("analyzing %s: %w", url, err)
				return
			}

			resultsCh <- resp
		}(imgURL)
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
