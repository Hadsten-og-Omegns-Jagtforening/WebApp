# Implementation Status

## Purpose

This document tracks the real state of the application.

It is the single source of truth for:
- what is implemented
- what works
- what is broken
- what is missing

This must ALWAYS match the actual code.

---

## Current State

### Admin CMS and prize activity follow-up - 2026-05-02

- Restored the public accent/title/CTA token values to the approved brass design direction in `colors_and_type.css`.
- Replaced the Præmieskydninger news/category workaround with a dedicated `public.prize_activities` data model and migration.
- Added public DB-driven prize activity cards at `/aktiviteter/premieskydninger` and detail pages at `/aktiviteter/premieskydninger/[slug]`, with fallback seed content if Supabase is unavailable.
- Replaced `/admin/premieskydninger` with a dedicated prize activity CMS for creating/editing title, period, card text, icon, sort order, active state, and rich text body.
- Updated `/kalender` so it renders the public Google Calendar for `booking@hadstenjagtforening.dk` by default and still supports `NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL` as a raw URL or copied iframe override.
- Improved the Bestyrelsen compact list with row and role/name dividers.
- Improved admin news image controls over previews, added specific Danish image validation/crop/upload errors, and kept object URLs alive for crop preview loading.
- Fixed TipTap toolbar mouse handling so formatting applies to selected text instead of losing selection on button press.
- Added publish feedback so a successful `Udgiv` action shows `Udgivet` with the check icon state.
- Added focused regression coverage for prize activity actions, calendar embed parsing, image validation/error mapping, TipTap toolbar mouse handling, migration provisioning, and public prize/calendar E2E routes.
- Validation: `npm.cmd run typecheck` passed, `npm.cmd run lint` passed, elevated `npm.cmd test` passed with 23 files / 66 tests, elevated `npm.cmd run build` passed, and elevated focused `PLAYWRIGHT_PORT=3002 npm.cmd run test:e2e -- tests/e2e/public-pages.spec.ts` passed with 17 tests.
- Browser smoke on `http://localhost:3002` verified `/aktiviteter/premieskydninger` renders 6 cards, the first card links to `/aktiviteter/premieskydninger/fastelavnsskydning`, the detail page renders, and `/kalender` uses the booking Google Calendar iframe fallback.
- Local build/E2E logs still show expected fallback warnings when the local Supabase schema does not contain `public.prize_activities`; applying `supabase/migrations/0004_prize_activities.sql` removes that warning in a configured Supabase project.

### Admin image crop preview follow-up - 2026-05-03

- The `Tilpas billede` modal now includes a news-feed card preview so editors can judge the 3:2 landing/news-card crop before uploading.
- Follow-up fix: crop preview image sources now use `FileReader.readAsDataURL()` instead of blob object URLs, so the actual selected JPG/PNG bytes remain visible while adjusting the image.
- Added regression coverage in `tests/unit/image-uploader-preview.test.tsx`.
- Browser Use verified the authenticated `/admin/nyheder/ny` editor renders and the `Hovedbillede` upload area is visible. Browser Use cannot safely drive the OS file chooser, so the modal preview is covered by component testing.
- Validation: `npm.cmd run typecheck` passed, `npm.cmd run lint` passed, elevated `npm.cmd test` passed with 24 files / 67 tests, and elevated `npm.cmd run build` passed. The local dev server was restarted afterward because the production build invalidates the active dev server artifacts.
- Follow-up validation after the FileReader change: `npm.cmd run typecheck` passed and `npm.cmd run lint` passed. Running the focused test/build with elevated permissions was blocked by the current Codex usage limit and needs to be rerun when approvals are available.

### Customer copy and navigation corrections - 2026-05-02

- Implemented the customer PDF content corrections across the public site:
  - homepage hero/quick tiles
  - `/nyheder`
  - `/aktiviteter` and its Jagt, Hjælp til jagtprøven, and Præmieskydninger subpages
  - `/praktisk-info`, Book skydebanen, Åbningstider og skydebanen, Folkene bag foreningen, and Find os-adjacent navigation
  - `/bliv-medlem`
  - new `/om-hoj` history page
- Updated the public navigation hierarchy so Aktiviteter and Praktisk info expose their subpages as grouped dropdowns, while Om HOJ and Bliv medlem are top-level links.
- Removed the separate header booking CTA while keeping Book skydebanen under Praktisk info and as normal page CTAs.
- Updated header identity to read `Hadsten og Omegns Jagtforening` with `Stiftet 1933` as the subline.
- Updated the footer copy/contact to use the PDF-provided tagline and `booking@hadstenjagtforening.dk`.
- Earlier CTA accent tokens were temporarily moved to orange; the current approved tokens are restored to the brass design direction.
- Updated `docs/SITE_MAP.md` and public-page e2e expectations to include `/om-hoj` and the revised headings.
- Browser smoke on `http://localhost:3001` verified key headings, header brand, absence of a standalone nav CTA, `/om-hoj` navigation, and no linked banevagt route.
- Validation: `npm.cmd run typecheck` passed, `npm.cmd run lint` passed, elevated `npm.cmd test` passed, and elevated `npm.cmd run build` passed. A focused Playwright public-pages run could not start because port 3000 was already occupied by a local Node server returning 500; browser smoke was run on port 3001 instead.

### Admin new-news route hardening - 2026-05-02

- Reproduced the local `/admin/nyheder/ny` failure in the in-app browser.
- Confirmed the client-side TipTap crash is fixed in source by setting `immediatelyRender: false` in `components/admin/NewsForm.tsx`.
- Added bounded Supabase auth checks through `lib/supabase/auth-timeout.ts`; admin auth now fails closed instead of letting admin routes hang indefinitely when Supabase auth does not respond.
- Added a bounded category load around `news_categories`; `/admin/nyheder/ny` now falls back to the default category list if the category query times out or the category table is unavailable.
- Restarted the stale local dev server on port 3000 and verified `/admin/nyheder/ny` renders the editor in the in-app browser with no console errors.
- Re-verified key public content routes on `http://localhost:3000`: `/`, `/aktiviteter`, `/praktisk-info`, `/book-skydebanen`, `/bliv-medlem`, and `/om-hoj`.
- Validation: `npm.cmd run typecheck` passed, `npm.cmd run lint` passed, elevated `npm.cmd test` passed with 20 files / 54 tests, elevated `npm.cmd run build` passed, and elevated focused `npm.cmd run test:e2e -- tests/e2e/public-pages.spec.ts` passed with 14 tests.

### Hosting decision addendum - 2026-04-29

- Added `docs/HOSTING_DECISION.md` as a scoped architecture decision memo comparing:
  - Simply-only
  - Simply for domain/DNS/email plus Vercel/Supabase for the app
  - Full migration to Vercel/Supabase
