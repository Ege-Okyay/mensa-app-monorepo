package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	StoryAPIUrl    string
	GeminiAPIKey   string
	GeminiModel    string
	FixedPrompt    string
	Port           string
	InternalAPIKey string
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

	return &AppConfig{
		StoryAPIUrl:    os.Getenv("IG_STORY_API_URL"),
		GeminiAPIKey:   os.Getenv("GEMINI_API_KEY"),
		GeminiModel:    os.Getenv("GEMINI_MODEL"),
		FixedPrompt:    string(prompt),
		Port:           os.Getenv("PORT"),
		InternalAPIKey: os.Getenv("INTERNAL_API_KEY"),
	}, nil
}
