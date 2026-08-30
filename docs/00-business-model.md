# 00 — Business model

## What the business is

GLVITR'CLEAN, SIRET 988 737 268 00017. One operator, Thibaut. Based in the
Linas / Arpajon / Étampes corridor of the Essonne (91), south of Paris.

Sells six services to two very different buyers.

| Service | B2C | B2B | Tax credit |
|---|---|---|---|
| Nettoyage de vitres | core | yes | eligible |
| Nettoyage de terrasse | core | rare | eligible |
| Ménage | core | no | eligible |
| Volets et portes | secondary | no | eligible |
| Nettoyage de façade | secondary | yes | **not eligible** |
| Nettoyage de poubelles | secondary | yes | **not eligible** |

## How money is made

Per-intervention, quote-led. No subscription, no contract, no recurring revenue
in the current model. Free quote is the only entry point.

There is also a €40 referral bounty on the client's flyer. It is a real
acquisition channel and belongs on the site as a component, not buried.

## The pricing reality

Researched French market, August 2026. Île-de-France runs roughly 15% above the
national average.

| Basis | Range | Notes |
|---|---|---|
| Hourly, window cleaning | €25–40/h | standard access |
| Hourly, height access | €45–55/h | pole-fed or rope |
| Per m², glazing | €4–8/m² | Paris and IdF |
| Flat, standard house | ~€75, base €50–100 | plus €4–8 per extra pane |
| Marketplace floor | ~€34 average job | Yoojo, undercuts pros heavily |

**Read this carefully.** A private customer eligible for the credit pays half.
A €90 job becomes €45 out of pocket. That is below the marketplace average
price for the same work, from an insured operator instead of a gig worker.

**That arithmetic is the single strongest sales argument this business has, and
it is currently invisible.** The site's job is to do that subtraction on screen
for the visitor, on every eligible service, before they ask for a quote.

## The credit mechanism, correctly

Two paths exist and the site must not confuse them.

1. **Deferred credit.** Customer pays 100%, declares on form 2042-RICI
   (case 7DB), receives 50% back the following year via the annual attestation
   fiscale.
2. **Avance immédiate (URSSAF).** Customer pays only the 50% remainder at
   invoice time. The state pays the other half directly to the provider through
   the API Tiers de Prestation. Requires the provider to hold a SAP declaration
   with the DDETS and to be registered on the URSSAF platform.

Cap: €6,000 per household per year across all SAP spending.

**Thibaut does not hold the declaration.** He invoices through a cooperative.
Whether path 2 is available depends entirely on that cooperative's setup, and
that answer is blocker #2 in `STATUS.md`. Until it is answered, the site
describes the scheme without promising the immediate discount.

## Structural weaknesses to design around

| Weakness | Design response |
|---|---|
| Solo operator, capacity ceiling undefined | Quote form asks for surface and access up front, so unqualified jobs self-filter |
| No published proof, photos unused | `/realisations` is a phase-5 priority, not decoration |
| No recurring revenue | Service pages seed the idea of a seasonal or twice-yearly pass |
| Margin diluted by cooperative commission on B2C | `/professionnels` is a real page, not an afterthought. B2B keeps full margin. |
| Tax credit claimed without backing | Pending mode on the badge until the number arrives |
