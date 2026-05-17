package config

import (
	"fmt"
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
	MaxConcurrency int
	RequestDelayMs int

	// Other
	StoryAPIUrl  string
	IsProduction bool
}

func LoadConfig() (*AppConfig, error) {
	_ = godotenv.Load()

	isProd := os.Getenv("GO_ENV") == "production"

	promptDir := fmt.Sprintf("prompts/%s", os.Getenv("GEMINI_PROMPT_FILE_NAME"))
	prompt, err := os.ReadFile(promptDir)
	if err != nil {
		return nil, fmt.Errorf("failed to read prompt file: %w", err)
	}

	maxConcurrency, _ := strconv.Atoi(os.Getenv("MAX_CONCURRENCY"))
	requestDelay, _ := strconv.Atoi(os.Getenv("REQUEST_DELAY_MS"))

	return &AppConfig{
		Port:           os.Getenv("PORT"),
		SyncAPIKey:     os.Getenv("SYNC_API_KEY"),
		SyncAPIUrl:     os.Getenv("SYNC_API_URL"),
		GeminiAPIKey:   os.Getenv("GEMINI_API_KEY"),
		GeminiModel:    os.Getenv("GEMINI_MODEL"),
		FixedPrompt:    string(prompt),
		MaxConcurrency: maxConcurrency,
		RequestDelayMs: requestDelay,
		StoryAPIUrl:    os.Getenv("IG_STORY_API_URL"),
		IsProduction:   isProd,
	}, nil
}
