#!/usr/bin/env node
/**
 * Proof-point guard. Run AFTER `next build`.
 *
 * Reviews and before/after photographs are the two strongest trust elements a
 * cleaning site has, and they are the two easiest places to cause real harm. The
 * machinery for both shipped in ROADMAP phase 8f while the content does not yet
 * exist: `src/data/reviews.ts` and `src/data/realisations.ts` are empty arrays,
 * and every component and schema node reading them stays dormant.
 *
 * Dormant is a state this repository has to be able to TRUST, not hope for. An
 * invented review is an `avis trompeur` under the Code de la consommation with
 * its own penalty regime since 2022 — the same class of exposure as the unbacked
 * 50% claim that `check:compliance` exists to prevent. A stock photograph
 * presented as the client's own work is a CLAUDE.md rule 4 violation that no
 * other check can see.
 *
 * So this guard enforces three things:
 *
 *   1. If the arrays are empty, the export must carry NO `aggregateRating`, no
 *      `Review` node, and no gallery markup. Scaffolding that leaks an empty
 *      rating emits a claim of zero stars from zero reviews.
 *   2. If they are NOT empty, every entry must be structurally complete — a
 *      rating in range, an ISO date, a non-empty author and body, a source URL
 *      unless it is a paper review — and no obvious placeholder may have been
 *      left behind.
 *   3. No before/after image may point into `public/assets/placeholder/`. Those
 *      seven files are stock and are marked as such on screen; moving one into a
 *      realisation would present stock as the client's work.
 *
 * Do not relax a rule here to make a build pass. Fix the data.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'out');

let failed = false;
const fail = (msg) => {
  console.error(`check:proof — ${msg}`);
  failed = true;
};

/* ---------------------------------------------------------------- parse data
 * Read the two data files as text rather than importing them: this script has
 * to run in plain node, before and without a TypeScript build step, exactly the
 * way check-metadata-unique.mjs parses services.ts.
 */

const reviewsSrc = readFileSync(join(root, 'src/data/reviews.ts'), 'utf8');
const realisationsSrc = readFileSync(join(root, 'src/data/realisations.ts'), 'utf8');

/**
 * Body of `export const <name>: <Type>[] = [ ... ];`, or null if not found.
 *
 * The `=` has to be located before the opening bracket is looked for. The
 * annotation is `: Review[]`, so scanning for the first `[` after the
 * declaration name lands on the TYPE's brackets, reads `Review[` as depth 1 and
 * `]` as the close, and returns an empty body — which made this guard report
 * every array as dormant and pass unconditionally. Caught by deliberately
 * feeding it bad data; a check that has only ever been seen to pass has not been
 * tested.
 */
function arrayBody(src, name) {
  const decl = new RegExp(`export const ${name}\\s*:[^=]*=\\s*\\[`);
  const m = src.match(decl);
  if (!m || m.index === undefined) return null;
  // The opening bracket of the literal is the last character the match consumed.
  const open = m.index + m[0].length - 1;
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') {
      depth--;
      if (depth === 0) return src.slice(open + 1, i);
    }
  }
  return null;
}

const reviewsBody = arrayBody(reviewsSrc, 'reviews');
const realisationsBody = arrayBody(realisationsSrc, 'realisations');

if (reviewsBody === null) fail('could not find `export const reviews` in src/data/reviews.ts.');
if (realisationsBody === null) {
  fail('could not find `export const realisations` in src/data/realisations.ts.');
}
if (failed) process.exit(1);

const reviewsEmpty = reviewsBody.trim() === '';
const realisationsEmpty = realisationsBody.trim() === '';

/* ------------------------------------------------------- 2. data invariants */

if (!reviewsEmpty) {
  // Split on top-level `{ ... }` entries.
  const entries = [...reviewsBody.matchAll(/\{[^{}]*\}/g)].map((m) => m[0]);
  if (entries.length === 0) {
    fail('reviews array is non-empty but no entries could be parsed.');
  }

  entries.forEach((e, i) => {
    const at = `reviews[${i}]`;
    const author = e.match(/author:\s*['"]([^'"]*)['"]/);
    const rating = e.match(/rating:\s*(\d+)/);
    const date = e.match(/datePublished:\s*['"]([^'"]*)['"]/);
    const body = e.match(/body:\s*['"]([^'"]*)['"]/);
    const source = e.match(/source:\s*['"]([^'"]*)['"]/);
    const hasUrl = /sourceUrl:\s*['"]\S/.test(e);

    if (!author || author[1].trim() === '') fail(`${at} has no author.`);
    if (!rating || Number(rating[1]) < 1 || Number(rating[1]) > 5) {
      fail(`${at} rating must be 1-5.`);
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date[1])) {
      fail(`${at} datePublished must be ISO YYYY-MM-DD.`);
    }
    if (!body || body[1].trim() === '') fail(`${at} has no body.`);
    if (!source) fail(`${at} has no source.`);

    // A review nobody can check is weak evidence; a paper one is the only
    // legitimate reason to have no URL. See the header of reviews.ts.
    if (!hasUrl && source && source[1] !== 'paper') {
      fail(`${at} is a '${source[1]}' review with no sourceUrl — only 'paper' may omit it.`);
    }

    // Placeholder detection. Not exhaustive and not meant to be: it catches the
    // realistic accident, which is test data left in after a check like the one
    // that proved this scaffolding works.
    const text = `${author ? author[1] : ''} ${body ? body[1] : ''}`;
    const placeholder = /\b(TEST|TODO|FIXME|LOREM|IPSUM|XXX|EXAMPLE|PLACEHOLDER|JOHN DOE|JANE DOE)\b/i;
    if (placeholder.test(text)) {
      fail(`${at} looks like placeholder data ("${(author ? author[1] : '').trim()}"). Rule 4.`);
    }
    if (/example\.(com|org|invalid|net)/i.test(e)) {
      fail(`${at} sourceUrl points at an example domain.`);
    }
  });
}

