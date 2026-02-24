package logic

import (
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

func ExtactImagesFromHTML(html string) ([]string, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return nil, fmt.Errorf("failed to parse HTML: %w", err)
	}

	var imgs []string
	doc.Find("img").Each(func(i int, s *goquery.Selection) {
		if src, exists := s.Attr("src"); exists {
			if err == nil {
				clean_src := cleanImgURL(src)
				if strings.HasPrefix(clean_src, "http") {
					imgs = append(imgs, clean_src)
				}
			}
		}
	})

	return imgs, nil
}

func FetchHTML(client *http.Client, url string, headers map[string]string) (string, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	for k, v := range headers {
		req.Header.Set(k, v)
	}

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

func cleanImgURL(src string) string {
	clean := strings.ReplaceAll(src, `\"`, "")
	clean = strings.Trim(clean, `\"`)
	clean = strings.ReplaceAll(clean, `\/`, "/")

	return clean
}
