# Hosting Decision

## Scope

This document is a scoped hosting decision addendum for the current HOJ web application.

It does not change the codebase, deployment configuration, or provider setup.

## Current baseline

The current application is a Next.js 15 App Router project with:

- Server Components
- middleware-based admin protection
- Server Actions
- Supabase SSR auth
- Supabase Storage image uploads

Relevant code paths:

- `app/(public)/page.tsx`
- `app/admin/layout.tsx`
- `lib/actions/news.ts`
- `lib/actions/auth.ts`
- `lib/supabase/server.ts`
- `lib/supabase/admin.ts`
- `middleware.ts`

This means the app is portable across platforms that can run standard Next.js server workloads and environment variables. It is not portable to static-only or PHP-oriented hosting without refactoring.

## Working assumptions

- Simply remains responsible for domain, DNS, and email until the customer decides otherwise.
- Vercel Hobby is acceptable as an initial hosting target.
- Supabase Free is acceptable as an initial backend target.
- A Simply-only refactor is out of scope unless explicitly approved later.
- Portability should be preserved where practical.

## Cost assumptions

All pricing below is based on public provider pages reviewed on April 29, 2026 and is approximate.

- Simply `.dk` renewal reference: about `$15.23/year` (`~$1.27/month`)
- Simply Basic Mail renewal reference: `$6.00/month`
- Simply Basic Suite renewal reference: `$8.94/month`
- Vercel Hobby: `$0/month`
- Vercel Pro: `$20/month`
- Supabase Free: `$0/month`
- Supabase Pro: `$25/month`

Important pricing notes:

- Simply prices are promotional in year one and higher at renewal. The estimates below use steady-state renewal pricing.
- Vercel Hobby is documented as free for personal, non-commercial use. For an association production site, this should be treated as an initial or temporary tier, not a long-term guarantee.
- Supabase Free can be paused and has stricter limits than Pro.
- Supabase custom domains are a paid add-on on paid plans. They are not needed for the current app because the browser talks to the HOJ site domain and the server uses Supabase via environment variables.

## Option 1 - Simply-only

### Monthly estimated cost

Estimated provider cost: about `$10-$27/month` steady-state, excluding VAT and excluding rewrite labor.

Example steady-state footprint:

- `.dk` domain renewal: `~$1.27/month`
- Simply Basic Suite: `$8.94/month`

If higher Simply webspace tiers are needed, this rises to roughly `$18-$26/month` before any extra mail products.

### Required architecture changes

Major changes would be required.

Based on the reviewed Simply product pages, the documented shared hosting runtime is oriented around `PHP or ASP.NET/.NET Core`, not managed Next.js hosting. From that, the practical paths are:

1. Rewrite the site into a mostly static/site-builder/PHP-compatible shape, or
2. Introduce an additional non-Simply runtime anyway, which stops being "Simply-only" in practice

### Impact on current Next.js/Supabase codebase

High impact.

The current codebase relies on:

- Next.js server rendering
- middleware
- Server Actions
- Supabase SSR auth cookies

Those are part of the current architecture, not incidental details. A Simply-only move would likely force one of these outcomes:

- large refactor to static export plus external services
- replacement of the admin flow
- replacement or redesign of current auth flow
- reduction in dynamic capabilities

### Development time estimate

Estimated engineering effort: `4-8 weeks`.

That estimate assumes careful preservation of the approved UI and content structure while changing hosting architecture underneath it.

### Operational complexity

Medium to high.

It looks simple from a vendor-count perspective, but it pushes complexity into the application itself because the current architecture does not naturally fit the reviewed Simply hosting model.

### Risks

- Highest rewrite risk
- Highest regression risk
- Likely drift from the current approved implementation
- Admin/auth/news workflows become harder to preserve
- Hosting may still not cleanly support the current runtime model

### What features remain possible

- Static public pages
- External links to SafeTicket, Zendesk, and other third-party systems
- Basic content pages

### What features become harder

- Current admin workflow
- Supabase-backed news publishing
- Supabase auth/session handling
- image upload/storage workflow
- future dynamic features such as booking integrations or richer member flows

### Recommendation

Not recommended.

This option is only defensible if the customer is willing to fund a substantial architecture refactor and accept a less direct fit to the current Next.js/Supabase implementation.

