package logic

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/httpclient"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/models"
)

// Calls the third party API and returns a list of images
func FetchStories(client *http.Client, url string) ([]string, error) {
	body, err := httpclient.Fetch(client, url)
	if err != nil {
		return nil, err
	}

	var response models.StoryResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, fmt.Errorf("failed to decode story JSON: %w", err)
	}

	if response.Code != 200 {
		return nil, fmt.Errorf("API returned code %d", response.Code)
	}

	var imageUrls []string
	for _, item := range response.Data.List {
		if item.IsVideo == 0 && item.DisplayURL != "" {
			imageUrls = append(imageUrls, item.DisplayURL)
		}
	}

	return imageUrls, nil
}

func FetchImage(client *http.Client, url string) ([]byte, error) {
	return httpclient.Fetch(client, url)
}
