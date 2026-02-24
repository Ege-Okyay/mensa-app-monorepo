package handlers

import (
	"context"
	"os"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/gemini"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/httpclient"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/logic"
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

		img, err := logic.FetchImage(images[0])

		resp, err := analyzer.Process(ctx, img, "image/jpeg")
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}

		return c.JSON(resp)
	}
}
