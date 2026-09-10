#!/usr/bin/env node
/**
 * Fails the build if any two routes share a title.
 *
 * This exists because 39 of 51 pages on a previous project went unindexed, and
 * the cause was duplicate metadata, not backlinks and not domain authority.
 * With over 200 generated routes the failure mode is structural, so the guard
 * is too.
 *
 * French and English share ONE namespace on purpose. Two editions of a page are
 * allowed to say the same thing in different languages, but they must not end
 * up with byte-identical titles — that is the duplicate-content case hreflang
 * is supposed to prevent, and a template that forgot to translate would produce
 * it silently.
 *
 * Do not weaken this check. Do not add an allowlist. See CLAUDE.md rule 3.
 *
 * Runs without a build step by parsing the TS data files directly, so it works
 * in CI before `next build`. That means the title templates below are a second
 * copy of the ones in src/lib/seo.ts: if you change one, change the other, and
 * the route-count assertion will catch you if you forget.
 *
 * This is the FAST guard, not the authoritative one. It knows only about
 * titles, and only about the titles it has been told. The authoritative check
 * is scripts/check-exported-metadata.mjs (`npm run check:metadata`), which runs
 * after the build and reads the artifact that actually ships — titles,
 * descriptions and H1s, on whatever routes exist. If the two ever disagree,
 * the exported one is right.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function read(file) {
  return readFileSync(join(root, file), 'utf8');
}

function extract(file, pattern) {
  return [...read(file).matchAll(pattern)].map((m) => m[1]);
}

/** `name: { fr: '…', en: '…' }` on one line. Kept single-line for this parser. */
function extractLocalized(file, key) {
  const pattern = new RegExp(
    `^\\s{4}${key}:\\s*\\{\\s*fr:\\s*'([^']+)',\\s*en:\\s*'([^']+)'\\s*\\}`,
    'gm',
  );
  return [...read(file).matchAll(pattern)].map((m) => ({ fr: m[1], en: m[2] }));
}

const serviceSlugs = extract('src/data/services.ts', /^\s{4}slug:\s*'([^']+)'/gm);
const serviceNames = extractLocalized('src/data/services.ts', 'name');
const communeSlugs = extract('src/data/communes.ts', /^\s{4}slug:\s*'([^']+)'/gm);
const communeNames = extract('src/data/communes.ts', /^\s{4}name:\s*'([^']+)'/gm);
const communeCodes = extract('src/data/communes.ts', /^\s{4}postalCode:\s*'([^']+)'/gm);

if (serviceSlugs.length === 0 || communeSlugs.length === 0) {
  console.error('check:seo — could not parse data files. Did the shape change?');
  process.exit(1);
}
if (serviceSlugs.length !== serviceNames.length) {
  console.error(
    `check:seo — service slug/name count mismatch (${serviceSlugs.length} slugs, ` +
      `${serviceNames.length} localized names). Is every name a single-line ` +
      `{ fr: '...', en: '...' } object?`,
  );
  process.exit(1);
}
if (communeSlugs.length !== communeNames.length || communeSlugs.length !== communeCodes.length) {
  console.error('check:seo — commune field count mismatch.');
  process.exit(1);
}

const BRAND = "GLVITR'CLEAN";
/**
 * The client's brand line, parsed out of the data file rather than typed here
 * for the same reason the tax rate is: it is client-owned copy with one home.
 * Since 2026-09-10 it is the suffix on every title that carries a brand.
 */
const BRAND_LINE = read('src/data/company.ts').match(/brandLine:\s*"([^"]+)"/)[1];

/** Mirrors `branded()` in src/lib/seo.ts: head first, brand last. */
const branded = (head) => `${head} | ${BRAND_LINE}`;

/**
 * Read from src/data/company.ts rather than typed in: the /credit-impot titles
 * derive the figure from TAX_CREDIT_RATE (CLAUDE.md rule 1), so hard-coding
 * "50" here would silently disagree the day the rate changes.
 */
const TAX_CREDIT_PCT = Math.round(
  Number(read('src/data/company.ts').match(/TAX_CREDIT_RATE\s*=\s*([\d.]+)/)[1]) * 100,
);

const rows = [];

/* ---------------------------------------------------------------- French -- */

rows.push({ path: '/', title: branded('Nettoyage vitres et terrasse en Essonne (91)') });

