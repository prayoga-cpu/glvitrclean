'use client';

import { useState } from 'react';
import Link from 'next/link';
import { services } from '@/data/services';
import { company } from '@/data/company';
import { strings } from '@/i18n/dictionary';
import { href, type Lang } from '@/i18n/config';

/**
 * One of only three allowed client components. See CLAUDE.md rule 2.
 *
 * The desktop nav is plain server-rendered markup in SiteHeader. This adds the
 * small-screen disclosure only. Every link it renders also exists in the
 * server-rendered footer, so a crawler with no JS still reaches all of them.
 */
export function MobileNav({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const t = strings(lang);

  return (
    <>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? t.nav.close : t.nav.open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-toggle__bar" />
        <span className="nav-toggle__bar" />
        <span className="nav-toggle__bar" />
      </button>

      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label={t.nav.mobileLabel}>
          <Link href={href('/', lang)} onClick={close}>
            {t.nav.home}
          </Link>
          {services.map((s) => (
            <Link key={s.slug} href={href(`/services/${s.slug}`, lang)} onClick={close}>
              {s.name[lang]}
            </Link>
          ))}
          <Link href={href('/credit-impot', lang)} onClick={close}>
            {t.nav.taxCredit}
          </Link>
          <Link href={href('/professionnels', lang)} onClick={close}>
            {t.nav.business}
          </Link>
          <Link href={href('/realisations', lang)} onClick={close}>
            {t.nav.work}
          </Link>
          <a href={`tel:${company.phone}`} onClick={close}>
            {company.phoneDisplay}
          </a>
          <Link href={href('/devis', lang)} className="btn btn--primary" onClick={close}>
            {t.common.freeQuote}
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </nav>
      )}
    </>
  );
}
