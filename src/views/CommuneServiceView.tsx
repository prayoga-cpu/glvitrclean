import Link from 'next/link';
import type { Commune } from '@/data/communes';
import type { Service } from '@/data/services';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';
import { TaxCreditBadge } from '@/components/TaxCreditBadge';
import { JsonLd } from '@/components/JsonLd';
import { ConversionBlock } from '@/components/ConversionBlock';
import { strings } from '@/i18n/dictionary';
import { href, type Lang } from '@/i18n/config';

export function CommuneServiceView({
  commune: c,
  service: s,
  lang,
}: {
  commune: Commune;
  service: Service;
  lang: Lang;
}) {
  const t = strings(lang);
  const name = s.name[lang];

  return (
    <div className="page">
      <JsonLd data={serviceSchema(s, lang, c)} />
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: t.nav.home, path: '/' },
            { name: c.name, path: `/zones/${c.slug}` },
            { name, path: `/zones/${c.slug}/${s.slug}` },
          ],
          lang,
        )}
      />

      <h1>{t.communeService.h1(name, c.name, c.postalCode)}</h1>
      <p>{s.summary[lang]}</p>
      <p className="local-angle">{c.localAngle[lang]}</p>

      <TaxCreditBadge service={s} lang={lang} basePriceEur={s.pricing.fromEur} />
      {!s.taxCreditEligible && <p className="eligibility-note">{s.eligibilityNote[lang]}</p>}

      <ConversionBlock lang={lang} />

      {/* Deliberately NOT the full bodyCopy: rendering all four paragraphs here
          would make this page a near-copy of /services/{slug} on all twelve
          crossings. The method and quoting paragraphs are the two a visitor
          who arrived on a local query still needs; the commune's localAngle
          above is what actually differentiates the page.

          This is the honest limit of what src/data/ can differentiate. Copy
          genuinely specific to a service IN a commune needs facts only the
          client has — logged as a blocked item in STATUS.md. */}
      {[s.bodyCopy[lang][1], s.bodyCopy[lang][3]]
        .filter(Boolean)
        .map((para) => (
          <p key={para}>{para}</p>
        ))}

      <nav className="related-links" aria-label={t.communeService.relatedLabel}>
        <Link href={href(`/services/${s.slug}`, lang)}>
          {t.communeService.serviceInRegion(name)}
        </Link>
        <Link href={href(`/zones/${c.slug}`, lang)}>{t.communeService.allServicesIn(c.name)}</Link>
      </nav>
    </div>
  );
}
