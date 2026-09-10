/**
 * Before/after pairs from real jobs. **Empty until the client's archive lands.**
 *
 * Same contract as `src/data/reviews.ts`: the machinery ships, the content does
 * not, and nothing is emitted while the array is empty. ROADMAP phase 5,
 * STATUS.md item 6.
 *
 * Why this is worth having before the photos exist. Mr Sparkle puts three
 * before/after pairs on its home page and repeats them on every service page,
 * and for exterior cleaning it is the most persuasive element available —
 * nothing else shows the difference the work makes. Today `/realisations` is a
 * written page that says the photographs are coming, which is honest but is not
 * evidence. When the archive arrives, the gallery appears on `/realisations` and
 * on the relevant service pages from one file.
 *
 * RULE 4 APPLIES WITH NO EXCEPTIONS HERE, and more sharply than anywhere else
 * on the site:
 *
 *   - Every pair must be the client's own work. Not stock, not a supplier's
 *     marketing shot, not a "representative example". The seven images in
 *     `public/assets/placeholder/` are stock and are marked as such on screen;
 *     not one of them may be moved into this array.
 *   - `before` and `after` must be the SAME surface, same framing, same job.
 *     A flattering pair assembled from two different properties is a fabricated
 *     proof point.
 *   - `alt` describes what is in the photograph, in both editions. It is not a
 *     keyword slot.
 *   - `serviceSlug` must be the service actually performed. A terrace wash filed
 *     under `vitres` to pad a thin page is the same class of error as an
 *     invented review.
 *
 * TODO(human): populate once the photo archive exists and has been processed to
 * WebP at a known width and height. Dimensions are required, not optional —
 * `next/image` needs them at build time under `output: 'export'`, and a missing
 * pair is layout shift on the most image-heavy page of the site.
 */

import type { Localized } from '@/i18n/config';

export interface Photo {
  /** Path under `public/`, e.g. `/assets/realisations/vitres-01-avant.webp`. */
  src: string;
  width: number;
  height: number;
}

export interface Realisation {
  /** The service actually carried out. Must match a slug in `services.ts`. */
  serviceSlug: string;
  /** The commune, when known. Lets a commune page show work done in that town. */
  communeSlug?: string;
  before: Photo;
  after: Photo;
  /** What the photographs show, in both editions. Not a keyword slot. */
  alt: Localized;
}

export const realisations: Realisation[] = [];

/** The pairs for one service, for its page. */
export function realisationsForService(serviceSlug: string): Realisation[] {
  return realisations.filter((r) => r.serviceSlug === serviceSlug);
}

/** The pairs for one commune, for its page. */
export function realisationsForCommune(communeSlug: string): Realisation[] {
  return realisations.filter((r) => r.communeSlug === communeSlug);
}

/**
 * True while there is nothing to show.
 *
 * `/realisations` uses this to decide between the gallery and the "photographs
 * are coming" note, so the two can never both be absent and never both appear.
 */
export const realisationsPending = realisations.length === 0;
