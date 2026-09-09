# 09 — Design system

## Status: LANDED, v1 — 2026-08-31

Supplied by the human as `logo+prototype.html` (a bundled Claude Design canvas)
and implemented into `src/app/globals.css`, `src/app/layout.tsx` and
`src/app/page.tsx`. CLAUDE.md rule 6 is lifted.

`globals.css` no longer carries the `DESIGN SYSTEM: PENDING` banner. Note that
this alone does **not** close ROADMAP phase 5, which also requires zero
placeholder images. The imagery is still stock — see "Photography" below.

---

## Colour

Blue, gold, cream. The client's flyer said "blue, orange, white"; the prototype
resolved orange to a warmer gold and white to a cream paper ground, which holds
up better behind photography and keeps the gold legible as an accent.

| Token | Value | Used for |
|---|---|---|
| `--color-brand` | `#1B3A9C` | panels, primary buttons, headings on cream |
| `--color-brand-deep` | `#12276B` | hover state, wordmark, nav links |
| `--color-brand-darker` | `#0C1C55` | deepest hover only |
| `--color-accent` | `#F7C53F` | display italic, arrows, marquee, the CTA on blue |
| `--color-accent-hover` | `#FFD75E` | accent button hover |
| `--color-bg` | `#F5F3EE` | page ground |
| `--color-surface` | `#FFFFFF` | cards, form fields' container |
| `--color-border` | `#E4E1DA` | card and divider hairlines |
| `--color-text` | `#101828` | body |
| `--color-text-muted` | `#5A6072` | secondary copy |

Everything that sits **on** a blue panel has its own token
(`--color-on-brand*`), so no component ever writes an `rgba()` inline.

## Typography

Two families, both variable, both self-hosted from `public/assets/fonts/`.

| Token | Family | Role |
|---|---|---|
| `--font-body` | Schibsted Grotesk 400–600 | everything |
| `--font-display` | Newsreader italic 400–500 | the accent phrase inside a heading, nothing else |
| `--font-mono` | system mono stack | eyebrow labels, list indices, the placeholder note |

Only the **latin** subset ships.
`U+0000-00FF` plus `U+0152-0153` covers French completely, including `œ`. The
prototype's `latin-ext` and `vietnamese` faces were dropped: 107 KB of font
instead of 355 KB. Newsreader ships in italic only — its roman never appears in
the design.

Self-hosted rather than `next/font/google` on purpose: the static export makes
no third-party request at runtime and no network call at build time.

Display sizes are fluid `clamp()` values (`--text-hero`, `--text-h2`,
`--text-h3`, `--text-stat`). `--text-hero` maxes at 3.5rem, not the prototype's
4.75rem, because this site's H1 carries a full head term rather than the
prototype's four-word brand line.

## Logo

Superseded twice. The prototype drew the mark in CSS; that became
`src/components/Logo.tsx`. On 2026-08-31 it was replaced by the peach raster
downloaded off the client's live site. On **2026-09-09** the client supplied a
proper brand kit — blue, gold and cream, drawn in the site's own two faces —
and that kit is now the only artwork. Neither earlier version survives.

`src/data/brand.ts` is the single source of truth: every favicon, card and
lockup path is declared there and read by `baseMetadata()`, `manifest.ts` and
`schema.ts`. No component writes one of these paths inline.

### What renders on the page

Only one file: `public/assets/brand/lockup.webp`, through `<Brand>` in
`SiteChrome.tsx` (header and footer) and `not-found.tsx`. 527×160, the full
horizontal lockup — mark, wordmark, `NETTOYAGE PRO` baseline — on its own
`#12276B` plate, at `--radius-md`.

Two things about that are deliberate and worth not undoing:

**It is a raster, not the supplied vector.** `lockup-on-deep.svg` and
`lockup-on-brand.svg` carry live `<text>` set in Newsreader and Schibsted
Grotesk. An SVG loaded through `<img>` is its own document and cannot reach
this page's `@font-face`, so no visitor would ever see the brand faces — and
Newsreader ships **italic only** here, so inlining the SVG would not fix it
either. Worse, the rules flanking `NETTOYAGE PRO` sit at fixed x coordinates
measured for Newsreader's metrics; a wider fallback serif runs the baseline
into them. The vectors stay in `public/assets/brand/` for print, where whoever
opens them has the fonts.

**It keeps its own plate.** The wordmark is white. On the cream header it needs
a ground of its own; on the blue footer the deeper plate reads as a card. One
asset serves both, so there is no light/dark pair to keep in sync.

### Derived assets

