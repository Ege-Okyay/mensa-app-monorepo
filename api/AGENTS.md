# api — AI Agent Context

## Project Overview

Hono + TypeScript API running on Cloudflare Workers. Serves EDISU Piemonte mensa menus with KV caching, handles push notification subscriptions, and receives scraped menu data from GitHub Actions via internal auth.

## Architecture

```
src/
  index.ts              — entry point, exports Hono app
  app.ts                — app setup: CORS, rate limiting, routes, error handling
  core/
    config.ts           — Zod-validated env schema (Supabase, VAPID, KV, rate limiters)
    supabase.ts         — Supabase client factory
    errors.ts           — Typed HTTPException wrapper with error codes
    response.ts         — Standardized success/error response helpers
  models/
    mensa.ts            — Zod schemas + types for menus (i18n: it/en/tr, allergens, dietary)
    push.ts             — Push subscription + notification payload types
    database.types.ts   — Generated Supabase types
  routes/
    mensa.routes.ts     — /mensa/* — public GET, internal POST (sync/clear) with X-Internal-Key
    push.routes.ts      — /push/* — subscribe/unsubscribe with dedicated rate limiter
  controllers/
    mensa.controller.ts — Handlers: list, get-by-slug, sync, clear, debug-mock-sync
    push.controller.ts  — Handlers: subscribe, unsubscribe
  services/
    mensa.service.ts    — KV-cached DB queries, upsert menus, cache invalidation
    push.service.ts     — Save/delete subscriptions, broadcast localized notifications
    scan.service.ts     — Matches scraped menus → DB mensas by name, applies sync
```

### Key Flows

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `GET /mensa` | Public (rate limited) | List all mensas (cached 24h) |
| `GET /mensa/:slug` | Public (rate limited) | Single mensa + current menu (cached 24h) |
| `POST /mensa/sync` | `X-Internal-Key` (scraper) | Upsert menus from GitHub Actions scraper |
| `POST /mensa/clear` | `X-Internal-Key` (scraper) | Clear all menus + cache |
| `POST /push/subscribe` | Rate limited (3/min) | Save push subscription with locale |
| `POST /push/unsubscribe` | Rate limited (3/min) | Remove subscription |

## Configuration (`.dev.vars` + Cloudflare secrets)

| Variable | Description |
|----------|-------------|
| `PORT` | Dev server port (default 8787) |
| `SCRAPER_KEY` | Internal auth key for `/mensa/sync` and `/mensa/clear` |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/service key |
| `VAPID_PUBLIC_KEY` | VAPID public key for push |
| `VAPID_PRIVATE_KEY` | VAPID private key for push |
| `VAPID_SUBJECT` | VAPID subject (mailto: or URL) |
| `MENSA_APP_CACHE` | KV namespace binding (Cloudflare) |
| `GENERAL_RATE_LIMITER` | Rate limiter binding (30 req/min) |
| `PUSH_RATE_LIMITER` | Rate limiter binding (3 req/min) |

## Running

```bash
# Dev (uses .dev.vars)
bun run dev

# Deploy to Cloudflare Workers
bun run deploy

# Generate Cloudflare types
bun run cf-typegen

# Type-check
bun run typecheck   # or: tsc --noEmit

# Test
bun test
```

## Dependencies (key)

- `hono` — Web framework
- `@hono/zod-validator` — Zod validation middleware
- `@supabase/supabase-js` — Supabase client
- `@mmmike/web-push` — Web Push protocol (VAPID)
- `zod` — Schema validation
- `hono-rate-limiter` — Rate limiting with Cloudflare bindings
- `@cloudflare/workers-types` — Worker type definitions
- `wrangler` — Cloudflare CLI