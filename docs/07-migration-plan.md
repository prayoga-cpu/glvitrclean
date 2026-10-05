# 07 — Domain move and migration plan

**Rewritten 2026-10-05.** The first version of this file (2026-08-31, revised
2026-09-06) planned to keep `glvitrclean.com`, preserve its history, and cut
its DNS over to Vercel. The client chose otherwise: on 2026-09-20 a new domain,
**`glvitr-clean.com`**, was registered and the site went live on it. The old
plan's mechanics — the 301 map, the trailing-slash rule, 301 over 308 — still
hold and are kept below. Its premise does not.

## What went wrong, so it is not repeated

The domain changed outside the repository. `glvitr-clean.com` was attached to
the Vercel project and the site went live on it, but nothing in the code was
told: `SITE_URL` still named `https://www.glvitrclean.com`, and so did a
`NEXT_PUBLIC_SITE_URL` variable on the Vercel project that `SITE_URL` preferred
over its own default. For two weeks every one of the 224 pages served from
`www.glvitr-clean.com` declared its canonical, its hreflang alternates, its
og:url and its og:image on the **old** host — where every one of those paths is
a 404 except `/`, which is the old WordPress home page. `robots.txt` named the
old host's sitemap, which the old host answers with a 301 to its *own*
`wp-sitemap.xml`. A crawler following the site's own instructions never reached
a single new page. That is what blocked indexing. Every guard passed
throughout, because none of them looked at the host.

Fixed 2026-10-05, in three layers:

1. `SITE_URL` in `src/data/company.ts` is the string literal
   `https://www.glvitr-clean.com`, and nothing reads the environment for it.
   The Vercel variable is inert (and should be deleted, STATUS.md).
2. `npm run check:host` (in `verify:full`) fails the build if any canonical,
   hreflang, og:url, og:image, sitemap entry or robots line — or any URL in any
   exported file — names a host other than `SITE_URL`'s, and checks
   `vercel.json` against the same origin.
3. This file, `CLAUDE.md` rule 3 and `STATUS.md` say where the site lives.
   **If the domain ever changes again, `SITE_URL` changes in the same commit
   that attaches the domain — not after.**

## The two domains

| | `glvitr-clean.com` — the site | `glvitrclean.com` — the old one |
|---|---|---|
| Role | canonical. `www` serves; the apex 308s to `www` (Vercel domain setting) | 301 source only — never canonical again |
| Registrar | Squarespace Domains, created 2026-09-20, **expires 2027-09-20** — keep auto-renew on | IONOS, created 2026-02-06, paid to 2028-02-06 |
| DNS | Squarespace | IONOS |
| Web | Vercel, project `glvitrclean` | IONOS "MyWebsite Now" (WordPress), still live — four pages, titled "Laveur de Vitres 91 & 94"; apex A `217.160.0.239`, `www` A `212.227.172.249` |
| Mail | Google Workspace (MX `aspmx.l.google.com`) | IONOS (MX `mx00/mx01.ionos.fr`) — `contact@glvitrclean.com` |

The old site's history is small — the domain is eight months old — so the
redirects are less about equity than about the two sites contradicting each
other: same name, same phone number, different service area (the old site
still says 91 and 94; the business is 91 and 77). Google and customers both
get a single answer only once the old host stops serving its own pages.

## Redirect map: old site → new site

The old site's `wp-sitemap.xml` lists exactly four URLs (read 2026-10-05):
the home page, `/services-1/`, `/avantages/` and `/contact/` — the same four
the 2026-09-06 map was built from, so that map was complete and survives with
new, absolute destinations.

| Old URL — either old host, with or without the slash | New | Code |
|---|---|---|
| `/` | `https://www.glvitr-clean.com/` (catch-all, path kept) | 301 |
| `/services-1/` | `https://www.glvitr-clean.com/services/` | 301 |
| `/avantages/` | `https://www.glvitr-clean.com/credit-impot/` | 301 |
| `/contact/` | `https://www.glvitr-clean.com/devis/` | 301 |
| anything else | the same path on `https://www.glvitr-clean.com` | 301 |
| any path on `glvitrclean.vercel.app` | the same path on `https://www.glvitr-clean.com` | 301 |

