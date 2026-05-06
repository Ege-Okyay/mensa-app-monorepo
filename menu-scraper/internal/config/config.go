package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	StoryAPIUrl    string
	GeminiAPIKey   string
	GeminiModel    string
	FixedPrompt    string
	Port           string
	InternalAPIKey string
	RateLimit      int
	SyncAPIUrl     string
}

func LoadConfig() (*AppConfig, error) {
	_ = godotenv.Load()

	promptDir := fmt.Sprintf("prompts/%s", os.Getenv("GEMINI_PROMPT_FILE_NAME"))
	prompt, err := os.ReadFile(promptDir)
	if err != nil {
		return nil, fmt.Errorf("failed to read prompt file: %w", err)
	}

	limit, _ := strconv.Atoi(os.Getenv("RATE_LIMIT"))

	return &AppConfig{
		StoryAPIUrl:    os.Getenv("IG_STORY_API_URL"),
		GeminiAPIKey:   os.Getenv("GEMINI_API_KEY"),
		GeminiModel:    os.Getenv("GEMINI_MODEL"),
		FixedPrompt:    string(prompt),
		Port:           os.Getenv("PORT"),
		InternalAPIKey: os.Getenv("INTERNAL_API_KEY"),
		RateLimit:      limit,
		SyncAPIUrl:     os.Getenv("SYNC_API_URL"),
	}, nil
}
