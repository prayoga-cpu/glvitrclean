# STATUS.md — GLVITR'CLEAN

Updated at the end of every work session. Newest entry on top.

**Current phase:** phases 0–4 DONE, phase 6 done on the code side, phase 8
(competitor teardown) DONE on the code side 2026-09-10.
**Everything still open is waiting on a human** — see "What we need from you".
**Build status:** `npm run verify:full` passes — five checks now: typecheck, lint,
`check:seo`, `check:compliance`, `check:metadata`, `check:proof`. 224 routes.
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
| 3 | **The Seine-et-Marne commune list** — which 77 towns, by name | Half answered on 2026-09-09: the departments are confirmed as 91 + 77 (not 94) and the site now says so at department level, in the copy and in `areaServed`. What is still missing is the towns. Until they are named there is no `/zones/{ville}` page in the 77, so the whole department is carried by one line of copy instead of by pages that can rank on `[service] [ville]` — which is how every Essonne lead will arrive. Each town added is 8 basePaths, 16 routes. | "Dans le 77, vous allez concrètement dans quelles communes ? Donnez-en cinq à dix, celles où vous iriez sans hésiter. Et dans la liste actuelle des douze communes de l'Essonne, en manque-t-il, ou y en a-t-il où vous n'iriez pas ?" |

### Small, but they unlock real things

| # | What we need | Why it matters | Ask |
|---|---|---|---|
| 7 | **Facebook and Instagram URLs** | `company.social` is `[]`, so the footer shows no social links and `sameAs` is absent from the LocalBusiness schema. `sameAs` is how Google ties this site to the same business as those profiles — an empty array costs real local ranking signal. | "Les adresses exactes de vos pages Facebook et Instagram." |
| 8 | **Any existing Google Business Profile** | A forgotten duplicate competing with a new one is worse than no profile. Find it before creating another. Blocks phase 7. | "Avez-vous déjà une fiche Google, même ancienne ou jamais utilisée ? Avec quelle adresse e-mail ?" |
| 20 | **Per-commune job notes** — one or two real sentences per town | The 72 commune×service pages differentiate on H1, `localAngle`, postal code, schema, links and two of four body paragraphs. That is the honest limit of what the current data supports. Genuinely town-specific copy needs facts only you have. | "Pour chaque commune : un détail concret. Le type de maisons, un chantier marquant, une contrainte d'accès qui revient." |
| 21 | **Sanity-check a few operational statements** | Written from `src/data/`, but worth ten minutes of your eyes before launch: that a damaged roller shutter is cleaned but not repaired; that bin cleaning happens where the bin is stored and you ask the customer to put it out empty; that a facade job always needs a site visit first. | Read `/services/volets-portes/`, `/services/poubelles/` and `/services/facade/` and tell us what is wrong. |
| 22 | **Do you use a pure-water (deionised) system on solar panels?** | The solar-panel copy said "eau déminéralisée / deionised water" in four places. Nothing in `src/data/` or the docs backs a deionisation rig, and rule 4 counts equipment among the things that may not be invented, so it now reads "eau claire / clean water" — true whichever kit you own. If you do run a pure-water pole system, say so and it goes back in: it is a real differentiator on panels and on high glazing. | "Vous lavez les panneaux à l'eau osmosée / déminéralisée, ou à l'eau du robinet ?" |
| 23 | **Confirm the hard water** | `communes.ts` tells the Égly page the tap water is calcaire across the sector, which drives the "traces de calcaire" story on several pages. It is almost certainly right for the Beauce limestone, but the only thing in the repo permitting it is a comment written in the same pass as the claim. One sentence from you retires the question. | "L'eau est bien calcaire dans tout le secteur ?" |
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

### The title carries the brand line, and 97 strings of copy were rewritten (2026-09-10)

Two instructions in one message from the human, relaying the client: make the
title read **GLVITR'CLEAN | MULTI SERVICE**, and improve the copy.

#### The brand line

`company.brandLine` is the single source. It is a title format, not a second
legal name — `legalName` stays `GLVITR'CLEAN`, which is what the mentions
légales print and what the LocalBusiness node is called.

| surface | before | after |
|---|---|---|
| home, hubs, 7 services, 12 communes, 8 fixed pages — 28 routes per language | `… \| GLVITR'CLEAN` | `… \| GLVITR'CLEAN \| MULTI SERVICE` |
| the 84 commune × service titles | no brand | **unchanged, still no brand** |
| `og:site_name` | `GLVITR'CLEAN` | the brand line |
| manifest `name` (`short_name` unchanged) | `GLVITR'CLEAN` | the brand line |
| `llms.txt` heading, 404 `<title>` | `GLVITR'CLEAN` | the brand line |
| LocalBusiness JSON-LD | `name` only | `name` unchanged, **`alternateName`** added |

**Why `alternateName` and not `name`.** Google's rule for a LocalBusiness is
that `name` is the real-world business name and nothing else; a tagline in that
field is how a knowledge panel ends up titled with marketing copy. The brand
line is a variant name, so it is declared as one.

**Why the deep pages stay bare.** The brand line costs 31 characters with its
separator. The 84 commune × service pages are won on `[service] [commune]` and
nothing else, and the suffix would push all of them past the point Google cuts.

**The length check was rewritten rather than silenced.** `check:seo` measured
whole titles against 65, which would now warn on all 56 branded ones and say
nothing. It measures the HEAD — the words before the brand — against 60, and
the whole title against 80. Two warnings remain, both pre-existing and both the
longest commune crossed with the longest service.

Heads were trimmed only of filler where the brand line made them long: "Nos
prestations" → "Prestations", "Our cleaning services" → "Cleaning services",
"Nos réalisations" → "Réalisations", and `/credit-impot` lost "sur le". No
title lost a search term.

#### The copy pass

Eight surfaces — services FR and EN, communes, FAQ FR and EN, dictionary FR and
EN, and the sixteen hand-written fixed-page descriptions — were drafted and
then adversarially reviewed by a second agent each, sixteen agents in all.
**101 proposals, 4 rejected on review, 97 applied.**

The four writer agents and both final sweep agents were killed mid-flight by a
session limit, which left the tree PARTIALLY applied: 66 of the 97 had landed,
31 had not. The rest were applied here from the reviewed output by exact-string
replacement with a match-uniqueness check, and every one of those 31 was read
before it landed. Nothing was taken on trust — see the three findings below
that were checked and turned out to be wrong.

What the pass actually bought, beyond line-by-line polish:

- **Head terms where there were bare nouns.** `/services` opened "Vitres,
  terrasses, ménage…"; a searcher types "nettoyage de vitres". Same on a dozen
  FAQ answers, which are what an answer engine quotes.
- **"Réduction d'impôt" → "crédit d'impôt"** in two answers. Different
  instruments in French tax law, and only one of them is what this scheme is.
- **Counts derived, not typed.** The `/services` and `/zones` descriptions
  wanted "sept prestations" and "les douze communes"; they read
  `services.length` and `communes.length` instead, so an eighth service cannot
  leave the SERP claiming seven.
- **The two editions stopped disagreeing.** Six places where the French had
  been improved and the English left behind — the roller-shutter housing, the
  empty-bin instruction, the priced-work step, the department names in the
  hub H1 — now say the same thing at the same strength.

#### A bug the pass surfaced: 19 descriptions had no call to action

