package config

import (
	"fmt"
	"log"
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
}

func LoadConfig() (*AppConfig, error) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	promptDir := fmt.Sprintf("prompts/%s", os.Getenv("GEMINI_PROMPT_FILE_NAME"))
	prompt, err := os.ReadFile(promptDir)
	if err != nil {
		return nil, err
	}

	limitStr := os.Getenv("RATE_LIMIT")
	limit, _ := strconv.Atoi(limitStr)

	return &AppConfig{
		StoryAPIUrl:    os.Getenv("IG_STORY_API_URL"),
		GeminiAPIKey:   os.Getenv("GEMINI_API_KEY"),
		GeminiModel:    os.Getenv("GEMINI_MODEL"),
		FixedPrompt:    string(prompt),
		Port:           os.Getenv("PORT"),
		InternalAPIKey: os.Getenv("INTERNAL_API_KEY"),
		RateLimit:      limit,
	}, nil
}