if (!realisationsEmpty) {
  const srcs = [...realisationsBody.matchAll(/src:\s*['"]([^'"]*)['"]/g)].map((m) => m[1]);
  if (srcs.length === 0) fail('realisations array is non-empty but carries no image src.');

  for (const src of srcs) {
    // The hard one. These seven files are stock, marked as such on screen, and
    // may never be presented as the client's work. CLAUDE.md rule 4.
    if (src.includes('/assets/placeholder/')) {
      fail(`realisation image "${src}" is a placeholder. Stock may never be shown as real work.`);
    }
    const file = join(root, 'public', src.replace(/^\//, ''));
    if (!existsSync(file)) fail(`realisation image "${src}" does not exist in public/.`);
  }

  // Every pair needs both halves and a description in both editions.
  const entries = [...realisationsBody.matchAll(/\{[\s\S]*?\n  \}/g)].map((m) => m[0]);
  entries.forEach((e, i) => {
    const at = `realisations[${i}]`;
    if (!/before:\s*\{/.test(e)) fail(`${at} has no before image.`);
    if (!/after:\s*\{/.test(e)) fail(`${at} has no after image.`);
    if (!/\bfr:\s*['"]\S/.test(e) || !/\ben:\s*['"]\S/.test(e)) {
      fail(`${at} needs an alt description in BOTH editions.`);
    }
  });
}

/* ------------------------------------------- 1 & 3. cross-check the export */

if (!existsSync(out)) {
  console.error('check:proof — ./out not found. Run `npm run build` first.');
  process.exit(1);
}

// Representative routes: the two that render each component, in both editions.
const SAMPLES = ['', 'en', 'zones/linas', 'en/zones/linas', 'realisations', 'services/vitres'];

let ratingSeen = 0;
let reviewNodeSeen = 0;
let reviewMarkupSeen = 0;
let gallerySeen = 0;
let checked = 0;

for (const route of SAMPLES) {
  const file = join(out, route, 'index.html');
  if (!existsSync(file)) continue;
  checked++;
  // Strip <script> so the RSC flight payload is not mistaken for rendered
  // markup — it repeats every className verbatim.
  const html = readFileSync(file, 'utf8');
  const scripts = html.match(/<script[\s\S]*?<\/script>/g) ?? [];
  const markup = scripts.reduce((acc, s) => acc.replace(s, ''), html);

  if (/"aggregateRating"/.test(html)) ratingSeen++;
  if (/"@type":"Review"/.test(html)) reviewNodeSeen++;
  if (/class="reviews[ "]/.test(markup)) reviewMarkupSeen++;
  if (/class="before-after[ "]/.test(markup)) gallerySeen++;
}

if (checked === 0) fail('no sample route found in ./out — is the export complete?');

if (reviewsEmpty && (ratingSeen || reviewNodeSeen || reviewMarkupSeen)) {
  fail(
    'reviews.ts is empty but the export carries review output ' +
      `(aggregateRating on ${ratingSeen}, Review nodes on ${reviewNodeSeen}, ` +
      `markup on ${reviewMarkupSeen}). An empty rating is a claim of zero stars.`,
  );
}
if (!reviewsEmpty && ratingSeen === 0) {
  fail('reviews.ts has entries but no aggregateRating reached the export.');
}
if (realisationsEmpty && gallerySeen) {
  fail(`realisations.ts is empty but gallery markup reached ${gallerySeen} page(s).`);
}

/* ------------------------------------------------------------------ verdict */

if (failed) {
  console.error(
    '\ncheck:proof FAILED. Read the headers of src/data/reviews.ts and ' +
      'src/data/realisations.ts. Fix the data, never the rule.',
  );
  process.exit(1);
}

const state = (empty, what) => (empty ? `${what} dormant (empty)` : `${what} populated and valid`);
console.log(
  `check:proof OK — ${state(reviewsEmpty, 'reviews')}, ` +
    `${state(realisationsEmpty, 'realisations')}; ${checked} sample routes cross-checked.`,
);
