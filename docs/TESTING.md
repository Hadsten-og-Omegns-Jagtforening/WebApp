# Testing

## Purpose

Defines how validation is performed for the HOJ web application.

Focus:
- build stability
- type safety
- lint correctness
- targeted regression coverage for verified issues

---

## Commands

Run in Windows:

npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build

---

## Expected Results

All commands must:
- complete successfully
- produce no blocking errors

---

## Validation Scope

### Typecheck
- no TypeScript errors

### Lint
- no critical lint issues

### Build
- Next.js compiles successfully

### Test
- Vitest unit/component regression suite passes

---

## Known Limitations

- UI/browser validation is still milestone-specific and may require Playwright or browser review
- Environment issues (Windows, permissions) may occur

If something fails:
→ document it in IMPLEMENTATION_STATUS.md  
→ do NOT guess a fix

---

## Rules

- Always run validation after changes
- Do not ignore errors without documenting them
- Do not introduce new tooling without a plan
