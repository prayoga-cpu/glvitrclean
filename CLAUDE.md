# CLAUDE.md — GLVITR'CLEAN

Fixed rules for this repository. These are not suggestions. If a task conflicts
with a rule here, stop and ask the human. Do not "improve" your way around one.

---

## 0. What this project is

A French local-search website for GLVITR'CLEAN, a one-person cleaning business
in the southern Essonne (91). Windows, terraces, housekeeping, shutters,
facades, bins. Sells to private individuals and, separately, to businesses.

The entire commercial value of this site is: **rank for `[service] [commune]`
searches, then convert the visitor into a quote request.** Everything else is
secondary. If a change does not serve ranking or conversion, it is out of scope.

Languages: **French and English.** French is primary and owns the bare paths
(`/services/vitres`); English mirrors it under `/en` (`/en/services/vitres`).
Slugs are never translated — a slug is a shared key, not copy. Every page exists
in both editions: 97 routes × 2 = 194.

This rule changed on 2026-08-31, at the human's explicit instruction, replacing
"French only. No i18n, no locale routing, no English pages." What that old rule
was protecting still holds, and is now enforced mechanically instead:

- The French edition is the commercial one. `[service] [commune]` searches are
  French, so EN sitemap priorities are stepped down to 0.8× the FR ones and the
  mirror never competes with the page it mirrors.
- Every page emits `hreflang` for `fr`, `en` and `x-default`, `x-default`
  pointing at French. Without that pair the 194 routes read as duplicates.
- `npm run check:seo` pools French and English into ONE uniqueness namespace, so
  an untranslated template that leaves an English title identical to its French
  twin fails the build.

Code, comments, and these docs stay in English. Add a third language only by
extending `LANGS` in `src/i18n/config.ts` — never by hand-writing a page.

---

## 1. The compliance rule (highest priority, never violate)

France's "Services à la Personne" scheme gives private customers a 50% tax
credit on eligible household work. It does **not** apply to every service this
business sells, and it does not apply to business customers at all.

**Eligibility is declared once, in `src/data/services.ts`, on the
`taxCreditEligible` field. Nothing else decides it.**

| Service | `taxCreditEligible` |
|---|---|
| `vitres` | `true` |
| `terrasse` | `true` |
| `menage` | `true` |
| `volets-portes` | `true` |
| `facade` | `false` |
| `poubelles` | `false` |

Hard rules:

- `<TaxCreditBadge />` renders `null` when `taxCreditEligible` is `false`. Never
  add an override prop, a `force` flag, or a page-level exception.
- `/professionnels` and any B2B copy must never mention the tax credit, the 50%
  figure, the `avance immédiate`, or URSSAF — **in either language**. Not even
  to say it does not apply. The one permitted exception is the global
  navigation link to `/credit-impot` (`Crédit d'impôt` / `Tax credit`), which
  sits outside `<main>`. If a B2B-specific nav is ever built, drop it.
- `npm run check:compliance` greps the exported HTML inside `<main>` on all 54
  forbidden routes — the 27 French ones and their 27 `/en` twins — and fails on
  any claim, matching French *and* English assertion patterns. Run it after
  every build. Do not add an allowlist entry — fix the page.
- Eligibility is a property of the service, never of the language. A translation
  may not soften or strengthen a claim: the English `eligibilityNote` on
  `facade` and `poubelles` must stay a denial, and the English FAQ answer on
  `facade-credit` must not drift into a phrase that reads as an offer. See the
  header comments in `src/data/services.ts` and `src/data/faq.ts`.
- The 50% figure must never appear as static text in a page component. It comes
  from `TAX_CREDIT_RATE` in `src/data/company.ts` and always renders through
  `<TaxCreditBadge />`, so it can be switched off globally in one edit.
- Until `company.sapDeclaration.number` is a real value (not `null`), the badge
  renders in **pending mode**: it explains the scheme without claiming the
  client is registered. Do not remove pending mode to "make the page look
  finished."

Why: the client does not hold the SAP declaration himself. He invoices through a
cooperative. Displaying an unbacked 50% claim is a *pratique commerciale
trompeuse* under Art. L121-2 of the Code de la consommation. This is a legal
exposure, not a design preference. See `docs/04-compliance-sap.md`.

---

## 2. Rendering rules

- **Static export only.** `output: 'export'` in `next.config.mjs`. No server
  actions, no route handlers, no middleware, no ISR, no `dynamic = 'force-dynamic'`.
- **Every page must be complete HTML before JavaScript runs.** Content that only
  appears after hydration does not exist to a crawler.
- `'use client'` is allowed only in `QuoteForm`, `MobileNav` and `LangToggle`.
  Adding it anywhere else requires a written justification in `STATUS.md`.
  `LangToggle` was added on 2026-08-31: the header lives in the root layout,
  which cannot know which page renders inside it, so `usePathname()` is the only
  way to point the toggle at the current page's counterpart rather than dumping
  every visitor on the other language's home page. The export prerenders each
  route, so the correct href is baked into all 194 HTML files — verified in the
  build output, not assumed.
