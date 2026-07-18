# menu-scraper — AI Agent Context

## Project Overview

Go service (Go 1.25, module `github.com/Ege-Okyay/mensa-app-monorepo`) that scrapes EDISU Piemonte cafeteria menus from Instagram stories via a third-party API, analyzes images with Google Gemini AI, and syncs structured menu data (dishes, allergens, translations) to an API.

## Architecture

```
cmd/main.go              — entry point (production sync or dev server)
internal/
  config/                — env-based config loading (.env file)
  httpclient/            — HTTP client with anti-bot headers, gzip support
  logic/
    scraper.go           — fetch stories + decode image URLs
    processor.go         — resize images before Gemini analysis
  models/                — domain types (MenuResponse, MenuItem, etc.)
  engine/                — orchestration: fetch → analyze → collect
  gemini/
    client.go            — Gemini API client init
    service.go           — ImageAnalyzer.Process() sends bytes + prompt
    schema.go            — structured output schema for Gemini
  handlers/              — Fiber HTTP handlers
  middleware/
    auth.go              — X-Internal-Key header check
    logger.go            — request logging
    rate_limit.go        — rate limiter (unused)
  sync/                  — POST results to API
```

### How story fetching works (`logic/scraper.go`)
1. `FetchStories` → `httpclient.Fetch(url, true)` — uses story-specific headers
2. JSON parse: `{status, html}`
3. goquery: `.load img` → extracts `src` (naturally skips video stories)
4. `decodeImageURL()` — extracts `media` query param from `media.php?media=<encoded-url>` and URL-decodes it to get the raw Instagram CDN URL

### HTTP Headers (`httpclient/client.go`)
- `GetHeaders(url)` — generic headers, Referer = `baseUrl` from parsed URL
- `Fetch(client, url, isStoryRequest bool)` — when `true`, adds `Content-Type` + `TE: trailers`
- Story requests use `true`, image downloads use `false`

## Configuration (`.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Dev server port |
| `SYNC_API_KEY` | Auth key for sync endpoint |
| `SYNC_API_URL` | Base URL for sync API |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Gemini model name |
| `GEMINI_PROMPT_FILE_NAME` | Prompt file in `prompts/` dir |
| `MAX_CONCURRENCY` | Max concurrent Gemini analyses |
| `REQUEST_DELAY_MS` | Random jitter delay between requests |
| `IG_STORY_API_URL` | Third-party Instagram story viewer API URL |

## Running

```bash
# Dev server (listens on PORT)
go run cmd/main.go

# Production sync (one-shot, used in GitHub Actions)
GO_ENV=production go run cmd/main.go

# From repo root via bun
bun run sync:local
bun run sync:prod
```

## Dependencies (key)

- `github.com/PuerkitoBio/goquery` — HTML parsing for story API response
- `github.com/gofiber/fiber/v2` — HTTP server
- `github.com/disintegration/imaging` — image resize
- `google.golang.org/genai` — Gemini AI SDK
- `github.com/joho/godotenv` — .env loading