The last row is not the old site. `glvitrclean.vercel.app` is the project's
production alias on Vercel: it served the whole site publicly and indexably —
no SSO, no `X-Robots-Tag`, unlike every other `*.vercel.app` alias of the
project — and it was the homepage link of the GitHub repository. A second copy
of 224 pages is the duplicate-content problem the canonical tags only soften,
so it redirects like an old host.

Everything else on either old host goes to **the same path on the new host**,
where it is a 404 if the new site has no such page. That is deliberate: a
mass redirect of unknown URLs to the home page is the soft-404 pattern Google
names explicitly, and it hides what the crawl should surface. An old URL that
deserves a better landing earns its own line above.

Old French URLs land on the **French** page, never on `/en` — the English
mirror is deliberately built not to compete (`CLAUDE.md` rule 0).

## How `vercel.json` expresses it

`vercel.json` holds redirects and nothing else. Not `next.config.mjs`:
`redirects()` there is applied by the Next.js server, and a static export has
none, so a 301 can only live at the host.

Two kinds of rule, in this order — Vercel takes the first match, and runs
redirects before the filesystem:

1. **Known old paths, on any host, absolute destination.** One hop from the old
   host, one hop from the new one, and a harmless courtesy on preview
   deployments (they bounce to production). These may only use paths the new
   site does not serve — a rule on a real path would hide that page on the live
   site, and `check:host` fails the build if one does.
2. **Catch-all, old hosts only.** `has: [{ type: "host", value:
   "^(www\\.)?glvitrclean\\.com$" }]`, source `/:path*`, destination
   `https://www.glvitr-clean.com/:path*`. Path and query string are carried
   over.

Details that are load-bearing:

- **The host condition is an anchored, dot-escaped regular expression.** It
  matches exactly `glvitrclean.com` and `www.glvitrclean.com`. It cannot match
  `www.glvitr-clean.com` — and `check:host` proves that on every build, because
  a host condition matching the live host would redirect the whole site.
- **Each known path is listed twice, with and without its trailing slash.**
  Redirects run before the trailing-slash normalisation that
  `trailingSlash: true` gives the export, so a slash-less old link would
  otherwise take two hops. Destinations always carry the slash, so a redirect
  never lands on a URL that redirects again.
- **301, not 308.** Equivalent to Google; 301 is what Search Console,
  crawlers, link checkers and the Phase 6 "Done when" all speak, and 308's one
  advantage — preserving a POST — has nothing to preserve on GET-only content
  pages of a retired site.
- **No domain-level redirect for the old hosts in the Vercel dashboard.** It
  would fire before `vercel.json`, every old path would land on the same path
  of the new host, and the page-level map above would never run. Both old
  hosts are attached to the project as plain domains; `vercel.json` does the
  rest.

## The old domain: what has to happen (human, IONOS access)

1. **Never let it lapse.** It is paid at IONOS until 2028-02-06. At IONOS a
   domain is often bundled into a package, and cancelling the MyWebsite
   contract can delete the domain with it — move it to a standalone domain
   contract before cancelling anything. Keep it for as long as anyone might
   still type it or follow an old link: in practice for good. Renewal is cheap;
   a lapsed domain with this name and this phone number's history
   is an impersonation risk.
2. **IONOS → Domains & SSL → `glvitrclean.com` → DNS**, change exactly two
   records:
   {{DNS_RECORDS}}
   Leave MX, the SPF TXT record and anything else mail-related alone: they
   carry `contact@glvitrclean.com`. If IONOS refuses the `www` CNAME because an
   A or AAAA record exists for `www`, delete that record first; delete any AAAA
   record on `@` and `www` too.
3. Both old hosts are already attached to the Vercel project, so Vercel issues
   their certificates as soon as DNS resolves, usually within minutes. Do not
   add a domain-level redirect for them in the dashboard (see above).
4. Run the old-host block under "Verifying".
5. Search Console: verify `glvitrclean.com` as a domain property (TXT record
   at IONOS) and run **Change of Address** to `glvitr-clean.com`.
6. Only then cancel the IONOS **website** product. Not the domain, and not the
   mailbox until "Email" below is done.

## Email

`contact@glvitrclean.com` is an IONOS mailbox on the old domain, and it is
still what the site, the JSON-LD and the quote confirmation e-mails print. It
keeps working as long as the IONOS mail service and the domain do — moving the
web records does not touch it. The switch, in order:

