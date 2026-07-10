package logic

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/httpclient"
	"github.com/PuerkitoBio/goquery"
)

type storyResponse struct {
	Status string `json:"status"`
	HTML   string `json:"html"`
}

// Calls the third party API and returns a list of images
func FetchStories(client *http.Client, url string) ([]string, error) {
	body, err := httpclient.Fetch(client, url, true)
	if err != nil {
		return nil, err
	}

	var resp storyResponse
	if err := json.Unmarshal(body, &resp); err != nil {
		return nil, fmt.Errorf("failed to decode story response: %w", err)
	}

	if resp.Status != "ok" {
		return nil, fmt.Errorf("API returned status: %s", resp.Status)
	}

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(resp.HTML))
	if err != nil {
		return nil, fmt.Errorf("failed to parse story HTML: %w", err)
	}

	var imageUrls []string
	doc.Find(".load img").Each(func(i int, s *goquery.Selection) {
		src, exists := s.Attr("src")
		if exists && src != "" {
			if decoded := decodeImageURL(src); decoded != "" {
				imageUrls = append(imageUrls, decoded)
			}
		}
	})

	if len(imageUrls) == 0 {
		return nil, fmt.Errorf("no image stories found")
	}

	return imageUrls, nil
}

func FetchImage(client *http.Client, url string) ([]byte, error) {
	return httpclient.Fetch(client, url, false)
}

func decodeImageURL(rawURL string) string {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return ""
	}

	media := parsed.Query().Get("media")
	if media == "" {
		return rawURL
	}

	decoded, err := url.QueryUnescape(media)
	if err != nil || decoded == "" {
		return rawURL
	}

	return decoded
}
