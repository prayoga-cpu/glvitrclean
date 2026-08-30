# 05 — Conversion architecture

Ranking is half the job. This is the other half.

## The three intents

| Intent | Signal | Route to | Primary action |
|---|---|---|---|
| **Urgent** | "after the storm", "before Sunday", arrives on mobile | Any page | One-tap call |
| **Planned** | comparing, reading about the credit, checking prices | `/credit-impot`, service pages | Quote form |
| **B2B** | "vitrine", "société", "contrat" | `/professionnels` | Named contact + form |

Every page must serve at least one of these. Most serve two.

## Action hierarchy, in order

1. **Call.** `tel:` link, always visible on mobile, sticky at the bottom of the
   viewport. A solo tradesman converts far better by phone than by form.
2. **WhatsApp.** Second. Lower friction than a form for a photo of the job.
3. **Quote form.** Three fields maximum above the fold: name, phone, what needs
   cleaning. Everything else optional and below.

Do not reverse this order. Do not put a long form in front of the phone number.

## The arithmetic block

On every eligible service page, the price is shown twice:

```
Nettoyage de vitres, maison standard      à partir de  90 €
Après crédit d'impôt de 50 %                            45 €
```

This block is the highest-leverage element on the site. It does the subtraction
the visitor would otherwise not do. It renders only through
`<TaxCreditBadge />`, so it disappears automatically on facade and bins.

In pending mode it shows the full price and explains the scheme without the
second line.

## Trust stack, in the order a visitor needs it

1. A real photo of real work in a recognisable place
2. SIRET and insurance visible, not buried
3. The declaration number, once it exists
4. A named human, not "notre équipe"
5. Eco-friendly products (already on the flyer, currently unused)
6. Free quote, stated with no asterisk
7. The €40 referral offer as a closing nudge, not a headline

## Form fields

Required: name, phone, commune (select from the twelve), service (select).
Optional: number of windows or surface, access (ground floor / upstairs /
veranda), preferred timing, photo upload, email.

The optional access question exists to filter out jobs a solo operator cannot
safely take. It saves a wasted visit.

RGPD: one checkbox, one sentence, linked to `/confidentialite`. No pre-tick.

## What not to build

- No live chat widget. Nobody is there to answer it.
- No online booking. The job needs a quote first.
- No newsletter. There is nothing to send.
- No exit-intent popup. It hurts Core Web Vitals and trust in equal measure.
- No countdown timer or fake scarcity. This is a local tradesman, not a funnel.

## Measurement

Phase 6 onward: Google Search Console only. Which query brought the visit, which
page they landed on, whether they called. No analytics script in v1, so no
consent banner, so no CLS from a consent banner.
