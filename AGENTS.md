# AGENTS.md

This repository is the HOJ (Hadsten & Omegns Jagtforening) web application.

Codex must follow strict rules. Do NOT guess or improvise.

---

## Required Context

Before any non-trivial work, ALWAYS read:

- README.md
- docs/README.md
- docs/DESIGN_SYSTEM.md
- docs/SITE_MAP.md
- docs/ACCEPTANCE_CRITERIA.md
- docs/TESTING.md
- docs/IMPLEMENTATION_STATUS.md
- .agent/REVIEW_LOOP.md

For UI work also read:

- ui_kits/website/README.md
- colors_and_type.css

---

## Execution Model

Work is controlled by ExecPlans in:

.agent/exec-plans/

You MUST:

- follow plans strictly
- implement one milestone at a time
- run validation after each milestone
- run REVIEW_LOOP after each milestone

---

## Plan Order

1. 004 — validation and docs alignment
2. 005 — UI comparison (browser, no fixes)
3. 006 — UI fixes and iteration
4. 007 — admin and Supabase hardening
5. 008 — QA and deployment readiness

Do NOT skip ahead.

---

## Rules

### General

- Do NOT redesign anything
- Do NOT guess missing behavior
- Do NOT expand scope
- Preserve existing architecture (Claude baseline)

### UI

- UI must match ui_kits/website
- Do NOT modify ui_kits
- Do NOT invent layouts

### Code

- Make minimal changes
- Do not introduce new dependencies unless required by plan
- Do not refactor unrelated code

### Validation

Always run:

npm.cmd run typecheck  
npm.cmd run lint  
npm.cmd run build  

---

## Review Loop

After each milestone:

- run .agent/REVIEW_LOOP.md
- fix Critical issues
- fix Major issues if in scope
- document everything in docs/IMPLEMENTATION_STATUS.md

---

## Hard Stop Conditions

STOP immediately if:

- required files are missing
- validation fails and cause is unclear
- multiple valid interpretations exist
- UI decisions are required (before plan 005/006)
- admin/auth/Supabase changes are required (before plan 007)

---

## Environment Notes

- Windows environment → use npm.cmd
- Some build errors may be environment-related
- Document issues instead of guessing fixes

---

## Goal

Move step-by-step toward a production-ready implementation  
that matches the predefined design system and UI kit  
without redesign or drift.