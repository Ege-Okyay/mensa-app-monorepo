package engine

import (
	"path/filepath"
	"testing"
)

func TestCache_Roundtrip(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "cache.json")

	cache := LoadCache(path)
	if len(cache.Hashes) != 0 {
		t.Fatal("expected empty cache")
	}

	cache.MarkProcessed("https://example.com/img1.jpg")
	cache.MarkProcessed("https://example.com/img2.jpg")
	cache.Save()

	cache2 := LoadCache(path)
	if len(cache2.Hashes) != 2 {
		t.Fatal("expected 2 items")
	}

	if !cache2.IsProcessed("https://example.com/img1.jpg") {
		t.Fatal("expected img1 to be processed")
	}
	if !cache2.IsProcessed("https://example.com/img2.jpg") {
		t.Fatal("expected img2 to be processed")
	}
}

func TestCache_LoadMissingFile(t *testing.T) {
	dir := t.TempDir()
	cache := LoadCache(filepath.Join(dir, "nonexistent.json"))

	if len(cache.Hashes) != 0 {
		t.Fatal("expected empty cache for missing file")
	}
}

func TestCache_NotProcessed(t *testing.T) {
	dir := t.TempDir()
	cache := LoadCache(filepath.Join(dir, "cache.json"))

	if cache.IsProcessed("https://example.com/new.jpg") {
		t.Fatal("expected new URL to not be processed")
	}
}

func TestCache_IgnoreQueryParams(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "cache.json")

	cache := LoadCache(path)
	baseURL := "https://scontent.cdninstagram.com/v/t51.29350-15/img.jpg"
	urlWithParams := baseURL + "?oh=abc&oe=def&_nc_ht=cdn"
	urlDifferentParams := baseURL + "?oh=xyz&oe=999&_nc_ht=other"

	cache.MarkProcessed(urlWithParams)

	if !cache.IsProcessed(urlDifferentParams) {
		t.Fatal("expected URL with different query params to match cached entry")
	}

	otherImg := "https://scontent.cdninstagram.com/v/t51.29350-15/other.jpg"

	if cache.IsProcessed(otherImg) {
		t.Fatal("expected different path to not match")
	}
}

func TestCache_LocalFilePaths(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "cache.json")

	cache := LoadCache(path)
	cache.MarkProcessed("images/monday.jpg")

	if !cache.IsProcessed("images/monday.jpg") {
		t.Fatal("expected local file path to match")
	}

	if cache.IsProcessed("images/tuesday.jpg") {
		t.Fatal("expected different local file path to not match")
	}
}
