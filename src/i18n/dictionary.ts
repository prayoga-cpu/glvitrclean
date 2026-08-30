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
  };
  commune: {
    h1: (commune: string, postalCode: string) => string;
    ourServicesIn: (commune: string) => string;
    neighbouring: string;
    linkServiceIn: (service: string, commune: string) => string;
  };
  communeService: {
    h1: (service: string, commune: string, postalCode: string) => string;
    relatedLabel: string;
    serviceInRegion: (service: string) => string;
    allServicesIn: (commune: string) => string;
  };
  taxCreditPage: {
    h1: string;
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
  };
  quote: {
    h1: string;
  };
  work: {
    h1: string;
  };
  legal: {
    noticeH1: string;
    publisher: string;
    host: string;
    insurance: string;
    toComplete: string;
    siret: string;
    phone: string;
    email: string;
    privacyH1: string;
    /** Shown on the English legal pages only. */
    courtesyTranslation: string;
  };
  notFound: {
    h1: string;
    body: string;
    backHome: string;
  };
  faq: {
    heading: string;
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
    consent: string;
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
    theSite: 'Le site',
    contact: 'Contact',
  },
  footer: {
    leadA: 'Parlons de vos',
    leadB: 'surfaces à nettoyer.',
    responseTime: 'Réponse sous 24 h. Devis gratuit et sans engagement.',
    about:
      "Nettoyage de vitres, terrasses, volets, façades et ménage à domicile dans le sud de l'Essonne, chez les particuliers comme chez les professionnels.",
    rights: 'Tous droits réservés.',
    legalNotice: 'Mentions légales',
    privacy: 'Confidentialité',
  },
  home: {
    heroFlagline: 'Devis gratuit et sans engagement',
    h1a: 'Nettoyage de vitres, terrasses et ménage',
    h1b: "dans le sud de l'Essonne.",
    lead: "Vitres, terrasses, volets, façades et ménage à domicile. Un seul interlocuteur, des produits respectueux de l'environnement, et un devis gratuit avant toute intervention.",
    statQuote: 'devis gratuit et sans engagement',
    statServices: "prestations, à l'intérieur comme à l'extérieur",
    statCommunes: "communes desservies dans le sud de l'Essonne",
    aboutEyebrow: '◆ Qui sommes-nous',
    aboutH2a: 'Un travail minutieux,',
    aboutH2b: 'des résultats impeccables',
    aboutLead:
      "Derrière GLVITR'CLEAN il y a Thibaut, qui se déplace lui-même sur chaque chantier. Vous parlez à la personne qui fait le travail, du devis jusqu'à la vérification finale.",
    aboutChecklist: [
      'Un seul interlocuteur, du devis à la fin du chantier',
      "Produits respectueux de l'environnement",
      'Devis gratuit et sans engagement',
      'Particuliers et professionnels',
    ],
    aboutB2bLink: 'Vous êtes une entreprise ? ›',
    servicesEyebrow: '◆ Nos services',
    servicesH2a: 'Nos services',
    servicesH2b: 'sur mesure',
    servicesIntro:
      "Vitres, terrasses, volets, façades, poubelles ou ménage complet : chaque intervention est adaptée au lieu et à sa fréquence d'usage.",
    stepsEyebrow: '◆ Comment ça se passe',
    stepsH2a: 'Un devis, une date,',
    stepsH2b: 'des vitres nettes',
    steps: [
      {
        title: 'Vous demandez un devis',
        body: 'Par téléphone, par WhatsApp ou via le formulaire. Gratuit et sans engagement.',
      },
      {
        title: 'Nous évaluons vos besoins',
        body: "Surfaces, accès, fréquence : l'intervention et son coût sont définis en transparence avant de commencer.",
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
        title: 'Un seul interlocuteur',
        body: "Thibaut réalise lui-même chaque intervention. Pas de sous-traitance, pas d'intermédiaire.",
      },
      {
        title: 'Produits écologiques',
        body: "Des produits respectueux de l'environnement, sûrs pour les enfants et les animaux du foyer.",
      },
      {
        title: 'Services à la Personne',
        body: 'Une partie des prestations à domicile relève de ce dispositif. Les conditions sont détaillées sur la page dédiée.',
      },
    ],
    referralTitle: 'Parrainage',
    referralBody: 'pour chaque nouveau client que vous nous recommandez.',
    zonesEyebrow: "◆ Zones d'intervention",
    zonesH2a: 'Nous intervenons',
    zonesH2b: 'dans votre commune',
    zonesIntro:
      "Le sud de l'Essonne, sur le corridor N20 et RER C. Votre commune n'est pas dans la liste ? Appelez, elle est peut-être sur la route.",
    contactEyebrow: '◆ Contact',
    contactH2a: 'Prêt à voir',
    contactH2b: 'la différence ?',
    contactLead:
      "Appelez pour un devis gratuit, ou envoyez une photo de ce qu'il y a à nettoyer. C'est souvent plus rapide qu'un formulaire.",
    phoneLabel: 'Téléphone',
    emailLabel: 'Courriel',
  },
  service: {
    h1Suffix: 'en Essonne (91)',
    inYourCommune: (service) => `${service} dans votre commune`,
    linkInCommune: (service, commune) => `${service} à ${commune}`,
  },
  commune: {
    h1: (commune, postalCode) => `Nettoyage à ${commune} (${postalCode})`,
    ourServicesIn: (commune) => `Nos prestations à ${commune}`,
    neighbouring: 'Communes voisines',
    linkServiceIn: (service, commune) => `${service} à ${commune}`,
  },
  communeService: {
    h1: (service, commune, postalCode) => `${service} à ${commune} (${postalCode})`,
    relatedLabel: 'Liens connexes',
    serviceInRegion: (service) => `${service} en Essonne`,
    allServicesIn: (commune) => `Toutes nos prestations à ${commune}`,
  },
  taxCreditPage: {
    h1: "Le crédit d'impôt de 50 % sur le nettoyage à domicile",
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
    h1: 'Nettoyage pour professionnels en Essonne',
    interventions: 'Nos interventions',
  },
  quote: {
    h1: 'Demander un devis gratuit',
  },
  work: {
    h1: 'Nos réalisations',
  },
  legal: {
    noticeH1: 'Mentions légales',
    publisher: 'Éditeur',
    host: 'Hébergeur',
    insurance: 'Assurance responsabilité civile professionnelle',
    toComplete: 'À compléter.',
    siret: 'SIRET',
    phone: 'Téléphone',
    email: 'E-mail',
    privacyH1: 'Politique de confidentialité',
    courtesyTranslation: '',
  },
  notFound: {
    h1: 'Page introuvable',
    body: "Cette page n'existe pas.",
    backHome: "Retour à l'accueil",
  },
  faq: {
    heading: 'Questions fréquentes',
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
    consent:
      "J'accepte que mes informations soient utilisées pour me recontacter au sujet de ma demande.",
    submit: 'Demander un devis gratuit',
    sending: 'Envoi…',
    success: 'Merci. Nous vous rappelons rapidement.',
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
    theSite: 'This site',
    contact: 'Contact',
  },
  footer: {
    leadA: "Let's talk about the",
    leadB: 'surfaces you need cleaned.',
    responseTime: 'Reply within 24 hours. Free quote, no obligation.',
    about:
      'Window, terrace, shutter and facade cleaning plus domestic housekeeping across the south of the Essonne, for private homes and businesses alike.',
    rights: 'All rights reserved.',
    legalNotice: 'Legal notice',
    privacy: 'Privacy',
  },
  home: {
    heroFlagline: 'Free quote, no obligation',
    h1a: 'Window, terrace and housekeeping cleaning',
    h1b: 'in the south of the Essonne.',
    lead: 'Windows, terraces, shutters, facades and housekeeping at home. One person from start to finish, environmentally responsible products, and a free quote before any work begins.',
    statQuote: 'free quote, no obligation',
    statServices: 'services, indoors and out',
    statCommunes: 'towns covered in the south of the Essonne',
    aboutEyebrow: '◆ Who we are',
    aboutH2a: 'Careful work,',
    aboutH2b: 'spotless results',
    aboutLead:
      "Behind GLVITR'CLEAN is Thibaut, who turns up to every job himself. You talk to the person doing the work, from the quote through to the final check.",
    aboutChecklist: [
      'One point of contact, from quote to finished job',
      'Environmentally responsible products',
      'Free quote, no obligation',
      'Private homes and businesses',
    ],
    aboutB2bLink: 'Are you a business? ›',
    servicesEyebrow: '◆ Our services',
    servicesH2a: 'Services built',
    servicesH2b: 'around your place',
    servicesIntro:
      'Windows, terraces, shutters, facades, bins or a full clean: every job is matched to the place and how often it is used.',
    stepsEyebrow: '◆ How it works',
    stepsH2a: 'A quote, a date,',
    stepsH2b: 'clean windows',
    steps: [
      {
        title: 'You ask for a quote',
        body: 'By phone, on WhatsApp or through the form. Free and with no obligation.',
      },
      {
        title: 'We assess what you need',
        body: 'Surfaces, access, frequency: the work and its cost are agreed openly before anything starts.',
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
        title: 'One point of contact',
        body: 'Thibaut carries out every job himself. No subcontracting, no middleman.',
      },
      {
        title: 'Eco-friendly products',
        body: 'Environmentally responsible products, safe for the children and pets in the house.',
      },
      {
        title: 'Services à la Personne',
        body: 'Some home services fall under this French scheme. The conditions are set out on the dedicated page.',
      },
    ],
    referralTitle: 'Referrals',
    referralBody: 'for every new customer you send our way.',
    zonesEyebrow: '◆ Areas we cover',
    zonesH2a: 'We work',
    zonesH2b: 'in your town',
    zonesIntro:
      'The south of the Essonne, along the N20 and RER C corridor. Your town not on the list? Call anyway — it may well be on the route.',
    contactEyebrow: '◆ Contact',
    contactH2a: 'Ready to see',
    contactH2b: 'the difference?',
    contactLead:
      'Call for a free quote, or just send a photo of what needs cleaning. It is usually quicker than a form.',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
  },
  service: {
    h1Suffix: 'in the Essonne (91)',
    inYourCommune: (service) => `${service} in your town`,
    linkInCommune: (service, commune) => `${service} in ${commune}`,
  },
  commune: {
    h1: (commune, postalCode) => `Cleaning services in ${commune} (${postalCode})`,
    ourServicesIn: (commune) => `What we do in ${commune}`,
    neighbouring: 'Neighbouring towns',
    linkServiceIn: (service, commune) => `${service} in ${commune}`,
  },
  communeService: {
    h1: (service, commune, postalCode) => `${service} in ${commune} (${postalCode})`,
    relatedLabel: 'Related links',
    serviceInRegion: (service) => `${service} across the Essonne`,
    allServicesIn: (commune) => `Everything we do in ${commune}`,
  },
  taxCreditPage: {
    h1: 'The 50% tax credit on domestic cleaning',
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
    h1: 'Commercial cleaning across the Essonne',
    interventions: 'What we handle',
  },
  quote: {
    h1: 'Request a free quote',
  },
  work: {
    h1: 'Our work',
  },
  legal: {
    noticeH1: 'Legal notice',
    publisher: 'Publisher',
    host: 'Hosting provider',
    insurance: 'Professional liability insurance',
    toComplete: 'To be completed.',
    siret: 'SIRET',
    phone: 'Phone',
    email: 'Email',
    privacyH1: 'Privacy policy',
    courtesyTranslation:
      'This English version is provided for convenience. The French version is the legally binding one.',
  },
  notFound: {
    h1: 'Page not found',
    body: 'This page does not exist.',
    backHome: 'Back to the home page',
  },
  faq: {
    heading: 'Frequently asked questions',
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
    consent: 'I agree that my details may be used to get back to me about this enquiry.',
    submit: 'Request a free quote',
    sending: 'Sending…',
    success: 'Thank you. We will call you back shortly.',
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
