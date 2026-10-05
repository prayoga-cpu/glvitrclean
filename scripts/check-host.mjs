#!/usr/bin/env node
/**
 * Post-build host guard. Run AFTER `next build`.
 *
 * From 2026-09-20 to 2026-10-05 the site was served from www.glvitr-clean.com
 * while every canonical, hreflang alternate, og:url, og:image, JSON-LD `@id`,
 * sitemap `<loc>` and the robots.txt `Sitemap:` line named the abandoned
 * www.glvitrclean.com — where those paths 404. Google was told, on every page,
 * that the real page lived elsewhere, and nothing got indexed. Every other
 * guard passed throughout: check:seo and check:metadata test that metadata is
 * unique and present, and none of them looked at the host. This one does.
 *
 * The expected origin is SITE_URL in src/data/company.ts, read as TEXT — the
 * way check-compliance.mjs reads services.ts — and it must be a string
 * literal. That is the second half of the fix: SITE_URL used to prefer a
 * NEXT_PUBLIC_SITE_URL variable set on the Vercel project, which the repo
 * cannot see, and that variable is what held the old domain. A literal is the
 * one value a reviewer, this script and the production build all agree on.
 *
 * What it checks, against ./out and vercel.json:
 *
 *   1. Every indexable page declares itself as canonical, absolute, on
 *      SITE_URL; og:url equals the canonical; fr / en / x-default hreflang
 *      alternates are all present and point at the right edition of the same
 *      page (CLAUDE.md rule 3); og:image and twitter:image are on SITE_URL
 *      and name a file the export actually contains.
 *   2. sitemap.xml lists exactly the canonical URLs of the indexable pages —
 *      no more, no fewer — and every alternate in it is on SITE_URL.
 *   3. robots.txt points its Sitemap line (and Host line) at SITE_URL.
 *   4. No text file anywhere in ./out — HTML, RSC payloads, JS chunks,
 *      llms.txt, the manifest — carries an absolute URL on a look-alike
 *      "glvitr" host other than SITE_URL's. That is the net under 1-3: it
 *      catches the old domain wherever it hides.
 *   5. vercel.json: no host condition may match SITE_URL's own host (it would
 *      redirect the whole live site, possibly to itself); no source may end in
 *      `:param*` (Vercel never matches it against `/` or a slash-terminated
 *      path, i.e. any page here); no rule that fires on every host may sit on
 *      a path the export serves (it would hide that page); every absolute
 *      destination is on SITE_URL; and every
 *      destination that names a page names one the export contains — a 301
 *      onto a 404 throws away exactly the equity the redirect exists to keep.
 *
 * Do not add an allowlist. Fix SITE_URL, the template or vercel.json.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep, extname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'out');

let failed = false;
/** A wrong host is wrong on every page at once — 3,000+ findings for the
 *  incident this guard exists for. Each kind of failure prints its first few
 *  examples and then a count, so the shape is readable in one screen. */
const SHOWN_PER_KIND = 8;
const seenPerKind = new Map();
function fail(kind, msg) {
  failed = true;
  const n = (seenPerKind.get(kind) ?? 0) + 1;
  seenPerKind.set(kind, n);
  if (n <= SHOWN_PER_KIND) console.error(`check:host — ${msg}`);
}

if (!existsSync(out)) {
  console.error('check:host — ./out not found. Run `npm run build` first.');
  process.exit(1);
}

/* --------------------------------------------------------- expected origin -- */

const companySrc = readFileSync(join(root, 'src/data/company.ts'), 'utf8');
const siteMatch = companySrc.match(/export const SITE_URL\s*=\s*'([^']+)';/);
if (!siteMatch) {
  console.error(
    'check:host — SITE_URL in src/data/company.ts is not a plain string literal.\n' +
      '      It must not be read from the environment: see the comment on it.',
  );
  process.exit(1);
}