- The document is documentation-only. No app code, deployment config, Supabase/auth code, or infrastructure settings were changed.
- Working assumption documented: keep Simply for domain/DNS/email, use Vercel Hobby and Supabase Free as initial targets, and preserve portability.
- Recommendation documented: Option 2 is the best fit for the current Next.js/Supabase codebase, with a later upgrade path to Vercel Pro and Supabase Pro for stronger production footing.

### Deployment readiness - 2026-04-29

- Added `docs/DEPLOYMENT.md` with a deployment playbook for the recommended launch model:
  - Simply for domain/DNS/email
  - Vercel Hobby for the app
  - Supabase Free for backend/auth/storage
- Documented required env vars, Supabase migration order, storage bucket expectations, admin-user provisioning, DNS/mail separation, free-tier monitoring, upgrade triggers, and lightweight content/storage policy.
- Documented an important auth limitation: the current admin flow is password-only. Magic-link and reset-password completion flows are not implemented.
- Documented an important storage limitation: uploaded news images are not automatically cleaned up from Supabase Storage when posts are deleted or images are replaced.
- Resolved a production-start blocker by changing the repository build script from `next build --turbopack` to standard `next build`. The explicit Turbopack build path passed `build` but crashed under `next start` with `TypeError: routesManifest.dataRoutes is not iterable`. Standard `next build` now passes both build validation and local production smoke.

### Simply-only feasibility - 2026-04-29

- Added `.agent/exec-plans/009-simply-only-feasibility.md`.
- Updated `docs/HOSTING_DECISION.md` with a revised feasibility note for the changed customer profile.
- Verified that Simply-only is **not** a deployment-mode toggle for the current repository. It would require a rewrite of auth, news CRUD, image storage, and database integration.
- Verified that the public brochure-style pages could be reproduced on Simply, but the current live-news/admin implementation is not realistically deployable there as static export.
- Documented a revised strategic conclusion:
  - current Vercel/Supabase deployment remains the lowest-risk launch path
  - a future Simply-only rebuild is now a realistic option under the customer's simplified long-term needs
  - recommended Simply-only backend if pursued later: PHP + MySQL

### Simply-only final security/design gate - 2026-04-30

- Updated `.agent/exec-plans/009-simply-only-feasibility.md` with the final security-by-design and design-quality gate.
- Updated `docs/HOSTING_DECISION.md` with an explicit final recommendation.
- Final conclusion: a Simply-only PHP + MySQL rewrite is technically feasible and can preserve the public visual design closely, but it is **not responsibly greenlit** for this customer profile because the organization has no named security, monitoring, backup, or incident-response owner.
- Final recommendation recorded: **C. Do not greenlight; stay with Vercel/Supabase.**
- Conditional note recorded: a Simply-only rewrite should only be reconsidered if the customer explicitly accepts ongoing custom-security and backup/restore ownership.

### Production launch preparation - 2026-04-30

- Added `.agent/exec-plans/010-production-launch-preparation.md`.
- Added `docs/LAUNCH_CHECKLIST.md`.
- Updated `docs/DEPLOYMENT.md` to point to the launch checklist and to require explicit DNS-state capture before production DNS changes.
- Updated `docs/HOSTING_DECISION.md` to record that Simply-only rewrite work is paused unless the customer explicitly accepts the rewrite/security tradeoff.
- Launch-prep documentation now covers:
  - Vercel project setup
  - GitHub/Vercel production expectations
  - production env vars
  - Supabase migration and auth/storage setup
  - Simply DNS/mail preservation
  - security-by-design launch verification
  - customer handover
  - post-deploy smoke tests
  - rollback expectations

### Production launch follow-up QA - 2026-04-30

- Added a subtle `Admin` link to `components/Nav.tsx`. It uses the existing public nav structure, links to `/admin`, and appears in both desktop and mobile navigation without becoming a primary CTA.
- Improved contrast for the homepage hero `Se kalender` button in `components/Hero.tsx` without changing the surrounding hero layout or CTA hierarchy.
- Kept `/kalender` in placeholder mode and added an explicit in-page note that the real public Google Calendar embed code or public calendar URL for `booking@hadstenjagtforening.dk` is still required from the customer.
- Added an explicit hero-image TODO in `components/Hero.tsx` and documented that a customer-approved hero image is required before final launch.
- Added a concrete old-news migration plan and manual fallback to `docs/LAUNCH_CHECKLIST.md`.
- Updated `docs/DEPLOYMENT.md` and this file so the remaining launch inputs are explicit rather than implied.

### Calendar embed readiness - 2026-04-30

- `/kalender` now reads `NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL`.
- If the env value is present, the page renders a responsive iframe for the customer-provided public Google Calendar embed URL.
- If the env value is missing, the page renders a clear fallback message explaining that the calendar integration is still in progress and that booking can be handled via `booking@hadstenjagtforening.dk` for now.
- `.env.example`, `docs/DEPLOYMENT.md`, and `docs/LAUNCH_CHECKLIST.md` now document where the embed URL must be added later.

### Admin auth onboarding and recovery - 2026-04-30

- Added `/auth/reset-password`, `/auth/callback`, and `/auth/update-password`.
- `/admin` now links to the reset-password flow through `Glemt adgangskode?`.
- Password reset emails now use `resetPasswordForEmail()` with a callback redirect to `/auth/callback?next=/auth/update-password`.
- `/auth/callback` exchanges the Supabase auth code for a session and redirects the recovery user to the update-password screen.
- `/auth/update-password` now lets the recovery-session user set a new password and shows a clear invalid/expired-link message when no recovery session exists.
- Admin provisioning remains closed: no public signup was added, and docs now require manual Supabase Auth user creation for the first admin.
- Added focused regression coverage in `tests/unit/auth-actions.test.ts` and `tests/unit/auth-callback-route.test.ts`, plus Playwright coverage for the reset and update-password routes in `tests/e2e/admin-news.spec.ts`.

### Production admin news 500 - 2026-05-02

- Investigated the production `GET /admin/nyheder` 500 using the provided Vercel runtime log and local source inspection.
- Root cause boundary: auth was not the failing layer. The log showed Supabase Auth `/auth/v1/user` returned 200, then the admin news server render entered the service-role Supabase client/query path.
- Verified locally that `@supabase/supabase-js` throws synchronously with `supabaseKey is required.` when the service-role key is missing or blank, which matches the runtime log showing no subsequent database request before the function failed.
- Updated `app/admin/nyheder/page.tsx` so admin-news loading failures are caught, logged with `[admin/nyheder] Failed to load news posts`, and rendered as a controlled admin error state instead of crashing the server render.
- Added regression coverage in `tests/unit/admin-news-list-page.test.tsx` for the missing admin client key path.
- Validation: `npm.cmd run typecheck` passed, `npm.cmd run lint` passed, elevated focused `npm.cmd test -- tests/unit/admin-news-list-page.test.tsx` passed, elevated full `npm.cmd test` passed, and elevated `npm.cmd run build` passed after the known Windows sandbox `spawn EPERM` build issue.

