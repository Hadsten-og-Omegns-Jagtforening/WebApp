# Simply-only Feasibility Assessment Plan

**Goal:** Assess whether a Simply-only implementation is feasible and sensible for the HOJ project under the updated customer profile: low traffic, no expected post-launch feature development, simple admin needs, and a preference for keeping everything at Simply if realistic.

**Scope:** Documentation and planning only. No refactor, no provider switch, no deployment changes, no removal of Supabase code.

---

## Guardrails

- Preserve the current Claude baseline.
- Do not change app code or deployment settings.
- Do not migrate off Vercel/Supabase in this plan.
- Do not propose new product scope.
- Distinguish clearly between:
  - "public site can be rendered statically"
  - "current implementation can be deployed as-is on Simply"
  - "a rewritten Simply-only solution is feasible"

---

## Inputs

- `docs/HOSTING_DECISION.md`
- `docs/IMPLEMENTATION_STATUS.md`
- current Next.js app structure
- current Supabase/auth/news/image-upload implementation
- current official Simply hosting/runtime capabilities

---

## Milestone 1: Inventory Current Functionality

- [x] Confirm the current public routes and admin routes from `docs/IMPLEMENTATION_STATUS.md`.
- [x] Confirm which parts of the current app rely on:
  - server-side rendering
  - middleware
  - cookies/auth sessions
  - Server Actions
  - Supabase database/storage
- [x] Summarize the actual admin feature set in place today.
- [x] Record the findings in `docs/IMPLEMENTATION_STATUS.md`.
- [x] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** The current feature inventory is precise and grounded in code/docs.

---

## Milestone 2: Assess Simply Hosting Fit

- [x] Assess whether the public site could be served on Simply as:
  - static export only
  - classic PHP/MySQL-style hosting
  - ASP.NET/.NET Core-style hosting if supported
- [x] Identify which current Next.js features block or complicate static export.
- [x] Identify what would need to be rewritten for a Simply-only stack:
  - admin auth
  - news CRUD
  - image upload/storage
  - archive/retention
  - database layer
- [x] Classify the rewrite complexity and risk.
- [x] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** The difference between "deploy as-is" and "rewrite for Simply-only" is explicit.

---

## Milestone 3: Recommend The Most Sensible Simply-only Backend

- [x] Compare PHP + MySQL versus ASP.NET/.NET Core + MySQL for this customer profile.
- [x] Evaluate security expectations for:
  - password auth
  - sessions
  - upload validation
  - CSRF/XSS
  - admin route protection
- [x] Recommend the better Simply-only backend approach.
- [x] Update `docs/HOSTING_DECISION.md` with a revised note reflecting the new customer assumptions.
- [x] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** The recommended Simply-only direction is concrete and technically defensible.

---

## Milestone 4: Final Feasibility Record

- [x] Create a concise final assessment in `docs/HOSTING_DECISION.md`.
- [x] Update `docs/IMPLEMENTATION_STATUS.md` with the new feasibility status.
- [x] Document milestone count / complexity estimate for a future Simply-only rewrite.
- [x] Confirm no code or deployment settings changed.
- [x] Run required validation if repository policy applies to documentation changes.
- [x] Run `.agent/REVIEW_LOOP.md`.

**Exit criteria:** The repository contains a clear answer on whether Simply-only is feasible, sensible, and recommended.

---

## Final security/design decision

### Security-by-design conclusion

A minimal PHP + MySQL admin panel **can** be built with the required controls:

- no self-registration
- very small admin-account set
- modern password hashing
- secure server-side sessions
- CSRF protection
- prepared statements
- strict upload validation
- simple audit trail
- manual backup/export

However, for this customer profile, those controls would remain **custom application responsibilities** rather than managed platform responsibilities.

That means the system would still need:

- periodic PHP/runtime review
- periodic dependency review if any libraries are used
- manual backup testing
- occasional account and upload hygiene review
- someone who can respond if the admin login or uploads are abused

With **no dedicated security owner, no backup owner, no monitoring owner, and no incident-response capacity**, this is a weak operating posture for a custom-login custom-upload application.

### Design-quality conclusion

The current public design can be reproduced at near-identical quality in a Simply-only rewrite.

Lowest-risk design-preservation approach:

- preserve the public frontend as static HTML/CSS/vanilla JS generated from the current approved design
- build a separate minimal PHP admin and news backend

This is materially lower risk than rebuilding the whole public UI as server-rendered PHP templates from scratch.

### Final recommendation

**Recommendation: C. Do not greenlight; stay with Vercel/Supabase.**

Reason:

- the current Vercel/Supabase solution is already deployment-ready
- it offloads materially more security and operations burden
- it is a better fit for an organization with no real maintenance owner
- a Simply-only rewrite would increase custom security responsibility exactly where the customer is weakest operationally

If the customer still wants Simply-only later, the project should only be greenlit after explicit acceptance of:

- ongoing PHP/runtime maintenance
- a named backup/restore owner
- a named admin-account owner
- a manual security/ops review rhythm

## Stop Condition

Stop after documentation and feasibility assessment. Do not begin a rewrite or provider migration from this plan.
