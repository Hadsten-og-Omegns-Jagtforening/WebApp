# Production Launch Preparation Plan

**Goal:** Prepare the HOJ project for a responsible production launch on the accepted architecture:

- Simply for domain, DNS, and email
- Vercel Hobby/Free for frontend hosting
- Supabase Free for backend/auth/storage

**Scope:** Documentation, checklists, and launch-readiness planning only. Do not continue Simply-only rewrite work. Do not change providers. Do not add features. Only change app code if a direct critical launch blocker is discovered.

---

## Guardrails

- Preserve the current Claude baseline.
- Do not refactor or redesign.
- Do not expand product scope.
- Do not change hosting providers.
- Documentation/checklist work first.
- If a critical launch blocker is found, document it clearly and stop before large changes.

---

## Files Likely To Change

- `docs/LAUNCH_CHECKLIST.md`
- `docs/DEPLOYMENT.md`
- `docs/HOSTING_DECISION.md`
- `docs/IMPLEMENTATION_STATUS.md`
- `.agent/exec-plans/010-production-launch-preparation.md`

Do not change:

- `ui_kits/**`
- app code unless a direct launch blocker is verified

---

## Validation Commands

Run after documentation updates:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

Run `npm.cmd run test:e2e` only if this plan introduces a change that can affect routes or UI.

---

## Milestone 1: Launch Checklists

- [x] Create `docs/LAUNCH_CHECKLIST.md`.
- [x] Add Vercel project setup checklist.
- [x] Add Supabase production checklist.
- [x] Add Simply DNS/mail checklist.
- [x] Add security-by-design launch checklist.
- [x] Add customer handover checklist.
- [x] Add post-deploy smoke test checklist.
- [x] Add rollback checklist.
- [x] Run validation.
- [x] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** All launch checklists exist in one operational document and match the current accepted architecture.

---

## Milestone 2: Deployment Doc Alignment

- [x] Update `docs/DEPLOYMENT.md` if any launch-preparation instructions are stale or incomplete.
- [x] Update `docs/HOSTING_DECISION.md` to record that Simply-only is paused unless the customer explicitly accepts rewrite/security tradeoffs.
- [x] Update `docs/IMPLEMENTATION_STATUS.md` with launch-preparation status and any validated blockers or limitations.
- [x] Run validation.
- [x] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** Deployment, hosting-decision, and implementation-status docs are aligned with the launch plan.

---

## Milestone 3: Final Local QA Follow-Up

- [x] Add a subtle `/admin` entry to the public navigation for desktop and mobile.
- [x] Improve contrast/readability for the hero `Se kalender` button without redesigning the hero.
- [x] Keep `/kalender` in placeholder mode unless the real public Google Calendar embed code or public URL is provided.
- [x] Document that the Google Calendar must be public and embeddable.
- [x] Document that a customer-approved hero image is still required before final launch.
- [x] Add a concrete old-news migration plan with a manual fallback.
- [x] Update `docs/LAUNCH_CHECKLIST.md`, `docs/DEPLOYMENT.md`, and `docs/IMPLEMENTATION_STATUS.md`.
- [x] Run validation.
- [x] Run `npm.cmd run test:e2e`.
- [x] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** The small launch-facing UI gaps are addressed, missing customer inputs are documented clearly, and the old-news migration plan exists without expanding product scope.

---

## Milestone 4: Admin Auth Onboarding And Recovery

- [x] Inspect the current `/admin` auth flow, middleware, Supabase helpers, and existing routes.
- [x] Preserve closed admin access: no public signup, manual Supabase admin provisioning only.
- [x] Add the missing password-reset request flow.
- [x] Add callback handling for Supabase recovery links if needed.
- [x] Add a dedicated update-password route for recovery-session users.
- [x] Add only the minimal login UI change needed for password recovery.
- [x] Document first-admin setup, Supabase Site URL / Redirect URL requirements, and the exact reset route flow.
- [x] Update `docs/LAUNCH_CHECKLIST.md`, `docs/DEPLOYMENT.md`, and `docs/IMPLEMENTATION_STATUS.md`.
- [x] Run validation.
- [x] Run `npm.cmd run test:e2e`.
- [x] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** Admin onboarding and password recovery work without introducing public registration or changing the hosting direction.

---

## Stop Condition

Stop after documentation/checklist work and validation. Do not continue into deployment execution or feature work from this plan.
