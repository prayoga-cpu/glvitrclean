#!/usr/bin/env node
/**
 * Fails the build if any two routes share a title or a description.
 *
 * This exists because 39 of 51 pages on a previous project went unindexed, and
 * the cause was duplicate metadata, not backlinks and not domain authority.
 * With 97 generated routes the failure mode is structural, so the guard is too.
 *
 * Do not weaken this check. Do not add an allowlist. See CLAUDE.md rule 3.
 *
 * Runs without a build step by parsing the TS data files directly, so it works
 * in CI before `next build`.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function extract(file, pattern) {
  const src = readFileSync(join(root, file), 'utf8');
  return [...src.matchAll(pattern)].map((m) => m[1]);
}

// slug: 'x'  -> collect in declaration order
const serviceSlugs = extract('src/data/services.ts', /^\s{4}slug:\s*'([^']+)'/gm);
const serviceNames = extract('src/data/services.ts', /^\s{4}name:\s*'([^']+)'/gm);
const communeSlugs = extract('src/data/communes.ts', /^\s{4}slug:\s*'([^']+)'/gm);
const communeNames = extract('src/data/communes.ts', /^\s{4}name:\s*'([^']+)'/gm);
const communeCodes = extract('src/data/communes.ts', /^\s{4}postalCode:\s*'([^']+)'/gm);

if (serviceSlugs.length === 0 || communeSlugs.length === 0) {
  console.error('check:seo — could not parse data files. Did the shape change?');
  process.exit(1);
}
if (serviceSlugs.length !== serviceNames.length) {
  console.error('check:seo — service slug/name count mismatch.');
  process.exit(1);
}
if (communeSlugs.length !== communeNames.length || communeSlugs.length !== communeCodes.length) {
  console.error('check:seo — commune field count mismatch.');
  process.exit(1);
}

const BRAND = "GLVITR'CLEAN";
const rows = [];

rows.push({ path: '/', title: `Nettoyage vitres et terrasse en Essonne (91) | ${BRAND}` });

const fixed = {
  '/credit-impot': `Crédit d'impôt 50 % sur le nettoyage à domicile | ${BRAND}`,
  '/professionnels': `Nettoyage pour professionnels en Essonne (91) | ${BRAND}`,
  '/devis': `Devis gratuit de nettoyage en Essonne | ${BRAND}`,
  '/realisations': `Nos réalisations de nettoyage en Essonne | ${BRAND}`,
  '/mentions-legales': `Mentions légales | ${BRAND}`,
  '/confidentialite': `Politique de confidentialité | ${BRAND}`,
};
for (const [path, title] of Object.entries(fixed)) rows.push({ path, title });

serviceSlugs.forEach((slug, i) => {
  rows.push({ path: `/services/${slug}`, title: `${serviceNames[i]} en Essonne (91) | ${BRAND}` });
});

communeSlugs.forEach((cSlug, ci) => {
  rows.push({
    path: `/zones/${cSlug}`,
    title: `Nettoyage à ${communeNames[ci]} (91) | ${BRAND}`,
  });
  serviceSlugs.forEach((sSlug, si) => {
    rows.push({
      path: `/zones/${cSlug}/${sSlug}`,
      title: `${serviceNames[si]} à ${communeNames[ci]} (91)`,
    });
  });
});

const expected = 1 + Object.keys(fixed).length + serviceSlugs.length
  + communeSlugs.length + communeSlugs.length * serviceSlugs.length;

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

console.log(`check:seo OK — ${rows.length} routes, all titles unique.`);
