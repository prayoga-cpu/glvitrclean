# STATUS.md — GLVITR'CLEAN

Updated at the end of every work session. Newest entry on top.

**Current phase:** 2 — Core pages (home page done; design system landed)
**Build status:** `npm run verify:full` passes, 102 pages exported
**Deployed:** no

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

Items 11–14 are not in the Phase 0 list but surfaced while recording it. They
are logged so they do not get discovered at launch. They do not block Phase 1.

The questions to send the client are written out, in French, in
`docs/10-discovery-questionnaire.md`. Each one names the field its answer fills.

---

## Done

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
