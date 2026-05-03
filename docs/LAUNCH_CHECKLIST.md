# Launch Checklist

## Scope

This checklist is for the accepted launch architecture:

- Simply remains responsible for domain, DNS, and email
- Vercel Hobby/Free remains the app hosting target
- Supabase Free remains the backend/auth/storage target

This document is operational guidance only. It does not change the app.

## 1. Vercel project setup

### Project and repository

- Confirm the correct GitHub repository is selected
- Confirm the correct Vercel team/account owns the project
- Confirm the project root points to this app
- Confirm the framework is detected as Next.js
- Confirm the production branch is the intended release branch
- Confirm preview deployments are enabled for non-production branches

### Build settings

- Confirm install command is default or appropriate for the repo
- Confirm build command is `npm run build`
- Confirm output directory is default
- Confirm there is no stale override forcing `next build --turbopack`

### Environment variables

Set these for **Production** and **Preview**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL` (optional override)
- `SUPABASE_SERVICE_ROLE_KEY`

Checks:

- all values come from the same Supabase project
- `SUPABASE_SERVICE_ROLE_KEY` is never copied into client code or public docs
- `NEXT_PUBLIC_SITE_URL` matches the current environment origin
- if `NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL` is blank, `/kalender` falls back to the public `booking@hadstenjagtforening.dk` calendar
- env vars are set before the first production deploy

### Production domain setup

- Add the intended production domain in Vercel
- Verify Vercel shows the exact DNS records required
- Do not change nameservers unless there is a separate explicit decision
- Verify the production deployment resolves on the temporary `*.vercel.app` URL before switching the real domain

### Post-deploy smoke

After production deployment, verify:

- `/`
- `/nyheder`
- `/kalender`
- `/book-skydebanen`
- `/bliv-medlem`
- `/aktiviteter`
- `/praktisk-info`
- `/find-os`
- `/admin`

### Customer-provided launch assets still required

- Collect the customer-approved hero image for the homepage before final launch
- Collect the public Google Calendar embed URL for `booking@hadstenjagtforening.dk`
- Confirm the Google Calendar is public and embeddable before replacing the current placeholder state

## 2. Supabase production checklist

### Project setup

- Create or confirm the intended production Supabase project
- Confirm project ownership is documented
- Confirm project region choice is accepted

### Required environment values

From Supabase `Settings -> API`, collect:

- Project URL
- `anon` public key
- `service_role` key

### Migration order

Run in order:

1. `supabase/migrations/0001_news_table.sql`
2. `supabase/migrations/0002_news_images_storage.sql`

### Storage bucket and policies

Verify:

- bucket `news-images` exists
- public read policy exists
- authenticated upload/update/delete policies exist

### Auth configuration

Verify:

- Site URL points to the production domain
- Redirect URLs include:
  - production URL
  - localhost for local dev if needed
  - preview URL pattern if future auth flows need it

Current implementation note:

- production admin auth is password-only
- password reset uses `/auth/reset-password`, `/auth/callback`, and `/auth/update-password`
- there is no public signup flow

### Admin user provisioning

- Create the production admin user manually
- Use a strong unique password
- Record who holds admin access
- Keep the admin account count minimal
- Do not enable public self-registration
- First-admin setup:
  1. create the user manually in Supabase Auth
  2. confirm the email address is correct
  3. either assign a temporary password or use the reset-password flow
  4. verify the user can reach `/admin`
- Password reset path:
  1. open `/auth/reset-password`
  2. submit the admin email
  3. open the email link
  4. complete the new password form at `/auth/update-password`

### RLS / policy verification

Verify:

- news table policies behave as intended
- storage policies behave as intended
- unauthenticated public users cannot access admin-only write flows

### Backup / export expectations

Supabase Free does not provide strong managed backup guarantees equivalent to a paid operational setup.

Before launch, define:

- how to export the `news` table manually
- how to export uploaded images if needed
- who owns that export
- where the export is stored
- how often the export is performed

### Free-tier monitoring risks

Monitor for:

- project pause risk
- storage growth
- auth failures
- upload failures
- quota/usage warnings

## 3. Simply DNS and mail checklist

### Preserve mail setup

- Confirm Simply remains authoritative for the domain unless explicitly decided otherwise
- Preserve existing mailbox ownership and support process

### Mail records

- Do not change MX records unless explicitly required
- Preserve SPF TXT records
- Preserve DKIM TXT/CNAME records
- Preserve DMARC TXT records
- Preserve any existing mail verification or autodiscovery records

### App hosting records

- Add only the DNS records Vercel requires for the site
- Record the exact old and new DNS values before making changes
- Verify changes first against the temporary Vercel deployment URL when possible

### Rollback DNS steps

Before changing DNS:

- capture current zone state
- capture all existing mail-related records
- capture current A/CNAME records for the website hostnames

If rollback is needed:

- restore the previous website A/CNAME records
- do not touch MX/SPF/DKIM/DMARC unless they were accidentally changed
- verify mail still works after rollback

## 4. Security-by-design launch checklist

- Verify `SUPABASE_SERVICE_ROLE_KEY` is server-only and never exposed to the browser
- Verify RLS/policies are present and behave as intended
- Verify admin-only routes/actions remain protected
- Verify accepted upload types are still limited to JPG/PNG
- Verify upload size limits are still enforced
- Verify there is no public self-registration if it is not required
- Verify password reset routes and Supabase redirect URLs are configured correctly
- Verify content/storage policy is documented
- Verify the admin account count is minimal
- Verify a strong password policy is communicated to the admin owner

## 5. Customer handover checklist

### Admin usage

- explain how to reach `/admin`
- explain how to log in
- explain how to request a password reset through `/auth/reset-password`
- explain how to create news
- explain how to edit news
- explain how to delete news

### Image guidance

- explain that images should be web-ready before upload
- explain that JPG/PNG only are accepted
- explain the practical preference for smaller compressed images
- explain that video should not be uploaded
- explain what not to upload:
  - huge originals
  - video files
  - sensitive/private documents
  - executable or archive files
- explain that the homepage hero image must come from a customer-approved source and be prepared separately from the news upload flow

### Failure handling

- explain what to do if admin login fails
- explain who to contact for technical support
- explain who owns domain/DNS/mail
- explain who owns app/backend support after handover

## 6. Post-deploy smoke test checklist

### Public site

- homepage loads
- all key public routes load
- footer links work
- mobile/responsive check passes on a narrow viewport

### Admin flow

- admin login works
- forgot-password flow opens `/auth/reset-password`
- reset email returns through `/auth/callback`
- update-password form works at `/auth/update-password`
- create draft/test news
- upload test image
- edit test news
- delete or archive test news
- verify the public site reflects the expected result

### Browser/runtime checks

- verify no critical production console errors
- verify no obvious broken images
- verify no broken internal links
- verify the homepage hero no longer uses the placeholder asset before final launch
- verify `/kalender` renders the public booking Google Calendar iframe
- if `NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL` is set, verify the override renders the intended calendar iframe

## 7. Old news migration plan

### Target scope

- migrate only the old public news content needed for launch
- preserve current public functionality and design
- do not expand the content model during migration

### Required fields per migrated item

- `title`
- `date`
- `body/content`
- `image` if available and approved for reuse
- `source URL` if the old article should remain traceable

### Recommended migration sequence

1. inventory the old website news archive and record source URLs
2. decide which historical posts must exist at launch and which can stay behind
3. extract title, publish date, body, image, and source URL for each selected article
4. normalize body content into the current editor-safe format
5. compress and prepare each image before upload
6. create the news posts in the new admin
7. verify each migrated article on `/nyheder` and `/nyheder/[slug]`

### Manual fallback

Use manual entry if scraping or bulk import is risky because of inconsistent HTML, missing assets, or formatting drift:

1. open the old article
2. copy title, date, and body into the new admin
3. upload the associated image only if the file is available and approved
4. store the old article URL in migration notes or a source field if one is added later
5. publish only after visual QA confirms the new article renders correctly

### Launch decision rule

- do not block launch on full historical migration
- prioritize the most recent or most important news first
- leave the remaining archive for a controlled post-launch migration pass if needed

## 8. Rollback plan

### Vercel rollback

- identify the previous production deployment
- use Vercel rollback if the new production deploy is bad
- note Hobby limitation: rollback is only to the immediately previous production deployment

### DNS rollback

- keep a record of previous DNS values before cutover
- restore previous website A/CNAME records if the new host must be removed
- verify mail records remained intact

### Supabase rollback / data expectations

- schema rollback is not the same as deployment rollback
- if a destructive schema or data mistake is made, recovery depends on available exports/backups
- define manual export expectations before launch

### Supabase Free limitation

- do not assume enterprise-grade backup/recovery on Supabase Free
- treat manual exports and careful migration discipline as part of the launch process