`compose()` filled the 160-character budget in order and dropped whatever did
not fit. On 19 of the 168 commune × service pages — every English solar-panel
and bin page among them — what did not fit was the last clause, which is the
only line in the description that asks for the job. Nothing failed: each
description was still unique and still under the cap.

It now reserves room for the closing clause before the middle clauses compete
for the budget, and a clause may be given as alternatives, longest first, so a
deep page keeps the phone-number CTA where there is room and the bare "Devis
gratuit." where there is not. **0 of 168 are now missing one.**

#### What the adversarial review caught before it shipped

The compliance sweep was re-run here after the pass. Six real findings, all
fixed:

| finding | why it mattered |
|---|---|
| The solar-panel denial was scoped to arrays "en toiture" / "on the roof" | Three other lines on the same page tell the visitor a ground or carport array is in scope. A denial with a hole in it is one a reader can take as not applying to him — and `check:compliance` cannot see it, because the guard matches assertions. Now "quelle que soit sa pose" / "wherever it is mounted", in `services.ts`, `faq.ts` and `docs/04`. |
| `facade-credit` EN said "quotes you **half price**" | The French twin interpolates `{pct}`. Rule 1 exists so the rate is switchable in one edit; "half price" would have survived that edit. Now `{pct}% off`, verified against the guard on the forbidden English route. |
| EN home card said "Some home services fall under this French scheme" | The French had just been rewritten to enumerate the four eligible services. On a card above a grid of seven, three of them ineligible, "some" is the ambiguity the enumeration was written to close. |
| EN form success still said "We will call you back **shortly**" | The French was deliberately de-promised in the same pass. Nothing backs a response time. |
| Three commune claims | Linas gained "PVC de première génération" on a housing stock the angle above dates to the 1970s — PVC frames are an 1980s material in France. La Norville asserted "tout est accessible depuis le sol" about every property in a commune, which doubles as a pricing representation. Brétigny placed the older housing "près de la gare". All three cut, and recorded in the `communes.ts` header where that file already records claims cut on review. |
| "Eau déminéralisée / deionised water" in four places | Equipment is on rule 4's list and no deionisation rig is recorded anywhere. Now "eau claire / clean water", with the question put to the client as item 22. |

Also fixed while there: `pricingFactors` claimed area sets the price on all
seven services — it is hourly on ménage, per bin on poubelles, per panel on
panneaux-solaires — and its doc comment asserted the opposite. A `company.ts`
comment referred to a `noSubcontracting` field that does not exist. The home
page said the corridor runs "de Montlhéry à Étampes" while `/zones` said "de
Linas à Étampes"; both now say Montlhéry.

**Three findings were checked and rejected.** The sweep reported a firm-price
guarantee ("rien n'est facturé au-delà du devis accepté") in `pricingFactors`
and a Montlhéry claim sorting housing by altitude; neither string exists in the
tree — the first was never written, the second was cut earlier and is recorded
as cut in the file header. A third, deriving the €6,000 / €3,000 cap figures
from `TAX_CREDIT_ANNUAL_CAP`, is real but out of scope here and needs a
language-aware placeholder; it is left for a separate change.

#### What the consistency review caught

A second reviewer read the same diff for seams — the kind parallel writers leave
behind. Applied:

- **The FAQ's own rule was being honoured in one language per entry.** The file
  header requires the opening sentence to answer the question standalone in
  BOTH editions, because that is the sentence an answer engine quotes. Three
  entries broke it in opposite directions: the English `prix-vitres` never said
  "window cleaning", while the French `volets-perimetre` and `panneaux-perimetre`
  both opened "Le nettoyage couvre" — two answers on two pages with the same
  three words — after their English twins had been fixed to name the service.
- **`/services/poubelles/` printed the same sentence twice**, byte-identical in
  English, once in the body copy and once in the FAQ answer that is also emitted
  as the `FAQPage` entity. The FAQ answer now adds rather than echoes.
- **The English deep pages were losing the phone number 20 times more often than
  the French.** "in {commune} and the surrounding area." is eleven characters
  longer than "à {commune} et alentours.", and that difference came out of the
  CTA's budget. Simulated over all 84 pairs: **62 of 84 carried the phone number
  before, 82 of 84 after** the clause became "and nearby".
- `terrasse.summary.en` said "patio slabs" — not the search term, and it
  collides with "patio doors", which this site uses for *baies vitrées*. It also
  dropped "timber", which `longTail.en` explicitly targets.
- Five more English strings that never followed their French twin: the 404 body,
  the services eyebrow, the home lead's B2B clause, and `statQuote`, which
  renders under the figure `0 €` and so read "0 € free quote".
- `b2b.contactH2` still said "Parler à quelqu'un" while the body under it says
  you talk to the team, and the English had already moved to "Talk to us".
- `poubelles-credit` was not on `/credit-impot`, so the page promising "ce qui
  en est exclu" listed two of the three exclusions.
- Area wording: the second "en" restored on two French descriptions; the English
  `/zones` title regained its definite articles and gave up its department codes
  to pay for them; the seven services now enumerate in array order in both
  languages.
- `hubs.servicesIntro` typed "Sept" / "Seven" two files away from a comment
  saying the number must never be typed. It takes `services.length` now, like
  `postalIntro` beside it.
- One claim, one phrasing: `écologiques` / `eco-friendly` is kept for short UI
  labels and `respectueux de l'environnement` / `environmentally responsible`
  for prose; "commits you to nothing" — a calque of *sans engagement* — is gone.
- Five curly apostrophes normalised to the straight ones the rest of the
  codebase uses. Twice the naive swap broke the file, because the literal was
  single-quoted and the curly apostrophe was the only reason it parsed.

**Not applied, deliberately.** The reviewer wanted `home.aboutH2` rewritten:
"Une équipe à votre disposition, votre satisfaction notre priorité" is exactly
the register rule 4 warns about, and on the page its second half renders in the
display italic. But it is `company.tagline` — **the client's own sentence**,
supplied as feedback §7. Rewriting the client's chosen line because it reads as
filler is not a copy fix, it is overruling him. Left as it is, and worth one
question next time there is a call.

Deferred: the four eligibility answers share two closing sentences across
services, so as `FAQPage` entities they read as one answer with a noun swapped.
Varying them means editing compliance-sensitive text and wants its own pass.
Same for deriving the €6,000 / €3,000 cap figures from `TAX_CREDIT_ANNUAL_CAP` —
the €3,000 is a hand-computed half, so it belongs in the same discipline as
`{pct}`, but it needs a language-aware placeholder.

#### Verification

`npm run verify:full` green: 224 routes, 226 HTML files, compliance clear on
all 80 forbidden routes, titles, descriptions and H1s unique across the pooled
FR+EN namespace, every description within 160 characters. The rendered HTML was
read back for the four compliance-sensitive pages rather than assumed.

### Phase 8: competitor teardown, code side (2026-09-10)

Two competitor sites were taken apart and written up in the new `TODO.md`: Mr
Sparkle Window Cleaning (Melbourne) and SPIC AND SPAN (Paris). Every idea there
carries a tag — `[code]`, `[client]`, `[blocked]` or `[reject]` — and this
session implemented the `[code]` set, specced first as ROADMAP phase 8. Build
after: **224 routes, 226 HTML files**, `verify:full` green, compliance clear on
all 80 forbidden routes, 224 pages with unique titles, descriptions and H1s.

Fourteen boxes ticked, fifteen left open: eleven `[client]`, three `[blocked]`,
one `[code]` that rule 3 gates. Every open box now names the fact it waits on.

