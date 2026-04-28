# UI Reference Comparison Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compare the current production UI against the approved HOJ references and document only concrete mismatches.

**Architecture:** Use the current app as the baseline and `ui_kits/website/`, `ui_kits/admin/`, `docs/DESIGN_SYSTEM.md`, and `docs/ACCEPTANCE_CRITERIA.md` as comparison references. This plan is primarily inspection and documentation; fixes belong in later scoped work after mismatches are proven.

**Tech Stack:** Next.js dev server, browser screenshots, Playwright where useful, project CSS design system, Markdown status docs.

---

## Guardrails

- Preserve the Claude baseline.
- Do not redesign from scratch.
- Do not replace `Nav`, `Footer`, `Hero`, `NewsCard`, `NewsFeed`, or admin components.
- Do not touch admin/auth/Supabase logic.
- Do not modify `ui_kits/`.
- Only document mismatches that are observable, reproducible, and tied to approved references or acceptance criteria.
- Run `.agent/REVIEW_LOOP.md` after each milestone.

---

## Files Likely To Change

Primary:
- `docs/IMPLEMENTATION_STATUS.md`

Only if the project already tracks visual QA there:
- `docs/ACCEPTANCE_CRITERIA.md`
- `docs/TESTING.md`

Files to inspect but not change:
- `ui_kits/website/index.html`
- `ui_kits/website/kit.css`
- `ui_kits/website/*.jsx`
- `ui_kits/admin/*.html`
- `ui_kits/admin/admin.css`
- `components/*.tsx`
- `components/admin/*.tsx`
- `app/(public)/**`
- `app/admin/**`

---

## Validation Commands

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
```

If browser checks are run:

```powershell
npm.cmd run dev
npm.cmd run test:e2e
```

---

## Milestone 1: Public UI Comparison

- [ ] Read `docs/DESIGN_SYSTEM.md`, `docs/SITE_MAP.md`, `docs/ACCEPTANCE_CRITERIA.md`, and `docs/IMPLEMENTATION_STATUS.md`.
- [ ] Start the app with `npm.cmd run dev`.
- [ ] Capture desktop and mobile screenshots for `/`.
- [ ] Capture desktop and mobile screenshots for `/nyheder`.
- [ ] Capture desktop and mobile screenshots for one `/nyheder/[slug]` state if test data exists; otherwise document the blocker.
- [ ] Compare against `ui_kits/website/Home.jsx`, `ui_kits/website/News.jsx`, `ui_kits/website/kit.css`, and `ui_kits/website/index.html`.
- [ ] Record concrete mismatches in `docs/IMPLEMENTATION_STATUS.md` under a UI comparison section.
- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** Public UI gaps are documented without making app changes.

---

## Milestone 2: Navigation And Footer Comparison

- [ ] Compare `components/Nav.tsx` behavior and links against `ui_kits/website/Nav.jsx` and `docs/SITE_MAP.md`.
- [ ] Compare `components/Footer.tsx` links, content, and visual structure against `ui_kits/website/Footer.jsx`.
- [ ] Record route mismatches separately from visual mismatches.
- [ ] Record accessibility concerns such as hover-only dropdowns, missing button semantics, focus visibility, or mobile menu issues.
- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** Navigation/footer work is categorized for either route completion or targeted UI fixes.

---

## Milestone 3: Admin UI Comparison

- [ ] Capture desktop and mobile screenshots for `/admin`.
- [ ] If authenticated access is available, capture `/admin/nyheder`, `/admin/nyheder/ny`, and `/admin/nyheder/[id]`; otherwise document auth/test-data blocker.
- [ ] Compare against `ui_kits/admin/login.html`, `ui_kits/admin/news-list.html`, `ui_kits/admin/news-edit.html`, and `ui_kits/admin/admin.css`.
- [ ] Record only concrete admin UI mismatches in `docs/IMPLEMENTATION_STATUS.md`.
- [ ] Do not change admin code in this plan.
- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** Admin visual and UX gaps are documented for the admin hardening plan or a future targeted visual-fix plan.

---

## Stop Condition

Stop after this plan is created or, when executed later, after comparison results are documented. Do not implement fixes in this plan.

