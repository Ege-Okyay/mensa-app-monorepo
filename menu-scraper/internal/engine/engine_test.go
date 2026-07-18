package engine

import (
	"context"
	"testing"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/models"
	"google.golang.org/genai"
)

type mockAnalyzer struct {
	callCount int
}

func (m *mockAnalyzer) Process(_ context.Context, _ []byte, _ string) (*models.MenuResponse, error) {
	m.callCount++

	if m.callCount == 1 {
		return nil, &genai.APIError{
			Code:    429,
			Message: "You exceeded your current quota, please check your plan and billing details.",
			Status:  "RESOURCE_EXHAUSTED",
		}
	}

	return &models.MenuResponse{IsMenu: true, MensaName: "test"}, nil
}

func TestAnalyze_SuccessAfterRetry(t *testing.T) {
	e := &ScraperEngine{Analyzer: &mockAnalyzer{}}
	resp, err := e.analyzeWithRetry(context.Background(), "test", nil, "image/jpeg", 5)
	if err != nil {
		t.Fatalf("expected success, got: %v", err)
	}

	if resp.MensaName != "test" {
		t.Fatalf("expected mensa_name=test, got %s", resp.MensaName)
	}
}

func TestIsRateLimitError_True(t *testing.T) {
	if !isRateLimitError(&genai.APIError{Code: 429}) {
		t.Fatal("expected true for for genai.APIError with code 429")
	}

	if !isRateLimitError(&genai.APIError{Code: 430, Status: "RESOURCE_EXHAUSTED"}) {
		t.Fatal("expected true for RESOURCE_EXHAUSTED")
	}
}

func TestIsRateLimitError_False(t *testing.T) {
	if isRateLimitError(&genai.APIError{Code: 400}) {
		t.Fatal("expected false for code 400")
	}

	if isRateLimitError(&genai.APIError{Code: 500}) {
		t.Fatal("expected false for code 500")
	}
}
