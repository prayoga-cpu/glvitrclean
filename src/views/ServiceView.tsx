import Link from 'next/link';
import type { Service } from '@/data/services';
import { communes } from '@/data/communes';
import { faqForPage } from '@/data/faq';
import { serviceSchema, faqSchema, breadcrumbSchema } from '@/lib/schema';
import { TaxCreditBadge } from '@/components/TaxCreditBadge';
import { JsonLd } from '@/components/JsonLd';
import { Faq } from '@/components/Faq';
import { CallButton } from '@/components/CallButton';
import { strings } from '@/i18n/dictionary';
import { href, type Lang } from '@/i18n/config';

export function ServiceView({ service, lang }: { service: Service; lang: Lang }) {
  const t = strings(lang);
  const entries = faqForPage(service.slug);
  const name = service.name[lang];

  return (
    <>
      <JsonLd data={serviceSchema(service, lang)} />
      <JsonLd data={faqSchema(entries, lang)} />
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: t.nav.home, path: '/' },
            { name, path: `/services/${service.slug}` },
          ],
          lang,
        )}
      />

      <h1>
        {name} {t.service.h1Suffix}
      </h1>
      <p>{service.summary[lang]}</p>

      {/* Renders null on facade and poubelles, in both languages. Never override. */}
      <TaxCreditBadge service={service} lang={lang} basePriceEur={service.pricing.fromEur} />

      {/* On non-eligible services this is the honest exclusion note.
          It is the highest-trust element on the page. Do not remove it. */}
      {!service.taxCreditEligible && (
        <p className="eligibility-note">{service.eligibilityNote[lang]}</p>
      )}

      <CallButton lang={lang} />

      {/* TODO(claude): body copy. What is included, how it is done, what the
          customer should prepare. Written for a homeowner, not a buyer.
          Both languages, added to the dictionary, not inlined here. */}

      <section>
        <h2>{t.service.inYourCommune(name)}</h2>
        <ul>
          {communes.map((c) => (
            <li key={c.slug}>
              <Link href={href(`/zones/${c.slug}/${service.slug}`, lang)}>
                {t.service.linkInCommune(name, c.name)}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Faq entries={entries} lang={lang} />
    </>
  );
}
