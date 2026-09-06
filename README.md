# GLVITR'CLEAN

Local-search website for a cleaning business in the southern Essonne (91).
Next.js 15, static export, bilingual French + English mirror, no database.

## Read these first, in order

1. `CLAUDE.md` — fixed rules. Start here. The compliance section is not optional.
2. `ROADMAP.md` — phase order and done criteria
3. `STATUS.md` — what is finished and what is waiting on a human
4. `docs/` — business model, market, competitors, keywords, compliance

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run verify       # typecheck + lint + title uniqueness. Must pass before commit.
npm run build        # static export to ./out
npm run verify:full  # verify + build + legal compliance + exported metadata.
                     # Must pass before shipping.
```

## Shape of the site

French owns the bare paths (`/services/vitres`). English mirrors every one of
them under `/en` (`/en/services/vitres`). Slugs are never translated — a slug
is a shared key, not copy.

| Route (locale-free basePath) | Count | Source |
|---|---|---|
| `/` | 1 | hand-written |
| `/services` and `/zones` hubs | 2 | hand-written |
| `/services/[slug]` | 6 | `src/data/services.ts` |
| `/zones/[commune]` | 12 | `src/data/communes.ts` |
| `/zones/[commune]/[service]` | 72 | cross product |
| Fixed pages | 6 | hand-written |
| **basePaths** | **99** | |
| **Routes** (× 2 editions) | **198** | |

204 files are exported: the 198 routes plus `sitemap.xml`, `robots.txt` and
`404.html`.

Every route gets a unique title, description and H1, pooled across BOTH
languages. Two guards enforce it: `npm run check:seo` before the build (titles,
fast) and `npm run check:metadata` after it (titles, descriptions and H1s, read
from the artifact that actually ships — this one is authoritative).

## The one rule that matters most

The 50% tax credit renders only where `taxCreditEligible` is `true` in
`src/data/services.ts`. Never on facade, never on bins, never on the
professionals page. Read `docs/04-compliance-sap.md` before touching anything
that mentions it.

## Design system

Landed. `src/app/globals.css` holds the real tokens; `docs/09-design-system.md`
records the palette, the type scale and the reasoning. Components reference
tokens — never hard-code a colour in a `.tsx`, never use an inline `style`
object. See rule 6 in `CLAUDE.md`.

The photography is still stock placeholder, marked as such on screen, living in
`public/assets/placeholder/`. Phase 5 swaps the files.
