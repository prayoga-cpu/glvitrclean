import { SITE_URL, company, sapVerified } from '@/data/company';
import { brand } from '@/data/brand';
import { communes } from '@/data/communes';
import type { Service } from '@/data/services';
import type { Commune } from '@/data/communes';
import { resolveFaqText, type FaqEntry } from '@/data/faq';
import { reviews, ratingSummary, BEST_RATING } from '@/data/reviews';
import { strings } from '@/i18n/dictionary';
import { localePath, type Lang } from '@/i18n/config';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = Record<string, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * One business, two language editions of the site. The @id is deliberately
 * locale-free so both editions describe the SAME LocalBusiness node rather
 * than asserting two competing businesses at two URLs.
 */
const BUSINESS_ID = `${SITE_URL}/#business`;

/** Absolute URL for a locale-free path. */
function abs(basePath: string, lang: Lang): string {
  const p = localePath(basePath, lang);
  return `${SITE_URL}${p === '/' ? '/' : `${p}/`}`;
}

/**
 * The declared intervention area as schema.org nodes: the two departments
 * first, then the twelve communes that have pages of their own.
 *
 * The departments matter on their own. `communes` only ever lists Essonne
 * towns — the Seine-et-Marne commune list is outstanding (see
 * company.serviceArea) — so without these two nodes the structured data would
 * claim a narrower area than the site does in prose, and the wider half of the
 * client's declared coverage would be invisible to a crawler.
 */
function departmentAreas(): Json[] {
  return company.serviceArea.departments.map((d) => ({
    '@type': 'AdministrativeArea',
    name: d.name,
    identifier: d.code,
  }));
}

function communeAreas(): Json[] {
  return communes.map((c) => ({
    '@type': 'City',
    name: c.name,
    address: {
      '@type': 'PostalAddress',
      postalCode: c.postalCode,
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: c.geo.lat,
      longitude: c.geo.lng,
    },
  }));
}

/**
 * LocalBusiness. Service-area business, so no public street address is emitted.
 *
 * `AggregateRating` and `Review` are wired but dormant: they are emitted only
 * when `src/data/reviews.ts` is non-empty, and it is empty. That is the same
 * contract as `sameAs` below and as pending mode on the tax-credit badge — the
 * node appears the moment the fact exists and not one edit sooner. Do NOT
 * populate the array to "test" the markup: an invented review is a rule 4
 * violation and an `avis trompeur`. See the header of that file.
 *
 * Takes no `lang`: every field on this node is language-invariant. Both
 * editions describe the same business at the same url under the same @id.
 */
export function localBusinessSchema(): Json {
  const node: Json = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': BUSINESS_ID,
    name: company.legalName,
    // The client's title-tag brand line, declared as what it is: a variant
    // name, not the business's name. Google's own guidance is that a
    // LocalBusiness `name` is the real-world name and nothing else, so the
    // "| MULTI SERVICE" half lives here instead of corrupting that field.
    alternateName: company.brandLine,
    // Locale-invariant, like @id above: one node, one canonical url. French is
    // the x-default edition, so the French home page is the business's url.
    url: `${SITE_URL}/`,
    telephone: company.phone,
    email: company.email,
    areaServed: [...departmentAreas(), ...communeAreas()],
    // Square 1200x1200 brand card, absolute as schema.org requires. `logo` is
    // what Google may show in a knowledge panel; `image` is what it needs
    // present at all for a local result to be eligible for one. Both point at
    // the same file because the only photography this site has is stock
    // placeholder, which may not be presented as the client's own work
    // (CLAUDE.md rule 4). Swap `image` for a real job photo in phase 5.
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}${brand.square}`,
      width: 1200,
      height: 1200,
    },
    image: `${SITE_URL}${brand.square}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: company.address.locality,
      postalCode: company.address.postalCode,
      addressRegion: company.address.region,
      addressCountry: company.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: company.geo.lat,
      longitude: company.geo.lng,
    },
    // The hours the phone is answered, from the same array the footer and
    // /devis print. A service-area business has no premises to open, but
    // Google shows these on a local result and answers "are they open now?"
    // from them — so a wrong or absent set costs a call.
    openingHoursSpecification: company.openingHours.map((block) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: block.days.map((d) => `https://schema.org/${d}`),
      opens: block.opens,
      closes: block.closes,
    })),
    identifier: company.siret,
  };

  if (company.social.length > 0) node.sameAs = company.social;

  // Stars on a local result come from these two. Emitted together or not at
  // all: Google treats an `aggregateRating` with no `review` on a
  // LocalBusiness as incomplete, and a rating computed from nothing would be a
  // claim rather than a summary. `ratingSummary()` returns null on an empty
  // array, which is why there is no zero case to guard.
  const rating = ratingSummary();
  if (rating) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value,
      reviewCount: rating.count,
      bestRating: BEST_RATING,
      worstRating: 1,
    };
    node.review = reviews.map((r) => {
      const review: Json = {
        '@type': 'Review',
        author: { '@type': 'Person', name: r.author },
        datePublished: r.datePublished,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: BEST_RATING,
          worstRating: 1,
        },
        reviewBody: r.body,
        inLanguage: r.lang,
      };
      // Only when there is a real one to point at. An absent url is better
      // than a url that does not resolve to the review.
      if (r.sourceUrl) review.url = r.sourceUrl;
      return review;
    });
  }
  if (sapVerified) {
    node.hasCredential = {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Déclaration Services à la Personne',
      identifier: company.sapDeclaration.number,
    };
  }
  return node;
}

export function serviceSchema(service: Service, lang: Lang, commune?: Commune): Json {
  const t = strings(lang);
  const name = service.name[lang];
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: commune ? t.commune.linkServiceIn(name, commune.name) : name,
    description: service.summary[lang],
    serviceType: service.headTerm[lang],
    // No inLanguage: it is a CreativeWork property and Service is not a
    // CreativeWork. It stays on FAQPage below, where it is correct.
    url: abs(
      commune ? `/zones/${commune.slug}/${service.slug}` : `/services/${service.slug}`,
      lang,
    ),
    provider: { '@id': BUSINESS_ID },
    areaServed: commune
      ? {
          '@type': 'City',
          name: commune.name,
          geo: {
            '@type': 'GeoCoordinates',
            latitude: commune.geo.lat,
            longitude: commune.geo.lng,
          },
        }
      : [
          ...departmentAreas(),
          ...communes.map((c) => ({
            '@type': 'City',
            name: c.name,
            geo: {
              '@type': 'GeoCoordinates',
              latitude: c.geo.lat,
              longitude: c.geo.lng,
            },
          })),
        ],
  };
}

export function faqSchema(entries: FaqEntry[], lang: Lang): Json | null {
  if (entries.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: resolveFaqText(e.question[lang]),
      acceptedAnswer: { '@type': 'Answer', text: resolveFaqText(e.answer[lang]) },
    })),
  };
}

/** `path` entries are locale-free basePaths; the locale prefix is added here. */
export function breadcrumbSchema(
  trail: { name: string; path: string }[],
  lang: Lang,
): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path, lang),
    })),
  };
}
