package logic

import (
	"fmt"
	"io"
	"net/http"
)

// TODO: Detect mime type instead of hard coding it

// FetchImage fetches the image from given URL and returns the raw bytes and MIME type
func FetchImage(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("network error: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("server returned %d", resp.StatusCode)
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return data, nil
}
