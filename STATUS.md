# STATUS.md — GLVITR'CLEAN

Updated at the end of every work session. Newest entry on top.

**Current phase:** phases 0–4 DONE, phase 6 done on the code side.
**Everything still open is waiting on a human** — see "What we need from you".
**Build status:** `npm run verify:full` passes. 198 routes, 204 files exported.
Lighthouse mobile: performance 97–99, accessibility 100, best practices 100,
SEO 100 on every route type measured.
**Deployed:** yes — production deploy Ready. Not publicly reachable yet: Vercel
Deployment Protection is on (every URL 302s to SSO) and no domain is attached.

---

## What we need from you

**There is no remaining code-side task on any roadmap phase.** Every unticked
box in `ROADMAP.md` is waiting on one of the items below.

Ordered by what it costs to leave undone. Nothing here silently defaults to a
value: every one is either explicitly `null` in the data or renders as a
visible gap on the page.

### Do these first — they block going live

| # | What we need | Why it matters | Ask |
|---|---|---|---|
| 4 | **Registrar / DNS access for `glvitrclean.com`** | The whole cutover. `vercel.json` holds the 301 map but nothing can point at it. If the login is lost, recovery takes weeks — start now even though it is the last phase. | Who is the domain registered with, and do you still have the login? |
| 14 | **Quote form endpoint** (Formspree, Resend or similar) | `/devis` currently cannot deliver a lead. The form posts to `NEXT_PUBLIC_FORM_ENDPOINT`, which is empty, so it errors. Every other conversion path (phone, WhatsApp) works. | Darwin's call — pick a provider and set the env var. |
| 19 | **Which form provider you chose** | The privacy policy has to name who receives the data (RGPD Art. 13). Until then `/confidentialite` says the provider "will be named here before the form goes live", which is true but cannot ship indefinitely. | Falls out of item 14. |
| 18 | **How long we keep a quote request that goes nowhere** | Same page, same article. 12 months is a defensible default if you have no preference. | "Une demande restée sans suite, on la garde combien de temps ?" |
| 11 | **RC Pro insurer and policy number** | `/mentions-legales` reads "À compléter". Required by LCEN art. 6-III. | "Quel assureur, et quel numéro de contrat ?" |
| 12 | **Hosting provider for the hébergeur block** | Same page, same law. It is Vercel unless you move. | Darwin's call. |
| 6 | **Photo archive** | The most visible gap on the site. Every image is stock, marked "photo d'illustration" on screen. `/realisations` is a written page with no gallery because inventing one would break rule 4. Blocks all of phase 5. | "Le dossier Drive avec vos photos de chantier — on peut y accéder, et on a votre accord pour les publier ? Le plus utile : des paires avant / après du même endroit, avec le nom de la commune." |

### These change what the site is allowed to say

| # | What we need | Why it matters | Ask |
|---|---|---|---|
| 1 | **Cooperative name + SAP declaration number** | The tax-credit badge stays in pending mode until `company.sapDeclaration.number` is real. Pending mode describes the scheme without claiming you are registered under it. Displaying an unbacked 50% claim is a *pratique commerciale trompeuse* under Art. L121-2. | "Quelle est la coopérative qui émet vos factures, et quel est son numéro de déclaration SAP ?" |
| 2 | **Who issues the invoice and the attestation fiscale, and whether URSSAF avance immédiate is available** | Decides the legal wording on `/credit-impot`. `prestataire` and `mandataire` are not interchangeable — they change who the customer's contract is with. | "Qui émet la facture au client final ? Qui envoie l'attestation fiscale annuelle ? L'avance immédiate URSSAF est-elle disponible via la coopérative ?" |
| 13 | **Répertoire des Métiers registration for facade work** | If you are not registered, the facade service comes off the site entirely. | "Êtes-vous inscrit au Répertoire des Métiers pour le nettoyage de façade ?" |
| 10 | **Prices, or price ranges, you are willing to publish** | `services[].pricing.fromEur` is `null` everywhere, so no page shows a number. The pages describe the *basis* (forfait, au m², horaire, sur devis, par bac) but never a figure. Per `docs/00`, the credit arithmetic — €90 becomes €45 — is the strongest argument this business has, and it cannot be shown without a number. | "Quels prix, ou quelles fourchettes, acceptez-vous de publier ?" |
| 3 | **Final service area** — Essonne only, or Essonne + 77 + 94 | Drives 168 of the 198 routes. The build provisionally assumes Essonne only (`company.serviceArea.confirmed: false`). The most expensive answer to get wrong. | "Jusqu'où vous déplacez-vous vraiment ? Et dans la liste des douze communes, en manque-t-il, ou y en a-t-il où vous n'iriez pas ?" |

### Small, but they unlock real things

| # | What we need | Why it matters | Ask |
|---|---|---|---|
| 7 | **Facebook and Instagram URLs** | `company.social` is `[]`, so the footer shows no social links and `sameAs` is absent from the LocalBusiness schema. `sameAs` is how Google ties this site to the same business as those profiles — an empty array costs real local ranking signal. | "Les adresses exactes de vos pages Facebook et Instagram." |
| 8 | **Any existing Google Business Profile** | A forgotten duplicate competing with a new one is worse than no profile. Find it before creating another. Blocks phase 7. | "Avez-vous déjà une fiche Google, même ancienne ou jamais utilisée ? Avec quelle adresse e-mail ?" |
| 20 | **Per-commune job notes** — one or two real sentences per town | The 72 commune×service pages differentiate on H1, `localAngle`, postal code, schema, links and two of four body paragraphs. That is the honest limit of what the current data supports. Genuinely town-specific copy needs facts only you have. | "Pour chaque commune : un détail concret. Le type de maisons, un chantier marquant, une contrainte d'accès qui revient." |
| 21 | **Sanity-check a few operational statements** | Written from `src/data/`, but worth ten minutes of your eyes before launch: that a damaged roller shutter is cleaned but not repaired; that bin cleaning happens where the bin is stored and you ask the customer to put it out empty; that a facade job always needs a site visit first. | Read `/services/volets-portes/`, `/services/poubelles/` and `/services/facade/` and tell us what is wrong. |
| 15 | **English legal wording** | The FR pages are the binding ones and the EN pages say so. Worth an accountant's eye before launch, not before. | Client's accountant. |
| 17 | **Next.js 15 reaches EOL 2026-10-21** | `next@15.5.24` is pinned. After EOL the next CVE has no 15.x patch to move to. | Darwin — plan the 16 bump. |

