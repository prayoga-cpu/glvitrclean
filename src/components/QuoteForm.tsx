'use client';

import Link from 'next/link';
import { useState } from 'react';
import { services } from '@/data/services';
import { communes } from '@/data/communes';
import { strings } from '@/i18n/dictionary';
import { href, type Lang } from '@/i18n/config';
import { collectFields } from '@/lib/submission';

/**
 * One of only three allowed client components. See CLAUDE.md rule 2.
 *
 * Three required fields above the fold, everything else optional. Static
 * export has no server, so this posts to /api/submit — a Vercel Edge
 * Function that lives at the top-level api/ directory, outside the Next.js
 * app entirely. See api/submit.ts for why that keeps `output: 'export'`
 * intact.
 *
 * `lang` is submitted alongside the fields so whoever answers the lead knows
 * which language to reply in.
 */
export function QuoteForm({ lang }: { lang: Lang }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const t = strings(lang).form;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    // Honeypot: a hidden field no human ever fills. Pretend to succeed so a
    // bot cannot tell it was caught.
    if (data.get('company_website')) {
      setState('sent');
      return;
    }

    setState('sending');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          fields: collectFields(data),
          page: window.location.pathname,
        }),
      });
      const result = (await res.json().catch(() => ({}))) as { ok?: boolean };
      setState(res.ok && result.ok !== false ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'sent') {
    return <p className="form-success">{t.success}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="quote-form">
      <input type="hidden" name="lang" value={lang} />

      <label htmlFor="name">{t.name}</label>
      <input id="name" name="name" type="text" required autoComplete="name" />

      <label htmlFor="phone">{t.phone}</label>
      <input id="phone" name="phone" type="tel" required autoComplete="tel" />

      <label htmlFor="service">{t.whatToClean}</label>
      <select id="service" name="service" required defaultValue="">
        <option value="" disabled>
          {t.choosePlaceholder}
        </option>
        {services.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.name[lang]}
          </option>
        ))}
      </select>

      <details className="quote-form__optional">
        <summary>{t.optional}</summary>

        <label htmlFor="commune">{t.commune}</label>
        <select id="commune" name="commune" defaultValue="">
          <option value="">{t.choose}</option>
          {communes.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        {/* This question filters out jobs a solo operator cannot safely take. */}
        <label htmlFor="access">{t.access}</label>
        <select id="access" name="access" defaultValue="">
          <option value="">{t.choose}</option>
          <option value="plain-pied">{t.accessGround}</option>
          <option value="etage">{t.accessUpstairs}</option>
          <option value="veranda">{t.accessVeranda}</option>
          <option value="hauteur">{t.accessHigh}</option>
        </select>

        <label htmlFor="details">{t.details}</label>
        <textarea id="details" name="details" rows={3} />

        <label htmlFor="email">{t.email}</label>
        <input id="email" name="email" type="email" autoComplete="email" />
      </details>

      {/* Spam honeypot. Hidden from sighted users and, via aria-hidden, from
          screen readers; api/submit.ts drops any submission where it is
          filled in. */}
      <div className="quote-form__honeypot" aria-hidden="true">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="quote-form__consent">
        <input type="checkbox" name="consent" required />
        <span>
          {t.consentBefore}
          <Link href={href('/confidentialite', lang)}>{t.consentLinkLabel}</Link>
          {t.consentAfter}
        </span>
      </label>

      <button type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? t.sending : t.submit}
      </button>

      {state === 'error' && (
        <p className="form-error" role="alert">
          {t.error}
        </p>
      )}
    </form>
  );
}
