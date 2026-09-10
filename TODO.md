# TODO.md — competitor teardowns, unaccepted backlog

Ideas taken from teardowns of competing local-cleaning sites. **Nothing here is
a commitment.** This file is the holding area; an item graduates by being
written into `ROADMAP.md` as a phase spec (CLAUDE.md rule 8, step 1) and only
then implemented. Items are kept here rather than in `ROADMAP.md` so the
roadmap stays a record of accepted work.

Every item is tagged:

- **[code]** — implementable now, no external input
- **[client]** — needs the client to commit to a price, a promise, or a number
  (CLAUDE.md rule 7)
- **[blocked]** — waiting on a phase already tracked in `ROADMAP.md`
- **[reject]** — recorded so it is not re-proposed, with the reason

**State, 2026-09-10. There is no `[code]` and no `[blocked]` work left in this
file: all fourteen open boxes are `[client]`.** Seventeen are done, specced as
ROADMAP phase 8 and implemented in two passes — the teardown items first, then
the machinery for the items whose only real blocker was content.

That second pass is why nothing is `[blocked]` any more. Reviews, before/after
pairs, job durations, the insurance line and the price-in-snippet were all
waiting on facts, and all of them now have working code sitting dormant behind an
empty array or a `null`, exactly the way `company.sapDeclaration.number` and
`company.social` already worked. Each was proved by populating it temporarily,
checking the render and the JSON-LD, and reverting. So none of them is a build
task any more; each is a single paste.

Three items changed tag on contact with the code, and the reasons matter more
than the tags:

- **Pricing split in two.** The component was `[code]` and shipped; the figures
  are `[client]`.
- **`/tasks` was retagged `[code]` → `[client]`.** The blocker was never naming
  the target queries. It is that the genuinely distinct task queries are distinct
  *because they are different services* — `repassage`, `nettoyage après
  travaux` — and those are not among the seven the client sells. A page for one
  would advertise work he may not do.
- **Reviews and before/after were `[blocked]` and are now split**: the code is
  done and ticked, the content is `[client]`.

---

## Teardown 1 — Mr Sparkle Window Cleaning (Melbourne, AU) — 2026-09-10

`https://mrsparklewindowcleaning.com.au/`

Ten service pages (`/pressure-washing-melbourne/`), ten suburb pages
(`/near-me/window-cleaning-brighton-vic/`), no service×suburb matrix. Thirty
pages total against our 224. It does not out-rank us on architecture — it
out-converts on **proof density and CTA density**.

### A. Conversion

- [x] **[code] Repeat the CTA down the page.** They place a quote+call pair
      after every section — nine on one service page. We render exactly one
      `ConversionBlock` per page, at the bottom (`src/views/ServiceView.tsx`,
      `CommuneView.tsx`, `CommuneServiceView.tsx`, `FixedViews.tsx`). A visitor
      who leaves at 40% scroll never sees a call to action. Breaks no rule.
- [ ] **[client] A response-time promise, stated as a benefit.** Theirs:
      "Replies in one to five minutes during the workday", "Quotes in your inbox
      within the hour". Self-declared operational commitment — no third party to
      verify it, no SAP exposure. Needs a number the client will actually honour.
      Strongest single differentiator on their site.
      **Waits on:** a reply window the client will honour, in writing.
      `docs/05` and the `chat` dictionary block both forbid inventing one.
- [x] **[code] Promote the remote-quote path.** They headline "90% of quotes
      done remotely — send a photo". We already say it in passing for
      `poubelles` and `panneaux-solaires` in `src/data/services.ts` and bury it
      mid-paragraph. `company.whatsapp` exists and `ChatLauncher` already
      pre-fills a draft, so "photo → devis" is a copy and placement change.
      **Note their number is theirs, not ours.** "90%" works for them because
      they sell one thing. We sell seven, and two of them — `facade`,
      `terrasse` — cannot be quoted from a photo at all. The line is therefore
      gated on `Service.photoQuote`, true for three of seven, and there is no
      percentage on the page because we do not have one.
- [ ] **[client] Publish job durations.** "Exterior only: about two hours.
      Interior and exterior: four to six." Concrete, cheap, and it answers the
      unspoken fear of losing a whole day. `Service.duration` exists, is `null`
      on all seven, and renders a *Durée sur place* row in `<PricingNote />` the
      moment it is filled. **Waits on:** one phrase per service from the client.
      Not estimated here — a duration is a commitment, so rule 4 applies.