## Option 2 - Simply for domain/DNS/email + Vercel/Supabase for app

### Monthly estimated cost

Estimated steady-state provider cost: about `$7-$8/month` if the customer keeps only a basic Simply domain+mail footprint and uses free app tiers initially.

Example reference footprint:

- `.dk` domain renewal: `~$1.27/month`
- Simply Basic Mail: `$6.00/month`
- Vercel Hobby: `$0/month`
- Supabase Free: `$0/month`

Incremental app-hosting cost beyond the existing Simply domain/email setup: `$0/month` initially.

### Required architecture changes

Minimal changes.

This option fits the current application shape:

- Next.js app deploys to Vercel
- Supabase remains the backend/auth/storage provider
- Simply remains the registrar/DNS/mail provider

The operational work is mostly:

- environment variable setup
- Vercel project setup
- DNS records in Simply
- Supabase production configuration

### Impact on current Next.js/Supabase codebase

Low impact.

This is the closest fit to the current repository. The current code already expects:

- a server-capable Next.js runtime
- environment variables
- direct Supabase integration

No structural rewrite is required.

### Development time estimate

Estimated engineering effort: `1-3 days` for a basic deployment path, plus normal QA.

### Operational complexity

Low to medium.

There are three providers in the stack, but each provider does one job that matches the current architecture well:

- Simply: domain, DNS, mail
- Vercel: Next.js hosting
- Supabase: database, auth, storage

### Risks

- Vendor split means support issues can cross provider boundaries
- Vercel Hobby is documented for personal, non-commercial use; it is acceptable as an initial target under the current customer assumption, but it is not a strong long-term production position
- Supabase Free can pause projects and is not a robust long-term production tier

### What features remain possible

- All current public pages
- Current admin flow
- Supabase-backed news
- image uploads
- future staged improvements without architecture rewrite

### What features become harder

- Nothing becomes materially harder in the app itself
- The main tradeoff is operational: DNS/mail remain with Simply while app/runtime concerns live elsewhere

### Recommendation

Recommended as the immediate path.

This is the best fit for the current codebase and the customer's current preference to keep domain, DNS, and email with Simply. It preserves the Claude baseline, avoids unnecessary migration work, and keeps the app portable.

Production note: start on Vercel Hobby + Supabase Free only as an initial/temporary target. Budget an upgrade path to `Vercel Pro` and `Supabase Pro` before the site becomes operationally important.

## Option 3 - Full migration to Vercel/Supabase

### Monthly estimated cost

Practical base cost: about `$45/month` plus separate email/domain costs.

Reference footprint:

- Vercel Pro: `$20/month`
- Supabase Pro: `$25/month`

Important constraint:

Vercel does not provide mailbox hosting. So a true "move everything to Vercel/Supabase" is incomplete for email. A separate mail provider would still be needed.

### Required architecture changes

Low to medium changes for the app itself, but medium operational changes overall.

The application can run on this stack with little or no architecture change. The extra work is in:

- domain transfer or nameserver cutover
- mail continuity planning
- DNS migration
- provider handoff procedures

### Impact on current Next.js/Supabase codebase

Low impact on application code.

This option still matches the current Next.js/Supabase architecture well.

### Development time estimate

Estimated engineering effort: `3-7 days`, depending on whether DNS, domain ownership, and email records are migrated at the same time.

### Operational complexity

Medium.

The app stack becomes cleaner, but domain and mail operations become more sensitive during migration. Because Vercel is not a mailbox host, this option usually adds a separate mail decision instead of removing one.

### Risks

- Mail disruption during DNS/domain cutover
- More customer change-management work
- Higher recurring cost than the mixed model
- Less alignment with the customer's stated desire to stay on Simply for domain/DNS/email

### What features remain possible

- All current app features
- a cleaner app-hosting workflow
- easier future scaling on the app side than a Simply-only path

### What features become harder

- mailbox continuity
- DNS cutover timing
- customer operations and ownership clarity if email moves away from Simply

### Recommendation

Not recommended right now.

It is technically sound for the application, but it conflicts with the customer's current operating preference and does not actually eliminate the need for a separate email service.

## Recommendation summary

### Recommended now

Choose **Option 2**:

