#!/usr/bin/env node
/**
 * Fails the build if any two routes share a title.
 *
 * This exists because 39 of 51 pages on a previous project went unindexed, and
 * the cause was duplicate metadata, not backlinks and not domain authority.
 * With 194 generated routes the failure mode is structural, so the guard is too.
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
const rows = [];

/* ---------------------------------------------------------------- French -- */

rows.push({ path: '/', title: `Nettoyage vitres et terrasse en Essonne (91) | ${BRAND}` });

const fixedFr = {
  '/credit-impot': `Crédit d'impôt 50 % sur le nettoyage à domicile | ${BRAND}`,
  '/professionnels': `Nettoyage pour professionnels en Essonne (91) | ${BRAND}`,
  '/devis': `Devis gratuit de nettoyage en Essonne | ${BRAND}`,
  '/realisations': `Nos réalisations de nettoyage en Essonne | ${BRAND}`,
  '/mentions-legales': `Mentions légales | ${BRAND}`,
  '/confidentialite': `Politique de confidentialité | ${BRAND}`,
};
for (const [path, title] of Object.entries(fixedFr)) rows.push({ path, title });

serviceSlugs.forEach((slug, i) => {
  rows.push({ path: `/services/${slug}`, title: `${serviceNames[i].fr} en Essonne (91) | ${BRAND}` });
});

communeSlugs.forEach((cSlug, ci) => {
  rows.push({
    path: `/zones/${cSlug}`,
    title: `Nettoyage à ${communeNames[ci]} (91) | ${BRAND}`,
  });
  serviceSlugs.forEach((sSlug, si) => {
    rows.push({
      path: `/zones/${cSlug}/${sSlug}`,
      title: `${serviceNames[si].fr} à ${communeNames[ci]} (91)`,
    });
  });
});

/* --------------------------------------------------------------- English -- */

rows.push({ path: '/en', title: `Window and terrace cleaning in the Essonne (91) | ${BRAND}` });

const fixedEn = {
  '/en/credit-impot': `50% tax credit on home cleaning in France | ${BRAND}`,
  '/en/professionnels': `Commercial cleaning in the Essonne (91) | ${BRAND}`,
  '/en/devis': `Free cleaning quote in the Essonne | ${BRAND}`,
  '/en/realisations': `Our cleaning work in the Essonne | ${BRAND}`,
  '/en/mentions-legales': `Legal notice | ${BRAND}`,
  '/en/confidentialite': `Privacy policy | ${BRAND}`,
};
for (const [path, title] of Object.entries(fixedEn)) rows.push({ path, title });

serviceSlugs.forEach((slug, i) => {
  rows.push({
    path: `/en/services/${slug}`,
    title: `${serviceNames[i].en} in the Essonne (91) | ${BRAND}`,
  });
});

communeSlugs.forEach((cSlug, ci) => {
  rows.push({
    path: `/en/zones/${cSlug}`,
    title: `Cleaning in ${communeNames[ci]} (91) | ${BRAND}`,
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

for (const r of rows) {
  if (r.title.length > 65) {
    console.warn(`check:seo — title ${r.title.length} chars (>65), may truncate: ${r.path}`);
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
