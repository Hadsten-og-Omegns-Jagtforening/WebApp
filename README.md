# HOJ — Hadsten & Omegns Jagtforening Design System

A fresh design system for a planned redesign of the web app for **Hadsten & Omegns Jagtforening** (HOJ) — a Danish local hunting and shooting association founded around their clay-pigeon range (running since 1968) and clubhouse on Vissingvej 6, 8370 Hadsten.

> ⚠️ **This is a proposed refresh, not a recreation.** The current site (https://www.hadstenjagtforening.dk/) runs on a dated WordPress "Minamaze" theme with orange accents and a photographic hero style. The user has asked for a redesign, so this system is a modern reinterpretation grounded in the brand's realities — not a copy of the existing site.

## Local environment

This app requires real Supabase environment variables to run locally.

Create `C:\Users\kaspe\hobby_proj\websites\HOJ_webapp\.env.local` from `.env.example` and fill in real values from your Supabase project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-real-anon-key-from-supabase
SUPABASE_SERVICE_ROLE_KEY=your-real-service-role-key-from-supabase
```

Notes:
- `NEXT_PUBLIC_SUPABASE_URL` must be the actual Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` must be the real `anon` key for the same project.
- `SUPABASE_SERVICE_ROLE_KEY` must be the real `service_role` key for the same project.
- Placeholder values like `ABCD` will still fail.
- Restart `npm run dev` after changing `.env.local`.
- Do not commit `.env.local`.

## About the association

- **Legal name:** Hadsten & Omegns Jagtforening · **CVR:** 34123268
- **Location:** Vissingvej 6, 8370 Hadsten, Denmark
- **Founded (range):** 1968 · **Members:** ~149 email subscribers (indicator only)
- **Core activities:**
  - **Flugtskydning** (clay-pigeon / trap shooting) — the central activity
  - **Jagt** — bukkejagt (roe-deer), rågeregulering (rook control), formidlingsjagter for new hunters
  - **Træning & kurser** — haglskydeprøve, help for those who failed "jagttegn"
  - **Præmieskydning** — HOJ Cup, Fastelavnsskydning, Midsommer/Skt. Hans, Mærkeskydning, Juleskydning
  - **Banebooking** — private groups, stag parties ("polterabender"), company events
  - **Medlemsfællesskab** — klubhus-aftener, foredrag, spisning
- **Committees (udvalg):** Baneudvalg, Jagtudvalg, Riffeludvalg, Skydeudvalg
- **Target audience:** Primær målgruppe er **lokale jægere og skydeinteresserede, ofte mænd og ofte i den ældre del af målgruppen**. Design must be practical, outdoorsy, and above all **highly readable and easy to navigate** — large type, high contrast, big hit targets, no hover-only UI.

## Sources reviewed

- **Current live site:** https://www.hadstenjagtforening.dk/ (WordPress, Minamaze theme) — reviewed for structure, activities, tone, photo style. Contains a rotating homepage slider, three activity tiles (Åbningstider, Book skydebanen, Kalender), a news blog, and a sponsor strip (Jafi).
- **Client brief:** `uploads/HOJ_Projekt_ny_hjemmeside.pdf` — spec from a club representative describing the desired site structure, page hierarchy, news-post schema, and admin approach. This is the authoritative source for IA; visuals are up to us.
- **Banevagter app:** http://hadstenjagtforening.dk/banevagter/ — an existing member-facing app, kept out of the redesign scope but listed as visual inspiration in the brief.
- **Ticketing:** hadstenjagtforening.safeticket.dk (external SafeTicket system)
- **Support:** hoj.zendesk.com/hc/da
- **Assets:** The current site's logo and photos could not be fetched programmatically from this sandbox (CORS). See **Asks / open items** below — the user will need to upload the logo and a few hero photos.

## Site structure (from the client brief)

```
/                               — Forside: quick-nav boxes + news feed
/book-skydebanen                — quick-link + own dropdown entry
/kalender                       — embed of public Google Calendar
/aktiviteter                    — dropdown parent
  ├── /aktiviteter/jagt         — bukkejagt, hjort, efterårsjagt (sub-pages editable)
  ├── /aktiviteter/hjalp-til-jagtproven
  └── /aktiviteter/premieskydninger  — overview feed of prize-shoots
        └── /fastelavnsskydning, /hoj-cup, /skt-hans, /merkeskydning, /juleskydning
/praktisk-info                  — dropdown parent
  ├── /kalender                 — (same)
  ├── /praktisk-info/åbningstider-og-skydetider
  ├── /book-skydebanen          — (same)
  └── /praktisk-info/bestyrelsen
/banevagter                     — existing external app, untouched
/admin                          — login-gated editor (create news, edit sub-pages)
```

### News post schema (required by brief)
- **Overskrift** (headline)
- **Brødtekst** (body)
- **Billede** in fixed format (any ratio as long as it works desktop + mobile — the system standardises on **3:2** at 1200×800)
- **Resultater** block — optional; must be collapsible/hideable. Plain text is fine; no fancy structure required.
- **Teaser** on listings = first line of body + "…" + CTA "læs mere her"; **entire card clickable**.


## Index (manifest)

- `README.md` — this file (context, content fundamentals, visual foundations, iconography)
- `SKILL.md` — agent-skill manifest for reuse
- `colors_and_type.css` — design tokens (colors, typography, spacing, radii, shadows)
- `fonts/` — webfonts (Google Fonts links; local files to be added if licensed)
- `assets/` — logos, photos, iconography
  - `logo-placeholder.svg` — stand-in mark until real logo is uploaded
  - `placeholder-hero.svg` — hero imagery placeholder
- `preview/` — Design System tab cards (typography, colors, components, etc.)
- `ui_kits/website/` — redesigned marketing + member web app (JSX components, `index.html`)
  - Covers: forside, book skydebanen, kalender, præmieskydninger (+ detail), bliv medlem, nyhedsartikel, generic editable sub-pages. See `ui_kits/website/README.md`.
- `uploads/HOJ_Projekt_ny_hjemmeside.pdf` — client brief (IA, page structure, news schema)

## Asks / open items → please help me iterate

1. **Upload the real logo** (SVG preferred) from `/wp-content/uploads/2020/06/Jagt-logo.png` — used throughout as the brand mark.
2. **Upload 4–6 high-res photos** of the clubhouse, shooting range, clay pigeons, hunters in the field, trophy shots, etc. These anchor the hero and activity sections.
3. **Confirm palette direction:** I've proposed a forest/loam/brass palette (deep evergreen, loam brown, brass/amber accent, bone-white). Current site uses orange/red on cream — is that equity we must preserve, or is a cleaner refresh OK?
4. **Fonts:** I've chosen Fraktur-free, masculine, outdoorsy pairing — **Fraunces** (editorial serif, small-display use) + **Inter** (body/UI). If you'd rather avoid Fraunces (common in AI-generated designs), say so and I'll swap to a more distinctive serif like **Source Serif 4** or **DM Serif Display**.

---

## BRAND CORE

### Positionering
HOJ er et lokalt samlingspunkt for jagt, flugtskydning og fællesskab i Hadsten — med praktisk træning, faste traditioner og plads til både nye og erfarne jægere.

### Brandpersonlighed
- Praktisk, ikke poleret
- Robust, ikke aggressiv
- Traditionsbåret, ikke gammeldags
- Imødekommende, ikke sælgende
- Lokal, ikke lifestyle-brand

### Brandløfte
Det skal være nemt at finde information, møde op, deltage og blive en del af fællesskabet.

### Visuel idé
Designet skal føles som en blanding af **klubhus, resultattavle og jagtdagbog**: varmt, overskueligt og solidt.

### Hvad brandet ikke er
- Ikke taktisk eller militært
- Ikke outdoor webshop
- Ikke startup/SaaS
- Ikke luksusjagt
- Ikke kommunal standardportal

---

## CONTENT FUNDAMENTALS

How HOJ writes.

### Language & voice
- **Always Danish.** The site is entirely in Danish; do not mix in English phrases.
- **Du-form.** Informal, direct second person — "du" / "dig," not the formal "De." Example from the site: *"Vil du booke vores skydebane, så er det lige her."*
- **Club-first plural.** The association speaks as "vi" and "foreningen" — *"Foreningen tilbyder som altid bukkejagt…"*, *"…har vi valgt at afholde vores første 80 duers jagtskydning."*
- **Short, plain sentences.** Practical announcements, not marketing copy. Dates, times, prices. Members read to get information, not to be sold to.
- **Warm but matter-of-fact.** Small touches of hospitality — *"Kig forbi til en hyggelig formiddag, hvor der vil være rundstykker i klubhuset fra kl. 09.00"* — but never effusive.

### Casing
- **Sentence case** everywhere — headlines, buttons, nav. Title Case is not used.
- Danish-proper nouns capitalised normally: *Hadsten, Jafi, Skt. Hans, HOJ Cup.*
- The club abbreviation **HOJ** is always all-caps.

### Terminology (use these exact words)
| Danish | What it is |
|---|---|
| Flugtskydning | Clay-pigeon shooting (core activity) |
| Skydebanen | The shooting range |
| Klubhuset | The clubhouse |
| Jagttegn | Danish hunting licence |
| Haglskydeprøven | The shotgun practical exam |
| Bukkejagt | Roe-deer buck hunt |
| Rågeregulering | Rook control |
| Præmieskydning | Prize-shoot competition |
| Lodtrækning | Draw / lottery |
| Bestyrelsen | The board |
| Udvalg | Committee (Baneudvalg, Jagtudvalg, Riffeludvalg, Skydeudvalg) |
| Medlem / medlemsfordele | Member / member benefits |
| Indmeldelse | Sign-up / joining |
| Kalender · Aktivitetskalender | Calendar / activity calendar |

### Tone examples (copy directly from the site)
- **Announcement:** *"Så fik vi afholdt vores første 80 duers jagtskydning – tak til alle der kom, støttede op og deltog!"*
- **Invitation:** *"Kom med HOJ på jagt"*
- **Call-to-action:** *"Vil du booke vores skydebane, så er det lige her."*
- **Event note:** *"Sidste kortsalg er kl. 11.30. Fra kl. 12.30 er banen åben for alle med almindelig træning."*

### What to avoid
- Corporate-speak ("innovativ løsning", "transformér din jagtoplevelse").
- Emoji. The site does not use them and the audience (25–55 male hunters) would find them out of place.
- Exclamation-stacked hype. One "!" per announcement is plenty.
- English loanwords where a Danish word exists (except established ones: "CUP", "booke", "event" is fine; "kalender" not "calendar").
- "Vi passer på naturen" green-washing. HOJ talks about hunting honestly — respect for game and tradition, not sustainability slogans.

---

## VISUAL FOUNDATIONS

The system is built to feel **sturdy, outdoorsy, and handmade-industrial** — like a field notebook crossed with a reloading bench. It must read as authentic to Danish hunting culture, not suburban-lifestyle-brand.

### Colours
Palette is pulled from the material world of hunting: forest canopy, sub-canopy moss, bark, wet loam, brass cartridge, bone, broken clay-pigeon orange.

- **Forest (#1E2A22 → #2C3B30)** — primary dark. Used for nav, body text on cream, hero overlays. Near-black with a green undertone, reads as "after-dusk in the woods" rather than corporate black.
- **Loam (#5A4A3A → #8A7359)** — secondary warm-neutral. Body chrome, secondary buttons, borders.
- **Bone (#F4EFE4)** — primary background. Warm off-white, like a waxed-cotton jacket. The site's "canvas."
- **Paper (#FAF8F2)** — card/surface, slightly lighter than bone.
- **Brass (#B8893A → #D4A557)** — the hero accent. Warm amber/brass, lifted from a shotgun shell. Use for primary CTAs, focus rings, key callouts.
- **Clay (#C7502E)** — **alert only**: banen lukket, event aflyst, form-fejl, destructive confirmations. A nod to the broken clay-pigeon orange. Never used for positive states.
- **Moss (#5E7347 / #7A8F5F)** — **positive live / success**: "banen er åben", tilmelding åben, confirmation checkmarks. This is what pulses next to "åben nu" in the hero status chip, not Clay.
- **Slate (#3A4550)** — cool neutral for UI chrome where warm loam is wrong.

### Typography
- **Display / Headlines — Fraunces** (variable, with SOFT optical size): editorial serif with hunting-catalogue warmth. Set large, tight tracking, optical size 144 for H1.
- **Body / UI — Inter**: workhorse sans-serif. Set at 16–17px for body on web. Weights 400/500/700.
- **Monospace — JetBrains Mono**: scorecards, results lists (*"76/81 · 72/82"*), cartridge/serial-style numerics.
- **Scale:** 12 / 13 / 15 / 17 / 20 / 24 / 32 / 44 / 64 / 96. Generous leading (1.5 body, 1.1 display).

> ⚠️ **Font substitution flag.** HOJ has no documented house typeface. Fraunces + Inter are my recommended pairing via Google Fonts; if the user wants a more distinctive serif or wants to stay safer, swap to **Source Serif 4**.

### Spacing & layout
- **8px base grid.** Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
- **Generous whitespace.** Landing pages feel like field-notebook pages — big gutters, clear hierarchy. Member areas are denser.
- **Max content width 1200px** for marketing, 1440px with sidebar for member/admin tools.
- **Fixed elements:** sticky top nav (64px, Forest BG on scroll). Footer is full-bleed Forest with Bone text.

### Backgrounds & imagery
- **Photography-forward.** Real photos of the range, the clubhouse, autumn fields, dogs, clay pigeons mid-shatter, hunters at dawn. Warm-toned, slightly grainy. Never stocky "men-in-office" imagery.
- **Treatment:** slight warm grade (lift shadows ~+5, push warmth +10). Subtle film grain (4–6% noise overlay) on hero photos.
- **No decorative gradients.** Backgrounds are flat bone or paper. Gradients are only used **functionally for image legibility** — i.e. a Forest-toned top-to-bottom gradient over hero photos to keep headline text readable. Never as an aesthetic element on its own.
- **Topographic line pattern** — a repeating contour-line SVG pattern (Loam @ 6% opacity) used on section dividers and empty-states. Reference: topo maps from a hunting atlas.

### Corners & radii
- **Small radii.** 4px for buttons/inputs, 8px for cards, 12px only for hero/modal. Nothing pill-shaped. Fully-squared corners on data tables and result lists (feels like printed scoresheets).

### Borders
- **1px Loam @ 25% opacity** (`#8A735940`) for card/input borders on Bone.
- **2px Forest** for emphasised inputs (focus).
- Section dividers: 1px Loam-on-Bone, or a 12px-tall topographic pattern strip.

### Shadows
- **Inset:** subtle `inset 0 1px 0 rgba(255,255,255,0.6)` on raised buttons for a "pressed metal" top highlight.
- **Drop:** conservative. `0 1px 2px rgba(30,42,34,0.08), 0 2px 8px rgba(30,42,34,0.06)` for cards. Modals get `0 20px 60px rgba(30,42,34,0.25)`.
- **No glow / no neon.** Never RGB shadows.

### Hover / press / focus
- **Hover:** darken filled buttons by ~8% (brass → deeper brass). On ghost/outlined: background fill @ 8% of the stroke colour.
- **Press:** translateY(1px) + inner shadow; no scale.
- **Focus:** 2px Brass outline, 2px offset.
- **Link hover:** underline thickens from 1px to 2px, stays Forest (no colour shift).
- **Transitions:** 150ms ease-out for colour, 200ms ease-out for transforms. No bounces, no springs.

### Animation
- **Minimal.** Fade + slide-8px on scroll reveal, 250ms ease-out.
- **No parallax, no confetti, no hero videos with swooping B-roll.**
- Loading: a single slow 900ms rotation on a small crosshair glyph.
- Respect `prefers-reduced-motion` — disable all transitions beyond opacity.

### Transparency / blur
- Use sparingly. Sticky nav gets `backdrop-filter: blur(12px)` + Bone @ 80% once scrolled. Modals use a Forest @ 60% backdrop (no blur).

### Cards
- **Paper background** on Bone page. 1px Loam-25% border. 8px radius. Drop shadow only on hover, not at rest. Cards feel like index cards, not floating glass.

### Layout rules
- **One hero per page** with photo + headline + one primary CTA.
- **Never stack two coloured CTAs** — always primary Brass + secondary ghost.
- **Data lists are left-aligned, monospace numerics** — scoresheets are sacred.
- **Icons stay on their own line** above labels in nav tiles; do not wrap icon + text inline except in buttons.

---

## ICONOGRAPHY

### Approach
HOJ's existing site does not use a modern icon system — it uses small photo thumbnails for "Skydetider, Jagtdatoer, Deltage i samtalen." For the redesign, I've introduced **Lucide** (https://lucide.dev) as the icon system:

- Stroke-based, 1.75px weight, 24px default, square terminals.
- Feels utilitarian and field-gear–adjacent; pairs cleanly with Fraunces + Inter.
- Loaded from CDN (see `ui_kits/website/index.html`).

### Why Lucide
- Open-source, well-maintained, comprehensive (1000+ icons).
- Has the concrete icons we need: `target`, `crosshair`, `calendar`, `map-pin`, `users`, `trophy`, `ticket`, `book-open`, `tree-pine`, `leaf`, `mountain`, `mail`, `phone`.
- Consistent with the matter-of-fact, outdoorsy feel.

### Custom glyphs
Two custom SVG glyphs are included in `assets/` for hunting-specific concepts Lucide doesn't cover cleanly:
- `icon-claypigeon.svg` — a clay-pigeon silhouette (used for flugtskydning).
- `icon-shotshell.svg` — a shotgun shell (used for ammunition/centerhold).

### Unicode / emoji
- **No emoji** anywhere in the UI.
- **Unicode glyphs allowed:** `·` (interpunct as separator), `—` (em-dash), `→` (as CTA arrow), `✓` (as confirmation).

### Logo
- `assets/logo-placeholder.svg` — a deer-head-in-shield monogram as a stand-in. **Replace with the real HOJ logo** (the current PNG at `/wp-content/uploads/2020/06/Jagt-logo.png`) once uploaded.
- Logo colour variants: Forest on Bone (default), Bone on Forest (inverted on dark surfaces).
- Clearspace: always leave 50% of the logo's own height on all sides.
- Minimum size: 24px tall.

### Photography treatment
- Warm, slightly grainy, human-present. Dawn/dusk light preferred over midday.
- Avoid clinical product shots of firearms — always in context (on a bench, being carried, cleaned).
- B&W treatment reserved for historical/archive imagery ("Arkiv" section).
