/**
 * The twelve target communes. All Essonne (91), all on the N20 / RER C corridor.
 *
 * `localAngle`, `soiling` and `housing` are all mandatory and must be genuinely
 * specific. Commune pages that differ only by the town name get deindexed as
 * thin duplicates and drag the whole domain down. See CLAUDE.md rule 4.
 *
 * WHAT MAY GO IN THESE THREE FIELDS, and it is a hard limit (ROADMAP phase 8a).
 * Every claim must be one of:
 *
 *   1. already asserted somewhere in this repository — the Rémarde valley damp
 *      at Ollainville and the closed air base at Brétigny were both here before
 *      the fields were split out; or
 *   2. true of the whole of southern Essonne — the N20 and RER C corridor, the
 *      hard tap water off the Beauce limestone, the Île-de-France pollen
 *      season.
 *
 * No invented street, no invented landmark, no invented local business, no
 * claim about a specific building. A commune page is meant to read as though
 * someone has driven there; it is not licence to make things up about a real
 * town. TODO(human): the client knows these twelve towns and should read these
 * thirty-six strings once before the site goes live.
 *
 * ONE CLAIM WAS CHECKED EXTERNALLY rather than assumed, because it was the only
 * thing phase 8a introduced that the previous `localAngle` did not already
 * imply. Recording it here is what makes it category 1 for whoever edits these
 * strings next:
 *
 *   - Égly's `soiling` says the tap water is hard across this area. Essonne
 *     averages about 26.8 °f against a national 22.1 °f, and Étampes — the
 *     southernmost commune on this list — measures about 27 °f, which is classed
 *     hard. Hardness does vary across the department (Orsay ~11 °f, Angervilliers
 *     ~42.8 °f), so the claim is scoped to "this area" and must not be widened
 *     into a statement about the Essonne as a whole.
 *
 * CLAIMS WRITTEN AND THEN CUT on review, recorded so they are not
 * reintroduced later as "local colour":
 *
 *   - Montlhéry's slope. The promontory is real — the historic core sits around
 *     137 m and falls away steeply toward Linas — but it is not a CAUSE of
 *     soiling. Ground slope does not make rain run down a wall; it does that on
 *     the flat. The cause on that page is the glazing bars, which is what the
 *     field now says.
 *   - Montlhéry's building stock sorted by altitude, old uphill and new
 *     downhill. Unsupported, and not dependably true: newer development sits on
 *     the plateau as well as on the low ground.
 *   - Linas's joinery sorted by material, "aluminium ou PVC de première
 *     génération", on a stock the angle above dates to the 1970s. PVC frames
 *     are an 1980s material in France, so half the claim was wrong and the
 *     other half was unverifiable. Cut on review 2026-09-10, along with
 *     "demi-niveaux" and La Norville's "tout est accessible depuis le sol",
 *     which asserted something absolute about every property in a commune and
 *     doubled as a pricing representation.
 *   - A conservatory roof being "almost horizontal", with rainwater standing on
 *     it. Wrong — a glazed roof is pitched so that it drains, and a ponding one
 *     is a defect rather than the norm. It also contradicted the Marcoussis
 *     entry in this same file, which correctly says such roofs ARE pitched, just
 *     too shallowly for rain to clean them. Saint-Germain-lès-Arpajon now
 *     differentiates on the density of the housing instead, so the two pages do
 *     not converge on one story either.
 *
 * The DEPARTMENT-level area was confirmed by the client on 2026-09-09: Essonne
 * (91) and Seine-et-Marne (77), not 94. See `company.serviceArea`.
 *
 * This file did not grow with it. A commune page needs a `localAngle` that is
 * genuinely specific (rule 4) and a target query (rule 3), and the client has
 * named the department but not the Seine-et-Marne towns he actually drives to.
 * Inventing twelve of them would be inventing facts about places. The site
 * therefore states 77 coverage at department level — in the copy, in the
 * metadata and in `areaServed` — and generates no 77 commune page until that
 * list exists. STATUS.md item 3.
 *
 * TODO(human): the Seine-et-Marne commune list. Each town added here is 1 + 7
 * = 8 new basePaths, so 16 routes across both editions.
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
  /**
   * WHY the dirt is there — the physical cause, not the symptom.
   *
   * This is the field that makes a commune page non-substitutable. Any cleaning
   * company can write "we clean windows in X"; naming what actually soils the
   * glass in X is the part a template cannot generate. See ROADMAP phase 8a for
   * where the pattern comes from and the limit on what may be claimed.
   */
  soiling: Localized;
  /**
   * WHAT the dirt sits on — the local building stock, and the access problem
   * it creates. The second axis of difference between two neighbouring towns
   * whose weather is identical.
   */
  housing: Localized;
}

