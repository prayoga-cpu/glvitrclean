# STATUS.md — GLVITR'CLEAN

Updated at the end of every work session. Newest entry on top.

**Current phase:** 2 — Core pages (home page done; design system landed;
site is now bilingual FR/EN)
**Build status:** `npm run verify:full` passes, 200 pages exported
**Deployed:** no — three failed Vercel attempts, both causes now fixed (see below)

---

## Blocked on human

Every Phase 0 question now has a declared home in the codebase and is either
answered or explicitly `null`. Nothing below silently defaults to a value.

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

Items 11–15 are not in the Phase 0 list but surfaced while recording it. They
are logged so they do not get discovered at launch. They do not block Phase 1.

The questions to send the client are written out, in French, in
`docs/10-discovery-questionnaire.md`. Each one names the field its answer fills.

---

## Done

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