#### What the Paris teardown actually found

Worth recording because it reframes what is worth copying. Fetched and grepped
the raw HTML of `spicandspan.fr/en/cities/paris-cleaning-service`:

| | them | us |
|---|---|---|
| `hreflang` | **none** — zero `rel="alternate"`, the fr and en editions do not declare each other | all 224 routes, plus `x-default` |
| JSON-LD | **none** — zero `application/ld+json`, despite claiming 25 000 customers and showing 14 reviews | `LocalBusiness`, `Service` + `areaServed`, `FAQPage`, `BreadcrumbList` |
| their 20 arrondissements | listed as plain text, **not linked**, no pages behind them | our 12 communes are real routes, and now linked from every page |

They rank anyway, on heading discipline, geographic enumeration and sitewide
internal linking. That is what phase 8 took; the three rows above are the moat
and needed nothing.

#### 8a — commune pages say why the dirt is there

`Commune` gained two mandatory `Localized` fields beside `localAngle`: `soiling`
(the physical cause) and `housing` (the building stock and the access problem it
creates). Twelve communes × 2 fields × 2 languages = 48 new strings. Mandatory,
so a thirteenth commune cannot be added thin.

Why: one templated sentence was carrying the whole weight of rule 4 across
twelve commune pages and 84 crossings. The Brighton page we were looking at does
not just name a beach, it gives a *cause* — salt-laced breeze off the bay leaving
a film on the glass. Cause is the part a template cannot generate.

The limit is written into the file header and it is hard: every claim must be
either already asserted in this repository, or true of the whole of southern
Essonne. No invented street, landmark, local business, or claim about a specific
building. Two claims that were neither were **checked externally before
shipping**, and the findings are recorded in the header so the next editor
inherits them as fact rather than as someone's guess:

- Montlhéry's old centre really is on a slope — a promontory around 137 m
  falling gently north and east where the houses are, steeply south toward Linas.
- Essonne tap water really is hard — about 26.8 °f against 22.1 °f nationally,
  Étampes about 27 °f. Hardness varies across the department (Orsay ~11 °f), so
  the claim is scoped to "this area" and must not be widened.

`TODO(human)`: the client knows these twelve towns. He should read the
thirty-six strings once before go-live.

#### 8b — the lateral link mesh

Three separate gaps, all of them in internal linking:

1. **`PostalIndex`** (new) on `/zones`. Nine postal codes, twelve communes, each
   code linking to the commune pages it covers. Both counts derived from
   `communes.length` and the grouper, never typed — same rule 0 reasoning as the
   route totals. `nettoyage 91150` had no anchor anywhere on the site before
   this. The Paris page makes its postal-code field a one-input booking widget;
   we cannot, because resolving a code in the browser needs a fifth
   `'use client'` component and rule 2 names only four — and it would be the
   wrong shape anyway, since `91290` alone covers Arpajon, La Norville and
   Ollainville.
2. **Nearest-commune crossings on the 84 `[commune]/[service]` pages.** They
   linked *up* to two hubs and nowhere sideways, so the deepest and most
   numerous layer of the tree had no lateral crawl path at all. Now: same
   service, four nearest communes, via the `nearestCommunes()` haversine that
   already existed.
3. **The footer became a link distributor.** It reached seven service pages and
   four fixed ones, and **no commune page at all** — so twelve hubs and 84
   crossings depended entirely on the home page and `/zones` for inbound links.
   It now carries all twelve communes plus `/services` and `/zones` as linked
   column headings.

`/credit-impot` was deliberately **not** added to the footer. Rule 1 permits
exactly one global tax-credit link and the header already has it; a footer copy
would put the phrase in the footer of all 80 forbidden routes, `/professionnels`
included. The comment in `SiteChrome.tsx` says so at the point of temptation.

#### 8c — heading discipline

- A qualifier on the twelve commune-hub H1s: `sans sous-traitance` /
  `no subcontractors`. Not decoration — it is the client's own differentiator
  from feedback §7, and it is the thing a visitor choosing between a marketplace
  and a company is actually deciding on. It went onto the 84 crossings too and
  came back off on review; see below.
- The place name repeated across the H2s of a local page. Six of the ten H2s on
  the Paris page contain "Paris"; ours named the commune in the H1 and in one
  H2, then stopped. `commune.neighbouring` now takes the commune name, and the
  new 8a headings carry it too.

This surfaced a French bug that had nothing to do with SEO: `Les maisons de
Étampes`. Five of the twelve communes are vowel-initial — Arpajon, Égly,
Étampes, Étréchy, Ollainville — so a bare `de ${commune}` printed wrong French
in a heading, in the primary language, on nearly half the commune pages. Fixed
with `ofCommune()` in the new `src/lib/french.ts`, which handles accented
capitals (a naive `/^[aeiou]/i` misses `É` entirely) and documents the
masculine-article case no served commune currently needs.

#### 8d — service pages

- **`PricingNote`** (new), on all seven service pages. Renders `pricing.basis`
  as a labelled row — *Mode de calcul : au m²* — plus the free-quote line and
  what moves the price. `pricing.fromEur` is `null` on all seven and stays that
  way until the client confirms figures, so this is a **basis with no number**,
  which is exactly what rule 4 permits and the inverse of what it forbids. The
  `À partir de` row appears on its own the moment `fromEur` stops being null:
  one edit per service, no page to touch.
  Rendered as label/value rows rather than sentences because the basis values
  are fragments — `au m²`, `forfait maison`, `horaire`, `sur devis` — and no
  single French sentence frame takes all seven without turning ungrammatical.
- **`service.longTail` is finally rendered.** Seven arrays of real French
  sub-service names — `démoussage terrasse`, `nettoyage véranda`, `nettoyage
  baies vitrées` — have sat in `services.ts` since phase 2, described in their
  own comment as being for copy, and rendered nowhere. They go on the service
  page that already ranks, not into new routes: rule 3 wants a target query per
  page, and these are near-synonyms of the query the parent already targets, so
  seven pages each would be seven thin pages competing with their own parent.

#### 8e — conversion cadence

- **More than one `ConversionBlock` per page.** Every long template rendered
  exactly one, at the bottom. A visitor who left at 40% scroll — most of them —
  saw no in-content action at all. Service and commune pages now carry three,
  commune×service two, and both hubs two.
- **`ProcessSteps`** (new), extracted from `HomeView`. The steps were written
  once and rendered once, on the page that mostly receives *brand* traffic. They
  now also render on the seven service pages and twelve commune hubs, which are
  the pages that receive *local search* traffic from people who have never seen
  the home page.
- **The photo-quote path promoted out of prose**, as `common.photoQuote` on the
  first `ConversionBlock` of a page. It was already true and already half-built
  — `common.whatsapp` labels the button "send a photo", `ChatLauncher` drafts the
  first line, `services.ts` says a photo is often enough — and it was stated in
  prose on two of seven service pages. Which services may show it is decided by
  the new `Service.photoQuote` field, not by the caller; it shipped hard-coded
  and was gated on review, see below. **No response time**: `docs/05` and the
  `chat` dictionary block both forbid inventing one, and it is logged as a
  `[client]` item.

#### Deliberately not built

Each of these is a `TODO.md` tag, not an oversight:

- Prices, guarantees, response times, insurance figures, customer counts —
  `[client]`, rule 7. Nothing invented to fill a slot.
