'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { services } from '@/data/services';
import { communes } from '@/data/communes';
import { DEFAULT_PHONE_COUNTRY, flagEmoji, otherPhoneCountries } from '@/data/phone-countries';
import { whatsappHref } from '@/components/CallButton';
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
  const [lastServiceSlug, setLastServiceSlug] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const t = strings(lang).form;
  const commonT = strings(lang).common;
  const mt = strings(lang).confirmModal;

  // Opens the confirmation dialog once the "sent" branch below has actually
  // rendered it — showModal() needs the element in the DOM first, so this
  // can't be called from handleSubmit itself. Guarded on `.open`: React can
  // double-invoke effects in dev (StrictMode), and calling showModal() on an
  // already-open <dialog> throws InvalidStateError.
  //
  // Focus is moved to the close button explicitly, here, rather than via the
  // button's `autoFocus` prop: React never reflects `autoFocus` as the real
  // HTML `autofocus` attribute for host elements, it only calls `.focus()`
  // imperatively at mount — which happens on THIS render, before showModal()
  // has run, while the <dialog> still has no `open` attribute and is
  // `display: none` per the UA stylesheet, so that early `.focus()` silently
  // no-ops. showModal()'s own native focusing step then looks for a
  // descendant with the real `autofocus` attribute, finds none (React never
  // set it), and falls back to focusing the <dialog> itself. Calling
  // `.focus()` here, after showModal() has already made the panel visible,
  // is what actually lands focus on the close button.
  useEffect(() => {
    if (state === 'sent' && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
      closeButtonRef.current?.focus();
    }
  }, [state]);

  // The single source of truth for focus-return: Esc, a backdrop click and
  // the close button all end in the dialog's native `close` event, so this
  // is the only place that needs to move focus back — no dismissal path can
  // forget to. It goes to the page's own success heading, not `<body>`,
  // because the Submit button that originally opened this flow no longer
  // exists once the form has been replaced by this success view.
  function handleDialogClose() {
    successHeadingRef.current?.focus();
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) dialogRef.current?.close();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    // Fold the dial code into the single "phone" field the server expects —
    // src/lib/submission.ts's FIELD_KEYS has no separate slot for it, and it
    // must stay that way: "phoneCountry" is meant to be dropped once it has
    // done this one job. The guard only stops a pasted already-international
    // number ("+1 555 234 1234" or the "00"-prefixed equivalent, "0033 6 27
    // 70 99 70") from being double-prefixed; nothing here validates the
    // result the way a phone library would, because nothing downstream
    // parses it as a machine number — api/submit.ts has no phone validation
    // and just puts the string in an email for a human to read and dial.
    const dial = String(data.get('phoneCountry') ?? '').trim();
    const numberRaw = String(data.get('phone') ?? '').trim();
    const alreadyInternational = numberRaw.startsWith('+') || numberRaw.startsWith('00');
    if (numberRaw && dial && !alreadyInternational) {
      data.set('phone', `${dial} ${numberRaw}`);
    }
    // Captured for the confirmation dialog's WhatsApp prefill, further down.
    setLastServiceSlug(String(data.get('service') ?? ''));

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
    // inSentence, not name: name is the capitalized heading form ("Nettoyage
    // de vitres"), which reads as a typo dropped mid-sentence into the
    // WhatsApp draft. inSentence is services.ts's own lowercase form made
    // for exactly this ("un {inSentence} à Arpajon").
    const serviceName = services.find((s) => s.slug === lastServiceSlug)?.inSentence[lang] ?? '';
    const waDraft = serviceName ? mt.whatsappPrefill(serviceName) : mt.whatsappPrefillGeneric;

    return (
      <div className="quote-form-done">
        <h2 ref={successHeadingRef} tabIndex={-1} className="form-success">
          {t.success}
        </h2>
        <a
          href={whatsappHref(waDraft)}
          className="whatsapp-button"
          rel="noopener noreferrer"
          target="_blank"
          data-action="whatsapp"
        >
          {commonT.whatsapp}
        </a>

        {/*
          Native <dialog>: real top-layer stacking (no z-index coordination
          against the sticky call bar or mobile nav), a native focus trap,
          ::backdrop and Esc-to-close, all with no hand-written JS. See
          globals.css for why the dialog itself carries no visible chrome —
          that lives on .confirm-modal__panel, one level in, so the two don't
          double up.
        */}
        <dialog
          ref={dialogRef}
          className="confirm-modal"
          aria-labelledby="confirm-modal-title"
          aria-describedby="confirm-modal-body"
          onClose={handleDialogClose}
          onClick={handleBackdropClick}
        >
          <div className="confirm-modal__panel">
            <button
              ref={closeButtonRef}
              type="button"
              className="confirm-modal__close"
              aria-label={mt.close}
              onClick={() => dialogRef.current?.close()}
            >
              {/* Not the WhatsApp link: a reflex Enter/Space right after
                  submitting must not fire an external navigation. Focused
                  imperatively from the useEffect above, not via `autoFocus`
                  — see the comment there for why that prop doesn't work on a
                  <dialog> opened with showModal(). */}
              <span aria-hidden="true">&times;</span>
            </button>
            <h2 id="confirm-modal-title" className="confirm-modal__title">
              {mt.title}
            </h2>
            <p id="confirm-modal-body" className="confirm-modal__body">
              {mt.body}
            </p>
            <a
              href={whatsappHref(waDraft)}
              className="btn btn--accent confirm-modal__whatsapp"
              rel="noopener noreferrer"
              target="_blank"
              data-action="whatsapp"
            >
              {commonT.whatsapp}
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </dialog>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="quote-form">
      <input type="hidden" name="lang" value={lang} />

      <label htmlFor="name">{t.name}</label>
      <input id="name" name="name" type="text" required autoComplete="name" />

      <label htmlFor="phone">{t.phone}</label>
      <div className="quote-form__phone">
        {/* Uncontrolled on purpose: read once, at submit time, via
            FormData — no React state, no per-keystroke JS. Closed box shows
            flag + dial code only, not the spelled-out name (229 entries: a
            name would make the row overflow for most of them) — the full
            name is still on the option via `title`, and the source list is
            comprehensive enough that there is no "other country" escape
            hatch to maintain. */}
        <select
          name="phoneCountry"
          defaultValue={DEFAULT_PHONE_COUNTRY.dial}
          aria-label={t.phoneCountry}
          autoComplete="tel-country-code"
          className="quote-form__phone-country"
        >
          <option value={DEFAULT_PHONE_COUNTRY.dial} title={DEFAULT_PHONE_COUNTRY[lang === 'fr' ? 'nameFr' : 'nameEn']}>
            {flagEmoji(DEFAULT_PHONE_COUNTRY.iso)} {DEFAULT_PHONE_COUNTRY.dial}
          </option>
          <option disabled>──────────</option>
          {otherPhoneCountries(lang).map((c) => (
            <option key={c.iso} value={c.dial} title={c[lang === 'fr' ? 'nameFr' : 'nameEn']}>
              {flagEmoji(c.iso)} {c.dial}
            </option>
          ))}
        </select>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          required
          autoComplete="tel"
          placeholder={t.phonePlaceholder}
          className="quote-form__phone-number"
        />
      </div>

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