Two files are not in the kit as supplied. Both were derived with `sharp` in a
one-off script — not committed, because `sharp` is only a transitive dependency
of Next and CLAUDE.md rule 5 governs adding it for real. The numbers are here
so the derivation is reproducible:

- **`lockup.webp` / `lockup.png`** — `logo-email-signature.png` is 600×160 with
  its artwork at x 21..505, y 24..135, leaving 94px of dead space on the right.
  Cropped to `527×160` so the 21px either side of the artwork sits against the
  24px above and below, and the plate is optically centred.
- **`og-fr.png` / `og-en.png`** — the bilingual cards were kept (they are drawn
  in the real brand faces) but embedded the superseded peach mark at
  x 968..1102, y 80..240 on the flat `#1B3A9C` panel. That rectangle was
  painted out in the panel colour and `mark-512.png` composited back at 140px,
  centred on (1035, 160).

- **`favicon.ico`** — the kit has no `.ico`. Built by hand as a three-image ICO
  (16/32/48) wrapping the supplied PNGs. It exists because Google's favicon
  fetcher and most feed readers request `/favicon.ico` by path rather than
  parsing the document.

### Handover-only

Deployed but never referenced by a page, the way `logo-original.png` already
was: `mark.svg`, `mark-512.png`, `lockup-on-deep.svg`, `lockup-on-brand.svg`,
`card-wide.png` (1200×600). For the Google Business Profile, print, WhatsApp
Business and the client's own use.

## Icons, manifest and social cards

| Path | Role |
|---|---|
| `/favicon.ico` | probed by path; 16/32/48 in one file |
| `/apple-touch-icon.png` | probed by path by iOS; 180×180 |
| `/assets/icons/favicon-{16,32,48}.png` | declared in `<link>` |
| `/assets/icons/android-chrome-{192,512}.png` | manifest, `purpose: any` |
| `/assets/icons/maskable-512.png` | manifest, `purpose: maskable` |
| `/assets/og/og-{fr,en}.png` | per-edition social card, 1200×630 |
| `/assets/og/og-brand.png` | language-neutral fallback card |
| `/assets/brand/thumbnail-1200.png` | JSON-LD `logo` and `image`, 1200×1200 |

Only the first two sit at the web root, and only because they are fetched
without a tag. Everything else is discovered through markup, so it is free to
live under `/assets/`.

The manifest is **generated** by `src/app/manifest.ts`, the same reasoning as
`sitemap.ts` and `robots.ts` — the icon list comes from `brand.ts`, so a renamed
file cannot leave a dead entry behind. Next emits it at `/manifest.webmanifest`
and injects the `<link rel="manifest">` into both root layouts itself. The kit
called the file `site.webmanifest`; the path is arbitrary as long as the link
points at it, and generating it is worth more than matching a name.

A manifest carries exactly one `lang`, so it is the French edition's. There is
no service worker and this is not a PWA: the manifest is an install target and
the carrier for `theme_color`.

`THEME_COLOR` and `BACKGROUND_COLOR` in `brand.ts` are the one place a brand
hex lives outside `globals.css`. They are not styling — they ship inside
`<meta name="theme-color">` and the manifest JSON, where a CSS custom property
cannot reach. They mirror `--color-brand` and `--color-bg` and must be changed
with them.

## Photography

**Still placeholder.** The seven images are stock photographs of models doing
generic indoor office cleaning — not Thibaut, not his work, and not the outdoor
vitres / terrasses / façades work the business actually sells.

They live in `public/assets/placeholder/` and are marked on screen with
`.placeholder-note`. CLAUDE.md rule 4 forbids presenting them as the client's
own. Phase 5 swaps the files and deletes the notes; no layout changes.

Converted PNG → WebP at display size: 3.1 MB became 132 KB.

## What was already decided, and what changed

- Spacing stays an 8px base. Unchanged.
- Mobile-first. Unchanged.
- The call button is sticky below 768px. Unchanged, and now hidden at
  `min-width: 48rem` since the header carries the number on desktop.
- Images are WebP with explicit dimensions. Unchanged; `next/image` supplies
  the intrinsic ratio and CSS pins the box, so there is no layout shift.
- **Amended:** "no animation beyond 200ms opacity and transform transitions."
  The supplied design includes a 26s infinite marquee band. It is implemented
  and it is switched off entirely under `prefers-reduced-motion: reduce`. Every
  other transition remains at `--transition` (200ms).

## The token contract, still in force

Components reference tokens. No component hard-codes a colour, and no page
carries an inline `style` object. If a component needs a token that does not
exist, add it to `globals.css` and record it here.

Still forbidden: a UI kit, an icon library, an npm font package.
