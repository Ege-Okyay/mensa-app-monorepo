package gemini

import (
	"context"
	"encoding/json"
	"fmt"

	"google.golang.org/genai"
)

type ImageAnalyzer struct {
	client *genai.Client
	model  string
	prompt string
}

type LanguageGroup struct {
	IT []string `json:"it"`
	EN []string `json:"en"`
	TR []string `json:"tr"`
}

type MenuResponse struct {
	FirstCourses         LanguageGroup `json:"first_courses"`
	MainCourses          LanguageGroup `json:"main_courses"`
	SideDishes           LanguageGroup `json:"side_dishes"`
	SpecialtiesAvailable bool          `json:"specialties_available"`
}

func NewImageAnalyzer(client *genai.Client, prompt string) *ImageAnalyzer {
	return &ImageAnalyzer{
		client: client,
		model:  "gemini-2.5-flash-lite",
		prompt: prompt,
	}
}

func (ia *ImageAnalyzer) ProcessDebug(ctx context.Context, bytes []byte) (*MenuResponse, error) {
	config := &genai.GenerateContentConfig{
		ResponseMIMEType: "application/json",
		ResponseJsonSchema: &genai.Schema{
			Type: genai.TypeObject,
			Properties: map[string]*genai.Schema{
				"first_courses": {
					Type:        genai.TypeObject,
					Title:       "FirstCourses",
					Description: "List of first courses in different languages.",
					Properties: map[string]*genai.Schema{
						"it": {
							Type:  genai.TypeArray,
							Items: &genai.Schema{Type: genai.TypeString},
						},
						"en": {
							Type:        genai.TypeArray,
							Items:       &genai.Schema{Type: genai.TypeString},
							Description: "English translation describing the ingredients and cooking style. Do not keep Italian names.",
						},
						"tr": {
							Type:    genai.TypeArray,
							Items:   &genai.Schema{Type: genai.TypeString},
							Default: "Turkish translation using local culinary terms (e.g., 'sebzeli', 'soslu').",
						},
					},
					Required: []string{"en", "it", "tr"},
				},
				"main_courses": {
					Type:        genai.TypeObject,
					Title:       "MainCourses",
					Description: "List of main courses in different languages.",
					Properties: map[string]*genai.Schema{
						"it": {
							Type:  genai.TypeArray,
							Items: &genai.Schema{Type: genai.TypeString},
						},
						"en": {
							Type:        genai.TypeArray,
							Items:       &genai.Schema{Type: genai.TypeString},
							Description: "English translation describing the ingredients and cooking style. Do not keep Italian names.",
						},
						"tr": {
							Type:    genai.TypeArray,
							Items:   &genai.Schema{Type: genai.TypeString},
							Default: "Turkish translation using local culinary terms (e.g., 'sebzeli', 'soslu').",
						},
					},
					Required: []string{"en", "it", "tr"},
				},
				"side_dishes": {
					Title:       "SideDishes",
					Description: "List of side dishses in different languages.",
					Type:        genai.TypeObject,
					Properties: map[string]*genai.Schema{
						"it": {
							Type:  genai.TypeArray,
							Items: &genai.Schema{Type: genai.TypeString},
						},
						"en": {
							Type:        genai.TypeArray,
							Items:       &genai.Schema{Type: genai.TypeString},
							Description: "English translation describing the ingredients and cooking style. Do not keep Italian names.",
						},
						"tr": {
							Type:    genai.TypeArray,
							Items:   &genai.Schema{Type: genai.TypeString},
							Default: "Turkish translation using local culinary terms (e.g., 'sebzeli', 'soslu').",
						},
					},
					Required: []string{"en", "it", "tr"},
				},
				"specialties_available": {
					Title:       "SpecialtiesAvailable",
					Description: "Wheter there are any specialties available",
					Type:        genai.TypeBoolean,
				},
			},
			Required: []string{"first_courses", "main_courses", "side_dishes", "specialties_available"},
		},
	}

	parts := []*genai.Part{
		genai.NewPartFromBytes(bytes, "image/jpeg"),
		genai.NewPartFromText(ia.prompt),
	}

	contents := []*genai.Content{
		genai.NewContentFromParts(parts, genai.RoleUser),
	}

	result, err := ia.client.Models.GenerateContent(ctx, ia.model, contents, config)
	if err != nil {
		return nil, err
	}

	var data MenuResponse

	err = json.Unmarshal([]byte(result.Text()), &data)
	if err != nil {
		return nil, fmt.Errorf("failed to parse AI response: %w", err)
	}

	return &data, nil
}
