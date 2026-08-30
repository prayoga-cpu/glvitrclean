'use client';

import { useState } from 'react';
import { services } from '@/data/services';
import { communes } from '@/data/communes';
import { strings } from '@/i18n/dictionary';
import type { Lang } from '@/i18n/config';

/**
 * One of only three allowed client components. See CLAUDE.md rule 2.
 *
 * Three required fields above the fold, everything else optional. Static export
 * has no server, so this posts to a third-party endpoint set in .env.
 *
 * `lang` is submitted as a hidden field so whoever answers the lead knows which
 * language to reply in.
 */
export function QuoteForm({ lang }: { lang: Lang }) {
  const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? '';
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const t = strings(lang).form;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!endpoint) {
      setState('error');
      return;
    }
    setState('sending');
    try {
      const data = new FormData(e.currentTarget);
      const res = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      setState(res.ok ? 'sent' : 'error');
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

      <label className="quote-form__consent">
        <input type="checkbox" name="consent" required />
        <span>{t.consent}</span>
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
