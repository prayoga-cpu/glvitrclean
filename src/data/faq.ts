/**
 * FAQ entries. Every `answer` MUST open with one complete standalone sentence
 * that answers the question. Answer engines quote that first sentence and
 * nothing else. Elaboration goes after it.
 *
 * See docs/06-seo-aeo-geo.md.
 */

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  /** Route slugs this entry appears on. 'credit-impot' or a service slug. */
  pages: string[];
}

export const faq: FaqEntry[] = [
  {
    id: 'vitres-credit',
    question: "Le nettoyage de vitres ouvre-t-il droit au crédit d'impôt ?",
    answer:
      "Oui, le nettoyage de vitres au domicile d'un particulier ouvre droit à un crédit d'impôt de 50 %, à condition que la prestation soit facturée par un organisme déclaré Services à la Personne. Le nettoyage fait partie des travaux ménagers couverts par le dispositif. La réduction s'applique au montant payé, dans la limite du plafond annuel du foyer.",
    pages: ['credit-impot', 'vitres'],
  },
  {
    id: 'avance-immediate',
    question: "Comment fonctionne l'avance immédiate de l'URSSAF ?",
    answer:
      "L'avance immédiate permet de ne payer que 50 % de la facture au moment de la prestation, au lieu d'avancer la totalité et d'attendre la déclaration de revenus. L'URSSAF verse directement l'autre moitié au prestataire. Le service est gratuit et facultatif, mais il n'est disponible que si le prestataire est inscrit sur la plateforme Tiers de Prestation.",
    pages: ['credit-impot'],
  },
  {
    id: 'facade-credit',
    question: "Le nettoyage de façade est-il éligible au crédit d'impôt ?",
    answer:
      "Non, le nettoyage de façade n'ouvre pas droit au crédit d'impôt Services à la Personne. Le dispositif couvre l'entretien du logement, y compris les balcons et terrasses, mais exclut explicitement le nettoyage des murs extérieurs, qui relève des travaux du bâtiment. Une entreprise qui vous annonce 50 % sur un ravalement ou un démoussage de façade se trompe, ou vous trompe.",
    pages: ['credit-impot', 'facade'],
  },
  {
    id: 'plafond',
    question: "Quel est le plafond du crédit d'impôt Services à la Personne ?",
    answer:
      "Le plafond général est de 6 000 € de dépenses par an et par foyer fiscal, soit 3 000 € de crédit d'impôt. Ce plafond couvre l'ensemble des services à la personne du foyer, pas seulement le nettoyage. Des majorations existent selon la composition du foyer.",
    pages: ['credit-impot'],
  },
  {
    id: 'imposable',
    question: "Faut-il être imposable pour bénéficier des 50 % ?",
    answer:
      "Non, il s'agit d'un crédit d'impôt et non d'une réduction, donc les foyers non imposables reçoivent la somme par virement. La distinction compte : une réduction d'impôt ne profite qu'à ceux qui paient l'impôt, un crédit bénéficie à tout le monde.",
    pages: ['credit-impot'],
  },
  {
    id: 'prix-vitres',
    question: 'Combien coûte un nettoyage de vitres pour une maison ?',
    answer:
      "Comptez un forfait de base auquel s'ajoute un montant par vitre, selon le nombre de fenêtres, la hauteur et l'accès. Les baies vitrées, vérandas et fenêtres de toit demandent plus de temps et de matériel qu'une fenêtre de plain-pied. Le devis est gratuit et se fait après un point rapide sur vos surfaces.",
    pages: ['vitres'],
  },
];

export function faqForPage(pageId: string): FaqEntry[] {
  return faq.filter((f) => f.pages.includes(pageId));
}
