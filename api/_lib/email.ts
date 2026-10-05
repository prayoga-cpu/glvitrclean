/**
 * Resend integration for the quote form. Lives under api/, not src/lib/,
 * because api/submit.ts is a Vercel Edge Function (see its header comment)
 * and this module holds the RESEND_API_KEY — it must never be reachable from
 * a src/ import path that a client component could pull into the browser
 * bundle.
 *
 * Copy for the two emails lives here rather than in src/i18n/dictionary.ts on
 * purpose: that dictionary ships to the browser, and there is no reason for
 * email HTML to travel to a visitor's device.
 */

import { SITE_URL, company } from '../../src/data/company';
import { services } from '../../src/data/services';
import { communes } from '../../src/data/communes';
import type { Lang } from '../../src/i18n/config';
import type { FieldKey, SubmissionField } from '../../src/lib/submission';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

const BRAND_NAME = "GLVITR'CLEAN";
/**
 * Read from company.ts, not restated. These used to be literals here, so the
 * address printed in the customer's confirmation could drift from the one on
 * the site — and it is about to change: contact@glvitrclean.com dies with the
 * old domain, and the switch to the glvitr-clean.com mailbox must be one edit.
 */
const CONTACT_EMAIL = company.email;
const PHONE_DISPLAY = company.phoneDisplay;
const PHONE_TEL = company.phone;

/**
 * The envelope sender. The client's domain, glvitr-clean.com, is not verified
 * in the shared Resend account — only prionation.io is (checked against the
 * Resend API on 2026-10-05). Getting it verified needs DNS records added at its
 * registrar, Squarespace, which is human-only work (CLAUDE.md rule 7). So mail
 * goes out with the client's brand as the display name over prionation.io,
 * exactly like serrurier-paris does for the same reason. Once glvitr-clean.com
 * is verified, set MAIL_FROM and nothing else changes.
 */
const MAIL_FROM = process.env.MAIL_FROM ?? `${BRAND_NAME} <devis@prionation.io>`;

/** Every submission is notified here. Comma-separated, overridable per env. */
const DEFAULT_TEAM_RECIPIENTS =
  'thibautglossoa@gmail.com,prayogadevelopment@gmail.com,gaelgdu91@gmail.com';
const TEAM_RECIPIENTS = (process.env.MAIL_TEAM_RECIPIENTS ?? DEFAULT_TEAM_RECIPIENTS)
  .split(',')
  .map((address) => address.trim())
  .filter(Boolean);

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/** Deliberately loose — only decides whether an address is safe to hand to
 *  Resend as a `to`/`reply_to`. Resend rejects the whole send on a malformed
 *  address, so a visitor's typo must never reach it. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function isSendableEmail(value: string | undefined): value is string {
  return typeof value === 'string' && EMAIL_RE.test(value);
}

/** Header-safe: no CR/LF, bounded length. */
function header(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim().slice(0, 180);
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type SendResult = { ok: true; id: string } | { ok: false; error: string };

async function send(payload: Record<string, unknown>): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: 'RESEND_API_KEY is not set' };

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    const body = (await response.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
    };
    if (!response.ok) {
      return { ok: false, error: body.message ?? `Resend responded ${response.status}` };
    }
    return { ok: true, id: body.id ?? '' };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

// --- Field display -----------------------------------------------------

const LABELS: Record<Lang, Record<FieldKey, string>> = {
  fr: {
    name: 'Nom',
    phone: 'Téléphone',
    service: 'Prestation',
    commune: 'Commune',
    access: 'Accès',
    details: 'Précisions',
    email: 'E-mail',
  },
  en: {
    name: 'Name',
    phone: 'Phone',
    service: 'Service',
    commune: 'Town',
    access: 'Access',
    details: 'Details',
    email: 'Email',
  },
};

const ACCESS_LABELS: Record<Lang, Record<string, string>> = {
  fr: {
    'plain-pied': 'Plain-pied',
    etage: 'Étage',
    veranda: 'Véranda ou fenêtre de toit',
    hauteur: 'Hauteur difficile',
  },
  en: {
    'plain-pied': 'Ground floor',
    etage: 'Upstairs',
    veranda: 'Conservatory or roof window',
    hauteur: 'Difficult height',
  },
};

/** The form submits slugs for `service`/`commune` and a fixed enum for
 *  `access`; the email should show what a human typed, not the key. */
function displayValue(key: FieldKey, value: string, lang: Lang): string {
  if (key === 'service') {
    return services.find((s) => s.slug === value)?.name[lang] ?? value;
  }
  if (key === 'commune') {
    return communes.find((c) => c.slug === value)?.name ?? value;
  }
  if (key === 'access') {
    return ACCESS_LABELS[lang][value] ?? value;
  }
  return value;
}

function detailRows(lang: Lang, fields: SubmissionField[]): string {
  return fields
    .map(
      (f) => `
      <tr>
        <td style="padding:8px 12px 8px 0;font-size:13px;color:#5a6072;vertical-align:top;white-space:nowrap;">${esc(LABELS[lang][f.key])}</td>
        <td style="padding:8px 0;font-size:14px;color:#101828;vertical-align:top;">${esc(displayValue(f.key, f.value, lang))}</td>
      </tr>`,
    )
    .join('');
}

function plainText(lang: Lang, fields: SubmissionField[]): string {
  return fields.map((f) => `${LABELS[lang][f.key]}: ${displayValue(f.key, f.value, lang)}`).join('\n');
}

