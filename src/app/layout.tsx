import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { company, SITE_URL } from '@/data/company';
import { services } from '@/data/services';
import { CallButton } from '@/components/CallButton';
import { JsonLd } from '@/components/JsonLd';
import { MobileNav } from '@/components/MobileNav';
import { Logo } from '@/components/Logo';
import { localBusinessSchema } from '@/lib/schema';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "GLVITR'CLEAN", template: '%s' },
};

/** Wordmark. The apostrophe is the accent colour, per the supplied logo. */
function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="brand">
      <Logo inverse={inverse} />
      <span className="brand__word">
        GLVITR<em>’</em>CLEAN
      </span>
    </span>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <JsonLd data={localBusinessSchema()} />

        <header className="site-header">
          <div className="site-header__bar">
            <Link href="/" aria-label={`${company.displayName} — accueil`}>
              <Brand />
            </Link>

            {/*
              The only tax-credit reference allowed outside an eligible service
              page is this nav link. It sits outside <main>, so it never counts
              as a claim on /professionnels or on a facade page.
              See CLAUDE.md rule 1. Do not add a second one to the footer.
            */}
            <nav className="site-nav" aria-label="Navigation principale">
              <Link href="/credit-impot/">Crédit d&apos;impôt</Link>
              <Link href="/professionnels/">Professionnels</Link>
              <Link href="/realisations/">Réalisations</Link>
            </nav>

            <div className="site-header__actions">
              {/* Call before form, on every page. docs/05-conversion-architecture.md */}
              <a className="site-header__phone" href={`tel:${company.phone}`} data-action="call">
                {company.phoneDisplay}
              </a>
              <Link href="/devis/" className="btn btn--primary site-header__cta">
                Devis gratuit
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              <MobileNav />
            </div>
          </div>
        </header>

        <main className="container">{children}</main>

        <footer className="site-footer">
          <div className="site-footer__inner">
            <div className="site-footer__lead">
              <h2>
                Parlons de vos
                <br />
                <span className="accent accent--on-brand">surfaces à nettoyer.</span>
              </h2>
              {/*
                The prototype put an e-mail capture here. Replaced with the call
                and quote actions: docs/05 sets the hierarchy as call, then
                WhatsApp, then form, and rules out a newsletter outright.
              */}
              <div className="site-footer__cta">
                <a href={`tel:${company.phone}`} className="btn btn--accent" data-action="call">
                  Appeler le {company.phoneDisplay}
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
                <p>Réponse sous 24 h. Devis gratuit et sans engagement.</p>
              </div>
            </div>

            <hr className="site-footer__rule" />

            <div className="site-footer__cols">
              <div className="site-footer__about">
                <Brand inverse />
                <p>
                  Nettoyage de vitres, terrasses, volets, façades et ménage à domicile
                  dans le sud de l&apos;Essonne, chez les particuliers comme chez les
                  professionnels.
                </p>
              </div>

              <div>
                <h3>Prestations</h3>
                <ul>
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}/`}>{s.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3>Le site</h3>
                <ul>
                  <li>
                    <Link href="/">Accueil</Link>
                  </li>
                  <li>
                    <Link href="/professionnels/">Professionnels</Link>
                  </li>
                  <li>
                    <Link href="/realisations/">Réalisations</Link>
                  </li>
                  <li>
                    <Link href="/devis/">Demander un devis</Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3>Contact</h3>
                <ul>
                  <li>
                    <a href={`tel:${company.phone}`}>{company.phoneDisplay}</a>
                  </li>
                  <li>
                    <a href={`mailto:${company.email}`}>{company.email}</a>
                  </li>
                  <li>
                    {company.address.locality} ({company.address.postalCode})
                  </li>
                  <li>SIRET {company.siret}</li>
                </ul>
              </div>
            </div>

            <hr className="site-footer__rule" />

            <div className="site-footer__legal">
              <p>
                © {new Date().getFullYear()} {company.legalName}. Tous droits réservés.
              </p>
              {/*
                No social icons until company.social has real URLs. Inventing a
                profile link is a rule 4 violation. See STATUS.md item 7.
              */}
              <ul>
                <li>
                  <Link href="/mentions-legales/">Mentions légales</Link>
                </li>
                <li>
                  <Link href="/confidentialite/">Confidentialité</Link>
                </li>
              </ul>
            </div>
          </div>
        </footer>

        <CallButton sticky />
      </body>
    </html>
  );
}