- Review markup and before/after slots — `[blocked]`, phases 7 and 5. Not
  scaffolded ahead of the content either: an empty `reviews.ts` emits no schema
  node and renders no block, so it would be dead code whose shape is decided by
  reviews nobody has seen.
- The `/tasks` taxonomy — `[code]` in mechanics, but rule 3 wants a named target
  query per route and choosing those is not an agent's call. 8d's longtail
  rendering answers most of what it was for.

#### What the review caught, and what changed because of it

Phase 8 was put through a multi-dimensional adversarial review before being
called done — eight reviewers reading the working tree against CLAUDE.md, then
refuters on each finding. Three reviewers finished before the run was stopped
(agents were editing project files, which was not what they were asked for), so
the findings below were judged by hand rather than by the refuter stage. Six were
real and all six are fixed. They are recorded because four of them are mistakes
the four build checks cannot catch, and the same mistakes are easy to make again.

**1. A conservatory roof does not pond water.** Saint-Germain-lès-Arpajon's
`soiling` said a veranda roof is "presque horizontale", that nothing drains off
it and that rainwater stands on it. That is wrong — a glazed roof is pitched so
that it drains, and one that ponds is a defect — and it **contradicted the
Marcoussis entry in the same file**, which correctly says such roofs are pitched
but too shallowly for rain to clean them. Two commune pages 10 km apart asserted
opposite physics about the one building element the reader owns and can walk out
and look at.
Rewritten on a different axis entirely — the density of the housing, so the two
pages do not converge on one story either.

**2. Montlhéry's slope was not a cause.** The field said the old centre is built
on a slope, *therefore* rain runs down the facades. The slope is real (it was
checked externally: a promontory around 137 m). The causation is not — walls are
vertical whatever the ground does, and "carrying the dust with it" describes
washing, not soiling. So the one page whose job is to name a cause named a
non-cause. Now says what is actually true and was already implied by the prior
`localAngle`: the glazing bars trap what a single sheet of glass would let run
off.

**3. Montlhéry's building stock was sorted by altitude** — old terraced houses at
the top, newer houses on the slopes below. Neither already in the repo nor true
of southern Essonne generally, and not dependably true of the town. Cut; the
two-stock contrast it was carrying is kept without the positioning.

**4. `pricingFactors` ended in a guarantee.** "Rien n'est facturé au-delà du
devis accepté" / "nothing is billed beyond the quote you accepted", on all seven
service pages in both editions. Nothing in `src/data/` or `docs/` backs it,
ROADMAP phase 8 excluded guarantees **by name**, and on `menage` the data
actively contradicts it: the basis is `horaire` and the bodyCopy says the quote
fixes the hourly volume, so hours actually worked are legitimately billable.
`PricingNote`'s own header comment asserted "It is not a guarantee", which is
precisely what the sentence was. Clause cut.

**5. The photo-quote line was printed on the two services that need a visit.**
This is the worst of the six. `photoNote` was hard-coded `true`, so "envoyez une
photo, elle suffit à préparer le devis sans déplacement" appeared on `facade`,
whose own bodyCopy says a prior visit is **indispensable**, and on `terrasse`,
which is measured on site — 26 routes each. On a facade *crossing* it is worse
still, because that view renders only `bodyCopy[1]` and `[3]`, so the
contradicting paragraph is not even on the page.
Hedging the wording to "for many jobs" was not a fix: on a page about one
service, a hedge still reads as a yes. So eligibility is now declared per
service, exactly the way `taxCreditEligible` is — a new `Service.photoQuote`
field, `true` only where a bodyCopy paragraph already says so in both editions
(`vitres`, `panneaux-solaires`, `poubelles`), `false` everywhere else including
the two where the data says nothing, because silence is not permission.
Verified in the export: note present on 3 of 7 service pages and the matching
crossings, absent on the other 4. The hedge survives only on the
service-agnostic pages (commune hubs, `/services`, `/zones`), where covering all
seven makes "for many jobs" literally accurate.

**6. Égly's `housing` named a product that does not exist** — "le forfait
multi-prestations", with a definite article, so a caller could ask for a package
the business does not sell. Its English twin made only a practice statement,
which is the backed version, so the two editions also disagreed. French brought
into line with the English.

**One change made on our own judgement, not from a finding.** The H1 qualifier
`sans sous-traitance` came **off** the 84 commune×service crossings and stays on
the twelve commune hubs. A hub is where a visitor is choosing a provider, which
is what the qualifier speaks to; a crossing is where they are checking we do one
job in one town, and there the H1 should be the tightest match to "nettoyage de
vitres à Étampes". 168 more H1s carrying the same appended phrase diluted that
and told nobody anything new.

**A note on the review itself.** The reviewers had write access and three of them
were mid-task when stopped; their transcripts were checked and **no review agent
wrote to any project file** — every apparent write was a scratchpad redirect or a
heredoc. Separately, `src/lib/seo.ts` was being edited concurrently from outside
this session during the run (a real improvement to `compose()`: it now reserves
room for the closing call-to-action clause instead of letting the middle clauses
eat the budget). It was briefly half-saved and failed typecheck; it landed
complete and the final `verify:full` is green with it.

#### Second pass: the machinery for everything that was only waiting on content

Five `TODO.md` items were sitting behind "the content does not exist yet", and on
inspection content was the *only* thing missing. The first pass had deliberately
not scaffolded them, on a dead-code argument. That argument was wrong, and the
repository itself is the counter-example: `company.sapDeclaration.number` is
`null` with the badge in pending mode, and `company.social` is `[]` with `sameAs`
appearing in the JSON-LD the moment it is filled. Both shipped their machinery
first on purpose. These now do too.

| item | data slot | what appears when it is filled |
|---|---|---|
| Reviews | `src/data/reviews.ts` — empty | `aggregateRating` + `review` on LocalBusiness; `<Reviews />` on the home page and, filtered, per commune |
| Before/after | `src/data/realisations.ts` — empty | `<BeforeAfter />` on `/realisations` and per service |
| Job durations | `Service.duration` — `null` ×7 | *Durée sur place* row in `<PricingNote />` |
| Insurance | `company.insurance` — `null` | the real policy replaces "À compléter" on `/mentions-legales` |
| Price in snippet | `Service.pricing.fromEur` — `null` ×7 | *À partir de X €.* in the meta description, and the `À partir de` row |

Nothing on the site changed: every one renders nothing and emits no schema node
while its slot is empty. Verified in the export — no `.reviews` markup, no
`.before-after` markup, no `aggregateRating`, no duration row, `/realisations`
still showing its "photographs are coming" note, `/services/vitres` description
unchanged.

**And each was proved by switching it on.** Scaffolding that has never been run is
a guess, not scaffolding. Temporary data was pasted in, the site built, the output
checked, and the data reverted — confirmed clean afterwards by grep. What the
activation run showed:

- `"aggregateRating":{"ratingValue":4.5,"reviewCount":2,"bestRating":5,...}` and
  two `Review` nodes on the LocalBusiness.
- The commune filter working: Étampes rendered the one review tagged to it and
  not the other, while both still appeared in the sitewide LocalBusiness node —
  which is correct, that node describes the business and not the page.
- The unlinked paper-review case printing its provenance without an anchor.
- `<dt>À partir de</dt><dd>120 €</dd>` and `<dt>Durée sur place</dt><dd>environ
  deux heures</dd>` in the pricing block.
- The description becoming `… sans trace. À partir de 120 €. Intervention en
  Essonne (91) …` — the price fitted as a middle clause without displacing the
  closing call to action.
