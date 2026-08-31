import Link from 'next/link';
import type { Commune } from '@/data/communes';
import type { Service } from '@/data/services';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';
import { TaxCreditBadge } from '@/components/TaxCreditBadge';
import { JsonLd } from '@/components/JsonLd';
import { CallButton } from '@/components/CallButton';
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

      <CallButton lang={lang} />

      {/* TODO(claude): two short paragraphs specific to this pair. Reuse the
          commune's localAngle as the hook, not as the whole body. */}

      <nav className="related-links" aria-label={t.communeService.relatedLabel}>
        <Link href={href(`/services/${s.slug}`, lang)}>
          {t.communeService.serviceInRegion(name)}
        </Link>
        <Link href={href(`/zones/${c.slug}`, lang)}>{t.communeService.allServicesIn(c.name)}</Link>
      </nav>
    </div>
  );
}
