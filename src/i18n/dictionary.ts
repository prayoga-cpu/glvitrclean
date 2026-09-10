/**
 * Every string that is not content data.
 *
 * The shape is declared once as `UiStrings` and the dictionary is typed
 * `Localized<UiStrings>`, so a missing English key is a typecheck failure, not
 * a page that quietly falls back to French.
 *
 * Content that belongs to a service, a commune, or an FAQ entry does NOT live
 * here — it lives in src/data/ next to the thing it describes.
 *
 * COMPLIANCE: nothing in `b2b` may mention the tax credit, the 50% figure, the
 * avance immédiate, or URSSAF, in either language. See CLAUDE.md rule 1.
 */

import type { Localized } from '@/i18n/config';
import type { Weekday } from '@/data/company';
import { ofCommune } from '@/lib/french';
import type { ReviewSource } from '@/data/reviews';

export interface UiStrings {
  common: {
    homeLabel: string;
    callPrefix: string;
    freeQuote: string;
    requestQuote: string;
    requestQuoteOnline: string;
    contactUs: string;
    whatsapp: string;
    skipToContent: string;
    switchLanguage: string;
    illustrativePhoto: string;
    illustrativePhotos: string;
    /**
     * The photo-quote path, promoted out of prose. ROADMAP phase 8e.
     *
     * `services.ts` already says a photo is often enough on `poubelles` and
     * `panneaux-solaires`, and `common.whatsapp` already labels the button
     * "send a photo". This is the sentence that says so where a visitor is
     * actually deciding.
     *
     * WHICH services it may appear on is decided by `Service.photoQuote` in
     * src/data/services.ts, not here and not by the caller. It shipped
     * hard-coded on every service page and had to be gated on review: on
     * `facade` the bodyCopy says a prior visit is indispensable and on
     * `terrasse` the area is measured on site, so the line was an offer those
     * pages deny. Hedging the wording to "for many jobs" was not enough — on a
     * page about one service, a hedge still reads as a yes.
     *
     * It keeps the hedge anyway, because the service-agnostic callers (the
     * commune hubs, the two hub pages) cover all seven and there the hedge is
     * literally accurate. Do not add a response time: that is a `[client]`
     * item, see TODO.md, and `docs/05` forbids inventing one.
     */
    photoQuote: string;
  };
  nav: {
    label: string;
    mobileLabel: string;
    open: string;
    close: string;
    home: string;
    taxCredit: string;
    business: string;
    work: string;
    services: string;
    /** Footer column heading for the commune links. Phase 8b. */
    zones: string;
    theSite: string;
    contact: string;
  };
  footer: {
    leadA: string;
    leadB: string;
    responseTime: string;
    about: string;
    rights: string;
    legalNotice: string;
    privacy: string;
  };
  /**
   * The floating chat launcher. It is a static disclosure that routes to real
   * channels, not a live chat: nothing here may promise a response time.
   * See docs/05-conversion-architecture.md.
   */
  chat: {
    /** Label on the closed bubble. */
    open: string;
    /** Label on the same bubble once the panel is open. */
    close: string;
    title: string;
    body: string;
    whatsapp: string;
    /** First line of the WhatsApp draft, so the visitor starts mid-sentence. */
    prefill: string;
  };
  /**
   * Opening hours. The days and the times themselves are language-invariant
   * and live in `company.openingHours`; only their wording belongs here.
   */
  hours: {
    title: string;
    /** Display name for each schema.org day value. */
    day: Record<Weekday, string>;
    /** One clock time, built from 24-hour parts. */
    clock: (hour: number, minute: number) => string;
    /** A day range and its hours, with that language's punctuation. */
    line: (days: string, time: string) => string;
  };
  home: {
    heroFlagline: string;
    h1a: string;
    h1b: string;
    lead: string;
    statQuote: string;
    statServices: string;
    statCommunes: string;
    aboutEyebrow: string;
    aboutH2a: string;
    aboutH2b: string;
    aboutLead: string;
    aboutChecklist: string[];
    aboutB2bLink: string;
    servicesEyebrow: string;
    servicesH2a: string;
    servicesH2b: string;
    servicesIntro: string;
    stepsEyebrow: string;
    stepsH2a: string;
    stepsH2b: string;
    steps: { title: string; body: string }[];
    whyEyebrow: string;
    whyH2a: string;
    whyH2b: string;
    whyCards: { title: string; body: string }[];
    referralTitle: string;
    referralBody: string;
    zonesEyebrow: string;
    zonesH2a: string;
    zonesH2b: string;
    zonesIntro: string;
    contactEyebrow: string;
    contactH2a: string;
    contactH2b: string;
    contactLead: string;
    phoneLabel: string;
    emailLabel: string;
  };
  service: {
    /** "{service} in Essonne (91)" */
    h1Suffix: string;
    inYourCommune: (service: string) => string;
    linkInCommune: (service: string, commune: string) => string;
    /**
     * The pricing block. ROADMAP phase 8d.
     *
     * Rendered as label/value rows rather than sentences, because
     * `service.pricing.basis` holds fragments — `au m²`, `forfait maison`,
     * `horaire`, `sur devis` — that no single French sentence frame can take
     * without turning ungrammatical on at least two of the seven.
     *
     * The `from` row appears only once `service.pricing.fromEur` stops being
     * null, which is a client decision (rule 7). Until then the block states a
     * basis with no figure — which is exactly what CLAUDE.md rule 4 permits,
     * and never a bare number with no unit.
     */
    pricingH2: string;
    pricingBasisLabel: string;
    pricingFromLabel: string;
    /** Shown only when `service.duration` is non-null. */
    pricingDurationLabel: string;
    pricingQuoteLabel: string;
    pricingQuoteValue: string;
    /**
     * What actually moves the price. Deliberately says "the area OR the time":
     * three of the seven services are not priced by area at all — ménage is
     * hourly, poubelles per bin, panneaux-solaires per panel — and this one
     * string renders on all fourteen service pages.
     */
    pricingFactors: string;
    /** Heading over `service.longTail`. Takes `service.inSentence`. */
    coversH2: (inSentence: string) => string;
    coversIntro: string;
    processH2: string;
  };
  commune: {
    h1: (commune: string, postalCode: string) => string;
    ourServicesIn: (commune: string) => string;
    /** Takes the commune so the H2 names the place, not just "nearby". */
    neighbouring: (commune: string) => string;
    linkServiceIn: (service: string, commune: string) => string;
    /** Heading for the links back up to the service hubs. */
    allServiceHubs: string;
    /** Headings over `commune.soiling` and `commune.housing`. Phase 8a. */
    soilingH2: (commune: string) => string;
    housingH2: (commune: string) => string;
    processH2: (commune: string) => string;
  };
  communeService: {
    h1: (service: string, commune: string, postalCode: string) => string;
    relatedLabel: string;
    serviceInRegion: (service: string) => string;
    allServicesIn: (commune: string) => string;
    /** Heading over the commune's soiling + housing pair. Phase 8a. */
    localContextH2: (commune: string) => string;
    /**
     * The lateral crossing: same service, nearest communes. Phase 8b. These 84
     * pages linked up to two hubs and nowhere sideways.
     */
    nearbyH2: (service: string) => string;
  };
  taxCreditPage: {
    /** Takes the rate so the figure is never static text. CLAUDE.md rule 1. */
    h1: (pct: number) => string;
    tableHeading: string;
    colService: string;
    colEligible: string;
    colWhy: string;
    yes: string;
    no: string;
    cap: (amount: string) => string;
    billedBy: (holder: string, number: string) => string;
    pending: string;
  };
  b2b: {
    h1: string;
    interventions: string;
    /**
     * COMPLIANCE: nothing under `b2b` may mention the tax credit, the rate,
     * the avance immédiate, URSSAF, or Services à la Personne — in either
     * language, not even to say it does not apply. CLAUDE.md rule 1.
     */
    intro: string;
    whyH2: string;
    why: string[];
    contactH2: string;
    contactBody: string;
  };
  quote: {
    h1: string;
  };
  hubs: {
    servicesH1: string;
    /**
     * Takes `services.length` rather than spelling the number out, for the
     * same reason `postalIntro` below takes its counts: an eighth service must
     * not leave this sentence claiming seven. `seo.ts` derives the same number
     * into the `/services` description.
     */
    servicesIntro: (serviceCount: number) => string;
    zonesH1: string;
    zonesIntro: string;
    zonesListH2: string;
    /**
     * The postal-code index. Phase 8b.
     *
     * Three of the twelve codes cover more than one commune, so this is an
     * index rather than a lookup — and an index is crawlable, which a browser
     * lookup would not have been. It also answers `nettoyage 91150`, a query
     * shape nothing else on the site targets.
     */
    postalH2: string;
    /**
     * Takes both counts rather than stating them, for the reason CLAUDE.md
     * rule 0 gives about the route totals: a commune added to `src/data/` must
     * not leave a sentence lying about how many there are.
     */
    postalIntro: (communeCount: number, codeCount: number) => string;
    /** Accessible name for one code's list of communes. */
    postalGroupLabel: (postalCode: string) => string;
    /** The "near me" wording, which is how this is actually searched. */
    nearMeH2: string;
    nearMeBody: string;
  };
  work: {
    h1: string;
    intro: string;
    whatH2: string;
    photosPendingH2: string;
    photosPending: string;
    /**
     * The before/after gallery. Nothing renders these until
     * `src/data/realisations.ts` has real pairs — ROADMAP phase 5.
     */
    galleryH2: string;
    before: string;
    after: string;
  };
  legal: {
    noticeH1: string;
    publisher: string;
    host: string;
    insurance: string;
    /** Printed only once `company.insurance` holds a real policy. */
    insuranceLine: (insurer: string, coverEur: string) => string;
    insurancePolicy: (policyNumber: string) => string;
    toComplete: string;
    siret: string;
    phone: string;
    email: string;
    privacyH1: string;
    /** Shown on the English legal pages only. */
    courtesyTranslation: string;
    /**
     * RGPD Art. 13 notice for the quote form. The form is the only place the
     * site collects a personal datum: there is no analytics script and no
     * cookie in v1 (CLAUDE.md rule 2), so there is nothing else to declare.
     *
     * `retentionBody` and `recipientsBody` are deliberately written around a
     * fact the client has not supplied yet — see STATUS.md items 18 and 19.
     * Do not invent a retention period or name a processor.
     */
    privacy: {
      controllerH2: string;
      controllerBody: (name: string, email: string) => string;
      collectedH2: string;
      collectedIntro: string;
      collectedItems: string[];
      purposeH2: string;
      purposeBody: string;
      basisH2: string;
      basisBody: string;
      recipientsH2: string;
      recipientsBody: string;
      retentionH2: string;
      retentionBody: string;
      rightsH2: string;
      rightsIntro: string;
      rightsItems: string[];
      rightsHow: (email: string) => string;
      cnil: string;
      cookiesH2: string;
      cookiesBody: string;
    };
  };
  notFound: {
    h1: string;
    body: string;
    backHome: string;
  };
  faq: {
    heading: string;
  };
  /**
   * Customer reviews. `<Reviews />` renders nothing until `src/data/reviews.ts`
   * is non-empty, so none of this is on a page yet — see ROADMAP phase 7.
   *
   * `summary` and `stars` take their figures rather than stating them, for the
   * same reason the postal counts do: a rating typed into a string is a rating
   * that can disagree with the reviews underneath it.
   *
   * `source` is keyed by the `ReviewSource` union, so adding a fourth place a
   * review can come from is a typecheck failure here until it has a label in
   * both editions.
   */
  reviews: {
    h2: string;
    summary: (value: number, best: number, count: number) => string;
    /** Accessible name for the star row. */
    stars: (rating: number, best: number) => string;
    source: Record<ReviewSource, string>;
    checkOn: (sourceLabel: string) => string;
  };
  /**
   * The floating welcome message. Client feedback item 9, 2026-09-09.
   *
   * The client's own wording was "Que puis-je faire pour vous ?" — first person
   * singular. Item 7 of the same feedback replaces the single-person
   * positioning with a team message, so the plural is used here to keep the two
   * instructions from contradicting each other on every page of the site.
   * Reverting is one word. See STATUS.md.
   */
  welcome: {
    message: string;
    /** Accessible name of the dismiss control. */
    dismiss: string;
  };
  form: {
    name: string;
    phone: string;
    whatToClean: string;
    choosePlaceholder: string;
    choose: string;
    optional: string;
    commune: string;
    access: string;
    accessGround: string;
    accessUpstairs: string;
    accessVeranda: string;
    accessHigh: string;
    details: string;
    email: string;
    /* Split so the middle segment can be a link to /confidentialite.
       docs/05 requires the consent line to point at the policy. */
    consentBefore: string;
    consentLinkLabel: string;
    consentAfter: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
  };
  taxCreditBadge: {
    pending: (pct: number) => string;
    pendingNote: string;
    live: (pct: number) => string;
    liveAfter: string;
    liveNote: (holder: string, number: string) => string;
  };
}