### Verified as done, kept for the record

| # | Item | Resolved |
|---|---|---|
| 5 | Logo file | 2026-08-31 — taken from the client's live site |
| 9 | Design tokens | 2026-08-31 — landed from the supplied prototype |
| 16 | New logo file | 2026-08-31 |

The client-facing questions are written out in French, one per field, in
`docs/10-discovery-questionnaire.md`.

---

## Old blocked table (superseded 2026-09-06)

Kept because the "Recorded as" column names the exact field each answer fills.
Every Phase 0 question has a declared home in the codebase and is either
answered or explicitly `null`.

| # | Item | Recorded as | Blocks | Owner |
|---|---|---|---|---|
| 1 | Cooperative name + SAP declaration number | `company.sapDeclaration.holder` / `.number` = `null` | Tax credit badge leaves pending mode | Client |
| 2 | Who issues the invoice + the attestation fiscale | `company.sapDeclaration.mode` / `.attestationIssuer` / `.avanceImmediate` = `null` | Legal wording on `/credit-impot` | Client |
| 3 | Final service area (91 only, or 91+77+94) | `company.serviceArea.confirmed` = `false`, `departments` = `['91']` | `communes.ts`, all 84 local routes | Client |
| 4 | Registrar / DNS access for `glvitrclean.com` | Not a code field. Operational, tracked here only. | Phase 6 migration | Client |
| 5 | ~~Logo file~~ — **resolved 2026-08-31.** Darwin supplied it in the prototype; the mark is now `src/components/Logo.tsx` + `public/assets/brand/` + `src/app/icon.svg`. A higher-resolution original from the client is still welcome for print, but nothing is blocked. | — | — | — |
| 6 | Photo archive (client's Drive folder) | `public/assets/placeholder/` now holds 7 **stock** images, marked on screen | Phase 5, `/realisations`. Blocking harder now: the home page shows stock models doing indoor office work, which misrepresents an outdoor window/terrace business. | Client |
| 7 | Facebook + Instagram URLs | `company.social` = `[]` | Footer, `sameAs` schema | Client |
| 8 | Existing Google Business Profile | `company.googleBusinessProfile` = `null` | Phase 7, `sameAs` schema | Client |
| 9 | ~~Design tokens: palette, type, spacing~~ — **resolved 2026-08-31.** Landed from the supplied prototype. See `docs/09-design-system.md`. | — | — | — |
| 10 | Prices or price ranges to publish | `services[].pricing.fromEur` = `null` | Pricing blocks on service pages | Client |
| 11 | RC Pro insurer + policy number | `/mentions-legales` reads "À compléter" | LCEN art. 6-III compliance | Client |
| 12 | Hosting provider (for the hébergeur block) | `/mentions-legales` reads "À compléter" | LCEN art. 6-III compliance | Darwin |
| 13 | Répertoire des Métiers registration for facade work | — | Whether `facade` stays a service at all | Client |
| 14 | Quote form endpoint (Formspree / Resend) | `NEXT_PUBLIC_FORM_ENDPOINT` empty | `/devis` actually delivering a lead | Darwin |
| 15 | English legal wording on `/en/mentions-legales` and `/en/confidentialite` | Pages carry a note that the French version is binding | Nothing — the FR pages are the legal ones. Review before launch. | Client's accountant |
| ~~16~~ | ~~New logo file~~ — **resolved 2026-08-31.** Downloaded from the client's live site at glvitrclean.com and landed in `public/assets/brand/`. | — | — | — |
| 17 | Next.js 15 reaches EOL 2026-10-21 | `next@15.5.24` pinned in `package.json` | The next CVE gate will have no 15.x patch to move to | Darwin |

Items 11–17 are not in the Phase 0 list but surfaced while recording it. They
are logged so they do not get discovered at launch. They do not block Phase 1.

The questions to send the client are written out, in French, in
`docs/10-discovery-questionnaire.md`. Each one names the field its answer fills.

---

## Done

### The dev server was 500ing every app-root route, and had been for days (2026-09-09)

Found by running `next dev` and requesting a page that does not exist.

```
⨯ src/app/not-found.tsx
not-found.tsx doesn't have a root layout. To fix this error, make sure every page has a root layout.
```

**What was actually broken.** Not just the 404 — every entry that lives at the
app root failed to compile in dev, because the failed compile poisons all of
them together:

| route | before | after |
|---|---|---|
| any missing path | **500** | 404 |
| `/sitemap.xml` | **500** | 200 |
| `/robots.txt` | **500** | 200 |
| `/manifest.webmanifest` | **500** | 200 |
| `/`, `/en/` | 200 | 200 |

**It was not caused by the brand-kit commit.** Bisected: the identical error
reproduces on `a35e6f8^`, where `/sitemap.xml` was already 500ing. It has been
there since the 404 moved to `src/app/not-found.tsx` on 2026-09-06.
`src/app/manifest.ts` merely added a fourth casualty. `next build` never
failed, which is exactly why it went unnoticed for three days.

**Root cause, from Next's own source** —
`node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js`:

```js
if (!isGlobalNotFoundEnabled && isDefaultNotFound && !layoutPath && !rootLayout) {
  rootLayout = defaultLayoutPath          // synthetic layout, inserted for /_not-found
}
...
if (!treeCodeResult.rootLayout && !isGlobalNotFoundPath) { /* error */ }
```

Next injects that synthetic root layout **only when the app has no not-found
file of its own** (`isDefaultNotFound`). This app has two root layouts, both
inside route groups, so there is none at the app root — and the moment a real
`src/app/not-found.tsx` existed, `isDefaultNotFound` went false, nothing was
injected, and the entry became uncompilable. The same condition names the
escape hatch: `isGlobalNotFoundEnabled`.

**Fix.** `src/app/not-found.tsx` → `src/app/global-not-found.tsx`, plus
`experimental: { globalNotFound: true }` in `next.config.mjs`. That convention
exists for precisely this case: it renders its own `<html>` and `<body>`
instead of inheriting a layout, which is what a 404 belonging to neither
edition needs. Now recorded as a rule in CLAUDE.md so nobody tidies the
experimental flag away.

**A bonus defect fixed on the way.** `out/404.html` was shipping `<html>` with
**no `lang` at all** — Next's injected shell had no way to know. It is now
`<html lang="fr">`, French being the x-default edition, with each block still
carrying its own `lang`.

Artifact re-verified, not assumed: exactly one `<html>`, `<main class="container
not-found">`, a `<title>`, both `<h1>`s, both `lang` blocks, both home links,
the brand mark, and a stylesheet that exists in `out/`. `out/index.html` and
`out/en/index.html` still emit `lang="fr"` and `lang="en"`. `npm run
verify:full` passes.

Two alternatives were rejected on the record already in this repo rather than
re-prototyped: giving `not-found.tsx` its own `<html>` (Next wraps it, nesting
documents) and per-group `not-found.tsx` files (the export then ships Next's
bare built-in page as 404.html). Both are described in the 2026-09-06 notes
below, both from direct experience at the time. Only the fix that shipped was
prototyped end to end here.

Supersedes the phase 2b/2c notes further down that say the global 404 "must
live at `src/app/not-found.tsx`". That was right about where it could not live
and wrong about where it could.

### Brand kit landed, icons and social metadata wired (2026-09-09)

The client supplied a real brand kit — blue, gold and cream, drawn in the
site's own two faces. It replaces the peach raster taken off the old live site
in August, which was the last thing on the page that did not match the design
system. 18 files in, 3 out.

**What now renders.** The header and the 404 show the **mark alone** —
`public/assets/brand/mark.svg` at `3.5rem`, square and transparent, no wordmark
and no plate. The footer prints the **name as live text**, in the body face,
with the apostrophe in `--color-accent` the way the artwork has it. Nothing on
the page carries the full lockup.

The full lockup was in the header first and came out on the human's call: at
header size its wordmark and `NETTOYAGE PRO` baseline duplicated what the nav
and the H1 already say, and its plate put a dark block in an airy cream bar.

The wordmark could never have travelled as an SVG anyway — the supplied vector
lockups carry live `<text>` in Newsreader and Schibsted Grotesk, which an
`<img>`-loaded SVG cannot reach, and the rules flanking `NETTOYAGE PRO` sit at
coordinates measured for Newsreader's metrics, so a fallback serif walks into
them. Newsreader also ships italic-only here, so inlining would not have
rescued it, and it is why the footer wordmark is set in Schibsted rather than
the brand serif. `mark.svg` is safe because its only text is the two-letter
`GL` monogram. Verified in a headless browser at 1280px and 390px, not assumed.
Reasoning in `docs/09-design-system.md`, "Logo".

**What the site now tells a crawler that it did not before.**

- A real icon set: `/favicon.ico` (three sizes in one file, hand-built — the
  kit had no `.ico`, and Google's favicon fetcher asks for that path directly),
  `/apple-touch-icon.png`, three PNG sizes, and the two Android icons plus a
  maskable one.
- A generated web app manifest, `src/app/manifest.ts` — same reasoning as
  `sitemap.ts` and `robots.ts`: the icon list comes from `brand.ts`, so a
  renamed file cannot leave a dead entry. Emitted at `/manifest.webmanifest`.
- `<meta name="theme-color">` on all 194 routes.
- `logo` and `image` on the `LocalBusiness` node. Both were **absent**. `image`
  is a precondition for a local result to be eligible for a knowledge panel at
  all, so this was a real gap, not a polish item. Both point at the square
  1200×1200 brand card — the only honest option while every photograph on the
  site is stock placeholder (rule 4). Swap `image` for a real job photo in
  phase 5.
- A language-neutral fallback social card on the root layout, so a route that
  ships without its own metadata export no longer ships without a card.

**One source of truth.** `src/data/brand.ts` declares every icon, card and
lockup path plus the two brand hexes that have to exist outside CSS
(`theme-color` and the manifest cannot read a custom property). `seo.ts` now
reads its card paths from there instead of keeping its own copy.

**Derived, not supplied.** The exact numbers are in `docs/09` so they are
reproducible. The two bilingual OG cards were kept — they are drawn in the real
brand faces — but still embedded the peach mark, so that rectangle was painted
out in the panel colour and the current mark composited back. `favicon.ico` was
built by hand. Done with `sharp` in a throwaway script rather than a committed
one: `sharp` is only a transitive dependency of Next, and rule 5 governs adding
it for real.

**Removed.** `public/assets/brand/logo.{png,webp}` (the peach derivations) and
`src/app/icon.png`. Next's file-based icon convention emits a single icon at a
URL it chooses and cannot express a size set, an `.ico`, or an Apple touch
icon, so the icons are declared in `baseMetadata()` instead — once, for both
root layouts. `logo-original.png` stays as the archived pre-kit original.

`npm run verify:full` passes: 198 routes unique, 54 routes clear of tax-credit
claims, every description within 160 chars.

Item 16 in the table above ("New logo file", 2026-08-31) is superseded by this.

### Phases 1–4 closed, phase 6 built (2026-09-06)

A 12-agent audit of every open roadmap phase produced 72 findings; 58 survived
adversarial verification. All 56 code-side ones are fixed. What mattered most:

**Two legal defects, both fixed and both proven fixed.**

1. `scripts/check-compliance.mjs` could not see a French tax-credit claim. React
   escapes apostrophes, so the export carries `cr&#x27;dit d&#x27;impôt` and two
   of the French regexes had been matching nothing since they were written —
   the guard protected only the English edition, i.e. only the non-commercial
   language. It now decodes entities before matching, and adds a second layer:
   any sentence on a forbidden route that raises the topic without a denial in
   the *same* sentence fails the build. Verified by injecting four claims that
   the old guard let through, including a French paraphrase that never says
   "50", and confirming an innocent sentence still passes.

2. The 50% figure was static text in four places — both `/credit-impot` titles
   and both H1s — which CLAUDE.md rule 1 forbids outright. All four now derive
   from `TAX_CREDIT_PCT`, as do six occurrences in `faq.ts` via a `{pct}`
   placeholder resolved in both render paths. Changing the rate is one edit
   again.

**A missing legal page.** `/confidentialite` was an H1 and a TODO while `/devis`
collects seven personal fields. It now carries a full RGPD Art. 13 notice in
both languages. Two facts in it are the client's — items 18 and 19 — and rather
than invent a retention period the page says the answer will appear before the
form goes live, which is true and is not a claim.

**A conversion bug worth money.** The footer's call button rendered near-white
on gold, contrast 1.41:1. `.site-footer a` (0,1,1) was outranking `.btn--accent`
(0,1,0) and repainting the label. It is the primary action in the footer of all
198 routes.

**Unbacked claims removed.** "Réponse sous 24 h" (nothing backs it, and a solo
operator on a roof cannot honour it) and "sûrs pour les enfants et les animaux"
(a product-safety claim with no data sheet behind it). The reviewing agents
caught six more invented specifics in freshly written copy — a scheduling
promise to copropriétés, a both-faces scope for shutters, a claim that any bin
size can be handled — and reverted each to what `src/data/` actually supports.

**Stub pages filled.** `/professionnels` and `/realisations` were headings with
TODOs. The six service pages had two sentences each; they now have four
paragraphs per language in `services[].bodyCopy`. Four of six services had no
FAQ at all, so the FAQ block and its `FAQPage` schema rendered nothing.

**Structure.** No commune hub linked to any service hub, so the internal-link
chain ran one way only. "Communes voisines" was `slice(0, 6)` — array order, not
geography — which left five of twelve hubs with no inbound sibling link;
`nearestCommunes()` now uses haversine over the `geo` field that was already
there and previously unread. `/services` and `/zones` hubs were built because
phase 6's own redirect map names `/services/` as a target and it did not exist.

**Measured, not assumed.** Lighthouse 12, mobile, simulated throttling: 97–99
performance, 100 accessibility, 100 best practices, 100 SEO across home,
service, commune×service, `/credit-impot`, both hubs, `/professionnels` and
`/confidentialite`. Accessibility went 96 → 100 by fixing three palette tokens
that failed WCAG AA and underlining one in-prose link.

**New guard.** `npm run check:metadata` reads the exported artifact and fails on
duplicate titles, descriptions or H1s, on a missing or multiple H1, and on any
description over 160 characters. 48 were over. It caught them; the templates
now compose clauses and drop the trailing ones rather than truncating.

Full detail in the session entry at the bottom of this file.

### Phase 2g — Real logo landed, downloaded from the client's live site (2026-08-31)

Item 16 is closed. The asset could not be produced from a chat attachment, but
it was already published on the client's existing site at glvitrclean.com, so I
took it from there.

What was actually on that page: it is an IONOS "MyWebsite NOW" site with exactly
**two** images, both the same artwork — the nav logo (7 srcset sizes) and the
favicon (4 sizes) — plus three inline base64 SVG UI icons belonging to the site
builder, not to the brand. There is no photography on it at all. So "all images
on the page" is the logo, and nothing was left behind.

Files now in `public/assets/brand/`:

| file | what it is |
|---|---|
| `logo-original.png` | 1024x1024, byte-for-byte as published. Archival — print, Google Business Profile. |
| `logo.png` | 596x691, outer white removed, cropped to the artwork. Working source. |
| `logo.webp` | 441x512, 17 KB. What the site actually loads. |

The download had an **opaque white background covering 72% of the canvas** —
every one of its 127 palette entries was alpha 255, despite a tRNS chunk being
present. Dropped in as-is it would have been a white square on the cream page
and on the blue footer. Fixed by flood-filling the white *from the edges only*,
so the 2,804 white pixels enclosed inside the mark (the sliver in the G) are
preserved rather than punched out. Checked against cream, blue, white and a
transparency checkerboard: no fringing.

`src/app/icon.svg` (prototype mark) replaced by `src/app/icon.png`, 512x512
square transparent. `src/components/Logo.tsx` and
`public/assets/brand/logo-mark{,-inverse}.svg` deleted — the prototype mark they
drew is superseded, and leaving a second logo implementation around invites
drift.

Per the earlier decision the separate `GLVITR'CLEAN` text wordmark is gone from
header, footer and 404: the lockup contains "VITR'CLEAN" itself, so rendering
both printed the name twice. `.brand`, `.brand__mark` and `.brand__word` are
gone with it; `.brand__lockup` sizes the image (4rem header, 6rem footer,
3.25rem under 30rem).

**One thing worth a second look.** The lockup is portrait and detailed, and the
wordmark inside it does not survive header scale — at 64px tall "VITR'CLEAN"
renders as a smudge, and the mark reads smaller and muddier than the old
mark-plus-text pairing did. That is inherent to using a full lockup as a header
logo, not a bug in the implementation. Switching to mark-only (crop the circle,
restore the text wordmark) is a contained change if Darwin wants it — the
artwork is already in the repo either way.

### Phase 2f — Sticky call bar no longer covers the footer (2026-08-31)

Reported from a mobile screenshot: the fixed call bar sat on top of the
footer's "Parlons de vos surfaces" heading.

The footer already carries its own full-size call CTA, so the sticky bar has
nothing to add once the footer is on screen. `ScrollChrome` now also runs an
IntersectionObserver on `.site-footer` and sets `<html data-footer="visible">`;
CSS hides the bar while that is set. No new client component — the observer
lives in the one that already existed.

`.site-footer { padding-bottom: 5.5rem }` stays, downgraded to the no-JS
fallback and commented as such.

Verification, stated honestly: the CSS is proven — a static page with
`data-footer="visible"` baked in and no JS at all hides the bar, and the
control without it reproduces the overlap. The observer itself could NOT be
exercised here: IntersectionObserver callbacks fire during the rendering step,
and headless Chrome under `--virtual-time-budget` never runs it (measured: 0
callbacks). The usage is textbook, but it is worth one look on a real phone.

Same limitation already bit the scroll work in phase 2e — headless does not
dispatch scroll events from a programmatic `scrollTo` either. Anything
direction- or viewport-driven in this repo has to be verified in two halves:
CSS by baking the attribute into a JS-free page, and logic by dispatching
events by hand.

### Phase 2e — Scroll-aware chrome + mobile CTA (2026-08-31)

**Mobile "Free quote" button had lost its horizontal padding.** `.mobile-nav a`
is `(0,1,1)` and beats `.btn` at `(0,1,0)`, so its `padding: 0.8125rem 0`
overrode the pill's `padding: … 1.5rem`. The label sat flush against the left
edge and the arrow against the right. `.mobile-nav .btn` now restates its own
padding.

**Header hides going down the page, sticky call bar hides coming back up.**
`src/components/ScrollChrome.tsx` renders nothing and writes the scroll
direction to `<html data-scroll="top|down|up">`; `globals.css` does the hiding.
The two bars are never on screen together, and at rest near the top the header
is shown while the call bar stays down (the number is already in the header
there).

Fourth `'use client'` component, justified per rule 2: scroll-driven CSS can
react to scroll POSITION but not DIRECTION, so there is no CSS-only route. With
JS off the attribute never appears and both bars stay visible — exactly the
previous behaviour — so nothing content-bearing depends on it.

Two things found while verifying, both worth recording:

- The first implementation used the standard
  `if (ticking) return; ticking = true; requestAnimationFrame(...)` throttle.
  That wedges permanently the moment a frame is never served — background tab,
  headless render, throttled mobile browser — because `ticking` is only reset
  inside the callback that never ran. Caught it in the harness: after the first
  scroll the bars froze and even synthetic scroll events did nothing. Now the
  handler runs raw (one position read; a `dataset` write only on change).
- Headless Chrome never dispatches the scroll events queued by a programmatic
  `scrollTo`, because they fire during the rendering step it does not run — and
  taking a screenshot forces a paint, which flushes them and flips the state
  under you. Verified in two halves instead: the state machine by dispatching
  scroll events by hand (`top → down → up → down → top`, all correct), and the
  CSS by baking `data-scroll` into static pages with no JS at all.

The open mobile menu pins the header (`<html data-nav="open">`): the panel is
absolutely positioned inside the header and would otherwise slide off with it.

**Verified:** `npm run verify:full` passes — typecheck, lint (0 warnings), 194
unique titles, 200 pages exported, 54 routes clear.

**Not done: the logo.** The human supplied a new lockup (peach circle, blue G,
yellow L, serif "VITR'CLEAN") as a chat image. I cannot write an image I was
only shown — the file has to land in the repo. Blocked on human item 16.

Usage IS decided, so this is ready to implement the moment the asset appears.
Darwin chose **full lockup, drop the separate wordmark**:

- Drop `.brand__word` ("GLVITR'CLEAN") from the header and footer; the lockup
  carries the name itself. `Brand()` in `src/components/SiteChrome.tsx` renders
  both today.
- The header bar grows: the wordmark inside the lockup has to stay legible, so
  the brand block can no longer be a 34px mark. `.site-header__bar` padding and
  `.brand__mark` sizing both need revisiting, and the 46px burger and the
  `lang-toggle` pill were sized against the current bar height.
- Two things to settle when the file lands, both consequences of this choice
  rather than objections to it: the peach circle is not in the palette and sits
  on the cream `--color-bg` and on the blue footer, where the current mark
  inverts via `<Logo inverse />`; and `src/app/icon.svg` plus
  `public/assets/brand/logo-mark{,-inverse}.svg` still carry the prototype mark.
- Prefer SVG. The current mark is inline SVG, which costs no request and cannot
  404; a PNG would be the site's only blocking brand asset.

### Phase 2d — Mobile nav + inner-page spacing (2026-08-31)

Both reported by the human from screenshots. Both turned out to be structural,
not cosmetic, and both predate the bilingual work.

**Mobile navigation was rendering off-screen.** `<nav class="mobile-nav">` is a
DOM sibling of the burger inside `.site-header__actions`, which is
`display: flex` — a ROW. Left in normal flow the open panel became a row item
and was pushed past the right edge of the viewport: the menu appeared as a
clipped column of half-words ("Domesti… houseke…", "Bin cleanin…") with the CTA
cut in half. Reproduced in a headless render at 390px before touching anything;
the repro was pixel-identical to the reported screenshot.

Fixed in CSS alone, no header restructure: the panel is now
`position: absolute; top: 100%; left: 0; right: 0`, hanging off `.site-header`
(sticky, so it is a valid containing block). Added `max-height: calc(100dvh -
100%)` with `overflow-y: auto` and `overscroll-behavior: contain` so a
twelve-item menu scrolls on a short screen instead of running off the bottom,
plus a shadow token and a slightly tighter row rhythm that still clears 44px.

**`.page` was defined but applied to nothing.** The class — and the comment
explaining that inner pages use it while the home page opts out — shipped in
the original design system, but no view ever wrapped its body in it. Every
inner page therefore had zero vertical padding and its `<h1>` jammed against
the sticky header. All nine non-home views now wrap in `<div class="page">`.

Everything else fixed in the same pass was markup that had never been styled:

- `.page > section` / `section + *` rhythm — the next h2, paragraph or button
  used to sit directly on the previous block's last line.
- **Related links ran together.** CommuneServiceView's nav rendered
  "…across the EssonneEverything we do in Linas" — two inline anchors, no gap.
  Now a flex row with a rule above it.
- **FAQ was unstyled.** `.faq__item h3` had styling, but `Faq.tsx` renders
  `<dt>`/`<dd>`, so the rule matched nothing and every answer kept the
  browser's default 40px `<dd>` indent. Now styled on `dt`/`dd`.
- **Tax-credit table had no styling at all** — no cell padding, no rules,
  centred headers. Now `.data-table` inside a `.table-wrap` that scrolls itself
  on a phone rather than forcing the whole page sideways.
- Service/commune link lists were a cramped bare `<ul>`; they now use
  `.link-grid`, sharing the home page's card treatment. Cards stretch to equal
  height within a row (`height: 100%` on the anchor — the `<li>` stretched, the
  `<a>` did not).
- B2B service list → `.service-notes` cards.
- `/devis`: the form stretched the full 1320px container, giving 1200px-wide
  text inputs. Capped at 44rem. The call/WhatsApp pair now sits in an
  `.actions` row instead of two flush siblings.
- Body copy on inner pages capped at `--measure`.

Removed `NotFoundView` from `src/views/FixedViews.tsx`: dead since the global
404 became self-contained in `src/app/not-found.tsx`, and a second unused
implementation would only drift.

**Verified:** `npm run verify:full` passes — typecheck, lint (0 warnings), 194
unique titles, 200 pages exported, 54 routes clear of tax-credit claims. Home
page re-checked for regression: it opts out of `.page` and is unchanged.

### Phase 2c — Unblock the Vercel deploy (2026-08-31)

Three production deploys had failed. Diagnosed with the Vercel CLI
(`vercel inspect --logs`), which showed the two causes were *different*.

**Cause 1 (already fixed in phase 2b): `Invalid URL`.** Confirmed dead. The
latest build log shows `Build Completed in /vercel/output [44s]` with all 194
routes generated on the builder. The blank-env fix worked.

**Cause 2 (this entry): Vercel's post-build security gate.**

    Build Completed in /vercel/output [44s]
    Deploying outputs...
    Vulnerable version of Next.js detected, please update immediately.

The build *succeeds* and is then rejected at deploy time. next@15.5.0 carries
GHSA-9qr9-h5gf-34mp — RCE in the React flight protocol, CVSS 10.0 — patched on
the 15.5.x line in 15.5.7.

Version choice, measured against OSV rather than guessed:

| version            | vulns | critical |
|--------------------|-------|----------|
| 15.5.0 (was)       | 26    | 1        |
| 15.5.7             | 28    | 0 (13 high) |
| **15.5.24** (now)  | **0** | 0        |
| 16.0.7             | 33    | 0 (14 high) |
| 16.3.3 (latest)    | 0     | 0        |

Took **15.5.24** — the `backport` dist-tag — not 16.3.3. Both are clean, but
15.5.24 is a patch bump inside the same minor, so it carries no major-version
migration risk for the two root layouts, the route groups, or the 194-route
static export. 16.x stays available if a reason to move appears.

`eslint-config-next` bumped to 15.5.24 to match.

Verified output-neutral, which is the point: the visible markup of all 194
routes is **byte-identical** before and after the upgrade (scripts stripped, so
build-id / chunk-hash / RSC module-id churn is excluded). sitemap.xml is
identical once `lastmod` is normalised; robots.txt is identical byte for byte.

`npm audit` still lists `next` as *moderate*, which is misleading: its `via` is
`["postcss"]`, i.e. inherited from a transitive dep, not a Next.js advisory.
Next.js itself has zero. Remaining transitive findings, neither reachable here:

- `postcss <=8.5.22` — build-time only, processes our own CSS, bundled by Next.
- `sharp <0.35.0` — image optimisation, which `images.unoptimized: true`
  disables and a static export never runs.

**Bug found and fixed while verifying: the 404 was not the bilingual page.**

Phase 2b claimed the export emitted a bilingual 404. It did not. That was
asserted from the source file without checking the artifact — `out/404.html`
was Next's bare built-in error page: no chrome, no stylesheet, no French.

Cause: phase 2b put `not-found.tsx` inside the `(fr)/` route group. A
group-scoped not-found only serves `notFound()` calls *within* that group; the
global 404 must live at `src/app/not-found.tsx`. Moved there.

Sitting above both route groups it has no root layout, so Next injects its own
`<html><head><body>` shell. The first attempt rendered its own `<html>` too and
produced *nested* html/body — invalid markup browsers silently discard. It now
returns a fragment. Consequence, accepted deliberately: that page cannot set a
document `lang`. That is right here and nowhere else — one 404.html serves
unmatched paths in both editions, so there is no single correct document
language; each block carries its own `lang` instead.

Verified in the artifact, not the source: one `<html>`, one `<body>`,
`<main class="container not-found">`, both languages, both home links, styled.

**Verified:** `npm run verify:full` passes — typecheck, lint (0 warnings), 194
unique titles, 200 pages exported, 54 routes clear of tax-credit claims.

**Still blocked on human:** nothing new. The deploy itself is item 4/12
territory — this only makes the build *able* to deploy.

### Phase 2b — Bilingual FR/EN + two bug fixes (2026-08-31)

Requested by the human in one session: fix the burger, add an English toggle
and translate everywhere, fix the deployment failure, push to main.

**Burger UI — fixed.** `.nav-toggle` was `display: grid` + `place-items:
center`. The three bars became three implicit auto rows, which *stretch* to
fill the 46px button, so they sat ~17px apart and reached the edge of the
circle instead of forming a 14px-tall icon. It also broke the close state: the
X transforms use `translateY(±6px)`, which assumes a 6px pitch (2px bar + 4px
gap), so the bars never converged. Now a flex column with the same 4px gap.
Measured in a headless render: bar offsets are −6 / 0 / +6 closed and 0 / 0 / 0
open.

**Deployment failure — fixed.** The build died at `/_not-found` with
`TypeError: Invalid URL ... input: ''`. Cause: `SITE_URL` used
`process.env.NEXT_PUBLIC_SITE_URL?.replace(...) ?? DEFAULT`, and `??` only
falls through on null/undefined. The host had the variable *defined but empty*,
so `''` survived and reached `new URL('')` in the root layout. `resolveSiteUrl()`
in `src/data/company.ts` now treats blank or unparseable as absent. Verified by
reproducing the failure: `NEXT_PUBLIC_SITE_URL="" npm run build` used to fail,
now exits 0.

**English edition — 97 routes mirrored under `/en`, 194 total.**

- CLAUDE.md rule 0 said "French only. No i18n, no locale routing, no English
  pages." The human was asked, chose the full mirror over a core-pages subset,
  and rule 0 is rewritten to match. What the old rule protected is now enforced
  mechanically — see rule 0 for the three guards.
- `src/i18n/config.ts` owns `Lang`, the `/en` prefix maths and `Localized<T>`.
  `src/i18n/dictionary.ts` holds every non-content string, typed as
  `Localized<UiStrings>`, so a missing English key is a typecheck failure rather
  than a page that silently falls back to French.
- Content fields in `services.ts`, `communes.ts` and `faq.ts` became
  `Localized`. Slugs and commune names did not: a slug is a shared key, and
  Linas is Linas in both languages.
- Two root layouts, `src/app/(fr)/` and `src/app/(en)/en/`, because only a root
  layout may emit `<html>` and `lang` has to differ. Route groups add no URL
  segment, so French keeps the bare paths. The shared body is `BaseLayout` so
  the two cannot drift.
- Page bodies moved to `src/views/`, parameterised by `lang`. Each of the 20
  route files is now a thin wrapper. The French and English editions are the
  same components, so they cannot diverge structurally.
- `hreflang` fr/en/x-default on every page and in the sitemap; `x-default` and
  the canonical of the French page both point at French. EN sitemap priority is
  0.8× the FR value so the mirror never outranks what it mirrors.

**Third `'use client'` component: `LangToggle`.** Justification, per rule 2:
the header lives in the root layout, which cannot know which page renders
inside it, so `usePathname()` is the only way to link to the *current* page's
counterpart instead of the other language's home page. The static export
prerenders every route, so the href is baked into the HTML — checked in the
build output, e.g. `/zones/linas/vitres/index.html` carries
`href="/en/zones/linas/vitres/"`. Nothing appears only after hydration, so
rule 2's "complete HTML before JavaScript runs" still holds.

**Guards updated, not weakened.**

- `check:seo` now builds all 194 rows and pools French and English into one
  uniqueness namespace: an untranslated title collides and fails the build.
- `check:compliance` now covers 54 routes (27 FR + 27 `/en`) and matches
  English assertion patterns as well as French ones. The English facade and
  bins copy states the exclusion as a denial, which the guard permits, and
  `/en/professionnels/` mentions the scheme nowhere at all — both verified in
  the exported HTML.
- The English tax-credit badge renders in pending mode, same as French.

**Verified:** `npm run verify:full` passes — typecheck, lint (0 warnings),
194 unique titles, 200 pages exported, 54 routes clear of tax-credit claims.

**Not done, and deliberately so:**

- English slugs. `/en/services/vitres`, not `/en/services/window-cleaning`.
  Translating slugs doubles the routing table and both guard scripts for a
  market that is secondary. Say the word and it becomes a mapping table in
  `src/i18n/config.ts`.
- The `TODO(claude)` body-copy stubs on the service, commune×service, B2B,
  privacy and tax-credit pages are still stubs — in both languages now. They
  were stubs before this session and translating a stub does not fill it.
- The English legal pages carry a line saying the French version is the binding
  one. Confirming that wording, and the rest of the legal copy, is human-only
  work — rule 7, and it belongs with item 11 below.

### Phase 2 — Home page + design system (2026-08-31)

- Design system landed from the human-supplied `logo+prototype.html`. Palette,
  type scale, radii and motion are real tokens in `globals.css`; the PENDING
  banner is gone and CLAUDE.md rule 6 is rewritten to match.
- Fonts self-hosted, latin subset only: 107 KB instead of the prototype's
  355 KB. No third-party request at runtime, no network call at build time.
- Logo derived from the prototype's CSS geometry into a real SVG, plus favicon.
- 7 stock photos converted PNG → WebP at display size: 3.1 MB → 132 KB. They
  are placeholders, marked on screen, and do not claim to be the client's work.
- Home page rebuilt from the prototype. Header, footer and mobile nav are new
  shared chrome, so all 97 routes pick up the design.
- `npm run verify:full` passes: typecheck, lint (zero warnings), 97 unique
  titles, 102 pages exported, 27 routes clear of tax-credit claims.

### Phase 0 — Discovery

- All 8 Phase 0 questions given a declared home. Answered where known,
  explicitly `null` where not. No question is left implicit.
- `company.ts` gained `sapDeclaration.attestationIssuer`, `serviceArea`
  (`departments` + `confirmed`), and `googleBusinessProfile`. All null/false.
- `docs/10-discovery-questionnaire.md` written: the client-facing asks, in
  French, each mapped to the field it fills.
- Dependencies installed. `npm run verify` and `npm run verify:full` pass.
  Dev server runs on `localhost:3000`.

Phase 0's Done criterion is met: every item is answered or explicitly `null`
with a note above saying what it blocks. Phase 1 is unblocked — the three
answers that would change generated routes (items 1, 2, 3) only affect copy
and the commune list, both of which are data-driven and cheap to re-run.

---

## Decisions log

| Date | Decision | Reason |
|---|---|---|
| 2026-09-06 | Built `/services` and `/zones` hub pages rather than redirecting the old `/services-1/` to a fragment | ROADMAP phase 6 names `/services/` as the 301 target and it did not exist, so the redirect was going to land an indexed old URL on a 404 or on `/#services`. The hubs also answer the un-localised head terms ("entreprise de nettoyage Essonne") that no single service or commune page targets, which satisfies rule 3's "no page without a target query". |
| 2026-09-06 | Commune×service pages render two of the four service paragraphs, not all four | Rendering all four would make each of the 72 pages a near-copy of its `/services/{slug}` parent across twelve towns — the same thin-content failure, moved. The method and quoting paragraphs are what a visitor arriving on a local query still needs; the commune's `localAngle` is what differentiates the page. The real fix needs per-commune facts: item 20. |
| 2026-09-06 | One sitewide OG image per language, not one per route | 198 generated cards would add roughly 13 MB to the repository to say almost the same thing on every page. Rendered from the real brand assets with headless Chrome, so no dependency and no build-time image pipeline. |
| 2026-09-06 | Dropped `lastModified` from the sitemap entirely | It was `new Date()` at build time, stamping all 198 URLs with the same fresh timestamp on every deploy, including deploys that changed nothing. A crawler learns to ignore a lastmod that always says "just now"; an absent one is treated better than a distrusted one. |
| 2026-09-06 | Kept `check-metadata-unique.mjs` alongside the new `check-exported-metadata.mjs` | The old one duplicates title templates by hand, which is fragile, but it runs before the build and gives fast failure on a clean checkout where `out/` does not exist. It is now documented as the fast guard and the exported one as authoritative, and its copy of the tax rate is parsed from `company.ts` so the two cannot drift. |
| 2026-09-06 | Lighthouse measured against a gzip + immutable-cache server, not `python -m http.server` | The same build scores 80 on a bare static server and 98 with the headers Vercel actually sends. Measuring without them would have sent us optimising the test harness: "enable text compression" alone was worth 1.9 s. |
| 2026-08-31 | Prototype's "50 % de crédit d'impôt" hero card removed rather than restyled | CLAUDE.md rule 1 forbids the figure as static text, and while `sapDeclaration.number` is null it would be an unbacked claim — the exact L121-2 exposure `docs/04` is written to avoid. The rate now appears only where `<TaxCreditBadge />` renders it, on eligible service pages, which is also where `docs/05` puts the arithmetic block. The home page names the scheme without a number and links to `/credit-impot`. |
| 2026-08-31 | Did not extend `<TaxCreditBadge />` with a no-service "general" mode | It would have let the home page show the rate with sensible wording, but it also opens exactly the hole rule 1 closes: a badge that renders without an eligibility check could be dropped onto a façade page. That is a change to the legally sensitive component and is Darwin's call, not a side effect of a design import. |
| 2026-08-31 | Prototype's FR/EN toggle dropped | CLAUDE.md rule 0: French only, no i18n. Locale routing is named there as the failure that left a previous project indexed in one language only. |
| 2026-08-31 | "Équipe formée et assurée", "nos experts", "nacelle", "satisfaction garantie / nous revenons gratuitement" all removed | GLVITR'CLEAN is one operator. None of these appear in `src/data/` or the docs, and the insurance is still blocked (item 11). Inventing a team, equipment or a commercial guarantee is a rule 4 violation. `docs/05` asks for a named human instead of "notre équipe", so the copy names Thibaut. |
| 2026-08-31 | Prototype's 4-item service accordion became 6 server-rendered links | There are six services in data, each owns a route, and the home → service → commune chain is the site's whole commercial function. An accordion also hides copy behind hydration, which rule 2 forbids. |
| 2026-08-31 | Added a 12-commune block the prototype did not have | 84 of 97 routes are local pages. A home page with no commune links strands them. |
| 2026-08-31 | Footer e-mail capture replaced with the phone CTA | `docs/05` rules out a newsletter outright and sets the order call → WhatsApp → form. |
| 2026-08-31 | Only one tax-credit nav link, in the header, none in the footer | Rule 1 permits "the global navigation link" — singular. A second one in the footer would widen a legal exception for no gain. |
| 2026-08-31 | Phase 0 closed with nulls rather than held open until the client answers | The Done criterion is "answered or explicitly null with a note". Holding Phase 1 hostage to a client who has not replied costs weeks and buys nothing: the three answers that matter (SAP number, invoicing mode, service radius) all land in `src/data/`, not in page components. Re-running them later is a data edit, not a rebuild. |
| 2026-08-31 | `serviceArea.departments` provisionally `['91']`, `confirmed: false` | `communes.ts` already lists twelve Essonne communes. Leaving the scope field `null` while the list exists would be a lie about what the build assumes. The `confirmed` flag records that the assumption is unverified. |
| 2026-08-31 | Did not bump `next` off the pinned `15.5.0` | `npm audit` reports 26 Next.js advisories, one critical. Every one requires a running Next server — RSC flight protocol, middleware, image optimizer, server actions. This is `output: 'export'`: none of that ships. The exposure is `next dev` on a developer laptop, not the deployed artifact. Bumping is still worth doing, but it is a version-pin decision for Darwin, not a silent patch. |
| 2026-08-26 | Next.js 15 static export over Astro | Consistency with `serrurier-paris`, pod velocity. Astro ships less JS but the delta does not justify a second mental model. |
| 2026-08-26 | French only, no i18n | Client sells in one department. Locale routing was the exact failure that left Kembang Bali indexed in one language only. |
| 2026-08-26 | 12 communes, 6 services, 97 routes | Covers the real service radius without generating thin pages for towns the client will not drive to. |
| 2026-08-26 | Tax credit eligibility is a data field, not a page decision | Single source of truth. Removes the possibility of an illegal claim appearing on a facade page. |
| 2026-08-26 | Design system deferred | Client-side decision, held by Darwin. Structure first. |

---

## Dependencies added

| Package | Reason |
|---|---|
| next, react, react-dom | Framework |
| typescript, @types/* | Types |
| eslint, eslint-config-next | Lint |

Nothing else. Keep it that way unless there is a written reason here.

---

## Session template

```
### YYYY-MM-DD — <phase>

Done:
-

Blocked:
-

Next:
-
```

---

### 2026-08-31 — Phase 0 Discovery

Done:
- Recorded all 8 Phase 0 discovery questions. Each is either answered in
  `company.ts` or explicitly `null` with its blocking impact noted above.
- Added `company.sapDeclaration.attestationIssuer`, `company.serviceArea`
  (`departments` + `confirmed`), `company.googleBusinessProfile`. All null/false.
  No rendering behaviour changed — `sapVerified` still reads `false`, so the
  tax credit badge stays in pending mode.
- Wrote `docs/10-discovery-questionnaire.md`: the French client-facing asks,
  each mapped to the field its answer fills.
- Ticked Phase 0 in `ROADMAP.md` with an explicit note that ticked means
  recorded, not answered.
- Installed dependencies (first install). `npm run verify:full` passes:
  typecheck, lint, 97 unique titles, static export, compliance check clean.

Blocked:
- Items 1–14 in the table above. None block Phase 1.

Next:
- Send `docs/10-discovery-questionnaire.md` to the client (Darwin, human).
- Phase 1 Foundation: the scaffold already covers most of it. Audit what is
  real versus stubbed before ticking anything.
- Decide the `next` version pin (see decisions log, 2026-08-31).

---

### 2026-08-31 — Phase 2, home page

Done:
- Everything in "Phase 2 — Home page + design system" above.
- `docs/09-design-system.md` rewritten from "ON HOLD" to the landed v1 record.
- `CLAUDE.md` rule 6 rewritten. The hold is lifted; the token contract, the
  no-UI-kit rule and rule 4's hold over the placeholder photography all stay.

Blocked:
- Item 6, the photo archive, is now the most visible gap on the site.
- Items 1–4 and 10–14 unchanged.

Next:
- The other 96 routes still render unstyled structure. They inherit the header,
  footer and tokens, but their page bodies have not been designed.
- `/services/[slug]` is the highest-value next page: it is where
  `<TaxCreditBadge />` does the 50 % subtraction that `docs/00` calls the
  business's strongest argument.
- Decide the `next` version pin (see 2026-08-31 in the decisions log).

---

### 2026-09-06 — Phases 1–4 closed, phase 6 built

Done:
- Audited every open roadmap phase with 12 agents (6 dimensions, each
  adversarially verified). 72 findings, 58 confirmed, 14 killed as
  unreproducible, already-done, already-in-STATUS, or rule-violating.
- Fixed all 56 code-side findings. Highlights in the "Done" section above.
- `ROADMAP.md`: phases 1, 2, 3 and 4 ticked with evidence; phase 6 ticked on the
  code side; phase 7 marked entirely human. "English version" removed from the
  out-of-scope list — it shipped on 2026-08-31.
- `README.md` corrected: it still said "French only" and described the design
  system as unimplemented.
- New: `scripts/check-exported-metadata.mjs`, `src/components/ConversionBlock.tsx`,
  `src/views/{ServicesHubView,ZonesHubView}`, `vercel.json`,
  `public/assets/og/og-{fr,en}.png`.
- `npm run verify:full` passes: typecheck, lint (zero warnings), 198 unique
  titles, 204 files exported, 54 routes clear of tax-credit claims, 198 pages
  with unique titles/descriptions/H1s all within 160 characters.

Blocked:
- Everything still open. See "What we need from you" at the top. Items 18–21
  are new this session.

Next:
- Nothing on the code side. The next move is a human one: answer the items
  above, starting with registrar access (4) and the form endpoint (14).
- `vercel.json` has never been exercised. The first deploy after it lands should
  be checked with `curl -sI https://www.glvitrclean.com/contact/` and friends
  before the DNS cutover, not after.
