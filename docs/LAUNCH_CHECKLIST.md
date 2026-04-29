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
- `SUPABASE_SERVICE_ROLE_KEY`

Checks:

- all values come from the same Supabase project
- `SUPABASE_SERVICE_ROLE_KEY` is never copied into client code or public docs
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
- magic-link and reset-password completion are not implemented

### Admin user provisioning

- Create the production admin user manually
- Use a strong unique password
- Record who holds admin access
- Keep the admin account count minimal

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
- Verify password/reset/magic-link limitations are documented
- Verify content/storage policy is documented
- Verify the admin account count is minimal
- Verify a strong password policy is communicated to the admin owner

## 5. Customer handover checklist

### Admin usage

- explain how to reach `/admin`
- explain how to log in
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
- create draft/test news
- upload test image
- edit test news
- delete or archive test news
- verify the public site reflects the expected result

### Browser/runtime checks

- verify no critical production console errors
- verify no obvious broken images
- verify no broken internal links

## 7. Rollback plan

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