// --- Shared chrome -------------------------------------------------------

const WRAP = (inner: string) => `
<div style="margin:0;padding:24px;background:#f5f3ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#101828;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;">
    ${inner}
  </div>
  <p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:1.6;color:#5a6072;text-align:center;">
    ${esc(BRAND_NAME)} · ${esc(PHONE_DISPLAY)} · ${esc(CONTACT_EMAIL)}<br>${esc(SITE_URL)}
  </p>
</div>`;

// --- Customer confirmation -------------------------------------------------

const CONFIRMATION = {
  fr: {
    subject: `Votre demande de devis a bien été reçue — ${BRAND_NAME}`,
    title: 'Votre demande est bien arrivée.',
    body: 'Merci, nous avons bien reçu votre demande. Nous vous rappelons au numéro indiqué pour confirmer le rendez-vous et le prix avant toute intervention.',
    contactBefore: 'Une question en attendant ? Appelez le ',
    contactAfter: '.',
    recap: 'Récapitulatif de votre demande',
    signoff: 'À très vite,',
  },
  en: {
    subject: `We've received your quote request — ${BRAND_NAME}`,
    title: 'Your request has arrived.',
    body: "Thank you — we've received your request. We'll call you back at the number you gave us to confirm the appointment and the price before any work starts.",
    contactBefore: 'A question in the meantime? Call ',
    contactAfter: '.',
    recap: 'Your request',
    signoff: 'Speak soon,',
  },
} as const;

/**
 * Fields the customer confirmation is allowed to echo back. Deliberately
 * excludes every free-prose field (name, phone, details): api/submit.ts is
 * public and this email goes to a caller-supplied address, so anything
 * echoed here is content an attacker chooses, delivered to a recipient an
 * attacker chooses, over a domain shared with PRIONATION's other clients.
 * Restricting the recap to short structured values removes the payload
 * channel while keeping the email useful.
 */
const CONFIRMATION_FIELDS: FieldKey[] = ['service', 'commune', 'access'];

export async function sendCustomerConfirmation({
  to,
  lang,
  fields,
}: {
  to: string;
  lang: Lang;
  fields: SubmissionField[];
}): Promise<SendResult> {
  const t = CONFIRMATION[lang];
  const recap = fields.filter((f) => CONFIRMATION_FIELDS.includes(f.key));

  const html = WRAP(`
    <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;line-height:1.3;">${esc(t.title)}</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#3d3d3d;">
      ${esc(t.body)}<br>${esc(t.contactBefore)}<a href="tel:${esc(PHONE_TEL)}" style="color:#1b3a9c;font-weight:700;text-decoration:none;">${esc(PHONE_DISPLAY)}</a>${esc(t.contactAfter)}
    </p>
    ${
      recap.length
        ? `<div style="border-top:1px solid #e4e1da;padding-top:20px;">
      <p style="margin:0 0 10px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#5a6072;">${esc(t.recap)}</p>
      <table style="width:100%;border-collapse:collapse;">${detailRows(lang, recap)}</table>
    </div>`
        : ''
    }
    <p style="margin:24px 0 0;font-size:15px;color:#3d3d3d;">${esc(t.signoff)}<br><strong>${esc(BRAND_NAME)}</strong></p>
  `);

  return send({
    from: MAIL_FROM,
    to: [to],
    reply_to: CONTACT_EMAIL,
    subject: t.subject,
    html,
    text: `${t.title}\n\n${t.body}\n${t.contactBefore}${PHONE_DISPLAY}${t.contactAfter}\n\n${recap.length ? `${t.recap}\n${plainText(lang, recap)}\n\n` : ''}${t.signoff}\n${BRAND_NAME}`,
  });
}

// --- Team notification -------------------------------------------------

export async function sendTeamNotification({
  lang,
  fields,
  meta,
}: {
  lang: Lang;
  fields: SubmissionField[];
  meta: { page?: string; userAgent?: string; receivedAt: string };
}): Promise<SendResult> {
  const summary = fields.find((f) => f.key === 'name')?.value ?? '—';
  // Guarded: Resend 422s the entire send on a malformed reply_to, so a
  // visitor mistyping their address would otherwise cost the whole lead.
  const customerEmail = fields.find((f) => f.key === 'email')?.value;
  const replyTo = isSendableEmail(customerEmail) ? customerEmail : undefined;

  const html = WRAP(`
    <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#1b3a9c;">Devis · ${esc(lang.toUpperCase())}</p>
    <h1 style="margin:0 0 20px;font-size:22px;font-weight:800;line-height:1.3;">${esc(summary)}</h1>
    <table style="width:100%;border-collapse:collapse;">${detailRows(lang, fields)}</table>
    <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e4e1da;font-size:12px;line-height:1.6;color:#5a6072;">
      ${esc(meta.receivedAt)}${meta.page ? ` · ${esc(meta.page)}` : ''}<br>${esc(meta.userAgent ?? '')}
    </p>
  `);

  return send({
    from: MAIL_FROM,
    to: TEAM_RECIPIENTS,
    // Replying to the notification reaches the customer directly, not us.
    ...(replyTo ? { reply_to: replyTo } : {}),
    subject: header(`[Devis] ${summary}`),
    html,
    text: `Devis (${lang})\n\n${plainText(lang, fields)}\n\n${meta.receivedAt}${meta.page ? ` · ${meta.page}` : ''}`,
  });
}
