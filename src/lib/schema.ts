import { SITE_URL, company, sapVerified } from '@/data/company';
import { communes } from '@/data/communes';
import type { Service } from '@/data/services';
import type { Commune } from '@/data/communes';
import type { FaqEntry } from '@/data/faq';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = Record<string, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

const BUSINESS_ID = `${SITE_URL}/#business`;

/**
 * LocalBusiness. Service-area business, so no public street address is emitted.
 * `AggregateRating` is deliberately absent. Do not add it until real reviews
 * exist. See CLAUDE.md rule 4.
 */
export function localBusinessSchema(): Json {
  const node: Json = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': BUSINESS_ID,
    name: company.legalName,
    url: `${SITE_URL}/`,
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

export function serviceSchema(service: Service, commune?: Commune): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: commune ? `${service.name} à ${commune.name}` : service.name,
    description: service.summary,
    serviceType: service.headTerm,
    provider: { '@id': BUSINESS_ID },
    areaServed: commune
      ? { '@type': 'City', name: commune.name }
      : communes.map((c) => ({ '@type': 'City', name: c.name })),
  };
}

export function faqSchema(entries: FaqEntry[]): Json | null {
  if (entries.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: e.question,
      acceptedAnswer: { '@type': 'Answer', text: e.answer },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
