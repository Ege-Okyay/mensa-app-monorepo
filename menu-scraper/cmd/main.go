package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
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

	analyzer, err := initGeminiAnalyzer(ctx, *cfg)
	if err != nil {
		return err
	}

	// Production mode | Github Actions
	if os.Getenv("GO_ENV") == "production" {
		fmt.Println("Starting scrape")
		return runOneShotSync(ctx, analyzer, cfg)
	}

	// Dev mode | HTTP Server
	fmt.Printf("Starting server mode on %s\n", cfg.Port)

	fmt.Println("--- Application Configuration ---")
	fmt.Printf("Gemini Model: %s\n", cfg.GeminiModel)
	fmt.Printf("Prompt File:  prompts/%s\n", os.Getenv("GEMINI_PROMPT_FILE_NAME"))
	fmt.Println("---------------------------------")

	app := fiber.New()

	app.Use(middleware.Logger())
	app.Use(middleware.Auth(cfg.InternalAPIKey))
	app.Use(middleware.RateLimiter(cfg.RateLimit))

	app.Get("/scrape", handlers.ScrapeAndAnalyze(ctx, analyzer, cfg))
	app.Get("/test", handlers.TestAnalyze(ctx, analyzer))

	portStr := fmt.Sprintf(":%s", cfg.Port)
	return app.Listen(portStr)
}

func runOneShotSync(ctx context.Context, analyzer *gemini.ImageAnalyzer, cfg *config.AppConfig) error {
	results, err := handlers.ScrapeAndProcess(ctx, analyzer, cfg.StoryAPIUrl)
	if err != nil {
		return fmt.Errorf("scrape failed: %w", err)
	}

	jsonData, err := json.Marshal(results)
	if err != nil {
		return fmt.Errorf("json marshal failed: %w", err)
	}

	req, err := http.NewRequest("POST", cfg.SyncAPIUrl, bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Internal-Key", cfg.InternalAPIKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to connect Hono API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("Hono API rejected sync with status: %s", resp.Status)
	}

	fmt.Println("Sync successfull")

	return nil
}

func initGeminiAnalyzer(ctx context.Context, cfg config.AppConfig) (*gemini.ImageAnalyzer, error) {
	geminiClient, err := gemini.NewGeminiClient(ctx, cfg.GeminiAPIKey, cfg.GeminiModel)
	if err != nil {
		return nil, fmt.Errorf("gemini init error: %w", err)
	}

	analyzer := gemini.NewImageAnalyzer(geminiClient, cfg.FixedPrompt)

	return analyzer, nil
}
