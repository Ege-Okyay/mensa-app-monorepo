package httpclient

import (
	"net/http"
	"time"
)

func New() *http.Client {
	return &http.Client{
		Timeout: 15 * time.Second,
	}
}

func DefaultHeaders() map[string]string {
	return map[string]string{
		"User-Agent":      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0",
		"Accept":          "*/*",
		"Accept-Language": "en-US,en;q=0.9",
		"Referer":         "https://view-ig.com/",
	}
}