- No client-side data fetching for content. All content is imported from
  `src/data/` at build time.
- No `localStorage`, no `sessionStorage`, no cookies beyond what a consent
  banner would require. There is no consent banner in v1 because there is no
  analytics script in v1.

---

## 3. SEO rules

- **Every route emits a unique `<title>` and `<meta name="description">`.**
  Enforced by `npm run check:seo`, which fails the build on any duplicate,
  pooling both languages. Do not weaken or skip that check.
- **Every route emits `hreflang` for `fr`, `en` and `x-default`.** Generated by
  `toMetadata()` in `src/lib/seo.ts` from the route's `basePath`, and emitted
  per-URL in `sitemap.ts` too. A page without its pair is a duplicate-content
  bug, not a cosmetic omission.
- Titles come from `buildMetadata()` in `src/lib/seo.ts`. Do not hand-write a
  `metadata` export on a page that has a generator available.
- Every page emits JSON-LD via `src/lib/schema.ts`. Minimum: `LocalBusiness` on
  the home page, `Service` + `areaServed` on service and commune pages,
  `FAQPage` where an FAQ block exists, `BreadcrumbList` on anything nested.
- `sitemap.ts` and `robots.ts` are generated from `src/lib/routes.ts`. If you add
  a route, add it to `routes.ts` — as a locale-free `basePath`, which yields
  both editions at once — or it will not be in the sitemap.
- `public/llms.txt` must stay in sync with the service and commune lists, and
  names both editions.
- Canonical URLs are absolute and use `SITE_URL` from `src/data/company.ts`.
- No page may be added without a target query. If you cannot name the search it
  is meant to win, do not create the page.

---

## 4. Content rules

- French copy is written for a homeowner, not a procurement manager. Short
  sentences. No jargon. No "solution globale", no "expertise reconnue".
- Prices, when shown, are ranges with a stated basis, never a single number
  with no unit. See `docs/00-business-model.md` for the researched market range.
- Never invent a review, a customer name, a certification, a year of experience,
  or a number of jobs completed. If a proof point is not in `src/data/`, it does
  not go on the page.
- Never invent a photo. Placeholder images live in `public/assets/placeholder/`
  and are visibly marked as such.
- Commune pages must differ from each other by more than the town name. Each
  carries at least one locally specific paragraph from `src/data/communes.ts`.
  Thin duplicated commune pages get deindexed and drag the whole domain.

---

## 5. Code rules

- TypeScript strict. No `any`. No `@ts-ignore`.
- `npm run verify` (typecheck + lint + seo check) must pass before any commit.
- No new npm dependency without adding it to `STATUS.md` with a one-line reason.
  The target is a site that builds with almost nothing installed.
- No CSS framework config changes until the design system lands. See rule 6.
- File names kebab-case. Component files PascalCase. Data files kebab-case.

---

## 6. Design system: LANDED v1 (2026-08-31)

The hold is lifted. The human supplied the logo and prototype; it is
implemented in `src/app/globals.css`. The `DESIGN SYSTEM: PENDING` banner is
gone. See `docs/09-design-system.md` for the palette, the type scale, and the
reasoning.

What still binds:

- **Components reference tokens. Never hard-code a colour in a `.tsx`, and
  never use an inline `style` object.** If a component needs a value that has
  no token, add the token to `globals.css` and record it in `docs/09`.
- Do not install a UI kit, an icon library, or a font package. Fonts are
  self-hosted woff2 in `public/assets/fonts/`, latin subset only.
- `--font-display` (Newsreader italic) is for the accent phrase inside a
  heading. Nothing else.
- The photography is still stock placeholder, marked on screen and living in
  `public/assets/placeholder/`. Rule 4 still applies to it: it is not the
  client's work and must not be presented as such. Phase 5 swaps the files.

---

## 7. Human-only work

You cannot do these. When a task requires one, stop and write it into
`STATUS.md` under "Blocked on human":

- Domain and DNS changes, registrar access
- Google Business Profile creation and postal verification
- Anything requiring the client's SIRET, SAP number, or bank details
- Publishing, deploying to production, or pointing the domain
- Sourcing real photos, real reviews, or real prices
- Confirming legal wording with the client's accountant

See `docs/08-non-code-checklist.md`.

---

## 8. The loop

Per feature, in order:

1. Write the spec into `ROADMAP.md` if it is not already there
2. Implement
3. `npm run verify`, and `npm run verify:full` before anything ships
4. Update `STATUS.md`
5. Commit with a message naming the roadmap phase

Do not batch several phases into one commit. Do not skip step 4.