### Admin CMS publishing improvements - 2026-05-02

- Added database-backed news categories through `supabase/migrations/0003_news_categories.sql` and `lib/actions/categories.ts`.
- The news editor now loads categories from Supabase, supports inline category creation, and selects a newly created category immediately.
- Enlarged the TipTap content editor and replaced the raw browser date field with a styled calendar/time picker.
- Publish now saves the current form data before setting `status = published`; drafts can keep a planned `published_at`.
- Scheduled posts are represented as `status = published` with a future `published_at`; public news queries now require `published_at <= now`.
- Added working `/admin` dashboard, `/admin/kalender`, and `/admin/premieskydninger` routes.
- Image uploads are cropped client-side to a consistent 3:2 JPEG before upload to the existing `news-images` bucket.
- Result rows are normalized server-side and on article render so score tables sort best score first.
- Admin logout now redirects to the public homepage.
- Follow-up fix: article headlines now opt out of global balanced wrapping so the single-news title uses the full article/image width.
- Follow-up fix: missing `public.news_categories` no longer logs a server error when loading the editor; the editor falls back to the default categories and category creation shows a migration-specific message.
- Follow-up fix: `/admin/nyheder/ny` no longer crashes in the browser. Root cause was TipTap SSR initialization in `NewsForm`; `useEditor` now sets `immediatelyRender: false`.
- Follow-up fix: removed duplicate TipTap Link/Underline registration because StarterKit already includes both in the installed TipTap version.
- Follow-up fix: auth redirects now match the intended admin flow: sign-in and password-update redirect to `/admin`, sign-out redirects to `/`.
- Initial validation: `npm.cmd run typecheck` passed and `npm.cmd run lint` passed. Unprivileged `npm.cmd test -- ...` and `npm.cmd run build` were blocked in the sandbox by Windows `spawn EPERM`.
- Follow-up validation: Browser Use reproduced the `/admin/nyheder/ny` crash locally, then verified that clicking `+ Ny nyhed` from `/admin/nyheder` reaches `/admin/nyheder/ny` and renders the form. `npm.cmd run typecheck` passed, `npm.cmd run lint` passed, elevated `npm.cmd test` passed with 19 files / 51 tests, and elevated `npm.cmd run build` passed.

### Route inventory - 2026-04-29

| Route | Status | Source |
|---|---|---|
| `/` | implemented | `app/(public)/page.tsx` |
| `/nyheder` | implemented | `app/(public)/nyheder/page.tsx` |
| `/nyheder/[slug]` | implemented | `app/(public)/nyheder/[slug]/page.tsx` |
| `/kalender` | implemented | `app/(public)/kalender/page.tsx` |
| `/book-skydebanen` | implemented | `app/(public)/book-skydebanen/page.tsx` |
| `/aktiviteter` | implemented | `app/(public)/aktiviteter/page.tsx` |
| `/aktiviteter/jagt` | implemented | `app/(public)/aktiviteter/jagt/page.tsx` |
| `/aktiviteter/hjalp-til-jagtproven` | implemented | `app/(public)/aktiviteter/hjalp-til-jagtproven/page.tsx` |
| `/aktiviteter/premieskydninger` | implemented | `app/(public)/aktiviteter/premieskydninger/page.tsx` |
| `/aktiviteter/premieskydninger/[slug]` | implemented | `app/(public)/aktiviteter/premieskydninger/[slug]/page.tsx` |
| `/praktisk-info` | implemented | `app/(public)/praktisk-info/page.tsx` |
| `/praktisk-info/aabningstider-og-skydetider` | implemented | `app/(public)/praktisk-info/aabningstider-og-skydetider/page.tsx` |
| `/praktisk-info/bestyrelsen` | implemented | `app/(public)/praktisk-info/bestyrelsen/page.tsx` |
| `/bliv-medlem` | implemented | `app/(public)/bliv-medlem/page.tsx` |
| `/find-os` | implemented | `app/(public)/find-os/page.tsx` |
| `/admin` | implemented | `app/admin/page.tsx` |
| `/admin/nyheder` | implemented | `app/admin/nyheder/page.tsx` |
| `/admin/nyheder/ny` | implemented | `app/admin/nyheder/ny/page.tsx` |
| `/admin/nyheder/[id]` | implemented | `app/admin/nyheder/[id]/page.tsx` |
| `/admin/premieskydninger` | implemented | `app/admin/premieskydninger/page.tsx` |
| `/admin/premieskydninger/ny` | implemented | `app/admin/premieskydninger/ny/page.tsx` |
| `/admin/premieskydninger/[id]` | implemented | `app/admin/premieskydninger/[id]/page.tsx` |

### Layout inventory - 2026-04-28

- Public shell uses `app/(public)/layout.tsx` with `components/Nav.tsx` and `components/Footer.tsx`.
- Admin shell uses `app/admin/layout.tsx` and remains separate from the public shell.

### Route/link notes - 2026-04-29

- `docs/SITE_MAP.md` now records the canonical public route hierarchy for plan 006: parent overview routes plus nested activity and practical-info routes from the approved UI kit/plan.
- `components/Nav.tsx` now uses canonical implemented public routes from `docs/SITE_MAP.md`, including `/nyheder`, activity children, practical-info children, `/bliv-medlem`, `/find-os`, and `/book-skydebanen`.
- `components/Footer.tsx` now uses canonical implemented public routes and includes the documented Zendesk support link.
- Removed public nav/footer references to non-canonical or missing internal routes: `/jagt`, `/jagtprove`, `/praemieskydninger`, `/aabningstider`, `/bestyrelsen`, and `/arkiv`.

### Public

- Homepage (`/`) -> implemented
- Nav -> implemented
- Footer -> implemented

### News

- `/nyheder` -> implemented (Claude baseline)
- `/nyheder/[slug]` -> implemented

### Admin

- `/admin` -> implemented
- `/admin/nyheder` -> implemented
- `/admin/nyheder/ny` -> implemented
- `/admin/nyheder/[id]` -> implemented

### Backend

- Supabase integration -> implemented
- Server actions -> implemented

### Admin/Supabase audit findings - 2026-04-29

