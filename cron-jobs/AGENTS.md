# cron-jobs — AI Agent Context

## Project Overview

Cloudflare Worker (`mensa-today-cron`) that dispatches GitHub Actions workflows via the `workflow_dispatch` REST API on a cron schedule. Written in TypeScript, run with Bun + Wrangler.

## Architecture

```
wrangler.jsonc          — Worker config: name, main, cron trigger(s), vars
src/
  index.ts              — scheduled() entry point; maps cron → workflows, dispatches
  mock-github.ts        — local Bun mock server (port 4000) for testing dispatch without GitHub
.dev.vars               — LOCAL-ONLY env (gitignored); overrides vars during `wrangler dev`
.dev.vars.sample        — template for .dev.vars
```

### How dispatch works (`src/index.ts`)
1. `scheduled(event)` fires on the cron trigger(s) in `wrangler.jsonc`.
2. It POSTs to `{GITHUB_API_BASE}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/actions/workflows/{file}/dispatches` with `{ "ref": GITHUB_REF }`.
3. `DRY_RUN=true` (or local via mock) logs the request instead of sending it.
4. GitHub then runs the workflow `.yml` file from `GITHUB_REF` branch.

## Configuration

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | Fine-grained PAT with **Actions read/write** on the repo (deployed as a secret, not a var) |
| `GITHUB_OWNER` | Repo owner (`Ege-Okyay`) |
| `GITHUB_REPO` | Repo name (`mensa-app-monorepo`) |
| `GITHUB_REF` | Branch the workflows run on (`dev`) |
| `GITHUB_API_BASE` | `https://api.github.com` (or mock server locally) |
| `DRY_RUN` | `true` = log only, no real dispatch |

## Running

```bash
bun run dev        # wrangler dev --test-scheduled (uses .dev.vars, dry-run safe)
bun run mock       # start local mock-github server on :4000
bun run typecheck  # tsc --noEmit
bun test           # unit tests (dispatch helpers)
bun run deploy     # wrangler deploy (production)
```

## Dependencies (key)

- `wrangler` — Cloudflare Worker tooling/dev server
- `@cloudflare/workers-types` — Worker + ScheduledEvent types
