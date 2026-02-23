package gemini

import (
	"context"

	"google.golang.org/genai"
)

type GeminiClient struct {
	Client *genai.Client
	Model  string
}

func NewGeminiClient(ctx context.Context, apiKey string) (*GeminiClient, error) {
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		return nil, err
	}

	return &GeminiClient{
		Client: client,
		Model:  "gemini-2.5-flash",
	}, nil
}
