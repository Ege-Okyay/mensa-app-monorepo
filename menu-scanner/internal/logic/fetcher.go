package logic

import (
	"fmt"
	"io"
	"net/http"
)

// FetchImage fetches the image from given URL and returns the raw bytes and MIME type
func FetchImage(url string) ([]byte, string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, "", fmt.Errorf("network error: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, "", fmt.Errorf("server returned %d", resp.StatusCode)
	}

	contentType := resp.Header.Get("Content-Type")

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, "", err
	}

	return data, contentType, nil
}