- Keep Simply for domain, DNS, and email
- Use Vercel for the Next.js app
- Use Supabase for database, auth, and storage

### Why

- Best fit to the current codebase
- Lowest engineering risk
- Lowest migration effort
- Preserves the existing approved implementation
- Avoids a CMS rewrite
- Keeps portability reasonable

### Planned upgrade path

For initial validation or soft launch, the working assumption of `Vercel Hobby + Supabase Free` is acceptable.

For stable production use, the safer target is:

- `Vercel Pro`
- `Supabase Pro`

That upgrade can happen later without rebuilding the app.

## Revised note under updated customer assumptions

As of April 29, 2026, the customer profile has shifted:

- no expected future feature development after launch
- low traffic
- simple admin needs
- preference for keeping everything at Simply if realistic

Under that profile, **Simply-only is now a realistic strategic option**, but not as a deployment target for the current codebase.

The distinction matters:

- **Current codebase on Simply-only without rewrite:** not realistic
- **New Simply-only implementation preserving current public behavior and simple admin needs:** realistic

### What changed in the assessment

When future product growth is no longer expected, the main objection to Simply-only becomes rewrite cost and migration risk, not long-term platform flexibility. That makes the option more credible than it was under the earlier assumption of continued product evolution.

### Revised recommendation

For the current repository and immediate launch path, **Option 2 remains the lowest-risk deployment choice** because it is already deployment-ready.

For the customer's new long-term preference, **a future Simply-only rewrite can be sensible** if and only if the customer explicitly prefers:

- one main hosting vendor
- a simpler long-term operating model
- acceptance of a one-time rewrite project after or instead of the Vercel/Supabase launch path

### Practical conclusion

- If the priority is **launch the approved site with minimal additional work**, stay with Simply DNS/mail + Vercel + Supabase.
- If the priority is **consolidate everything into Simply and accept rewrite work to reduce long-term platform sprawl**, a Simply-only rebuild is feasible and should target **PHP + MySQL**, not the current Next.js runtime.

## Simply-only feasibility assessment

### 1. Current functionality in scope today

Current public functionality:

- homepage
- news listing
- news article page
- public information pages
- public navigation/footer

Current admin functionality:

- login
- create news
- edit news
- delete news
- upload article image
- optional results block in articles

Current backend/runtime dependencies:

- Next.js App Router
- middleware-based admin protection
- cookies-based Supabase SSR auth
- Server Actions
- Supabase Postgres
- Supabase Storage

### 2. Can the public site be deployed on Simply as static export?

**The public HTML/CSS design could be reproduced statically, but the current implementation cannot simply be exported and deployed as-is.**

Reasons:

- homepage news feed currently queries live published news from Supabase at request time
- `/nyheder/[slug]` currently resolves dynamic article content from Supabase
- metadata for article pages is generated from live Supabase data
- the app uses middleware, cookies, and Server Actions for admin functionality

So:

- **public brochure-style pages only:** possible as a static site
- **current site including live news/admin behavior:** not realistically deployable as static export without redesigning the content model/workflow

### 3. Can the current app be deployed on Simply classic PHP/.NET hosting as-is?

No.

The current repository is a Next.js server application. The reviewed code relies on:

- `cookies()` and Supabase SSR clients
- `middleware.ts`
- `use server` actions
- runtime database queries for news and auth state

Those are application-server behaviors, not static hosting artifacts. A classic Simply hosting environment may support PHP or ASP.NET-style apps, but that does not make it a drop-in runtime for this Next.js project.

### 4. What blocks or complicates static export

Main blockers in the current implementation:

- `middleware.ts` for admin protection
- `lib/supabase/server.ts` using `cookies()`
- `lib/actions/auth.ts` Server Actions
- `lib/actions/news.ts` Server Actions plus `revalidatePath()`
- homepage live Supabase query in `app/(public)/page.tsx`
- news listing live Supabase query in `app/(public)/nyheder/page.tsx`
- article live Supabase query and metadata generation in `app/(public)/nyheder/[slug]/page.tsx`
- admin layout auth check in `app/admin/layout.tsx`
- Supabase Storage image upload in `components/admin/ImageUploader.tsx`

### 5. What would need to be rewritten for Simply-only

#### Admin auth

Would need replacement for:

