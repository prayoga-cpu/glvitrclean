/**
 * FAQ entries. Every `answer` MUST open with one complete standalone sentence
 * that answers the question, in BOTH languages. Answer engines quote that first
 * sentence and nothing else. Elaboration goes after it.
 *
 * See docs/06-seo-aeo-geo.md.
 *
 * COMPLIANCE: `facade-credit` renders on /services/facade/, which is a
 * forbidden route in scripts/check-compliance.mjs. Its answer is a denial in
 * both languages and must stay one. Do not let the English drift into a phrase
 * that reads as a claim ("50% tax credit", "you benefit"): the guard greps the
 * exported HTML and will fail the build. See CLAUDE.md rule 1.
 */

import type { Localized } from '@/i18n/config';

export interface FaqEntry {
  id: string;
  question: Localized;
  answer: Localized;
  /** Route slugs this entry appears on. 'credit-impot' or a service slug. */
  pages: string[];
}

export const faq: FaqEntry[] = [
  {
    id: 'vitres-credit',
    question: {
      fr: "Le nettoyage de vitres ouvre-t-il droit au crédit d'impôt ?",
      en: 'Does window cleaning qualify for the tax credit?',
    },
    answer: {
      fr: "Oui, le nettoyage de vitres au domicile d'un particulier ouvre droit à un crédit d'impôt de 50 %, à condition que la prestation soit facturée par un organisme déclaré Services à la Personne. Le nettoyage fait partie des travaux ménagers couverts par le dispositif. La réduction s'applique au montant payé, dans la limite du plafond annuel du foyer.",
      en: 'Yes, window cleaning in a private home qualifies for a 50% income tax credit, provided the work is invoiced by a body registered under the Services à la Personne scheme. Cleaning is one of the household tasks the scheme covers. The credit applies to the amount actually paid, up to the household annual cap.',
    },
    pages: ['credit-impot', 'vitres'],
  },
  {
    id: 'avance-immediate',
    question: {
      fr: "Comment fonctionne l'avance immédiate de l'URSSAF ?",
      en: "How does URSSAF's immediate advance work?",
    },
    answer: {
      fr: "L'avance immédiate permet de ne payer que 50 % de la facture au moment de la prestation, au lieu d'avancer la totalité et d'attendre la déclaration de revenus. L'URSSAF verse directement l'autre moitié au prestataire. Le service est gratuit et facultatif, mais il n'est disponible que si le prestataire est inscrit sur la plateforme Tiers de Prestation.",
      en: 'The immediate advance lets you pay only 50% of the invoice at the time of the job, instead of paying in full and waiting until your tax return. URSSAF pays the other half straight to the provider. The service is free and optional, but it is only available if the provider is registered on the Tiers de Prestation platform.',
    },
    pages: ['credit-impot'],
  },
  {
    id: 'facade-credit',
    question: {
      fr: "Le nettoyage de façade est-il éligible au crédit d'impôt ?",
      en: 'Is facade cleaning eligible for the tax credit?',
    },
    answer: {
      fr: "Non, le nettoyage de façade n'ouvre pas droit au crédit d'impôt Services à la Personne. Le dispositif couvre l'entretien du logement, y compris les balcons et terrasses, mais exclut explicitement le nettoyage des murs extérieurs, qui relève des travaux du bâtiment. Une entreprise qui vous annonce 50 % sur un ravalement ou un démoussage de façade se trompe, ou vous trompe.",
      en: 'No, facade cleaning does not qualify under the Services à la Personne scheme. The scheme covers upkeep of the home, including balconies and terraces, but explicitly excludes cleaning exterior walls, which counts as building work. A company that quotes you half price on rendering or facade moss removal is either mistaken or misleading you.',
    },
    pages: ['credit-impot', 'facade'],
  },
  {
    id: 'plafond',
    question: {
      fr: "Quel est le plafond du crédit d'impôt Services à la Personne ?",
      en: 'What is the cap on the Services à la Personne tax credit?',
    },
    answer: {
      fr: "Le plafond général est de 6 000 € de dépenses par an et par foyer fiscal, soit 3 000 € de crédit d'impôt. Ce plafond couvre l'ensemble des services à la personne du foyer, pas seulement le nettoyage. Des majorations existent selon la composition du foyer.",
      en: 'The general cap is €6,000 of spending per year per tax household, which works out at €3,000 of credit. That cap covers all of the household’s personal services, not just cleaning. Higher limits apply depending on the make-up of the household.',
    },
    pages: ['credit-impot'],
  },
  {
    id: 'imposable',
    question: {
      fr: 'Faut-il être imposable pour bénéficier des 50 % ?',
      en: 'Do you have to be a taxpayer to get the 50%?',
    },
    answer: {
      fr: "Non, il s'agit d'un crédit d'impôt et non d'une réduction, donc les foyers non imposables reçoivent la somme par virement. La distinction compte : une réduction d'impôt ne profite qu'à ceux qui paient l'impôt, un crédit bénéficie à tout le monde.",
      en: 'No, this is a tax credit rather than a tax reduction, so households that pay no income tax receive the money as a bank transfer. The distinction matters: a reduction only helps those who owe tax, whereas a credit reaches everyone.',
    },
    pages: ['credit-impot'],
  },
  {
    id: 'prix-vitres',
    question: {
      fr: 'Combien coûte un nettoyage de vitres pour une maison ?',
      en: 'How much does window cleaning cost for a house?',
    },
    answer: {
      fr: "Comptez un forfait de base auquel s'ajoute un montant par vitre, selon le nombre de fenêtres, la hauteur et l'accès. Les baies vitrées, vérandas et fenêtres de toit demandent plus de temps et de matériel qu'une fenêtre de plain-pied. Le devis est gratuit et se fait après un point rapide sur vos surfaces.",
      en: 'Expect a base rate plus an amount per pane, depending on the number of windows, the height and the access. Patio doors, conservatories and roof windows take more time and equipment than a ground-floor window. The quote is free and follows a quick run-through of your surfaces.',
    },
    pages: ['vitres'],
  },
];

export function faqForPage(pageId: string): FaqEntry[] {
  return faq.filter((f) => f.pages.includes(pageId));
}
