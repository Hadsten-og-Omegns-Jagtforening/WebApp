# Testing

## Purpose

Defines how validation is performed for the HOJ web application.

Focus:
- build stability
- type safety
- lint correctness

---

## Commands

Run in Windows:

npm.cmd run typecheck
npm.cmd run lint
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

---

## Known Limitations

- No full test suite required yet
- No automated UI tests yet
- Environment issues (Windows, permissions) may occur

If something fails:
→ document it in IMPLEMENTATION_STATUS.md  
→ do NOT guess a fix

---

## Rules

- Always run validation after changes
- Do not ignore errors without documenting them
- Do not introduce new tooling without a plan