- Supabase Auth
- SSR cookie/session handling
- middleware route protection

Replacement needs:

- password hashing
- login form handler
- session cookie issuance
- server-side authorization checks for admin pages

#### News CRUD

Would need replacement for:

- Supabase database queries
- Server Actions
- Next.js revalidation behavior

Replacement needs:

- database table access layer
- create/edit/delete handlers
- slug generation
- publish/archive state
- list/detail rendering from the local database

#### Image upload/storage

Would need replacement for:

- Supabase Storage bucket
- public image URLs from Supabase

Replacement needs:

- local upload directory or classic object/file storage approach at Simply
- validated file upload handling
- filename strategy
- file replacement/deletion policy

#### Archive/retention

Current architecture has no dedicated archive workflow. A Simply-only rebuild would need an explicit decision:

- manual archive flag in database, or
- draft/unpublished state only, or
- hard delete only

#### Database layer

Would need replacement for:

- Supabase Postgres

Most likely replacement:

- Simply-hosted MySQL

### 6. Recommended Simply-only backend approach

**Recommendation: PHP + MySQL**

Why PHP + MySQL is the more sensible Simply-only target here:

- better match for classic shared-hosting expectations
- lower operational complexity for a low-traffic club site
- simpler hiring/maintenance profile for a small brochure-plus-news system
- no strong project need for .NET-specific capabilities

Why not recommend ASP.NET/.NET Core here:

- higher implementation and hosting-shape complexity for the same functional result
- no evidence that the customer benefits from a .NET-specific stack
- the required admin/news workflow is simple enough that PHP is the more pragmatic fit

### 7. Security considerations for a Simply-only rewrite

Required controls:

- password hashing with a modern password-hash API
- secure, server-issued session cookies
- server-side admin authorization checks on every admin page/action
- CSRF protection on login and CRUD forms
- prepared statements for all database access
- least-privilege database user
- login throttling or rate limiting
- strict upload validation for type, size, and file extension
- image resizing/compression
- randomized stored file names
- storage outside executable paths where possible
- sanitized rich-text or a simpler restricted content format
- XSS-safe output rendering
- no executable uploads
- simple audit trail if practical
- manual backup/export and restore procedure
- delete/replace cleanup rules for uploaded files

Relative security assessment:

- feasible in engineering terms, but fully custom responsibility
- more app-level security work than the current Supabase-backed model
- weaker fit for an organization with no named security, backup, monitoring, or incident-response owner

### Security-by-design greenlight test

A minimal PHP + MySQL admin can be built securely enough **only if** all of the controls above are implemented and someone is explicitly responsible for:

- account hygiene
- backup/restore checks
- PHP/runtime updates
- handling abuse or compromise

Without that operational ownership, the design is not responsibly self-sustaining.

### 8. Complexity and risk

**Complexity: high**

This is not a deployment toggle. It is a rewrite.

Expected rewrite shape:

1. content/data model design for MySQL
2. admin auth/session implementation
3. public news rendering implementation
4. news CRUD implementation
5. image upload/storage implementation
6. archive/retention policy implementation
7. QA, migration, and launch cutover

Reasonable milestone estimate:

- **6-8 milestones**

Likely retest areas:

- all public routes and navigation
- news listing and article rendering
- admin login and logout
- CRUD permissions
- upload validation and file-serving behavior
- archive/draft behavior
- backup/restore procedure

### 9. Comparison with the current deployment-ready option

#### Current Vercel/Supabase option

Pros:

- already deployment-ready
- preserves the approved implementation
- no rewrite needed
- lower immediate risk

Cons:

- multiple providers
- future operating model split across Simply, Vercel, and Supabase

#### Simply-only rewrite

Pros:

- potential long-term vendor consolidation
- customer keeps everything centered on their current host
- enough functionality can be reproduced for a simple stable site

Cons:

- requires a rewrite
- higher one-time delivery risk
- custom security/session/upload handling becomes the project's responsibility
- no direct path from the current deployed codebase

### 10. Recommendation for this revised customer profile

Under the revised assumptions:

- no expected future development
- low traffic
- simple admin needs
- preference for keeping things in Simply

**Simply-only is feasible, but only as a deliberate rewrite project.**

Clear recommendation:

