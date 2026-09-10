/**
 * FAQ entries. Every `answer` MUST open with one complete standalone sentence
 * that answers the question, in BOTH languages. Answer engines quote that first
 * sentence and nothing else. Elaboration goes after it.
 *
 * See docs/06-seo-aeo-geo.md.
 *
 * COMPLIANCE: `facade-credit`, `panneaux-credit` and `poubelles-credit` render
 * on /services/facade/, /services/panneaux-solaires/ and /services/poubelles/,
 * which are forbidden routes in scripts/check-compliance.mjs. Their answers are
 * denials in both languages and must stay denials. Do not let the English drift into a phrase that reads as a
 * claim ("50% tax credit", "you benefit"): the guard greps the exported HTML and
 * will fail the build. Every sentence that raises the topic on those three pages
 * has to carry the denial itself. See CLAUDE.md rule 1.
 */

import type { Localized } from '@/i18n/config';
import { TAX_CREDIT_PCT } from '@/data/company';

export interface FaqEntry {
  id: string;
  question: Localized;
  answer: Localized;
  /** Route slugs this entry appears on. 'credit-impot' or a service slug. */
  pages: string[];
}

/**
 * Resolves the `{pct}` placeholder against TAX_CREDIT_RATE.
 *
 * CLAUDE.md rule 1: the figure may never be static text. Answers that need it
 * write `{pct}` and every render path — the <Faq /> component and faqSchema()
 * — passes the string through here, so the rate is still switchable in one
 * edit to src/data/company.ts.
 */
export function resolveFaqText(text: string): string {
  return text.replace(/\{pct\}/g, String(TAX_CREDIT_PCT));
}