| Severity | Area | Verified issue | File(s) |
|---|---|---|---|
| Major | Publish flow integrity | The edit-page publish action always calls `publishPost()` after `updatePost()`, but it ignores any `{ error }` returned by `updatePost()`. A failed content update can still flip the row to `published`, leaving stale or partial content publicly visible. | `app/admin/nyheder/[id]/page.tsx`, `lib/actions/news.ts` |
| Major | Public article cache invalidation | `updatePost()` and `publishPost()` revalidate `/`, `/nyheder`, and `/admin/nyheder`, but not the concrete `/nyheder/[slug]` route for the edited post. Published article pages can remain stale after admin edits or publish actions. | `lib/actions/news.ts` |
| Major | Rich-text link allowlist | `sanitizeBody()` intends to allow only `https://` and relative links, but the current `startsWith('/')` check also allows protocol-relative URLs such as `//evil.example`, which escape the stated allowlist. | `lib/sanitize.ts` |
| Major | Storage/schema alignment | The code uploads images to the `news-images` storage bucket, but the repo’s only migration creates the `news` table and RLS only. No storage bucket or storage policies are defined in the tool-visible migrations, so a fresh Supabase setup is not aligned with the uploader feature. | `components/admin/ImageUploader.tsx`, `supabase/migrations/0001_news_table.sql` |

### Admin/Supabase hardening status - 2026-04-29

- Resolved: the edit-page publish flow now stops and returns the `updatePost()` error instead of publishing stale content after a failed update.
- Resolved: `updatePost()` and `publishPost()` now revalidate the concrete `/nyheder/[slug]` path when the edit page passes the article slug.
- Resolved: `sanitizeBody()` now strips protocol-relative links such as `//evil.example` instead of treating them as allowed relative URLs.
- Resolved: the repo now includes `supabase/migrations/0002_news_images_storage.sql` so fresh Supabase setups provision the `news-images` bucket and matching storage policies used by the admin uploader.
- Added regression coverage:
  - `tests/unit/sanitize.test.ts`
  - `tests/unit/news-actions.test.ts`
  - `tests/unit/admin-edit-page.test.tsx`
  - `tests/unit/supabase-migrations.test.ts`

---

## Validation Status

| Check | Status | Notes |
|---|---|---|
| typecheck | PASS | `npm.cmd run typecheck` passes. |
| lint | PASS | `npm.cmd run lint` passes after the explicitly allowed mechanical `Link` fix in `components/admin/NewsForm.tsx`. |
| build | PASS | `npm.cmd run build` passes when run outside the sandbox. In the default sandbox it fails with Windows `spawn EPERM`. |
| test | PASS | `npm.cmd test` passes after the explicitly approved Vitest exclude update for generated/agent/worktree folders. In the default sandbox it can fail with Windows `spawn EPERM`; the same command passes elevated. |
| e2e | PASS | `npm.cmd run test:e2e` passes when run outside the sandbox. |
| start smoke | PASS | `npm.cmd run start -- -p 3007` boots the rebuilt app after final validation; `/` and `/admin` return 200. |

### Validation notes - 2026-04-28

