package httpclient

import (
	"compress/gzip"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"net/url"
	"time"
)

func New() *http.Client {
	return &http.Client{
		Timeout: 60 * time.Second,
	}
}

func RandomUserAgent() string {
	agents := []string{
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
		"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1",
	}

	return agents[rand.Intn(len(agents))]
}

func GetHeaders(rawURL string) map[string]string {
	parsedURL, err := url.Parse(rawURL)
	if err != nil || parsedURL.Host == "" {
		return map[string]string{
			"User-Agent": RandomUserAgent(),
		}
	}

	domain := parsedURL.Host
	scheme := parsedURL.Scheme
	baseUrl := fmt.Sprintf("%s://%s/", scheme, domain)

	return map[string]string{
		"Host":                        domain,
		"User-Agent":                  RandomUserAgent(),
		"Accept":                      "application/json,text/plain,*/*,image/avif,image/webp,image/apng,*/*;q=0.8",
		"Accept-Language":             "en-US,en;q=0.9",
		"Accept-Encoding":             "gzip, deflate, br, zstd",
		"Referer":                     rawURL,
		"Access-Control-Allow-Origin": "*",
		"X-Href":                      baseUrl,
		"x-source-domain":             baseUrl,
		"Sec-GPC":                     "1",
		"Alt-Used":                    domain,
		"Connection":                  "keep-alive",
		"Sec-Fetch-Dest":              "empty",
		"Sec-Fetch-Mode":              "cors",
		"Sec-Fetch-Site":              "same-origin",
		"Priority":                    "u=0",
	}
}

func Fetch(client *http.Client, url string) ([]byte, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	for k, v := range GetHeaders(url) {
		req.Header.Set(k, v)
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("server returned status: %d", resp.StatusCode)
	}

	var reader io.ReadCloser
	switch resp.Header.Get("Content-Encoding") {
	case "gzip":
		reader, err = gzip.NewReader(resp.Body)
		if err != nil {
			return nil, fmt.Errorf("failed to create gzip reader: %w", err)
		}
		defer reader.Close()
	default:
		reader = resp.Body
	}

	return io.ReadAll(reader)
}