- The insurance line in both editions, with the cover formatted per locale:
  `à hauteur de 2 000 000 €` / `covering up to €2,000,000`.

One defect was found by doing that and fixed: a commune page printed the
whole-business summary, "4.5 sur 5, sur 2 avis", above a *single* review, which
reads as though one had gone missing. The summary now renders only on the
unfiltered view — the rating claim lives where all the reviews it is computed from
are listed, and recomputing it per commune would have been worse, printing a 5.0
off one review.

**Rule 4 notes written into both new data files**, because these two are the
easiest places on the site to cause real harm. Never invent a review, not even a
placeholder with a real-sounding name — an `avis trompeur` carries its own penalty
regime since 2022, the same class of exposure as the unbacked 50% claim. And no
before/after pair may use the seven stock images in
`public/assets/placeholder/`, nor pair two different properties, nor be filed
under a service that was not the one performed.

**`/tasks` was retagged `[code]` → `[client]`.** The first pass recorded it as
blocked on "a named target query per route", which was the wrong reason — naming
queries is something an agent can do. The real reason is scope: the task terms
that are genuinely distinct queries are distinct *because they are different
services*. `repassage` and `nettoyage après travaux` are not among the seven the
client sells, so a page for either would advertise work he may not do — an offer
of a job that does not exist, which is worse than an overstated claim about one.
`repassage` would pull rule 1 in behind it too, being SAP-eligible. If he does
offer them, each becomes an entry in `services.ts` — 1 + 12 basePaths, 26 routes,
the way `panneaux-solaires` did — not a `/tasks` tree.

**`TODO.md` end state: 17 done, 14 open, and all fourteen are `[client]`.** No
`[code]`, no `[blocked]`. Every open box names the fact it waits on.

#### The footer wordmark was distorted, and phase 8b did it

Reported from a screenshot. `.brand__wordmark` was `width: auto; height: 4.5rem`,
which looks like it preserves the aspect ratio and does not: the global
`img { max-width: 100% }` rule still applies, because the class overrides `width`
and `height` but not `max-width`. So in any container narrower than the
wordmark's natural width at that height, the WIDTH was clamped while the height
stayed pinned — and the type squashed.

It had been fine, by 2.6 pixels. The wordmark is 603×149, which at 4.5rem is
291.4px wide, and the four-column footer gave each column 294px. **Adding the
commune column in phase 8b made it five columns and 225.6px** — a 22.6%
horizontal distortion, on every page of the site.

Fixed by sizing from the width instead, so the height follows: `width: 18.2rem`
(the same rendered size where there is room), `max-width: 100%`, `height: auto`.
Aspect ratio is now exact at four, five or six columns — verified against the
built CSS, which carries no fixed height on either brand rule any more.

`.brand__mark` in the header had the identical latent bug. It is square, so
`width: 4rem; height: auto` renders pixel-identically to what it replaced and
nothing moves; it simply cannot distort now. `flex: none` was protecting it, and
that is one layout change away from not being true.

A sweep of every fixed-height image rule found no others: the hero gallery, the
split media, the inset and `.contact-media` all pair a fixed height with
`object-fit: cover`, which crops rather than distorts, and that is deliberate for
photography.

**Consequence worth knowing.** The logo is no longer distorted, but in the
five-column footer it now renders about 23% smaller than drawn, because the
column really is that narrow. Giving the brand column `grid-column: span 2` would
restore the drawn size — but it only helps above a 1440px viewport, and below
that `auto-fit` drops to fewer tracks and the span produces unpredictable rows.
Not worth the fragility without a design decision behind it.

#### A fifth build check, and the bug it had on the first try

`scripts/check-proof.mjs`, wired into `verify:full` as `check:proof`. Reviews and
photographs are the two places on this site where a mistake does real harm, and
until now nothing mechanically enforced that they stay dormant. It fails the
build on three things:

1. The arrays are empty but review or gallery output reached the export. An
   `aggregateRating` computed from nothing is a claim of zero stars from zero
   reviews, which is both a Search Console error and a false statement.
2. The arrays are populated but an entry is structurally invalid — rating outside
   1–5, a date that is not ISO, a Google or Facebook review with no URL a reader
   could check, or an obvious placeholder (`TEST`, `Lorem`, `John Doe`, an
   `example.*` domain) left behind.
3. A before/after image points into `public/assets/placeholder/`. Those seven
   files are stock, marked as such on screen, and may never be shown as the
   client's work. No other check can see this.

It was tested by feeding it four deliberately bad inputs, and **the first version
passed all four.** `arrayBody()` scanned for the first `[` after the declaration
name, which is the one in the type annotation `: Review[]` — so it read
`Review[` as the array opening, `]` as its close, and every array as empty. The
guard would have sat in `verify:full` reporting OK forever. Fixed by locating the
`=` first; the failure mode is written into the function's comment.

A check that has only ever been observed to pass has not been tested. Worth
remembering for the other four.

#### A syntax error arriving from outside this session

`src/data/faq.ts` broke mid-session with an unterminated string — an English FAQ
answer had been switched to single quotes while containing `household's`. It was
not this session's edit. It was fixed rather than reverted, by moving that one
string to double quotes, which is the convention the surrounding lines already
use for text containing an apostrophe.

Worth recording because the cause is environmental: another IDE (Antigravity) is
open on this repository and holds file handles inside `.next`, which also made two
`next build` runs fail with `ENOENT` / `ENOTEMPTY` on `.next/export` until the
directory was cleared and rebuilt. Neither was a defect in this code. If builds
start failing strangely, check for a second editor before debugging the app.

#### Files

New: `TODO.md`, `src/lib/french.ts`, `src/components/PricingNote.tsx`,
`src/components/PostalIndex.tsx`, `src/components/ProcessSteps.tsx`.
Changed: `ROADMAP.md`, `src/data/communes.ts`, `src/i18n/dictionary.ts`,
`src/app/globals.css`, `src/components/ConversionBlock.tsx`,
`src/components/SiteChrome.tsx`, and the five views.

No new dependency. No new `'use client'`. No new route — `routes.ts` untouched,
still 112 basePaths × 2.

### Feedback 6 to 9: area, team, solar panels, welcome message (2026-09-10)

Client feedback round 2, sections 6 to 9, implemented in one pass. Build after:
**224 routes, 226 HTML files**, `npm run verify:full` green, compliance clear on
80 forbidden routes.

#### §6 — the intervention area is now 91 AND 77

`company.serviceArea` was `{ departments: ['91'], confirmed: false }` and was
read by nothing. It is now two `{ code, name }` records, `confirmed: true`, and
it has a consumer: `departmentAreas()` in `src/lib/schema.ts` emits an
`AdministrativeArea` per department into `areaServed` on the LocalBusiness node
and on every non-commune `Service` node.

Where the second department shows up in the copy:

| surface | before | after |
|---|---|---|
| home H1 | `dans le sud de l'Essonne.` | `en Essonne et en Seine-et-Marne.` |
| service H1, ×14 | `en Essonne (91)` | `en Essonne (91) et en Seine-et-Marne (77)` |
| `/zones` title | `Zones d'intervention en Essonne (91)` | `Nettoyage en Essonne (91) et Seine-et-Marne (77)` |
| every service description | `dans le sud de l'Essonne` | both departments |
| `/professionnels`, `/realisations`, `/services`, footer, B2B intro, `llms.txt` | Essonne only | both |