- **Short-term / least-risk answer:** keep the current deployment-ready Vercel + Supabase architecture for launch
- **Long-term / consolidation answer:** if the customer strongly prefers a single-host operating model and accepts rewrite cost, a Simply-only rebuild is sensible and should be done as **PHP + MySQL**

If the customer wants the simplest path to a finished launch, do **not** rewrite now.

If the customer values Simply consolidation more than avoiding rewrite effort, a Simply-only rebuild is now a defensible option.

## Final security-by-design and design-quality decision

### Security-by-design assessment

For this customer profile:

- small volunteer organization
- no dedicated security owner
- no monitoring process
- no backup owner
- no incident-response capacity

a custom Simply-only PHP + MySQL rewrite is a **poor operational fit**, even though it is technically possible.

The issue is not whether secure code can be written. It can.

The issue is whether the resulting system can be kept secure enough over time with:

- periodic PHP/runtime review
- backup verification
- admin credential hygiene
- abuse response
- upload hygiene

For this customer, that answer is weak.

If nobody maintains it for 2-3 years, the risk profile degrades materially:

- PHP/runtime drift
- stale credentials
- unreviewed uploads and orphaned files
- uncertain backup recoverability
- no clear response path if the admin login is attacked or compromised

### Botnet / abuse assessment

The public site could be made mostly static and cache-friendly.

That helps with public traffic resilience.

However, the admin login and CRUD/upload endpoints would still remain exposed to:

- credential stuffing
- brute-force attempts
- upload abuse
- routine bot probing

Those risks can be reduced, but not eliminated, and they become more dependent on the custom application and hosting setup than they are in the current managed Supabase/Vercel model.

### Design-quality assessment

The public design can be reproduced at near-identical quality.

Lowest-risk design-preservation strategy:

- keep the public frontend as static HTML/CSS/JS derived from the approved design
- rebuild only the backend/admin in PHP + MySQL

This is lower risk than rewriting everything into PHP templates.

Frontend reuse feasibility:

- typography, spacing, tokens, layout, cards, nav, footer, and public page structure are reusable
- static markup/CSS can preserve the visual quality closely

Rewrite-required areas:

- live news rendering
- dynamic article routing
- admin auth/session flow
- image upload/storage
- archive state and retention

### Final recommendation

**Recommendation: C. Do not greenlight; stay with Vercel/Supabase.**

Why:

- it is already deployment-ready
- it is the lower launch-risk option
- it offloads materially more security and operational burden
- it is a better match for an organization with no ongoing security/backup/monitoring owner

If the customer still prefers Simply-only, the most honest position is:

- it is technically feasible
- it can preserve design quality
- but it should **not** be approved as the responsible default choice for this customer profile

At most, it should be reconsidered only if explicit operating conditions are accepted:

- named owner for backups and restores
- named owner for admin accounts
- regular PHP/runtime review cadence
- acceptance of custom-security responsibility

## Current project decision

Simply-only rewrite work is paused.

Current accepted direction:

- Simply remains responsible for domain, DNS, and email
- Vercel Hobby/Free remains the frontend hosting target
- Supabase Free remains the backend/auth/storage target

Simply-only should only be reconsidered if the customer explicitly rejects this recommendation and explicitly accepts the rewrite/security tradeoff.

## Source links

- [Simply web hosting](https://www.simply.com/en/)
- [Simply email pricing](https://www.simply.com/en/email/)
- [Simply domain prices](https://www.simply.com/en/domainprices/)
- [Simply .dk domain page](https://www.simply.com/en/dk-domain/)
- [Vercel pricing](https://vercel.com/pricing)
- [Vercel Hobby plan](https://vercel.com/docs/plans/hobby)
- [Vercel Pro plan](https://vercel.com/docs/plans/pro-plan)
- [Vercel email with domains](https://vercel.com/guides/using-email-with-your-vercel-domain)
- [Supabase billing overview](https://supabase.com/docs/guides/platform/billing-on-supabase)
- [Supabase billing FAQ](https://supabase.com/docs/guides/platform/billing-faq)
- [Supabase custom domains](https://supabase.com/docs/guides/platform/custom-domains)
- [Supabase custom domain pricing](https://supabase.com/docs/guides/platform/manage-your-usage/custom-domains)
