# Continue From Claude Baseline ExecPlan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Continue from the existing Claude implementation toward the approved HOJ website/webapp design without rebuilding completed work.

**Architecture:** Treat the current Next.js App Router implementation as the production baseline. Use the project docs, design system, site map, acceptance criteria, and UI kits as references for verification and targeted follow-up work. Split continuation into child ExecPlans so validation, UI comparison, public-page completion, admin/Supabase hardening, and final QA can be executed independently.

**Tech Stack:** Next.js 15 App Router, TypeScript, React 19, Supabase, Vitest, Playwright, project CSS design system.

---

## Source Of Truth

The existing implementation is the baseline. Do not replace the homepage, `Nav`, `Footer`, admin, Supabase setup, or route structure unless a specific verified issue is scoped by a child plan.

Read these before executing any child plan:
- `AGENTS.md`
- `docs/README.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/SITE_MAP.md`
- `docs/ACCEPTANCE_CRITERIA.md`
- `docs/TESTING.md`
- `docs/IMPLEMENTATION_STATUS.md`
- `.agent/REVIEW_LOOP.md`
- `README.md`
- `SKILL.md`
- `docs/superpowers/specs/2026-04-24-hoj-phase1-design.md`
- `docs/superpowers/plans/2026-04-24-hoj-phase1.md`
- `ui_kits/website/README.md`

Reference only:
- `colors_and_type.css`
- `ui_kits/website/`
- `ui_kits/admin/`

Do not modify `ui_kits/` unless a future task explicitly says to update the reference kit itself.

---

## Current Baseline

### App Structure

- Public route group: `app/(public)/layout.tsx`, `app/(public)/page.tsx`, `app/(public)/nyheder/page.tsx`, `app/(public)/nyheder/[slug]/page.tsx`
- Admin routes: `app/admin/page.tsx`, `app/admin/layout.tsx`, `app/admin/nyheder/page.tsx`, `app/admin/nyheder/ny/page.tsx`, `app/admin/nyheder/[id]/page.tsx`
- Public components: `components/Nav.tsx`, `components/Footer.tsx`, `components/Hero.tsx`, `components/Icon.tsx`, `components/NewsCard.tsx`, `components/NewsFeed.tsx`
- Admin components: `components/admin/ImageUploader.tsx`, `components/admin/NewsForm.tsx`, `components/admin/ResultsBuilder.tsx`
- Supabase integration: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/admin.ts`, `lib/actions/auth.ts`, `lib/actions/news.ts`, `supabase/migrations/0001_news_table.sql`
- Tests: `tests/unit/`, `tests/components/`, `tests/e2e/`

### Already Done

- Phase 1 public news surface exists: homepage, news list, article page.
- Phase 1 admin news surface exists: login, list, create, edit.
- Supabase clients, server actions, news migration, sanitization, slug utility, and middleware exist.
- Approved design tokens and UI kit CSS are imported globally via `app/globals.css`.
- `Nav` and `Footer` live in the public route group, keeping admin separate.
- `package.json` has scripts for `dev`, `build`, `lint`, `test`, `test:watch`, and `test:e2e`.

### Validation Status To Reconfirm

Earlier validation attempts in this workspace found:
- `npm test` failed because `vitest` was not present in `node_modules/.bin` despite being listed in `package.json`.
- `npm run lint` and `npm run build` were blocked by PowerShell execution policy resolving `npm.ps1`.

The first child plan must reconfirm this using `npm.cmd` and the current dependency state. Do not treat validation as passing until the child plan records fresh results in `docs/IMPLEMENTATION_STATUS.md`.

---

## Guardrails

- Preserve the Claude baseline.
- Do not rebuild from scratch.
- Do not introduce a new visual direction.
- Do not overwrite existing working components.
- Do not touch admin/auth/Supabase unless the active child plan scopes it.
- Do not add dependencies unless validation proves they are missing and already expected by `package.json`, or a documented acceptance criterion cannot be met otherwise.
- Run validation after each milestone.
- Run `.agent/REVIEW_LOOP.md` after each milestone.
- Stop after plan creation when a task only asks for plans.

---

## Child ExecPlans

Execute these in order. Each child plan is intentionally narrower than the parent and should be completed before moving to the next.

1. `.agent/exec-plans/004-validation-and-docs-alignment.md`
2. `.agent/exec-plans/005-ui-reference-comparison.md`
3. `.agent/exec-plans/006-public-pages-completion.md`
4. `.agent/exec-plans/007-admin-supabase-hardening.md`
5. `.agent/exec-plans/008-final-qa-deployment-readiness.md`

---

## Parent Milestones

### Milestone 1: Validation And Docs Alignment

Use `.agent/exec-plans/004-validation-and-docs-alignment.md`.

- [ ] Reconfirm repository status and dependency state.
- [ ] Run baseline validation with Windows-safe commands.
- [ ] Align `docs/IMPLEMENTATION_STATUS.md` with actual routes/features.
- [ ] Run `.agent/REVIEW_LOOP.md`.

### Milestone 2: UI Reference Comparison

Use `.agent/exec-plans/005-ui-reference-comparison.md`.

- [ ] Compare current production UI to approved references.
- [ ] Record concrete mismatches only.
- [ ] Do not redesign.
- [ ] Run `.agent/REVIEW_LOOP.md`.

### Milestone 3: Public Pages Completion

Use `.agent/exec-plans/006-public-pages-completion.md`.

- [ ] Complete missing public pages from `docs/SITE_MAP.md`.
- [ ] Preserve public layout, `Nav`, `Footer`, and design direction.
- [ ] Update docs and tests for each route.
- [ ] Run `.agent/REVIEW_LOOP.md`.

### Milestone 4: Admin/Supabase Hardening

Use `.agent/exec-plans/007-admin-supabase-hardening.md`.

- [ ] Touch admin/auth/Supabase only for verified issues.
- [ ] Harden security, data flow, and admin UX without replacing the implementation.
- [ ] Run `.agent/REVIEW_LOOP.md`.

### Milestone 5: Final QA And Deployment Readiness

Use `.agent/exec-plans/008-final-qa-deployment-readiness.md`.

- [ ] Run full validation and accessibility checks.
- [ ] Confirm deployment documentation and environment requirements.
- [ ] Record final readiness in `docs/IMPLEMENTATION_STATUS.md`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

---

## Do Not Do Yet

- Do not implement the child plans during plan creation.
- Do not replace the approved visual system.
- Do not rewrite the homepage, `Nav`, `Footer`, admin shell, Supabase setup, or route groups.
- Do not add Tailwind, shadcn/ui, a new CMS, or a new auth layer.
- Do not change `ui_kits/` source files.

