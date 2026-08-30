# 06 — SEO, AEO, GEO

Four layers. Each catches a different visitor. Build them in this order.

```
GEO   Google Business Profile, Maps, reviews, NAP consistency
       └─ catches "près de moi" and the local map pack
SEO   97 indexable pages, unique metadata on every one
       └─ catches "nettoyage vitres Arpajon" and every variant
AEO   FAQ schema, llms.txt, static server-rendered HTML
       └─ catches ChatGPT, Perplexity, Google AI Overviews
CONV  one-tap call, WhatsApp, three-field form
       └─ turns the visit into a quote request
```

## SEO layer

**Metadata uniqueness is the single most important technical requirement.**
`npm run check:seo` enumerates every route, builds its title and description,
and fails on any duplicate. This is not optional and must not be weakened.

Context: 39 of 51 pages on prionation.io went unindexed. The cause was duplicate
titles and descriptions, not backlinks, not domain authority. The generator
approach here makes that failure structurally impossible.

Checklist:

- Absolute canonical on every page
- One H1 per page, unique across the site
- Internal linking both directions: service ↔ commune ↔ service×commune
- `sitemap.xml` generated from `routes.ts`, never hand-maintained
- Images: WebP, explicit width and height, descriptive French alt text
- No orphan pages. Every route reachable in three clicks from home.

## AEO layer

Answer engines quote the **first sentence** of an answer. Write accordingly.

- Every FAQ answer opens with one complete, standalone sentence that answers the
  question. Elaboration comes after.
- `FAQPage` JSON-LD wherever an FAQ block exists.
- `public/llms.txt` describes the business, the service area, the six services,
  and the credit eligibility table in plain text. Keep it in sync with
  `src/data/`.
- Server-rendered HTML only. An answer engine that has to execute JavaScript
  usually does not.
- Facts an engine can lift: SIRET, service area, phone, hours, price basis,
  eligibility. Put them in structured data, not only in prose.

## GEO layer

This is the highest-return layer for a local tradesman and it is entirely
human work. See `docs/08-non-code-checklist.md`.

- Google Business Profile: primary category "Service de nettoyage de vitres",
  secondary categories for the other services. Service-area business, not a
  storefront, since there is no public-facing address.
- NAP (name, address, phone) identical to the character across site, GBP,
  Facebook, Instagram, PagesJaunes.
- `LocalBusiness` schema with `areaServed` listing all twelve communes with
  geo coordinates.
- Reviews are the ranking lever in the map pack. The client must ask for them
  after every job. Give him a short script and a QR code.

## Schema stack

| Type | Where |
|---|---|
| `LocalBusiness` | home, and as `provider` on every service page |
| `Service` + `areaServed` | service pages, service×commune pages |
| `FAQPage` | `/credit-impot`, every service page with an FAQ block |
| `BreadcrumbList` | everything below the first level |
| `AggregateRating` | **only once real reviews exist.** Never fabricate. |

## What will and will not move the needle

| Lever | Impact | Effort |
|---|---|---|
| Google Business Profile + reviews | very high | human, slow |
| 72 service×commune pages | high | automated, one day |
| Unique metadata | high | free, structural |
| FAQ schema on the credit question | medium-high | half a day |
| llms.txt | medium | one hour |
| Backlinks | low, at this scale | not worth it in v1 |
| Blog | near zero in v1 | skip |
