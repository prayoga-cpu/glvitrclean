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

export interface Commune {
  slug: string;
  name: string;
  postalCode: string;
  /** Rough centre, for areaServed geo in schema. */
  geo: { lat: number; lng: number };
  /** One locally specific sentence. Not filler. */
  localAngle: string;
}

export const communes: Commune[] = [
  {
    slug: 'linas',
    name: 'Linas',
    postalCode: '91310',
    geo: { lat: 48.6244, lng: 2.2536 },
    localAngle:
      "Beaucoup de pavillons des années 70 le long de la N20, avec des baies vitrées d'origine qui demandent un traitement doux.",
  },
  {
    slug: 'montlhery',
    name: 'Montlhéry',
    postalCode: '91310',
    geo: { lat: 48.6386, lng: 2.2717 },
    localAngle:
      "Le centre ancien autour de la tour compte des maisons de ville aux fenêtres à petits carreaux, plus longues à traiter qu'une baie moderne.",
  },
  {
    slug: 'arpajon',
    name: 'Arpajon',
    postalCode: '91290',
    geo: { lat: 48.5897, lng: 2.2472 },
    localAngle:
      "Entre le centre commerçant et les lotissements pavillonnaires, les besoins vont de la vitrine hebdomadaire au grand nettoyage de printemps.",
  },
  {
    slug: 'saint-germain-les-arpajon',
    name: 'Saint-Germain-lès-Arpajon',
    postalCode: '91180',
    geo: { lat: 48.5936, lng: 2.2603 },
    localAngle:
      "Zone résidentielle dense en maisons individuelles avec vérandas et abris de terrasse, souvent négligés côté extérieur.",
  },
  {
    slug: 'la-norville',
    name: 'La Norville',
    postalCode: '91290',
    geo: { lat: 48.5761, lng: 2.2450 },
    localAngle:
      'Commune pavillonnaire calme où les terrasses en dallage prennent la mousse vite, faute de plein soleil toute la journée.',
  },
  {
    slug: 'ollainville',
    name: 'Ollainville',
    postalCode: '91290',
    geo: { lat: 48.5786, lng: 2.2211 },
    localAngle:
      'Les maisons proches de la vallée de la Rémarde subissent une humidité qui accélère les dépôts verts sur les terrasses et les volets.',
  },
  {
    slug: 'bruyeres-le-chatel',
    name: 'Bruyères-le-Châtel',
    postalCode: '91680',
    geo: { lat: 48.5636, lng: 2.2044 },
    localAngle:
      'Habitat pavillonnaire entouré de végétation, donc beaucoup de pollen et de résine sur les vitres au printemps.',
  },
  {
    slug: 'egly',
    name: 'Égly',
    postalCode: '91520',
    geo: { lat: 48.5733, lng: 2.2242 },
    localAngle:
      "Maisons avec jardin et dépendances, où le nettoyage des volets et des portes de garage compte autant que celui des vitres.",
  },
  {
    slug: 'bretigny-sur-orge',
    name: 'Brétigny-sur-Orge',
    postalCode: '91220',
    geo: { lat: 48.6108, lng: 2.3050 },
    localAngle:
      "Les quartiers récents construits après la fermeture de la base aérienne offrent de grandes surfaces vitrées d'un seul tenant.",
  },
  {
    slug: 'marcoussis',
    name: 'Marcoussis',
    postalCode: '91460',
    geo: { lat: 48.6408, lng: 2.2331 },
    localAngle:
      'Maisons plus grandes avec vérandas et fenêtres de toit, souvent hors de portée sans perche télescopique.',
  },
  {
    slug: 'etampes',
    name: 'Étampes',
    postalCode: '91150',
    geo: { lat: 48.4342, lng: 2.1614 },
    localAngle:
      'Ville la plus au sud du secteur, avec un centre historique où les menuiseries anciennes exigent une méthode sans produit agressif.',
  },
  {
    slug: 'etrechy',
    name: 'Étréchy',
    postalCode: '91580',
    geo: { lat: 48.4919, lng: 2.1917 },
    localAngle:
      "Entre Étampes et Arpajon, un habitat pavillonnaire où l'entretien extérieur se fait souvent une seule fois par an, au printemps.",
  },
];

export const communeSlugs = communes.map((c) => c.slug);

export function getCommune(slug: string): Commune | undefined {
  return communes.find((c) => c.slug === slug);
}
