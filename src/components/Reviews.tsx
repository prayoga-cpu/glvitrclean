import { reviews, ratingSummary, reviewsForCommune, BEST_RATING } from '@/data/reviews';
import type { Review } from '@/data/reviews';
import { strings } from '@/i18n/dictionary';
import type { Lang } from '@/i18n/config';

/**
 * Customer reviews, or nothing at all.
 *
 * Renders `null` while `src/data/reviews.ts` is empty, which it is and will be
 * until ROADMAP phase 7 produces a verified Google Business Profile. That is the
 * same shape as `<TaxCreditBadge />`, which renders `null` on a non-eligible
 * service: the component decides nothing, the data does.
 *
 * So this adds no markup to any page today. What it adds is that the day the
 * reviews arrive, showing them is a paste into one file rather than a new
 * component written under time pressure against rule 4.
 *
 * Two things it does that the teardowns' own pages do not.
 *
 * It renders server-side, as plain HTML. Both competitors embed a third-party
 * review widget, which is invisible to a crawler before hydration, sets storage
 * that would force a consent banner, and is forbidden outright by CLAUDE.md
 * rule 2. The markup here is in the export.
 *
 * And every review links out to where it was left, when there is a URL. That is
 * the one thing worth copying from the SPIC AND SPAN page: a testimonial a
 * reader can click through to Google is evidence, and one they cannot is
 * decoration. A paper review carries `sourceUrl: null` and simply prints
 * unlinked — see the header of the data file for why that is allowed but not
 * comfortable.
 *
 * Server component. Do not add 'use client' — rule 2 names the only four.
 */
export function Reviews({
  lang,
  /** Show only the reviews left about this commune. Omit for all of them. */
  communeSlug,
}: {
  lang: Lang;
  communeSlug?: string;
}) {
  const t = strings(lang);
  const shown = communeSlug ? reviewsForCommune(communeSlug) : reviews;
  if (shown.length === 0) return null;

  // The summary shows ONLY on the unfiltered view, and the reason is honesty
  // rather than layout. The figure is the whole-business average — recomputing
  // it per commune would print a 5.0 off the single review left in Égly, which
  // is a different and less defensible number than the site's actual rating.
  // But printing "4.5 from 2 reviews" above one review reads as though one has
  // gone missing. So the rating claim lives where all the reviews it is computed
  // from are listed, and a commune page shows its own review without a headline.
  const summary = communeSlug ? null : ratingSummary();

  return (
    <section className="reviews">
      <h2>{t.reviews.h2}</h2>

      {summary && (
        <p className="reviews__summary">
          {t.reviews.summary(summary.value, BEST_RATING, summary.count)}
        </p>
      )}

      <ul className="reviews__list">
        {shown.map((r) => (
          <li key={`${r.author}-${r.datePublished}`} className="review">
            <p className="review__rating">
              {/* The stars are decoration; the accessible name carries the
                  number, so a screen reader is not read a row of glyphs. */}
              <span aria-hidden="true">{'★'.repeat(r.rating)}</span>
              <span className="u-visually-hidden">
                {t.reviews.stars(r.rating, BEST_RATING)}
              </span>
            </p>
            <blockquote className="review__body">
              <p>{r.body}</p>
            </blockquote>
            <p className="review__meta">
              <span className="review__author">{r.author}</span>
              <ReviewSourceLink review={r} lang={lang} />
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The "on Google" / "on Facebook" provenance line, linked when there is a URL. */
function ReviewSourceLink({ review, lang }: { review: Review; lang: Lang }) {
  const t = strings(lang);
  const label = t.reviews.source[review.source];

  if (!review.sourceUrl) return <span className="review__source">{label}</span>;

  return (
    <a
      className="review__source"
      href={review.sourceUrl}
      // A link to someone else's site that we do not control and do not
      // endorse beyond the quote itself.
      rel="nofollow noopener"
      target="_blank"
    >
      {t.reviews.checkOn(label)}
    </a>
  );
}
