/**
 * Dial codes offered on the quote form's phone field. France first and
 * default — this is a two-département local business (Essonne, Seine-et-Marne),
 * so the list stays short by design rather than attempting global coverage:
 * Belgium, Switzerland and Luxembourg are France's French-speaking neighbours
 * (plausible for a second-home owner or a B2B contact in this exact region),
 * and the UK is the one non-francophone entry because the site itself ships a
 * maintained English edition. Anyone else picks "Autre pays" / "Other country"
 * in QuoteForm.tsx and types their own international number.
 *
 * Real ISO 3166-1 alpha-2 codes and real ITU-T dial codes only — this is
 * reference data, not a claim about the business, so CLAUDE.md rule 4 does not
 * apply to it the way it does to copy.
 */

export interface PhoneCountry {
  iso: string;
  dial: string;
  nameFr: string;
  nameEn: string;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso: 'FR', dial: '+33', nameFr: 'France', nameEn: 'France' },
  { iso: 'BE', dial: '+32', nameFr: 'Belgique', nameEn: 'Belgium' },
  { iso: 'CH', dial: '+41', nameFr: 'Suisse', nameEn: 'Switzerland' },
  { iso: 'LU', dial: '+352', nameFr: 'Luxembourg', nameEn: 'Luxembourg' },
  { iso: 'GB', dial: '+44', nameFr: 'Royaume-Uni', nameEn: 'United Kingdom' },
];
