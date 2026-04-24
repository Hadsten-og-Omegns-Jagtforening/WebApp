# HOJ website UI kit

A hi-fi, click-through recreation of the **planned redesign** of hadstenjagtforening.dk, built against the client brief in `uploads/HOJ_Projekt_ny_hjemmeside.pdf`.

## Files
- `index.html` — app shell + React app; opens on forside.
- `kit.css` — component styles (uses tokens from `../../colors_and_type.css`).
- `Icon.jsx` — Lucide-style stroke icons + 2 custom hunting glyphs.
- `Nav.jsx` — sticky top nav with dropdowns (Aktiviteter, Praktisk info, Om HOJ).
- `Footer.jsx` — forest footer with address, shortcuts, contacts.
- `Home.jsx` — hero + quick-nav tiles + news feed.
- `News.jsx` — news list card + full-article view (with collapsible Resultater block).
- `Booking.jsx` — date picker, time/group/size form, confirmation state.
- `Calendar.jsx` — month grid + agenda sidebar (for `/kalender`).
- `Activities.jsx` — Præmieskydninger hub + reglement detail page.
- `Membership.jsx` — tiered join page with a soft "try it first" fallback.

## Covered routes (per brief)
- `/` — forside with quick-nav tiles + news feed ✓
- `/book-skydebanen` ✓
- `/kalender` ✓
- `/aktiviteter/premieskydninger` + detail sub-page ✓
- `/aktiviteter/jagt`, `/aktiviteter/hjalp-til-jagtproven`, `/praktisk-info/*` — covered by the generic "under opbygning" editable-page template ✓
- `/admin` — not included in this visual kit (backend spec is TBD)
- `/banevagter` — external app, explicitly out of scope per the brief

## Audience considerations
Per the brief, the design is optimised for **usability and readability across ages** — "specielt nu de fleste brugere er godt oppe i årene":
- Body copy 17px, lede 19–20px.
- 44px+ hit targets on all buttons and nav items.
- High-contrast Forest/Bone (WCAG AA+).
- No hover-only behaviours; all dropdowns openable with focus/click.
- Minimal animation, respects `prefers-reduced-motion`.
