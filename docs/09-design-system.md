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

Only the **latin** subset ships. The site is French-only (CLAUDE.md rule 0) and
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

`src/components/Logo.tsx` renders it inline; `public/assets/brand/` holds the
same artwork as standalone files for handover (Google Business Profile, print,
the client's own use). `src/app/icon.svg` is the favicon.

The prototype drew the mark in CSS — a circle clipping two bars under
`transform: skewX(-18deg)`. That was resolved to real geometry: at a 34px box
the skew shifts each edge by `17·tan(18°) ≈ 5.52px`. Light and inverse
variants; the inverse is used on the blue footer.

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
