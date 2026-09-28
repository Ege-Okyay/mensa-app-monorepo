package sync

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
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

	started := time.Now()
	resp, err := s.HTTPClient.Do(req)
	elapsed := time.Since(started)

	if err != nil {
		log.Printf("response: request failed after %dms (%v)", elapsed.Milliseconds(), err)
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		if body, readErr := io.ReadAll(resp.Body); readErr == nil {
			log.Printf("body: %s", string(body))
		}

		log.Printf("response: %s (%dms)", resp.Status, elapsed.Milliseconds())

		return fmt.Errorf("API rejected sync: %s", resp.Status)
	}

	log.Printf("response: %s (%dms)", resp.Status, elapsed.Milliseconds())

	log.Println(">>> Sync Successfull")

	return nil
}
