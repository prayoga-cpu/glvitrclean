import Link from 'next/link';
import type { Service } from '@/data/services';
import { communes } from '@/data/communes';
import { faqForPage } from '@/data/faq';
import { serviceSchema, faqSchema, breadcrumbSchema } from '@/lib/schema';
import { TaxCreditBadge } from '@/components/TaxCreditBadge';
import { JsonLd } from '@/components/JsonLd';
import { Faq } from '@/components/Faq';
import { ConversionBlock } from '@/components/ConversionBlock';
import { PricingNote } from '@/components/PricingNote';
import { ProcessSteps } from '@/components/ProcessSteps';
import { BeforeAfter } from '@/components/BeforeAfter';
import { strings } from '@/i18n/dictionary';
import { href, type Lang } from '@/i18n/config';

export function ServiceView({ service, lang }: { service: Service; lang: Lang }) {
  const t = strings(lang);
  const entries = faqForPage(service.slug);
  const name = service.name[lang];

  return (
    <div className="page">
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

      {/* Gated on the service, not hard-coded. On `facade` and `terrasse` the
          repository says a visit or an on-site measurement is required, so the
          photo line would be an offer the page itself goes on to deny. See the
          `photoQuote` comment in src/data/services.ts. */}
      <ConversionBlock lang={lang} photoNote={service.photoQuote} />

      {/* All four paragraphs, in order. The last one carries the quoting basis
          (forfait, au m², horaire, sur devis, par bac) and the free-quote line,
          so a view that rendered only the first few would silently drop it. */}
      {service.bodyCopy[lang].map((para) => (
        <p key={para}>{para}</p>
      ))}

      {/* The basis stated as a scannable block, not only as the tail of the
          fourth paragraph. ROADMAP phase 8d. */}
      <PricingNote service={service} lang={lang} />

      {/* Phase 8e: the second of three actions on the page. A visitor who has
          just read how the price is worked out is at the highest intent this
          page ever reaches, and previously had nothing to click. */}
      <ConversionBlock lang={lang} />

      {/* `service.longTail` is seven arrays of real French sub-service names —
          démoussage terrasse, nettoyage véranda, nettoyage baies vitrées — that
          have sat in src/data/services.ts since phase 2, described in their own
          comment as being for copy, and rendered nowhere.

          They go here rather than into new routes on purpose. CLAUDE.md rule 3
          requires a target query per page, and these are near-synonyms of the
          query this page already targets: a page each would be seven thin
          pages competing with their own parent. ROADMAP phase 8d. */}
      <section>
        <h2>{t.service.coversH2(service.inSentence[lang])}</h2>
        <p>{t.service.coversIntro}</p>
        <ul className="tag-list">
          {service.longTail[lang].map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t.service.processH2}</h2>
        <ProcessSteps lang={lang} />
      </section>

      <section>
        <h2>{t.service.inYourCommune(name)}</h2>
        <ul className="link-grid">
          {communes.map((c) => (
            <li key={c.slug}>
              <Link href={href(`/zones/${c.slug}/${service.slug}`, lang)}>
                {t.service.linkInCommune(name, c.name)}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* This service's own before/after pairs. Null until phase 5. */}
      <BeforeAfter lang={lang} serviceSlug={service.slug} />

      <ConversionBlock lang={lang} />

      <Faq entries={entries} lang={lang} />
    </div>
  );
}