export const communes: Commune[] = [
  {
    slug: 'linas',
    name: 'Linas',
    postalCode: '91310',
    geo: { lat: 48.6244, lng: 2.2536 },
    localAngle: {
      fr: "Beaucoup de pavillons des années 70 le long de la N20, avec des baies vitrées d'origine à traiter en douceur.",
      en: 'Plenty of 1970s houses along the N20, with original patio doors that need a gentle approach.',
    },
    soiling: {
      fr: "La N20 passe au pied des maisons et dépose un film gris de poussière de route et de gaz d'échappement. La façade côté route se salit nettement plus vite que celle côté jardin, et se refait donc plus souvent.",
      en: 'The N20 runs at the foot of the houses and lays down a grey film of road dust and exhaust. The roadside elevation dirties markedly faster than the garden side, so it comes round for cleaning more often.',
    },
    housing: {
      fr: "Des pavillons de plain-pied ou à étage, avec de grandes baies coulissantes d'un seul tenant. Rien d'inaccessible, mais des menuiseries et des joints d'origine qui n'aiment pas les produits agressifs.",
      en: 'Detached houses of one or two storeys, with wide single-span sliding doors. Nothing out of reach, but original frames and seals that do not take kindly to harsh products.',
    },
  },
  {
    slug: 'montlhery',
    name: 'Montlhéry',
    postalCode: '91310',
    geo: { lat: 48.6386, lng: 2.2717 },
    localAngle: {
      fr: "Le centre ancien autour de la tour compte des fenêtres à petits carreaux, longues à nettoyer une par une.",
      en: 'The old centre around the tower is full of small-pane windows, cleaned one pane at a time.',
    },
    soiling: {
      fr: "Les fenêtres à petits carreaux retiennent ce qu'une grande vitre laisse filer. La poussière soulevée par la circulation, et la pluie qui la rabat, se déposent dans chaque angle de croisillon — là où le chiffon passe le plus mal. Un salissement lent, mais qui finit par s'incruster.",
      en: 'Small-pane windows hold what a single large sheet lets run off. Dust thrown up by the traffic, and the rain that drives it back down, settle into every corner of every glazing bar — the place a cloth reaches worst. It builds slowly, and in the end it sets hard.',
    },
    housing: {
      fr: "Maisons de ville mitoyennes à menuiseries bois et petits bois dans le centre ancien, pavillons plus récents autour. Deux méthodes dans la même commune, et deux temps de passage très différents : dans l'ancien, une façade se compte en carreaux, pas en mètres carrés.",
      en: 'Terraced town houses with wooden frames and glazing bars in the old centre, more recent detached houses around it. Two methods in one commune, and two very different amounts of time on site: in the old centre you count panes, not square metres.',
    },
  },
  {
    slug: 'arpajon',
    name: 'Arpajon',
    postalCode: '91290',
    geo: { lat: 48.5897, lng: 2.2472 },
    localAngle: {
      fr: "Vitrines du centre commerçant d'un côté, pavillons et terrasses de l'autre : deux chantiers différents.",
      en: 'Shopfronts in the town centre on one side, houses and terraces on the other: two different jobs.',
    },
    soiling: {
      fr: "Deux salissements pour une seule commune. En centre-ville, les vitrines prennent le film de route et les traces de mains tous les jours. Dans les lotissements, c'est le pollen au printemps et les traces de pluie sur des vitres qu'on ne regarde qu'en avril.",
      en: 'Two kinds of dirt in one commune. In the centre, shopfronts take road film and handprints every single day. Out in the estates it is spring pollen and rain marks on glass nobody looks at until April.',
    },
    housing: {
      fr: "Vitrines et logements au-dessus en centre-ville, avec des enseignes et des stores qui compliquent l'accès ; maisons individuelles avec terrasse dans les lotissements. Le rythme d'entretien n'est pas le même des deux côtés.",
      en: 'Shopfronts with flats above them in the centre, where signage and awnings get in the way; detached houses with terraces out in the estates. The two sides do not run on the same maintenance rhythm.',
    },
  },
  {
    slug: 'saint-germain-les-arpajon',
    name: 'Saint-Germain-lès-Arpajon',
    postalCode: '91180',
    geo: { lat: 48.5936, lng: 2.2603 },
    localAngle: {
      fr: "Les vérandas et les abris de terrasse y sont nombreux, souvent négligés côté extérieur.",
      en: 'Conservatories and terrace canopies are common here, often neglected on the outside.',
    },
    soiling: {
      fr: "Les maisons sont proches et les jardins se touchent : feuilles, graines et pollen de tout le voisinage atterrissent sur les couvertures de véranda et d'abri de terrasse. Comme ces surfaces sont vitrées, la saleté ne se juge pas à l'œil mais à la lumière qui passe — elle baisse peu à peu, et personne ne remarque rien avant le nettoyage.",
      en: 'The houses sit close together and the gardens run into each other: leaves, seeds and pollen from the whole neighbourhood land on the conservatory and terrace-canopy roofs. Because those surfaces are glazed, you do not judge the dirt by looking at it but by the light coming through — it drops off gradually, and nobody notices until the clean.',
    },
    housing: {
      fr: "Maisons individuelles serrées, beaucoup avec une véranda ou un abri de terrasse vitré ajouté après coup. L'accès se fait par le jardin, souvent étroit, ce qui pèse plus sur le devis que la surface elle-même.",
      en: 'Closely packed detached houses, many with a conservatory or a glazed terrace canopy added later. Access is through the garden and often tight, which weighs on the quote more than the area itself does.',
    },
  },
  {
    slug: 'la-norville',
    name: 'La Norville',
    postalCode: '91290',
    geo: { lat: 48.5761, lng: 2.2450 },
    localAngle: {
      fr: 'Terrasses en dallage souvent ombragées, où la mousse revient saison après saison.',
      en: 'Paved terraces that are often in shade, so the moss comes back season after season.',
    },
    soiling: {
      fr: "Une terrasse qui ne prend le soleil qu'une partie de la journée ne sèche jamais complètement. La mousse et le lichen noir s'installent dans les joints entre les dalles, là où l'eau reste, et repartent plus vite qu'ils ne sont partis si on se contente de frotter la surface.",
      en: 'A terrace that only catches the sun for part of the day never fully dries. Moss and black lichen settle into the joints between the slabs, where the water sits, and come back faster than they left if you only scrub the surface.',
    },
    housing: {
      fr: "Maisons individuelles avec terrasse et jardin. La plus grande partie se traite depuis le sol, ce qui rend la prestation simple à chiffrer : c'est la surface et l'état du dallage qui décident, pas la hauteur.",
      en: 'Detached houses with a terrace and garden. Most of it is worked from the ground, which makes the job simple to price: area and the state of the paving decide it, not height.',
    },
  },
  {
    slug: 'ollainville',
    name: 'Ollainville',
    postalCode: '91290',
    geo: { lat: 48.5786, lng: 2.2211 },
    localAngle: {
      fr: "Près de la Rémarde, l'humidité fait vite verdir les terrasses et les volets.",
      en: 'Close to the Rémarde, damp soon turns terraces and shutters green.',
    },
    soiling: {
      fr: "L'humidité de la vallée ne s'évapore pas au même rythme qu'ailleurs. La brume du matin tient sur les façades nord, les volets et les dallages assez longtemps pour que le vert s'installe — et il revient chaque année au même endroit, toujours du même côté de la maison.",
      en: 'Valley damp does not burn off at the rate it does elsewhere. Morning mist sits on north-facing walls, shutters and paving long enough for green growth to take, and it comes back to the same place every year, always on the same side of the house.',
    },
    housing: {
      fr: "Maisons de fond de vallée et de coteau, souvent avec des volets bois ou PVC qui prennent le vert avant les murs. Le côté nord demande un passage plus fréquent que le reste de la maison, et cela vaut la peine de le dire au moment du devis.",
      en: 'Houses on the valley floor and its slopes, often with wooden or PVC shutters that go green before the walls do. The north side needs seeing to more often than the rest of the house, and that is worth saying at quote stage.',
    },
  },
  {
    slug: 'bruyeres-le-chatel',
    name: 'Bruyères-le-Châtel',
    postalCode: '91680',
    geo: { lat: 48.5636, lng: 2.2044 },
    localAngle: {
      fr: 'Pavillons cernés par les arbres : au printemps, pollen et résine se collent aux vitres.',
      en: 'Houses ringed by trees, so spring brings pollen and resin onto the glass.',
    },
    soiling: {
      fr: "Le pollen au printemps, la résine des arbres en été. Ni l'un ni l'autre ne part à l'eau claire : le pollen se colle avec la première pluie et la résine durcit au soleil sur le verre. Un lavage tardif dans la saison demande plus de travail qu'un lavage fait à temps.",
      en: 'Pollen in spring, tree resin in summer. Neither comes off with water alone: pollen glues itself down with the first rain, and resin hardens onto the glass in the sun. A wash left late in the season is more work than one done on time.',
    },
    housing: {
      fr: "Pavillons en retrait de la route, entourés d'arbres adultes, avec du jardin sur toutes les faces. La végétation qui salit les vitres est aussi celle qui gêne l'accès à l'échelle : la perche télescopique fait souvent le travail plus proprement.",
      en: 'Houses set back from the road among mature trees, with garden on every side. The greenery that dirties the glass is also what blocks a ladder, so a telescopic pole usually does the job more cleanly.',
    },
  },
  {
    slug: 'egly',
    name: 'Égly',
    postalCode: '91520',
    geo: { lat: 48.5733, lng: 2.2242 },
    localAngle: {
      fr: "Jardins, dépendances et portes de garage : ici les volets comptent autant que les vitres.",
      en: 'Houses with gardens and outbuildings, where cleaning the shutters and garage doors matters as much as the windows.',
    },
    soiling: {
      fr: "Le jardin salit le bas de la maison : la terre remonte en éclaboussures sur les vitres basses, les volets et les portes de garage à chaque grosse pluie. Et l'eau du robinet est calcaire dans tout le secteur, donc l'arrosage laisse des traces blanches sur tout ce que le jet atteint.",
      en: 'The garden dirties the bottom of the house: soil splashes up onto low windows, shutters and garage doors with every heavy shower. Tap water is hard right across this area too, so watering leaves white spotting on anything the sprinkler reaches.',
    },
    housing: {
      fr: "Maisons avec jardin, garage et dépendances. Il y a autant de surface à nettoyer en dehors des vitres que sur les vitres elles-mêmes, ce qui rend plus logique de grouper plusieurs prestations sur une même intervention que de les traiter séparément.",
      en: 'Houses with gardens, garages and outbuildings. There is as much surface to clean off the windows as on them, so grouping several jobs into one visit makes more sense here than booking them separately.',
    },
  },
  {
    slug: 'bretigny-sur-orge',
    name: 'Brétigny-sur-Orge',
    postalCode: '91220',
    geo: { lat: 48.6108, lng: 2.3050 },
    localAngle: {
      fr: "Quartiers neufs bâtis après la fermeture de la base aérienne, aux grandes baies d'un seul tenant.",
      en: 'The newer districts built after the air base closed offer large, single-span areas of glass.',
    },
    soiling: {
      fr: "Une grande vitre d'un seul tenant ne cache rien. Une seule coulure sale partie du dormant traverse toute la surface et se voit du fond du séjour, là où une fenêtre à petits carreaux l'aurait contenue dans un seul carreau. Ce n'est pas plus sale qu'ailleurs : c'est plus visible.",
      en: 'A big single-span pane hides nothing. One dirty run off the frame crosses the whole sheet and shows from the far side of the room, where a small-pane window would have kept it inside one square. It is not dirtier here — it is more visible.',
    },
    housing: {
      fr: "Quartiers récents en appartements et maisons à grandes façades vitrées, et habitat plus ancien ailleurs dans la commune. Le neuf demande une finition sans trace plus stricte, parce que la surface vitrée est plus grande et l'éclairage plus direct.",
      en: 'Recent districts of flats and houses with large glazed elevations, and older housing elsewhere in the town. The new build demands a stricter streak-free finish, because the glazed area is larger and the light on it more direct.',
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
    soiling: {
      fr: "Une fenêtre de toit et une toiture de véranda sont inclinées, mais pas assez pour que la pluie les nettoie. Les feuilles et la mousse s'accumulent le long des joints et dans les angles bas, exactement là où l'eau ralentit, et finissent par tacher le verre en profondeur.",
      en: 'A roof window and a conservatory roof are pitched, but not steeply enough for rain to clean them. Leaves and moss build up along the seals and in the low corners, exactly where the water slows, and end up staining the glass properly.',
    },
    housing: {
      fr: "Maisons plus grandes, souvent avec combles aménagés et véranda. La hauteur et l'inclinaison décident du devis bien plus que le nombre de vitres : c'est le point à regarder en premier sur la photo que vous envoyez.",
      en: 'Larger houses, often with a converted loft and a conservatory. Height and pitch drive the quote far more than the number of panes does, and they are the first thing to look at on a photo you send through.',
    },
  },
  {
    slug: 'etampes',
    name: 'Étampes',
    postalCode: '91150',
    geo: { lat: 48.4342, lng: 2.1614 },
    localAngle: {
      fr: 'Ville la plus au sud du secteur, avec des menuiseries anciennes à nettoyer sans produit agressif.',
      en: 'The southernmost town we cover, with old joinery that needs a gentle method.',
    },
    soiling: {
      fr: "Les menuiseries anciennes retiennent la poussière là où un joint moderne la laisse filer : dans les lignes de mastic, au pied du carreau, dans le bois ouvert. Le simple vitrage prend en plus la condensation, qui fixe la poussière au lieu de l'emporter.",
      en: 'Old joinery holds dust where a modern seal lets it go: in the putty lines, at the foot of the pane, in the open grain of the wood. Single glazing takes condensation on top of that, which fixes the dust in place instead of carrying it away.',
    },
    housing: {
      fr: "Centre historique à menuiseries bois et simple vitrage, quartiers pavillonnaires plus récents en périphérie. Dans l'ancien, le produit compte autant que le geste : un décapant courant abîme le mastic et le bois en une seule intervention.",
      en: 'A historic centre of wooden frames and single glazing, with more recent suburban districts around it. In the old town the product matters as much as the technique: an ordinary stripper damages putty and bare wood in a single visit.',
    },
  },
  {
    slug: 'etrechy',
    name: 'Étréchy',
    postalCode: '91580',
    geo: { lat: 48.4919, lng: 2.1917 },
    localAngle: {
      fr: "Entre Étampes et Arpajon, des pavillons où l'extérieur ne se fait souvent qu'une fois l'an, au printemps.",
      en: 'Between Étampes and Arpajon, suburban housing where the outside is often done just once a year, in spring.',
    },
    soiling: {
      fr: "Un seul passage par an veut dire une année entière cumulée : les traces de pluie de l'hiver, le pollen du printemps, et le vert qui s'est installé côté nord pendant que personne ne regardait. C'est plus long à rattraper qu'à entretenir, et le devis le reflète.",
      en: 'One visit a year means a full year stacked up: winter rain marks, spring pollen, and the green growth that took hold on the north side while nobody was looking. Catching up costs more time than keeping up, and the quote reflects that.',
    },
    housing: {
      fr: "Pavillons avec jardin, accessibles de plain-pied pour la plus grande partie. Rien de technique : ce qui fait le prix ici, c'est le temps écoulé depuis le dernier nettoyage, pas la difficulté d'accès.",
      en: 'Detached houses with gardens, most of it reachable from ground level. Nothing technical about it: what sets the price here is the time since the last clean, not the difficulty of the access.',
    },
  },
];

export const communeSlugs = communes.map((c) => c.slug);

export function getCommune(slug: string): Commune | undefined {
  return communes.find((c) => c.slug === slug);
}

/**
 * The `n` communes physically closest to `c`.
 *
 * The "communes voisines" block used to be `communes.slice(0, 6)`, which is
 * array order, not geography: it linked Étampes to Linas (24 km) while five
 * of the twelve hubs received no inbound sibling link at all. Distance is
 * haversine over the `geo` field each commune already carries.
 *
 * Ties break on slug so the static export stays byte-identical between builds.
 */
export function nearestCommunes(c: Commune, n = 6): Commune[] {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const km = (a: Commune, b: Commune) => {
    const dLat = rad(b.geo.lat - a.geo.lat);
    const dLng = rad(b.geo.lng - a.geo.lng);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(a.geo.lat)) * Math.cos(rad(b.geo.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  return communes
    .filter((x) => x.slug !== c.slug)
    .map((x) => ({ commune: x, d: km(c, x) }))
    .sort((a, b) => a.d - b.d || a.commune.slug.localeCompare(b.commune.slug))
    .slice(0, n)
    .map((x) => x.commune);
}

/**
 * The served communes grouped by postal code, ascending, each group's communes
 * in the order they appear in `communes`.
 *
 * Three of the twelve postal codes cover more than one commune — 91290 alone
 * covers Arpajon, La Norville and Ollainville — which is exactly why this is an
 * index and not a lookup: "enter your postal code" cannot resolve to a single
 * page here, and resolving it in the browser would need a fifth `'use client'`
 * component that CLAUDE.md rule 2 does not allow.
 *
 * An index is the better trade anyway. It is crawlable, it is complete, and it
 * answers `nettoyage 91150` — a query shape no other page on the site targets.
 * ROADMAP phase 8b.
 */
export function communesByPostalCode(): { postalCode: string; communes: Commune[] }[] {
  const groups = new Map<string, Commune[]>();
  for (const c of communes) {
    const existing = groups.get(c.postalCode);
    if (existing) existing.push(c);
    else groups.set(c.postalCode, [c]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([postalCode, list]) => ({ postalCode, communes: list }));
}
