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
- [x] Logo and favicon set — client's brand kit landed 2026-09-09.
      `src/data/brand.ts` declares every path; `public/assets/brand/`,
      `public/assets/icons/`, `public/favicon.ico`, `src/app/manifest.ts`.
      Supersedes the CSS-drawn prototype mark and the peach raster that
      followed it. See `docs/09-design-system.md`, "Logo".
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

## Client feedback round 1 — 2026-09-09

Received as a numbered document from the client. Sections 3 and 5 to 10 have
been passed to the build so far; 1, 2 and 4 are not in this repository yet.

- [x] **§3 About Us / company positioning.** Remove the messaging that presents
      the operator by name as the person behind GLVITR'CLEAN; the site speaks as
      a company, not a one-man operation. Client's own wording: "Behind
      GLVITR'CLEAN is a competent and experienced team." Done in both editions —
      `home.aboutLead`, `home.whyCards[0]`, `b2b.contactBody`, and the English
      `home.lead`; `company.operator` deleted. Reverses trust-stack item 4 in
      `docs/05`. Details in STATUS.md.
- [x] **§5 Opening hours.** Monday–Friday 9:00–18:30, Saturday–Sunday
      10:00–18:00, to be shown in the contact section and/or the footer. Done in
      both editions: declared once in `company.openingHours`, printed in the
      footer contact column and on `/devis` under the call button, and emitted
      as `openingHoursSpecification` on the LocalBusiness node so a Google local
      result can answer "open now?". Details in STATUS.md.
- [x] **§10 Chatbox — feasibility.** "Check feasibility and recommend the
      simplest appropriate solution. A lightweight contact/chat widget may be
      sufficient; a complex AI chatbot is not necessarily required." Feasible,
      and shipped at the lightweight end of exactly that range: `ChatLauncher`,
      a floating `<details>` on every route whose panel offers call, WhatsApp
      with a drafted first line, and the quote form. Zero JavaScript, zero
      cookies, no consent banner, no third-party request. A hosted widget and an
      AI chatbot were both ruled out on their own merits — reasoning in
      `docs/05`, "Chatbox". Amends that document's "no live chat widget", which
      still holds for an actual live chat. Details in STATUS.md.
- [x] **§6 Service area.** "Update the intervention area to clearly include
      Seine-et-Marne (77), Essonne (91). Update relevant location and SEO content
      accordingly." Done at DEPARTMENT level, which is the level the client
      supplied: `company.serviceArea.departments` now holds both, `areaServed`
      emits an `AdministrativeArea` for each on every LocalBusiness and Service
      node, and the H1s, the descriptions, the `/zones` title, the hub copy and
      `llms.txt` all name both. **No 77 commune page was generated**: the client
      named the department but not the towns, and a commune page needs a real
      `localAngle` (rule 4) and a target query (rule 3). Blocked on the town
      list — STATUS.md item 3.
- [x] **§7 Trust / team message.** "Replace the current single-person
      positioning with a stronger team message… Also highlight: no
      subcontractors, no intermediaries." Done: `company.tagline` is now the
      client's own line, the home "about" H2 carries it, and "pas de
      sous-traitance, pas d'intermédiaire" leads the checklist, heads the first
      "why us" card, opens the B2B expectations list and closes the footer
      description — in both editions. No headcount, no years, no certification:
      rule 4 is unchanged.
- [x] **§8 New service — solar panel cleaning.** Added as the seventh service,
      `panneaux-solaires`, with its own page in both editions and all twelve
      commune crossings: 26 new routes, 198 → 224. `taxCreditEligible: false`,
      for the same reason facade is — see STATUS.md, and note that the
      compliance guard picked the new page up on its own.
- [x] **§9 Welcome pop-up.** "Add a small floating welcome message that appears
      to visitors: *Que puis-je faire pour vous ?*" Done as a greeting bubble on
      the chat launcher from §10 rather than a second floating widget. CSS only,
      no script, no stored state. One deviation, flagged: the message is in the
      plural. See STATUS.md.
- [x] **Title format and copy quality** (relayed by the human on 2026-09-10;
      numbering unknown, so filed here rather than guessed at). "On the title
      or SEO make it like this: GLVITR'CLEAN | MULTI SERVICE, and improve the
      copies." Done: the brand line is `company.brandLine` and suffixes the 28
      routes per language that carry a brand, plus `og:site_name`, the manifest
      name, the `llms.txt` heading, the 404 title and the LocalBusiness
      `alternateName`; the 84 commune × service titles stay brand-free on
      purpose. The copy pass rewrote 97 strings across services, communes, FAQ,
      the dictionary and the fixed-page descriptions, in both editions, and
      surfaced a live bug: 19 of 168 deep descriptions were shipping with no
      call to action. Details in STATUS.md.