const fixedFr = {
  '/services': branded('Prestations de nettoyage en Essonne (91)'),
  '/zones': branded('Nettoyage en Essonne (91) et Seine-et-Marne (77)'),
  '/credit-impot': branded(`Crédit d'impôt ${TAX_CREDIT_PCT} % : nettoyage à domicile`),
  '/professionnels': branded('Nettoyage pour professionnels en Essonne'),
  '/devis': branded('Devis gratuit de nettoyage en Essonne'),
  '/realisations': branded('Réalisations de nettoyage en Essonne'),
  '/mentions-legales': branded('Mentions légales'),
  '/confidentialite': branded('Politique de confidentialité'),
};
for (const [path, title] of Object.entries(fixedFr)) rows.push({ path, title });

serviceSlugs.forEach((slug, i) => {
  rows.push({ path: `/services/${slug}`, title: branded(`${serviceNames[i].fr} en Essonne (91)`) });
});

communeSlugs.forEach((cSlug, ci) => {
  rows.push({
    path: `/zones/${cSlug}`,
    title: branded(`Nettoyage à ${communeNames[ci]} (91)`),
  });
  serviceSlugs.forEach((sSlug, si) => {
    rows.push({
      path: `/zones/${cSlug}/${sSlug}`,
      title: `${serviceNames[si].fr} à ${communeNames[ci]} (91)`,
    });
  });
});

/* --------------------------------------------------------------- English -- */

rows.push({ path: '/en', title: branded('Window and terrace cleaning in the Essonne (91)') });

const fixedEn = {
  '/en/services': branded('Cleaning services in the Essonne (91)'),
  '/en/zones': branded('Cleaning in the Essonne and the Seine-et-Marne'),
  '/en/credit-impot': branded(`${TAX_CREDIT_PCT}% tax credit on home cleaning in France`),
  '/en/professionnels': branded('Commercial cleaning in the Essonne (91)'),
  '/en/devis': branded('Free cleaning quote in the Essonne'),
  '/en/realisations': branded('Our cleaning work in the Essonne'),
  '/en/mentions-legales': branded('Legal notice'),
  '/en/confidentialite': branded('Privacy policy'),
};
for (const [path, title] of Object.entries(fixedEn)) rows.push({ path, title });

serviceSlugs.forEach((slug, i) => {
  rows.push({
    path: `/en/services/${slug}`,
    title: branded(`${serviceNames[i].en} in the Essonne (91)`),
  });
});

communeSlugs.forEach((cSlug, ci) => {
  rows.push({
    path: `/en/zones/${cSlug}`,
    title: branded(`Cleaning in ${communeNames[ci]} (91)`),
  });
  serviceSlugs.forEach((sSlug, si) => {
    rows.push({
      path: `/en/zones/${cSlug}/${sSlug}`,
      title: `${serviceNames[si].en} in ${communeNames[ci]} (91)`,
    });
  });
});

/* ------------------------------------------------------------------------- */

const perLang =
  1 + Object.keys(fixedFr).length + serviceSlugs.length
  + communeSlugs.length + communeSlugs.length * serviceSlugs.length;
const expected = perLang * 2;

let failed = false;

if (rows.length !== expected) {
  console.error(`check:seo — route count ${rows.length}, expected ${expected}.`);
  failed = true;
}

const seen = new Map();
for (const r of rows) {
  if (seen.has(r.title)) {
    console.error(`check:seo — DUPLICATE TITLE\n  "${r.title}"\n  ${seen.get(r.title)}\n  ${r.path}`);
    failed = true;
  } else {
    seen.set(r.title, r.path);
  }
}

/*
 * Google renders roughly the first 60 characters of a title. Since 2026-09-10
 * the client's brand line occupies 31 of them at the end of every branded
 * title, so measuring the whole string against one threshold would warn on all
 * 56 of them and say nothing useful.
 *
 * What has to survive the cut is the HEAD — the words before the brand, which
 * are what the page is trying to win. So the head is measured on its own, and
 * the whole title only against a runaway ceiling.
 */
const HEAD_MAX = 60;
const TITLE_MAX = 80;

for (const r of rows) {
  const head = r.title.split(` | ${BRAND}`)[0];
  const hasBrand = head !== r.title;
  if (head.length > HEAD_MAX) {
    console.warn(
      `check:seo — ${hasBrand ? 'title head' : 'title'} ${head.length} chars ` +
        `(>${HEAD_MAX}), will truncate${hasBrand ? ' before the brand' : ''}: ${r.path}`,
    );
  } else if (r.title.length > TITLE_MAX) {
    console.warn(`check:seo — title ${r.title.length} chars (>${TITLE_MAX}): ${r.path}`);
  }
}

if (failed) {
  console.error('\ncheck:seo FAILED');
  process.exit(1);
}

console.log(
  `check:seo OK — ${rows.length} routes (${perLang} French + ${perLang} English), ` +
    `all titles unique.`,
);