const fr: UiStrings = {
  common: {
    homeLabel: 'accueil',
    callPrefix: 'Appeler le',
    freeQuote: 'Devis gratuit',
    requestQuote: 'Demander un devis',
    requestQuoteOnline: 'Demander un devis en ligne ›',
    contactUs: 'Nous contacter',
    whatsapp: 'Envoyer une photo par WhatsApp',
    skipToContent: 'Aller au contenu',
    switchLanguage: 'Voir cette page en anglais',
    illustrativePhoto: "Photo d'illustration.",
    illustrativePhotos:
      "Photos d'illustration. Les photos des chantiers réels arrivent avec l'archive du client.",
    photoQuote:
      "Envoyez une photo : pour beaucoup de prestations, elle suffit à préparer le devis sans déplacement.",
  },
  nav: {
    label: 'Navigation principale',
    mobileLabel: 'Navigation mobile',
    open: 'Ouvrir le menu',
    close: 'Fermer le menu',
    home: 'Accueil',
    taxCredit: "Crédit d'impôt",
    business: 'Professionnels',
    work: 'Réalisations',
    services: 'Prestations',
    zones: "Zones d'intervention",
    theSite: 'Le site',
    contact: 'Contact',
  },
  footer: {
    leadA: 'Parlons de vos',
    leadB: 'surfaces à nettoyer.',
    // No 24 h commitment: nothing in src/data/ or docs/ backs one, and a
    // solo operator on a roof cannot honour it. CLAUDE.md rule 4.
    responseTime: 'Devis gratuit et sans engagement.',
    about:
      "Nettoyage de vitres, terrasses, volets, façades, panneaux solaires et ménage à domicile en Essonne (91) et en Seine-et-Marne (77), chez les particuliers comme chez les professionnels. Pas de sous-traitance : vous traitez directement avec notre équipe.",
    rights: 'Tous droits réservés.',
    legalNotice: 'Mentions légales',
    privacy: 'Confidentialité',
  },
  chat: {
    open: 'Nous écrire',
    close: 'Fermer',
    title: 'Une question ?',
    // Deliberately no delay promise, for the same reason footer.responseTime
    // carries none: nothing in src/data/ backs one. CLAUDE.md rule 4.
    body: 'Envoyez votre message sur WhatsApp, ou appelez directement. Le devis est gratuit et sans engagement.',
    whatsapp: 'Discuter sur WhatsApp',
    prefill: 'Bonjour, je souhaite un devis pour ',
  },
  hours: {
    title: "Horaires d'ouverture",
    day: {
      Monday: 'Lundi',
      Tuesday: 'Mardi',
      Wednesday: 'Mercredi',
      Thursday: 'Jeudi',
      Friday: 'Vendredi',
      Saturday: 'Samedi',
      Sunday: 'Dimanche',
    },
    // French clock: '9h00', '18h30'. No leading zero on the hour, no AM/PM.
    clock: (hour, minute) => `${hour}h${String(minute).padStart(2, '0')}`,
    // French typography puts a non-breaking space before a colon.
    line: (days, time) => `${days}\u00a0: ${time}`,
  },
  home: {
    heroFlagline: 'Devis gratuit et sans engagement',
    h1a: 'Nettoyage de vitres, terrasses et ménage',
    h1b: "en Essonne et en Seine-et-Marne.",
    lead: "Vitres, terrasses, volets, façades, panneaux solaires et ménage à domicile, chez les particuliers comme chez les professionnels. Une équipe qui intervient elle-même, des produits respectueux de l'environnement, et un devis gratuit avant de commencer.",
    statQuote: 'le devis, sans engagement',
    statServices: "prestations, à l'intérieur comme à l'extérieur",
    statCommunes: 'communes desservies en Essonne (91)',
    aboutEyebrow: '◆ Qui sommes-nous',
    aboutH2a: 'Une équipe à votre disposition,',
    aboutH2b: 'votre satisfaction notre priorité',
    aboutLead:
      "Derrière GLVITR'CLEAN, il y a une équipe compétente et expérimentée, qui se déplace elle-même sur chaque chantier. Pas de sous-traitance, pas d'intermédiaire : vous parlez aux personnes qui font le travail, du devis jusqu'à la vérification finale.",
    aboutChecklist: [
      "Pas de sous-traitance, pas d'intermédiaire",
      'Un seul interlocuteur, du devis à la fin du chantier',
      "Produits respectueux de l'environnement",
      'Devis gratuit et sans engagement',
      'Particuliers et professionnels',
    ],
    aboutB2bLink: 'Vous êtes une entreprise ? ›',
    servicesEyebrow: '◆ Ce que nous nettoyons',
    servicesH2a: 'Nos services',
    servicesH2b: 'sur mesure',
    servicesIntro:
      "Vitres, terrasses, volets, façades, panneaux solaires, poubelles ou ménage complet : chaque intervention est adaptée au lieu et à sa fréquence d'usage.",
    stepsEyebrow: '◆ Comment ça se passe',
    stepsH2a: 'Un devis, une date,',
    stepsH2b: 'des vitres nettes',
    steps: [
      {
        title: 'Vous demandez un devis',
        body: 'Par téléphone, par WhatsApp ou via le formulaire. Gratuit et sans engagement.',
      },
      {
        title: 'Nous chiffrons le travail',
        body: "Surfaces, accès, fréquence : vous avez le prix par écrit avant le début du chantier.",
      },
      {
        title: 'Nous intervenons',
        body: 'Matériel adapté, produits écologiques, et un résultat vérifié avec vous.',
      },
    ],
    whyEyebrow: '◆ Pourquoi nous choisir',
    whyH2a: 'Pourquoi choisir',
    whyH2b: "GLVITR'CLEAN ?",
    whyCards: [
      {
        title: 'Une équipe, sans intermédiaire',
        body: "Notre équipe réalise elle-même chaque intervention, du devis à la vérification finale. Pas de sous-traitance, pas d'intermédiaire.",
      },
      {
        title: 'Produits écologiques',
        body:
      // Not "sûrs pour les enfants et les animaux": that is a product-safety
      // claim and no product data sheet exists in src/data/. Rule 4.
      "Des produits respectueux de l'environnement, choisis pour l'intérieur comme pour l'extérieur.",
      },
      {
        title: 'Services à la Personne',
        body: 'Vitres, terrasses, volets, ménage à domicile : ces prestations relèvent de ce dispositif pour les particuliers. Les conditions sont détaillées sur la page dédiée.',
      },
    ],
    referralTitle: 'Parrainage',
    referralBody: 'pour chaque nouveau client que vous nous recommandez.',
    zonesEyebrow: "◆ Zones d'intervention",
    zonesH2a: 'Nous intervenons',
    zonesH2b: 'dans votre commune',
    zonesIntro:
      "Nous intervenons en Essonne (91) et en Seine-et-Marne (77). Les communes ci-dessous sont celles de l'Essonne, le long de la N20 et du RER C, de Montlhéry à Étampes. La vôtre n'y est pas ? Appelez, elle est peut-être sur la route.",
    contactEyebrow: '◆ Contact',
    contactH2a: 'Prêt à voir',
    contactH2b: 'la différence ?',
    contactLead:
      "Appelez pour un devis gratuit, ou envoyez une photo de ce qu'il y a à nettoyer. C'est souvent plus rapide qu'un formulaire.",
    phoneLabel: 'Téléphone',
    emailLabel: 'Courriel',
  },
  service: {
    h1Suffix: 'en Essonne (91) et en Seine-et-Marne (77)',
    inYourCommune: (service) => `${service} dans votre commune`,
    linkInCommune: (service, commune) => `${service} à ${commune}`,
    pricingH2: 'Comment le prix est calculé',
    pricingBasisLabel: 'Mode de calcul',
    pricingFromLabel: 'À partir de',
    pricingDurationLabel: 'Durée sur place',
    pricingQuoteLabel: 'Devis',
    pricingQuoteValue: 'gratuit et sans engagement',
    pricingFactors:
      "Selon la prestation, c'est la surface ou la durée, l'accès et l'état du support qui font le prix. Il est fixé par écrit avant l'intervention.",
    coversH2: (inSentence) => `Ce que le ${inSentence} couvre aussi`,
    coversIntro:
      'Ces demandes relèvent de la même prestation. Inutile de chercher une page séparée : appelez et dites ce que vous avez.',
    processH2: 'Comment ça se passe',
  },
  commune: {
    // The qualifier is the client's own differentiator (feedback §7), not a
    // decoration: "sans sous-traitance" narrows the H1 to the thing a visitor
    // choosing between a marketplace and a company is actually deciding.
    // ROADMAP phase 8c.
    //
    // It is on the twelve commune HUBS only. It was briefly on the 84 crossings
    // too, and came off on review: there the H1 should be the tightest possible
    // match to "nettoyage de vitres à Étampes", and the same appended phrase on
    // 168 more H1s dilutes that without telling anyone anything new. A hub is
    // where a visitor is choosing a provider; a crossing is where they are
    // checking we do one job in one town.
    h1: (commune, postalCode) => `Nettoyage à ${commune} (${postalCode}), sans sous-traitance`,
    ourServicesIn: (commune) => `Nos prestations à ${commune}`,
    allServiceHubs: 'Nos prestations en Essonne',
    neighbouring: (commune) => `Les communes autour ${ofCommune(commune)}`,
    linkServiceIn: (service, commune) => `${service} à ${commune}`,
    soilingH2: (commune) => `Ce qui salit, à ${commune}`,
    housingH2: (commune) => `Les maisons ${ofCommune(commune)}`,
    processH2: (commune) => `Une intervention à ${commune}, étape par étape`,
  },
  communeService: {
    h1: (service, commune, postalCode) => `${service} à ${commune} (${postalCode})`,
    relatedLabel: 'Liens connexes',
    serviceInRegion: (service) => `${service} en Essonne`,
    allServicesIn: (commune) => `Toutes nos prestations à ${commune}`,
    localContextH2: (commune) => `Ce qui change à ${commune}`,
    nearbyH2: (service) => `${service} dans les communes voisines`,
  },
  taxCreditPage: {
    h1: (pct) => `Le crédit d'impôt de ${pct} % sur le nettoyage à domicile`,
    tableHeading: 'Quelles prestations y ouvrent droit',
    colService: 'Prestation',
    colEligible: "Crédit d'impôt",
    colWhy: 'Pourquoi',
    yes: 'Oui',
    no: 'Non',
    cap: (amount) =>
      `Plafond : ${amount} € de dépenses par an et par foyer fiscal, tous services à la personne confondus.`,
    billedBy: (holder, number) =>
      `Prestations facturées par ${holder}, déclaré sous le numéro ${number}.`,
    pending:
      "Le numéro de déclaration de l'organisme prestataire vous est communiqué avec le devis.",
  },
  b2b: {
    h1: 'Nettoyage pour professionnels en Essonne et en Seine-et-Marne',
    interventions: 'Nos interventions',
    intro:
      "Vitrines, bureaux, parties communes, façades, panneaux solaires et conteneurs, pour les commerces, les copropriétés et les entreprises d'Essonne (91) et de Seine-et-Marne (77). Intervention ponctuelle ou passage régulier, selon ce dont vous avez besoin.",
    whyH2: 'Ce que vous pouvez attendre',
    why: [
      "Une équipe qui intervient elle-même, du devis à la fin du chantier : pas de sous-traitance, pas d'intermédiaire.",
      "Des horaires choisis avec vous : avant l'ouverture, après la fermeture, ou pendant les heures creuses.",
      "Des produits respectueux de l'environnement, y compris en intérieur occupé.",
      'Un devis écrit avant toute intervention, gratuit et sans engagement.',
    ],
    contactH2: "Parler à l'équipe",
    contactBody:
      "Vous parlez directement à l'équipe qui réalise les interventions. Décrivez la surface, la fréquence et les contraintes d'accès, et vous recevrez un devis écrit.",
  },
  quote: {
    h1: 'Demander un devis gratuit',
  },
  hubs: {
    servicesH1: 'Nos prestations de nettoyage en Essonne (91) et en Seine-et-Marne (77)',
    servicesIntro: (serviceCount) =>
      `${serviceCount} prestations, chez les particuliers comme chez les professionnels d'Essonne (91) et de Seine-et-Marne (77). Chaque page détaille ce qui est compris et comment le devis est établi.`,
    zonesH1: "Nos zones d'intervention en Essonne et en Seine-et-Marne",
    zonesIntro:
      "Nous intervenons en Essonne (91) et en Seine-et-Marne (77). Les communes listées ci-dessous sont celles de l'Essonne, sur le corridor N20 et RER C : ce sont celles où nous passons le plus souvent. La vôtre n'y est pas ? Appelez, elle est peut-être sur la route.",
    zonesListH2: "Les communes desservies en Essonne (91)",
    postalH2: 'Par code postal',
    postalIntro: (communeCount, codeCount) =>
      `${communeCount} communes pour ${codeCount} codes postaux : certains en couvrent plusieurs. Trouvez le vôtre, la page de votre commune est en dessous.`,
    postalGroupLabel: (postalCode) => `Communes du ${postalCode}`,
    nearMeH2: 'Une entreprise de nettoyage près de chez vous',
    nearMeBody:
      "Notre secteur suit la N20 et le RER C, du nord au sud de l'Essonne. Si votre commune est dans la liste, elle est sur notre route habituelle ; si elle n'y est pas mais qu'elle est en Essonne ou en Seine-et-Marne, appelez : elle l'est peut-être quand même.",
  },
  work: {
    h1: 'Nos réalisations',
    galleryH2: 'Avant et après',
    before: 'Avant',
    after: 'Après',
    intro:
      "Voici ce que comprend concrètement chaque prestation, et ce qui change une fois le travail fait. Chaque chantier commence par un devis écrit, gratuit et sans engagement.",
    whatH2: 'Ce que comprend chaque prestation',
    photosPendingH2: 'Les photos',
    photosPending:
      "Les photos de chantiers réels sont en cours de préparation avec le client. Nous préférons une page sans photo à une page illustrée par des images qui ne sont pas les nôtres.",
  },
  legal: {
    noticeH1: 'Mentions légales',
    publisher: 'Éditeur',
    host: 'Hébergeur',
    insurance: 'Assurance responsabilité civile professionnelle',
    insuranceLine: (insurer, coverEur) =>
      `Responsabilité civile professionnelle souscrite auprès de ${insurer}, à hauteur de ${coverEur} €.`,
    insurancePolicy: (policyNumber) => `Police n° ${policyNumber}.`,
    toComplete: 'À compléter.',
    siret: 'SIRET',
    phone: 'Téléphone',
    email: 'E-mail',
    privacyH1: 'Politique de confidentialité',
    courtesyTranslation: '',
    privacy: {
      controllerH2: 'Qui est responsable de vos données',
      controllerBody: (name, email) =>
        `${name}, joignable à l'adresse ${email}, est responsable du traitement des données collectées sur ce site.`,
      collectedH2: 'Ce que nous collectons',
      collectedIntro:
        'Le formulaire de devis est le seul endroit du site où des données personnelles sont saisies. Il recueille :',
      collectedItems: [
        'votre nom',
        'votre numéro de téléphone',
        'la prestation souhaitée',
        'votre commune, si vous la renseignez',
        "le type d'accès, si vous le renseignez",
        'la surface ou le nombre de fenêtres, si vous les renseignez',
        'votre adresse e-mail, si vous la renseignez',
      ],
      purposeH2: 'Pourquoi',
      purposeBody:
        'Uniquement pour étudier votre demande, vous rappeler et vous établir un devis. Vos données ne sont ni vendues, ni utilisées à des fins publicitaires, ni transmises à des tiers en dehors de ce qui est indiqué ci-dessous.',
      basisH2: 'Sur quelle base',
      basisBody:
        "Votre consentement, donné en cochant la case du formulaire, et l'exécution de mesures précontractuelles prises à votre demande (article 6.1.a et 6.1.b du RGPD). Vous pouvez retirer votre consentement à tout moment.",
      recipientsH2: 'Qui y a accès',
      recipientsBody:
        "Le site est un site statique, sans base de données : il ne conserve rien. Le formulaire transmet votre demande à un prestataire d'envoi de formulaires, qui l'achemine vers notre boîte e-mail. Ce prestataire n'est pas encore arrêté ; son identité sera indiquée ici avant la mise en ligne du formulaire.",
      retentionH2: 'Combien de temps',
      retentionBody:
        "Une demande restée sans suite est supprimée de notre boîte e-mail au terme d'un délai que nous précisons ici avant la mise en ligne du formulaire. Une demande suivie d'une prestation est conservée le temps requis par nos obligations comptables.",
      rightsH2: 'Vos droits',
      rightsIntro: 'Vous disposez à tout moment des droits suivants sur vos données :',
      rightsItems: [
        'y accéder et en obtenir une copie',
        'les faire corriger si elles sont inexactes',
        'les faire effacer',
        'vous opposer à leur traitement',
        'en demander la portabilité',
      ],
      rightsHow: (email) =>
        `Pour exercer l'un de ces droits, écrivez à ${email}. Nous répondons sous un mois.`,
      cnil:
        'Si notre réponse ne vous convient pas, vous pouvez saisir la CNIL, 3 place de Fontenoy, 75007 Paris, ou sur cnil.fr.',
      cookiesH2: 'Cookies et mesure d\u2019audience',
      cookiesBody:
        "Ce site ne dépose aucun cookie et n'utilise aucun outil de mesure d'audience. Il n'y a donc pas de bandeau de consentement : il n'y a rien à consentir.",
    },
  },
  notFound: {
    h1: 'Page introuvable',
    body: "Cette page n'existe pas, ou son adresse a changé. Nos prestations et nos zones d'intervention sont accessibles depuis l'accueil.",
    backHome: "Retour à l'accueil",
  },
  faq: {
    heading: 'Questions fréquentes',
  },
  reviews: {
    h2: 'Ce que disent nos clients',
    // "avis" is invariable, so no plural branch is needed on the count.
    summary: (value, best, count) => `${value} sur ${best}, sur ${count} avis.`,
    stars: (rating, best) => `${rating} étoile${rating > 1 ? 's' : ''} sur ${best}`,
    source: {
      google: 'Google',
      facebook: 'Facebook',
      paper: 'avis remis en main propre',
    },
    checkOn: (sourceLabel) => `Vérifier sur ${sourceLabel}`,
  },
  welcome: {
    message: 'Que pouvons-nous faire pour vous ?',
    dismiss: 'Fermer le message de bienvenue',
  },
  form: {
    name: 'Votre nom',
    phone: 'Votre téléphone',
    whatToClean: "Ce qu'il faut nettoyer",
    choosePlaceholder: 'Choisir une prestation',
    choose: 'Choisir',
    optional: 'Précisions (facultatif)',
    commune: 'Commune',
    access: 'Accès',
    accessGround: 'Plain-pied',
    accessUpstairs: 'Étage',
    accessVeranda: 'Véranda ou fenêtre de toit',
    accessHigh: 'Hauteur difficile',
    details: 'Surface ou nombre de fenêtres',
    email: 'E-mail',
    consentBefore:
      "J'accepte que mes informations soient utilisées pour me recontacter au sujet de ma demande, dans les conditions décrites dans la ",
    consentLinkLabel: 'politique de confidentialité',
    consentAfter: '.',
    submit: 'Demander un devis gratuit',
    sending: 'Envoi…',
    success: 'Merci, votre demande est bien partie. Nous vous rappelons au numéro indiqué.',
    error: "L'envoi a échoué. Appelez-nous directement.",
  },
  taxCreditBadge: {
    pending: (pct) =>
      `Cette prestation entre dans le champ des Services à la Personne, qui ouvre droit à un crédit d'impôt de ${pct} % pour les particuliers.`,
    pendingNote:
      "Les conditions et le numéro de déclaration de l'organisme prestataire vous sont communiqués avec le devis.",
    live: (pct) => `${pct} % de crédit d'impôt`,
    liveAfter: "après crédit d'impôt",
    liveNote: (holder, number) =>
      `Prestation facturée par ${holder}, déclaré sous le numéro ${number}.`,
  },
};

