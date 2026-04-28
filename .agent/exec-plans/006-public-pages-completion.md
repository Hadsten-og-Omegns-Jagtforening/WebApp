# Public Pages Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete missing public pages from the approved site map while preserving the Claude baseline and approved visual direction.

**Architecture:** Add missing App Router pages under the existing public route group. Reuse existing `app/(public)/layout.tsx`, `components/Nav.tsx`, `components/Footer.tsx`, design tokens, and patterns from `ui_kits/website/`. Keep pages static/read-only unless the current implementation already provides safe data access.

**Tech Stack:** Next.js 15 App Router, TypeScript, React Server Components, project CSS design system, Vitest, Playwright.

---

## Guardrails

- Preserve the existing homepage, news pages, `Nav`, `Footer`, and public layout.
- Do not redesign from scratch.
- Do not touch admin/auth/Supabase in this plan.
- Do not modify `ui_kits/`.
- Add one page or route group at a time.
- Update nav links only after destinations exist.
- Run `.agent/REVIEW_LOOP.md` after each milestone.

---

## Files Likely To Change

Likely creates:
- `app/(public)/book-skydebanen/page.tsx`
- `app/(public)/kalender/page.tsx`
- `app/(public)/bliv-medlem/page.tsx`
- `app/(public)/aktiviteter/jagt/page.tsx`
- `app/(public)/aktiviteter/hjalp-til-jagtproven/page.tsx`
- `app/(public)/aktiviteter/premieskydninger/page.tsx`
- `app/(public)/praktisk-info/aabningstider-og-skydetider/page.tsx`
- `app/(public)/praktisk-info/bestyrelsen/page.tsx`
- `app/(public)/find-os/page.tsx`
- `tests/e2e/public-pages.spec.ts`

Likely modifies:
- `components/Nav.tsx`
- `components/Footer.tsx`
- `docs/IMPLEMENTATION_STATUS.md`
- `docs/SITE_MAP.md`, only if current route decisions need clarification.

Possible shared components, only if duplication becomes real:
- `components/PageHero.tsx`
- `components/InfoSection.tsx`
- `components/ContactBlock.tsx`

Do not create shared abstractions unless at least two pages need the same structure and existing CSS classes cannot cover it.

---

## Validation Commands

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
npm.cmd run test:e2e
```

For focused E2E while working:

```powershell
npm.cmd run test:e2e -- public-pages
```

---

## Milestone 1: Confirm Public Route Scope

- [ ] Read `docs/SITE_MAP.md`, `docs/IMPLEMENTATION_STATUS.md`, `docs/ACCEPTANCE_CRITERIA.md`, and `ui_kits/website/README.md`.
- [ ] List every missing public route in `docs/IMPLEMENTATION_STATUS.md`.
- [ ] Decide canonical route names from `docs/SITE_MAP.md`; do not invent aliases unless the docs explicitly require redirects.
- [ ] Identify existing nav/footer links that currently point to missing routes.
- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** Missing routes and canonical URLs are documented before any page is added.

---

## Milestone 2: High-Priority Utility Pages

- [ ] Add `/book-skydebanen` using `ui_kits/website/Booking.jsx` as the reference, keeping it static/read-only unless booking integration is already scoped.
- [ ] Add `/kalender` using `ui_kits/website/Calendar.jsx` as the reference. If Google Calendar embed details are unavailable, render the approved static/placeholder state and document the integration gap.
- [ ] Add `/bliv-medlem` using `ui_kits/website/Membership.jsx` as the reference.
- [ ] Add E2E smoke coverage for each page in `tests/e2e/public-pages.spec.ts`.
- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `npm.cmd run test:e2e -- public-pages`.
- [ ] Update `docs/IMPLEMENTATION_STATUS.md`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** The primary public CTA destinations exist and pass smoke tests.

---

## Milestone 3: Activities Pages

- [ ] Add `/aktiviteter/jagt`.
- [ ] Add `/aktiviteter/hjalp-til-jagtproven`.
- [ ] Add `/aktiviteter/premieskydninger` using `ui_kits/website/Activities.jsx` as the reference.
- [ ] If prize-shoot detail pages are required by `docs/SITE_MAP.md`, add only the documented set and keep content static.
- [ ] Extend E2E smoke coverage for each route.
- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `npm.cmd run test:e2e -- public-pages`.
- [ ] Update `docs/IMPLEMENTATION_STATUS.md`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** Activity routes from the site map exist or are explicitly deferred with a reason.

---

## Milestone 4: Practical Info Pages And Navigation Alignment

- [ ] Add `/praktisk-info/aabningstider-og-skydetider`.
- [ ] Add `/praktisk-info/bestyrelsen`.
- [ ] Add `/find-os` if required by `docs/SITE_MAP.md` or current footer links.
- [ ] Update `components/Nav.tsx` links to canonical implemented routes.
- [ ] Update `components/Footer.tsx` links to canonical implemented routes.
- [ ] Extend E2E smoke coverage for practical info routes and nav/footer link destinations.
- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `npm.cmd run test:e2e -- public-pages`.
- [ ] Update `docs/IMPLEMENTATION_STATUS.md`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** Public navigation no longer points at missing internal pages unless the destination is intentionally external or deferred.

---

## Stop Condition

Stop after this plan is created or, when executed later, after public pages are complete/documented. Do not perform admin/Supabase hardening or final deployment QA from this plan.

