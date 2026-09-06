#!/usr/bin/env node
/**
 * Post-build legal guard. Run AFTER `next build`.
 *
 * Greps the exported HTML for tax-credit claims on routes where the claim is
 * illegal, and for a live 50% claim while the SAP declaration number is still
 * unconfirmed. Both language editions are checked: a claim is no less
 * misleading for being made in English on /en/professionnels/.
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

/**
 * Eligibility is declared once, on `taxCreditEligible` in services.ts
 * (CLAUDE.md rule 1). Derive both lists from it rather than restating them:
 * flipping a service in the data must move it between the two guards
 * automatically, or the guard silently stops covering it.
 */
const servicesSrc = readFileSync(join(root, 'src/data/services.ts'), 'utf8');
const SERVICE_ELIGIBILITY = new Map();
for (const m of servicesSrc.matchAll(/^\s{4}slug:\s*'([^']+)',/gm)) {
  const rest = servicesSrc.slice(m.index);
  const flag = rest.match(/taxCreditEligible:\s*(true|false)/);
  if (flag) SERVICE_ELIGIBILITY.set(m[1], flag[1] === 'true');
}
if (SERVICE_ELIGIBILITY.size === 0) {
  console.error('check:compliance — could not parse taxCreditEligible from services.ts.');
  process.exit(1);
}

const ineligibleSlugs = [...SERVICE_ELIGIBILITY].filter(([, e]) => !e).map(([s]) => s);
const eligibleSlugs = [...SERVICE_ELIGIBILITY].filter(([, e]) => e).map(([s]) => s);

/** Locale-free routes where the tax credit must never be claimed. */
const FORBIDDEN_BASE = [
  'professionnels',
  ...ineligibleSlugs.map((s) => `services/${s}`),
];

/** Plus every commune crossing of a non-eligible service. */
const communes = [...readFileSync(join(root, 'src/data/communes.ts'), 'utf8')
  .matchAll(/^\s{4}slug:\s*'([^']+)'/gm)].map((m) => m[1]);
for (const c of communes) {
  for (const s of ineligibleSlugs) FORBIDDEN_BASE.push(`zones/${c}/${s}`);
}

/** French lives at the bare path, English under /en. Both are checked. */
const FORBIDDEN_ROUTES = [
  ...FORBIDDEN_BASE,
  ...FORBIDDEN_BASE.map((r) => `en/${r}`),
];

/**
 * Phrases that assert the customer gets the credit. A negative statement
 * ("n'ouvre pas droit", "aucun crédit", "no tax credit applies") is allowed and
 * in fact required on the facade page, so we match assertions, not the topic.
 */
const CLAIM_PATTERNS = [
  // French
  /vous b[ée]n[ée]ficiez/i,
  /b[ée]n[ée]ficiez d[eu]/i,
  /50\s?%\s*de\s*(cr[ée]dit|r[ée]duction)/i,
  /cr[ée]dit d['’]imp[ôo]t de 50/i,
  /avance imm[ée]diate/i,
  /apr[èe]s cr[ée]dit d['’]imp[ôo]t/i,
  // English
  /\b50\s?%\s*(income\s+)?tax\s+credit/i,
  /tax\s+credit\s+of\s+50/i,
  /entitl(?:es|ed|ement)\b[^.]{0,60}\btax\s+credit/i,
  /you\s+(?:benefit|qualify)\b/i,
  /immediate\s+advance/i,
  /after\s+the\s+tax\s+credit/i,
  // Both
  /urssaf/i,
];

/**
 * React escapes apostrophes, so the exported HTML carries `cr&#x27;dit` rather
 * than `crédit d'impôt`. Without this decode the French patterns below match
 * nothing at all and the guard silently protects only the English edition —
 * i.e. only the non-commercial language. Decode BEFORE stripping tags.
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

/**
 * The visible region only. Rule 1 pins the guard to <main> on purpose: the one
 * permitted tax-credit reference is the global nav link to /credit-impot, and
 * that sits outside <main>.
 */
function mainRegion(html) {
  const noScript = html.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  const m = noScript.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : noScript;
}

function mainText(html) {
  return decodeEntities(mainRegion(html).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

/**
 * Split <main> into sentence-sized segments, so a denial cannot be credited to
 * a claim three paragraphs away. Block boundaries become hard breaks first,
 * then each block splits on sentence punctuation.
 */
function mainSegments(html) {
  const withBreaks = mainRegion(html).replace(
    /<\/(?:p|li|h[1-6]|dt|dd|td|tr|a|section|aside|div|button|figcaption)\s*>/gi,
    '\u0000',
  );
  return decodeEntities(withBreaks.replace(/<[^>]+>/g, ' '))
    .split('\u0000')
    .flatMap((block) => block.split(/(?<=[.!?])\s+/))
    .map((t) => t.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/**
 * Layer 2. CLAIM_PATTERNS above enumerate known assertions; this catches the
 * ones nobody thought to enumerate. Any segment that raises the topic at all
 * must carry a denial in the SAME segment, or it fails.
 */
const TOPIC = /cr[ée]dit d['’\u2019]?imp[ôo]t|tax\s+credit|services\s+[àa]\s+la\s+personne|\b50\s?%/i;
const DENIAL =
  /n['’\u2019]ouvre\s+pas|aucun|exclus?\b|exclut|exclue|ne\s+figure\s+pas|ne\s+s['’\u2019]applique\s+pas|sans\s+cr[ée]dit|se\s+trompe|vous\s+trompe|\bno\b|\bnot\b|\bexclud|\bneither\b|\bnever\b|mistaken|mislead/i;

let failed = false;
let checkedSegments = 0;

for (const route of FORBIDDEN_ROUTES) {
  const file = join(out, route, 'index.html');
  if (!existsSync(file)) {
    console.error(`check:compliance — expected page missing: /${route}/`);
    failed = true;
    continue;
  }
  const html = readFileSync(file, 'utf8');
  const text = mainText(html);

  // Layer 1 — enumerated assertions.
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

  // Layer 2 — topic raised without a denial beside it.
  const segments = mainSegments(html);
  checkedSegments += segments.length;
  for (const segment of segments) {
    if (segment.endsWith('?')) continue; // an FAQ question may name the topic
    if (!TOPIC.test(segment)) continue;
    if (DENIAL.test(segment)) continue;
    console.error(
      `check:compliance — UNDENIED TAX-CREDIT MENTION on /${route}/\n` +
        `  segment: ${segment}\n` +
        '  On a forbidden route the topic may only appear as an explicit denial.',
    );
    failed = true;
  }
}

/**
 * While company.sapDeclaration.number is null, no page anywhere may render the
 * live badge — in either language.
 */
const companySrc = readFileSync(join(root, 'src/data/company.ts'), 'utf8');
const sapUnverified = /number:\s*null/.test(companySrc);

if (sapUnverified) {
  const eligibleBase = eligibleSlugs.map((s) => `services/${s}`);
  const eligible = [...eligibleBase, ...eligibleBase.map((r) => `en/${r}`)];
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
  `check:compliance OK — ${FORBIDDEN_ROUTES.length} routes clear of tax-credit claims ` +
    `(${FORBIDDEN_BASE.length} French + ${FORBIDDEN_BASE.length} English).`,
);
