# Review Loop

Use this after every milestone.

## 1. Inspect

Check:

- `git diff`
- changed files
- deleted files
- new dependencies
- docs changes
- tests/validation changes

Summarize what changed before reviewing.

## 2. Review categories

Review the work as:

### Product reviewer
- Does the change match the active ExecPlan?
- Did the agent expand scope?
- Are docs/status updated if needed?

### Engineering reviewer
- Is the change minimal?
- Is existing structure preserved?
- Are dependencies justified?
- Are generated/tool folders untouched?

### QA reviewer
- Did validation run?
- Are failures documented clearly?
- Are environment issues separated from code issues?

### Design reviewer
- If UI was changed, does it preserve the approved Claude/design baseline?
- If the active plan is not visual, no UI changes should exist.

### Security reviewer
- Are secrets avoided?
- Was admin/auth/Supabase touched without scope?
- Are unsafe changes introduced?

## 3. Severity

Classify findings:

- Critical: build broken, data/security issue, app unusable, wrong branch/path, missing required source-of-truth docs
- Major: scope expansion, validation not run, docs contradict code, required milestone incomplete
- Minor: wording, formatting, small cleanup
- Note: future improvement

Critical and Major issues must be fixed before continuing.

## 4. Validate

Run the commands required by the active ExecPlan.

Default foundation validation:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build