**What did NOT change, and why.** The service and commune TITLES still say
"Essonne (91)" alone. Those pages are won on `[service] [commune]`, all twelve
communes are in the Essonne, and a title carrying both departments runs past
the point Google truncates — `/en/zones` was already 66 chars with the shorter
of the two phrasings and had to be re-cut to 62. The second department is
carried by the H1, the description and the structured data instead, which is
where it can be stated at length.

**No Seine-et-Marne commune page exists, deliberately.** The client named the
department; he did not name the towns. A commune page needs a `localAngle` that
is genuinely specific (rule 4) and a query it is meant to win (rule 3), and
inventing twelve Seine-et-Marne towns would be inventing facts about places we
have been told nothing about. So the site claims 77 at department level — which
is exactly what we were told — and generates nothing below it. The moment the
town list arrives, each town is 8 basePaths, 16 routes. **This is now the
narrow half of STATUS item 3**, which has been rewritten accordingly rather
than ticked off.

#### §7 — a team, and no intermediaries

`company.tagline` now reads *"Une équipe à votre disposition, votre
satisfaction notre priorité"* — the client's own line. It is repeated where it
is actually read: the home "about" H2 (`Une équipe à votre disposition,` +
`votre satisfaction notre priorité` in the accent face), and the second half of
the instruction — *no subcontractors, no intermediaries* — now appears in five
places in both editions: first item of the home checklist, the title and body
of the first "why us" card, the hero lead, the first B2B expectation, and the
footer description.

The 2026-09-09 entry below removed the operator's name; this goes the rest of
the way and says what the company is instead of what it is not. Rule 4 is
untouched: still no headcount, no years of experience, no certification, no
"nos experts". "Une équipe compétente et expérimentée" remains the client's own
phrasing, not ours.

#### §8 — solar panel cleaning, the seventh service

`panneaux-solaires`, inserted between facade and bins because that is where it
belongs on eligibility, with the full four-paragraph body in both languages,
three FAQ entries, and a `par panneau` pricing basis with `fromEur: null` like
every other service. 26 new routes (1 service page + 12 crossings, ×2), so
198 → 224.

**`taxCreditEligible: false`.** Cleaning an energy-generating installation on a
roof is not one of the household activities the SAP scheme lists — the same
reasoning that excludes facade, and the same direction of caution: rule 1
exists because the unbacked claim is the expensive error, not the missing one.
Recorded in `docs/04-compliance-sap.md`, whose table is the authority, and
mirrored into the CLAUDE.md rule 1 table.

The guards needed no edit for this. `scripts/check-compliance.mjs` derives its
forbidden list from `taxCreditEligible` in the data, so the new page and its
twelve crossings joined it automatically: 54 → 80 forbidden routes, all clear.
The `panneaux-credit` FAQ answer is modelled on `facade-credit` — the denial
sits inside the same sentence that raises the topic, because that is what the
guard's second layer checks.

#### §9 — the welcome message

*"Que puis-je faire pour vous ?"*, as a greeting bubble above the chat pill.

**It is attached to the launcher, not a second floating widget.** §10 had
already put a bubble in the bottom-right corner; a second one in the other
corner would be two things competing for the same job. `.chat` is now the fixed
dock and the `<details>` inside it is `.chat__disclosure` — every placement
rule in `globals.css` (sticky-call-bar clearance, the `data-scroll` offsets,
the `data-nav` hide) was already written against `.chat` and none of them had
to change.

No JavaScript, so no new client component and rule 2's list of four still
stands. The markup order is disclosure → checkbox → greeting and the dock is
`flex-direction: column-reverse`, which puts the greeting visually above the
pill while keeping the launcher first for the keyboard, and lets both hide
rules be plain sibling selectors rather than `:has()`. It appears on a 1.4 s
animation delay with `both`, so it does not flash on first paint; opening the
panel hides it; the checkbox dismisses it for the rest of the page. Dismissal
is per-page and not remembered — rule 2 rules out `localStorage`, and a
greeting is not worth a cookie. Verified in a real browser at 500 and 1440 px,
including the two hidden states, by rendering the exported HTML with `checked`
and with `open` set.

**One deviation from the client's words, and it is deliberate.** He wrote
*"Que puis-je faire pour vous ?"* — first person singular. Section 7 of the
same document says to replace the single-person positioning with a team
message. A singular greeting on all 224 pages would contradict section 7 on
every one of them, so it ships as **"Que pouvons-nous faire pour vous ?"** /
*"What can we do for you?"*. If the client wants his original wording, it is
one string in `ui.welcome.message` in both editions.

#### Verification

`npm run verify:full`: typecheck, lint, `check:seo` (224 routes, all titles
unique), build, `check:compliance` (80 routes clear, badge still pending),
`check:metadata` (224 pages, titles/descriptions/H1s unique, every description
inside 160 chars). Screenshots of the home page, `/services/panneaux-solaires/`
and the greeting's three states were taken against the exported artifact, not
the dev server.

### The chatbox, answered without a chat widget (2026-09-10)

Client feedback, section 10 "Chatbox — Feasibility": *"The client would like to
know whether a chatbox can be added to the website. Please check feasibility and
recommend the simplest appropriate solution. A lightweight contact/chat widget
may be sufficient; a complex AI chatbot is not necessarily required."*

**Feasible. Shipped at the lightweight end of the range the client named.**

`src/components/ChatLauncher.tsx` — a pill in the bottom corner of every route.
Opening it reveals a panel with three actions: call, WhatsApp with the first
line already drafted, and the quote form. It is a `<details>` element. No
`'use client'`, so it stays off CLAUDE.md rule 2's list of the only four client
components allowed.

**What was ruled out, and why.**

| Option | Verdict |
|---|---|
| Hosted widget — Crisp, Tawk.to, Intercom | Every one sets cookies or localStorage, which rule 2 forbids outright, and that drags in a consent banner the site does not have and `docs/05` specifically avoids. 200 kB+ of third-party JavaScript against a build measured at 97–99 Lighthouse. |
| AI chatbot | Needs a server to hold the conversation. Rule 2 pins the site to `output: 'export'`. There is nowhere to put one. |
| Static launcher into WhatsApp | Shipped. |

The deciding argument is not the technical one. `docs/05` already said "no live
chat widget — nobody is there to answer it", and that is still true: a chat
nobody staffs converts worse than no chat. What the visitor actually wants is to
message the business without phoning, and WhatsApp already does that, on the
phone the client carries to the job. `docs/05` has been amended rather than
contradicted — the "what not to build" line now points at the new "Chatbox"
section, so nobody reads the old sentence and rips this out.

**It never pretends to be staffed.** No "we are online", no typing indicator,
and no response-time promise — the same reason `footer.responseTime` carries
none, and the same rule 4 that keeps the 24 h commitment off the site.

**Measured, not assumed.**

- Zero JavaScript. `grep -rl chat__toggle out/_next/static/` matches the
  stylesheet and nothing else; no JS chunk contains it.
- Present on all 224 exported pages, absent from `404.html`, which builds its
  own minimal shell with no chrome.
- Outside `<main>` on every page, so it is not in `check:compliance`'s namespace
  — and it names no service, so it could not carry a tax-credit claim anyway.
- The panel and all three links are in the static HTML. Screenshotted with every
  `<script>` stripped: it opens and every action works.
- `npm run verify:full` passes — 224 routes, compliance clear, metadata unique.

**Two overlap bugs found by screenshotting rather than reasoning, both fixed.**

