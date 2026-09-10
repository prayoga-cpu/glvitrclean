/**
 * Single source of truth for company identity.
 * Anything shown in the footer, mentions légales, or JSON-LD comes from here.
 */

const DEFAULT_SITE_URL = 'https://www.glvitrclean.com';

/**
 * `??` only falls through on null/undefined, so a host that defines
 * NEXT_PUBLIC_SITE_URL but leaves it blank used to yield '' — which reached
 * `new URL('')` in layout.tsx and failed the production build with
 * ERR_INVALID_URL. Blank or unparseable is treated as absent.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (!raw) return DEFAULT_SITE_URL;
  try {
    return new URL(raw).toString().replace(/\/$/, '');
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl();

/** Tax credit rate as a fraction. Change here, changes everywhere. */
export const TAX_CREDIT_RATE = 0.5;

/**
 * The rate as a whole-number percentage, for copy.
 *
 * CLAUDE.md rule 1: the figure must never be typed as static text anywhere.
 * Titles, H1s and badge copy all read it from here, so changing
 * TAX_CREDIT_RATE above changes every one of them in a single edit.
 */
export const TAX_CREDIT_PCT = Math.round(TAX_CREDIT_RATE * 100);

/** Annual household cap on SAP spending eligible for the credit, in EUR. */
export const TAX_CREDIT_ANNUAL_CAP = 6000;

/**
 * schema.org `DayOfWeek` values, in week order. Stored in English because that
 * is what `openingHoursSpecification` requires on the wire; both editions look
 * the display name up in the dictionary. See `src/lib/hours.ts`.
 */
export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export interface OpeningHoursBlock {
  /**
   * Contiguous run of days sharing the same hours, in week order. Typed as a
   * non-empty tuple: a block with no days would render an empty range and
   * would emit a dayless `openingHoursSpecification`.
   */
  days: readonly [Weekday, ...Weekday[]];
  /** 24-hour `HH:MM`. Language-invariant: each edition formats its own way. */
  opens: string;
  closes: string;
}

/**
 * Client-supplied, 2026-09-09. These are the hours he answers the phone, not
 * shop hours — this is a service-area business with no premises to open.
 *
 * Declared once here and read by three places: the footer contact column, the
 * /devis page, and `openingHoursSpecification` in the LocalBusiness JSON-LD.
 * The rendered text and the structured data are generated from this same
 * array, so a local result can never advertise hours the page contradicts.
 */
const openingHours: readonly OpeningHoursBlock[] = [
  {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:30',
  },
  {
    days: ['Saturday', 'Sunday'],
    opens: '10:00',
    closes: '18:00',
  },
];

export interface SapDeclaration {
  /** Legal name of the cooperative that issues the invoices. */
  holder: string | null;
  /** SAP declaration number, format SAP######## */
  number: string | null;
  /** 'prestataire' or 'mandataire'. Changes who the customer contracts with. */
  mode: 'prestataire' | 'mandataire' | null;
  /** Whether URSSAF avance immédiate is available through the holder. */
  avanceImmediate: boolean | null;
  /**
   * Who issues the annual attestation fiscale the customer files with their
   * tax return. Not always the same entity as `holder`.
   */
  attestationIssuer: string | null;
}

