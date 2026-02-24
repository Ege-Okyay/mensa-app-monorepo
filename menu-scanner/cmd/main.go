package main

import (
	"context"
	"fmt"
	"log"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/config"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/gemini"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/handlers"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/middleware"
	"github.com/gofiber/fiber/v2"
)

func main() {
	if err := run(); err != nil {
		log.Fatalf("Application error: %v", err)
	}
}

func run() error {
	ctx := context.Background()

	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Config error: %v", err)
	}

	analyzer, err := initGeminiAnalyzer(ctx, *cfg)
	if err != nil {
		return err
	}

	app := fiber.New()
	app.Use(middleware.Logger())

	app.Get("/scrape", handlers.ScrapeAndAnalyze(analyzer, ctx))
	// app.Get("/test", func(c *fiber.Ctx) error {
	// 	bytes, _ := os.ReadFile("test.jpg")

	// 	resp, err := analyzer.Process(ctx, bytes)
	// 	if err != nil {
	// 		fmt.Println(err)
	// 		return c.SendStatus(fiber.StatusInternalServerError)
	// 	}

	// 	return c.JSON(resp)
	// })

	return app.Listen(":3000")
}

func initGeminiAnalyzer(ctx context.Context, cfg config.AppConfig) (*gemini.ImageAnalyzer, error) {
	geminiClient, err := gemini.NewGeminiClient(ctx, cfg.GeminiAPIKey)
	if err != nil {
		return nil, fmt.Errorf("gemini init error: %w", err)
	}

	analyzer := gemini.NewImageAnalyzer(geminiClient.Client, cfg.FixedPrompt)

	return analyzer, nil
}
