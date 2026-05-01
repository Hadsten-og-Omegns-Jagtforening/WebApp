# Deployment

## Scope

This document describes deployment readiness for the current HOJ web application under the currently recommended launch model:

- Simply Basic Suite for domain, DNS, and email
- Vercel Hobby as the initial app host
- Supabase Free as the initial backend/auth/storage host

This is a deployment playbook for the current implementation. It does not describe a provider migration or a Simply-only rewrite.

For step-by-step launch operations, use `docs/LAUNCH_CHECKLIST.md` alongside this document.

## Recommended launch architecture

### Platform split

- **Simply**: keeps domain registration, DNS records, and mailbox handling
- **Vercel**: hosts the Next.js application
- **Supabase**: provides Postgres, Auth, and Storage

### Why this fits the current codebase

The current application uses:

- Next.js App Router
- middleware
- Server Components
- Server Actions
- Supabase SSR auth
- Supabase Storage uploads

That makes it a direct fit for Vercel + Supabase. No runtime rewrite is required.

## Deployment status

### Verified compatible

- `npm.cmd run build` passes with the current codebase
- `npm.cmd run start` passes after a standard Next.js production build
- Public routes build successfully
- Admin login route builds successfully
- Supabase-backed news routes build successfully
- Supabase image host allowance is already configured in `next.config.ts`

### Important implementation limits

- The admin flow currently supports **email + password login only**
- There is **no public self-registration**
- News image upload accepts **JPG/PNG only**
- News image upload enforces **5 MB max file size**
- The app does **not** automatically delete Supabase Storage objects when a news post is deleted or an image is replaced

These are not launch blockers for the current scoped soft launch, but they must be understood by the deployer and content editors.

## Required environment variables

Set these in Vercel for both **Production** and **Preview**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.example
NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL=
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Notes

- All four values must come from the **same** deployment context
- `SUPABASE_SERVICE_ROLE_KEY` must remain server-only
- `NEXT_PUBLIC_SITE_URL` must match the current site origin for the environment where password-reset emails are sent
- `NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL` must only be set when the customer provides the final public Google Calendar embed URL
- The homepage and admin middleware will fail at runtime if `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing
- The admin news actions will fail if `SUPABASE_SERVICE_ROLE_KEY` is missing

## Supabase setup

### 1. Create the Supabase project

Create one hosted Supabase project on the Free plan for the initial soft launch.

### 2. Collect API values

From `Settings -> API`, copy:

- Project URL
- `anon` public key
- `service_role` key

### 3. Run the migrations

Run both migrations in order:

1. `supabase/migrations/0001_news_table.sql`
2. `supabase/migrations/0002_news_images_storage.sql`

This provisions:

- the `news` table
- RLS for news content
- the `news-images` public storage bucket
- storage policies for authenticated uploads and public reads

### 4. Provision the first admin user

Admin provisioning model:

- no public self-registration
- no public signup UI
- admin users are created manually in Supabase Auth
- keep the admin account count minimal

Create the first admin user in Supabase Auth with a known email and password.

Current implementation note:

- the app supports password login only
- password reset is handled through `/auth/reset-password` and `/auth/update-password`
- there is no public signup flow

First-admin steps:

1. open Supabase Dashboard -> Authentication -> Users
2. create the admin user manually with the intended email address
3. either assign a temporary strong password there or trigger the reset flow afterward
4. communicate the login URL `/admin`
5. if using a temporary password, require the admin to change it immediately through the reset/update-password flow

### 5. Auth URL settings

Everyday admin login still uses email + password on `/admin`, but password-reset emails now depend on the callback and update-password routes working correctly.

Configure the following in Supabase:

- **Site URL**: the environment base URL, which should match `NEXT_PUBLIC_SITE_URL`
- **Additional Redirect URLs** must include:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/auth/update-password`
  - `https://*-<your-vercel-team>.vercel.app/auth/callback`
  - `https://*-<your-vercel-team>.vercel.app/auth/update-password`
  - `https://your-production-domain/auth/callback`
  - `https://your-production-domain/auth/update-password`

Password reset route flow:

1. admin visits `/auth/reset-password`
2. app calls `resetPasswordForEmail(..., { redirectTo: <site>/auth/callback?next=/auth/update-password })`
3. Supabase sends the reset email
4. callback route exchanges the auth code for a session
5. admin lands on `/auth/update-password` and sets a new password

This is the required recovery path for launch.

## Vercel deployment steps

### 1. Import the repository

In Vercel:

1. Create a new project
2. Import the Git repository
3. Let Vercel detect the app as Next.js

### 2. Keep the default Next.js runtime shape

Use the repository scripts as configured:

- Build command: `npm run build`
- Install command: default
- Output directory: default

Important verified note:

- the explicit `next build --turbopack` script path produced a production-start failure during plan 008 smoke testing
- the repository now uses standard `next build`, which passes build validation and production `next start` smoke

### 3. Add environment variables

Add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Set them for:

- Production
- Preview

### 4. Deploy

Deploy once with the generated `*.vercel.app` URL before configuring the final domain.

### 5. Verify

After deployment, verify:

- `/`
- `/nyheder`
- `/book-skydebanen`
- `/kalender`
- `/bliv-medlem`
- `/aktiviteter`
- `/praktisk-info`
- `/find-os`
- `/admin`

