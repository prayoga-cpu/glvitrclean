import Link from 'next/link';
import Image from 'next/image';
import { company } from '@/data/company';
import { brand } from '@/data/brand';
import { services } from '@/data/services';
import { MobileNav } from '@/components/MobileNav';
import { LangToggle } from '@/components/LangToggle';
import { strings } from '@/i18n/dictionary';
import { href, type Lang } from '@/i18n/config';

/**
 * The mark alone — the gold ring, the blue disc and the GL monogram, no
 * wordmark. Used in the header and on the 404.
 *
 * The header used to carry the full lockup on a deep-blue plate. It does not
 * any more: at header size the wordmark and the NETTOYAGE PRO baseline inside
 * the artwork were doing the work that the nav links and the H1 already do,
 * and the plate put a dark block in an otherwise airy cream bar. The mark is
 * transparent, so it needs no ground of its own.
 *
 * It is a raster and not the supplied `mark.svg` for a measured reason: the
 * vector sets its GL monogram as live <text>, which no visitor's browser can
 * set in Newsreader, and the substitute font's metrics push the monogram
 * visibly off the disc centre. See docs/09-design-system.md, "Logo".
 */
function BrandMark() {
  return (
    <Image
      src={brand.mark.src}
      alt={company.displayName}
      width={brand.mark.width}
      height={brand.mark.height}
      className="brand__mark"
      priority
    />
  );
}

/**
 * The footer's counterpart: the wordmark and its NETTOYAGE PRO baseline, with
 * no circle mark. The header already did the recognising; the footer is where
 * the name is read.
 *
 * This one IS the artwork rather than live text, and it can be, because it is a
 * raster: the wordmark set in real Newsreader and the baseline in real
 * Schibsted Grotesk, cut out of the brand card. Live text could not have done
 * that — the only Newsreader this site ships is italic (see docs/09), so a text
 * wordmark would print the name at a slant or in the wrong family.
 *
 * It carries its own #1b3a9c ground, which is exactly --color-brand, so it sits
 * on the footer with no visible rectangle. That is also why the crop is
 * lossless: a lossy re-encode bands a flat ground and gives the edge away.
 */
function BrandWordmark() {
  return (
    <Image
      src={brand.wordmark.src}
      alt={company.displayName}
      width={brand.wordmark.width}
      height={brand.wordmark.height}
      className="brand__wordmark"
    />
  );
}

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = strings(lang);

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <Link href={href('/', lang)} aria-label={`${company.displayName} — ${t.common.homeLabel}`}>
          <BrandMark />
        </Link>

        {/*
          The only tax-credit reference allowed outside an eligible service
          page is this nav link, in either language. It sits outside <main>, so
          it never counts as a claim on /professionnels, /en/professionnels, or
          a facade page. See CLAUDE.md rule 1. Do not add a second one to the
          footer, and do not translate it into a claim — "Tax credit" is a
          destination label, not an offer.
        */}
        <nav className="site-nav" aria-label={t.nav.label}>
          <Link href={href('/credit-impot', lang)}>{t.nav.taxCredit}</Link>
          <Link href={href('/professionnels', lang)}>{t.nav.business}</Link>
          <Link href={href('/realisations', lang)}>{t.nav.work}</Link>
        </nav>

        <div className="site-header__actions">
          <LangToggle lang={lang} />
          {/* Call before form, on every page. docs/05-conversion-architecture.md */}
          <a className="site-header__phone" href={`tel:${company.phone}`} data-action="call">
            {company.phoneDisplay}
          </a>
          <Link href={href('/devis', lang)} className="btn btn--primary site-header__cta">
            {t.common.freeQuote}
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <MobileNav lang={lang} />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = strings(lang);

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__lead">
          <h2>
            {t.footer.leadA}
            <br />
            <span className="accent accent--on-brand">{t.footer.leadB}</span>
          </h2>
          {/*
            The prototype put an e-mail capture here. Replaced with the call
            and quote actions: docs/05 sets the hierarchy as call, then
            WhatsApp, then form, and rules out a newsletter outright.
          */}
          <div className="site-footer__cta">
            <a href={`tel:${company.phone}`} className="btn btn--accent" data-action="call">
              {t.common.callPrefix} {company.phoneDisplay}
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
            <p>{t.footer.responseTime}</p>
          </div>
        </div>

        <hr className="site-footer__rule" />

        <div className="site-footer__cols">
          <div className="site-footer__about">
            <BrandWordmark />
            <p>{t.footer.about}</p>
          </div>

          <div>
            <h3>{t.nav.services}</h3>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={href(`/services/${s.slug}`, lang)}>{s.name[lang]}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>{t.nav.theSite}</h3>
            <ul>
              <li>
                <Link href={href('/', lang)}>{t.nav.home}</Link>
              </li>
              <li>
                <Link href={href('/professionnels', lang)}>{t.nav.business}</Link>
              </li>
              <li>
                <Link href={href('/realisations', lang)}>{t.nav.work}</Link>
              </li>
              <li>
                <Link href={href('/devis', lang)}>{t.common.requestQuote}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>{t.nav.contact}</h3>
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
            © {new Date().getFullYear()} {company.legalName}. {t.footer.rights}
          </p>
          {/*
            No social icons until company.social has real URLs. Inventing a
            profile link is a rule 4 violation. See STATUS.md item 7.
          */}
          <ul>
            <li>
              <Link href={href('/mentions-legales', lang)}>{t.footer.legalNotice}</Link>
            </li>
            <li>
              <Link href={href('/confidentialite', lang)}>{t.footer.privacy}</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
