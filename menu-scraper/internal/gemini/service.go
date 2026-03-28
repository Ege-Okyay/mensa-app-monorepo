package gemini

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/models"
	"google.golang.org/genai"
)

type ImageAnalyzer struct {
	client *genai.Client
	model  string
	prompt string
}

func NewImageAnalyzer(client *GeminiClient, prompt string) *ImageAnalyzer {
	return &ImageAnalyzer{
		client: client.Client,
		model:  client.Model,
		prompt: prompt,
	}
}

func (ia *ImageAnalyzer) Process(ctx context.Context, bytes []byte, mimeType string) (*models.MenuResponse, error) {
	config := &genai.GenerateContentConfig{
		ResponseMIMEType:   "application/json",
		ResponseJsonSchema: GetMenuResponseSchema(),
	}

	parts := []*genai.Part{
		genai.NewPartFromBytes(bytes, mimeType),
		genai.NewPartFromText(ia.prompt),
	}

	contents := []*genai.Content{
		genai.NewContentFromParts(parts, genai.RoleUser),
	}

	result, err := ia.client.Models.GenerateContent(ctx, ia.model, contents, config)
	if err != nil {
		return nil, err
	}

	var data models.MenuResponse

	err = json.Unmarshal([]byte(result.Text()), &data)
	if err != nil {
		return nil, fmt.Errorf("failed to parse AI response: %w", err)
	}

	return &data, nil
}
