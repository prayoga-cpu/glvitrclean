/**
 * The six services.
 *
 * `taxCreditEligible` is the ONLY thing that decides whether the 50% credit is
 * shown. It mirrors docs/04-compliance-sap.md exactly. If the two disagree,
 * this file is wrong.
 *
 * Facade and bins are false. That is a legal position, not a design choice.
 * Eligibility is a property of the SERVICE, never of the language: the English
 * copy states exactly the same position as the French, and the `en` half of
 * `eligibilityNote` on facade/poubelles must stay a denial, not a claim.
 *
 * `slug` is shared by both languages and is never translated. See
 * src/i18n/config.ts for why.
 *
 * Keep `name` on a single line: scripts/check-metadata-unique.mjs parses this
 * file with a regex so it can run before `next build`.
 */

import type { Localized } from '@/i18n/config';

export interface Service {
  slug: string;
  /** H1 and nav label. */
  name: Localized;
  /** Used inside sentences: "un {inSentence} à Arpajon". */
  inSentence: Localized;
  /** Head term this page targets. */
  headTerm: Localized;
  /** Two-sentence summary for cards and meta descriptions. */
  summary: Localized;
  /** SAP eligibility. Never override at page level. */
  taxCreditEligible: boolean;
  /** One sentence explaining the eligibility decision, shown on the page. */
  eligibilityNote: Localized;
  /** Shown to B2B on /professionnels. */
  b2b: boolean;
  /** Pricing basis. TODO(human): confirm real numbers with the client. */
  pricing: {
    basis: Localized;
    fromEur: number | null;
    note: string;
  };
  /** Longtail seeds, used for internal linking and copy, not for new routes. */
  longTail: Localized<string[]>;
}

