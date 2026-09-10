import type { Metadata } from 'next';
import { SITE_URL, company, TAX_CREDIT_PCT } from '@/data/company';
import { socialCards } from '@/data/brand';
import { getService, services, type Service } from '@/data/services';
import { getCommune, communes } from '@/data/communes';
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
 * The client's brand line, from src/data/company.ts. Client instruction,
 * 2026-09-10: the title must read "GLVITR'CLEAN | MULTI SERVICE".
 *
 * Head first, brand last, always. Google renders roughly the first 60
 * characters of a title, and the brand line is 31 of them with its separator,
 * so on the longest pages part of it will be cut in the SERP — the words that
 * win the click are the ones that must survive. The full line still reads in
 * the browser tab, in the social card and in the structured data.
 *
 * It goes on the 28 routes per language that already carried a brand suffix.
 * The 84 commune x service titles stay brand-free for the reason recorded on
 * that case below.
 */
const BRAND_LINE = company.brandLine;

/** `head | GLVITR'CLEAN | MULTI SERVICE`. */
function branded(head: string): string {
  return `${head} | ${BRAND_LINE}`;
}

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
 * The declared area is Essonne (91) AND Seine-et-Marne (77) since 2026-09-09.
 * Titles on the service and commune trees still say "Essonne (91)" alone: the
 * twelve commune pages ARE Essonne, and a title carrying both departments runs
 * past the point Google truncates. The second department is carried by the
 * descriptions, by the /zones title, and by the H1 suffix in the dictionary.
 *
 * Uniqueness is enforced by scripts/check-metadata-unique.mjs across every
 * route at once — French and English share one namespace — and fails the build
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
              title: branded('Nettoyage vitres et terrasse en Essonne (91)'),
              description:
                "Nettoyage de vitres, terrasses, volets et ménage à domicile en Essonne (91) et en Seine-et-Marne (77). Devis gratuit et sans engagement, produits écologiques.",
            }
          : {
              title: branded('Window and terrace cleaning in the Essonne (91)'),
              description:
                'Window, terrace and shutter cleaning plus housekeeping across the Essonne (91) and the Seine-et-Marne (77). Free quote, no obligation, eco-friendly products.',
            }),
      };

    case 'service': {
      const s = getService(route.serviceSlug!);
      if (!s) throw new Error(`Unknown service: ${route.serviceSlug}`);
      return {
        ...common,
        ...(lang === 'fr'
          ? {
              title: branded(`${s.name.fr} en Essonne (91)`),
              description: compose(
                firstSentence(s.summary.fr),
                fromPriceClause(s, 'fr'),
                "Intervention en Essonne (91) et en Seine-et-Marne (77), devis gratuit.",
              ),
            }
          : {
              title: branded(`${s.name.en} in the Essonne (91)`),
              description: compose(
                firstSentence(s.summary.en),
                fromPriceClause(s, 'en'),
                'Covering the Essonne (91) and the Seine-et-Marne (77), free quote.',
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
              title: branded(`Nettoyage à ${c.name} (91)`),
              description: compose(
                `Entreprise de nettoyage à ${c.name}.`,
                firstSentence(c.localAngle.fr),
                'Devis gratuit.',
              ),
            }
          : {
              title: branded(`Cleaning in ${c.name} (91)`),
              description: compose(
                `Cleaning services in ${c.name}.`,
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
                [`Devis gratuit au ${company.phoneDisplay}.`, 'Devis gratuit.'],
              ),
            }
          : {
              title: `${s.name.en} in ${c.name} (91)`,
              description: compose(
                `${s.name.en} in ${c.name} and nearby.`,
                firstSentence(s.summary.en),
                [`Free quote on ${company.phoneDisplay}.`, 'Free quote.'],
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

/**
 * "À partir de 120 €." — or nothing at all.
 *
 * `pricing.fromEur` is `null` on all seven services, so today this contributes
 * an empty clause that `compose()` filters out and no description changes. It is
 * here because the SPIC AND SPAN Paris page puts its rate in the meta
 * description itself ("Cleaning service from €26.90/h"), and a price in the
 * snippet is a click-through lever that works before the visit rather than
 * after it. See TODO.md, teardown 2, item 2.
 *
 * It is a middle clause on purpose. The first clause carries the service and
 * commune names that keep all 224 descriptions unique, and the last is the call
 * to action that earns the click; a price is worth having only if it does not
 * cost either of them, and `compose()` drops a middle clause whole when the
 * budget is tight.
 *
 * TODO(human): the figures. One per service in `src/data/services.ts`, and every
 * description picks it up with no edit here. CLAUDE.md rule 4: a range or a
 * floor with a stated basis, never a bare number.
 */
function fromPriceClause(service: Service, lang: Lang): string {
  const from = service.pricing.fromEur;
  if (from === null) return '';
  return lang === 'fr' ? `À partir de ${from} €.` : `From €${from}.`;
}

/** First sentence of a summary, punctuation included. */
function firstSentence(text: string): string {
  const m = text.match(/^[^.!?]*[.!?]/);
  return (m ? m[0] : text).trim();
}

/**
 * Joins clauses in priority order and stops before the cap.
 *
 * The first clause is always kept — it carries the service and commune names
 * that make each of the 224 descriptions unique, so dropping it would collapse
 * pages together and fail `check:metadata`.
 *
 * The LAST clause is the call to action, and it is what earns the click, so it
 * is not simply whatever happens to fit last: room for it is reserved before
 * the middle clauses are allowed to compete for the budget. Until 2026-09-10 it
 * was not, and 19 of the 168 commune x service descriptions — every solar-panel
 * and bin page in English among them — shipped with the closing "Devis gratuit"
 * silently dropped. Nothing failed: the description was still unique and still
 * under the cap, just missing the only line in it that asks for the job.
 *
 * A clause may be given as an array of alternatives, longest first; the first
 * one that fits is used. That is how the deep pages keep a call to action at
 * all: the phone-number version when there is room, the bare one when there is
 * not.
 */
type Clause = string | readonly string[];

function compose(...clauses: Clause[]): string {
  const parts = clauses
    .map((c) => (typeof c === 'string' ? [c] : [...c]).filter(Boolean))
    .filter((alts) => alts.length > 0);

  const [head, ...rest] = parts;
  if (!head) return '';

  let out = head[0] ?? '';
  if (out.length > DESCRIPTION_MAX) {
    out = out.slice(0, out.lastIndexOf(' ', DESCRIPTION_MAX - 1)).replace(/[,;:]$/, '') + '…';
  }

  // The shortest form of the closing clause, held back out of the budget while
  // the middle clauses are fitted.
  const closing = rest[rest.length - 1];
  const reserve = closing ? 1 + Math.min(...closing.map((alt) => alt.length)) : 0;

  rest.forEach((alts, i) => {
    const budget = DESCRIPTION_MAX - (i === rest.length - 1 ? 0 : reserve);
    const fits = alts.find((alt) => out.length + 1 + alt.length <= budget);
    if (fits) out = `${out} ${fits}`;
  });

  return out;
}

function fixedSeo(basePath: string, lang: Lang): TitleAndDescription {
  const fr: Record<string, TitleAndDescription> = {
    '/services': {
      title: branded('Prestations de nettoyage en Essonne (91)'),
      description:
        // Counted, never typed: an eighth service must not leave this line
        // claiming seven. Same reason the tax rate is read from company.ts.
        `${services.length} prestations : nettoyage de vitres, terrasses, ménage à domicile, volets, façades, panneaux solaires et poubelles, en Essonne (91) et en Seine-et-Marne (77).`,
    },
    '/zones': {
      title: branded('Nettoyage en Essonne (91) et Seine-et-Marne (77)'),
      description:
        // The count is derived for the same reason as /services above. Note it
        // says "d'Essonne": the day a Seine-et-Marne town joins communes.ts,
        // this sentence needs rewording, not just recounting.
        `Les ${communes.length} communes d'Essonne où nous intervenons, de Montlhéry à Étampes le long de la N20 et du RER C, et notre secteur en Seine-et-Marne (77). Devis gratuit.`,
    },
    '/credit-impot': {
      // The figure is read from TAX_CREDIT_RATE, never typed. CLAUDE.md rule 1.
      title: branded(`Crédit d'impôt ${TAX_CREDIT_PCT} % : nettoyage à domicile`),
      description:
        "Vitres, terrasse, ménage, volets : le nettoyage qui ouvre droit au crédit d'impôt Services à la Personne, ce qui en est exclu, et le plafond annuel.",
    },
    '/professionnels': {
      title: branded('Nettoyage pour professionnels en Essonne'),
      description:
        "Nettoyage de vitrines, bureaux, parties communes et façades en Essonne (91) et en Seine-et-Marne (77). Ponctuel ou régulier, sans sous-traitance, devis gratuit.",
    },
    '/devis': {
      title: branded('Devis gratuit de nettoyage en Essonne'),
      description: `Demandez un devis gratuit et sans engagement pour le nettoyage de vos vitres, terrasse ou logement. Ou appelez directement l'équipe au ${company.phoneDisplay}.`,
    },
    '/realisations': {
      title: branded('Réalisations de nettoyage en Essonne'),
      description:
        // No before/after photos exist yet — STATUS item 6. Do not describe
        // imagery the page does not carry. CLAUDE.md rule 4.
        "Ce que comprend chaque prestation : vitres, terrasses, façades, panneaux solaires, volets et ménage. Chaque chantier commence par un devis écrit et gratuit.",
    },
    '/mentions-legales': {
      title: branded('Mentions légales'),
      description: `Mentions légales, éditeur, hébergeur et informations réglementaires du site ${BRAND}.`,
    },
    '/confidentialite': {
      title: branded('Politique de confidentialité'),
      description: `Traitement des données personnelles collectées via le formulaire de devis de ${BRAND}.`,
    },
  };

  const en: Record<string, TitleAndDescription> = {
    '/services': {
      title: branded('Cleaning services in the Essonne (91)'),
      description:
        'Windows, terraces, housekeeping, shutters, facades, solar panels and bins, across the Essonne (91) and the Seine-et-Marne (77). Free quote.',
    },
    '/zones': {
      title: branded('Cleaning in the Essonne and the Seine-et-Marne'),
      description:
        `The ${communes.length} towns we cover in the Essonne, from Montlhéry to Étampes along the N20 and RER C corridor, plus our Seine-et-Marne (77) area. Free quote, no obligation.`,
    },
    '/credit-impot': {
      title: branded(`${TAX_CREDIT_PCT}% tax credit on home cleaning in France`),
      description:
        'Windows, terraces, housekeeping, shutters: what qualifies for the French Services à la Personne tax credit, what is excluded, and the annual cap.',
    },
    '/professionnels': {
      title: branded('Commercial cleaning in the Essonne (91)'),
      description:
        'Cleaning for shopfronts, offices, communal areas and facades across the Essonne and the Seine-et-Marne. One-off or regular, no subcontractors, free quote.',
    },
    '/devis': {
      title: branded('Free cleaning quote in the Essonne'),
      description: `Ask for a free, no-obligation quote to clean your windows, terrace or home. Or call ${company.phoneDisplay} and speak to the team directly.`,
    },
    '/realisations': {
      title: branded('Our cleaning work in the Essonne'),
      description:
        // See the French note above: no photos exist yet. CLAUDE.md rule 4.
        'What each cleaning service actually covers: windows, terraces, facades, solar panels, shutters and housekeeping. Every job starts with a free written quote.',
    },
    '/mentions-legales': {
      title: branded('Legal notice'),
      description: `Legal notice, publisher, hosting provider and regulatory information for the ${BRAND} website.`,
    },
    '/confidentialite': {
      title: branded('Privacy policy'),
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
      // The client's brand line, not the bare name: og:site_name is one of the
      // signals Google reads for the site name it prints above a result.
      siteName: BRAND_LINE,
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
