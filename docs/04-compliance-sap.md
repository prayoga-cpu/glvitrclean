# 04 — Compliance: Services à la Personne

**Read this before touching anything that mentions the tax credit.**

## The scheme

Article 199 sexdecies of the CGI grants private individuals a 50% tax credit on
eligible household services performed at their home. Cap €6,000 per household per
year. Since 2022 the *avance immédiate* lets the customer pay only the 50%
remainder at invoice time instead of waiting for the following year's
declaration.

## What is eligible here, and what is not

The relevant activity is "entretien de la maison et travaux ménagers". Per
servicesalapersonne.gouv.fr, it covers the interior of the home **and balconies
and terraces**. It excludes specialised exterior work, and it explicitly excludes
cleaning of exterior walls, which belongs to qualified building trades.

| Service | Eligible | Basis |
|---|---|---|
| Nettoyage de vitres | **Yes** | Household cleaning at the client's home |
| Nettoyage de terrasse | **Yes** | Terraces and balconies are inside the scope |
| Ménage | **Yes** | Core activity of the scheme |
| Volets et portes | **Yes** | Ordinary upkeep, no specialised equipment |
| Nettoyage de façade | **No** | Exterior wall cleaning is excluded |
| Nettoyage de poubelles | **No** | Outside the household activity list |
| Any B2B customer | **No** | Scheme is for private individuals only |

This table is mirrored exactly in `src/data/services.ts`. If the two ever
disagree, the data file is wrong and must be corrected to match this document.

## The blocker

**Thibaut does not hold the SAP declaration himself.** He works through a
registered cooperative that takes a commission on invoices.

That arrangement is legal and common. But it changes who may say what:

- The declaration number displayed on the site must be **the cooperative's**,
  not GLVITR'CLEAN's.
- The invoice the customer receives must come from the declared entity, or the
  customer gets no credit.
- The annual attestation fiscale is issued by the declared entity.
- The *avance immédiate* is only available if that entity is registered on the
  URSSAF Tiers de Prestation platform.

Until the cooperative's name and number are known, **the site cannot legally
display a 50% claim as fact.** The current live IONOS site does exactly that,
with no number anywhere. That is a *pratique commerciale trompeuse* under
Art. L121-2 of the Code de la consommation.

## How the code handles it

`src/data/company.ts`:

```ts
sapDeclaration: {
  holder: null,   // cooperative legal name
  number: null,   // SAP########
  mode: null,     // 'prestataire' | 'mandataire'
  avanceImmediate: null,  // boolean
}
```

`<TaxCreditBadge />` has three states:

| State | Condition | Renders |
|---|---|---|
| **Hidden** | `service.taxCreditEligible === false` | `null` |
| **Pending** | eligible, but `sapDeclaration.number === null` | Explains the scheme in general terms. Does **not** claim GLVITR'CLEAN is registered. No "vous bénéficiez de". |
| **Live** | eligible and number present | Full claim, with the holder name and number printed, plus the price arithmetic |

Do not add a fourth state. Do not add an override.

## Other legal requirements

| Requirement | Status | Where |
|---|---|---|
| Mentions légales (LCEN art. 6-III) | **Missing on live site** | `/mentions-legales` |
| SIRET displayed | to add | footer + mentions légales |
| RC Pro insurance details | unknown | mentions légales, once known |
| Privacy notice (RGPD) for the quote form | to add | `/confidentialite` |
| Répertoire des Métiers registration for facade work | **unverified** | blocks offering facade at all |
| Price display obligation (arrêté 1987) | to add | pricing basis on each service page |

## Rules for the writer

- Never write "vous bénéficiez de 50%" while the badge is in pending mode.
- Never put the credit on `/professionnels`, `/services/facade`, or
  `/services/poubelles` — not even as a negative mention.
- On `/services/facade`, state plainly that the credit does not apply. Explain
  why in one sentence. Do not hide it.
- Always distinguish the deferred credit from the avance immédiate. Conflating
  them is the most common error on competitor sites.
- Never state the cap, the form number, or a case number without a source. If
  in doubt, link to servicesalapersonne.gouv.fr and stop.
