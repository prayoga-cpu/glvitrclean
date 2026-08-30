'use client';

import { useState } from 'react';
import Link from 'next/link';
import { services } from '@/data/services';
import { company } from '@/data/company';

/**
 * One of only two allowed client components. See CLAUDE.md rule 2.
 *
 * The desktop nav is plain server-rendered markup in layout.tsx. This adds the
 * small-screen disclosure only. Every link it renders also exists in the
 * server-rendered footer, so a crawler with no JS still reaches all of them.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-toggle__bar" />
        <span className="nav-toggle__bar" />
        <span className="nav-toggle__bar" />
      </button>

      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Navigation mobile">
          <Link href="/" onClick={close}>
            Accueil
          </Link>
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}/`} onClick={close}>
              {s.name}
            </Link>
          ))}
          <Link href="/credit-impot/" onClick={close}>
            Crédit d&apos;impôt
          </Link>
          <Link href="/professionnels/" onClick={close}>
            Professionnels
          </Link>
          <Link href="/realisations/" onClick={close}>
            Réalisations
          </Link>
          <a href={`tel:${company.phone}`} onClick={close}>
            {company.phoneDisplay}
          </a>
          <Link href="/devis/" className="btn btn--primary" onClick={close}>
            Devis gratuit
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </nav>
      )}
    </>
  );
}
