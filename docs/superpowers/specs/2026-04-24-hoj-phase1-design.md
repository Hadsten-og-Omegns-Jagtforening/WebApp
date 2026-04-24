# HOJ Website — Phase 1 Design Spec

**Date:** 2026-04-24  
**Scope:** Phase 1 — Public news pages + custom admin panel  
**Stack:** Next.js 15 (App Router) · Supabase · Vercel  

---

## Overview

Hadsten & Omegns Jagtforening (HOJ) is replacing their WordPress site with a purpose-built web app. Phase 1 delivers the homepage with a live news feed, individual news article pages, and a custom admin panel for the board to create, edit, and publish news posts.

The existing design system (`colors_and_type.css`, `kit.css`, `ui_kits/website/`, `ui_kits/admin/`) is already approved by the client and migrates directly into the production app.

---

## Routes

### Public

| Route | Description |
|---|---|
| `/` | Homepage — hero, quick-nav tiles, news feed (latest 6 posts) |
| `/nyheder` | News listing — all published posts, paginated |
| `/nyheder/[slug]` | News article — full post, image, optional results table |

### Admin (login required)

| Route | Description |
|---|---|
| `/admin` | Login form (email + password) |
| `/admin/nyheder` | News list — search, filter, sort, paginate, edit/delete |
| `/admin/nyheder/ny` | Create new post |
| `/admin/nyheder/[id]` | Edit existing post |

Next.js middleware redirects all unauthenticated `/admin/*` requests to `/admin`.

---

## Architecture

```
Browser → Next.js (Vercel) → Supabase (PostgreSQL + Auth + Storage)
```

- **Public pages** use Next.js Server Components — fetched server-side for full SEO indexing.
- **Admin pages** are Client Components (forms, rich text editor, image upload).
- **Middleware** reads the Supabase session cookie and guards all `/admin/*` routes.
- **Existing CSS** (`colors_and_type.css`, `kit.css`, `admin.css`) is imported globally — no CSS-in-JS, no Tailwind.
- **TypeScript** throughout.

---

## Database Schema

### `news` table

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, auto-generated |
| `slug` | `text` | Unique, auto-generated from title on create |
| `title` | `text` | Not null |
| `category` | `text` | Not null — see categories below |
| `teaser` | `text` | Not null — shown on news cards and homepage |
| `body` | `text` | Not null — rich HTML output from TipTap editor |
| `image_url` | `text` | Nullable — Supabase Storage public URL |
| `has_results` | `boolean` | Default `false` |
| `results` | `jsonb` | Nullable — array of `{rank, name, score}` objects |
| `status` | `text` | `'draft'` or `'published'`, default `'draft'` |
| `highlighted` | `boolean` | Default `false` — "Fremhæv på forsiden" |
| `allow_comments` | `boolean` | Default `false` — stored now, no UI in Phase 1 |
| `published_at` | `timestamptz` | Nullable — set from the date picker; defaults to `now()` if left blank when publishing |
| `created_by` | `uuid` | References `auth.users(id)` — set on create, not shown publicly |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Auto-updated via Supabase trigger on every edit |

**Categories:** `Nyhed`, `Jagt`, `Præmieskydning`, `Klubaften`, `Praktisk info`

**Row-level security:** Public can `SELECT` where `status = 'published'`. Admin user (authenticated) has full `INSERT`, `UPDATE`, `DELETE`.

### Storage

One bucket: `news-images`
- Public read
- Authenticated write only
- Images stored as `{uuid}.{ext}`, served via Supabase CDN URL

### Auth

Supabase built-in `auth.users` — no custom users table. Admin accounts created manually in the Supabase dashboard. Email + password sign-in only.

---

## Component Migration

Existing JSX prototype components migrate to TypeScript React. Mapping:

