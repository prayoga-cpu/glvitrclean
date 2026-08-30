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

/** Annual household cap on SAP spending eligible for the credit, in EUR. */
export const TAX_CREDIT_ANNUAL_CAP = 6000;

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
  tagline: 'Une entreprise à votre écoute, votre satisfaction notre priorité',

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
   * Phase 0 discovery. `confirmed` stays false until the client states the
   * final radius. Until then `communes.ts` provisionally covers Essonne only,
   * and no route may be generated for a commune outside `departments`.
   * TODO(human): confirm 91 only, or 91 + 77 + 94.
   */
  serviceArea: {
    departments: ['91'],
    confirmed: false,
  },

  /**
   * TODO(human): Google Business Profile URL once the profile exists and is
   * postal-verified. Feeds `sameAs` in LocalBusiness JSON-LD. See Phase 7.
   */
  googleBusinessProfile: null as string | null,

  /** TODO(human): real URLs from the client. Empty array until then. */
  social: [] as string[],

  /** €40 per referred customer. Already on the client's flyer. */
  referralBonus: 40,

  ecoProducts: true,
} as const;

/** True once the site may legally state the 50% claim as fact. */
export const sapVerified = company.sapDeclaration.number !== null;
