import Link from 'next/link';
import type { Commune } from '@/data/communes';
import { nearestCommunes } from '@/data/communes';
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

      <TaxCreditBadge service={s} lang={lang} basePriceEur={s.pricing.fromEur} />
      {!s.taxCreditEligible && <p className="eligibility-note">{s.eligibilityNote[lang]}</p>}

      {/* Gated for the same reason as on the service hub — and it matters more
          here: this view renders only bodyCopy[1] and [3], so on a facade
          crossing the "visite préalable est indispensable" paragraph is not even
          on the page to contradict the note. */}
      <ConversionBlock lang={lang} photoNote={s.photoQuote} />

      {/* Deliberately NOT the full bodyCopy: rendering all four paragraphs here
          would make this page a near-copy of /services/{slug} on all twelve
          crossings. The method and quoting paragraphs are the two a visitor
          who arrived on a local query still needs; the commune block below is
          what actually differentiates the page. */}
      {[s.bodyCopy[lang][1], s.bodyCopy[lang][3]]
        .filter(Boolean)
        .map((para) => (
          <p key={para}>{para}</p>
        ))}

      {/* ROADMAP phase 8a. These 84 pages used to carry one shared sentence of
          local colour — the same `localAngle` the commune hub prints — and
          nothing else. Three paragraphs of genuinely local material is what
          keeps a service × commune crossing from reading as a template fill,
          which is the failure CLAUDE.md rule 4 exists to prevent. */}
      <section>
        <h2>{t.communeService.localContextH2(c.name)}</h2>
        <p className="local-angle">{c.localAngle[lang]}</p>
        <p>{c.soiling[lang]}</p>
        <p>{c.housing[lang]}</p>
      </section>

      {/* ROADMAP phase 8b, and the single biggest internal-linking gap on the
          site: these 84 pages linked UP to two hubs and nowhere sideways, so
          the deepest layer of the tree had no lateral crawl path at all. Same
          service, nearest communes by the haversine that already exists.

          Four rather than six: this block sits alongside the two related links
          below, and a deep page that is mostly navigation is its own problem. */}
      <section>
        <h2>{t.communeService.nearbyH2(name)}</h2>
        <ul className="link-grid">
          {nearestCommunes(c, 4).map((x) => (
            <li key={x.slug}>
              <Link href={href(`/zones/${x.slug}/${s.slug}`, lang)}>
                {t.commune.linkServiceIn(name, x.name)}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ConversionBlock lang={lang} />

      <nav className="related-links" aria-label={t.communeService.relatedLabel}>
        <Link href={href(`/services/${s.slug}`, lang)}>
          {t.communeService.serviceInRegion(name)}
        </Link>
        <Link href={href(`/zones/${c.slug}`, lang)}>{t.communeService.allServicesIn(c.name)}</Link>
      </nav>
    </div>
  );
}
