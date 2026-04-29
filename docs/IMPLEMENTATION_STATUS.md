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
| `/praktisk-info` | implemented | `app/(public)/praktisk-info/page.tsx` |
| `/praktisk-info/aabningstider-og-skydetider` | implemented | `app/(public)/praktisk-info/aabningstider-og-skydetider/page.tsx` |
| `/praktisk-info/bestyrelsen` | implemented | `app/(public)/praktisk-info/bestyrelsen/page.tsx` |
| `/bliv-medlem` | implemented | `app/(public)/bliv-medlem/page.tsx` |
| `/find-os` | implemented | `app/(public)/find-os/page.tsx` |
| `/admin` | implemented | `app/admin/page.tsx` |
| `/admin/nyheder` | implemented | `app/admin/nyheder/page.tsx` |
| `/admin/nyheder/ny` | implemented | `app/admin/nyheder/ny/page.tsx` |
| `/admin/nyheder/[id]` | implemented | `app/admin/nyheder/[id]/page.tsx` |

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

---

## Acceptance Criteria Status - 2026-04-28

| Area | Criterion | Status | Notes |
|---|---|---|---|
| General | Build passes | satisfied | `npm.cmd run build` passes when run with elevated permission; default sandbox can fail with `spawn EPERM`. |
| General | Lint passes | satisfied | `npm.cmd run lint` passes. |
| General | Typecheck passes | satisfied | `npm.cmd run typecheck` passes. |
| UI | Matches approved design | not evaluated | Plan 004 is non-visual. Visual comparison belongs to plan 005. |
| UI | No layout drift | not evaluated | Plan 004 is non-visual. |
| UI | Responsive | not evaluated | Requires visual/browser QA in a later plan. |
| UI | Accessible | not evaluated | Requires visual/browser/accessibility QA in a later plan. |
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

---

## Known Issues

- In the default sandbox, `npm.cmd run build` can fail with Windows `spawn EPERM`; the same command passes when run with elevated permission.

---

## Missing / Not Implemented

- All public routes currently listed in `docs/SITE_MAP.md` are implemented.
- Deferred non-route gaps: live Google Calendar sync/embed details, booking backend behavior, real Supabase news data/empty states, and prize-shoot detail pages not listed in `docs/SITE_MAP.md`.

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
