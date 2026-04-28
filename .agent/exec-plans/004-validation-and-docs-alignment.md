# Validation And Docs Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconfirm the current Claude baseline, restore reliable validation, and align documentation with the actual implemented routes and features.

**Architecture:** This plan is documentation and validation focused. It must not change application behavior unless dependency restoration is required to run already-declared project scripts. `docs/IMPLEMENTATION_STATUS.md` becomes the factual tracker for what exists, what passes, and what remains.

**Tech Stack:** Next.js 15 App Router, TypeScript, npm on Windows via `npm.cmd`, Vitest, Playwright, ESLint, project Markdown docs.

---

## Guardrails

- Preserve the Claude baseline.
- Do not redesign or rebuild any route/component.
- Do not modify `ui_kits/`.
- Do not touch admin/auth/Supabase behavior.
- Do not add new dependencies; use `npm ci` only to restore dependencies already locked in `package-lock.json`.
- Run `.agent/REVIEW_LOOP.md` after each milestone.

---

## Files Likely To Change

- `docs/IMPLEMENTATION_STATUS.md`
- `docs/TESTING.md`
- `docs/SITE_MAP.md`
- `docs/README.md`
- `docs/ACCEPTANCE_CRITERIA.md`

Files that should normally not change in this plan:
- `app/**`
- `components/**`
- `lib/**`
- `supabase/**`
- `ui_kits/**`
- `package.json`
- `package-lock.json`, except if `npm ci` reveals the lockfile must be regenerated and the reason is documented first.

---

## Validation Commands

Use Windows-safe npm invocation:

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
npm.cmd run test:e2e
```

If dependencies are missing:

```powershell
npm.cmd ci
```

If Playwright browsers are missing, record that in `docs/IMPLEMENTATION_STATUS.md` before installing. Browser installation is environment setup, not app implementation.

---

## Milestone 1: Repository And Dependency Baseline

- [ ] Read `AGENTS.md`, `docs/README.md`, `docs/DESIGN_SYSTEM.md`, `docs/SITE_MAP.md`, `docs/ACCEPTANCE_CRITERIA.md`, `docs/TESTING.md`, `docs/IMPLEMENTATION_STATUS.md`, and `.agent/REVIEW_LOOP.md`.
- [ ] Run `git status --short --branch` and record branch plus dirty files in `docs/IMPLEMENTATION_STATUS.md`.
- [ ] Inspect `package.json`, `package-lock.json`, and `node_modules/.bin` for expected binaries: `next`, `eslint`, `vitest`, `playwright`.
- [ ] If expected binaries are missing, run `npm.cmd ci`.
- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** `docs/IMPLEMENTATION_STATUS.md` records current branch, dependency state, and exact pass/fail status for unit tests, lint, and build.

---

## Milestone 2: Route And Feature Inventory

- [ ] Enumerate implemented App Router pages under `app/`.
- [ ] Compare implemented routes to `docs/SITE_MAP.md`.
- [ ] Mark each route in `docs/IMPLEMENTATION_STATUS.md` as `implemented`, `stub`, `missing`, `external`, or `deferred`.
- [ ] Record that the existing public shell uses `app/(public)/layout.tsx` with `Nav` and `Footer`.
- [ ] Record that admin uses `app/admin/layout.tsx` and should remain separate from the public shell.
- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** Documentation matches actual route structure and does not claim missing routes are complete.

---

## Milestone 3: Acceptance Criteria Alignment

- [ ] Compare `docs/ACCEPTANCE_CRITERIA.md` against the current implementation.
- [ ] Update `docs/IMPLEMENTATION_STATUS.md` with a checklist of criteria that are satisfied, unsatisfied, blocked by environment, or require manual Supabase verification.
- [ ] Update `docs/TESTING.md` only if validation commands or known Windows invocation details are inaccurate.
- [ ] Do not change app code to satisfy criteria in this plan.
- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** Remaining work is visible and sorted into future plans rather than mixed into validation/docs work.

---

## Stop Condition

Stop after this plan is created or, when executed later, after docs and validation status are aligned. Do not continue into UI comparison, public pages, admin hardening, or final QA from this plan.

