package engine

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sync"
)

type ProcessedImagesCache struct {
	mu     sync.Mutex
	Hashes map[string]bool `json:"hashes"`
	path   string
}

func LoadCache(path string) *ProcessedImagesCache {
	cache := &ProcessedImagesCache{
		Hashes: make(map[string]bool),
		path:   path,
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return cache
	}

	if err := json.Unmarshal(data, cache); err != nil {
		log.Printf("Warning: corrupted cache, starting fresh: %v", err)

		return &ProcessedImagesCache{
			Hashes: make(map[string]bool),
			path:   path,
		}
	}

	return cache
}

func (c *ProcessedImagesCache) IsProcessed(source string) bool {
	c.mu.Lock()
	defer c.mu.Unlock()

	return c.Hashes[hashSource(source)]
}

func (c *ProcessedImagesCache) MarkProcessed(source string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.Hashes[hashSource(source)] = true
}

func (c *ProcessedImagesCache) Save() {
	c.mu.Lock()
	defer c.mu.Unlock()

	if err := os.MkdirAll(filepath.Dir(c.path), 0755); err != nil {
		log.Printf("Warning: failed to create cache dir: %v", err)
		return
	}

	data, err := json.Marshal(c)
	if err != nil {
		log.Printf("Warning: failed to marshal cache: %v", err)
		return
	}

	if err := os.WriteFile(c.path, data, 0644); err != nil {
		log.Printf("Warning: failed to write cache: %v", err)
	}
}

func hashSource(source string) string {
	return fmt.Sprintf("%x", sha256.Sum256([]byte(source)))
}
