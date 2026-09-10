import { strings } from '@/i18n/dictionary';
import type { Lang } from '@/i18n/config';

/**
 * The numbered "how it works" cards, from `home.steps`.
 *
 * Extracted from `HomeView` in ROADMAP phase 8e. The steps were written once
 * and rendered once, on the home page — but the pages that actually receive
 * local search traffic are the seven service pages and the twelve commune
 * hubs, and a visitor who lands on one of those from Google has never seen the
 * home page and has no idea what happens after they call.
 *
 * Mr Sparkle repeats its process block on every service and suburb page for
 * exactly this reason. See TODO.md, teardown 1, item A5.
 *
 * Heading level is fixed at h3 because every caller puts this under an h2.
 *
 * Server component. Do not add 'use client' — CLAUDE.md rule 2 lists the four
 * components allowed to have it and this is not one of them.
 */
export function ProcessSteps({ lang }: { lang: Lang }) {
  const t = strings(lang);

  return (
    <ol className="card-grid">
      {t.home.steps.map((step, i) => (
        <li className="card" key={step.title}>
          <div className="card__top">
            <span className="card__glyph" aria-hidden="true">
              ◆
            </span>
            <span className="card__number" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
