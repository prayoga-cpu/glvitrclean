#!/usr/bin/env node
/**
 * IndexNow submission. Run AFTER a production deploy has gone live — never
 * before, and never against ./out.
 *
 * IndexNow tells Bing, Yandex, Seznam, Naver and the other participating
 * engines that URLs exist or changed; one POST to api.indexnow.org is shared
 * between all of them. Bing's index is also what several answer engines read,
 * which is the reason it is worth one command here (robots.ts already welcomes
 * AI crawlers). Google does NOT take part: Google reads the sitemap named in
 * robots.txt, and a sitemap submitted in Search Console. Its old ping endpoint
 * is gone. See docs/07-migration-plan.md.
 *
 * The key is a file, not a secret. public/<key>.txt holds its own name, and an
 * engine fetches it from the live host to prove the submission came from
 * whoever controls the site. Exactly one such file may exist; this script
 * finds it rather than restating the key, so rotating it is a file rename.
 *
 * The URL list is the LIVE sitemap at SITE_URL, not ./out: submitting URLs the
 * live host does not serve yet would only teach the engines to distrust the
 * key. For the same reason the live key file is fetched and compared first.
 *
 *   npm run indexnow             submit every URL in the live sitemap
 *   npm run indexnow -- --dry-run  print what would be sent, send nothing
 */

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENDPOINT = 'https://api.indexnow.org/indexnow';
/** The protocol's per-request ceiling. */
const MAX_URLS = 10_000;
const dryRun = process.argv.includes('--dry-run');

function die(msg) {
  console.error(`indexnow — ${msg}`);
  process.exit(1);
}

/** fetch, with a network failure reported as one line instead of a trace. */
async function get(url, init) {
  try {
    return await fetch(url, init);
  } catch (error) {
    die(`could not reach ${url}: ${error.cause?.code ?? error.message}`);
  }
}

/* SITE_URL as text, the way scripts/check-host.mjs reads it. */
const companySrc = readFileSync(join(root, 'src/data/company.ts'), 'utf8');
const siteMatch = companySrc.match(/export const SITE_URL\s*=\s*'([^']+)';/);
if (!siteMatch) die('SITE_URL in src/data/company.ts is not a plain string literal.');
const SITE_URL = siteMatch[1];
const host = new URL(SITE_URL).host;

const keyFiles = readdirSync(join(root, 'public')).filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (keyFiles.length !== 1) die(`expected exactly one public/<32 hex>.txt key file, found ${keyFiles.length}.`);
const key = keyFiles[0].slice(0, -'.txt'.length);
if (readFileSync(join(root, 'public', keyFiles[0]), 'utf8').trim() !== key) {
  die(`public/${keyFiles[0]} must contain exactly its own name.`);
}
const keyLocation = `${SITE_URL}/${key}.txt`;

const liveKey = await get(keyLocation, { redirect: 'manual' });
if (liveKey.status !== 200 || (await liveKey.text()).trim() !== key) {
  die(`${keyLocation} does not serve the key (HTTP ${liveKey.status}). Deploy first.`);
}

const sitemap = await get(`${SITE_URL}/sitemap.xml`, { redirect: 'manual' });
if (sitemap.status !== 200) die(`${SITE_URL}/sitemap.xml answered HTTP ${sitemap.status}.`);
const urlList = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

if (urlList.length === 0) die('the live sitemap lists no URLs.');
const offHost = urlList.filter((u) => new URL(u).host !== host);
if (offHost.length > 0) {
  die(`${offHost.length} sitemap URL(s) are not on ${host}, e.g. ${offHost[0]} — fix the deploy, then retry.`);
}
if (urlList.length > MAX_URLS) die(`${urlList.length} URLs exceed the ${MAX_URLS}-per-request limit; batch them.`);

if (dryRun) {
  console.log(`indexnow — dry run: would submit ${urlList.length} URLs for ${host}, key at ${keyLocation}`);
  console.log(urlList.slice(0, 5).map((u) => `      ${u}`).join('\n') + (urlList.length > 5 ? '\n      …' : ''));
  process.exit(0);
}

const res = await get(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
});

/* 200: accepted. 202: received, key validation pending. Anything else is a
   refusal worth reading: 400 bad request, 403 key not valid, 422 URLs not on
   the host or key mismatch, 429 too many requests. */
if (res.status === 200 || res.status === 202) {
  console.log(`indexnow OK — HTTP ${res.status}, ${urlList.length} URLs submitted for ${host}.`);
} else {
  const body = (await res.text()).slice(0, 300);
  // A new key is checked asynchronously: the first POST answers 403
  // SiteVerificationNotCompleted while the engine fetches the key file. Not a
  // fault — the same command succeeds a few minutes later.
  if (res.status === 403 && body.includes('SiteVerificationNotCompleted')) {
    die(`the key is still being verified (first use of ${keyLocation}). Run this again in a few minutes.`);
  }
  die(`HTTP ${res.status} from ${ENDPOINT}: ${body}`);
}
