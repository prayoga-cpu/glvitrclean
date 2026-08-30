#!/usr/bin/env node
/**
 * Post-build legal guard. Run AFTER `next build`.
 *
 * Greps the exported HTML for tax-credit claims on routes where the claim is
 * illegal, and for a live 50% claim while the SAP declaration number is still
 * unconfirmed.
 *
 * This is not a style check. Displaying an unbacked or inapplicable 50% claim
 * is a pratique commerciale trompeuse under Art. L121-2 of the Code de la
 * consommation. See docs/04-compliance-sap.md.
 *
 * Do not add routes to FORBIDDEN_ROUTES' allowlist. Fix the page instead.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'out');

if (!existsSync(out)) {
  console.error('check:compliance — ./out not found. Run `npm run build` first.');
  process.exit(1);
}

/** Routes where the tax credit must never be claimed. */
const FORBIDDEN_ROUTES = [
  'professionnels',
  'services/facade',
  'services/poubelles',
];

/** Plus every commune crossing of a non-eligible service. */
const communes = [...readFileSync(join(root, 'src/data/communes.ts'), 'utf8')
  .matchAll(/^\s{4}slug:\s*'([^']+)'/gm)].map((m) => m[1]);
for (const c of communes) {
  FORBIDDEN_ROUTES.push(`zones/${c}/facade`);
  FORBIDDEN_ROUTES.push(`zones/${c}/poubelles`);
}

/**
 * Phrases that assert the customer gets the credit. A negative statement
 * ("n'ouvre pas droit", "aucun crédit") is allowed and in fact required on the
 * facade page, so we match assertions, not the topic.
 */
const CLAIM_PATTERNS = [
  /vous b[ée]n[ée]ficiez/i,
  /b[ée]n[ée]ficiez d[eu]/i,
  /50\s?%\s*de\s*(cr[ée]dit|r[ée]duction)/i,
  /cr[ée]dit d['’]imp[ôo]t de 50/i,
  /avance imm[ée]diate/i,
  /urssaf/i,
  /apr[èe]s cr[ée]dit d['’]imp[ôo]t/i,
];

/** Strip script tags (RSC flight payload duplicates all page text) and head. */
function mainText(html) {
  const noScript = html.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  const m = noScript.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const region = m ? m[1] : noScript;
  return region.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
}

let failed = false;

for (const route of FORBIDDEN_ROUTES) {
  const file = join(out, route, 'index.html');
  if (!existsSync(file)) {
    console.error(`check:compliance — expected page missing: /${route}/`);
    failed = true;
    continue;
  }
  const text = mainText(readFileSync(file, 'utf8'));
  for (const pattern of CLAIM_PATTERNS) {
    const hit = text.match(pattern);
    if (hit) {
      console.error(
        `check:compliance — ILLEGAL CLAIM on /${route}/\n` +
          `  matched: ${pattern}\n` +
          `  context: ...${text.slice(Math.max(0, hit.index - 70), hit.index + 90)}...`,
      );
      failed = true;
    }
  }
}

/**
 * While company.sapDeclaration.number is null, no page anywhere may render the
 * live badge. Pending mode is the only allowed state.
 */
const companySrc = readFileSync(join(root, 'src/data/company.ts'), 'utf8');
const sapUnverified = /number:\s*null/.test(companySrc);

if (sapUnverified) {
  const eligible = ['services/vitres', 'services/terrasse', 'services/menage', 'services/volets-portes'];
  for (const route of eligible) {
    const file = join(out, route, 'index.html');
    if (!existsSync(file)) continue;
    const html = readFileSync(file, 'utf8');
    if (html.includes('data-state="live"')) {
      console.error(
        `check:compliance — LIVE BADGE on /${route}/ while sapDeclaration.number is null.`,
      );
      failed = true;
    }
  }
  console.log('check:compliance — SAP number unconfirmed, badge must stay in pending mode.');
}

if (failed) {
  console.error('\ncheck:compliance FAILED. Read docs/04-compliance-sap.md before changing anything.');
  process.exit(1);
}

console.log(
  `check:compliance OK — ${FORBIDDEN_ROUTES.length} routes clear of tax-credit claims.`,
);
