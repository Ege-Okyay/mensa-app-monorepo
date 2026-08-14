# web-app — AI Agent Context

## Project Overview

PWA (Progressive Web App) for viewing daily EDISU Piemonte mensa menus. Built with React Router 7 (framework mode), React 19, Tailwind CSS 4 + daisyUI, and Vite. Deployed to Cloudflare Pages via Wrangler. Part of the `mensa-app-monorepo`.

## Architecture

```
app/
  root.tsx                — app shell: layout, providers, error boundary, install banners
  routes.ts               — route config
  routes/
    index.tsx             — home: list of all mensas (sorted: starred first, then has_menu)
    mensa-page.tsx        — /mensa/:slug detail page with current menu
  components/
    mensa-card/           — home list card (image, star, maps, menu status)
    mensa-menu-card/      — menu detail (image header, allergens, food cards, side dishes)
    header.tsx            — logo + settings dropdown
    settings-dropdown.tsx — language selector + push notification toggle
    footer.tsx, section-title.tsx, error-view.tsx, splash-screen.tsx
    android-install-banner.tsx, ios-install-banner.tsx
    language-selector.tsx
  lib/
    api/
      client.ts           — fetch wrapper: timeout, error mapping, ApiError codes
      mensa.ts            — mensaApi.getAll(), getMensaWithMenu(slug)
      push.ts             — pushApi.subscribe/unsubscribe
      types.ts            — Mensa, MenuData, MenuItem, LocalizedDish, ApiResponse
    contexts/
      language-context.tsx — LanguageProvider, useTranslation, typed t() paths (AllPaths)
    hooks/
      use-pwa.tsx          — install banner logic + SW registration
      use-push-notification.tsx — VAPID subscribe/unsubscribe via PushManager
      use-starred-mensas.tsx     — starred mensa IDs in localStorage
    locales/               — translations: en.ts, it.ts, tr.ts (en.ts defines TranslationKeys)
    utils/image.ts         — getOptimizedImageUrl(slug, width) → Supabase image transform
  sw.ts                    — service worker (Workbox injectManifest): precache + NetworkFirst pages + push handlers
```

### Key behaviors
- **i18n**: `useTranslation()` returns `{ language, setLanguage, t }`. `t("menu.first_courses")` resolves via dot-path into `locales/{lang}.ts`. Language persisted in `localStorage["lang"]`. MenuItem text is per-language: `menuItem[language].name`.
- **API errors**: `client.ts` throws normalized objects `{ message, code, status }`. Codes: `TIMEOUT`, `NETWORK_ERROR`, `SERVER_OFFLINE`, `UNKNOWN_ERROR`. Use `isApiError()` to detect. ErrorBoundaries map codes to localized messages.
- **Data fetching**: client-side loaders (`clientLoader`) — no SSR data. Home shows mensas even without menus; detail page shows a no-menu state.
- **Starred mensas**: `useStarredMensas` stores IDs in `localStorage["starred-mensas"]`. Sorting on home puts starred first, then mensas with menus.
- **Push notifications**: only in standalone (installed) PWA via settings dropdown; debounced toggle; registers SW only in PROD.

## Configuration (`.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_REQUEST_TIMEOUT` | Request timeout in ms (default 5000) |
| `VITE_VAPID_PUBLIC_KEY` | VAPID public key for push notifications |

Files: `.env.development`, `.env.production`, `.env.sample` (all committed).

## Running

```bash
bun install          # install deps (bun.lock committed)
bun run dev          # react-router dev server (--host)
bun run typecheck    # tsc
bun run build        # react-router build
bun run typegen      # react-router typegen (generates +types for loaders)
bun run start        # wrangler pages dev (local preview of build)
bun run deploy       # wrangler pages deploy
```
