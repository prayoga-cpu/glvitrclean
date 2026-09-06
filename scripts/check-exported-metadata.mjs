#!/usr/bin/env node
/**
 * Post-build metadata guard. Run AFTER `next build`.
 *
 * CLAUDE.md rule 3 requires a unique title, a unique description and a single
 * unique H1 on every one of the 194 routes. `check:seo` only covers titles, and
 * it covers them by rebuilding the title templates from the TypeScript sources
 * with regexes — which means it can pass while the shipped HTML says something
 * else entirely. Descriptions and H1s had no guard at all.
 *
 * So this one reads the EXPORTED ARTIFACT in ./out instead of the sources. It
 * cannot drift from the templates, because it is not looking at the templates:
 * it is looking at the bytes a crawler will fetch. `check:seo` stays as the
 * pre-build fast fail; this is the one that tells the truth.
 *
 * French and English share ONE namespace, for the same reason check:seo pools
 * them: two editions may say the same thing in two languages, but an
 * untranslated template that leaves an English H1 byte-identical to its French
 * twin is the duplicate-content bug hreflang exists to prevent.
 *
 * Do not weaken this check. Do not add an allowlist. Shorten the template.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'out');

/** Google truncates the snippet around here. Longer is not an error to a
 *  crawler, but it is a lost sentence on the results page, and rule 3 treats
 *  the snippet as commercial surface, not decoration. */
const MAX_DESCRIPTION = 160;

if (!existsSync(out)) {
  console.error('check:metadata — ./out not found. Run `npm run build` first.');
  process.exit(1);
}

/**
 * The exported HTML is entity-escaped: React writes `l&#x27;Essonne`, not
 * `l'Essonne`. Two H1s that differ only in an apostrophe would compare equal
 * as raw bytes in one direction and unequal in the other, so every value is
 * decoded before it is compared or measured. Mirrors check-compliance.mjs.
 */
function decodeEntities(str) {
  return str
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&');
}

/** Tag soup to comparable text. `<br/>` and React's `<!-- -->` separators
 *  become spaces, or two headings that differ by a line break collapse into
 *  one string and a real duplicate hides behind it. */
function textOf(fragment) {
  return decodeEntities(
    fragment
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function headRegion(html) {
  const m = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  return m ? m[1] : html;
}

/** Scripts carry Next's serialized flight payload, which contains the page
 *  copy all over again. Strip them before looking for <main>. */
function mainRegion(html) {
  const noScript = html.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  const m = noScript.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : null;
}

/* --------------------------------------------------------------- walk out -- */

/** Every exported route is a directory holding an index.html. Nothing is
 *  pruned: a skipped directory is a page the guard would never see. */
function walk(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, found);
    else if (entry.name === 'index.html') found.push(full);
  }
  return found;
}

const files = walk(out).sort();

if (files.length === 0) {
  console.error('check:metadata — no index.html found under ./out. Did the export produce anything?');
  process.exit(1);
}

/* ------------------------------------------------------------- read pages -- */

const pages = [];
const skipped = [];
let failed = false;

function fail(msg) {
  console.error(`check:metadata — ${msg}`);
  failed = true;
}

for (const file of files) {
  const dir = relative(out, dirname(file));
  const route = dir === '' ? '/' : `/${dir.split(sep).join('/')}/`;
  const html = readFileSync(file, 'utf8');
  const head = headRegion(html);
  const main = mainRegion(html);

  /**
   * The 404 is exported as a route like any other but carries
   * `robots: noindex` and no metadata by design. A page that is never a search
   * result cannot duplicate one, so it is out of the namespace — but it is
   * named in the summary, so a real page that silently goes noindex is visible
   * rather than quietly dropped from the pool.
   */
  if (/<meta[^>]+name="robots"[^>]*content="[^"]*noindex/i.test(head)) {
    skipped.push(route);
    continue;
  }

  /* A missing <main> is its own failure, but it must not swallow the title and
     description checks below — one run should report the whole picture. */
  if (main === null) fail(`NO <main> on ${route} — the H1 cannot be located.`);

  const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = head.match(
    /<meta[^>]+name="description"[^>]*content="([^"]*)"|<meta[^>]+content="([^"]*)"[^>]*name="description"/i,
  );

  pages.push({
    route,
    title: titleMatch ? textOf(titleMatch[1]) : null,
    description: descMatch ? decodeEntities(descMatch[1] ?? descMatch[2]).replace(/\s+/g, ' ').trim() : null,
    hasMain: main !== null,
    h1s: main === null ? [] : [...main.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => textOf(m[1])),
  });
}

/* -------------------------------------------------------- per-page checks -- */

for (const page of pages) {
  if (page.title === null) {
    fail(`MISSING TITLE on ${page.route} — no <title>.`);
  } else if (page.title === '') {
    fail(`EMPTY TITLE on ${page.route}`);
  }

  if (page.description === null) {
    fail(`MISSING DESCRIPTION on ${page.route} — no <meta name="description">.`);
  } else if (page.description === '') {
    fail(`EMPTY DESCRIPTION on ${page.route}`);
  }

  // A page with no <main> was already reported; do not also claim its H1 is missing.
  if (page.hasMain && page.h1s.length === 0) {
    fail(`NO H1 on ${page.route} — every page needs exactly one.`);
  } else if (page.h1s.length > 1) {
    fail(
      `${page.h1s.length} H1s on ${page.route} — every page needs exactly one.\n` +
        page.h1s.map((h) => `      "${h}"`).join('\n'),
    );
  } else if (page.h1s[0] === '') {
    fail(`EMPTY H1 on ${page.route}`);
  }
}

/* ------------------------------------------------------- length reporting -- */

const tooLong = pages
  .filter((p) => p.description && p.description.length > MAX_DESCRIPTION)
  .sort((a, b) => b.description.length - a.description.length);

for (const page of tooLong) {
  fail(
    `DESCRIPTION ${page.description.length} chars (>${MAX_DESCRIPTION}) on ${page.route}\n` +
      `      "${page.description}"`,
  );
}

/* ---------------------------------------------------- uniqueness, one pool -- */

/** Reports every route sharing a value, not just the second one to appear:
 *  a template bug produces 26 collisions, and the lead needs to see the shape
 *  of the group to know which template it is. */
function checkUnique(label, valueOf) {
  const groups = new Map();
  for (const page of pages) {
    const value = valueOf(page);
    if (value === null || value === undefined || value === '') continue;
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(page.route);
  }
  for (const [value, routes] of groups) {
    if (routes.length < 2) continue;
    fail(
      `DUPLICATE ${label} on ${routes.length} routes\n` +
        `      "${value}"\n` +
        routes.map((r) => `      ${r}`).join('\n'),
    );
  }
}

checkUnique('TITLE', (p) => p.title);
checkUnique('DESCRIPTION', (p) => p.description);
checkUnique('H1', (p) => (p.h1s.length === 1 ? p.h1s[0] : null));

/* ------------------------------------------------------------------------- */

if (skipped.length > 0) {
  console.log(
    `check:metadata — ${skipped.length} noindex page(s) outside the namespace: ${skipped.join(', ')}`,
  );
}

if (failed) {
  console.error('\ncheck:metadata FAILED. Fix the templates in src/ — do not add an allowlist.');
  process.exit(1);
}

console.log(
  `check:metadata OK — ${pages.length} pages, titles/descriptions/H1s all unique, ` +
    `every description within ${MAX_DESCRIPTION} chars.`,
);