export const services: Service[] = [
  {
    slug: 'vitres',
    name: { fr: 'Nettoyage de vitres', en: 'Window cleaning' },
    inSentence: { fr: 'nettoyage de vitres', en: 'window cleaning' },
    headTerm: { fr: 'nettoyage de vitres', en: 'window cleaning' },
    summary: {
      fr: "Vitres, baies vitrées, vérandas et fenêtres de toit, à l'intérieur comme à l'extérieur. Sans trace, avec des produits écologiques.",
      en: 'Windows, patio doors, conservatories and roof windows, inside and out. Streak-free, using eco-friendly products.',
    },
    taxCreditEligible: true,
    eligibilityNote: {
      fr: "Le nettoyage de vitres au domicile d'un particulier relève des travaux ménagers et entre dans le dispositif Services à la Personne.",
      en: 'Cleaning windows in a private home counts as household work and falls within the Services à la Personne scheme.',
    },
    b2b: true,
    pricing: {
      basis: { fr: 'forfait maison', en: 'per-house flat rate' },
      fromEur: null,
      note: 'TODO(human): confirmer',
    },
    longTail: {
      fr: ['laveur de vitres', 'lavage vitres maison', 'nettoyage baies vitrées', 'nettoyage véranda'],
      en: ['window cleaner', 'house window washing', 'patio door cleaning', 'conservatory cleaning'],
    },
  },
  {
    slug: 'terrasse',
    name: { fr: 'Nettoyage de terrasse', en: 'Terrace cleaning' },
    inSentence: { fr: 'nettoyage de terrasse', en: 'terrace cleaning' },
    headTerm: { fr: 'nettoyage de terrasse', en: 'terrace cleaning' },
    summary: {
      fr: 'Démoussage et remise en état des dallages, pavés et bois. Nettoyage haute pression maîtrisé, sans abîmer le support.',
      en: 'Moss removal and restoration of paving, block paving and timber decking. Controlled pressure washing that will not damage the surface.',
    },
    taxCreditEligible: true,
    eligibilityNote: {
      fr: 'Les terrasses et balcons font partie du logement au sens du dispositif Services à la Personne.',
      en: 'Terraces and balconies count as part of the home under the Services à la Personne scheme.',
    },
    b2b: false,
    pricing: {
      basis: { fr: 'au m²', en: 'per m²' },
      fromEur: null,
      note: 'TODO(human): confirmer',
    },
    longTail: {
      fr: ['démoussage terrasse', 'nettoyage dallage', 'nettoyage terrasse bois'],
      en: ['terrace moss removal', 'patio slab cleaning', 'wooden decking cleaning'],
    },
  },
  {
    slug: 'menage',
    name: { fr: 'Ménage à domicile', en: 'Domestic housekeeping' },
    inSentence: { fr: 'ménage', en: 'housekeeping' },
    headTerm: { fr: 'ménage à domicile', en: 'domestic housekeeping' },
    summary: {
      fr: "Entretien courant ou grand ménage ponctuel. Sols, surfaces, sanitaires, avec des produits respectueux de l'environnement.",
      en: 'Regular upkeep or a one-off deep clean. Floors, surfaces and bathrooms, using environmentally responsible products.',
    },
    taxCreditEligible: true,
    eligibilityNote: {
      fr: "L'entretien de la maison est l'activité centrale du dispositif Services à la Personne.",
      en: 'Housekeeping is the core activity of the Services à la Personne scheme.',
    },
    b2b: false,
    pricing: {
      basis: { fr: 'horaire', en: 'hourly' },
      fromEur: null,
      note: 'TODO(human): confirmer',
    },
    longTail: {
      fr: ['aide ménagère', 'entretien maison', 'grand ménage'],
      en: ['home help', 'house cleaning', 'deep clean'],
    },
  },
  {
    slug: 'volets-portes',
    name: { fr: 'Nettoyage de volets et portes', en: 'Shutter and door cleaning' },
    inSentence: { fr: 'nettoyage de volets et portes', en: 'shutter and door cleaning' },
    headTerm: { fr: 'nettoyage de volets', en: 'shutter cleaning' },
    summary: {
      fr: "Volets battants, volets roulants, portes d'entrée et encadrements. Dépoussiérage, dégraissage, remise en état.",
      en: 'Hinged shutters, roller shutters, front doors and frames. Dusted, degreased and brought back to condition.',
    },
    taxCreditEligible: true,
    eligibilityNote: {
      fr: "Il s'agit d'entretien courant du logement, sans matériel spécialisé, donc éligible au dispositif.",
      en: 'This is routine upkeep of the home, with no specialist equipment, so it qualifies under the scheme.',
    },
    b2b: false,
    pricing: {
      basis: { fr: 'forfait', en: 'flat rate' },
      fromEur: null,
      note: 'TODO(human): confirmer',
    },
    longTail: {
      fr: ['nettoyage volets roulants', 'nettoyage portes', 'nettoyage encadrements'],
      en: ['roller shutter cleaning', 'door cleaning', 'window frame cleaning'],
    },
  },
  {
    slug: 'facade',
    name: { fr: 'Nettoyage de façade', en: 'Facade cleaning' },
    inSentence: { fr: 'nettoyage de façade', en: 'facade cleaning' },
    headTerm: { fr: 'nettoyage de façade', en: 'facade cleaning' },
    summary: {
      fr: 'Démoussage et nettoyage des murs extérieurs, crépi et bardage. Intervention technique sur devis après visite.',
      en: 'Moss removal and cleaning of exterior walls, render and cladding. A technical job, quoted after a site visit.',
    },
    // NOT eligible. Exterior wall cleaning is excluded from the SAP scheme.
    taxCreditEligible: false,
    eligibilityNote: {
      fr: "Le nettoyage des murs extérieurs est exclu du dispositif Services à la Personne : il relève des travaux du bâtiment. Aucun crédit d'impôt ne s'applique à cette prestation.",
      en: 'Cleaning exterior walls is excluded from the Services à la Personne scheme: it counts as building work. No tax credit applies to this service.',
    },
    b2b: true,
    pricing: {
      basis: { fr: 'sur devis', en: 'quoted individually' },
      fromEur: null,
      note: 'visite préalable',
    },
    longTail: {
      fr: ['démoussage façade', 'nettoyage crépi', 'nettoyage bardage'],
      en: ['facade moss removal', 'render cleaning', 'cladding cleaning'],
    },
  },
  {
    slug: 'poubelles',
    name: { fr: 'Nettoyage de poubelles', en: 'Bin cleaning' },
    inSentence: { fr: 'nettoyage de poubelles', en: 'bin cleaning' },
    headTerm: { fr: 'nettoyage de poubelles', en: 'bin cleaning' },
    summary: {
      fr: 'Lavage et désinfection des bacs et conteneurs, à domicile ou en copropriété. Élimine les odeurs et les nuisibles.',
      en: 'Washing and disinfecting wheelie bins and containers, at home or for a managed block. Clears odours and deters pests.',
    },
    // NOT eligible. Outside the listed household activities.
    taxCreditEligible: false,
    eligibilityNote: {
      fr: "Cette prestation ne figure pas dans la liste des activités Services à la Personne. Aucun crédit d'impôt ne s'applique.",
      en: 'This service is not on the list of Services à la Personne activities. No tax credit applies.',
    },
    b2b: true,
    pricing: {
      basis: { fr: 'par bac', en: 'per bin' },
      fromEur: null,
      note: 'TODO(human): confirmer',
    },
    longTail: {
      fr: ['désinfection bacs', 'nettoyage conteneurs', 'lavage poubelles'],
      en: ['bin disinfection', 'container cleaning', 'wheelie bin washing'],
    },
  },
];

export const serviceSlugs = services.map((s) => s.slug);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export const eligibleServices = services.filter((s) => s.taxCreditEligible);
export const b2bServices = services.filter((s) => s.b2b);