const en: UiStrings = {
  common: {
    homeLabel: 'home',
    callPrefix: 'Call',
    freeQuote: 'Free quote',
    requestQuote: 'Request a quote',
    requestQuoteOnline: 'Request a quote online ›',
    contactUs: 'Contact us',
    whatsapp: 'Send a photo on WhatsApp',
    skipToContent: 'Skip to content',
    switchLanguage: 'View this page in French',
    illustrativePhoto: 'Illustrative photo.',
    illustrativePhotos:
      "Illustrative photos. Pictures of the real jobs will follow with the client's own archive.",
    photoQuote:
      'Send a photo: for many jobs that is all we need to prepare the quote, with no visit.',
  },
  nav: {
    label: 'Main navigation',
    mobileLabel: 'Mobile navigation',
    open: 'Open the menu',
    close: 'Close the menu',
    home: 'Home',
    taxCredit: 'Tax credit',
    business: 'For businesses',
    work: 'Our work',
    services: 'Services',
    zones: 'Where we work',
    theSite: 'This site',
    contact: 'Contact',
  },
  footer: {
    leadA: "Let's talk about the",
    leadB: 'surfaces you need cleaned.',
    responseTime: 'Free quote, no obligation.',
    about:
      'Window, terrace, shutter, facade and solar panel cleaning plus domestic housekeeping across the Essonne (91) and the Seine-et-Marne (77), for private homes and businesses alike. No subcontracting: you deal with our team directly.',
    rights: 'All rights reserved.',
    legalNotice: 'Legal notice',
    privacy: 'Privacy',
  },
  chat: {
    open: 'Message us',
    close: 'Close',
    title: 'Got a question?',
    body: 'Send us a message on WhatsApp, or call us directly. The quote is free, with no obligation.',
    whatsapp: 'Chat on WhatsApp',
    prefill: "Hi, I'd like a quote for ",
  },
  hours: {
    title: 'Opening hours',
    day: {
      Monday: 'Monday',
      Tuesday: 'Tuesday',
      Wednesday: 'Wednesday',
      Thursday: 'Thursday',
      Friday: 'Friday',
      Saturday: 'Saturday',
      Sunday: 'Sunday',
    },
    // 12-hour with AM/PM, the form the client gave the hours in.
    clock: (hour, minute) => {
      const suffix = hour < 12 ? 'AM' : 'PM';
      const h = hour % 12 === 0 ? 12 : hour % 12;
      return `${h}:${String(minute).padStart(2, '0')} ${suffix}`;
    },
    line: (days, time) => `${days}: ${time}`,
  },
  home: {
    heroFlagline: 'Free quote, no obligation',
    h1a: 'Window cleaning, terrace cleaning and housekeeping',
    h1b: 'in the Essonne and the Seine-et-Marne.',
    lead: 'Windows, terraces, shutters, facades, solar panels and housekeeping, for private homes and businesses alike. A team that does the work itself, environmentally responsible products, and a free quote before any work begins.',
    statQuote: 'the quote, no obligation',
    statServices: 'services, indoors and out',
    statCommunes: 'towns covered in the Essonne (91)',
    aboutEyebrow: '◆ Who we are',
    aboutH2a: 'A team at your service,',
    aboutH2b: 'your satisfaction our priority',
    aboutLead:
      "Behind GLVITR'CLEAN is a skilled and experienced team that goes out to every job itself. No subcontractors, no intermediaries: you talk to the people doing the work, from the quote through to the final check.",
    aboutChecklist: [
      'No subcontractors, no intermediaries',
      'One point of contact, from quote to finished job',
      'Environmentally responsible products',
      'Free quote, no obligation',
      'Private homes and businesses',
    ],
    aboutB2bLink: 'Are you a business? ›',
    servicesEyebrow: '◆ What we clean',
    servicesH2a: 'Services built',
    servicesH2b: 'around your place',
    servicesIntro:
      'Windows, terraces, shutters, facades, solar panels, bins or a full clean: every job is matched to the place and how often it is used.',
    stepsEyebrow: '◆ How it works',
    stepsH2a: 'A quote, a date,',
    stepsH2b: 'clean windows',
    steps: [
      {
        title: 'You ask for a quote',
        body: 'By phone, on WhatsApp or through the form. Free and with no obligation.',
      },
      {
        title: 'We price the work',
        body: 'Surfaces, access, frequency: you have the price in writing before the job starts.',
      },
      {
        title: 'We do the work',
        body: 'The right equipment, eco-friendly products, and a result we check over with you.',
      },
    ],
    whyEyebrow: '◆ Why choose us',
    whyH2a: 'Why choose',
    whyH2b: "GLVITR'CLEAN?",
    whyCards: [
      {
        title: 'A team, no middleman',
        body: 'Our own team carries out every job, from the quote to the final check. No subcontractors, no intermediaries.',
      },
      {
        title: 'Eco-friendly products',
        body: 'Environmentally responsible products, chosen to work indoors and out.',
      },
      {
        title: 'Services à la Personne',
        body: 'Windows, terraces, shutters and housekeeping at home fall under this French scheme for private customers. The conditions are set out on the dedicated page.',
      },
    ],
    referralTitle: 'Referrals',
    referralBody: 'for every new customer you send our way.',
    zonesEyebrow: '◆ Areas we cover',
    zonesH2a: 'We work',
    zonesH2b: 'in your town',
    zonesIntro:
      'We cover the Essonne (91) and the Seine-et-Marne (77). The towns below are the Essonne ones, along the N20 and RER C corridor, from Montlhéry to Étampes. Yours not on the list? Call anyway — it may well be on the route.',
    contactEyebrow: '◆ Contact',
    contactH2a: 'Ready to see',
    contactH2b: 'the difference?',
    contactLead:
      'Call for a free quote, or just send a photo of what needs cleaning. It is usually quicker than a form.',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
  },
  service: {
    h1Suffix: 'in the Essonne (91) and the Seine-et-Marne (77)',
    inYourCommune: (service) => `${service} in your town`,
    linkInCommune: (service, commune) => `${service} in ${commune}`,
    pricingH2: 'How the price is worked out',
    pricingBasisLabel: 'Priced',
    pricingFromLabel: 'From',
    pricingDurationLabel: 'Time on site',
    pricingQuoteLabel: 'Quote',
    pricingQuoteValue: 'free, with no obligation',
    pricingFactors:
      'Depending on the service, it is the area or the time, the access and the state of the surface that set the price. It is fixed in writing before the work starts.',
    coversH2: (inSentence) => `What ${inSentence} also covers`,
    coversIntro:
      'These all fall under the same job. There is no separate page to look for — call and say what you have.',
    processH2: 'How it works',
  },
  commune: {
    // See the French note, including why this is on the hubs and not on the 84
    // crossings. ROADMAP phase 8c.
    h1: (commune, postalCode) =>
      `Cleaning services in ${commune} (${postalCode}), no subcontractors`,
    ourServicesIn: (commune) => `What we do in ${commune}`,
    allServiceHubs: 'Our services across the Essonne',
    neighbouring: (commune) => `Towns around ${commune}`,
    linkServiceIn: (service, commune) => `${service} in ${commune}`,
    soilingH2: (commune) => `What gets things dirty in ${commune}`,
    housingH2: (commune) => `The houses of ${commune}`,
    processH2: (commune) => `A job in ${commune}, step by step`,
  },
  communeService: {
    h1: (service, commune, postalCode) => `${service} in ${commune} (${postalCode})`,
    relatedLabel: 'Related links',
    serviceInRegion: (service) => `${service} across the Essonne`,
    allServicesIn: (commune) => `Everything we do in ${commune}`,
    localContextH2: (commune) => `What is different in ${commune}`,
    nearbyH2: (service) => `${service} in the towns nearby`,
  },
  taxCreditPage: {
    h1: (pct) => `The ${pct}% tax credit on domestic cleaning`,
    tableHeading: 'Which services qualify',
    colService: 'Service',
    colEligible: 'Tax credit',
    colWhy: 'Why',
    yes: 'Yes',
    no: 'No',
    cap: (amount) =>
      `Annual cap: €${amount} of spending per year per tax household, across all Services à la Personne combined.`,
    billedBy: (holder, number) =>
      `Work invoiced by ${holder}, registered under declaration number ${number}.`,
    pending:
      'The declaration number of the registered provider is given to you together with the quote.',
  },
  b2b: {
    h1: 'Commercial cleaning across the Essonne and the Seine-et-Marne',
    interventions: 'What we handle',
    intro:
      'Shopfronts, offices, communal areas, facades, solar panels and bin stores, for shops, managed blocks and businesses across the Essonne (91) and the Seine-et-Marne (77). One-off visits or a regular round, whichever suits you.',
    whyH2: 'What you can expect',
    why: [
      'A team that does the work itself, from the quote to the end of the job: no subcontractors, no intermediaries.',
      'Hours agreed with you: before opening, after closing, or during quiet periods.',
      'Environmentally responsible products, including in occupied interiors.',
      'A written quote before any work starts, free and with no obligation.',
    ],
    contactH2: 'Talk to us',
    contactBody:
      'You deal directly with the team that carries out the work. Tell us the surface, the frequency and any access constraints, and you will get a written quote.',
  },
  quote: {
    h1: 'Request a free quote',
  },
  hubs: {
    servicesH1: 'Our cleaning services in the Essonne (91) and the Seine-et-Marne (77)',
    servicesIntro: (serviceCount) =>
      `${serviceCount} services, for private homes and businesses across the Essonne (91) and the Seine-et-Marne (77). Each page sets out what is covered and how the quote is worked out.`,
    zonesH1: 'Where we work in the Essonne and the Seine-et-Marne',
    zonesIntro:
      'We cover the Essonne (91) and the Seine-et-Marne (77). The towns listed below are the Essonne ones, along the N20 and RER C corridor: they are where we go most often. Yours not on the list? Call — it may well be on the way.',
    zonesListH2: 'Towns we cover in the Essonne (91)',
    postalH2: 'By postcode',
    postalIntro: (communeCount, codeCount) =>
      `${communeCount} towns across ${codeCount} postcodes — some codes cover more than one. Find yours; the town page is underneath it.`,
    postalGroupLabel: (postalCode) => `Towns in ${postalCode}`,
    nearMeH2: 'A cleaning company near you',
    nearMeBody:
      'Our patch follows the N20 and the RER C, north to south through the Essonne. If your town is on the list, it is on our usual run; if it is not, but it is in the Essonne or the Seine-et-Marne, call anyway — it may be.',
  },
  work: {
    h1: 'Our work',
    galleryH2: 'Before and after',
    before: 'Before',
    after: 'After',
    intro:
      'Here is what each service actually covers, and what changes once the work is done. Every job starts with a written quote, free and with no obligation.',
    whatH2: 'What each service covers',
    photosPendingH2: 'Photographs',
    photosPending:
      'Photographs of real jobs are being prepared with the client. We would rather show no photograph than illustrate this page with images that are not ours.',
  },
  legal: {
    noticeH1: 'Legal notice',
    publisher: 'Publisher',
    host: 'Hosting provider',
    insurance: 'Professional liability insurance',
    insuranceLine: (insurer, coverEur) =>
      `Professional liability insurance held with ${insurer}, covering up to €${coverEur}.`,
    insurancePolicy: (policyNumber) => `Policy no. ${policyNumber}.`,
    toComplete: 'To be completed.',
    siret: 'SIRET',
    phone: 'Phone',
    email: 'Email',
    privacyH1: 'Privacy policy',
    courtesyTranslation:
      'This English version is provided for convenience. The French version is the legally binding one.',
    privacy: {
      controllerH2: 'Who is responsible for your data',
      controllerBody: (name, email) =>
        `${name}, reachable at ${email}, is the data controller for information collected through this site.`,
      collectedH2: 'What we collect',
      collectedIntro:
        'The quote form is the only place on this site where personal data is entered. It collects:',
      collectedItems: [
        'your name',
        'your phone number',
        'the service you are asking about',
        'your town, if you fill it in',
        'the type of access, if you fill it in',
        'the surface area or number of windows, if you fill them in',
        'your email address, if you fill it in',
      ],
      purposeH2: 'Why',
      purposeBody:
        'Only to look at your request, call you back and prepare a quote. Your data is not sold, not used for advertising, and not passed to anyone beyond what is set out below.',
      basisH2: 'On what basis',
      basisBody:
        'Your consent, given by ticking the box on the form, and steps taken at your request before entering into a contract (GDPR Art. 6.1.a and 6.1.b). You may withdraw your consent at any time.',
      recipientsH2: 'Who can see it',
      recipientsBody:
        'This is a static site with no database: it stores nothing. The form passes your request to a form-delivery provider, which forwards it to our mailbox. That provider has not been chosen yet; it will be named here before the form goes live.',
      retentionH2: 'How long we keep it',
      retentionBody:
        'A request that does not lead to a job is deleted from our mailbox after a period we will state here before the form goes live. A request that does lead to a job is kept for as long as our accounting obligations require.',
      rightsH2: 'Your rights',
      rightsIntro: 'At any time you may ask us to:',
      rightsItems: [
        'give you access to your data and a copy of it',
        'correct it if it is wrong',
        'erase it',
        'stop processing it',
        'transfer it to you or to someone else',
      ],
      rightsHow: (email) =>
        `To exercise any of these rights, write to ${email}. We reply within one month.`,
      cnil:
        'If you are not satisfied with our answer, you may complain to the CNIL, 3 place de Fontenoy, 75007 Paris, France, or at cnil.fr.',
      cookiesH2: 'Cookies and analytics',
      cookiesBody:
        'This site sets no cookies and runs no analytics. That is why there is no consent banner: there is nothing to consent to.',
    },
  },
  notFound: {
    h1: 'Page not found',
    body:
      'This page does not exist, or its address has changed. Our services and the areas we cover are all reachable from the home page.',
    backHome: 'Back to the home page',
  },
  faq: {
    heading: 'Frequently asked questions',
  },
  reviews: {
    h2: 'What our customers say',
    summary: (value, best, count) =>
      `${value} out of ${best}, from ${count} review${count > 1 ? 's' : ''}.`,
    stars: (rating, best) => `${rating} out of ${best} stars`,
    source: {
      google: 'Google',
      facebook: 'Facebook',
      paper: 'review given in person',
    },
    checkOn: (sourceLabel) => `Check it on ${sourceLabel}`,
  },
  welcome: {
    message: 'What can we do for you?',
    dismiss: 'Close the welcome message',
  },
  form: {
    name: 'Your name',
    phone: 'Your phone number',
    whatToClean: 'What needs cleaning',
    choosePlaceholder: 'Choose a service',
    choose: 'Choose',
    optional: 'More detail (optional)',
    commune: 'Town',
    access: 'Access',
    accessGround: 'Ground floor',
    accessUpstairs: 'Upstairs',
    accessVeranda: 'Conservatory or roof window',
    accessHigh: 'Hard to reach',
    details: 'Surface area or number of windows',
    email: 'Email',
    consentBefore:
      'I agree that my details may be used to get back to me about this enquiry, on the terms set out in the ',
    consentLinkLabel: 'privacy policy',
    consentAfter: '.',
    submit: 'Request a free quote',
    sending: 'Sending…',
    success: 'Thank you, your request has been sent. We will call you back on the number you gave.',
    error: 'Sending failed. Please call us directly.',
  },
  taxCreditBadge: {
    pending: (pct) =>
      `This service falls within the scope of the French Services à la Personne scheme, which entitles private customers to a ${pct}% income tax credit.`,
    pendingNote:
      'The conditions and the declaration number of the registered provider are given to you together with the quote.',
    live: (pct) => `${pct}% tax credit`,
    liveAfter: 'after the tax credit',
    liveNote: (holder, number) =>
      `Work invoiced by ${holder}, registered under declaration number ${number}.`,
  },
};

export const ui: Localized<UiStrings> = { fr, en };

/** Shorthand: `const t = strings(lang);` */
export function strings(lang: keyof typeof ui): UiStrings {
  return ui[lang];
}
