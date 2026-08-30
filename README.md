# GLVITR'CLEAN

Local-search website for a cleaning business in the southern Essonne (91).
Next.js 15, static export, French only, no database.

## Read these first, in order

1. `CLAUDE.md` — fixed rules. Start here. The compliance section is not optional.
2. `ROADMAP.md` — phase order and done criteria
3. `STATUS.md` — what is finished and what is waiting on a human
4. `docs/` — business model, market, competitors, keywords, compliance

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run verify       # typecheck + lint + seo uniqueness. Must pass before commit.
npm run build        # static export to ./out
npm run verify:full  # verify + build + legal compliance grep. Before shipping.
```

## Shape of the site

| Route | Count | Source |
|---|---|---|
| `/` | 1 | hand-written |
| `/services/[slug]` | 6 | `src/data/services.ts` |
| `/zones/[commune]` | 12 | `src/data/communes.ts` |
| `/zones/[commune]/[service]` | 72 | cross product |
| Fixed pages | 6 | hand-written |
| **Total** | **97** | |

Every route gets a unique title and description. `npm run check:seo` fails the
build if two ever collide.

## The one rule that matters most

The 50% tax credit renders only where `taxCreditEligible` is `true` in
`src/data/services.ts`. Never on facade, never on bins, never on the
professionals page. Read `docs/04-compliance-sap.md` before touching anything
that mentions it.

## Design system

Deliberately not implemented. `src/app/globals.css` has a placeholder token
block. Do not pick colours or fonts. See rule 6 in `CLAUDE.md`.
