package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

func ScrapeData() (map[string]interface{}, error) {
	url := "https://view-ig.com/content.php?url=edisu_piemonte&method=allstories"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("Failed to create request: %v", err)
	}

	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0")
	req.Header.Set("Accept", "*/*")
	req.Header.Set("Accept-Language", "en-US,en;q=0.9")
	req.Header.Set("Referer", "https://view-ig.com/")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("Failed to fetch URL: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("Failed to read response body: %v", err)
	}

	var jsonResp map[string]interface{}
	if err := json.Unmarshal(body, &jsonResp); err != nil {
		return nil, fmt.Errorf("Failed to parse JSON: %v", err)
	}

	return jsonResp, nil
}

func GetImageLinks(jsonResp map[string]interface{}) ([]string, error) {
	htmlContent, ok := jsonResp["html"].(string)
	if !ok {
		return nil, fmt.Errorf("JSON does not contain 'html' field")
	}

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(htmlContent))
	if err != nil {
		return nil, fmt.Errorf("Failed to parse HTLM: %v", err)
	}

	var imgs []string
	doc.Find("img").Each(func(i int, s *goquery.Selection) {
		if src, exists := s.Attr("src"); exists {
			imgs = append(imgs, src)
		}
	})

	return imgs, nil
}