- [ ] Sections 1, 2, 4 — not supplied to the repo. Paste them in and they get
      specced here before anything is written. The message above may well BE
      one of them; if so, tick it there when the document arrives.

**Done when:** every supplied section is either implemented or recorded here as
refused with a reason (rule 1 and rule 4 do not bend for feedback).

---

## Phase 8 — Competitor teardown, code side — DONE 2026-09-10

Two teardowns were run and written up in `TODO.md`: Mr Sparkle Window Cleaning
(Melbourne) and SPIC AND SPAN (Paris). Each item there is tagged `[code]`,
`[client]`, `[blocked]` or `[reject]`. **This phase is the `[code]` set and
nothing else.** The other tags stay in `TODO.md` until the fact they wait on
exists; they are not silently converted into invented content.

Verified against the raw HTML of the Paris page, because it changes what is
worth copying: it emits **no `hreflang`**, **no JSON-LD of any kind**, and
leaves its twenty arrondissements as unlinked plain text. We already beat all
three. What it does better is heading discipline, geographic enumeration and
sitewide internal linking — that is what this phase takes.

### 8a — Commune depth: why the dirt is there, and what it sits on

- [x] Two new `Commune` fields beside `localAngle`: `soiling` (the physical
      cause) and `housing` (the building stock). Both `Localized`, both
      mandatory, so a new commune cannot be added thin.
- [x] Rendered on `/zones/[commune]` and on the 84 `[commune]/[service]`
      crossings, which today repeat one shared `localAngle` sentence and
      nothing else local.

Why: the Brighton page names a beach, a pier and a shopping street, and then
gives a *cause* — "the same salt-laced breeze… leaves a steady film on every
pane". Cause is what makes a commune page non-substitutable, which is what
rule 4 demands and what one templated sentence does not deliver.

Rule 4 limit, and it is a hard one: every claim must be either already asserted
in this repository or true of the whole of southern Essonne. No invented street,
no invented landmark, no invented local business. Where the existing
`localAngle` already asserts something (the Rémarde valley damp at Ollainville,
the closed air base at Brétigny), the new fields extend it rather than
contradict it.

### 8b — Internal linking: the lateral mesh

- [x] **Postal-code index.** A static list of the served postal codes, each
      linking to the commune pages that share it, on `/zones` and in the footer
      region. The Paris page's postal-code field is a one-input booking widget;
      ours cannot be — a `'use client'` router is not on rule 2's list of four —
      so the crawlable equivalent is an index. It also answers `nettoyage 91150`,
      which no current page targets.
- [x] **Nearest-commune crossings on `[commune]/[service]`.** These 84 pages
      link up to their service hub and up to their commune hub, and nowhere
      sideways. Same service, nearest communes, using the `nearestCommunes()`
      haversine that already exists.
- [x] **Footer as link distributor.** Audit what the footer reaches from an
      arbitrary page: today, seven services and four fixed pages. It reaches no
      commune, no `/services`, no `/zones`. Add a zones column and the two hubs.
      **`/credit-impot` is deliberately excluded** — rule 1 permits exactly one
      global tax-credit link and `SiteChrome.tsx` already carries it in the
      header. Do not add a second.
- [x] **`/zones` answers "près de chez moi" / "near me".** Copy and heading
      only; the route exists.

### 8c — Heading discipline

- [x] A qualifier in the commune H1s, not just service plus place.
      "English-Speaking Cleaning Services in Paris" narrows the competition set
      to people who self-select; ours named a service and a town and stopped.
      Shipped on the 84 crossings as well and withdrawn from them on review: a
      crossing's H1 should be the tightest match to "nettoyage de vitres à
      Étampes", and the same appended phrase on 168 more H1s diluted it.
- [x] The place name repeated across the H2s of a local page. Six of the Paris
      page's ten H2s contain "Paris"; our commune pages name the commune in the
      H1 and in one H2, then drop it.

### 8d — Service pages: pricing basis and the longtail already in `src/data/`

- [x] A pricing block rendering `service.pricing.basis`. The field is filled on
      all seven services; `fromEur` is `null` on all seven and stays `null`
      until the client confirms numbers. The block therefore states **how** a
      price is worked out and that the quote is free — a basis with no figure,
      which is what rule 4 permits. The figure slot exists and lights up on one
      edit per service.
- [x] Render `service.longTail`. Seven arrays of real French sub-service names —
      `démoussage terrasse`, `nettoyage véranda`, `nettoyage baies vitrées` —
      already in `src/data/services.ts`, described in their own comment as being
      for copy, and rendered nowhere. Mr Sparkle's "Every Window Type in Your
      Home, Handled" is the same move: absorb the near-queries into the page
      that already ranks instead of minting thin routes for them.

### 8e — Conversion cadence

- [x] More than one `ConversionBlock` per page. Every long template renders
      exactly one, at the bottom. Mr Sparkle places a call/quote pair after
      almost every section; a visitor who leaves at 40% scroll currently sees no
      in-content action at all.
