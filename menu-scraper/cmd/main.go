package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/config"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/engine"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/gemini"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/handlers"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/middleware"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/sync"
	"github.com/gofiber/fiber/v2"
)

func main() {
	if err := run(); err != nil {
		log.Fatalf("Fatal: %v", err)
	}
}

func run() error {
	ctx := context.Background()
	cfg, err := config.LoadConfig()
	if err != nil {
		return err
	}

	analyzer, err := initGeminiAnalyzer(ctx, *cfg)
	if err != nil {
		return err
	}

	scraperEngine := engine.NewScraperEngine(analyzer)

	// Production mode | Github Actions
	if os.Getenv("GO_ENV") == "production" {
		fmt.Println(">>> Starting Production Sync...")

		results, err := scraperEngine.Run(ctx, cfg.StoryAPIUrl)
		if err != nil {
			return err
		}

		syncClient := sync.NewSyncClient(cfg.SyncAPIUrl, cfg.SyncAPIKey)

		return syncClient.PushResults(results)
	}

	// Server mode | Local development
	fmt.Printf(">>> Starting Dev Server on Port %s\n", cfg.Port)

	fmt.Println("--- Application Configuration ---")
	fmt.Printf("Gemini Model: %s\n", cfg.GeminiModel)
	fmt.Printf("Prompt File:  prompts/%s\n", os.Getenv("GEMINI_PROMPT_FILE_NAME"))
	fmt.Println("---------------------------------")

	app := fiber.New()

	app.Use(middleware.Logger())
	app.Use(middleware.Auth(cfg.SyncAPIKey))

	app.Post("/scrape", handlers.ScrapeAndAnalyze(scraperEngine, cfg.StoryAPIUrl))
	app.Post("/test", handlers.TestAnalyze(scraperEngine))

	return app.Listen(":" + cfg.Port)
}

func initGeminiAnalyzer(ctx context.Context, cfg config.AppConfig) (*gemini.ImageAnalyzer, error) {
	geminiClient, err := gemini.NewGeminiClient(ctx, cfg.GeminiAPIKey, cfg.GeminiModel)
	if err != nil {
		return nil, fmt.Errorf("gemini init error: %w", err)
	}

	analyzer := gemini.NewImageAnalyzer(geminiClient, cfg.FixedPrompt)

	return analyzer, nil
}
