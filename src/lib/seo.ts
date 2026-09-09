import type { Metadata } from 'next';
import { SITE_URL, company, TAX_CREDIT_PCT } from '@/data/company';
import { socialCards } from '@/data/brand';
import { getService } from '@/data/services';
import { getCommune } from '@/data/communes';
import type { RouteDescriptor } from '@/lib/routes';
import {
  DEFAULT_LANG,
  OG_LOCALE,
  localePath,
  otherLang,
  type Lang,
} from '@/i18n/config';

const BRAND = "GLVITR'CLEAN";

/**
 * Social preview card, one per edition. Paths and dimensions live in
 * src/data/brand.ts with the rest of the artwork, so a renamed file is one
 * edit; the reasoning for one card per edition rather than per route is
 * recorded there.
 */
const OG_IMAGE: Record<Lang, string> = {
  fr: socialCards.fr,
  en: socialCards.en,
};
const OG_IMAGE_SIZE = { width: socialCards.width, height: socialCards.height };

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
              description: compose(
                firstSentence(s.summary.fr),
                "Intervention dans le sud de l'Essonne, devis gratuit.",
              ),
            }
          : {
              title: `${s.name.en} in the Essonne (91) | ${BRAND}`,
              description: compose(
                firstSentence(s.summary.en),
                'Covering the south of the Essonne, free quote.',
              ),
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
              description: compose(
                `Entreprise de nettoyage à ${c.name}.`,
                firstSentence(c.localAngle.fr),
                'Devis gratuit.',
              ),
            }
          : {
              title: `Cleaning in ${c.name} (91) | ${BRAND}`,
              description: compose(
                `Cleaning company covering ${c.name}.`,
                firstSentence(c.localAngle.en),
                'Free quote.',
              ),
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
              // First clause varies by BOTH service and commune, so no two
              // collide even when the tail clauses are dropped for length.
              description: compose(
                `${s.name.fr} à ${c.name} et alentours.`,
                firstSentence(s.summary.fr),
                `Devis gratuit au ${company.phoneDisplay}.`,
              ),
            }
          : {
              title: `${s.name.en} in ${c.name} (91)`,
              description: compose(
                `${s.name.en} in ${c.name} and the surrounding area.`,
                firstSentence(s.summary.en),
                `Free quote on ${company.phoneDisplay}.`,
              ),
            }),
      };
    }

    case 'fixed':
      return { ...common, ...fixedSeo(route.basePath, lang) };
  }
}

type TitleAndDescription = Pick<SeoFields, 'title' | 'description'>;

/**
 * Google truncates a snippet around 160 characters. 48 of the 194 descriptions
 * were running past it, which meant the closing call to action — the part that
 * earns the click — was the part being cut.
 */
const DESCRIPTION_MAX = 160;

/** First sentence of a summary, punctuation included. */
function firstSentence(text: string): string {
  const m = text.match(/^[^.!?]*[.!?]/);
  return (m ? m[0] : text).trim();
}

/**
 * Joins clauses in priority order and stops before the cap.
 *
 * The first clause is always kept — it carries the service and commune names
 * that make each of the 194 descriptions unique, so dropping it would collapse
 * pages together and fail `check:metadata`. Later clauses are decoration and
 * are dropped whole rather than cut mid-word.
 */
function compose(...clauses: string[]): string {
  const parts = clauses.filter(Boolean);
  let out = parts[0] ?? '';
  if (out.length > DESCRIPTION_MAX) {
    out = out.slice(0, out.lastIndexOf(' ', DESCRIPTION_MAX - 1)).replace(/[,;:]$/, '') + '…';
  }
  for (const clause of parts.slice(1)) {
    const next = `${out} ${clause}`;
    if (next.length > DESCRIPTION_MAX) break;
    out = next;
  }
  return out;
}

function fixedSeo(basePath: string, lang: Lang): TitleAndDescription {
  const fr: Record<string, TitleAndDescription> = {
    '/services': {
      title: `Nos prestations de nettoyage en Essonne (91) | ${BRAND}`,
      description:
        "Vitres, terrasses, ménage, volets, façades et poubelles, chez les particuliers comme chez les professionnels du sud de l'Essonne. Devis gratuit.",
    },
    '/zones': {
      title: `Zones d'intervention en Essonne (91) | ${BRAND}`,
      description:
        "Les communes du sud de l'Essonne où nous intervenons, sur le corridor N20 et RER C. Devis gratuit et sans engagement.",
    },
    '/credit-impot': {
      // The figure is read from TAX_CREDIT_RATE, never typed. CLAUDE.md rule 1.
      title: `Crédit d'impôt ${TAX_CREDIT_PCT} % sur le nettoyage à domicile | ${BRAND}`,
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
        // No before/after photos exist yet — STATUS item 6. Do not describe
        // imagery the page does not carry. CLAUDE.md rule 4.
        "Ce que comprend chaque prestation de nettoyage dans le sud de l'Essonne : vitres, terrasses, façades, volets et ménage.",
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
    '/services': {
      title: `Our cleaning services in the Essonne (91) | ${BRAND}`,
      description:
        'Windows, terraces, housekeeping, shutters, facades and bins, for private homes and businesses across the south of the Essonne. Free quote.',
    },
    '/zones': {
      title: `Where we work in the Essonne (91) | ${BRAND}`,
      description:
        'The towns we cover in the south of the Essonne, along the N20 and RER C corridor. Free quote, no obligation.',
    },
    '/credit-impot': {
      title: `${TAX_CREDIT_PCT}% tax credit on home cleaning in France | ${BRAND}`,
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
        // See the French note above: no photos exist yet. CLAUDE.md rule 4.
        'What each cleaning job covers across the south of the Essonne: windows, terraces, facades, shutters and housekeeping.',
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
      // Tells Facebook and friends the other edition exists.
      alternateLocale: OG_LOCALE[otherLang(fields.lang)],
      type: 'website',
      images: [
        {
          url: OG_IMAGE[fields.lang],
          ...OG_IMAGE_SIZE,
          alt: BRAND,
        },
      ],
    },
    // Without an explicit block Next back-fills twitter:* from openGraph and
    // leaves twitter:card as 'summary', which renders a thumbnail instead of
    // the wide card the 1200x630 image is drawn for.
    twitter: {
      card: 'summary_large_image',
      title: fields.title,
      description: fields.description,
      images: [OG_IMAGE[fields.lang]],
    },
    robots: { index: true, follow: true },
  };
}

export function buildMetadata(route: RouteDescriptor): Metadata {
  return toMetadata(seoFor(route));
}
