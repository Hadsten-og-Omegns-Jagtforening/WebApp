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

- [x] Read `docs/DESIGN_SYSTEM.md`, `docs/SITE_MAP.md`, `docs/ACCEPTANCE_CRITERIA.md`, and `docs/IMPLEMENTATION_STATUS.md`.
- [x] Start the app with `npm.cmd run dev`.
- [x] Capture desktop and mobile screenshots for `/`.
- [x] Capture desktop and mobile screenshots for `/nyheder`.
- [x] Capture desktop and mobile screenshots for one `/nyheder/[slug]` state if test data exists; otherwise document the blocker.
- [x] Compare against `ui_kits/website/Home.jsx`, `ui_kits/website/News.jsx`, `ui_kits/website/kit.css`, and `ui_kits/website/index.html`.
- [x] Record concrete mismatches in `docs/IMPLEMENTATION_STATUS.md` under a UI comparison section.
- [x] Run `npm.cmd test`.
- [x] Run `npm.cmd run lint`.
- [x] Run `npm.cmd run build`.
- [x] Run `.agent/REVIEW_LOOP.md`.

Validation note: `npm.cmd test` initially failed because Vitest collected tests inside `.claude/worktrees/clever-galileo-7fee33`, causing invalid hook call errors from a second React tree. With explicit user approval, `vitest.config.ts` was mechanically updated to exclude `.claude`, `.claire`, `.superpowers`, and `.agent`. After that fix, `typecheck`, `lint`, elevated `build`, and elevated `test` passed. Non-elevated `build` and `test` can fail with the known Windows `spawn EPERM` environment issue.

**Exit criteria:** Public UI gaps are documented without making app changes.

---

## Milestone 2: Navigation And Footer Comparison

- [x] Compare `components/Nav.tsx` behavior and links against `ui_kits/website/Nav.jsx` and `docs/SITE_MAP.md`.
- [x] Compare `components/Footer.tsx` links, content, and visual structure against `ui_kits/website/Footer.jsx`.
- [x] Record route mismatches separately from visual mismatches.
- [x] Record accessibility concerns such as hover-only dropdowns, missing button semantics, focus visibility, or mobile menu issues.
- [x] Run `npm.cmd test`.
- [x] Run `npm.cmd run lint`.
- [x] Run `npm.cmd run build`.
- [x] Run `.agent/REVIEW_LOOP.md`.

Validation note: milestone 2 validation passed with `npm.cmd run typecheck`, `npm.cmd run lint`, elevated `npm.cmd test`, and elevated `npm.cmd run build`. Visual/UX Critical and Major findings are documented only because UI fixes are outside plan 005 scope.

**Exit criteria:** Navigation/footer work is categorized for either route completion or targeted UI fixes.

---

## Milestone 3: Admin UI Comparison

- [x] Capture desktop and mobile screenshots for `/admin`.
- [x] If authenticated access is available, capture `/admin/nyheder`, `/admin/nyheder/ny`, and `/admin/nyheder/[id]`; otherwise document auth/test-data blocker.
- [x] Compare against `ui_kits/admin/login.html`, `ui_kits/admin/news-list.html`, `ui_kits/admin/news-edit.html`, and `ui_kits/admin/admin.css`.
- [x] Record only concrete admin UI mismatches in `docs/IMPLEMENTATION_STATUS.md`.
- [x] Do not change admin code in this plan.
- [x] Run `npm.cmd test`.
- [x] Run `npm.cmd run lint`.
- [x] Run `npm.cmd run build`.
- [x] Run `.agent/REVIEW_LOOP.md`.

Validation note: milestone 3 validation passed with `npm.cmd run typecheck`, `npm.cmd run lint`, elevated `npm.cmd test`, and elevated `npm.cmd run build`. Authenticated admin pages were documented as blocked by missing authenticated access/test data.

**Exit criteria:** Admin visual and UX gaps are documented for the admin hardening plan or a future targeted visual-fix plan.

---

## Stop Condition

Stop after this plan is created or, when executed later, after comparison results are documented. Do not implement fixes in this plan.