| Prototype file | Production component(s) |
|---|---|
| `Nav.jsx` | `components/Nav.tsx` |
| `Footer.jsx` | `components/Footer.tsx` |
| `Home.jsx` | `app/page.tsx` + `components/Hero.tsx` + `components/NewsFeed.tsx` |
| `News.jsx` | `app/nyheder/page.tsx` + `app/nyheder/[slug]/page.tsx` + `components/NewsCard.tsx` |
| `Icon.jsx` | `components/Icon.tsx` |
| `ui_kits/admin/login.html` | `app/admin/page.tsx` |
| `ui_kits/admin/news-list.html` | `app/admin/nyheder/page.tsx` |
| `ui_kits/admin/news-edit.html` | `app/admin/nyheder/ny/page.tsx` + `app/admin/nyheder/[id]/page.tsx` |

---

## Admin Panel

Based on the approved design in `ui_kits/admin/`.

### Login (`/admin`)
- Email + password form
- "Husk mig" persists the Supabase session
- "Glemt adgangskode?" — triggers Supabase password reset email
- On success: redirect to `/admin/nyheder`
- On failure: inline error message

### News List (`/admin/nyheder`)
- Table columns: Kategori · Titel + teaser · Dato · Status · Handlinger
- Search by title/teaser (client-side filter on fetched results)
- Filter dropdowns: Alle kategorier / Alle statusser / Sortering
- Pagination: 10 posts per page
- "+ Ny nyhed" button → `/admin/nyheder/ny`
- Row actions: Rediger (→ `/admin/nyheder/[id]`) · Slet (confirm dialog)

### Create/Edit Post (`/admin/nyheder/ny` and `/admin/nyheder/[id]`)

**Left column fields:**
- **Titel** — text input
- **Uddrag** — textarea, 180-char limit with counter
- **Indhold** — TipTap rich text editor with toolbar: Bold, Italic, Underline, H2, H3, Bullet list, Link, Blockquote, Undo
- **Kategori** — select dropdown
- **Publiceringsdato** — date input

**Right column panels (sticky):**
- **Hovedbillede** — image upload to Supabase Storage, 4:3 preview, alt-text field, replace/remove
- **Indstillinger** — three toggles:
  - Resultater / scoretabel (`has_results`)
  - Fremhæv på forsiden (`highlighted`)
  - Tillad kommentarer (stored but unused in Phase 1)
- **Resultater** — visible only when `has_results` is on; table builder for `{rank, name, score}` rows with "+ Tilføj skytte"

**Footer bar:**
- Auto-save indicator (debounced, saves draft every 30s)
- Annullér · Gem som kladde · Slet · Udgiv
- "Udgiv" sets `status = 'published'` and `published_at = now()`

---

## Public Pages

### Homepage (`/`)
Mirrors the approved `Home.jsx` prototype:
- **Hero** — forest background, large Bitter headline, status badge ("åben nu"/"lukket" — hardcoded for Phase 1), two CTA buttons
- **Quick-nav tiles** — 3 tiles linking to booking, calendar, membership (stub routes for Phase 2)
- **News feed** — latest 6 published posts ordered by `published_at` descending, with any `highlighted = true` posts sorted to the top of those 6; uses `NewsCard` component

### News Listing (`/nyheder`)
- Grid of `NewsCard` components, all published posts, newest first
- Pagination: 9 per page
- No search/filter in Phase 1

### News Article (`/nyheder/[slug]`)
- Hero image (if present)
- Category · Date header (no author shown publicly)
- Body rendered as HTML (TipTap output — sanitised server-side with DOMPurify before save)
- Collapsible `<details>` results table (if `has_results`)
- "← Tilbage til nyheder" link

---

## Data Flow

### Public page fetch (server-side)
```
Server Component → supabase.from('news').select().eq('status','published') → render HTML
```

### Admin mutations (client-side)
```
Client Component → Server Action → supabase (with service role) → revalidatePath
```

Server Actions keep the Supabase service key off the client.

---

## Out of Scope (Phase 1)

- Kalender page and admin section
- Præmieskydninger pages
- Booking system
- Membership page
- Bestyrelsen page
- Jagt / Hjælp til jagtprøven pages
- Comments (toggle stored but no UI/backend)
- Multiple admin user management
- Google Calendar integration

