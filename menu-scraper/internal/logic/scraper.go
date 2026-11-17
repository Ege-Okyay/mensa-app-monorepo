package logic

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/httpclient"
)

const (
	instagramUsername = "edisupiemonte"
	apifyWaitSeconds  = 300
)

type apifyInput struct {
	CompactOutput        bool     `json:"compactOutput"`
	ExpandHighlightItems bool     `json:"expandHighlightItems"`
	IncludeHighlights    bool     `json:"includeHighlights"`
	IncludeStories       bool     `json:"includeStories"`
	Usernames            []string `json:"usernames"`
}

type apifyStory struct {
	MediaType string `json:"mediaType"`
	ImageURL  string `json:"imageUrl"`
}

type apifyProfile struct {
	Username string       `json:"username"`
	Status   string       `json:"status"`
	Stories  []apifyStory `json:"stories"`
}

type apifyRun struct {
	Data struct {
		Status           string `json:"status"`
		DefaultDatasetID string `json:"defaultDatasetId"`
	} `json:"data"`
}

// FetchStories runs the Apify Instagram stories actor and returns image story URLs.
func FetchStories(storyAPIURL string) ([]string, error) {
	client := &http.Client{Timeout: 5 * time.Minute}

	payload, err := json.Marshal(apifyInput{
		IncludeStories: true,
		Usernames:      []string{instagramUsername},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to encode apify input: %w", err)
	}

	runURL, err := withWaitForFinish(storyAPIURL, apifyWaitSeconds)
	if err != nil {
		return nil, fmt.Errorf("invalid story API URL: %w", err)
	}

	body, err := postJSON(client, runURL, payload)
	if err != nil {
		return nil, err
	}

	profiles, err := decodeProfiles(client, storyAPIURL, body)
	if err != nil {
		return nil, err
	}

	var imageUrls []string
	for _, profile := range profiles {
		if profile.Status != "" && profile.Status != "ok" {
			log.Printf("Apify: skipping %s (status: %s)", profile.Username, profile.Status)
			continue
		}

		for _, story := range profile.Stories {
			if story.MediaType == "image" && story.ImageURL != "" {
				imageUrls = append(imageUrls, story.ImageURL)
			}
		}
	}

	if len(imageUrls) == 0 {
		return nil, fmt.Errorf("no image stories found")
	}

	return imageUrls, nil
}

func FetchImage(client *http.Client, url string) ([]byte, error) {
	return httpclient.Fetch(client, url, false)
}

func postJSON(client *http.Client, rawURL string, payload []byte) ([]byte, error) {
	req, err := http.NewRequest(http.MethodPost, rawURL, bytes.NewReader(payload))
	if err != nil {
		return nil, fmt.Errorf("failed to create apify request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("apify request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read apify response: %w", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("apify returned status %d: %s", resp.StatusCode, strings.TrimSpace(string(body)))
	}

	return body, nil
}

func decodeProfiles(client *http.Client, rawURL string, body []byte) ([]apifyProfile, error) {
	trimmed := bytes.TrimSpace(body)
	if len(trimmed) == 0 {
		return nil, fmt.Errorf("apify returned an empty response")
	}

	if trimmed[0] == '[' {
		var profiles []apifyProfile
		if err := json.Unmarshal(trimmed, &profiles); err != nil {
			return nil, fmt.Errorf("failed to decode apify items: %w", err)
		}
		return profiles, nil
	}

	var run apifyRun
	if err := json.Unmarshal(trimmed, &run); err != nil {
		return nil, fmt.Errorf("failed to decode apify run: %w", err)
	}

	if run.Data.Status != "SUCCEEDED" {
		return nil, fmt.Errorf("apify run finished with status: %s", run.Data.Status)
	}

	if run.Data.DefaultDatasetID == "" {
		return nil, fmt.Errorf("apify run has no dataset")
	}

	itemsURL, err := datasetItemsURL(rawURL, run.Data.DefaultDatasetID)
	if err != nil {
		return nil, err
	}

	resp, err := client.Get(itemsURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch apify dataset: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("apify dataset returned status %d: %s", resp.StatusCode, strings.TrimSpace(string(body)))
	}

	var profiles []apifyProfile
	if err := json.NewDecoder(resp.Body).Decode(&profiles); err != nil {
		return nil, fmt.Errorf("failed to decode apify dataset: %w", err)
	}

	return profiles, nil
}

func datasetItemsURL(rawURL, datasetID string) (string, error) {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return "", fmt.Errorf("invalid story API URL: %w", err)
	}

	items := &url.URL{
		Scheme: parsed.Scheme,
		Host:   parsed.Host,
		Path:   "/v2/datasets/" + datasetID + "/items",
	}

	if token := parsed.Query().Get("token"); token != "" {
		query := items.Query()
		query.Set("token", token)
		items.RawQuery = query.Encode()
	}

	return items.String(), nil
}

func withWaitForFinish(rawURL string, seconds int) (string, error) {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return "", err
	}

	query := parsed.Query()
	if query.Get("waitForFinish") == "" {
		query.Set("waitForFinish", strconv.Itoa(seconds))
	}
	parsed.RawQuery = query.Encode()

	return parsed.String(), nil
}
