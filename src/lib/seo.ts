import type { Metadata } from 'next';
import { SITE_URL, company } from '@/data/company';
import { getService } from '@/data/services';
import { getCommune } from '@/data/communes';
import type { RouteDescriptor } from '@/lib/routes';
import { DEFAULT_LANG, OG_LOCALE, localePath, type Lang } from '@/i18n/config';

const BRAND = "GLVITR'CLEAN";

export interface SeoFields {
  title: string;
  description: string;
  canonical: string;
  /** Absolute URL of this page in each language, for hreflang. */
  alternates: Record<Lang, string>;
  lang: Lang;
}

/** Absolute URL for a locale-free path in a given language. */
export function absoluteUrl(basePath: string, lang: Lang): string {
  const p = localePath(basePath, lang);
  return `${SITE_URL}${p === '/' ? '/' : `${p}/`}`;
}

/**
 * The single generator for titles and descriptions, in both languages.
 * Never hand-write a metadata export on a route this can serve.
 *
 * Uniqueness is enforced by scripts/check-metadata-unique.mjs across ALL 194
 * routes at once — French and English share one namespace — and fails the build
 * on any collision. That check exists because duplicate metadata left 39 of 51
 * pages unindexed on a previous project.
 */
export function seoFor(route: RouteDescriptor): SeoFields {
  const lang = route.lang;
  const common = {
    canonical: absoluteUrl(route.basePath, lang),
    alternates: { fr: absoluteUrl(route.basePath, 'fr'), en: absoluteUrl(route.basePath, 'en') },
    lang,
  };

  switch (route.kind) {
    case 'home':
      return {
        ...common,
        ...(lang === 'fr'
          ? {
              title: `Nettoyage vitres et terrasse en Essonne (91) | ${BRAND}`,
              description:
                "Nettoyage de vitres, terrasses, volets et ménage à domicile dans le sud de l'Essonne. Devis gratuit, produits écologiques, intervention rapide.",
            }
          : {
              title: `Window and terrace cleaning in the Essonne (91) | ${BRAND}`,
              description:
                'Window, terrace and shutter cleaning plus housekeeping across the south of the Essonne. Free quote, eco-friendly products, fast response.',
            }),
      };

    case 'service': {
      const s = getService(route.serviceSlug!);
      if (!s) throw new Error(`Unknown service: ${route.serviceSlug}`);
      return {
        ...common,
        ...(lang === 'fr'
          ? {
              title: `${s.name.fr} en Essonne (91) | ${BRAND}`,
              description: `${s.summary.fr} Intervention dans le sud de l'Essonne, devis gratuit.`,
            }
          : {
              title: `${s.name.en} in the Essonne (91) | ${BRAND}`,
              description: `${s.summary.en} Covering the south of the Essonne, free quote.`,
            }),
      };
    }

    case 'commune': {
      const c = getCommune(route.communeSlug!);
      if (!c) throw new Error(`Unknown commune: ${route.communeSlug}`);
      return {
        ...common,
        ...(lang === 'fr'
          ? {
              title: `Nettoyage à ${c.name} (91) | ${BRAND}`,
              description: `Entreprise de nettoyage à ${c.name}. Vitres, terrasses, volets, ménage et façades. Devis gratuit, réponse rapide.`,
            }
          : {
              title: `Cleaning in ${c.name} (91) | ${BRAND}`,
              description: `Cleaning company covering ${c.name}. Windows, terraces, shutters, housekeeping and facades. Free quote, fast reply.`,
            }),
      };
    }

    case 'commune-service': {
      const c = getCommune(route.communeSlug!);
      const s = getService(route.serviceSlug!);
      if (!c || !s) throw new Error(`Unknown pair: ${route.communeSlug}/${route.serviceSlug}`);
      return {
        ...common,
        // Brand omitted on the 72 deepest pages per language: these are won on
        // query match, not brand recall, and the suffix would push every title
        // past 60 chars.
        ...(lang === 'fr'
          ? {
              title: `${s.name.fr} à ${c.name} (91)`,
              // Description varies by BOTH service and commune, so no two collide.
              description: `${s.name.fr} à ${c.name} et alentours. ${s.summary.fr.split('.')[0]}. Devis gratuit au ${company.phoneDisplay}.`,
            }
          : {
              title: `${s.name.en} in ${c.name} (91)`,
              description: `${s.name.en} in ${c.name} and the surrounding area. ${s.summary.en.split('.')[0]}. Free quote on ${company.phoneDisplay}.`,
            }),
      };
    }

    case 'fixed':
      return { ...common, ...fixedSeo(route.basePath, lang) };
  }
}

