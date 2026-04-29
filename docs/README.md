# HOJ Documentation

This folder contains the canonical documentation for the HOJ web application.

## Purpose

This documentation is the source of truth for:
- product structure
- design system
- implementation status
- validation and testing
- Codex execution workflow

## Key documents

- `DESIGN_SYSTEM.md` - visual system, tone, layout rules
- `SITE_MAP.md` - routes and navigation structure
- `ACCEPTANCE_CRITERIA.md` - definition of done
- `TESTING.md` - validation commands and expectations
- `IMPLEMENTATION_STATUS.md` - current implementation state
- `DEPLOYMENT.md` - deployment steps, env vars, DNS/mail notes, and free-tier operating policy
- `HOSTING_DECISION.md` - hosting option comparison and recommended launch architecture

## Rules

- Docs are the source of truth - not code assumptions
- Do not guess behavior - read docs first
- Keep docs updated when implementation changes

## Local setup note

For local development, the app needs a real `.env.local` with:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Use `.env.example` as the template. Placeholder values like `ABCD` will still fail because Supabase expects a real project URL and real keys.
