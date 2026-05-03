# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Hadsten & Omegns Jagtforening (HOJ) — a Danish hunting and clay-pigeon shooting club's website. All UI strings, validation messages, and content are **100% Danish**, using du-form (informal) and club-plural ("vi", "foreningen").

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run typecheck    # TypeScript check (no emit)
npm run lint         # ESLint
npm run test         # Run unit tests (Vitest, single run)
npm run test:watch   # Vitest in watch mode
npm run test:e2e     # Playwright e2e tests (requires built app)
```

Run a single unit test file:
```bash
npx vitest run tests/unit/slug.test.ts
```

Run a single Playwright spec:
```bash
npx playwright test tests/e2e/admin-auth.spec.ts
```

E2e tests build and serve the app automatically. They need a local Supabase instance running (default `http://127.0.0.1:54321`) or real env vars.

## Architecture

**Next.js 15 App Router** with TypeScript. Public site lives under `app/(public)/`, admin under `app/admin/`. Both share the root layout at `app/layout.tsx`.

**Data flow:** Mutations go through Next.js Server Actions (`lib/actions/`), which call Supabase directly server-side and call `revalidatePath()` to bust cache. There is no API layer — no `app/api/` routes for content CRUD.

**Supabase** handles the database, auth, and image storage:
- `lib/supabase/server.ts` — SSR client (syncs cookies)
- `lib/supabase/client.ts` — browser client
- `lib/supabase/admin.ts` — service-role client (bypasses RLS)
- Auth has an 8-second timeout wrapper (`lib/supabase/auth-timeout.ts`) to prevent middleware hangs

**Middleware** (`middleware.ts`) guards all `/admin/*` routes, redirecting unauthenticated users to `/admin` (login).

**RLS** enforces access at the database layer: published news is public-readable, everything else requires authentication. Rely on RLS rather than application-level guards for data security.

**Rich text** in news and prize-activity bodies uses TipTap. Output is sanitized before storage (`lib/sanitize.ts`).

## Database Schema

Four migrations under `supabase/migrations/`:
- `0001` — `news` table (slug, title, category, teaser, body, image_url, status draft/published, highlighted, results jsonb)
- `0002` — `news-images` storage bucket (public read, auth write)
- `0003` — `news_categories` (fixed set: Nyhed, Jagt, Præmieskydning, Klubaften, Praktisk info)
- `0004` — `prize_activities` (slug, title, month_label, body html, icon, sort_order, is_active)

Generated TypeScript types are in `lib/database.types.ts`. Regenerate after schema changes with the Supabase CLI.

## Key Conventions

- **Server Actions** receive raw `FormData`; parse with `formData.get()`. Return typed result objects, not thrown errors.
- **Slugs** are generated from title via `lib/slug.ts`. News and prize-activity slugs must be unique.
- **News images** are stored in Supabase Storage at a 3:2 ratio (1200×800px). `lib/image-upload-validation.ts` enforces file type and size limits before upload.
- **Prize activities** have hardcoded fallback data in `lib/prize-activities.ts` for when the DB is unreachable.
- **Draft/publish workflow**: all news posts are created as drafts; a separate publish action sets `status = 'published'` and stamps `published_at`.
- **`highlighted`** flag on news marks posts for homepage feature placement.

## Design System

Defined in `colors_and_type.css` and `app/globals.css`. Core tokens:

| Token | Value | Use |
|---|---|---|
| Forest | `#1E2A22` | Primary dark |
| Loam | `#8A7359` | Warm neutral |
| Bone | `#F4EFE4` | Background |
| Brass | `#D4A557` | Accent |
| Clay | `#C7502E` | Alert only |
| Moss | `#7A8F5F` | Success |

Typography: **Fraunces** (display/headers, variable font), **Inter** (body/UI, 16–17px base), **JetBrains Mono** (scorecard/results). 8px spacing grid, max-width 1200px (marketing) / 1440px (with sidebar). Icons from Lucide.

**Strict UI rules:** no hover-only interactions, no parallax, no emoji, no animation without `prefers-reduced-motion` respect. All touch targets must be large enough for older users.

## Testing

Unit tests use Vitest with jsdom + `@testing-library/react`. Globals (`describe`, `it`, `expect`) are available without imports. Setup file: `tests/setup.ts`.

E2e tests use Playwright (Chromium only). Trace is captured on first retry.

## Environment

Requires a `.env.local` with Supabase keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`). These are never committed.
