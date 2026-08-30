'use client';

import { useState } from 'react';
import { services } from '@/data/services';
import { communes } from '@/data/communes';

/**
 * One of only two allowed client components. See CLAUDE.md rule 2.
 *
 * Three required fields above the fold, everything else optional. Static export
 * has no server, so this posts to a third-party endpoint set in .env.
 */
export function QuoteForm() {
  const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? '';
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

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
    return <p className="form-success">Merci. Nous vous rappelons rapidement.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="quote-form">
      <label htmlFor="name">Votre nom</label>
      <input id="name" name="name" type="text" required autoComplete="name" />

      <label htmlFor="phone">Votre téléphone</label>
      <input id="phone" name="phone" type="tel" required autoComplete="tel" />

      <label htmlFor="service">Ce qu&apos;il faut nettoyer</label>
      <select id="service" name="service" required defaultValue="">
        <option value="" disabled>
          Choisir une prestation
        </option>
        {services.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.name}
          </option>
        ))}
      </select>

      <details className="quote-form__optional">
        <summary>Précisions (facultatif)</summary>

        <label htmlFor="commune">Commune</label>
        <select id="commune" name="commune" defaultValue="">
          <option value="">Choisir</option>
          {communes.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        {/* This question filters out jobs a solo operator cannot safely take. */}
        <label htmlFor="access">Accès</label>
        <select id="access" name="access" defaultValue="">
          <option value="">Choisir</option>
          <option value="plain-pied">Plain-pied</option>
          <option value="etage">Étage</option>
          <option value="veranda">Véranda ou fenêtre de toit</option>
          <option value="hauteur">Hauteur difficile</option>
        </select>

        <label htmlFor="details">Surface ou nombre de fenêtres</label>
        <textarea id="details" name="details" rows={3} />

        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" />
      </details>

      <label className="quote-form__consent">
        <input type="checkbox" name="consent" required />
        <span>
          J&apos;accepte que mes informations soient utilisées pour me
          recontacter au sujet de ma demande.
        </span>
      </label>

      <button type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Envoi…' : 'Demander un devis gratuit'}
      </button>

      {state === 'error' && (
        <p className="form-error" role="alert">
          L&apos;envoi a échoué. Appelez-nous directement.
        </p>
      )}
    </form>
  );
}
