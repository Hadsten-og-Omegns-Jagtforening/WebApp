# Final QA Deployment Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify the HOJ webapp is ready for deployment review, with clear documentation of any remaining blockers.

**Architecture:** This is a final verification and documentation pass. It should not add features. Only fix small blockers discovered during QA when the fix is low risk and directly required by acceptance criteria.

**Tech Stack:** Next.js 15 App Router, TypeScript, Supabase, Vitest, Playwright, ESLint, Vercel deployment conventions.

---

## Guardrails

- Preserve the Claude baseline.
- Do not redesign or rebuild.
- Do not add new features unless they unblock documented acceptance criteria.
- Do not modify `ui_kits/`.
- Keep fixes small and directly tied to failing validation, accessibility, or deployment readiness.
- Run `.agent/REVIEW_LOOP.md` after each milestone.

---

## Files Likely To Change

Documentation:
- `docs/IMPLEMENTATION_STATUS.md`
- `docs/TESTING.md`
- `docs/ACCEPTANCE_CRITERIA.md`
- `docs/README.md`

Configuration, only if QA proves an issue:
- `next.config.ts`
- `middleware.ts`
- `playwright.config.ts`
- `vitest.config.ts`
- `package.json`

App files, only for direct QA blockers:
- `app/**`
- `components/**`
- `lib/**`

Do not change:
- `ui_kits/**`

---

## Validation Commands

Run the full suite:

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
npm.cmd run test:e2e
```

Run local app for manual QA:

```powershell
npm.cmd run dev
```

Production smoke after build:

```powershell
npm.cmd run start
```

---

## Milestone 1: Full Automated Validation

- [x] Read `docs/IMPLEMENTATION_STATUS.md`, `docs/ACCEPTANCE_CRITERIA.md`, and `docs/TESTING.md`.
- [x] Run `npm.cmd test`.
- [x] Run `npm.cmd run lint`.
- [x] Run `npm.cmd run build`.
- [x] Run `npm.cmd run test:e2e`.
- [x] Record exact results in `docs/IMPLEMENTATION_STATUS.md`.
- [x] If a command fails, classify it as app bug, test bug, environment issue, Supabase/env issue, or missing external service.
- [x] Fix only small direct blockers; larger fixes must become a new ExecPlan.
- [x] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** Automated validation is either passing or blockers are precisely documented.

---

## Milestone 2: Manual Responsive And Accessibility QA

- [ ] Start the app with `npm.cmd run dev`.
- [ ] Check desktop and mobile layouts for `/`, `/nyheder`, each implemented public page, and `/admin`.
- [ ] Check keyboard access for nav dropdowns, mobile menu, login form, admin forms, buttons, links, and dialogs.
- [ ] Check visible focus states.
- [ ] Check heading order on major public pages.
- [ ] Check image alt text and decorative-image handling.
- [ ] Check text contrast against `docs/DESIGN_SYSTEM.md`.
- [ ] Record pass/fail findings in `docs/IMPLEMENTATION_STATUS.md`.
- [ ] Fix only small direct QA blockers.
- [ ] Run `npm.cmd test`, `npm.cmd run lint`, and `npm.cmd run build`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** Manual QA results are documented and any remaining issues are explicit.

---

## Milestone 3: Supabase And Deployment Readiness

- [ ] Verify required environment variables are documented: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Verify Supabase migration setup is documented.
- [ ] Verify storage bucket setup is documented if image upload is enabled.
- [ ] Verify admin user provisioning is documented.
- [ ] Verify `next.config.ts` allows required image hosts and security headers.
- [ ] Verify deployment instructions for Vercel or the selected host are accurate.
- [ ] Update `docs/README.md`, `docs/TESTING.md`, or `docs/IMPLEMENTATION_STATUS.md` if deployment instructions are stale.
- [ ] Run `npm.cmd run build`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** A deployer can provision Supabase, set env vars, build the app, and understand any remaining limitations.

---

## Milestone 4: Final Readiness Record

- [ ] Summarize implemented routes and deferred routes in `docs/IMPLEMENTATION_STATUS.md`.
- [ ] Summarize validation results with dates and commands.
- [ ] Summarize known production blockers, if any.
- [ ] Summarize manual QA status.
- [ ] Confirm no unrelated files were changed.
- [ ] Run final `git status --short --branch`.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** The project is ready for deployment review or has a short, concrete blocker list.

---

## Stop Condition

Stop after this plan is created or, when executed later, after final QA/deployment readiness is documented. Do not continue into feature development from this plan.

