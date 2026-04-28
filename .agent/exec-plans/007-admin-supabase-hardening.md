# Admin Supabase Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the existing admin and Supabase implementation only where validation, docs, or review identify concrete issues.

**Architecture:** Keep the current admin route structure, Supabase clients, server actions, middleware, and migration as the baseline. Add focused tests before behavior changes. Prefer small fixes to existing files over replacing the admin stack.

**Tech Stack:** Next.js 15 App Router, Server Actions, Supabase Auth/Postgres/Storage, TypeScript, Vitest, Playwright.

---

## Guardrails

- Preserve the Claude baseline.
- Do not rewrite admin or replace Supabase.
- Do not touch public UI except where an admin data bug leaks into public news rendering.
- Do not modify `ui_kits/`.
- Do not add dependencies unless a documented security requirement cannot be met otherwise.
- Require a verified issue before changing admin/auth/Supabase code.
- Run `.agent/REVIEW_LOOP.md` after each milestone.

---

## Files Likely To Change

Likely:
- `middleware.ts`
- `lib/actions/auth.ts`
- `lib/actions/news.ts`
- `lib/sanitize.ts`
- `lib/slug.ts`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/admin.ts`
- `components/admin/ImageUploader.tsx`
- `components/admin/NewsForm.tsx`
- `components/admin/ResultsBuilder.tsx`
- `app/admin/page.tsx`
- `app/admin/nyheder/page.tsx`
- `app/admin/nyheder/ny/page.tsx`
- `app/admin/nyheder/[id]/page.tsx`
- `supabase/migrations/0001_news_table.sql`
- `tests/unit/*.test.ts`
- `tests/components/*.test.tsx`
- `tests/e2e/admin-*.spec.ts`
- `docs/IMPLEMENTATION_STATUS.md`
- `docs/TESTING.md`

Avoid:
- `components/Nav.tsx`
- `components/Footer.tsx`
- `ui_kits/**`

---

## Validation Commands

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
npm.cmd run test:e2e -- admin
```

If no focused admin test selector is available:

```powershell
npm.cmd run test:e2e
```

---

## Milestone 1: Admin/Auth/Supabase Audit

- [ ] Read `docs/IMPLEMENTATION_STATUS.md`, `docs/ACCEPTANCE_CRITERIA.md`, `docs/TESTING.md`, and `.agent/REVIEW_LOOP.md`.
- [ ] Inspect `middleware.ts` for route protection behavior.
- [ ] Inspect `lib/actions/auth.ts` for login/logout behavior and error handling.
- [ ] Inspect `lib/actions/news.ts` for create/update/delete/publish behavior.
- [ ] Inspect `lib/sanitize.ts` for rich text allowlist behavior.
- [ ] Inspect `components/admin/ImageUploader.tsx` for upload validation and service-key exposure risks.
- [ ] Inspect `supabase/migrations/0001_news_table.sql` for RLS and schema alignment.
- [ ] Document verified issues in `docs/IMPLEMENTATION_STATUS.md`.
- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** No hardening change is made until the issue is documented and linked to a file/test.

---

## Milestone 2: Security And Data Integrity Fixes

- [ ] For each verified issue, write or update a unit/component/E2E test that fails before the fix.
- [ ] Fix only the targeted issue in the smallest relevant file.
- [ ] Re-run the focused test.
- [ ] Re-run `npm.cmd test`.
- [ ] Re-run `npm.cmd run lint`.
- [ ] Re-run `npm.cmd run build`.
- [ ] Update `docs/IMPLEMENTATION_STATUS.md` with the fix and validation result.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Candidate issues to verify before fixing:**
- Duplicate title/slug behavior.
- Draft versus published `published_at` behavior.
- Sanitized link allowlist and stripped attributes.
- Service role key never reaching client components.
- Middleware redirect behavior for `/admin` versus `/admin/*`.
- Image file type/size validation.

**Exit criteria:** Every admin/Supabase code change has a specific test or documented manual verification.

---

## Milestone 3: Admin UX Reliability

- [ ] Verify admin list empty, loading, error, and populated states.
- [ ] Verify create/edit form validation for required title, teaser, category, and body.
- [ ] Verify result rows can be added, edited, removed, saved, and rendered publicly if enabled.
- [ ] Verify delete requires confirmation and redirects safely.
- [ ] Add or update tests for any verified broken behavior.
- [ ] Make only targeted fixes.
- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `npm.cmd run test:e2e`.
- [ ] Update `docs/IMPLEMENTATION_STATUS.md`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** Admin flows are stable enough for final QA, or remaining blockers are documented with exact reproduction steps.

---

## Stop Condition

Stop after this plan is created or, when executed later, after verified admin/Supabase hardening is complete. Do not perform unrelated public-page work or deployment changes from this plan.

