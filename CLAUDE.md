# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HOJ (Hadsten & Omegns Jagtforening) — a Danish hunting and shooting association website built with Next.js 15 and Supabase. The site is entirely in Danish with a custom design system (no Tailwind).

## HOJ Agent Workflow

This project is for Hadsten og Omegns Jagtforening.

Use project-specific subagents for non-trivial work. Do not use agents as ceremony for tiny one-line edits.

Default workflow for remaining HOJ changes:

1. For content, navigation, and page structure:
   - Use `hoj-content-auditor` first.
   - Do not duplicate existing content.
   - Do not blindly overwrite CMS-driven content.

2. For admin/CMS bugs:
   - Use `hoj-admin-cms-debugger` first.
   - Identify root cause before implementation.
   - Fix the smallest responsible area.

3. For public frontend polish:
   - Use `hoj-frontend-polisher`.
   - Preserve the existing design system.
   - Do not redesign the site unless explicitly requested.

4. For auth, uploads, Supabase, environment variables, or admin exposure:
   - Use `hoj-security-reviewer`.

5. After implementation:
   - Use `hoj-production-validator`.
   - Run relevant validation commands from package.json.
   - If validation fails, diagnose before making more changes.

Rules:
- Do not expand scope.
- Do not modify unrelated files.
- Preserve working functionality.
- Prefer minimal targeted fixes.
- Avoid hardcoding content if the feature is CMS-driven.
- Never claim the task is complete unless validation has been run or a clear reason is given why it could not run.

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build (Turbopack)
npm run typecheck    # TypeScript check (tsc --noEmit)
npm run lint         # ESLint
npm run test         # Vitest unit tests (single run)
npm run test:watch   # Vitest in watch mode
npm run test:e2e     # Playwright E2E tests
```

Run a single unit test file:
```bash
npx vitest run tests/unit/slug.test.ts
```

Run a single E2E test file:
```bash
npx playwright test tests/e2e/homepage.spec.ts
```

On Windows, use `npm.cmd` / `npx.cmd` if running outside a shell that resolves npm automatically.

Always validate with `typecheck`, `lint`, and `build` after changes.

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router) with React 19, TypeScript 5
- **Styling**: Custom CSS with design tokens in `colors_and_type.css` (no CSS framework)
- **Database/Auth**: Supabase (PostgreSQL + Auth + Storage)
- **Rich-text editor**: TipTap (admin news creation)
- **Testing**: Vitest (unit) + Playwright (E2E)

### Route Structure (App Router)
- `app/(public)/` — Public-facing pages wrapped in shared Nav/Footer layout
- `app/admin/` — Auth-protected admin pages (login at `/admin`, subroutes require auth)
- Route groups use parentheses: `(public)` provides layout without affecting URL

### Key Directories
- `components/` — Shared React components (Nav, Footer, Hero, NewsCard, etc.)
- `components/admin/` — Admin-specific components (NewsForm with TipTap, ImageUploader)
- `lib/supabase/` — Supabase client factories (server.ts, client.ts, admin.ts)
- `lib/actions/` — Server Actions for mutations (news CRUD, auth)
- `ui_kits/website/` — Reference JSX prototypes defining the target UI (read-only, do not modify)
- `supabase/migrations/` — PostgreSQL migrations (news table, storage bucket)
- `docs/` — Detailed documentation (design system, site map, acceptance criteria, testing)

### Path Alias
`@/*` maps to the project root (configured in tsconfig.json and vitest.config.ts). Import as `@/lib/supabase/server`, `@/components/Nav`, etc.

### Test Organization
- `tests/unit/` — Unit tests for lib utilities and page-level logic
- `tests/components/` — React component tests (Testing Library + jsdom)
- `tests/e2e/` — Playwright browser tests (expects dev server on localhost:3000)
- `tests/setup.ts` — Shared Vitest setup (jsdom environment, globals enabled)

### Data Flow
- Server Components fetch data directly via Supabase server client
- Mutations go through Server Actions in `lib/actions/`
- Auth middleware in `middleware.ts` protects `/admin/*` subroutes (login page at `/admin`, subroutes redirect if unauthenticated)
- Row-Level Security on Supabase: public reads published posts, authenticated users have full access

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL      # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY     # Server-only admin key
```

## Design System

The site uses a custom design system defined in `colors_and_type.css` and documented in `docs/DESIGN_SYSTEM.md`. Key points:

- **Palette**: Forest (#1E2A22), Bone (#F4EFE4), Brass (#B8893A), Clay (#C7502E), Moss (#5E7347)
- **Fonts**: Fraunces (display), Inter (body), JetBrains Mono (data/scores)
- **Icons**: Lucide (24px, 1.75px stroke) + 2 custom SVGs in `assets/`
- **Grid**: 8px base spacing, max content width 1200px
- **No emoji anywhere in the UI**
- UI must match the reference prototypes in `ui_kits/website/`

## Constraints

- All user-facing content is in Danish — never introduce English text in the UI
- Do not modify `ui_kits/` — these are read-only reference designs
- Minimal changes: do not refactor unrelated code or expand scope
- No new dependencies unless explicitly required
- Preserve existing architecture patterns (Server Components by default, Client Components only where interactivity requires it)

## Database Schema

The `news` table has: id, slug, title, category, teaser, body (HTML), image_url, has_results, results (JSONB), status (draft/published), highlighted, published_at, created_by, timestamps. Migrations live in `supabase/migrations/`.

## Documentation Index

- `README.md` — Brand guidelines, content voice, visual foundations
- `docs/DESIGN_SYSTEM.md` — Complete visual/UX specifications
- `docs/SITE_MAP.md` — Route inventory
- `docs/ACCEPTANCE_CRITERIA.md` — Feature requirements
- `docs/TESTING.md` — Test strategy and patterns
- `docs/IMPLEMENTATION_STATUS.md` — Current progress tracking
- `AGENTS.md` — Execution model and plan ordering
