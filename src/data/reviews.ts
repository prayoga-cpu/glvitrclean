/**
 * Customer reviews. **Empty, and it must stay empty until real ones exist.**
 *
 * This file is the machinery, not the content. Both teardowns in `TODO.md` put
 * reviews at the centre of the page — Mr Sparkle shows a 4.9 from 399 and
 * repeats it on every service page; SPIC AND SPAN heads a section "Over 25 000
 * happy customers since 2016" — and on our side the blocker has never been the
 * code. It is that the client has no Google Business Profile yet (ROADMAP phase
 * 7) and therefore no reviews to show.
 *
 * It is built ahead of the content deliberately, and the repository already does
 * this twice: `company.sapDeclaration.number` is `null` and
 * `<TaxCreditBadge />` renders pending mode until it is not, and
 * `company.social` is `[]` with `sameAs` appearing in the LocalBusiness node the
 * moment it is filled. Same contract here. When the reviews land, someone pastes
 * them into the array below and three things happen with no other edit:
 *
 *   1. `aggregateRating` and `review` appear on the LocalBusiness JSON-LD, so a
 *      Google result becomes eligible for stars.
 *   2. `<Reviews />` stops rendering `null` and prints them.
 *   3. The count and the average are computed from the array, so neither figure
 *      can drift from the reviews actually shown.
 *
 * WHAT MAY NOT HAPPEN HERE, and this is the whole reason the array is typed the
 * way it is. CLAUDE.md rule 4: never invent a review or a customer name. Not a
 * plausible one, not a placeholder one, not a "lorem" one with a real-sounding
 * signature, not one copied from the client's Facebook page without checking it
 * is his. An invented review is also an `avis trompeur` under the Code de la
 * consommation and, since 2022, carries its own penalty regime — it is the same
 * class of exposure as the unbacked 50% claim that rule 1 exists to prevent.
 *
 * `sourceUrl` is required and nullable on purpose rather than optional: every
 * review should be checkable by the reader, which is the one thing worth copying
 * from the SPIC AND SPAN page (it links each testimonial out to Google, Facebook
 * or Yelp). `null` is allowed because a review handed over on paper has no URL —
 * but a `null` there is a note to go and find one, not a resting state.
 *
 * TODO(human): populate after the Google Business Profile is verified. See
 * `docs/08-non-code-checklist.md` and ROADMAP phase 7.
 */

import type { Lang } from '@/i18n/config';

/** Where the review was left. Shown to the reader, so it must be accurate. */
export type ReviewSource = 'google' | 'facebook' | 'paper';

export interface Review {
  /**
   * The reviewer's name exactly as they published it. Never expand an initial,
   * never tidy the capitalisation, never invent a surname.
   */
  author: string;
  /** Whole stars, 1 to 5. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** ISO `YYYY-MM-DD`, as published. */
  datePublished: string;
  /** The review text, verbatim. Do not translate it and do not tidy it. */
  body: string;
  /** The language it was actually written in — not the edition showing it. */
  lang: Lang;
  /** Public URL where a reader can check it. `null` only for a paper review. */
  sourceUrl: string | null;
  source: ReviewSource;
  /** The commune it was left about, if known. Lets a commune page show its own. */
  communeSlug?: string;
}

export const reviews: Review[] = [];

/** Highest star value the scale allows. Emitted as `bestRating`. */
export const BEST_RATING = 5;

export interface RatingSummary {
  /** Mean score, one decimal. */
  value: number;
  /** How many reviews it is computed from. */
  count: number;
}

/**
 * The average and the count, computed — never stored.
 *
 * Returns `null` on an empty array, which is what keeps `aggregateRating` off
 * the JSON-LD entirely rather than emitting a zero. A `ratingValue` of 0 from 0
 * reviews is a structured-data error in Search Console and, worse, a claim.
 */
export function ratingSummary(): RatingSummary | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return {
    value: Math.round((total / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

/** The reviews left about one commune, for that commune's page. */
export function reviewsForCommune(slug: string): Review[] {
  return reviews.filter((r) => r.communeSlug === slug);
}