1. Create `contact@glvitr-clean.com` in the Google Workspace that already
   receives the new domain's mail, and send it a test.
2. At IONOS, forward `contact@glvitrclean.com` to it, for at least 12 months.
3. Then change `company.email` in `src/data/company.ts` — one edit: the quote
   e-mails read it from there since 2026-10-05 — plus the contact line in
   `public/llms.txt`, the Google Business Profile and the directory listings.

Not before step 1: switching the site to a mailbox that does not exist would
trade a working address for a dead one. (Whether it exists could not be tested
from the build machine — outbound SMTP is blocked there.)

Separately, quote e-mails go out from `devis@prionation.io` because
`glvitr-clean.com` is not a verified Resend domain (checked 2026-10-05). Adding
it there and its DNS records at Squarespace, then setting `MAIL_FROM`, makes
them come from the client's own domain.

## Search engines

- **Google** reads the sitemap named in `robots.txt`, now correct, and the one
  submitted in Search Console. Its sitemap ping endpoint is retired; there is
  no API shortcut. Human steps: a **domain property** for `glvitr-clean.com`,
  verified by a DNS TXT record at Squarespace (two `google-site-verification`
  records already exist there, so check first whether a property is already
  verified), then submit `https://www.glvitr-clean.com/sitemap.xml`, and use URL
  Inspection → Request indexing on `/` and the service pages. Once the old
  domain 301s: verify `glvitrclean.com` too and run **Change of Address** from
  it to `glvitr-clean.com`.
- **IndexNow** (Bing, Yandex, Seznam, Naver and the rest of the protocol) is
  configured: the key is `public/<key>.txt`, and `npm run indexnow` submits
  every URL in the **live** sitemap after checking the live key file. Run it
  after any deploy that adds or changes pages. First run: 2026-10-05.

## Verifying

```sh
# the live site: canonical host, sitemap, robots
curl -s https://www.glvitr-clean.com/robots.txt            # Sitemap: https://www.glvitr-clean.com/sitemap.xml
curl -s https://www.glvitr-clean.com/ | grep -o '<link rel="canonical"[^>]*>'
curl -s https://www.glvitr-clean.com/sitemap.xml | grep -c 'glvitrclean.com'   # expect 0

# the apex and plain http both land on https://www.glvitr-clean.com in one hop
curl -sI https://glvitr-clean.com/devis/ | grep -iE '^(HTTP|location:)'
curl -sI http://www.glvitr-clean.com/devis/ | grep -iE '^(HTTP|location:)'

# unknown URL: a real 404, not a redirect to /
curl -sI https://www.glvitr-clean.com/une-page-qui-nexiste-pas/ | head -1

# the old hosts: one 301 to the new equivalent, never two
for h in glvitrclean.com www.glvitrclean.com; do
  for p in / /contact /contact/ /avantages/ /services-1/ /une-page-quelconque/; do
    curl -sI "https://$h$p" | grep -iE '^(HTTP|location:)'
  done
done
# Before the IONOS change the same rules can be exercised on Vercel directly:
#   curl -skI --resolve glvitrclean.com:443:76.76.21.21 https://glvitrclean.com/contact/

# the public Vercel alias is not a second copy of the site
curl -sI https://glvitrclean.vercel.app/devis/ | grep -iE '^(HTTP|location:)'
```

## What to watch after

| Week | Expect |
|---|---|
| 1 | Sitemap accepted in Search Console; first pages crawled on `glvitr-clean.com` |
| 2–4 | Indexed count climbing toward 224 (112 routes × 2 editions). If it stalls below 30, check metadata uniqueness first, not backlinks |
| 4–8 | First impressions on `[service] [commune]` queries |
| 8–12 | Map pack appearance, if the Google Business Profile is verified and points at the new domain |

## Baseline, 2026-10-05, just before the fix went live

- **Google:** not measurable from here — there is no Search Console property
  for either domain yet. Almost certainly zero pages of `glvitr-clean.com`
  indexed: every page named another host as its canonical. Take the real
  baseline from Search Console's Page indexing report once the property
  exists, and report progress against that.
- **Non-Google indexes** (a Bing-backed search tool, Exa): zero pages of either
  domain.
- **The site's own instructions:** 0 of 224 pages self-canonical. Following the
  live sitemap, 223 of its 224 URLs answered 404 — they were on the old host —
  and the 224th was the old WordPress home page.