- `node_modules/.bin` was missing expected locked binaries before milestone 1 validation.
- Ran `npm.cmd ci` to restore dependencies from `package-lock.json`; no new dependencies were added.
- Added the missing `typecheck` script so the documented validation command can run.
- Updated ESLint ignores so validation does not scan generated/agent worktree folders (`.claude`, `.claire`, `.superpowers`, `.agent`).
- Applied the explicitly approved mechanical lint fix in `components/admin/NewsForm.tsx`: internal `/admin/nyheder` navigation now uses Next `Link` instead of `<a>`.
- Next.js build set `tsconfig.json` `jsx` back to `preserve`, which is the mandatory Next.js setting.
- Review loop after milestone 1 found no remaining Critical or Major issues within plan 004 scope.
- Milestone 2 validation passed: `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build` all pass when build is run with elevated permission for the known Windows `spawn EPERM` sandbox issue.
- Review loop after milestone 2 found no Critical or Major issues within plan 004 scope.
- Milestone 3 validation passed when commands were run sequentially: `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build` all pass when build is run with elevated permission for the known Windows `spawn EPERM` sandbox issue.
- Review loop after milestone 3 found no Critical or Major issues within plan 004 scope.
- Plan 005 milestone 1 validation: `npm.cmd run typecheck` passes, `npm.cmd run lint` passes, and `npm.cmd run build` passes with elevated permission after the known sandbox `spawn EPERM`.
- Plan 005 validation configuration fix: with explicit user approval, `vitest.config.ts` now excludes generated/agent/worktree folders (`.claude`, `.claire`, `.superpowers`, `.agent`) so generated worktree tests do not pollute root validation.
- Plan 005 milestone 1 validation after the config fix: `npm.cmd run typecheck`, `npm.cmd run lint`, elevated `npm.cmd run build`, and elevated `npm.cmd test` all pass. Non-elevated `build` and `test` can fail with the known Windows `spawn EPERM` environment issue.
- Plan 005 milestone 2 validation passed: `npm.cmd run typecheck`, `npm.cmd run lint`, elevated `npm.cmd test`, and elevated `npm.cmd run build` all pass. Visual/UX Critical and Major findings are documented only because UI fixes are outside plan 005 scope.
- Plan 005 milestone 3 validation passed: `npm.cmd run typecheck`, `npm.cmd run lint`, elevated `npm.cmd test`, and elevated `npm.cmd run build` all pass. Authenticated admin screens remain browser-inspection blocked by missing authenticated access/test data.
- Plan 006 milestone 1 validation passed: `npm.cmd run typecheck`, `npm.cmd run lint`, elevated `npm.cmd test`, and elevated `npm.cmd run build` all pass. Non-elevated `test` and `build` hit the known Windows `spawn EPERM` environment issue before surfacing code errors.
- Plan 006 milestone 1 review loop found no Critical or Major issues. Scope was limited to route-scope documentation; no app, UI, admin, auth, Supabase, or dependency changes were made.
- Plan 006 milestone 2 added static public utility pages for `/book-skydebanen`, `/kalender`, and `/bliv-medlem`, plus focused Playwright smoke coverage in `tests/e2e/public-pages.spec.ts`.
- Plan 006 milestone 2 validation passed: `npm.cmd run typecheck`, `npm.cmd run lint`, elevated `npm.cmd test`, elevated `npm.cmd run build`, and elevated `npm.cmd run test:e2e -- public-pages` all pass.
- Plan 006 milestone 2 validation setup note: the first focused E2E run timed out because Playwright waited on `/`, and the homepage requires Supabase env values. `playwright.config.ts` now supplies local placeholder Supabase env values to the test web server when real env values are absent. This is validation configuration only; no Supabase/auth/server-action behavior changed.
- Plan 006 milestone 2 review loop found no Critical or Major issues within scope. `.gitignore` now ignores Playwright `test-results/` and `.agent/*.log` dev-server logs generated by validation/browser review.
- Plan 006 milestone 3 added static public activity pages for `/aktiviteter`, `/aktiviteter/jagt`, `/aktiviteter/hjalp-til-jagtproven`, and `/aktiviteter/premieskydninger`, plus expanded focused Playwright smoke coverage.
- Plan 006 milestone 3 validation passed: `npm.cmd run typecheck`, `npm.cmd run lint`, elevated `npm.cmd test`, elevated `npm.cmd run build`, and elevated `npm.cmd run test:e2e -- public-pages` all pass.
- Plan 006 milestone 3 review loop found no Critical or Major issues within scope. Admin/auth/Supabase code remained untouched.
- Plan 006 milestone 4 added static public practical-info pages for `/praktisk-info`, `/praktisk-info/aabningstider-og-skydetider`, `/praktisk-info/bestyrelsen`, and `/find-os`.
- Plan 006 milestone 4 aligned `components/Nav.tsx` and `components/Footer.tsx` to canonical implemented public routes, changed dropdown triggers to buttons with `aria-expanded`/`aria-controls`, hid the hamburger on desktop, and made the mobile menu open visually.
- Plan 006 milestone 4 validation passed: `npm.cmd run typecheck`, `npm.cmd run lint`, elevated `npm.cmd test`, elevated `npm.cmd run build`, and elevated `npm.cmd run test:e2e -- public-pages` all pass.
- Plan 006 milestone 4 review loop found no Critical or Major issues within scope. A source search found no remaining public component/app/test hrefs for `/jagt`, `/jagtprove`, `/praemieskydninger`, `/aabningstider`, `/bestyrelsen`, or `/arkiv`.
- Plan 007 milestone 1 audit documented four verified admin/Supabase hardening issues before any behavior change: publish-flow integrity, article slug cache invalidation, protocol-relative rich-text links, and missing storage bucket/policy migration coverage.
- Plan 007 milestone 1 validation passed: `npm.cmd run typecheck`, `npm.cmd run lint`, elevated `npm.cmd test`, and elevated `npm.cmd run build` all pass. Non-elevated `test` and `build` remain subject to the known Windows `spawn EPERM` sandbox issue.
- Plan 007 milestone 1 review loop found no Critical issues and no additional in-scope Major issues beyond the four documented audit findings.
- Plan 007 milestone 2 added four focused regression tests before code changes and fixed the corresponding issues in `lib/sanitize.ts`, `lib/actions/news.ts`, `app/admin/nyheder/[id]/page.tsx`, and a new `supabase/migrations/0002_news_images_storage.sql`.
- Plan 007 milestone 2 validation passed: `npm.cmd run typecheck`, `npm.cmd run lint`, elevated `npm.cmd test`, and elevated `npm.cmd run build` all pass. Non-elevated `test` and `build` remain subject to the known Windows `spawn EPERM` sandbox issue.
- Plan 007 milestone 2 review loop found no Critical issues and no additional in-scope Major issues after the targeted hardening fixes.
- Plan 007 milestone 3 added targeted admin UX reliability fixes: `components/admin/DeletePostButton.tsx` now requires confirmation before list-page delete submission, `app/admin/nyheder/page.tsx` renders an explicit empty state when there are no posts, and shared required-field validation now lives in `lib/news-validation.ts` and is enforced by `createPost`, `updatePost`, and `saveDraft`.
- Plan 007 milestone 3 verification added tests for delete confirmation, admin list empty/populated rendering, required-field validation, results-row editing, and public result-table rendering.
- Plan 007 milestone 3 validation passed for `npm.cmd run typecheck`, `npm.cmd run lint`, elevated `npm.cmd test`, and elevated `npm.cmd run build`.
- Plan 007 milestone 3 browser review blocker: local `/admin` and `/admin/nyheder` manual review on dev servers at `http://localhost:3003` and `http://localhost:3004` still hit a Supabase env runtime error in `middleware.ts` without a real local env setup. No auth/Supabase code was changed to bypass that.
- Plan 007 milestone 3 blocker outside scope: elevated `npm.cmd run test:e2e` fails in `tests/e2e/homepage.spec.ts` because `page.locator('h2')` matches multiple headings on `/` and triggers a Playwright strict-mode failure while checking `Seneste nyheder`. This is a public homepage test issue, not an admin-plan regression.
- Plan 008 milestone 1 fixed the Playwright homepage selector in `tests/e2e/homepage.spec.ts` by replacing the ambiguous `page.locator('h2')` assertion with `getByRole('heading', { name: 'Seneste nyheder' })`, which matches the intended user-visible heading without changing UI behavior.
- Plan 008 milestone 1 validation passed: `npm.cmd run typecheck`, `npm.cmd run lint`, elevated `npm.cmd test`, elevated `npm.cmd run build`, and elevated `npm.cmd run test:e2e` all pass.
- Plan 008 milestone 1 validation note: a transient `PageNotFoundError: /_document` appeared only when `npm.cmd run build` was run in parallel with the Playwright suite. Re-running `npm.cmd run build` sequentially passed, so this was classified as validation-process interference rather than an app bug.
- Hosting decision addendum validation: for this documentation-only change, `npm.cmd run typecheck`, `npm.cmd run lint`, elevated `npm.cmd test`, and elevated `npm.cmd run build` were re-run per repository policy.
- Plan 008 milestone 2 manual/browser QA used a local dev server at `http://localhost:3005` with the current `.env.local` and Playwright browser inspection. Verified: all implemented public routes and `/admin` return 200; homepage mobile width at 390px no longer overflows (`scrollWidth` 390); heading order on the reviewed public pages is coherent (`h1` followed by section `h2`s); homepage logo alt text is present and the placeholder hero image remains decorative with empty alt text; keyboard focus can reach the mobile menu CTA and the desktop nav dropdown triggers expose `aria-expanded`.
- Plan 008 milestone 2 QA note: the authenticated admin list/edit screens still require real login credentials for full browser review. Unauthenticated browser QA confirms the login screen renders and the route protection pattern remains in place.
- Plan 008 milestone 2 QA note: because browser review ran against live content state in the current Supabase project, `/` and `/nyheder` can still appear sparse when there are no published posts. This is content/data dependent, not a route or deployment failure.
- Plan 008 milestone 3 deployment review verified the current recommended architecture is technically compatible with Vercel-hosted Next.js plus Supabase-backed content/auth/storage, while keeping DNS/mail at Simply.
- Plan 008 milestone 3 deployment review found one direct blocker in the old build script: `next build --turbopack` produced a build that crashed at `next start` with `TypeError: routesManifest.dataRoutes is not iterable`. The repository now uses standard `next build`, which passes production smoke.
- Plan 008 milestone 3 deployment note: Vercel Hobby remains an accepted initial target under the current working assumption, but the repository docs now treat it as a soft-launch / low-traffic posture with explicit monitoring and upgrade triggers rather than as a guaranteed long-term production tier.
- Plan 008 milestone 3 deployment note: Supabase Free is compatible with the current implementation for a soft launch, but docs now explicitly call out paused-project risk, storage growth, and manual cleanup of orphaned images as items to monitor.
- Plan 008 milestone 4 final readiness record completed: deployment steps, env vars, DNS/mail separation, storage policy, free-tier monitoring, and upgrade triggers are now documented in `docs/DEPLOYMENT.md`.
- Plan 008 final validation rerun order matters: after `npm.cmd run test:e2e` starts a dev server, `npm.cmd run build` must be rerun before final `npm.cmd run start` smoke because dev artifacts can replace the production `.next` output. The final recorded start smoke passed after rebuilding.
- Simply-only feasibility assessment concluded that the current app is not a realistic static-export target because it depends on middleware, cookies-based Supabase SSR auth, Server Actions, live Supabase news queries, and Supabase Storage uploads.
- Simply-only feasibility assessment concluded that a classic-hosting rewrite is technically feasible for the customer's simplified needs, but complexity remains high because all backend concerns would move into the app layer.
- Final security/design gate concluded that technical feasibility is not enough to responsibly approve a Simply-only rewrite for this organization because long-term maintenance and recovery responsibilities would remain largely unmanaged.
- Final security/design gate validation: `npm.cmd run typecheck` and `npm.cmd run lint` passed directly; `npm.cmd test` and `npm.cmd run build` passed when rerun elevated after the known Windows `spawn EPERM` sandbox issue.
- Plan 010 launch-prep validation: `npm.cmd run typecheck` and `npm.cmd run lint` passed directly; `npm.cmd test` and `npm.cmd run build` passed when rerun elevated after the known Windows `spawn EPERM` sandbox issue. `npm.cmd run test:e2e` was not rerun because this plan changed documentation only and did not alter routes or UI behavior.
- Plan 010 follow-up QA validation: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd test`, `npm.cmd run build`, and `npm.cmd run test:e2e` were rerun because the public nav, hero CTA, and `/kalender` route changed. Non-elevated `test` and `build` remain subject to the known Windows `spawn EPERM` environment issue and should be rerun elevated if they fail for that reason.
- Calendar embed readiness validation: rerun the same validation set because `/kalender` now conditionally renders an iframe based on `NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL`.
- Calendar embed readiness validation results: `npm.cmd run typecheck` passed, `npm.cmd run lint` passed, elevated `npm.cmd test` passed, and elevated `npm.cmd run build` passed. Elevated `npm.cmd run test:e2e` is currently unstable in the local environment: one run completed all 22 tests but exited nonzero after a dev-server `ECONNRESET` during teardown, and a rerun passed the `/kalender` page check but later lost the local dev server and failed three unrelated public-page navigations with `ERR_CONNECTION_RESET` / `ERR_CONNECTION_REFUSED`.
- Admin auth onboarding/recovery validation: rerun `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd test`, `npm.cmd run build`, and `npm.cmd run test:e2e` because admin routes, auth routes, actions, and docs changed.
- Admin auth onboarding/recovery validation results: `npm.cmd run typecheck` passed, `npm.cmd run lint` passed, elevated `npm.cmd test` passed, elevated `npm.cmd run build` passed, and elevated `npm.cmd run test:e2e` passed.
- Validation configuration update: `playwright.config.ts` now runs E2E against `npm.cmd run build && npm.cmd run start -- -p 3000` instead of the Turbopack dev server. This keeps auth/UI checks on the production build path and avoids the previously observed local dev-manifest instability.

---

## Acceptance Criteria Status - 2026-04-28

| Area | Criterion | Status | Notes |
|---|---|---|---|
| General | Build passes | satisfied | `npm.cmd run build` passes when run with elevated permission; default sandbox can fail with `spawn EPERM`. |
| General | Lint passes | satisfied | `npm.cmd run lint` passes. |
| General | Typecheck passes | satisfied | `npm.cmd run typecheck` passes. |
| General | End-to-end QA passes | satisfied | `npm.cmd run test:e2e` passes when run with elevated permission. |
| UI | Matches approved design | not evaluated | Plan 004 is non-visual. Visual comparison belongs to plan 005. |
| UI | No layout drift | not evaluated | Plan 004 is non-visual. |
| UI | Responsive | satisfied for implemented public routes reviewed in plan 008 | Browser QA at desktop and 390px confirmed reviewed public routes render without the previously documented mobile overflow. |
| UI | Accessible | partial / reviewed for core flows | Browser QA confirmed basic keyboard access to nav controls, mobile menu, and login form, plus coherent heading order and image alt handling on reviewed public pages. Full authenticated admin accessibility review still depends on live credentials. |
| Content | Danish language | partial / not fully evaluated | Existing routes use Danish copy, but full content review is outside plan 004. |
| Content | Uses `du` | partial / not fully evaluated | Existing homepage copy uses informal Danish, but full content review is outside plan 004. |
| Content | Clear and practical tone | partial / not fully evaluated | Requires content review beyond validation/docs alignment. |
| Navigation | All links valid | satisfied for public nav/footer | Focused E2E confirms public nav/footer internal links use implemented routes and do not include the documented non-canonical routes. |
| Navigation | No broken routes | satisfied for site-map public routes | All public routes listed in `docs/SITE_MAP.md` are implemented. |
| Code | No unused components | not fully evaluated | Lint passes, but unused component/dead-code audit is outside plan 004. |
| Code | No dead code | not fully evaluated | Requires deeper code review beyond plan 004. |
| Code | Clear structure | satisfied for current inventory | Public/admin route separation is documented and preserved. |
| Security | No unsafe input handling | requires manual/security review | Supabase/admin hardening is reserved for plan 007. |
| Security | Supabase usage is controlled | requires manual/security review | Supabase/admin hardening is reserved for plan 007. |

---

## UI Status

### Design alignment

- Matches approved design:
  -> In progress in plan 005. Public UI comparison started 2026-04-28.

### UI comparison - plan 005 - milestone 1 public pages - 2026-04-28

Comparison sources:
- Browser-rendered app at `http://localhost:3003` using `npm.cmd run dev -- -p 3003`.
- `docs/DESIGN_SYSTEM.md`, `docs/SITE_MAP.md`, and `docs/ACCEPTANCE_CRITERIA.md`.
- `ui_kits/website/Home.jsx`, `ui_kits/website/News.jsx`, `ui_kits/website/kit.css`, and `ui_kits/website/index.html`.

