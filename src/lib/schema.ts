import { SITE_URL, company, sapVerified } from '@/data/company';
import { communes } from '@/data/communes';
import type { Service } from '@/data/services';
import type { Commune } from '@/data/communes';
import type { FaqEntry } from '@/data/faq';
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
 * LocalBusiness. Service-area business, so no public street address is emitted.
 * `AggregateRating` is deliberately absent. Do not add it until real reviews
 * exist. See CLAUDE.md rule 4.
 */
export function localBusinessSchema(lang: Lang): Json {
  const node: Json = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': BUSINESS_ID,
    name: company.legalName,
    url: abs('/', lang),
    telephone: company.phone,
    email: company.email,
    areaServed: communes.map((c) => ({
      '@type': 'City',
      name: c.name,
      address: {
        '@type': 'PostalAddress',
        postalCode: c.postalCode,
        addressCountry: 'FR',
      },
    })),
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
    identifier: company.siret,
  };

  if (company.social.length > 0) node.sameAs = company.social;
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
    inLanguage: lang,
    provider: { '@id': BUSINESS_ID },
    areaServed: commune
      ? { '@type': 'City', name: commune.name }
      : communes.map((c) => ({ '@type': 'City', name: c.name })),
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
      name: e.question[lang],
      acceptedAnswer: { '@type': 'Answer', text: e.answer[lang] },
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
