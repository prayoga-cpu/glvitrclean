/**
 * Turns `company.openingHours` into the lines a page prints.
 *
 * The hours themselves are language-invariant and declared once in
 * `src/data/company.ts`. Only their wording differs between editions: French
 * says `Lundi – Vendredi : 9h00 – 18h30`, English says
 * `Monday – Friday: 9:00 AM – 6:30 PM`. Both come out of the same array, so the
 * two editions and the `openingHoursSpecification` in the LocalBusiness
 * JSON-LD (see `src/lib/schema.ts`) cannot state different hours.
 */

import { company, type OpeningHoursBlock } from '@/data/company';
import { strings } from '@/i18n/dictionary';
import type { Lang } from '@/i18n/config';

/** En dash, spaced. A range reads the same way in both languages. */
const RANGE = ' – ';

export interface HoursLine {
  /** `Lundi – Vendredi` */
  days: string;
  /** `9h00 – 18h30` */
  time: string;
  /** The two joined with that language's punctuation. What pages render. */
  text: string;
}

/** `'09:00'` -> `[9, 0]`. The data is validated by shape, not by parsing. */
function clockParts(hhmm: string): [number, number] {
  const [hour, minute] = hhmm.split(':');
  return [Number(hour), Number(minute)];
}

function lineFor(block: OpeningHoursBlock, lang: Lang): HoursLine {
  const t = strings(lang);
  const first = block.days[0];
  const last = block.days[block.days.length - 1] ?? first;

  // A one-day block prints one name rather than a range of one.
  const days =
    first === last ? t.hours.day[first] : `${t.hours.day[first]}${RANGE}${t.hours.day[last]}`;

  const time = `${t.hours.clock(...clockParts(block.opens))}${RANGE}${t.hours.clock(
    ...clockParts(block.closes),
  )}`;

  return { days, time, text: t.hours.line(days, time) };
}

export function hoursLines(lang: Lang): HoursLine[] {
  return company.openingHours.map((block) => lineFor(block, lang));
}