Environment blocker:
- No `.env*` file is present in the repository. Starting the app without temporary environment variables returns a 500 on `/` because `lib/supabase/server.ts` requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Visual inspection used temporary process-level placeholder Supabase values only. No files, Supabase code, auth, or server actions were changed.
- Because the placeholder Supabase endpoint has no data, public news cards and article pages could not be validated with real/test news content.

Public visual mismatches:

| Severity | Area | Exact difference | Reference | Current file/component | Notes |
|---|---|---|---|---|---|
| Major | Homepage news feed | The approved home reference shows a populated `Seneste nyheder` grid with news cards. The rendered homepage shows the section heading and `Se alle nyheder`, but zero `.newscard` items under the feed when inspected with the current tool-accessible environment. | `ui_kits/website/News.jsx`, `components/NewsFeed.tsx` expected card grid | `app/(public)/page.tsx`, `components/NewsFeed.tsx`, `components/NewsCard.tsx` | Data/env blocker: no Supabase env or seed/test data available for plan 005 inspection. Do not fix in this plan. |
| Major | `/nyheder` listing | The approved news reference provides a news-card listing. The rendered `/nyheder` route displays only the `Nyheder` heading and footer, with zero cards and no empty state. | `ui_kits/website/News.jsx` | `app/(public)/nyheder/page.tsx`, `components/NewsCard.tsx` | Data/env blocker: the route depends on Supabase published posts. |
| Major | `/nyheder/[slug]` article | No article state could be captured. A probe of `/nyheder/test-slug` returned the default Next.js 404 because no published test post/slug is available. | `ui_kits/website/News.jsx` article view | `app/(public)/nyheder/[slug]/page.tsx` | Documented as a test-data blocker, not a confirmed component defect. |
| Major | Mobile homepage layout | At 390px width the document width is 421px, causing horizontal overflow. The nav CTA text is clipped and the first viewport is shifted/cropped compared with the approved responsive direction. | `ui_kits/website/kit.css`, `docs/DESIGN_SYSTEM.md` large-click-target/readability rules | `components/Nav.tsx`, `ui_kits/website/kit.css` imported via `app/globals.css` | Observable in browser. Do not fix in plan 005. |
| Minor | Homepage hero content | The rendered hero structure, palette, typography, status chip, quick-nav tiles, and CTAs broadly match `Home.jsx`. The only public-page mismatch observed in the hero itself is the mobile overflow/cropping caused by nav/header width, not the hero copy or component order. | `ui_kits/website/Home.jsx` | `components/Hero.tsx`, `app/(public)/page.tsx` | No UI changes made. |

