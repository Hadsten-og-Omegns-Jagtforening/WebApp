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

- [ ] Create `docs/LAUNCH_CHECKLIST.md`.
- [ ] Add Vercel project setup checklist.
- [ ] Add Supabase production checklist.
- [ ] Add Simply DNS/mail checklist.
- [ ] Add security-by-design launch checklist.
- [ ] Add customer handover checklist.
- [ ] Add post-deploy smoke test checklist.
- [ ] Add rollback checklist.
- [ ] Run validation.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** All launch checklists exist in one operational document and match the current accepted architecture.

---

## Milestone 2: Deployment Doc Alignment

- [ ] Update `docs/DEPLOYMENT.md` if any launch-preparation instructions are stale or incomplete.
- [ ] Update `docs/HOSTING_DECISION.md` to record that Simply-only is paused unless the customer explicitly accepts rewrite/security tradeoffs.
- [ ] Update `docs/IMPLEMENTATION_STATUS.md` with launch-preparation status and any validated blockers or limitations.
- [ ] Run validation.
- [ ] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** Deployment, hosting-decision, and implementation-status docs are aligned with the launch plan.

---

## Stop Condition

Stop after documentation/checklist work and validation. Do not continue into deployment execution or feature work from this plan.
