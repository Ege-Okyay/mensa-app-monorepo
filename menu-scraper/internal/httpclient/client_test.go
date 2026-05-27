package httpclient

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRandomUserAgent(t *testing.T) {
	agents := make(map[string]bool)
	for i := 0; i < 20; i++ {
		agents[RandomUserAgent()] = true
	}
}

func TestFetchSendsCorrectHeaders(t *testing.T) {
	var capturedHeaders http.Header

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		capturedHeaders = r.Header
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	}))
	defer server.Close()

	client := New()
	_, err := Fetch(client, server.URL)
	if err != nil {
		t.Fatalf("Fetch failed: %v", err)
	}

	essentialHeaders := []string{
		"User-Agent",
		"Accept",
		"Accept-Language",
		"Accept-Encoding",
		"Sec-Fetch-Dest",
		"X-Href",
		"x-source-domain",
		"Referer",
	}

	for _, h := range essentialHeaders {
		if capturedHeaders.Get(h) == "" {
			t.Errorf("Header %s was missing frmo the request", h)
		}
	}

	ua := capturedHeaders.Get("User-Agent")
	if ua == "" {
		t.Error("User-Agent is empty")
	}
}

func TestFetchErrorHandling(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusForbidden)
	}))
	defer server.Close()

	client := New()
	_, err := Fetch(client, server.URL)

	if err == nil {
		t.Error("Expected an error for 403 Forbidden, but got nil")
	}
}