- [x] **[code] Put the process block on every page.** `HomeView.tsx` already has
      a steps section; they repeat theirs on service and suburb pages. Reuse the
      existing component rather than writing new copy.

### B. Proof

- [ ] **[client] Insurance as a trust card, not a legal footnote.** They repeat
      "$20 million public liability" three times on the home page. Ours sits in
      Mentions légales, which now prints the real policy the moment
      `company.insurance` holds one — insurer, cover formatted per edition, and
      the policy number if he will publish it — and says "À compléter" until
      then. **Waits on:** the insurer name and the cover, from the actual policy.
      STATUS.md item 11. Promoting it from the legal page to a home-page trust
      card is a second, separate step once the figure is real.
- [ ] **[client] A workmanship guarantee.** Free return visit for missed spots,
      plus a money-back line. Their nine "why choose us" cards are built around
      it. Purely a commercial decision.
      **Waits on:** the client deciding to offer it, and in what terms.
- [ ] **[client] A weather guarantee.** Their seven-day rain guarantee for
      recurring customers. Directly portable — Essonne rain ruins a window clean
      the same way Melbourne's does.
      **Waits on:** the client deciding to offer it. Needs a stated window
      and what triggers it.
- [x] **[code] Reviews rendered as static HTML from data.** Built. They embed a
      Google widget; we cannot — a third-party script is invisible to a crawler
      before hydration (rule 2) and would need a consent banner. Instead
      `src/data/reviews.ts` feeds `Review` + `AggregateRating` into
      `src/lib/schema.ts` and `<Reviews />` prints them server-side, with each
      review linking out to where it was left so a reader can check it (the one
      thing worth copying from the SPIC AND SPAN testimonials).
      **Dormant until the content exists**, the same contract as pending mode on
      the tax-credit badge: the array is empty, so no markup and no schema node
      is emitted. Proven by temporarily populating it — `aggregateRating` 4.5
      from 2, both `Review` nodes, the commune filter, and the unlinked paper
      case all rendered, then reverted.
- [ ] **[client] The reviews themselves.** **Waits on:** ROADMAP phase 7 — the
      Google Business Profile has to exist and be postal-verified before there
      is anything to paste in. Then it is one file, no other edit. Rule 4: never
      invent one, not even a placeholder with a real-sounding name.
- [x] **[code] Before/after pairs beyond `/realisations`.** Built.
      `src/data/realisations.ts` + `<BeforeAfter />`, rendering on
      `/realisations` and, filtered to that service, on every service page.
      Two images side by side rather than a slider, because a slider needs
      `'use client'` and rule 2 names only four components that may have it —
      this works with JS off and is in the export for a crawler.
      `/realisations` shows the gallery or the "photographs are coming" note,
      never both and never neither, off the same condition.
      **Dormant until the photos exist**, so nothing on the site changed.
- [ ] **[client] The photographs themselves.** **Waits on:** ROADMAP phase 5,
      STATUS.md item 6 — the client's archive, processed to WebP with known
      dimensions. Rule 4 binds hardest here: every pair must be his own work,
      `before` and `after` must be the same surface and the same job, and not one
      of the seven stock images in `public/assets/placeholder/` may be moved into
      that array.

### C. Pricing

- [x] **[code] The pricing component.** Shipped in phase 8d as
      `src/components/PricingNote.tsx`, on all seven service pages. It renders
      `pricing.basis` as a labelled row — *Mode de calcul : au m²* — plus the
      free-quote line and what moves the price. A basis with no figure, which is
      what CLAUDE.md rule 4 permits.
- [ ] **[client] The numbers that go in it.** "Minimum charge $475. Typically
      $475–$1,000. Larger homes exceed $1,000." `pricing.fromEur` is `null` on
      all seven services with `note: 'TODO(human): confirmer'`. **Waits on:** the
      client confirming a real floor price per service. The `From` row in
      `PricingNote` lights up on its own the moment `fromEur` stops being null —
      one edit per service in `src/data/services.ts`, no page to touch.
- [ ] **[client] Recurring plans.** Quarterly and biannual, with a per-visit
      discount. Their retention engine. For us it is also a compliance asset:
      `menage` and `vitres` are `taxCreditEligible`, so a subscription frame
      reinforces the SAP story instead of fighting it.
      **Waits on:** the client deciding the plans and their discounts.
- [ ] **[client] Bundles.** "House wash + exterior windows, save $75." Our
      catalogue has obvious pairs — `vitres` + `volets-portes`, `terrasse` +
      `facade`. Cross-sell with no new route.
      **Waits on:** the client deciding which pairs and what the saving is.

