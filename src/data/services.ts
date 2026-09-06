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
  /**
   * Body copy for the service page, one string per paragraph.
   * Rendered by ServiceView. Also the source of the pair-specific half of
   * the commune x service pages, so keep each paragraph self-contained and
   * free of any commune name.
   */
  bodyCopy: Localized<string[]>;
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
    bodyCopy: {
      fr: [
        "Le nettoyage couvre les deux faces du vitrage : fenêtres, baies vitrées, vérandas et fenêtres de toit. Les encadrements, les rebords et les rails sont repris au passage, faute de quoi la première pluie ramène des coulures sur le verre propre. L'intérieur et l'extérieur peuvent se faire ensemble ou séparément, selon ce dont vous avez besoin.",
        "L'intervention se fait en trois temps : on mouille et on décrasse, on racle, puis on reprend les bords et les angles. C'est cette dernière étape qui sépare une vitre propre d'une vitre sans trace. Les produits sont respectueux de l'environnement, à l'intérieur comme à l'extérieur.",
        "Avant le passage, dégagez les rebords intérieurs et libérez l'accès côté extérieur : mobilier de jardin, pots, véhicule garé devant une baie. Signalez les vitrages fêlés, les joints abîmés ou les fenêtres qui ne s'ouvrent plus, pour qu'ils soient traités avec précaution. L'accès en hauteur se regarde avant l'intervention, jamais pendant.",
        "Le prix se fixe au forfait maison plutôt qu'à l'heure : le nombre de fenêtres, leur type et leur hauteur donnent un montant pour l'ensemble, connu avant de commencer. Le devis est gratuit et sans engagement. Une photo ou deux suffisent souvent à le préparer.",
      ],
      en: [
        'The job covers both sides of the glass: windows, patio doors, conservatories and roof windows. Frames, sills and runners are done at the same time, otherwise the first shower of rain carries dirt straight back down the clean glass. Inside and outside can be done together or separately, depending on what you need.',
        'The work goes in three stages: wet the glass and loosen the dirt, squeegee it off, then go back over the edges and corners. That last stage is what separates a clean window from a streak-free one. The products used are environmentally responsible, indoors as well as out.',
        'Before the visit, clear the inside sills and open up the access outside: garden furniture, pots, a car parked in front of a patio door. Point out any cracked panes, worn seals or windows that no longer open, so they can be handled carefully. Anything high up is assessed before the work starts, never during.',
        'Pricing is a flat rate for the house rather than an hourly charge: the number of windows, their type and their height give one figure for the whole job, known before anything begins. The quote is free and commits you to nothing. A photo or two is often enough to prepare it.',
      ],
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
    bodyCopy: {
      fr: [
        "La prestation couvre le démoussage et la remise en état des dallages, des pavés autobloquants et des terrasses en bois. Les joints, les bordures et les marches font partie du chantier : c'est là que la mousse revient en premier. Les balcons se traitent de la même façon, avec l'évacuation de l'eau comme contrainte supplémentaire.",
        "La pression est réglée en fonction du support, jamais l'inverse. Une dalle béton encaisse ce qu'une lame de bois ou un joint sablé ne supporterait pas, donc le réglage change parfois d'une zone à l'autre d'une même terrasse. Un essai sur un coin peu visible permet de valider le rendu avant de traiter l'ensemble.",
        "Prévoyez de dégager le mobilier, les jardinières et le barbecue, et de fermer les fenêtres qui donnent sur la terrasse. L'eau doit pouvoir partir : signalez un regard bouché ou une pente qui ramène l'eau vers la maison. Le bois demande un temps de séchage avant de remettre les meubles en place.",
        "Le devis se calcule au mètre carré : la surface est mesurée sur place et l'état du support regardé avant d'annoncer un prix. Une terrasse reprise régulièrement demande moins de travail qu'une terrasse laissée plusieurs années sans entretien. Le devis est gratuit.",
      ],
      en: [
        'The work covers moss removal and restoration of paving slabs, block paving and timber decking. Joints, edges and steps are part of the job: that is where moss comes back first. Balconies are treated the same way, with drainage as the extra constraint.',
        'The pressure is set to suit the surface, never the other way round. A concrete slab takes what a timber board or a sanded joint would not, so the setting can change from one part of a terrace to another. A test on an out-of-the-way corner settles the finish before the whole area is done.',
        'Move the furniture, the planters and the barbecue out of the way beforehand, and close any window opening onto the terrace. The water has to drain somewhere: flag a blocked gully, or a slope that sends water back towards the house. Timber needs time to dry before the furniture goes back.',
        'Quotes are worked out per square metre: the area is measured on site and the condition of the surface assessed before a price is given. A terrace cleaned regularly takes less work than one left for several years. The quote is free.',
      ],
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
    bodyCopy: {
      fr: [
        "Deux formules : l'entretien courant, à intervalle régulier, et le grand ménage ponctuel, après un déménagement, des travaux ou avant de recevoir. Dans les deux cas, la prestation couvre les sols, les surfaces, la cuisine et les sanitaires. Les pièces concernées et le niveau de détail sont convenus au devis, pas le jour même.",
        "Le travail suit un ordre fixe, du haut vers le bas et du fond vers la sortie, pour ne pas resalir ce qui vient d'être fait. Les produits sont respectueux de l'environnement et choisis selon la surface à traiter. Rien n'est réorganisé chez vous : ce qui est déplacé revient à sa place.",
        "De votre côté, il n'y a rien à préparer, sinon ranger ce qui traîne pour que les surfaces soient accessibles. Indiquez les pièces à ne pas toucher, les sols fragiles, et l'endroit où sont rangés vos produits si vous préférez qu'on utilise les vôtres. Dites aussi si vous serez présent : cela se cale au devis.",
        "Le ménage se facture à l'heure. Le nombre d'heures dépend de la surface, du nombre de pièces et de la fréquence : un passage hebdomadaire prend moins de temps qu'un rattrapage après plusieurs mois. Le devis est gratuit et fixe le volume horaire avant la première venue.",
      ],
      en: [
        'Two formats: regular upkeep on a set schedule, and a one-off deep clean after a move, after building work, or before having people over. Either way the work covers floors, surfaces, the kitchen and the bathrooms. Which rooms are included, and how far the detail goes, is agreed at the quote rather than on the day.',
        'The work follows a fixed order, top to bottom and back towards the door, so that nothing already done gets dirty again. Products are environmentally responsible and chosen to suit the surface. Nothing in your home is rearranged: whatever gets moved goes back where it was.',
        'There is nothing to prepare on your side beyond clearing clutter so the surfaces can be reached. Say which rooms to leave alone, which floors are delicate, and where your own products are kept if you would rather they were used. Say too whether you will be in: that is settled at the quote.',
        'Housekeeping is charged by the hour. How many hours depends on the floor area, the number of rooms and the frequency: a weekly visit takes less time than catching up after several months. The quote is free and sets the number of hours before the first visit.',
      ],
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
    bodyCopy: {
      fr: [
        "La prestation couvre les volets battants, les volets roulants avec leurs lames et leur coffre, les portes d'entrée et les encadrements. Le PVC, le bois peint et l'aluminium ne se nettoient pas de la même façon et sont traités comme tels. Les rails et les glissières font partie du travail : c'est là que la poussière s'accumule le plus.",
        "Trois étapes : dépoussiérage à sec, dégraissage, puis rinçage et essuyage. La saleté logée dans les rainures d'un volet roulant se retire produit à l'appui plutôt qu'à la force du bras, ce qui évite de rayer une lame ou d'écailler une peinture. Les produits sont respectueux de l'environnement.",
        "Avant l'intervention, vérifiez que chaque volet s'ouvre et se ferme, et signalez ceux qui frottent ou qui ne descendent plus. Un volet roulant abîmé se nettoie, mais il ne se répare pas ici. Dégagez aussi les abords : jardinières sur l'appui, mobilier posé contre le mur.",
        "Le nettoyage de volets et portes se facture au forfait, établi selon le nombre d'ouvertures, leur matériau et leur hauteur. Il se combine souvent avec un nettoyage de vitres, puisque le matériel est déjà sur place et les surfaces voisines. Le devis est gratuit.",
      ],
      en: [
        'The work covers hinged shutters, roller shutters including their slats and housing, front doors and frames. PVC, painted wood and aluminium do not clean the same way and are treated accordingly. Runners and guide rails are part of the job: that is where the dirt builds up most.',
        'Three stages: dry dusting, degreasing, then rinsing and wiping down. The grime that settles in the grooves of a roller shutter is lifted with the right product rather than brute force, which is what keeps a slat from being scratched or a painted finish from chipping. The products used are environmentally responsible.',
        'Before the visit, check that each shutter opens and closes, and flag any that catch or no longer come down. A damaged roller shutter can be cleaned, but it is not repaired here. Clear the surroundings too: planters on the sill, furniture standing against the wall.',
        'Shutters and doors are quoted as a flat rate, worked out from the number of openings, their material and their height. It is often combined with window cleaning, since the equipment is already on site and the surfaces sit side by side. The quote is free.',
      ],
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
    bodyCopy: {
      fr: [
        'Le nettoyage de façade porte sur les murs extérieurs : crépi, enduit, bardage bois ou composite. Traces vertes, coulures noires sous les appuis de fenêtre et dépôts au pied du mur ont des causes différentes et ne se traitent pas de la même manière. Le bas du mur et les pignons peu ensoleillés sont en général les zones les plus chargées.',
        "C'est une intervention technique, pas un simple lavage. Le support est examiné d'abord : un crépi qui farine, un enduit fissuré ou un bardage disjoint ne supportent pas ce qu'un mur sain supporte. Le nettoyage est ensuite adapté à ce constat, en retenant la méthode la plus douce qui donne le résultat attendu.",
        "Une visite préalable est indispensable et fait partie du devis. Elle sert à mesurer les surfaces, à regarder l'accès, la hauteur et l'état du mur, puis à dire ce qui est réalisable et ce qui ne l'est pas. Toutes les façades ne se nettoient pas : quand le résultat n'est pas atteignable proprement, c'est dit avant, pas après.",
        "Le prix est établi sur devis, sans grille standard : deux maisons de même taille peuvent demander un travail très différent selon la hauteur, l'accès et l'état du mur. De votre côté, prévoyez de fermer les fenêtres, de dégager les massifs le long du mur et de couvrir ce qui craint l'eau. Le devis est gratuit.",
      ],
      en: [
        'Facade cleaning deals with exterior walls: render, coatings, timber or composite cladding. Green staining, black runs under the window sills and deposits at the foot of the wall have different causes and are not treated the same way. The base of the wall and the gables that get little sun are usually the worst affected.',
        'This is a technical job rather than a simple wash. The surface is examined first: chalking render, a cracked coating or open cladding joints will not take what sound masonry takes. The cleaning is then matched to what that inspection shows, using the gentlest method that gives the result.',
        'A site visit is essential and is part of the quote. It is there to measure the surfaces, look at access, height and the condition of the wall, and then to say what can and cannot be done. Not every facade can be cleaned: where a clean result is out of reach, you are told beforehand rather than afterwards.',
        'The price is quoted individually, with no standard rate card: two houses of the same size can involve very different work depending on height, access and the state of the wall. On your side, plan to close the windows, clear the beds along the wall and cover anything that water would spoil. The quote is free.',
      ],
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
    bodyCopy: {
      fr: [
        "Le lavage concerne aussi bien les bacs roulants d'un foyer que les conteneurs collectifs d'un immeuble ou d'une copropriété. Ordures ménagères, recyclage, verre ou biodéchets : tous les bacs se traitent de la même façon. L'emplacement lui-même peut être repris s'il en a besoin.",
        "Le bac est lavé puis désinfecté, à l'intérieur comme à l'extérieur, couvercle, poignée et roues compris. C'est le film gras collé aux parois qui retient l'odeur et attire les insectes : c'est lui qui est visé, pas seulement les résidus visibles. Les produits utilisés restent respectueux de l'environnement.",
        "De votre côté, il suffit de sortir le bac vide et d'en laisser l'accès libre. Le jour de la collecte, ou le lendemain, est le bon moment : un bac plein ne se lave pas. En copropriété, l'accès au local se cale à l'avance avec le syndic ou le gardien.",
        'Le tarif se compte par bac, ce qui garde le calcul simple quand il y en a plusieurs, ou quand des voisins font laver les leurs en même temps. Pour un immeuble, le nombre de conteneurs et leur fréquence de sortie donnent le volume à prévoir. Le devis est gratuit, et une photo du bac suffit souvent à le préparer.',
      ],
      en: [
        'This covers a household wheelie bin as readily as the shared containers of a block or a managed building. General waste, recycling, glass or food waste: every bin is handled the same way. The standing area itself can be included if it needs it.',
        'Each bin is washed and then disinfected, inside and out, lid, handle and wheels included. It is the greasy film stuck to the walls of the bin that holds the smell and draws insects, so that film is the target, not just the visible residue. The products used are environmentally responsible.',
        'All you need to do is put the bin out empty and leave it accessible. Collection day, or the day after, is the moment for it: a full bin cannot be washed. For a managed block, access to the bin store is arranged in advance with the managing agent or the caretaker.',
        'Pricing is per bin, which keeps the arithmetic simple when there are several, or when neighbours have theirs done at the same time. For a building, the number of containers and how often they go out set the size of the job. The quote is free, and a photo of the bin is often enough to prepare it.',
      ],
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
