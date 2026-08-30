# 07 — Migration plan

**This is not a greenfield build.** The original brief said "current website:
none" and "check availability of glvitrclean.com". Both are wrong.

## What exists today

- `glvitrclean.com` is live, built on IONOS MyWebsite NOW
- Roughly four pages, no page per service, no commune named anywhere
- `contact@glvitrclean.com` already active, contrary to the brief
- The 50% tax credit displayed with no declaration number
- No mentions légales
- Service area stated as Essonne (91) and Val-de-Marne (94)

## Consequences

1. The domain has history. Preserve it. Do not register a new one.
2. Existing URLs may be indexed. Every one needs a 301, not a 404.
3. The client, or IONOS, controls DNS. Access is blocker #4.
4. Any existing Search Console property should be claimed, not recreated.

## Redirect map

| Old | New | Code |
|---|---|---|
| `/` | `/` | — |
| `/services-1/` | `/services/` | 301 |
| `/avantages/` | `/credit-impot/` | 301 |
| `/contact/` | `/devis/` | 301 |
| anything else | `/` | 301 |

Before cutover, crawl the live site and confirm this list is complete. Do not
assume four pages because four are in the navigation.

## Cutover sequence

1. Build and deploy to a preview URL. Verify all 97 routes.
2. Crawl the old site, finalise the redirect map.
3. Export any content worth keeping (photos, phone number, existing copy).
4. Configure redirects at the host (Cloudflare Pages `_redirects` file).
5. Lower DNS TTL to 300s, 24h ahead.
6. Point DNS at the new host.
7. Verify HTTPS, verify redirects with `curl -I`.
8. Claim or verify Search Console for `glvitrclean.com`.
9. Submit `sitemap.xml`.
10. Ping IndexNow.
11. Restore DNS TTL.

## Rollback

Keep the IONOS site paid and intact for 30 days after cutover. If the new build
regresses, DNS reverts in one change.

## What to watch after cutover

| Week | Expect |
|---|---|
| 1 | Old URLs redirecting, new sitemap accepted, first pages crawled |
| 2–4 | Indexing count climbing toward 97. If it stalls below 30, check metadata uniqueness first, not backlinks. |
| 4–8 | First impressions on `[service] [commune]` queries |
| 8–12 | Map pack appearance, if GBP verification completed |

Record the baseline before cutover: current indexed page count, current
impressions, current position for `glvitr clean`. Without a baseline there is
nothing to report to the client at handover.
