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
    /** Heading for the links back up to the service hubs. */
    allServiceHubs: string;
  };
  communeService: {
    h1: (service: string, commune: string, postalCode: string) => string;
    relatedLabel: string;
    serviceInRegion: (service: string) => string;
    allServicesIn: (commune: string) => string;
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
    servicesIntro: string;
    zonesH1: string;
    zonesIntro: string;
    zonesListH2: string;
  };
  work: {
    h1: string;
    intro: string;
    whatH2: string;
    photosPendingH2: string;
    photosPending: string;
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
    // No 24 h commitment: nothing in src/data/ or docs/ backs one, and a
    // solo operator on a roof cannot honour it. CLAUDE.md rule 4.
    responseTime: 'Devis gratuit et sans engagement.',
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
      "Derrière GLVITR'CLEAN, il y a une équipe compétente et expérimentée, qui se déplace sur chaque chantier. Vous parlez aux personnes qui font le travail, du devis jusqu'à la vérification finale.",
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
        body: "Notre équipe réalise elle-même chaque intervention. Pas de sous-traitance, pas d'intermédiaire.",
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
    allServiceHubs: 'Nos prestations en Essonne',
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
    h1: 'Nettoyage pour professionnels en Essonne',
    interventions: 'Nos interventions',
    intro:
      "Vitrines, bureaux, parties communes, façades et conteneurs, pour les commerces, les copropriétés et les entreprises du sud de l'Essonne. Intervention ponctuelle ou passage régulier, selon ce dont vous avez besoin.",
    whyH2: 'Ce que vous pouvez attendre',
    why: [
      'Un seul interlocuteur, du devis à la fin du chantier.',
      "Des horaires choisis avec vous : avant l'ouverture, après la fermeture, ou pendant les heures creuses.",
      'Des produits respectueux de l’environnement, y compris en intérieur occupé.',
      'Un devis écrit avant toute intervention, gratuit et sans engagement.',
    ],
    contactH2: 'Parler à quelqu’un',
    contactBody:
      'Vous parlez directement à l’équipe qui réalise les interventions. Décrivez la surface, la fréquence et les contraintes d’accès, et vous recevrez un devis écrit.',
  },
  quote: {
    h1: 'Demander un devis gratuit',
  },
  hubs: {
    servicesH1: 'Nos prestations de nettoyage',
    servicesIntro:
      "Six prestations, chez les particuliers comme chez les professionnels du sud de l'Essonne. Chaque page détaille ce qui est compris et comment le devis est établi.",
    zonesH1: "Nos zones d'intervention",
    zonesIntro:
      "Nous intervenons dans le sud de l'Essonne, sur le corridor N20 et RER C. Votre commune n'est pas dans la liste ? Appelez, elle est peut-être sur la route.",
    zonesListH2: 'Les communes desservies',
  },
  work: {
    h1: 'Nos réalisations',
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
    consentBefore:
      "J'accepte que mes informations soient utilisées pour me recontacter au sujet de ma demande, dans les conditions décrites dans la ",
    consentLinkLabel: 'politique de confidentialité',
    consentAfter: '.',
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
    responseTime: 'Free quote, no obligation.',
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
    lead: 'Windows, terraces, shutters, facades and housekeeping at home. One point of contact from start to finish, environmentally responsible products, and a free quote before any work begins.',
    statQuote: 'free quote, no obligation',
    statServices: 'services, indoors and out',
    statCommunes: 'towns covered in the south of the Essonne',
    aboutEyebrow: '◆ Who we are',
    aboutH2a: 'Careful work,',
    aboutH2b: 'spotless results',
    aboutLead:
      "Behind GLVITR'CLEAN is a competent and experienced team, on site for every job. You talk to the people doing the work, from the quote through to the final check.",
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
        body: 'Our team carries out every job. No subcontracting, no middleman.',
      },
      {
        title: 'Eco-friendly products',
        body: 'Environmentally responsible products, chosen to work indoors and out.',
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
    allServiceHubs: 'Our services across the Essonne',
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
    h1: 'Commercial cleaning across the Essonne',
    interventions: 'What we handle',
    intro:
      'Shopfronts, offices, communal areas, facades and bin stores, for shops, building managers and businesses in the south of the Essonne. One-off visits or a regular round, whichever suits you.',
    whyH2: 'What you can expect',
    why: [
      'One point of contact, from the quote to the end of the job.',
      'Hours agreed with you: before opening, after closing, or during quiet periods.',
      'Environmentally responsible products, including in occupied interiors.',
      'A written quote before any work starts, free and with no obligation.',
    ],
    contactH2: 'Talk to someone',
    contactBody:
      'You deal directly with the team that carries out the work. Tell us the surface, the frequency and any access constraints, and you will get a written quote.',
  },
  quote: {
    h1: 'Request a free quote',
  },
  hubs: {
    servicesH1: 'Our cleaning services',
    servicesIntro:
      'Six services, for private homes and businesses across the south of the Essonne. Each page sets out what is covered and how the quote is worked out.',
    zonesH1: 'Where we work',
    zonesIntro:
      'We cover the south of the Essonne, along the N20 and RER C corridor. Your town not on the list? Call — it may well be on the way.',
    zonesListH2: 'Towns we cover',
  },
  work: {
    h1: 'Our work',
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
    consentBefore:
      'I agree that my details may be used to get back to me about this enquiry, on the terms set out in the ',
    consentLinkLabel: 'privacy policy',
    consentAfter: '.',
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