const SITE_URL = siteMatch[1];
let siteHost;
try {
  const u = new URL(SITE_URL);
  siteHost = u.host;
  if (u.protocol !== 'https:' || u.pathname !== '/' || SITE_URL.endsWith('/')) {
    throw new Error('not a bare https origin');
  }
} catch {
  console.error(`check:host — SITE_URL "${SITE_URL}" must be a bare https origin with no trailing slash.`);
  process.exit(1);
}

/** Look-alike hosts: anything carrying the brand stem. The old domain, the
 *  apex, a typo'd variant — none of them may be named by the export. */
const BRAND_STEM = /glvitr/i;

/* ----------------------------------------------------------------- helpers -- */

/** `route` is the real path with its trailing slash: '/', '/devis/', '/en/'. */
function editionsOf(route) {
  const isEn = route === '/en/' || route.startsWith('/en/');
  const base = isEn ? route.slice(3) || '/' : route;
  const fr = base;
  const en = base === '/' ? '/en/' : `/en${base}`;
  return { fr: SITE_URL + fr, en: SITE_URL + en, 'x-default': SITE_URL + fr };
}

/** Every attribute of every `<tag ...>` of one kind, as plain objects. React
 *  writes `hrefLang`, not `hreflang`, so names are lower-cased on the way in. */
function tagsOf(html, tag) {
  const tags = [];
  for (const m of html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'gi'))) {
    const attrs = {};
    for (const a of m[0].matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)) {
      attrs[a[1].toLowerCase()] = a[2].replace(/&amp;/g, '&');
    }
    tags.push(attrs);
  }
  return tags;
}

function headRegion(html) {
  const m = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  return m ? m[1] : html;
}

/** Does a site-relative asset path exist in the export? */
function existsInOut(pathname) {
  const p = decodeURIComponent(pathname);
  const direct = join(out, p);
  if (existsSync(direct) && statSync(direct).isFile()) return true;
  const index = join(out, p, 'index.html');
  return existsSync(index);
}

function walk(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, found);
    else found.push(full);
  }
  return found;
}

const allFiles = walk(out).sort();
const pageFiles = allFiles.filter((f) => f.endsWith(`${sep}index.html`) || f === join(out, 'index.html'));

/* ------------------------------------------------------------ 1. the pages -- */

const canonicals = new Set();
let indexable = 0;

for (const file of pageFiles) {
  const dir = relative(out, dirname(file));
  const route = dir === '' ? '/' : `/${dir.split(sep).join('/')}/`;
  const head = headRegion(readFileSync(file, 'utf8'));
  const links = tagsOf(head, 'link');
  const metas = tagsOf(head, 'meta');

  // The 404 is noindex by design and declares no canonical of its own. It
  // still goes through the host scan in section 4 like every other file.
  const noindex = metas.some((m) => m.name === 'robots' && /noindex/i.test(m.content ?? ''));
  if (noindex) continue;
  indexable++;

  const expected = editionsOf(route);
  const self = route === '/en/' || route.startsWith('/en/') ? expected.en : expected.fr;

  const canonical = links.filter((l) => l.rel === 'canonical').map((l) => l.href);
  if (canonical.length !== 1) {
    fail('canonical', `${canonical.length} canonical links on ${route} — every indexable page needs exactly one.`);
  } else if (canonical[0] !== self) {
    fail('canonical', `CANONICAL on ${route}\n      is  ${canonical[0]}\n      not ${self}`);
  } else {
    canonicals.add(canonical[0]);
  }

  for (const lang of ['fr', 'en', 'x-default']) {
    const alt = links.filter((l) => l.rel === 'alternate' && l.hreflang === lang).map((l) => l.href);
    if (alt.length !== 1) {
      fail('hreflang', `${alt.length} hreflang="${lang}" alternates on ${route} — CLAUDE.md rule 3 needs exactly one.`);
    } else if (alt[0] !== expected[lang]) {
      fail('hreflang', `HREFLANG ${lang} on ${route}\n      is  ${alt[0]}\n      not ${expected[lang]}`);
    }
  }

  const ogUrl = metas.filter((m) => m.property === 'og:url').map((m) => m.content);
  if (ogUrl.length !== 1 || ogUrl[0] !== self) {
    fail('og:url', `og:url on ${route} is ${ogUrl.length ? ogUrl.join(', ') : 'missing'} — it must equal the canonical, ${self}`);
  }

  const images = [
    ...metas.filter((m) => m.property === 'og:image').map((m) => ['og:image', m.content]),
    ...metas.filter((m) => m.name === 'twitter:image').map((m) => ['twitter:image', m.content]),
  ];
  if (!images.some(([kind]) => kind === 'og:image')) fail('image', `NO og:image on ${route}`);
  for (const [kind, value] of images) {
    let u;
    try {
      u = new URL(value);
    } catch {
      fail('image', `${kind} on ${route} is not an absolute URL: ${value}`);
      continue;
    }
    if (u.host !== siteHost) fail('image', `${kind} on ${route} is on ${u.host}, not ${siteHost}: ${value}`);
    else if (!existsInOut(u.pathname)) fail('image', `${kind} on ${route} names a file the export does not contain: ${u.pathname}`);
  }
}

