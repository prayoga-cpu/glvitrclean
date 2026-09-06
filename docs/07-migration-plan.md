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
| `/services-1/` | `/#services` — **interim, see below** | 301 |
| `/avantages/` | `/credit-impot/` | 301 |
| `/contact/` | `/devis/` | 301 |
| anything else | 404 | 404 |

Implemented in `vercel.json` at the repo root. Each old path is listed twice,
once with a trailing slash and once without — see "Trailing slashes" below.

**The old "anything else → `/` 301" row is gone, on purpose.** It was wrong
twice over. Mechanically: Vercel evaluates the `redirects` array *before* the
filesystem, so a catch-all `/:path*` → `/` sitting in that array does not mean
"if nothing else matched" — it means "every URL on this site", and it would
redirect all 194 real pages to the home page. Expressing a true after-filesystem
catch-all needs the low-level `routes` key, which cannot be combined with
`redirects` at all. Editorially: mass-redirecting unknown URLs to the home page
is the soft-404 pattern Google names explicitly, and it hides exactly the
information the crawl is supposed to surface. An unknown old URL should return
404 (Next's exported `404.html`); a *known* old URL earns its own line in the
table above.

## Is this inventory complete? No. It is assumed.

Nobody has crawled the old site. The four paths above come from the brief and
from the navigation, and the navigation is not the URL space. Before cutover,
crawl it and reconcile against:

- Search Console → Pages, and the old property's Performance report by page.
  This is the only source that shows URLs Google actually has, including ones
  the navigation dropped years ago.
- IONOS's own page list in the site builder.
- Any URL on the client's flyer, Facebook page, or e-mail signature.

One thing to check specifically: **`/services-1/` is a builder-generated slug.**
MyWebsite NOW appends `-1` when the slug it wanted was already taken, which
suggests a `/services/` may also exist on the old site. That is a hypothesis,
not a finding — but it is cheap to test with one request, and if it is true it
is an indexed URL missing from this table.

Until that crawl happens, treat this map as a floor, not a total.

## `/services/` does not exist on the new site — read this before "fixing" it

**This section is temporary. Delete it when the hub pages land.**

The documented target for `/services-1/` was `/services/`. There is no such
page. `src/lib/routes.ts` generates `/services/[slug]` × 6 and
`/zones/[commune]` × 12 (plus the 72 crossings) and nothing at either parent
path; the export confirms it — `out/services/` and `out/zones/` are directories
of children with no `index.html` of their own. Redirecting a real, indexed old
URL onto a 404 is worse than leaving it alone, so the map cannot ship as
documented.

Interim target: **`/#services`**. The home page carries
`<section class="section" id="services">`, the block that links to all six
service pages, so it is the only page today whose content is a superset of what
the old services page held. The fragment is a courtesy to the human — Google
ignores it and consolidates on `/` — but it puts a returning visitor on the
service list rather than at the top of the hero.

| Old URL | Interim target | Replace with, once built |
|---|---|---|
| `/services-1/` | `/#services` | `/services/` |
| *(none — see below)* | — | `/zones/` |

When a `/services/` hub is built, this is a one-line change in `vercel.json`
(two lines — the slashed and unslashed sources) and this section comes out.

No old URL points at `/zones/`. The old site names no commune anywhere, so the
missing zones hub is not a migration problem; it is an internal-linking one, and
it belongs to whoever owns `routes.ts`, not to this document.

## Where the redirects live

`vercel.json`, at the repo root. Not a Cloudflare Pages `_redirects` file — the
deploy target is **Vercel** (see `STATUS.md`, phase 2c: the production deploy is
Ready there). Nothing in this repo has ever been configured for Cloudflare —
the reference dates from the initial import and nothing in the repo backs it.

Not `next.config.mjs` either, and this is the load-bearing reason: `redirects()`
in the Next config is applied by the Next.js **server**. This build is
`output: 'export'` — 194 HTML files and no server — and Next explicitly does not
apply redirects, rewrites or headers in a static export. A static export has no
place to put a 301 except the host. That makes redirects a hosting concern here,
and `vercel.json` the version-controlled way to express one.

`vercel.json` holds redirects and nothing else. In particular it does **not**
set `trailingSlash` — `next.config.mjs` already owns that, and the build output
carries it.

## 301, not 308

Vercel offers `"permanent": true` (which emits **308**) and
`"statusCode": 301`. This file uses `301` on every rule. The reasoning, since
the two are equivalent to Google and the difference is easy to wave away:

- **308 preserves the request method and body. There is nothing here to
  preserve.** Every URL in the map is a GET-only content page on a site being
  retired. The one thing 308 buys over 301 is not applicable.
- **301 is what the rest of the migration toolchain speaks.** Search Console,
  Screaming Frog and similar crawlers, link checkers, and whoever audits this
  site after handover all report on "301s". Older bots and link tools still
  handle 308 unevenly. `ROADMAP.md` Phase 6's own Done criterion is worded
  "old URLs redirect with 301", and so is the `curl` check below.
- The classic cost of 301 — an old client downgrading a POST to a GET — cannot
  bite: nothing POSTs to `/contact/` on a site that no longer exists.

So: maximum compatibility, zero downside. If a future rule ever needs to survive
a POST, that rule uses `"permanent": true` and says why.

## Trailing slashes

`next.config.mjs` sets `trailingSlash: true`, so every canonical URL on the new
site ends in `/` (`/devis/`, not `/devis`). Every redirect **destination** in
`vercel.json` matches that, so a redirect never lands on a URL that then has to
redirect again to gain its slash.

Every redirect **source** is listed twice, `/contact` and `/contact/`. That is
not sloppiness. Vercel's redirects are evaluated before Next's own
trailing-slash normalisation, so an old link to `/contact` without the slash
would otherwise take two hops — normalise to `/contact/`, then redirect to
`/devis/`. Old links are copied by hand, from flyers and e-mail signatures, and
arrive in both shapes. Two lines each is cheaper than a chain, and each line is
one `curl` to verify.

## Apex vs www

**`www.glvitrclean.com` wins.** That is not a preference; it is declared in code:
`DEFAULT_SITE_URL` in `src/data/company.ts` is `https://www.glvitrclean.com`,
and every canonical, every `hreflang`, `sitemap.xml` and `robots.txt` is built
from it. Serving the site on the apex as well would put two hosts in the index
for the same 194 pages.

So `glvitrclean.com` → `https://www.glvitrclean.com` must exist at cutover,
permanently, for **every** path. The first rule in `vercel.json` does it, keyed
on a `has` host condition. Three things about it:

- **The host value is an anchored, dot-escaped regex — `^glvitrclean\.com$` —
  and that is load-bearing.** `has` values are matched as regular expressions.
  Written bare, `glvitrclean.com` would lean on the platform to anchor it: if it
  ever matched as a substring, the rule would match `www.glvitrclean.com` too
  and redirect www to itself, on every path, forever — the entire site down.
  Anchoring it here removes the dependency instead of betting on it, and the
  escaped dot stops `.` from matching any character. Either way the rule fires
  on the apex and cannot fire on www. The `curl` on www below is still the
  check for it, and it is the first one to run after the first deploy.
- **It has to be recreated at cutover, not assumed to survive it.** The old
  IONOS setup has its own apex/www arrangement, and that arrangement dies with
  the DNS change. Both hosts must be attached to the Vercel project — the apex
  as well as www, or the rule has no traffic to act on and a visitor typing the
  bare domain gets nothing.
- Vercel's dashboard can also redirect a domain at the project level. If someone
  sets that too, it fires first and the rule in `vercel.json` is inert. Harmless
  — but the two must not disagree. If the canonical host is ever changed, it
  changes in four places: `company.ts`, `vercel.json`, the dashboard, and
  `NEXT_PUBLIC_SITE_URL` if the Vercel project sets it. That variable is not
  decoration: `resolveSiteUrl()` in `company.ts` prefers it over
  `DEFAULT_SITE_URL`, so a stale value there emits every canonical and every
  `hreflang` on the host this file redirects away from.

The path redirects use **relative** destinations (`/devis/`, not
`https://www.glvitrclean.com/devis/`), so they work unchanged on a preview
deployment and never drift from `SITE_URL`. The price: an old link to
`glvitrclean.com/contact/` takes two hops — apex → www, then `/contact/` →
`/devis/`. Both are 301s and Google consolidates through them. If the crawl
shows the old site was canonicalised on the **apex** — i.e. essentially all
legacy equity arrives there — switch those three destinations to absolute
`https://www.glvitrclean.com/...` to collapse it to one hop, and accept the
hard-coded host.

## Language: no `/en` redirects

None are needed, and none are in `vercel.json`.

Every old URL in the map is French — `/avantages/`, `/contact/` — and no `/en`
tree has ever been observed on the old site. Be precise about how strong that
evidence is: **it is not a crawl finding.** The only inspection on record is
phase 2g in `STATUS.md`, which opened one page to take the logo. What we have is
three French slugs, a French local business, and no sighting of an English
version. That is enough to ship a French-only redirect map; it is not enough to
call the question closed. If the crawl turns up an English tree, each of those
URLs gets a line pointing at its `/en` counterpart.

The direction of the rule matters more than the count: an old French URL lands
on the **French** page, on the bare path, never on `/en`. The English mirror is
the secondary edition (`CLAUDE.md` rule 0, and the 0.8× sitemap priority that
enforces it). Redirecting inherited French equity into `/en` would point it at
the page that is deliberately built not to compete.

## Cutover sequence

1. Build and deploy to a preview URL. Verify all 97 routes, in both editions
   — 194 pages.
2. Crawl the old site, finalise the redirect map. See "Is this inventory
   complete?" above — this step is not a formality.
3. Export any content worth keeping (photos, phone number, existing copy).
4. Redirects are already configured in `vercel.json`; confirm the deploy that is
   about to serve the domain contains it.
5. Attach both `glvitrclean.com` and `www.glvitrclean.com` to the Vercel
   project, with www as the production domain.
6. Turn off Vercel Deployment Protection, or hold a protection-bypass token.
   While it is on, every URL 302s to SSO and **no redirect below can be
   verified** — `curl -I` shows the SSO hop, not ours. This is live today
   (`STATUS.md`, "Deployed").
7. Lower DNS TTL to 300s, 24h ahead.
8. Point DNS at the new host.
9. Verify HTTPS, verify redirects with `curl -I` — the block below.
10. Claim or verify Search Console for `glvitrclean.com`. Both hosts are
    separate properties; claim www and keep the apex.
11. Submit `sitemap.xml`.
12. Ping IndexNow.
13. Restore DNS TTL.

## Verifying the redirects

One line per rule. Check the status code *and* the `location` header; a 200 here
means the rule did not fire.

```sh
for u in /services-1 /services-1/ /avantages /avantages/ /contact /contact/; do
  curl -sI "https://www.glvitrclean.com$u" | head -1
  curl -sI "https://www.glvitrclean.com$u" | grep -i '^location:'
done

# apex → www, exactly one hop, on any path
curl -sI https://glvitrclean.com/credit-impot/ | grep -iE '^(HTTP|location:)'

# and www itself must NOT redirect — a loop here is the failure mode
# of the host rule, and it would take the whole site down
curl -sI https://www.glvitrclean.com/ | head -1        # expect 200

# unknown old URL: 404, not a redirect to /
curl -sI https://www.glvitrclean.com/une-page-qui-nexiste-pas/ | head -1

# query strings survive, and the fragment on /services-1/ does not eat them
curl -sI 'https://www.glvitrclean.com/contact/?utm_source=flyer' | grep -i '^location:'
curl -sI 'https://www.glvitrclean.com/services-1/?utm_source=flyer' | grep -i '^location:'
```

That last line is the one unproven detail in this file: the `/services-1/`
destination carries a fragment, and Vercel appends any forwarded query string to
the destination. If it appends after the `#`, the anchor swallows the query.
Nothing breaks — the visitor still lands on the home page — but if the header
comes back malformed, drop `#services` from the two `/services-1` rules and send
them to `/`. It is a two-character edit and it is not worth a hop of its own.

## Rollback

Keep the IONOS site paid and intact for 30 days after cutover. If the new build
regresses, DNS reverts in one change.

## What to watch after cutover

| Week | Expect |
|---|---|
| 1 | Old URLs redirecting, new sitemap accepted, first pages crawled |
| 2–4 | Indexing count climbing toward 194 (97 routes × 2 editions). If it stalls below 30, check metadata uniqueness first, not backlinks. |
| 4–8 | First impressions on `[service] [commune]` queries |
| 8–12 | Map pack appearance, if GBP verification completed |

Record the baseline before cutover: current indexed page count, current
impressions, current position for `glvitr clean`. Without a baseline there is
nothing to report to the client at handover.