- [x] The process steps on service and commune pages, not only the home page.
      `home.steps` already exists and is rendered once.
- [x] The photo-quote path promoted out of prose. "Send a photo, get a quote"
      is already true — `services.ts` says it for `poubelles` and
      `panneaux-solaires`, `company.whatsapp` exists, `ChatLauncher` already
      drafts the first line — and it is currently buried mid-paragraph on two of
      seven pages. **No response time may be promised**: that is a `[client]`
      item, and the `chat` block in the dictionary already carries the rule.
      **And it may only appear where the data allows it.** Shipped hard-coded on
      every service page, which put it on `facade` ("visite préalable
      indispensable") and `terrasse` ("mesurée sur place"); now gated on a new
      `Service.photoQuote` field, true for three of the seven.

### 8f — the machinery for the content-blocked items

Added 2026-09-10, after the first five sub-phases were done. Five `TODO.md` items
were tagged `[blocked]` or `[client]` on the grounds that the content did not
exist — and on inspection the content was the *only* thing missing. The repository
already has a pattern for exactly that: `company.sapDeclaration.number` is `null`
and the badge renders pending mode, `company.social` is `[]` and `sameAs` appears
the moment it is filled. So the code ships first and lies dormant.

- [x] **Reviews.** `src/data/reviews.ts` (empty) → `aggregateRating` + `review`
      on the LocalBusiness node, and `<Reviews />` on the home page and, filtered
      to that town, on every commune page. Each review links out to where it was
      left, so a reader can check it. Server-rendered, because both competitors
      use a third-party widget that rule 2 forbids outright.
- [x] **Before/after pairs.** `src/data/realisations.ts` (empty) →
      `<BeforeAfter />` on `/realisations` and on each service page. Two images
      side by side, not a slider: a slider needs `'use client'`. `/realisations`
      shows the gallery or the "photographs are coming" note off one condition,
      so it can never show both or neither.
- [x] **Job durations.** `Service.duration`, `null` on all seven, renders a
      *Durée sur place* row in `<PricingNote />`.
- [x] **The insurance line.** `company.insurance`, all `null`, replaces "À
      compléter" on `/mentions-legales` with the real policy when filled.
- [x] **Price in the meta description.** `fromPriceClause()` in `seo.ts`, a middle
      clause so it can never cost the unique first clause or the closing call to
      action.

- [x] **A guard so "dormant" is a state the repo can trust, not hope for.**
      `scripts/check-proof.mjs`, wired into `verify:full` as `check:proof`. It
      fails the build if the arrays are empty but review or gallery output
      reached the export; if they are populated but structurally invalid (rating
      out of range, non-ISO date, a non-paper review with no checkable URL, an
      obvious placeholder left behind); or if any before/after image points into
      `public/assets/placeholder/`. That last one is the rule 4 case no other
      check can see — stock presented as the client's own work.

Each one was proved by populating it temporarily, checking the rendered markup and
the JSON-LD, and reverting — scaffolding that has never been run is not scaffolding,
it is a guess. The guard was tested the same way, against four deliberately bad
inputs, and the first version **passed all of them**: it located the opening
bracket of `: Review[]` instead of the array literal and read every array as
empty. A check only ever seen to pass has not been tested. Verified on activation: `aggregateRating` 4.5 from 2 reviews, both
`Review` nodes, the commune filter showing one review and not the other, the
unlinked paper-review case, the *À partir de* and *Durée sur place* rows, the
description carrying `À partir de 120 €.`, and the insurance line in both editions.

**Done when:** every `[code]` box in `TODO.md` is ticked, `npm run verify:full`
passes, and each remaining item there says which fact it waits on.

All three hold. `TODO.md` now has **no `[code]` and no `[blocked]` work left** —
all fourteen open boxes are `[client]`, and each names the fact it waits on. The
`/tasks` item was retagged `[code]` → `[client]` in the process: the blocker was
never naming the target queries, it is that the genuinely distinct task queries
are distinct because they are *different services* the client may not sell, and
publishing one would advertise work that does not exist.

**Explicitly not in this phase**, and each one is a `TODO.md` tag, not an
oversight: prices, guarantees, response times, insurance figures and customer
counts (`[client]` — rule 7); review markup and before/after slots
(`[blocked]` — phases 5 and 7); and the `/tasks` taxonomy, which is `[code]`
but gated on rule 3 — a new route needs a named target query per page, and
choosing those queries is not an agent's call.

## Out of scope for v1

Booking, customer accounts, online payment, blog, Google Ads, automated review
requests, CRM. Each becomes its own quoted phase later.

The English edition was on this list until 2026-08-31, when the human asked for
it. It shipped: 99 basePaths × 2 editions = 198 routes. CLAUDE.md rule 0 records
what that change had to preserve and how it is now enforced mechanically.
