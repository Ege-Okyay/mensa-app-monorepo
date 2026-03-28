package main

import (
	"context"
	"fmt"
	"log"
	"os"

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

	fmt.Println("--- Application Configuration ---")
	fmt.Printf("Gemini Model: %s\n", cfg.GeminiModel)
	fmt.Printf("Prompt File:  prompts/%s\n", os.Getenv("GEMINI_PROMPT_FILE_NAME"))
	fmt.Printf("Running on port: %s\n", cfg.Port)
	fmt.Println("---------------------------------")

	analyzer, err := initGeminiAnalyzer(ctx, *cfg)
	if err != nil {
		return err
	}

	app := fiber.New()

	app.Use(middleware.Logger())
	app.Use(middleware.Auth(cfg.InternalAPIKey))

	app.Get("/scrape", handlers.ScrapeAndAnalyze(analyzer, ctx))
	app.Get("/test", handlers.TestAnalyze(analyzer, ctx))

	portStr := fmt.Sprintf(":%s", cfg.Port)
	return app.Listen(portStr)
}

func initGeminiAnalyzer(ctx context.Context, cfg config.AppConfig) (*gemini.ImageAnalyzer, error) {
	geminiClient, err := gemini.NewGeminiClient(ctx, cfg.GeminiAPIKey, cfg.GeminiModel)
	if err != nil {
		return nil, fmt.Errorf("gemini init error: %w", err)
	}

	analyzer := gemini.NewImageAnalyzer(geminiClient, cfg.FixedPrompt)

	return analyzer, nil
}
