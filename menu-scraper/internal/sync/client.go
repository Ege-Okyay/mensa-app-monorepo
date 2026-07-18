package sync

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/models"
)

type SyncClient struct {
	APIUrl     string
	APIKey     string
	HTTPClient *http.Client
}

func NewSyncClient(apiUrl, apiKey string) *SyncClient {
	return &SyncClient{
		APIUrl:     apiUrl,
		APIKey:     apiKey,
		HTTPClient: &http.Client{Timeout: 30 * time.Second},
	}
}

func (s *SyncClient) PushResults(results []*models.MenuResponse) error {
	if s.APIUrl == "" {
		return fmt.Errorf("sync API URL is missing")
	}

	jsonData, err := json.Marshal(results)
	if err != nil {
		return fmt.Errorf("json marshal: %w", err)
	}

	fullAPIUrl := fmt.Sprintf("%s/mensa/sync", s.APIUrl)

	req, err := http.NewRequest("POST", fullAPIUrl, bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Internal-Key", s.APIKey)

	resp, err := s.HTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("API rejected sync: %s", resp.Status)
	}

	log.Println(">>> Sync Successfull")

	return nil
}
