package gemini

import (
	"context"

	"google.golang.org/genai"
)

type ImageAnalyzer struct {
	client *genai.Client
	model  string
	prompt string
}

func NewImageAnalyzer(client *genai.Client, prompt string) *ImageAnalyzer {
	return &ImageAnalyzer{
		client: client,
		model:  "gemini-2.0-flash",
		prompt: prompt,
	}
}

func (ia *ImageAnalyzer) Process(ctx context.Context, data []byte, mime string) (string, error) {
	parts := []*genai.Part{
		{Text: ia.prompt},
		{InlineData: &genai.Blob{MIMEType: mime, Data: data}},
	}

	result, err := ia.client.Models.GenerateContent(ctx, ia.model, []*genai.Content{{Parts: parts}}, nil)
	if err != nil {
		return "", err
	}

	return result.Candidates[0].Content.Parts[0].Text, nil
}