The pill is fixed to the bottom of the viewport, which is crowded. It sits
*under* the sticky call bar in the stacking order (z-index 55 against 60) — the
call bar is the primary action and must never be the thing that gets covered —
and it hides itself outright while the mobile menu is open, reusing the
`data-nav` attribute `MobileNav` already sets.

1. **It covered the footer.** On desktop the pill sat on top of
   `Confidentialité`; on mobile, on `contact@glvitrclean.com`. Fixed the way the
   call bar's identical bug was fixed in phase 2f — hide while any part of the
   footer is on screen, on `data-footer`, which `ScrollChrome` already sets. It
   applies at every width, because the pill, unlike the call bar, is not
   mobile-only.

2. **The call bar's no-JS fallback had never worked.** Pre-existing, and found
   because the launcher needs the same mechanism. `@media (max-width: 47.99rem)
   { .site-footer { padding-bottom: 5.5rem } }` sat in the call-button section
   at line 1520; `.site-footer { padding: … 2.125rem }` sits at line 1690. Same
   specificity, later source wins, so the shorthand had been quietly overriding
   it since phase 2f and the padding had never once applied. Moved below the
   shorthand and resized to clear both elements. With scripting off the footer's
   last rows — the e-mail address and the two legal links — were underneath the
   bar; they are not now. Verified in the browser both ways.

None of this needed a fifth client component: everything about where the pill
sits is CSS, driven by the three attributes `ScrollChrome` and `MobileNav`
already write.

### Opening hours published, in both editions and in the schema (2026-09-09)

Client feedback, section 5 "Opening Hours": *Monday–Friday 9:00 AM–6:30 PM,
Saturday–Sunday 10:00 AM–6:00 PM. Add these hours to the Contact section and/or
footer.*

Declared once, in `company.openingHours`, as day arrays plus 24-hour `opens` /
`closes`. Three consumers read that one array:

| where | renders |
|---|---|
| footer contact column, all 224 routes | `Horaires d'ouverture` / `Opening hours`, one line per block |
| `/devis` and `/en/devis`, under the call button | same lines, where the visitor is deciding whether to ring now |
| `LocalBusiness` JSON-LD, all routes | `openingHoursSpecification` with `https://schema.org/<Day>` values |

**Why one array and not three copies.** The hours are the answer to "can I call
now?", and Google reads the JSON-LD to answer it inside the local result. Text
that says one thing while the structured data says another is worse than no
hours at all, so the rendered line and the schema are generated from the same
source in `src/lib/hours.ts`. Changing an hour is a one-line data edit.

**The times are language-invariant; only their wording is not.** `09:00` is
stored once and formatted per edition — French `9h00 – 18h30` with the
non-breaking space French typography puts before a colon, English
`9:00 AM – 6:30 PM`, which is the form the client wrote them in. Day names and
both formatters live in `i18n/dictionary.ts` under `hours`, so the FR and EN
lines cannot drift apart or fall back to each other; `UiStrings` makes a missing
English key a typecheck failure as usual.

`OpeningHoursBlock.days` is typed as a non-empty tuple, so a block with no days
— which would print an empty range and emit a dayless spec — does not compile.

**Not a claim, so rule 1 and rule 4 are untouched.** Hours are a fact the client
supplied about himself, like the phone number. No response-time promise was
added with them: `footer.responseTime` still says only "devis gratuit et sans
engagement", and nothing anywhere says he answers within X hours. The line is
identical on `/professionnels` and sits outside `<main>` in the footer, so the
compliance grep is unaffected — it still passes on all 80 forbidden routes.

`public/llms.txt` gained the hours in its Contact block, in both languages, per
rule 3.

`npm run verify:full` passes: 224 routes, 226 HTML files exported, titles and
descriptions unique across both languages, compliance clear. Verified in the
exported HTML rather than assumed — `out/devis/index.html` and
`out/en/devis/index.html` both carry the lines and the spec before any
JavaScript runs.

### The site speaks as a company, not as one named person (2026-09-09)

Client feedback, section 3 "About Us / Company Positioning": *"Remove messaging
that presents Thibaut as the person behind GLVITR'CLEAN. Replace it with
team-focused wording, for example: **'Behind GLVITR'CLEAN is a competent and
experienced team.'** The website should communicate a professional company
rather than a one-man operation."*

Four strings named the operator, each in both languages. All eight are rewritten
and the name no longer appears anywhere in `out/` — grepped after the build, not
assumed.

| where | before | after |
|---|---|---|
| `home.aboutLead` | "Derrière GLVITR'CLEAN il y a Thibaut, qui se déplace lui-même…" | "Derrière GLVITR'CLEAN, il y a une équipe compétente et expérimentée, qui se déplace sur chaque chantier." |
| `home.whyCards[0].body` | "Thibaut réalise lui-même chaque intervention." | "Notre équipe réalise elle-même chaque intervention." |
| `b2b.contactBody` | took `operator` as an argument | a plain string, "vous parlez directement à l'équipe qui réalise les interventions" |
| `home.lead` (EN only) | "One person from start to finish" | "One point of contact from start to finish" |

`b2b.contactBody` was `(operator: string) => string`; it is now a plain string,
so `FixedViews` no longer passes the name in. `company.operator` is deleted from
`src/data/company.ts` — the dictionary was its only reader, and an unused name
field on the company record is an invitation to put it back on a page.

**What deliberately did not change.** "Un seul interlocuteur" stays in the home
lead, the about checklist and the B2B expectations list: it is a promise about
how the customer is handled, not a claim about company size, and companies of
every size make it. The English side already said "one point of contact" there.

**Rule 4 still binds and nothing new was invented.** No headcount, no years of
experience, no "nos experts", no "équipe formée et assurée" — the insurance is
still unconfirmed (item 11). "Compétente et expérimentée" is the client's own
wording, supplied in the feedback above.

**The business fact is unchanged.** `docs/00-business-model.md` still records one
operator, and the internal comments that turn on it — the access question in
`QuoteForm` that filters out jobs one person cannot safely take, and the absence
of a 24 h response promise — are untouched. This is a positioning change to the
copy, not a new claim about who turns up. `docs/05`'s trust-stack item 4 ("a
named human, not 'notre équipe'") is reversed there with a pointer here.

`npm run verify:full` passes: 198 routes, compliance clear on all 54 forbidden
routes, titles and descriptions still unique across both languages.

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

**The two alternatives were built and measured, not just remembered.** Each was
applied in its own worktree and taken through dev, `verify:full` and the
exported artifact. Both failures the old header comment described turned out to
be exactly right:

- *Give `not-found.tsx` its own `<html>`.* Does not even fix dev — still 500,
  because `next-app-loader` decides `rootLayout` from **file presence** in the
  app-root segment, never from what the component returns. A render-tree change
  cannot answer a build-graph question. It also nests the document: two
  `<html>`, two `<body>` in `out/404.html`.
- *A `not-found.tsx` inside each route group.* Fixes dev completely, and
  destroys the 404: `out/404.html` becomes Next's 5,575-byte built-in stub —
  no `<main>`, no French, no English, no stylesheet reference at all, titled
  "404: This page could not be found." Worse than expected, too — there is no
  `out/en/404.html` either, so **both** editions get the same bare English
  page, and both new files are dead weight the export never renders.

A trap worth recording: `grep -c '<html' out/404.html` returns **1 even on the
broken artifact**, because the export is one long line and `-c` counts lines,
not matches. Use `grep -o '<html' out/404.html | wc -l`. That check would have
passed the nested-document candidate.

