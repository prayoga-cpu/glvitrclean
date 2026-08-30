/**
 * The twelve target communes. All Essonne (91), all on the N20 / RER C corridor.
 *
 * `localAngle` is mandatory and must be genuinely specific. Commune pages that
 * differ only by the town name get deindexed as thin duplicates and drag the
 * whole domain down. See CLAUDE.md rule 4.
 *
 * TODO(human): confirm the final service area before relying on this list.
 * If 77 and 94 are in scope, this file grows and 84 routes change.
 */

import type { Localized } from '@/i18n/config';

export interface Commune {
  slug: string;
  name: string;
  postalCode: string;
  /** Rough centre, for areaServed geo in schema. */
  geo: { lat: number; lng: number };
  /** One locally specific sentence, in both languages. Not filler. */
  localAngle: Localized;
}

export const communes: Commune[] = [
  {
    slug: 'linas',
    name: 'Linas',
    postalCode: '91310',
    geo: { lat: 48.6244, lng: 2.2536 },
    localAngle: {
      fr: "Beaucoup de pavillons des années 70 le long de la N20, avec des baies vitrées d'origine qui demandent un traitement doux.",
      en: 'Plenty of 1970s houses along the N20, with original patio doors that need a gentle approach.',
    },
  },
  {
    slug: 'montlhery',
    name: 'Montlhéry',
    postalCode: '91310',
    geo: { lat: 48.6386, lng: 2.2717 },
    localAngle: {
      fr: "Le centre ancien autour de la tour compte des maisons de ville aux fenêtres à petits carreaux, plus longues à traiter qu'une baie moderne.",
      en: 'The old centre around the tower has town houses with small-pane windows, slower to work through than a modern patio door.',
    },
  },
  {
    slug: 'arpajon',
    name: 'Arpajon',
    postalCode: '91290',
    geo: { lat: 48.5897, lng: 2.2472 },
    localAngle: {
      fr: "Entre le centre commerçant et les lotissements pavillonnaires, les besoins vont de la vitrine hebdomadaire au grand nettoyage de printemps.",
      en: 'Between the shopping streets and the housing estates, needs range from a weekly shopfront to a full spring clean.',
    },
  },
  {
    slug: 'saint-germain-les-arpajon',
    name: 'Saint-Germain-lès-Arpajon',
    postalCode: '91180',
    geo: { lat: 48.5936, lng: 2.2603 },
    localAngle: {
      fr: "Zone résidentielle dense en maisons individuelles avec vérandas et abris de terrasse, souvent négligés côté extérieur.",
      en: 'A dense residential area of detached houses with conservatories and terrace canopies, often neglected on the outside.',
    },
  },
  {
    slug: 'la-norville',
    name: 'La Norville',
    postalCode: '91290',
    geo: { lat: 48.5761, lng: 2.2450 },
    localAngle: {
      fr: 'Commune pavillonnaire calme où les terrasses en dallage prennent la mousse vite, faute de plein soleil toute la journée.',
      en: 'A quiet suburban commune where paved terraces pick up moss quickly, for want of full sun through the day.',
    },
  },
  {
    slug: 'ollainville',
    name: 'Ollainville',
    postalCode: '91290',
    geo: { lat: 48.5786, lng: 2.2211 },
    localAngle: {
      fr: 'Les maisons proches de la vallée de la Rémarde subissent une humidité qui accélère les dépôts verts sur les terrasses et les volets.',
      en: 'Houses near the Rémarde valley take on a damp that speeds up green growth on terraces and shutters.',
    },
  },
  {
    slug: 'bruyeres-le-chatel',
    name: 'Bruyères-le-Châtel',
    postalCode: '91680',
    geo: { lat: 48.5636, lng: 2.2044 },
    localAngle: {
      fr: 'Habitat pavillonnaire entouré de végétation, donc beaucoup de pollen et de résine sur les vitres au printemps.',
      en: 'Suburban housing surrounded by greenery, so plenty of pollen and resin on the windows come spring.',
    },
  },
  {
    slug: 'egly',
    name: 'Égly',
    postalCode: '91520',
    geo: { lat: 48.5733, lng: 2.2242 },
    localAngle: {
      fr: "Maisons avec jardin et dépendances, où le nettoyage des volets et des portes de garage compte autant que celui des vitres.",
      en: 'Houses with gardens and outbuildings, where cleaning the shutters and garage doors matters as much as the windows.',
    },
  },
  {
    slug: 'bretigny-sur-orge',
    name: 'Brétigny-sur-Orge',
    postalCode: '91220',
    geo: { lat: 48.6108, lng: 2.3050 },
    localAngle: {
      fr: "Les quartiers récents construits après la fermeture de la base aérienne offrent de grandes surfaces vitrées d'un seul tenant.",
      en: 'The newer districts built after the air base closed offer large, single-span areas of glass.',
    },
  },
  {
    slug: 'marcoussis',
    name: 'Marcoussis',
    postalCode: '91460',
    geo: { lat: 48.6408, lng: 2.2331 },
    localAngle: {
      fr: 'Maisons plus grandes avec vérandas et fenêtres de toit, souvent hors de portée sans perche télescopique.',
      en: 'Larger houses with conservatories and roof windows, often out of reach without a telescopic pole.',
    },
  },
  {
    slug: 'etampes',
    name: 'Étampes',
    postalCode: '91150',
    geo: { lat: 48.4342, lng: 2.1614 },
    localAngle: {
      fr: 'Ville la plus au sud du secteur, avec un centre historique où les menuiseries anciennes exigent une méthode sans produit agressif.',
      en: 'The southernmost town in the area, with a historic centre where old joinery calls for a method free of harsh products.',
    },
  },
  {
    slug: 'etrechy',
    name: 'Étréchy',
    postalCode: '91580',
    geo: { lat: 48.4919, lng: 2.1917 },
    localAngle: {
      fr: "Entre Étampes et Arpajon, un habitat pavillonnaire où l'entretien extérieur se fait souvent une seule fois par an, au printemps.",
      en: 'Between Étampes and Arpajon, suburban housing where the outside gets its one clean a year, in spring.',
    },
  },
];

export const communeSlugs = communes.map((c) => c.slug);

export function getCommune(slug: string): Commune | undefined {
  return communes.find((c) => c.slug === slug);
}
