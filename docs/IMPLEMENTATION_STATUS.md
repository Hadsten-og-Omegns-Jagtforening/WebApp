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

### Public

- Homepage (`/`) → implemented
- Nav → implemented
- Footer → implemented

### News

- `/nyheder` → implemented (Claude baseline)
- `/nyheder/[slug]` → implemented

### Admin

- `/admin` → implemented
- `/admin/nyheder` → implemented
- `/admin/nyheder/ny` → implemented
- `/admin/nyheder/[id]` → implemented

### Backend

- Supabase integration → implemented
- Server actions → implemented

---

## Validation Status

| Check      | Status | Notes |
|------------|--------|------|
| typecheck  | ⬜     | |
| lint       | ⬜     | |
| build      | ⬜     | |

---

## UI Status

### Design alignment

- Matches approved design:
  → YES / PARTIAL / NO

### Known visual issues

- (example) hero layout mismatch
- (example) spacing inconsistency
- (example) card styling incorrect

---

## Known Issues

- (list real issues here)

Example:
- mobile nav overlap
- incorrect image ratio
- broken link in footer

---

## Missing / Not Implemented

- (list missing features only)

Example:
- kalender integration
- booking backend validation
- accessibility improvements

---

## Environment Notes

- Windows environment requires `npm.cmd`
- Some build issues may be environment-related

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

- Do not guess — verify