### D. Local SEO

- [x] **[code] A cause-of-soiling field per commune.** Their Brighton page names
      Dendy Street Beach, the Esplanade, Church Street, Middle Brighton Pier —
      and gives a *physical cause*: "the same salt-laced breeze that draws people
      to Dendy Street Beach also leaves a steady film on every pane of glass."
      We carry one `localAngle` paragraph in `src/data/communes.ts`. Adding a
      cause — pollen off the Forêt de Sénart, brake dust from the RN20 and A10,
      limestone spotting from hard water — is what makes a commune page
      non-substitutable, which is exactly what rule 4 demands.
- [x] **[code] Housing-stock references.** "Victorian-era weatherboard near
      Church Street" versus "modern coastal build closer to the foreshore".
      Pavillonnaire 70s, meulière, récent — a second axis of difference, one
      sentence per commune.
- [x] **[code] Render the longtail seeds as an on-page section.** Their "Every
      Window Type in Your Home, Handled" absorbs *velux / véranda / baie vitrée*
      queries inside one page. `src/data/services.ts` already holds `longTail`
      arrays with a comment saying they are for copy — and **nothing renders
      them**. Free capture, no new routes.
- [x] **[code] A "près de chez moi" / "near me" angle** in the `/zones` copy and
      title. Their `/near-me/` hub. Not a new route; ours exists.

### E. Rejected

- [reject] **Service+city in the slug** (`/window-cleaning-brighton-vic/`). Ours
  is locale-free and rule-0 compliant; changing it breaks the hreflang pairing.
- [reject] **Suburb pages that are ~60% boilerplate.** Survivable at ten pages.
  At our 224 routes it is the deindexing failure rule 4 names outright.
- [reject] **Blog, Press, author sitemap.** Already out of scope for v1.
- [reject] **50% deposit and online booking.** Needs a server; rule 2 forbids it.
- [reject] **The Google review widget.** Third-party script, storage, consent
  banner — three rule-2 violations at once.
- [reject] **Tabbed residential/commercial on one page.** Our B2C/B2B split into
  separate routes is what keeps `/professionnels` free of tax-credit language.
  Merging them would put rule 1 at risk on every page view.

---

## Teardown 2 — SPIC AND SPAN (Paris, FR) — 2026-09-10

`https://spicandspan.fr/en/cities/paris-cleaning-service`

A closer competitor than Mr Sparkle: French market, same locale model as ours
(bare paths French, `/en` prefix English), a city-landing-page play. About
1,200–1,400 words, of which only 15–20% is Paris-specific. It ranks on
**structure and internal linking**, not on depth.

Three findings verified against the raw HTML, not inferred:

- **No `hreflang`.** Zero `rel="alternate"` tags. Their French and English
  editions do not declare each other.
- **No JSON-LD.** Zero `application/ld+json` blocks. No `LocalBusiness`, no
  `Service`, no `FAQPage`, no `AggregateRating` — despite claiming 25,000
  customers and showing fourteen reviews.
- **The twenty arrondissements are listed as plain text, not linked.** No
  arrondissement-level pages exist.

We already beat all three (`src/lib/seo.ts`, `src/lib/schema.ts`,
`src/lib/routes.ts`). That is the moat; the list below is what they do that we
do not.

### Structure to implement

- [x] **[code] A qualifier in the H1, not just service + city.** Theirs:
      "English-Speaking Cleaning Services in Paris" — the modifier narrows the
      competition set to a group that self-selects. Our commune H1s are
      service + commune with no qualifier. Candidates that are true for us:
      the tax credit, a named team rather than a marketplace, same-week
      availability.
- [ ] **[client] Put a price in the meta description.** Theirs, verbatim: "Book
      an English-speaking, background-checked cleaner for your home & office in
      Paris, France. Cleaning service from €26.90/h." A price in the snippet is a
      click-through lever that works before the visit rather than after it.
      **The plumbing is in**: `fromPriceClause()` in `src/lib/seo.ts` adds
      "À partir de X €." / "From €X." as a middle clause on every service
      description, so it never costs the unique first clause or the closing call
      to action. Contributes nothing today because `fromEur` is `null`.
      **Waits on:** the same figures as the pricing item in teardown 1.