### UI comparison - plan 005 - milestone 2 navigation/footer - 2026-04-28

Comparison sources:
- Browser-rendered `/` and `/nyheder` at desktop 1440px and mobile 390px.
- `components/Nav.tsx` against `ui_kits/website/Nav.jsx` and `docs/SITE_MAP.md`.
- `components/Footer.tsx` against `ui_kits/website/Footer.jsx` and `docs/SITE_MAP.md`.

Route mismatches:

| Severity | Area | Exact difference | Reference | Current file/component | Notes |
|---|---|---|---|---|---|
| Major | Public nav routes | `Nav` links to `/jagt`, `/jagtprove`, `/praemieskydninger`, `/aabningstider`, `/bestyrelsen`, and `/arkiv`, which are not listed in the current simplified public routes in `docs/SITE_MAP.md`. | `docs/SITE_MAP.md` public routes | `components/Nav.tsx` | Some match the richer UI kit hierarchy, but the current canonical site map does not include these exact routes. Route decisions belong to a later route/page plan. |
| Major | Public nav omissions | `Nav` does not expose `/nyheder` even though `/nyheder` is implemented and listed in `docs/SITE_MAP.md`. | `docs/SITE_MAP.md` | `components/Nav.tsx` | Do not change route structure in plan 005. |
| Major | Public nav route shape | `Nav` uses `/jagt`, `/jagtprove`, and `/praemieskydninger`; the richer design brief/UI kit describes these under activity/practical groupings, while the current simplified `docs/SITE_MAP.md` only lists `/aktiviteter` and `/praktisk-info` as parent public routes. | `ui_kits/website/Nav.jsx`, `docs/SITE_MAP.md` | `components/Nav.tsx` | Multiple valid route interpretations exist; document only. |
| Major | Footer routes | `Footer` links to `/praemieskydninger` and `/bestyrelsen`, which are not listed in the current simplified public routes. | `docs/SITE_MAP.md` | `components/Footer.tsx` | Same route-alignment issue as nav. |
| Major | Footer omissions | `Footer` does not link to `/nyheder`, `/aktiviteter`, or `/praktisk-info`, which are public routes in the current site map. | `docs/SITE_MAP.md` | `components/Footer.tsx` | Later navigation alignment should decide exact footer shortcuts. |

Visual and UX mismatches:

| Severity | Area | Exact difference | Reference | Current file/component | Notes |
|---|---|---|---|---|---|
| Major | Desktop nav | The rendered desktop nav shows a hamburger button at the far right even though the approved `Nav.jsx` desktop reference shows only the logo, nav items, and `Book skydebanen` CTA. | `ui_kits/website/Nav.jsx`, `ui_kits/website/kit.css` | `components/Nav.tsx` | Browser measured `.nav-hamburger` as visible at 1440px. |
| Critical | Mobile nav | On mobile, tapping the hamburger changes the header class to `nav nav--open`, but `.nav ul` remains `display: none` with a zero-size rect. The menu cannot be opened visually. | `docs/DESIGN_SYSTEM.md` no hidden complexity / large clickable areas, `ui_kits/website/README.md` no hover-only behaviours | `components/Nav.tsx`, `ui_kits/website/kit.css` imported via `app/globals.css` | Broken mobile navigation behavior. Do not fix in plan 005. |
| Major | Mobile nav layout | At 390px, `.nav-cta` is still visible but clipped to 72px wide while its text needs about 91px, contributing to the 421px document width overflow. | `docs/DESIGN_SYSTEM.md` readable labels / large hit targets | `components/Nav.tsx`, `ui_kits/website/kit.css` | Related to milestone 1 mobile overflow finding. |
| Major | Dropdown semantics | Dropdown triggers are rendered as `<a>` elements without `href`, `role`, or `aria-expanded`. They depend on hover/focus CSS and are not explicit buttons. | `docs/DESIGN_SYSTEM.md` no hover-only interactions, `ui_kits/website/README.md` dropdowns openable with focus/click | `components/Nav.tsx` | Accessibility concern; no code changed. |
| Minor | Footer contact content | Approved `Footer.jsx` includes `Faa svar - Zendesk` in the contact list; current `Footer.tsx` omits that support link. | `ui_kits/website/Footer.jsx` | `components/Footer.tsx` | Content mismatch only; destination may need product decision. |
| Minor | Footer visual structure | Desktop and mobile footer layout broadly matches the approved forest footer structure: logo/about, address, shortcuts, contact, and bottom bar. | `ui_kits/website/Footer.jsx`, `ui_kits/website/kit.css` | `components/Footer.tsx` | No layout fix documented beyond route/content mismatches. |

### UI comparison - plan 005 - milestone 3 admin UI - 2026-04-28

Comparison sources:
- Browser-rendered `/admin` at desktop 1440px and mobile 390px.
- Source inspection of `app/admin/page.tsx`, `app/admin/layout.tsx`, `app/admin/nyheder/page.tsx`, `components/admin/NewsForm.tsx`.
- `ui_kits/admin/login.html`, `ui_kits/admin/news-list.html`, `ui_kits/admin/news-edit.html`, and `ui_kits/admin/admin.css`.

