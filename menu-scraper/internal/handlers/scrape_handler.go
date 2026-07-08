package handlers

import (
	"fmt"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"os"
	"path/filepath"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/engine"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/httpclient"
	"github.com/gofiber/fiber/v2"
	_ "golang.org/x/image/webp"
)

func ScrapeAndAnalyze(engine *engine.ScraperEngine, storyAPIUrl string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		results, err := engine.Run(c.Context(), storyAPIUrl)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		return c.JSON(results)
	}
}

func TestScrape(engine *engine.ScraperEngine, storyAPIUrl string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		results, err := engine.RunWithoutAnalyze(c.Context(), storyAPIUrl)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		return c.JSON(results)
	}
}

func TestAnalyze(engine *engine.ScraperEngine) fiber.Handler {
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

		client := httpclient.New()
		results, err := engine.AnalyzeImages(c.Context(), client, images, true)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		return c.JSON(results)
	}
}