- [x] **[code] Repeat the place name across the H2s.** Six of their ten H2s
      contain "Paris": "Book a reliable cleaner for your home & office in Paris,
      France", "The most convenient way to book a cleaning service in Paris",
      "Available in Paris & suburbs", "Book a home cleaning in Paris", "Home &
      office cleaning services in Paris". Keyword placement in headings without
      stuffing the body — cheap, and our commune templates mostly name the
      commune once, in the H1.
- [x] **[code] A geographic enumeration block on every commune page.** They list
      20 arrondissements and 27 suburbs as plain text on one page, capturing
      "cleaning service [suburb]" without building the pages. We have the real
      pages, which is better — but the enumeration is additive: each commune page
      should name its neighbouring communes, its hameaux and its quartiers.
      `src/data/communes.ts` has `geo` already, so nearest-neighbour ordering is
      computable rather than hand-listed.
- [x] **[code] Link the enumeration where they did not.** Their unlinked
      arrondissement list is the single biggest miss on the page. Ours must be
      linked — neighbouring commune names become internal links, which is the
      hub-and-spoke `/zones` → commune → commune×service crawl path we already
      have routes for but do not cross-link laterally.
- [x] **[code] Postal-code-first hero.** Their primary CTA is one field: "Enter
      your postal code to get started". Reducing the ask from a full form to five
      digits is the strongest conversion pattern on the page. Every entry in
      `src/data/communes.ts` already carries `postalCode`, so a static
      code → commune-page map needs no server (rule 2 safe). Note their own
      failure to imitate: "Don't know your postal code?" links out to YouTube.
- [ ] **[client] A subscription-versus-one-time comparison module.** Two rates
      shown side by side, €24.90/h against €26.90/h, each as a card with four
      bullets. It makes the recurring plan the anchor and the one-off the
      expensive option. Pairs with the recurring-plans item in teardown 1.
      **Waits on:** the same plan decision as the recurring-plans item.
- [ ] **[client] A milestone as an H2, not a badge.** "Over 25,000 happy
      customers since 2016." A heading, so it carries weight; and it is a count
      plus a start year, which is the cheapest form of credibility. We have
      neither number yet, and rule 4 forbids inventing one.
      **Waits on:** a real customer count and a real start year. The SIRET in
      `company.ts` is not a substitute — a registration date is not a count.
- [x] **[code] Reviews wherever they help, each one checkable.** Their six
      testimonials mid-page and eight lower down, each linking out to Facebook,
      Google Maps or Yelp. Ours renders on the home page and, filtered to that
      town, on every commune page — a review is only shown on the page for the
      commune it was left about, which is more than either competitor does. The
      outbound link per review is in. Same dormancy as the item above.
- [ ] **[client] A third taxonomy axis: tasks.** Retagged from `[code]` on
      2026-09-10, because building it turns out not to be the blocker.
      They run `/en/tasks/laundry-and-ironing` alongside services and cities.
      **Partly answered by phase 8d instead.** The `longTail` arrays now render
      on the service page that already ranks, which captures the same
      near-queries with no new route — and that is the correct answer for most of
      them, because `démoussage terrasse` and `nettoyage véranda` are
      near-synonyms of their parent service. A page each would be seven thin
      pages competing with the page they came from.
      **What is left is not a naming problem, it is a scope problem.** The task
      terms that are genuinely distinct queries — *repassage*, *nettoyage après
      travaux* — are distinct because they are **different services**, and they
      are not among the seven the client sells. Publishing a page for one would
      advertise work he may not do, which is a rule 4 violation of the worst
      kind: not an overstated claim about a job, but an offer of a job that does
      not exist. Note `repassage` would also be SAP-eligible, so it would drag
      rule 1 in behind it.
      **Waits on:** the client saying which additional services he actually
      offers. Each one that comes back is a new entry in `services.ts` — which
      already yields 1 + 12 = 13 basePaths and 26 routes, the way
      `panneaux-solaires` did — not a new `/tasks` tree.
- [x] **[code] The footer as an internal-link distributor.** Roughly 45 links,
      grouped: services, cities, company, international. Sitewide, so every page
      feeds every other. `src/components/SiteChrome.tsx` — worth an audit against
      how many of our 112 basePaths are reachable from an arbitrary page.
- [reject] **FAQ offloaded to `/contact#faqs`.** Their money page carries no
      FAQ and no `FAQPage` schema. We already emit FAQ blocks and schema on the
      pages that need to rank. Do not follow.
- [reject] **80% boilerplate across city pages.** Works for them at six
      cities. At our commune count it is the same deindexing risk as teardown 1,
      item E2.
