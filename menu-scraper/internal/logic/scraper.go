package logic

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/httpclient"
	"github.com/PuerkitoBio/goquery"
)

// Parses HTML and returns a list of image URLs
func ExtractImagesFromHTML(html string) ([]string, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return nil, fmt.Errorf("failed to parse HTML: %w", err)
	}

	var imgs []string
	doc.Find("img").Each(func(i int, s *goquery.Selection) {
		if src, exists := s.Attr("src"); exists {
			clean_src := cleanImgURL(src)
			isGif := strings.HasSuffix(strings.ToLower(clean_src), ".gif")

			if strings.HasPrefix(clean_src, "http") && !isGif {
				imgs = append(imgs, clean_src)
			}
		}
	})

	return imgs, nil
}

// Fetches the HTML content of a URL as a string
func FetchHTML(client *http.Client, url string) (string, error) {
	body, err := httpclient.Fetch(client, url)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

func FetchImage(client *http.Client, url string) ([]byte, error) {
	return httpclient.Fetch(client, url)
}

func cleanImgURL(src string) string {
	clean := strings.ReplaceAll(src, `\"`, "")
	clean = strings.Trim(clean, `\"`)
	clean = strings.ReplaceAll(clean, `\/`, "/")

	return clean
}