if (indexable === 0) fail('pages', 'no indexable page found under ./out. Did the export produce anything?');

/* ---------------------------------------------------------- 2. the sitemap -- */

const sitemapPath = join(out, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  fail('sitemap', 'out/sitemap.xml is missing.');
} else {
  const xml = readFileSync(sitemapPath, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const alternates = [...xml.matchAll(/<xhtml:link\b[^>]*href="([^"]+)"/g)].map((m) => m[1]);

  for (const href of [...locs, ...alternates]) {
    if (!href.startsWith(`${SITE_URL}/`)) fail('sitemap-host', `SITEMAP names a URL off ${siteHost}: ${href}`);
  }

  const locSet = new Set(locs);
  if (locSet.size !== locs.length) fail('sitemap', `SITEMAP lists ${locs.length - locSet.size} URL(s) twice.`);
  for (const loc of locSet) {
    if (!canonicals.has(loc)) fail('sitemap-vs-pages', `SITEMAP lists ${loc}, which no exported page declares as its canonical.`);
  }
  for (const c of canonicals) {
    if (!locSet.has(c)) fail('sitemap-vs-pages', `SITEMAP is missing ${c}, the canonical of an exported page.`);
  }
}

/* ----------------------------------------------------------- 3. robots.txt -- */

const robotsPath = join(out, 'robots.txt');
if (!existsSync(robotsPath)) {
  fail('robots', 'out/robots.txt is missing.');
} else {
  const robots = readFileSync(robotsPath, 'utf8');
  const sitemaps = [...robots.matchAll(/^Sitemap:\s*(\S+)/gim)].map((m) => m[1]);
  if (sitemaps.length !== 1 || sitemaps[0] !== `${SITE_URL}/sitemap.xml`) {
    fail('robots', `robots.txt Sitemap line(s): ${sitemaps.join(', ') || 'none'} — expected exactly ${SITE_URL}/sitemap.xml`);
  }
  for (const m of robots.matchAll(/^Host:\s*(\S+)/gim)) {
    if (m[1] !== SITE_URL && m[1] !== siteHost) fail('robots', `robots.txt Host line names ${m[1]}, not ${SITE_URL}`);
  }
}

/* ------------------------------------------- 4. look-alike hosts, anywhere -- */

const TEXT_EXT = new Set(['.html', '.txt', '.xml', '.json', '.webmanifest', '.js', '.css', '.svg', '.rsc']);
/** `https://host` and the JSON-escaped `https:\/\/host` the flight payload can carry. */
const ABSOLUTE_URL = /https?:(?:\\?\/){2}([a-z0-9.-]+)/gi;
let scanned = 0;

for (const file of allFiles) {
  if (!TEXT_EXT.has(extname(file).toLowerCase())) continue;
  scanned++;
  const text = readFileSync(file, 'utf8');
  const strays = new Map();
  for (const m of text.matchAll(ABSOLUTE_URL)) {
    const host = m[1].toLowerCase().replace(/\.$/, '');
    if (BRAND_STEM.test(host) && host !== siteHost) strays.set(host, (strays.get(host) ?? 0) + 1);
  }
  for (const [host, count] of strays) {
    fail('stray-host', `${count} URL(s) on ${host} in out/${relative(out, file).split(sep).join('/')} — only ${siteHost} may appear.`);
  }
}

/* ---------------------------------------------------------- 5. vercel.json -- */

const vercelPath = join(root, 'vercel.json');
let redirectCount = 0;
let fixedDestinations = 0;
if (existsSync(vercelPath)) {
  const vercel = JSON.parse(readFileSync(vercelPath, 'utf8'));
  for (const r of vercel.redirects ?? []) {
    redirectCount++;
    const label = `vercel.json redirect ${r.source}${r.has ? ' (host-conditioned)' : ''}`;

    for (const h of r.has ?? []) {
      if (h.type !== 'host' || typeof h.value !== 'string') continue;
      let re;
      try {
        // Vercel matches `has` values as regular expressions; anchor them the
        // way it does, so an unanchored pattern is judged as it will behave.
        re = new RegExp(`^(?:${h.value})$`, 'i');
      } catch {
        fail('vercel', `${label}: host condition "${h.value}" is not a valid regular expression.`);
        continue;
      }
      if (re.test(siteHost)) {
        fail('vercel', `${label}: host condition "${h.value}" matches ${siteHost} itself — it would redirect the live site.`);
      }
    }

    // Vercel compiles `source` strictly: a trailing `:param*` never matches `/`
    // or any path ending in `/` — and with `trailingSlash: true` that is every
    // page on this site. The first catch-alls were written that way and fired
    // only on /robots.txt and /sitemap.xml (measured 2026-10-05). Use `/(.*)`
    // with `$1` in the destination: verified to carry the root, both slash
    // forms, files, encoded paths and the query string.
    const source = String(r.source ?? '');
    if (/:[A-Za-z_]\w*\*\/?$/.test(source)) {
      fail('vercel', `${label}: a trailing ":param*" never matches "/" or a slash-terminated path on Vercel — use "/(.*)" and "$1".`);
    }

    // A rule with no host condition fires on the live host too, and Vercel runs
    // redirects before the filesystem: sitting on a path the export serves, it
    // would hide that page from every visitor — or, pointed at itself, loop.
    const hostConditioned = (r.has ?? []).some((h) => h.type === 'host');
    const literalSource = !/[:(*]/.test(source);
    if (!hostConditioned && literalSource && existsInOut(source)) {
      fail('vercel', `${label}: source ${source} is a page the export serves — the redirect would hide it on ${siteHost}.`);
    }

    const dest = String(r.destination ?? '');
    const absolute = /^https?:\/\//i.test(dest);
    let target;
    try {
      target = new URL(dest, SITE_URL);
    } catch {
      fail('vercel', `${label}: destination "${dest}" is not a valid URL or path.`);
      continue;
    }
    if (absolute && target.host !== siteHost) fail('vercel', `${label}: destination ${dest} is not on ${siteHost}.`);

    // A parameterised destination (`/:path`, `/$1`) passes the path through
    // and cannot be checked statically; a fixed one must land on a real page.
    const passThrough = /\/:|\$\d/.test(dest);
    if (!passThrough && !existsInOut(target.pathname)) {
      fail('vercel', `${label}: destination ${dest} is not a page in the export — a 301 onto a 404.`);
    } else if (!passThrough) {
      fixedDestinations++;
    }
  }
}

/* ------------------------------------------------------------------------- */

if (failed) {
  const counts = [...seenPerKind].map(([kind, n]) => `${kind} ${n}`).join(', ');
  console.error(`\ncheck:host FAILED (${counts}). Everything a crawler is told to trust must be on ${siteHost}.`);
  process.exit(1);
}

console.log(
  `check:host OK — ${indexable} pages self-canonical on ${siteHost} with fr/en/x-default alternates, ` +
    `sitemap and robots.txt agree, ${scanned} text files carry no stray brand host, ` +
    `${redirectCount} vercel.json redirects never fire on ${siteHost} and ` +
    `${fixedDestinations} fixed destinations are real pages.`,
);
