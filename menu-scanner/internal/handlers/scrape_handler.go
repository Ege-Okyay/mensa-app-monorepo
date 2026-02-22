package handlers

import (
	"os"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/gemini"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/httpclient"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/logic"
	"github.com/gofiber/fiber/v2"
)

func ScrapeAndAnalyze(analyzer *gemini.ImageAnalyzer) fiber.Handler {
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

		return c.JSON(fiber.Map{
			"images": images,
		})
	}
}
