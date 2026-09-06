# ROADMAP.md — GLVITR'CLEAN

Phases run in order. A phase is not done until its Done criteria all pass.
Do not start phase N+1 while phase N has an open criterion.

---

## Phase 0 — Discovery (human, blocking) — DONE 2026-08-31

Nothing is built until these answers exist. They are recorded in
`src/data/company.ts` and `docs/08-non-code-checklist.md`.

A ticked box below means **recorded**, not **answered**. Every item still
carrying `null` is listed in `STATUS.md` with what it blocks, and the client
asks are written out in `docs/10-discovery-questionnaire.md`.

- [x] Cooperative name + SAP declaration number — `null`, badge stays pending
- [x] Who issues the invoice and the annual attestation fiscale — `null`
- [x] Final service area: Essonne only, or Essonne + 77 + 94 — provisionally
      `['91']`, `serviceArea.confirmed: false`
- [x] Registrar / DNS access for `glvitrclean.com` — unknown, Phase 6 only
- [x] Logo file, highest resolution available — absent, Phase 5 only
- [x] Photo archive (client's Drive folder) — absent, Phase 5 only
- [x] Facebook and Instagram URLs — `company.social: []`
- [x] Existing Google Business Profile, if any — `null`, Phase 7 only

**Done when:** every item above is either answered in `company.ts` or explicitly
marked `null` with a note in `STATUS.md` explaining what it blocks.

---

## Phase 1 — Foundation — DONE 2026-09-06

- [x] Next.js 15 App Router, `output: 'export'`, TypeScript strict
- [x] `src/data/` populated: company, services, communes, faq
- [x] `src/lib/routes.ts` enumerates every route from data
- [x] `src/lib/seo.ts` metadata generator
- [x] `src/lib/schema.ts` JSON-LD builders
- [x] `npm run verify` wired: typecheck + lint + seo uniqueness
- [x] `globals.css` token block in place — the PENDING banner is gone, removed
      2026-08-31 when the design system landed. See CLAUDE.md rule 6.

**Done when:** `npm run build` produces a static export, and `npm run check:seo`
passes with zero duplicate titles across all generated routes.

---

## Phase 2 — Core pages — DONE 2026-09-06

- [x] `/` home — built from the supplied prototype, 2026-08-31
- [x] `/services/[slug]` × 6 — body copy in `services[].bodyCopy`, 2026-09-06
- [x] `/credit-impot` pillar page
- [x] `/professionnels` (B2B, zero tax-credit references)
- [x] `/devis` quote request
- [x] `/realisations` — see the note below
- [x] `/mentions-legales`, `/confidentialite` — the RGPD Art. 13 notice landed
      2026-09-06; two facts in it are still blocked on the client
- [x] `/services` and `/zones` hubs — added 2026-09-06 so phase 6's
      `/services-1/ → /services/` redirect has a real target

`/realisations` is a written page, not a gallery: there are no photographs
(STATUS item 6). It says what each job covers and states plainly that the
photographs are coming. Phase 5 replaces that section with real before/after
pairs.

**Done when:** all core routes render, each has unique metadata, and
`npm run check:compliance` passes.

---

## Phase 3 — Programmatic local pages — DONE 2026-09-06

- [x] `/zones/[commune]` × 12 hub pages
- [x] `/zones/[commune]/[service]` × 72 pages
- [x] Each commune page carries its own `localAngle` paragraph
- [x] Internal linking: home → services → communes → service×commune, and back
      — the "and back" edge was missing until 2026-09-06: no commune hub linked
      to any service hub. Neighbour links are now nearest-by-distance
      (`nearestCommunes`), not `slice(0, 6)`, which had left five of the twelve
      hubs with no inbound sibling link at all.
- [x] `sitemap.xml` lists all 198 URLs (99 basePaths × 2 editions)

**Done when:** 198 routes build, `check:seo` passes, and no two pages share a
title, a description, or an H1 — now enforced by `npm run check:metadata`,
which reads the exported artifact rather than the templates.

**Known limit, not a defect.** The 72 commune×service pages differentiate on
H1, `localAngle`, postal code, schema and links, plus two of the four service
body paragraphs. Copy genuinely specific to a service *in a town* needs facts
only the client holds — STATUS item 20.

---

## Phase 4 — Technical SEO and AEO — DONE 2026-09-06

- [x] JSON-LD on every route type — commune hubs gained the `Service` node
      rule 3 asks for; `areaServed` now carries `geo`
- [x] `robots.txt` and `sitemap.xml` generated
- [x] `public/llms.txt` in sync with data
- [x] FAQ blocks with `FAQPage` schema on `/credit-impot` and **all six**
      service pages (four had none until 2026-09-06)
- [x] Canonical tags absolute
- [x] OpenGraph and Twitter card metadata — 1200×630 card per edition,
      `summary_large_image`, `og:locale:alternate`
- [x] Lighthouse: performance ≥ 95, SEO 100, throttled mobile — **measured**,
      not assumed, see the numbers below

**Done when:** the above, plus every FAQ answer leads with a one-sentence direct
answer before any elaboration. Answer engines quote the first sentence.

### Measured 2026-09-06

Lighthouse 12, mobile form factor, simulated throttling, served with gzip and
immutable asset caching to match what Vercel serves:

| Route | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| `/` | 98 | 100 | 100 | 100 |
| `/services/vitres/` | 97 | 100 | 100 | 100 |
| `/zones/linas/vitres/` | 97 | 100 | 100 | 100 |
| `/credit-impot/` | 97 | 100 | 100 | 100 |

Measure against a server that gzips and sets cache headers. Against a bare
`python -m http.server` the same build scores 80, and every point of the
difference is the test server, not the site.

---

## Phase 5 — Assets and proof

- [ ] Real photos processed to WebP, sized, alt text per commune — BLOCKED,
      STATUS item 6
- [ ] Before/after pairs on `/realisations` — BLOCKED, STATUS item 6
- [x] Logo and favicon set — `src/components/Logo.tsx`, `public/assets/brand/`,
      `src/app/icon.svg`, derived from the supplied prototype 2026-08-31
- [x] Design system implemented (human supplies tokens first) — 2026-08-31

**Done when:** zero placeholder images remain and `globals.css` no longer shows
the PENDING banner.

The banner is already gone; the phase is **not** closed. Seven stock images
still sit in `public/assets/placeholder/`, marked on screen. The phase closes
when the client's archive replaces them and the `.placeholder-note` elements
come out. See `docs/09-design-system.md`, "Photography".

---

## Phase 6 — Migration — code side DONE 2026-09-06, cutover blocked on human

- [x] 301 map from the existing IONOS site — `vercel.json`, written but
      **never exercised**: nothing has been deployed against it
- [x] `/services-1/` → `/services/` — the hub was built in phase 2 for this
- [x] `/avantages/` → `/credit-impot/`
- [x] `/contact/` → `/devis/`
- [x] apex → www 301, so the existing chain survives the move
- [ ] DNS cutover — BLOCKED, STATUS item 4 (registrar access)
- [ ] Search Console property verified, sitemap submitted — BLOCKED, human
- [ ] IndexNow configured — BLOCKED, needs a key on the live host

**Done when:** old URLs redirect with 301, Search Console shows the sitemap
accepted, and the live domain serves the new build.

The old URL inventory is four indexable URLs, taken from the live IONOS site.
It is an observation, not a guarantee: re-crawl the old site at cutover before
trusting the map. See `docs/07-migration-plan.md`.

---

## Phase 7 — GEO — entirely human, nothing here is code

- [ ] Google Business Profile created, categories set, service area set
- [ ] Postal verification completed (human, can take a week)
- [ ] NAP identical across site, GBP, Facebook, Instagram, directories
- [ ] Review request flow documented for the client

Nothing in this phase is an agent task (CLAUDE.md rule 7). The code side is
ready for it: `company.googleBusinessProfile` and `company.social` are declared
and null, and `sameAs` appears in the LocalBusiness schema the moment either is
filled in. See `docs/08-non-code-checklist.md`.

**Done when:** the business appears in the local map pack for at least one
`[service] [commune]` query.

---

## Out of scope for v1

Booking, customer accounts, online payment, blog, Google Ads, automated review
requests, CRM. Each becomes its own quoted phase later.

The English edition was on this list until 2026-08-31, when the human asked for
it. It shipped: 99 basePaths × 2 editions = 198 routes. CLAUDE.md rule 0 records
what that change had to preserve and how it is now enforced mechanically.
