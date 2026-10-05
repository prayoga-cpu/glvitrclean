/**
 * Quote-form submission endpoint.
 *
 * This is a Vercel-native Edge Function — a plain top-level `/api` file,
 * Vercel's own convention, independent of Next.js routing. It is NOT a
 * Next.js Route Handler, server action, or middleware, and it does not touch
 * `output: 'export'` in next.config.mjs. CLAUDE.md rule 2 ("static export
 * only... no route handlers") is about the Next.js app itself, which stays a
 * 100% static export built and served exactly as before; this file only adds
 * a second, independent Vercel deployable next to it, because sending mail
 * through Resend needs a secret API key held somewhere with a server runtime,
 * and a static export has none. See the sibling implementation in
 * serrurier-paris (app/api/submit/route.ts) for the pattern this borrows the
 * validation and rate-limiting design from — that project dropped static
 * export entirely to get the same result; this one does not have to.
 */

import { SITE_URL } from '../src/data/company';
import { LANGS, type Lang } from '../src/i18n/config';
import { FIELD_KEYS, MAX_VALUE_LENGTH, isFieldKey, type SubmissionField } from '../src/lib/submission';
import {
  emailConfigured,
  isSendableEmail,
  sendCustomerConfirmation,
  sendTeamNotification,
} from './_lib/email';

export const config = { runtime: 'edge' };

const DOMAIN = new URL(SITE_URL).host;

const MAX_FIELDS = FIELD_KEYS.length;
const MAX_BODY_BYTES = 16_000;

/**
 * Same-origin enforcement, done in the handler itself (there is no
 * middleware.ts here — see the header comment above on what this file is).
 *
 * Deriving the allowed origin from the request's own Host header — rather
 * than pinning it to DOMAIN — is what keeps this from becoming a footgun: it
 * self-configures across localhost, Vercel preview URLs, the current
 * deployment host, and www.glvitr-clean.com in production. It is a floor,
 * not a cure — a determined attacker can forge the header — which is why the
 * confirmation email below never echoes attacker-chosen prose.
 */
function requestOrigin(request: Request): string | null {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!host) return null;
  const proto =
    request.headers.get('x-forwarded-proto') ??
    (/^(localhost|127\.0\.0\.1)(:|$)/.test(host) ? 'http' : 'https');
  return `${proto}://${host}`;
}

function allowedOrigins(request: Request): string[] {
  return [
    requestOrigin(request),
    `https://${DOMAIN}`,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null,
    ...(process.env.ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
  ].filter(Boolean) as string[];
}

function sameOrigin(request: Request): boolean {
  const allowed = allowedOrigins(request);
  const origin = request.headers.get('origin');
  if (origin) return allowed.includes(origin);

  // Some privacy tools strip Origin but keep Referer.
  const referer = request.headers.get('referer');
  if (referer) {
    try {
      return allowed.includes(new URL(referer).origin);
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Two-keyed throttle: per client IP, and per destination address so one
 * mailbox cannot be bombed from rotating IPs. Edge instances do not share
 * memory, so this thins a flood rather than stopping one — defence in depth
 * behind the origin check, not a substitute for it. Deliberately loose: set
 * too tight it drops real leads.
 */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 15;
const RECIPIENT_WINDOW_MS = 3_600_000;
const RECIPIENT_MAX = 3;
const MAX_TRACKED_KEYS = 5000;

const hits = new Map<string, number[]>();

function tooMany(key: string, windowMs: number, max: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_TRACKED_KEYS) {
    for (const [k, times] of hits) {
      const live = times.filter((t) => now - t < Math.max(windowMs, RECIPIENT_WINDOW_MS));
      if (live.length === 0) hits.delete(k);
      else hits.set(k, live);
    }
  }
  return recent.length > max;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
  }

  if (!sameOrigin(request)) {
    return Response.json({ ok: false, error: 'bad_origin' }, { status: 403 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (tooMany(`ip:${ip}`, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX)) {
    return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: 'too_large' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const payload = body as {
    lang?: string;
    fields?: unknown;
    page?: string;
    company_website?: string; // honeypot
  };

  // Honeypot: a hidden field no human ever fills. Answer 200 so a bot can't
  // tell it was caught and retry with the field cleared.
  if (payload.company_website) {
    return Response.json({ ok: true, skipped: 'honeypot' });
  }

  const lang = (LANGS as readonly string[]).includes(payload.lang as Lang)
    ? (payload.lang as Lang)
    : null;
  if (!lang || !Array.isArray(payload.fields)) {
    return Response.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  const fields: SubmissionField[] = [];
  for (const entry of payload.fields.slice(0, MAX_FIELDS)) {
    const { key, value } = (entry ?? {}) as { key?: unknown; value?: unknown };
    if (typeof key !== 'string' || typeof value !== 'string') continue;
    if (!isFieldKey(key)) continue;
    const trimmed = value.trim().slice(0, MAX_VALUE_LENGTH);
    if (trimmed) fields.push({ key, value: trimmed });
  }

  if (fields.length === 0) {
    return Response.json({ ok: false, error: 'empty' }, { status: 400 });
  }

  if (!emailConfigured()) {
    console.error('[submit] RESEND_API_KEY is not set; no mail sent');
    return Response.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const meta = {
    page: typeof payload.page === 'string' ? payload.page.slice(0, 200) : undefined,
    userAgent: request.headers.get('user-agent')?.slice(0, 200) ?? undefined,
    receivedAt: new Date().toISOString(),
  };

  const customerEmail = fields.find((f) => f.key === 'email')?.value;
  // The team notification goes to fixed recipients and is never throttled —
  // losing a real lead to a rate limit would be worse than the abuse. Only
  // the caller-addressed confirmation is capped per mailbox.
  const wantsConfirmation =
    isSendableEmail(customerEmail) &&
    !tooMany(`to:${customerEmail.toLowerCase()}`, RECIPIENT_WINDOW_MS, RECIPIENT_MAX);

  // Sequential, and the confirmation is GATED on the team send succeeding.
  // A lead with no confirmation is recoverable from the team inbox; a
  // confirmation with no lead reaching anyone is not.
  const team = await sendTeamNotification({ lang, fields, meta }).catch((error) => ({
    ok: false as const,
    error: String(error),
  }));
  const teamOk = team.ok;
  if (!teamOk) console.error('[submit] team notification failed:', team);

  let confirmationOk = false;
  if (teamOk && wantsConfirmation) {
    const confirmation = await sendCustomerConfirmation({ to: customerEmail, lang, fields }).catch(
      (error) => ({ ok: false as const, error: String(error) }),
    );
    confirmationOk = confirmation.ok;
    if (!confirmationOk) console.error('[submit] customer confirmation failed:', confirmation);
  }

  return Response.json(
    { ok: teamOk, notified: teamOk, confirmed: wantsConfirmation && confirmationOk },
    { status: teamOk ? 200 : 502 },
  );
}