Use `docs/LAUNCH_CHECKLIST.md` for the full post-deploy smoke sequence and rollback preparation.

Customer-provided launch inputs still required before final cutover:

- a customer-approved homepage hero image
- the public Google Calendar embed URL for `booking@hadstenjagtforening.dk`, to be stored in `NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL`

Do not invent or hardcode either asset. Keep the current placeholders until the customer provides the approved source material.

## Admin auth onboarding and recovery

### Login entry point

- admins sign in at `/admin`
- there is no public signup

### Password reset entry point

- admins request a reset at `/auth/reset-password`
- reset emails must return through `/auth/callback`
- the password is updated at `/auth/update-password`

### Operational rule

- if an admin loses access, do not create a public registration workaround
- either trigger the reset flow for the existing Supabase Auth user or create a replacement admin user manually in Supabase Auth

## DNS and mail notes for Simply

### Preferred setup

Keep DNS authoritative at Simply unless there is a separate explicit decision to move it.

This is the safest path for the current customer preference because it avoids breaking existing email handling.

### Connect the Vercel app without moving nameservers

Recommended sequence:

1. Add the production domain to the Vercel project
2. Inspect the required DNS records in Vercel
3. Add only those records in the Simply DNS control panel

Typical Vercel patterns:

- apex domain: A record
- subdomain such as `www`: CNAME

Use the exact values Vercel shows for the project when configuring the final records.

### Mail protection rule

Do **not** move nameservers to Vercel as part of the initial launch unless all mail-related records are intentionally migrated and verified.

Reason:

- Vercel documents that changing nameservers can interrupt mail delivery unless MX and related records are preserved
- the customer explicitly prefers Simply to remain responsible for domain, DNS, and email

### Records to preserve at Simply

At minimum, preserve existing mail-related records such as:

- MX
- SPF TXT
- DKIM TXT or CNAME
- DMARC TXT
- any mail-autodiscovery or provider verification records already in use

Before making changes, capture the current zone so rollback is possible without guessing the previous values.

## Content and storage policy

### Image policy

Current implementation:

- accepts JPG and PNG
- rejects other formats
- rejects files larger than 5 MB
- does not perform built-in compression

Operational policy:

- compress images before upload where practical
- aim for web-ready article images rather than camera originals
- prefer roughly `1200x800` or similar article-safe dimensions
- target `<= 2 MB` where practical, even though the hard limit is 5 MB

### Video policy

- do not upload video into Supabase Storage for this app
- if video is ever needed, host it externally and link/embed only after a separate decision

### News content policy

- keep teaser text short
- keep article bodies lightweight
- avoid very large image galleries inside a single post
- use one primary image per news item unless future scope explicitly expands the content model

### 12-month review policy

The current architecture does **not** have a dedicated archive state or archive page.

So the practical policy is:

- review published news every 12 months
- keep evergreen or important historical items published
- move stale items out of the live feed manually by editing them back to draft or deleting them if they are no longer needed

### 24-36 month cleanup policy

Because storage cleanup is currently manual:

- review old news and uploaded images every 24-36 months
- remove unused or obsolete posts
- remove orphaned storage images directly from Supabase Storage when posts have been deleted or images replaced

This should remain a manual maintenance task until the app has explicit archive/cleanup automation.

## Free-tier monitoring checklist

### Vercel Hobby

Monitor:

- failed production deployments
- failed preview deployments
- build times increasing unexpectedly
- repeated runtime failures on public pages or admin pages
- traffic growth beyond a low-traffic association site profile

### Supabase Free

Monitor:

- project pause warnings
- database size approaching free-plan limits
- storage growth from uploaded news images
- auth issues for the admin account
- image upload failures
- excessive manual cleanup burden

### Operational checks

Check regularly:

- homepage loads with real data
- `/nyheder` shows current content
- `/admin` login still works
- image upload still works against the `news-images` bucket
- mail continues to work through Simply after DNS changes

## Upgrade triggers

### Move from Vercel Hobby to Vercel Pro when

- the site is no longer considered soft-launch or low-risk
- multiple maintainers need stronger deployment controls
- deployment reliability/support becomes operationally important
- usage regularly approaches Hobby limits
- the team needs stronger environment/workflow separation

### Move from Supabase Free to Supabase Pro when

- the project receives pause warnings
- storage/database/auth usage is near or above Free limits
- uptime reliability becomes important enough that paused-project behavior is unacceptable
- the organization needs paid add-ons or higher quotas
- the association wants a more production-grade operational posture

## Validation commands

Use these for deployment-readiness verification:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

Production smoke:

```powershell
npm.cmd run start
```

Practical note:

- if you run `npm.cmd run dev` or `npm.cmd run test:e2e` after the production build, rerun `npm.cmd run build` before `npm.cmd run start`
- this repository uses a single `.next` workspace, so dev artifacts can replace the production build output used by `next start`

## Current readiness summary

### Ready under the current scoped launch assumptions

- Vercel-hosted Next.js deployment
- Supabase-backed content/auth/storage
- Simply-managed domain, DNS, and mail

### Known non-blocking limitations

- password-only admin auth
- no reset-password completion flow
- no magic-link flow
- no automatic storage cleanup
- no built-in image compression
- no dedicated content archive state

### Not a blocker for this plan

- paid Vercel/Supabase upgrades are **not** required for the current soft-launch assumption
