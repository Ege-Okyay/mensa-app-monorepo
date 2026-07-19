package config

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	// Internal
	Port string

	// Sync
	SyncAPIUrl string
	SyncAPIKey string

	// Gemini
	GeminiAPIKey string
	GeminiModel  string
	FixedPrompt  string

	// Scraping
	MaxConcurrency           int
	RequestDelayMs           int
	RateLimitRetryDelay      int
	ProcessedImagesCachePath string

	// Other
	StoryAPIUrl  string
	IsProduction bool
}

func LoadConfig() (*AppConfig, error) {
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: no .env file found: %v", err)
	}

	isProd := os.Getenv("GO_ENV") == "production"

	promptDir := fmt.Sprintf("prompts/%s", getEnvString("GEMINI_PROMPT_FILE_NAME", "analysis_v5.txt"))
	prompt, err := os.ReadFile(promptDir)
	if err != nil {
		return nil, fmt.Errorf("failed to read prompt file: %w", err)
	}

	maxConcurrency := getEnvInt("MAX_CONCURRENCY", 3)
	requestDelay := getEnvInt("REQUEST_DELAY_MS", 1500)
	rateLimitRetryDelay := getEnvInt("RATE_LIMIT_RETRY_DELAY", 60)

	cfg := &AppConfig{
		Port:                getEnvString("PORT", "3001"),
		SyncAPIKey:          getEnvString("SYNC_API_KEY", ""),
		SyncAPIUrl:          getEnvString("SYNC_API_URL", ""),
		GeminiAPIKey:        getEnvString("GEMINI_API_KEY", ""),
		GeminiModel:         getEnvString("GEMINI_MODEL", "gemini-3.1-flash-lite"),
		FixedPrompt:         string(prompt),
		MaxConcurrency:      maxConcurrency,
		RequestDelayMs:      requestDelay,
		RateLimitRetryDelay: rateLimitRetryDelay,
		StoryAPIUrl:         getEnvString("STORY_API_URL", ""),
		IsProduction:        isProd,
	}

	if err := cfg.Validate(); err != nil {
		return nil, fmt.Errorf("config validation failed: %w", err)
	}

	return cfg, nil
}

func (c *AppConfig) Validate() error {
	if c.SyncAPIKey == "" {
		return fmt.Errorf("SYNC_API_KEY is required")
	}
	if c.SyncAPIUrl == "" {
		return fmt.Errorf("SYNC_API_URL is required")
	}
	if c.GeminiAPIKey == "" {
		return fmt.Errorf("GEMINI_API_KEY is required")
	}
	if c.StoryAPIUrl == "" {
		return fmt.Errorf("STORY_API_URL is required")
	}

	return nil
}

func getEnvInt(key string, defaultVal int) int {
	if val, err := strconv.Atoi(os.Getenv(key)); err == nil {
		return val
	}
	return defaultVal
}

func getEnvString(key string, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}