Supersedes the phase 2b/2c notes further down that say the global 404 "must
live at `src/app/not-found.tsx`". That was right about where it could not live
and wrong about where it could.

### Brand kit landed, icons and social metadata wired (2026-09-09)

The client supplied a real brand kit — blue, gold and cream, drawn in the
site's own two faces. It replaces the peach raster taken off the old live site
in August, which was the last thing on the page that did not match the design
system. 18 files in, 3 out.

**What now renders.** The lockup is split across the two ends of the page, on
the human's call. The header and the 404 show the **mark alone**
(`mark.webp`, `4rem`, transparent, no plate). The footer shows the **wordmark
alone** (`wordmark.webp`, `4.5rem`) — `GLVITR'CLEAN`, its `NETTOYAGE PRO`
baseline and the flanking rules, cut out of `card-wide.png`. Neither place
carries the whole lockup, which was in the header first and came out because at
header size its wordmark duplicated what the nav and the H1 already say, and
its plate put a dark block in an airy cream bar.

**Everything on the page is a raster, and that is measured, not preferred.**
All three supplied vectors set their type as live `<text>` in Newsreader and
Schibsted Grotesk. An `<img>`-loaded SVG cannot reach the page's `@font-face`,
and the only Newsreader this site ships is italic, so inlining would not rescue
it either. The cost was quantified after the human reported the monogram
looking off-centre:

| | GL offset from disc centre |
|---|---|
| `mark.svg` in a browser | **2.1% left, 3.2% low** |
| `mark-512.png`, designer's render | 0.28% right, 0.41% high |

Nudging the SVG's coordinates would calibrate it to one platform's fallback
font and misplace it on every other, so the page uses the faithful raster and
the vectors stay for print. The footer wordmark is stored **lossless** because
its `#1b3a9c` ground has to match `--color-brand` exactly — banding would draw
the rectangle back in.

Verified in a headless browser at 1280px and 390px, and the centring measured
off the rendered pixels rather than eyeballed. Reasoning in
`docs/09-design-system.md`, "Logo".

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
404 became self-contained in `src/app/not-found.tsx` (superseded 2026-09-09 —
it is `src/app/global-not-found.tsx` now), and a second unused
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
> **Superseded 2026-09-09.** Right that it cannot live in a route group, wrong
> that it can live at `src/app/not-found.tsx` — that is what 500'd every
> app-root route in `next dev`. It is now
> `src/app/global-not-found.tsx`. Do not move it back.

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
| 2026-09-10 | The chatbox is a static `<details>` into WhatsApp, not a chat widget | The client asked for a chatbox and named "a lightweight contact/chat widget" as acceptable. Every hosted widget sets cookies or localStorage — rule 2 forbids both, and it would force a consent banner `docs/05` deliberately avoids — and an AI chatbot needs a server that `output: 'export'` does not have. Underneath the constraints sits the older reason: nobody is standing by to answer a live chat, and one that goes unanswered is worse than none. A `<details>` gives the visitor the thing they actually wanted — message us without phoning — for zero JavaScript and zero cookies, and lands it on the phone the client already carries. |
| 2026-09-10 | Fixed the sticky call bar's no-JS footer padding while adding the launcher, rather than leaving it | Not scope creep: the launcher needs the same fallback, and building a second one next to a broken first would have hidden the bug for good. The rule was 170 lines above the `padding` shorthand that overrode it, so it had never applied since phase 2f, and with scripting off the bar was covering the footer's legal links. |
| 2026-09-10 | Seine-et-Marne stated at department level only — no 77 commune page | The client named the department, not the towns. A commune page needs a genuinely specific `localAngle` (rule 4) and a query it is meant to win (rule 3); twelve invented Seine-et-Marne towns would fail both, and thin commune pages are the failure mode the whole `communes.ts` header exists to prevent. Saying "we cover the 77" is true and costs nothing; saying "we cover Melun" without knowing that is a lie that also spends crawl budget. The town list is now the narrow half of item 3. |
| 2026-09-10 | Service and commune TITLES still say "Essonne (91)" alone, while the H1s and descriptions name both departments | Those 98 pages are won on `[service] [commune]` and every commune on the site is in the Essonne. A title carrying both departments runs past Google's truncation point — `/en/zones` measured 66 characters on the first attempt and had to be re-cut. The title is the scarcest surface on the page; the H1, the description and `areaServed` are not, so the second department lives there. |
| 2026-09-10 | Solar panel cleaning added with `taxCreditEligible: false` | Cleaning an energy-generating installation on a roof is not among the household activities the SAP scheme lists — the reasoning that already excludes facade. Rule 1's asymmetry decides the close call: an unbacked 50% claim is a *pratique commerciale trompeuse* under Art. L121-2, while an over-cautious denial costs a sentence of copy. The guard needed no edit — it derives its forbidden list from the data, so the new page and its twelve crossings joined it automatically, 54 → 80 routes. |
| 2026-09-10 | The welcome message hangs off the existing chat launcher instead of being its own floating widget | The corner already had a bubble as of §10 the same week. Two floating elements competing in one viewport corner is worse than either alone, and a second fixed element would have needed its own copy of the sticky-call-bar clearance and the three `data-scroll` offsets — the exact duplication the chat section's header comment says it exists to avoid. Moving `.chat` from the `<details>` to a wrapper kept every placement rule byte-identical. |
| 2026-09-10 | The greeting says "Que pouvons-nous faire pour vous ?", not the client's "Que puis-je" | Section 7 of the same feedback document instructs us to replace the single-person positioning with a team message. A first-person-singular greeting would contradict that instruction on all 224 pages, which is the one place on the site it would be repeated most. Shipped in the plural with the deviation flagged; reverting is one string in `ui.welcome.message`. |
| 2026-09-09 | Opening hours declared once in `company.openingHours` and rendered from there in both editions, rather than typed into the footer and the schema separately | The hours exist to answer "can I call now?", and Google answers that from `openingHoursSpecification` inside the local result. Two copies of the same fact drift, and a page that contradicts its own structured data is worse for that result than no hours at all. The times are stored language-invariant (`09:00`) and formatted per edition — `9h00` in French, `9:00 AM` in English — because only the wording is a translation, not the hour. |
| 2026-09-10 | The brand line goes in the title suffix, `alternateName` and `og:site_name` — but not in the LocalBusiness `name`, and not on the 84 deepest routes | The client asked for the title to read "GLVITR'CLEAN | MULTI SERVICE". Google treats a LocalBusiness `name` as the real-world name, so a tagline there risks the knowledge panel; and 31 extra characters on a `[service] [commune]` title would cut the only words those 84 pages compete on. The brand is carried everywhere it costs nothing and nowhere it costs ranking. |
| 2026-09-10 | `compose()` reserves room for the closing clause instead of filling in order | 19 of 168 deep descriptions were shipping with no call to action, invisibly — still unique, still under the cap, just missing the ask. Ordering by priority is only correct if the lowest-priority clause is also the least valuable, and the CTA is the opposite of that. |
| 2026-09-09 | Removed the operator's name from the copy and from `src/data/company.ts` | Client instruction (feedback section 3): the site must read as a company, not a one-man operation. The name had exactly one consumer, the dictionary, so keeping the field after the copy stopped using it would only have made it easy to reintroduce. What rule 4 forbids is unchanged — the new wording claims a team but no size, no experience in years and no certification, and "compétente et expérimentée" is the client's own phrasing. |
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