export const faq: FaqEntry[] = [
  {
    id: 'vitres-credit',
    question: {
      fr: "Le nettoyage de vitres ouvre-t-il droit au crédit d'impôt ?",
      en: 'Does window cleaning qualify for the tax credit?',
    },
    answer: {
      fr: "Oui, le nettoyage de vitres au domicile d'un particulier ouvre droit à un crédit d'impôt de {pct} %, à condition que la prestation soit facturée par un organisme déclaré Services à la Personne. Le nettoyage fait partie des travaux ménagers couverts par le dispositif. Le crédit s'applique au montant payé, dans la limite du plafond annuel du foyer.",
      en: 'Yes, window cleaning in a private home qualifies for a {pct}% income tax credit, provided the work is invoiced by a provider registered under the Services à la Personne scheme. Cleaning is one of the household tasks the scheme covers. The credit applies to the amount actually paid, up to the household annual cap.',
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
      fr: "L'avance immédiate permet de ne payer que {pct} % de la facture au moment de la prestation, au lieu d'avancer la totalité et d'attendre la déclaration de revenus. L'URSSAF verse directement l'autre moitié au prestataire. Le service est gratuit et facultatif, mais il n'est disponible que si le prestataire est inscrit sur la plateforme Tiers de Prestation.",
      en: 'The immediate advance, or avance immédiate, lets you pay only {pct}% of the invoice at the time of the job, rather than paying in full and waiting for your tax return. URSSAF pays the other half straight to the provider. The service is free and optional, but it is only available if the provider is registered on the Tiers de Prestation platform.',
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
      fr: "Non, le nettoyage de façade n'ouvre pas droit au crédit d'impôt Services à la Personne. Le dispositif couvre l'entretien du logement, y compris les balcons et terrasses, mais exclut explicitement le nettoyage des murs extérieurs, qui relève des travaux du bâtiment. Une entreprise qui vous annonce {pct} % sur un ravalement ou un démoussage de façade se trompe, ou vous trompe.",
      en: 'No, facade cleaning does not qualify for the French Services à la Personne tax credit. The scheme covers upkeep of the home, including balconies and terraces, but explicitly excludes cleaning exterior walls, which counts as building work. A company that offers you {pct}% off a rendering job or facade moss removal is either mistaken or misleading you.',
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
      en: "The general cap is €6,000 of spending per year per tax household, which works out at €3,000 of credit. That cap covers all of the household's personal services, not just cleaning. Higher limits apply depending on the make-up of the household.",
    },
    pages: ['credit-impot'],
  },
  {
    id: 'imposable',
    question: {
      fr: 'Faut-il être imposable pour bénéficier des {pct} % ?',
      en: 'Do you have to be a taxpayer to get the {pct}%?',
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
      fr: "Le nettoyage de vitres d'une maison se facture au forfait : un montant de base, plus un montant par vitre, selon le nombre de fenêtres, la hauteur et l'accès. Les baies vitrées, vérandas et fenêtres de toit demandent plus de temps et de matériel qu'une fenêtre de plain-pied. Le devis est gratuit et se fait après un point rapide sur vos surfaces.",
      en: 'Window cleaning for a house is quoted as a flat rate: a base amount plus an amount per pane, depending on the number of windows, their height and the access. Patio doors, conservatories and roof windows take more time and equipment than a ground-floor window. The quote is free and follows a quick run-through of your surfaces.',
    },
    pages: ['vitres'],
  },
  {
    id: 'terrasse-support',
    question: {
      fr: 'Le nettoyage haute pression abîme-t-il la terrasse ?',
      en: 'Does pressure washing damage the terrace?',
    },
    answer: {
      fr: 'Non, la pression est réglée en fonction du support : un dallage, des pavés autobloquants et une terrasse en bois ne se nettoient pas à la même intensité. Le but est de décoller la mousse et les traces noires sans marquer la matière. Sur le bois, le passage est volontairement plus doux.',
      en: 'No, the pressure is set to suit the surface: paving, block paving and timber decking are not cleaned at the same intensity. The aim is to lift the moss and the black staining without marking the material. On timber the pass is deliberately gentler.',
    },
    pages: ['terrasse'],
  },
  {
    id: 'prix-terrasse',
    question: {
      fr: "Comment est calculé le prix d'un nettoyage de terrasse ?",
      en: 'How is the price of a terrace cleaning worked out?',
    },
    answer: {
      fr: "Le nettoyage de terrasse se chiffre au mètre carré, une fois la surface et son état connus. Une terrasse laissée plusieurs années sans entretien demande plus de travail qu'une terrasse reprise régulièrement, à surface égale. Le devis est gratuit et se fait après un point rapide sur la surface.",
      en: 'Terrace cleaning is priced per square metre, once the area and its condition are known. A terrace left for several years takes more work than one cleaned regularly, for the same area. The quote is free and follows a quick look at the surface.',
    },
    pages: ['terrasse'],
  },
  {
    id: 'terrasse-credit',
    question: {
      fr: "Le nettoyage de terrasse ouvre-t-il droit au crédit d'impôt ?",
      en: 'Does terrace cleaning qualify for the tax credit?',
    },
    answer: {
      fr: "Oui, le nettoyage de terrasse chez un particulier ouvre droit au crédit d'impôt Services à la Personne, à condition que la prestation soit facturée par un organisme déclaré. Les terrasses et les balcons font partie du logement au sens du dispositif. Le nettoyage des murs extérieurs, lui, en est exclu.",
      en: 'Yes, terrace cleaning at a private home qualifies under the Services à la Personne tax credit scheme, provided the work is invoiced by a registered provider. Terraces and balconies count as part of the home under the scheme. Cleaning exterior walls, by contrast, is excluded from it.',
    },
    pages: ['terrasse'],
  },
  {
    id: 'menage-formules',
    question: {
      fr: 'Quelle différence entre entretien courant et grand ménage ?',
      en: 'What is the difference between regular upkeep and a deep clean?',
    },
    answer: {
      fr: "L'entretien courant est un passage régulier sur les sols, les surfaces et les sanitaires, tandis que le grand ménage est une intervention ponctuelle, plus longue, qui reprend ce qu'un passage régulier ne couvre pas. Vous pouvez demander l'un sans l'autre : un grand ménage seul n'engage à aucun passage régulier ensuite.",
      en: 'Regular upkeep is a recurring visit covering floors, surfaces and bathrooms, whereas a deep clean is a one-off, longer visit that tackles what a regular visit does not reach. You ask for one or the other. A single deep clean puts you under no obligation afterwards.',
    },
    pages: ['menage'],
  },
  {
    id: 'menage-tarif',
    question: {
      fr: "Le ménage à domicile se facture-t-il à l'heure ?",
      en: 'Is domestic housekeeping charged by the hour?',
    },
    answer: {
      fr: "Oui, le ménage à domicile se facture à l'heure. Le nombre d'heures dépend de la surface, du nombre de pièces et de ce que vous voulez voir traité en priorité. Le devis est gratuit et fixe ce volume avant la première venue.",
      en: 'Yes, domestic housekeeping is charged by the hour. The number of hours depends on the floor area, the number of rooms and what you want dealt with first. The quote is free and settles that before the first visit.',
    },
    pages: ['menage'],
  },
  {
    id: 'menage-credit',
    question: {
      fr: "Le ménage à domicile ouvre-t-il droit au crédit d'impôt ?",
      en: 'Does domestic housekeeping qualify for the tax credit?',
    },
    answer: {
      fr: "Oui, le ménage à domicile ouvre droit au crédit d'impôt Services à la Personne, à condition que la prestation soit facturée par un organisme déclaré. L'entretien de la maison est même l'activité centrale du dispositif. Le crédit s'applique au montant payé, dans la limite du plafond annuel du foyer.",
      en: 'Yes, domestic housekeeping qualifies under the Services à la Personne tax credit scheme, provided the work is invoiced by a registered provider. Housekeeping is in fact the core activity of the scheme. The credit applies to the amount actually paid, up to the household annual cap.',
    },
    pages: ['menage'],
  },
  {
    id: 'volets-perimetre',
    question: {
      fr: 'Que comprend le nettoyage de volets et portes ?',
      en: 'What does shutter and door cleaning cover?',
    },
    answer: {
      fr: "Le nettoyage de volets et portes couvre les volets battants, les volets roulants, les portes d'entrée et leurs encadrements. Chaque élément est dépoussiéré, dégraissé, puis remis en état. Sur un volet roulant, le coffre, les lames et les rails sont repris en même temps : c'est là que la poussière s'accumule.",
      en: 'Shutter and door cleaning covers hinged and roller shutters, front doors and their frames. Each one is dusted down, degreased and then brought back into condition. On a roller shutter, the housing, the slats and the runners are done at the same time: that is where the dirt builds up most.',
    },
    pages: ['volets-portes'],
  },
  {
    id: 'volets-roulants',
    question: {
      fr: 'Faut-il démonter les volets roulants pour les nettoyer ?',
      en: 'Do roller shutters have to be taken down to be cleaned?',
    },
    answer: {
      fr: "Non, les volets roulants se nettoient en place, sans démontage. La saleté logée dans les rainures se retire produit à l'appui plutôt qu'à la force du bras, ce qui évite de rayer une lame ou d'écailler une peinture. Un volet abîmé se nettoie, mais il ne se répare pas ici.",
      en: 'No, roller shutters are cleaned in place, with nothing taken down. The grime that settles in the grooves is lifted with the right product rather than brute force, which keeps a slat from being scratched or a painted finish from chipping. A damaged shutter can be cleaned, but repairs are not part of the service.',
    },
    pages: ['volets-portes'],
  },
  {
    id: 'volets-credit',
    question: {
      fr: "Le nettoyage de volets ouvre-t-il droit au crédit d'impôt ?",
      en: 'Does shutter cleaning qualify for the tax credit?',
    },
    answer: {
      fr: "Oui, le nettoyage de volets et de portes ouvre droit au crédit d'impôt Services à la Personne, à condition que la prestation soit facturée par un organisme déclaré. Il s'agit d'entretien courant du logement, sans matériel spécialisé, donc éligible au dispositif. Le crédit porte sur le montant payé, dans la limite du plafond annuel du foyer.",
      en: 'Yes, shutter and door cleaning qualifies under the Services à la Personne tax credit scheme, provided the work is invoiced by a registered provider. It is routine upkeep of the home, with no specialist equipment, so it falls within the scheme. The credit applies to the amount actually paid, up to the household annual cap.',
    },
    pages: ['volets-portes'],
  },
  {
    id: 'panneaux-perimetre',
    question: {
      fr: 'Que comprend le nettoyage de panneaux solaires ?',
      en: 'What does solar panel cleaning cover?',
    },
    answer: {
      fr: "Le nettoyage de panneaux solaires couvre la face vitrée des panneaux photovoltaïques et des capteurs thermiques, ainsi que les cadres et les interstices entre les rangées. Le lavage se fait à l'eau claire avec une brosse douce, sans produit agressif ni haute pression. Une pose au sol, sur carport ou en toiture se traite de la même façon : seule la question de l'accès change.",
      en: 'Solar panel cleaning covers the glazed face of photovoltaic panels and thermal collectors, along with the frames and the gaps between the rows. Washing is done with clean water and a soft brush, with no harsh products and no pressure washing. A ground, carport or roof array is handled the same way: only the access question changes.',
    },
    pages: ['panneaux-solaires'],
  },
  {
    id: 'panneaux-frequence',
    question: {
      fr: 'À quelle fréquence faut-il nettoyer des panneaux solaires ?',
      en: 'How often do solar panels need cleaning?',
    },
    answer: {
      fr: "Un nettoyage de panneaux solaires par an suffit dans la plupart des cas, de préférence au printemps, une fois la saison des pollens passée. Un environnement chargé — arbres proches, poussière agricole, passage d'oiseaux — peut en demander un second. Une installation peu inclinée retient les dépôts plus longtemps qu'une toiture bien pentue, où la pluie fait déjà une partie du travail.",
      en: 'One clean a year is enough for solar panels in most cases, ideally in spring once the pollen season is over. A dirtier setting — trees close by, farm dust, birds overhead — can call for a second. A shallow-pitched array holds deposits longer than a steep roof, where rain already does part of the work.',
    },
    pages: ['panneaux-solaires'],
  },
  // COMPLIANCE: renders on /services/panneaux-solaires/, a forbidden route.
  // Modelled on `facade-credit`: a denial in both languages, with the denial
  // inside the same sentence that raises the topic, because that is what
  // scripts/check-compliance.mjs checks. Do not soften either half.
  {
    id: 'panneaux-credit',
    question: {
      fr: "Le nettoyage de panneaux solaires est-il éligible au crédit d'impôt ?",
      en: 'Is solar panel cleaning eligible for the tax credit?',
    },
    answer: {
      fr: "Non, le nettoyage de panneaux solaires n'ouvre pas droit au crédit d'impôt Services à la Personne. Le dispositif couvre l'entretien du logement, pas les équipements de production d'énergie, qui en sont exclus quelle que soit leur pose — en toiture, sur carport ou au sol. Le montant du devis est donc le montant final, sans rien à déduire ensuite.",
      en: 'No, solar panel cleaning does not qualify for the French Services à la Personne tax credit. The scheme covers upkeep of the home, not energy-generating equipment, which is excluded however it is mounted — on a roof, on a carport or on the ground. The amount on the quote is therefore the final amount, with nothing to deduct later.',
    },
    pages: ['credit-impot', 'panneaux-solaires'],
  },
  {
    id: 'poubelles-deroulement',
    question: {
      fr: 'Comment se passe un nettoyage de poubelles ?',
      en: 'How does a bin cleaning work?',
    },
    answer: {
      fr: "Un nettoyage de poubelles se fait sur place : le bac est lavé puis désinfecté, à l'intérieur comme à l'extérieur, couvercle, poignée et roues compris. Ce qui part au lavage, c'est le film gras des parois, celui qui retient l'odeur et attire les insectes. Le bac doit être sorti vide et accessible : le passage se cale donc sur votre jour de collecte.",
      en: 'A bin cleaning is done where the bin is kept: it is washed and then disinfected, inside and out, lid, handle and wheels included. What comes off in the wash is the greasy film on the walls, the part that holds the smell and draws insects. The bin needs to be out, empty and reachable, so the visit is set around your collection day.',
    },
    pages: ['poubelles'],
  },
  {
    id: 'poubelles-copropriete',
    question: {
      fr: "Peut-on faire nettoyer les bacs d'une copropriété ?",
      en: 'Can the bins of a managed block be cleaned?',
    },
    answer: {
      fr: "Oui, les conteneurs d'une copropriété ou d'un commerce se nettoient comme ceux d'un particulier, et le prix se compte par bac. L'accès au local se cale à l'avance avec le syndic ou le gardien. Le devis part du nombre de conteneurs et de leur fréquence de sortie.",
      en: 'Yes, the containers of a managed block or a business are cleaned in the same way as a household bin, and the price is per bin. Access to the bin store is arranged in advance with the managing agent or the caretaker. The quote starts from the number of containers and how often they go out.',
    },
    pages: ['poubelles'],
  },
  // COMPLIANCE: renders on /services/poubelles/, a forbidden route. Modelled on
  // `facade-credit`: a denial in both languages, with the denial inside the same
  // sentence that raises the topic, because that is what the guard checks.
  {
    id: 'poubelles-credit',
    question: {
      fr: "Le nettoyage de poubelles est-il éligible au crédit d'impôt ?",
      en: 'Is bin cleaning eligible for the tax credit?',
    },
    answer: {
      fr: "Non, le nettoyage de poubelles n'ouvre pas droit au crédit d'impôt Services à la Personne. Cette prestation ne figure pas dans la liste des activités couvertes, qui vise l'entretien du logement lui-même. Le montant du devis est donc le montant final, sans rien à déduire ensuite.",
      en: 'No, bin cleaning does not qualify for the French Services à la Personne tax credit. This service is not on the list of activities the scheme covers, which is limited to the upkeep of the home itself. The amount on the quote is therefore the final amount, with nothing to deduct later.',
    },
    pages: ['credit-impot', 'poubelles'],
  },
];

export function faqForPage(pageId: string): FaqEntry[] {
  return faq.filter((f) => f.pages.includes(pageId));
}