Sidebar links to out-of-scope admin sections render as disabled stubs.

---

## File Structure

```
app/
├── layout.tsx               # Root layout — imports global CSS, renders Nav + Footer (excluded by admin/layout.tsx)
├── page.tsx                 # Homepage
├── nyheder/
│   ├── page.tsx             # News listing
│   └── [slug]/
│       └── page.tsx         # News article
└── admin/
    ├── page.tsx             # Login
    ├── layout.tsx           # Admin shell layout (sidebar) — overrides root layout, no Nav/Footer
    └── nyheder/
        ├── page.tsx         # News list
        ├── ny/
        │   └── page.tsx     # Create post
        └── [id]/
            └── page.tsx     # Edit post

components/
├── Nav.tsx
├── Footer.tsx
├── Icon.tsx
├── Hero.tsx
├── NewsCard.tsx
├── NewsFeed.tsx
└── admin/
    ├── NewsForm.tsx         # Shared create/edit form
    ├── ResultsBuilder.tsx   # Results table row editor
    └── ImageUploader.tsx    # Supabase Storage upload

lib/
├── supabase/
│   ├── client.ts            # Browser client
│   ├── server.ts            # Server component client
│   └── middleware.ts        # Session refresh + route guard
└── actions/
    ├── news.ts              # Server Actions: createPost, updatePost, deletePost, publishPost

middleware.ts                # Next.js middleware — protects /admin/*
```

---

## Security

### XSS — Rich text sanitisation
TipTap outputs HTML. Before any body is written to the database it is sanitised server-side (inside the Server Action) using **DOMPurify** with a strict allowlist. Only these tags are permitted: `p, strong, em, u, h2, h3, ul, ol, li, a, blockquote`. All attributes except `href` on `<a>` are stripped. `href` values are validated to start with `https://` or `/` — no `javascript:` URIs. Raw HTML is never trusted on read; Supabase stores only the sanitised version.

### SQL injection
Not possible — all Supabase queries use the JS client's parameterised query builder. No raw SQL is constructed from user input.

### Authentication
- **Password requirements** (configured in Supabase Auth dashboard):
  - Minimum 12 characters
  - At least one uppercase letter, one number, one special character
  - Breached-password check enabled (HaveIBeenPwned integration, built into Supabase)
- **Session** — Supabase issues a signed JWT stored in an `httpOnly` cookie. The Next.js middleware refreshes it on every request.
- **Login rate limiting** — Supabase Auth enforces built-in brute-force protection (5 failed attempts triggers a lockout). No custom implementation needed.
- **Password reset** — uses Supabase's built-in email flow; no custom reset logic.

### Route protection
Next.js middleware checks for a valid Supabase session on every `/admin/*` request. No session → redirect to `/admin`. This runs at the edge before any page is rendered — there is no client-side-only guard.

### Image upload validation
Before uploading to Supabase Storage the Server Action checks:
- MIME type is `image/jpeg` or `image/png` (checked from file bytes, not just extension)
- File size ≤ 5 MB
- Filename is replaced with a server-generated UUID — the original filename is never stored or exposed

### Content Security Policy
A `Content-Security-Policy` header is set via `next.config.ts`:
- `default-src 'self'`
- `img-src 'self' https://<supabase-project>.supabase.co data:`
- `script-src 'self'` (no inline scripts)
- `style-src 'self' 'unsafe-inline'` (required for CSS custom properties)

### Row-level security (recap)
Supabase RLS is enabled on the `news` table. Anon role can only `SELECT` published posts. Authenticated role (admin) has full access. The service role key (used only in Server Actions) bypasses RLS intentionally and is never exposed to the browser.

---

## Deployment

1. **Supabase project** — create via dashboard, run migration SQL, create `news-images` bucket, create admin user via Auth dashboard
2. **Vercel project** — connect GitHub repo, set environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
3. **Git push to `main`** — triggers automatic Vercel deploy