Admin inspection blockers:
- `/admin` renders the login screen successfully with temporary process-level Supabase placeholders.
- `/admin/nyheder` and `/admin/nyheder/ny` redirect to `/admin` when unauthenticated, so authenticated news-list and edit/create screens could not be browser-captured.
- No admin/auth/Supabase code was changed to bypass login or seed access.
- One admin browser attempt returned `Internal Server Error` after production build invalidated dev-server `.next` artifacts; restarting the dev server restored `/admin` to 200. This was an environment/dev-server artifact issue, not an app code change.

Admin visual and UX mismatches:

| Severity | Area | Exact difference | Reference | Current file/component | Notes |
|---|---|---|---|---|---|
| Minor | Admin login brand copy | Approved login brand reads `Hadsten & Omegns Jagtforening` with subline `Admin - nyheder & indhold`; rendered login reads `HOJ Admin` with subline `HADSTEN JAGTFORENING`. | `ui_kits/admin/login.html` | `app/admin/page.tsx` | Visual structure is otherwise close. |
| Minor | Admin login helper copy | Approved login helper text includes `Spoerg Magnus hvis du mangler adgang.`; rendered login only shows `For bestyrelsen og redaktoerer.` | `ui_kits/admin/login.html` | `app/admin/page.tsx` | Content mismatch. |
| Major | Admin login secondary controls | Approved login includes `Husk mig` checkbox and `Glemt adgangskode?` link. Rendered login has neither. | `ui_kits/admin/login.html` | `app/admin/LoginForm.tsx` | Could be intentional auth simplification; do not change in plan 005. |
| Minor | Admin login footer note | Approved login includes `Stiftet 1968 - Vissingvej 6, 8370 Hadsten` at the bottom of the card. Rendered login has no card footer note. | `ui_kits/admin/login.html` | `app/admin/page.tsx` | Content mismatch. |
| Minor | Admin login responsive layout | Desktop and mobile login card size, forest patterned background, logo placement, fields, and primary CTA broadly match the approved admin visual direction. | `ui_kits/admin/login.html`, `ui_kits/admin/admin.css` | `app/admin/page.tsx`, `app/admin/LoginForm.tsx` | No layout break observed. |
| Major | Authenticated admin list capture | Approved `news-list.html` shows sidebar, toolbar filters, table rows, pagination, counts, and user block. Browser capture of `/admin/nyheder` was not possible because the route redirects to `/admin` when unauthenticated. | `ui_kits/admin/news-list.html` | `app/admin/layout.tsx`, `app/admin/nyheder/page.tsx` | Auth/test-data blocker. Source-level comparison suggests current list implementation is simpler and data-dependent. |
| Major | Authenticated admin edit/create capture | Approved `news-edit.html` shows a two-column editor with image panel, toggles, results block, sticky form footer, and populated example state. Browser capture of `/admin/nyheder/ny` and `/admin/nyheder/[id]` was not possible because authenticated access/test data is unavailable. | `ui_kits/admin/news-edit.html` | `components/admin/NewsForm.tsx`, `app/admin/nyheder/ny/page.tsx`, `app/admin/nyheder/[id]/page.tsx` | Auth/test-data blocker. Do not touch admin code in plan 005. |

### Known visual issues

- Plan 005 milestones 1, 2, and 3 found public-page, navigation, footer, and admin mismatches listed above.
- Plan 006 milestone 2 browser review: `/book-skydebanen`, `/kalender`, and `/bliv-medlem` render with the expected public shell, headings, card/form/calendar structures, and footer. At 390px each route still reports `documentElement.scrollWidth` 421px; this matches the previously documented nav/header overflow and is deferred to the plan 006 navigation-alignment milestone.
- `/kalender` is currently a static event overview. Google Calendar embed/sync details are not present in the repo context, so the integration remains deferred and documented rather than guessed.
- Plan 006 milestone 3 browser review: `/aktiviteter`, `/aktiviteter/jagt`, `/aktiviteter/hjalp-til-jagtproven`, and `/aktiviteter/premieskydninger` render with the expected public shell, headings, activity cards, and footer. At 390px each route still reports `documentElement.scrollWidth` 421px from the existing nav/header overflow; this remains deferred to milestone 4.
- Prize-shoot detail pages such as `/fastelavnsskydning` are described in the root README/UI-kit concept, but they are not listed in `docs/SITE_MAP.md`; plan 006 milestone 3 did not add those aliases or detail pages.
- Plan 006 milestone 4 browser review: `/praktisk-info`, `/praktisk-info/aabningstider-og-skydetider`, `/praktisk-info/bestyrelsen`, `/find-os`, and `/` render with visible public header/footer and expected page headings.
- Plan 006 milestone 4 mobile check: at 390px, `/`, `/book-skydebanen`, `/kalender`, `/bliv-medlem`, `/aktiviteter`, `/aktiviteter/jagt`, `/aktiviteter/hjalp-til-jagtproven`, `/aktiviteter/premieskydninger`, `/praktisk-info`, `/praktisk-info/aabningstider-og-skydetider`, `/praktisk-info/bestyrelsen`, and `/find-os` all report `documentElement.scrollWidth` 390px. The previously documented 421px mobile overflow is resolved for these routes.
- Browser screenshot capture timed out once during milestone 4 review, but DOM/browser checks and Playwright viewport measurements completed successfully.
- Plan 010 follow-up QA: `/kalender` now uses `NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL` for the final embed and falls back to a booking email message when the env value is absent. No calendar URL has been guessed or hardcoded.
- Plan 010 follow-up QA: the homepage hero still uses `/assets/placeholder-hero.svg`; this is intentional until the customer supplies an approved hero image for launch.

---

## Known Issues

- In the default sandbox, `npm.cmd run build` can fail with Windows `spawn EPERM`; the same command passes when run with elevated permission.
- In the default sandbox, `npm.cmd test`, `npm.cmd run build`, and local dev/start smoke can require elevated execution because of the known Windows `spawn EPERM` environment issue.
- Admin access still depends on manually provisioned Supabase Auth users. There is no public signup flow.
- Deleting a news post does not automatically delete its uploaded image object from the Supabase `news-images` bucket. Storage cleanup is currently manual.

---

## Missing / Not Implemented

- All public routes currently listed in `docs/SITE_MAP.md` are implemented.
- Deferred non-route gaps: customer-approved hero image, old-news migration execution, booking backend behavior, and real Supabase news data/empty states.

---

## Environment Notes

- Windows environment requires `npm.cmd`.
- Some build issues may be environment-related.
- `npm.cmd ci` may require elevated permissions to restore locked dependencies.

---

## Rules

- Always update this file after:
  - implementing a feature
  - fixing a bug
  - running validation

- Never mark something as "done" unless:
  - it is implemented
  - it works
  - it passes validation

- Do not guess - verify.