type TitleAndDescription = Pick<SeoFields, 'title' | 'description'>;

function fixedSeo(basePath: string, lang: Lang): TitleAndDescription {
  const fr: Record<string, TitleAndDescription> = {
    '/credit-impot': {
      title: `Crédit d'impôt 50 % sur le nettoyage à domicile | ${BRAND}`,
      description:
        "Comment fonctionne le crédit d'impôt Services à la Personne, quelles prestations de nettoyage y ouvrent droit, et lesquelles en sont exclues.",
    },
    '/professionnels': {
      title: `Nettoyage pour professionnels en Essonne (91) | ${BRAND}`,
      description:
        "Vitrines, bureaux, façades et conteneurs. Interventions ponctuelles ou régulières pour commerces et entreprises du sud de l'Essonne.",
    },
    '/devis': {
      title: `Devis gratuit de nettoyage en Essonne | ${BRAND}`,
      description: `Demandez un devis gratuit pour le nettoyage de vos vitres, terrasse ou logement. Réponse rapide, ou appelez le ${company.phoneDisplay}.`,
    },
    '/realisations': {
      title: `Nos réalisations de nettoyage en Essonne | ${BRAND}`,
      description:
        'Photos avant et après de chantiers réalisés dans le sud de l’Essonne : vitres, terrasses, façades et volets.',
    },
    '/mentions-legales': {
      title: `Mentions légales | ${BRAND}`,
      description: `Mentions légales, éditeur, hébergeur et informations réglementaires du site ${BRAND}.`,
    },
    '/confidentialite': {
      title: `Politique de confidentialité | ${BRAND}`,
      description: `Traitement des données personnelles collectées via le formulaire de devis de ${BRAND}.`,
    },
  };

  const en: Record<string, TitleAndDescription> = {
    '/credit-impot': {
      title: `50% tax credit on home cleaning in France | ${BRAND}`,
      description:
        'How the French Services à la Personne tax credit works, which cleaning services qualify for it, and which are excluded.',
    },
    '/professionnels': {
      title: `Commercial cleaning in the Essonne (91) | ${BRAND}`,
      description:
        'Shopfronts, offices, facades and waste containers. One-off or recurring work for shops and businesses in the south of the Essonne.',
    },
    '/devis': {
      title: `Free cleaning quote in the Essonne | ${BRAND}`,
      description: `Ask for a free quote to clean your windows, terrace or home. Fast reply, or call ${company.phoneDisplay}.`,
    },
    '/realisations': {
      title: `Our cleaning work in the Essonne | ${BRAND}`,
      description:
        'Before and after photos of jobs completed across the south of the Essonne: windows, terraces, facades and shutters.',
    },
    '/mentions-legales': {
      title: `Legal notice | ${BRAND}`,
      description: `Legal notice, publisher, hosting provider and regulatory information for the ${BRAND} website.`,
    },
    '/confidentialite': {
      title: `Privacy policy | ${BRAND}`,
      description: `How personal data collected through the ${BRAND} quote form is handled.`,
    },
  };

  const table = lang === 'fr' ? fr : en;
  const found = table[basePath];
  if (!found) throw new Error(`No SEO defined for fixed path: ${basePath} (${lang})`);
  return found;
}

/** Converts SeoFields into a Next.js Metadata object. */
export function toMetadata(fields: SeoFields): Metadata {
  return {
    title: fields.title,
    description: fields.description,
    alternates: {
      canonical: fields.canonical,
      // hreflang. x-default points at French: it is the primary market and the
      // page a search engine should fall back to for an unmatched locale.
      languages: {
        fr: fields.alternates.fr,
        en: fields.alternates.en,
        'x-default': fields.alternates[DEFAULT_LANG],
      },
    },
    openGraph: {
      title: fields.title,
      description: fields.description,
      url: fields.canonical,
      siteName: BRAND,
      locale: OG_LOCALE[fields.lang],
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export function buildMetadata(route: RouteDescriptor): Metadata {
  return toMetadata(seoFor(route));
}
