package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	StoryAPIUrl  string
	GeminiAPIKey string
	FixedPrompt  string
}

func LoadConfig() (*AppConfig, error) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	prompt, err := os.ReadFile("prompts/analysis_v1.txt")
	if err != nil {
		return nil, err
	}

	return &AppConfig{
		StoryAPIUrl:  os.Getenv("IG_STORY_API_URL"),
		GeminiAPIKey: os.Getenv("GEMINI_API_KEY"),
		FixedPrompt:  string(prompt),
	}, nil
}
