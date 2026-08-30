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

## Phase 1 — Foundation

- [ ] Next.js 15 App Router, `output: 'export'`, TypeScript strict
- [ ] `src/data/` populated: company, services, communes, faq
- [ ] `src/lib/routes.ts` enumerates every route from data
- [ ] `src/lib/seo.ts` metadata generator
- [ ] `src/lib/schema.ts` JSON-LD builders
- [ ] `npm run verify` wired: typecheck + lint + seo uniqueness
- [ ] `globals.css` token block in place with PENDING banner

**Done when:** `npm run build` produces a static export, and `npm run check:seo`
passes with zero duplicate titles across all generated routes.

---

## Phase 2 — Core pages

- [x] `/` home — built from the supplied prototype, 2026-08-31
- [ ] `/services/[slug]` × 6
- [ ] `/credit-impot` pillar page
- [ ] `/professionnels` (B2B, zero tax-credit references)
- [ ] `/devis` quote request
- [ ] `/realisations` gallery shell
- [ ] `/mentions-legales`, `/confidentialite`

**Done when:** all 13 core routes render, each has unique metadata, and
`npm run check:compliance` passes.

---

## Phase 3 — Programmatic local pages

- [ ] `/zones/[commune]` × 12 hub pages
- [ ] `/zones/[commune]/[service]` × 72 pages
- [ ] Each commune page carries its own `localAngle` paragraph
- [ ] Internal linking: home → services → communes → service×commune, and back
- [ ] `sitemap.xml` lists all 97 routes

**Done when:** 97 routes build, `check:seo` passes, and no two pages share a
title, a description, or an H1.

---

## Phase 4 — Technical SEO and AEO

- [ ] JSON-LD on every route type
- [ ] `robots.txt` and `sitemap.xml` generated
- [ ] `public/llms.txt` in sync with data
- [ ] FAQ blocks with `FAQPage` schema on `/credit-impot` and each service page
- [ ] Canonical tags absolute
- [ ] OpenGraph and Twitter card metadata
- [ ] Lighthouse: performance ≥ 95, SEO 100, on a throttled mobile run

**Done when:** the above, plus every FAQ answer leads with a one-sentence direct
answer before any elaboration. Answer engines quote the first sentence.

---

## Phase 5 — Assets and proof

- [ ] Real photos processed to WebP, sized, alt text per commune
- [ ] Before/after pairs on `/realisations`
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

## Phase 6 — Migration

- [ ] 301 map from the existing IONOS site
- [ ] `/services-1/` → `/services/`
- [ ] `/avantages/` → `/credit-impot/`
- [ ] `/contact/` → `/devis/`
- [ ] DNS cutover
- [ ] Search Console property verified, sitemap submitted
- [ ] IndexNow configured

**Done when:** old URLs redirect with 301, Search Console shows the sitemap
accepted, and the live domain serves the new build.

---

## Phase 7 — GEO

- [ ] Google Business Profile created, categories set, service area set
- [ ] Postal verification completed (human, can take a week)
- [ ] NAP identical across site, GBP, Facebook, Instagram, directories
- [ ] Review request flow documented for the client

**Done when:** the business appears in the local map pack for at least one
`[service] [commune]` query.

---

## Out of scope for v1

Booking, customer accounts, online payment, blog, English version, Google Ads,
automated review requests, CRM. Each becomes its own quoted phase later.