export const company = {
  legalName: "GLVITR'CLEAN",
  displayName: "GLVITR'CLEAN",
  /**
   * The brand as the client asked for it to read in the tab and in a search
   * result, on 2026-09-10: the name, then what the business actually is.
   *
   * It is a TITLE FORMAT, not a second legal name. `legalName` stays
   * "GLVITR'CLEAN" and that is what the LocalBusiness node is called, what the
   * mentions légales print and what an invoice would say; this string is the
   * `alternateName`, the og:site_name, and the suffix on the 28 titles per
   * language that carry a brand at all. It costs 31 characters with its
   * separator, which is why the 84 commune x service titles do not carry it.
   */
  brandLine: "GLVITR'CLEAN | MULTI SERVICE",
  /**
   * Company positioning, in the client's own words (2026-09-09 feedback, item
   * 7): a team, not a named individual, and satisfaction as the stated
   * priority.
   *
   * The second half of that instruction — no subcontracting, no intermediary —
   * has no field here on purpose. It is a sentence, not an identity fact, and
   * it is written where it is read: the home checklist and first why-card, the
   * B2B expectations list and the footer, in src/i18n/dictionary.ts.
   */
  tagline: 'Une équipe à votre disposition, votre satisfaction notre priorité',

  siret: '988 737 268 00017',

  phone: '+33627709970',
  phoneDisplay: '06 27 70 99 70',
  whatsapp: '33627709970',
  email: 'contact@glvitrclean.com',

  /** Service-area business. No public storefront. */
  address: {
    locality: 'Linas',
    postalCode: '91310',
    region: 'Essonne',
    country: 'FR',
  },

  /** Approximate centroid of the service area, for LocalBusiness geo. */
  geo: { lat: 48.6244, lng: 2.2536 },

  /** When the phone is answered. See the note on the array above. */
  openingHours,

  /**
   * TODO(human): fill from the cooperative before launch.
   * While `number` is null the tax credit badge stays in pending mode.
   * See docs/04-compliance-sap.md.
   */
  sapDeclaration: {
    holder: null,
    number: null,
    mode: null,
    avanceImmediate: null,
    attestationIssuer: null,
  } satisfies SapDeclaration,

  /**
   * The declared intervention area, answered by the client on 2026-09-09
   * (feedback item 6): Essonne (91) AND Seine-et-Marne (77). 94 is not in it.
   *
   * `departments` is the machine-readable half — it feeds `areaServed` in
   * src/lib/schema.ts, so a department added here appears in the LocalBusiness
   * and Service JSON-LD without touching a component. The prose half lives in
   * src/i18n/dictionary.ts, because French prepositions do not template.
   *
   * `communeCoverage` is deliberately narrower than `departments` and is the
   * one thing still open. The twelve commune pages, and the 84 commune x
   * service crossings under them, are all Essonne: the client has named the
   * department but not the Seine-et-Marne towns he actually drives to. Rule 4
   * forbids inventing a `localAngle`, and rule 3 forbids a page without a
   * target query, so no 77 commune page is generated until that list exists.
   * The site states the department-level coverage and stops there, which is
   * true. STATUS.md item 3.
   */
  serviceArea: {
    departments: [
      { code: '91', name: 'Essonne' },
      { code: '77', name: 'Seine-et-Marne' },
    ],
    /** The radius itself is confirmed. The 77 commune list is not. */
    confirmed: true,
    /** Departments that have commune-level pages. See above. */
    communeCoverage: ['91'],
  },

  /**
   * TODO(human): Google Business Profile URL once the profile exists and is
   * postal-verified. Feeds `sameAs` in LocalBusiness JSON-LD. See Phase 7.
   */
  googleBusinessProfile: null as string | null,

  /** TODO(human): real URLs from the client. Empty array until then. */
  social: [] as string[],

  /**
   * Professional liability insurance (RC Pro).
   *
   * `/mentions-legales` already has the heading and prints "to be completed"
   * under it; filling these in replaces that with the real thing and nothing
   * else has to change.
   *
   * Both teardowns lean on this hard — Mr Sparkle repeats "$20 million public
   * liability" three times on its home page, because for a stranger letting
   * someone onto a roof it is the single most reassuring number there is. Ours
   * is buried in a legal page, and it cannot be promoted to a trust card until
   * it is a real figure from a real policy. STATUS.md item 11,
   * TODO.md teardown 1 item B1.
   *
   * TODO(human): insurer name and cover. Do NOT fill these in from memory or
   * from what is typical — an overstated cover is a false claim about a
   * contract, which is worse than no figure at all.
   */
  insurance: {
    insurer: null as string | null,
    /** Cover in euros, as a number so it can be formatted per edition. */
    coverEur: null as number | null,
    /** Policy number, if the client is willing to publish it. */
    policyNumber: null as string | null,
  },

  /** €40 per referred customer. Already on the client's flyer. */
  referralBonus: 40,

  ecoProducts: true,
} as const;

/** True once the site may legally state the 50% claim as fact. */
export const sapVerified = company.sapDeclaration.number !== null;
