/**
 * The six services.
 *
 * `taxCreditEligible` is the ONLY thing that decides whether the 50% credit is
 * shown. It mirrors docs/04-compliance-sap.md exactly. If the two disagree,
 * this file is wrong.
 *
 * Facade and bins are false. That is a legal position, not a design choice.
 */

export interface Service {
  slug: string;
  /** H1 and nav label. */
  name: string;
  /** Used inside sentences: "un {inSentence} à Arpajon". */
  inSentence: string;
  /** Head term this page targets. */
  headTerm: string;
  /** Two-sentence summary for cards and meta descriptions. */
  summary: string;
  /** SAP eligibility. Never override at page level. */
  taxCreditEligible: boolean;
  /** One sentence explaining the eligibility decision, shown on the page. */
  eligibilityNote: string;
  /** Shown to B2B on /professionnels. */
  b2b: boolean;
  /** Pricing basis. TODO(human): confirm real numbers with the client. */
  pricing: {
    basis: string;
    fromEur: number | null;
    note: string;
  };
  /** Longtail seeds, used for internal linking and copy, not for new routes. */
  longTail: string[];
}

export const services: Service[] = [
  {
    slug: 'vitres',
    name: 'Nettoyage de vitres',
    inSentence: 'nettoyage de vitres',
    headTerm: 'nettoyage de vitres',
    summary:
      "Vitres, baies vitrées, vérandas et fenêtres de toit, à l'intérieur comme à l'extérieur. Sans trace, avec des produits écologiques.",
    taxCreditEligible: true,
    eligibilityNote:
      "Le nettoyage de vitres au domicile d'un particulier relève des travaux ménagers et entre dans le dispositif Services à la Personne.",
    b2b: true,
    pricing: { basis: 'forfait maison', fromEur: null, note: 'TODO(human): confirmer' },
    longTail: ['laveur de vitres', 'lavage vitres maison', 'nettoyage baies vitrées', 'nettoyage véranda'],
  },
  {
    slug: 'terrasse',
    name: 'Nettoyage de terrasse',
    inSentence: 'nettoyage de terrasse',
    headTerm: 'nettoyage de terrasse',
    summary:
      'Démoussage et remise en état des dallages, pavés et bois. Nettoyage haute pression maîtrisé, sans abîmer le support.',
    taxCreditEligible: true,
    eligibilityNote:
      'Les terrasses et balcons font partie du logement au sens du dispositif Services à la Personne.',
    b2b: false,
    pricing: { basis: 'au m²', fromEur: null, note: 'TODO(human): confirmer' },
    longTail: ['démoussage terrasse', 'nettoyage dallage', 'nettoyage terrasse bois'],
  },
  {
    slug: 'menage',
    name: 'Ménage à domicile',
    inSentence: 'ménage',
    headTerm: 'ménage à domicile',
    summary:
      "Entretien courant ou grand ménage ponctuel. Sols, surfaces, sanitaires, avec des produits respectueux de l'environnement.",
    taxCreditEligible: true,
    eligibilityNote:
      "L'entretien de la maison est l'activité centrale du dispositif Services à la Personne.",
    b2b: false,
    pricing: { basis: 'horaire', fromEur: null, note: 'TODO(human): confirmer' },
    longTail: ['aide ménagère', 'entretien maison', 'grand ménage'],
  },
  {
    slug: 'volets-portes',
    name: 'Nettoyage de volets et portes',
    inSentence: 'nettoyage de volets et portes',
    headTerm: 'nettoyage de volets',
    summary:
      "Volets battants, volets roulants, portes d'entrée et encadrements. Dépoussiérage, dégraissage, remise en état.",
    taxCreditEligible: true,
    eligibilityNote:
      "Il s'agit d'entretien courant du logement, sans matériel spécialisé, donc éligible au dispositif.",
    b2b: false,
    pricing: { basis: 'forfait', fromEur: null, note: 'TODO(human): confirmer' },
    longTail: ['nettoyage volets roulants', 'nettoyage portes', 'nettoyage encadrements'],
  },
  {
    slug: 'facade',
    name: 'Nettoyage de façade',
    inSentence: 'nettoyage de façade',
    headTerm: 'nettoyage de façade',
    summary:
      'Démoussage et nettoyage des murs extérieurs, crépi et bardage. Intervention technique sur devis après visite.',
    // NOT eligible. Exterior wall cleaning is excluded from the SAP scheme.
    taxCreditEligible: false,
    eligibilityNote:
      "Le nettoyage des murs extérieurs est exclu du dispositif Services à la Personne : il relève des travaux du bâtiment. Aucun crédit d'impôt ne s'applique à cette prestation.",
    b2b: true,
    pricing: { basis: 'sur devis', fromEur: null, note: 'visite préalable' },
    longTail: ['démoussage façade', 'nettoyage crépi', 'nettoyage bardage'],
  },
  {
    slug: 'poubelles',
    name: 'Nettoyage de poubelles',
    inSentence: 'nettoyage de poubelles',
    headTerm: 'nettoyage de poubelles',
    summary:
      'Lavage et désinfection des bacs et conteneurs, à domicile ou en copropriété. Élimine les odeurs et les nuisibles.',
    // NOT eligible. Outside the listed household activities.
    taxCreditEligible: false,
    eligibilityNote:
      "Cette prestation ne figure pas dans la liste des activités Services à la Personne. Aucun crédit d'impôt ne s'applique.",
    b2b: true,
    pricing: { basis: 'par bac', fromEur: null, note: 'TODO(human): confirmer' },
    longTail: ['désinfection bacs', 'nettoyage conteneurs', 'lavage poubelles'],
  },
];

export const serviceSlugs = services.map((s) => s.slug);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export const eligibleServices = services.filter((s) => s.taxCreditEligible);
export const b2bServices = services.filter((s) => s.b2b);
