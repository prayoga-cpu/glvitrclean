import type { Service } from '@/data/services';
import { strings } from '@/i18n/dictionary';
import type { Lang } from '@/i18n/config';

/**
 * How a service is priced — the basis, not a figure.
 *
 * ROADMAP phase 8d. Both teardowns put a pricing block high on the page: Mr
 * Sparkle states a minimum and a range, SPIC AND SPAN puts an hourly rate in
 * the meta description. Neither of those is available to us, because
 * `service.pricing.fromEur` is `null` on all seven services and confirming real
 * numbers is the client's call (CLAUDE.md rule 7, TODO.md `[client]`).
 *
 * What IS available is `pricing.basis`, filled on all seven, and it answers the
 * question a visitor actually has first: not "what is the number" but "what is
 * the number going to depend on". CLAUDE.md rule 4 permits a basis without a
 * figure; it forbids the opposite — a bare number with no unit.
 *
 * The `from` row lights up on its own the moment `fromEur` stops being null.
 * That is one edit per service in `src/data/services.ts`, with no page to touch.
 *
 * The last paragraph is a plain statement of practice that holds for all seven
 * services. It is not a guarantee: a satisfaction or money-back promise is a
 * commercial commitment the client has not made, and inventing one would be a
 * rule 4 violation. See TODO.md, teardown 1, item B2.
 */
export function PricingNote({ service, lang }: { service: Service; lang: Lang }) {
  const t = strings(lang);
  const from = service.pricing.fromEur;

  return (
    <section className="pricing-note">
      <h2>{t.service.pricingH2}</h2>

      <dl className="pricing-note__rows">
        <div className="pricing-note__row">
          <dt>{t.service.pricingBasisLabel}</dt>
          <dd>{service.pricing.basis[lang]}</dd>
        </div>

        {from !== null && (
          <div className="pricing-note__row">
            <dt>{t.service.pricingFromLabel}</dt>
            {/* French writes the symbol after the amount, English before it. */}
            <dd>{lang === 'fr' ? `${from} €` : `€${from}`}</dd>
          </div>
        )}

        {/* Null on all seven until the client supplies the times. See the
            `duration` comment in src/data/services.ts — it is a commitment, so
            it is his to make, not ours to estimate. */}
        {service.duration && (
          <div className="pricing-note__row">
            <dt>{t.service.pricingDurationLabel}</dt>
            <dd>{service.duration[lang]}</dd>
          </div>
        )}

        <div className="pricing-note__row">
          <dt>{t.service.pricingQuoteLabel}</dt>
          <dd>{t.service.pricingQuoteValue}</dd>
        </div>
      </dl>

      <p>{t.service.pricingFactors}</p>
    </section>
  );
}
