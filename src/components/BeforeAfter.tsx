import Image from 'next/image';
import {
  realisations,
  realisationsForService,
  realisationsForCommune,
} from '@/data/realisations';
import { strings } from '@/i18n/dictionary';
import type { Lang } from '@/i18n/config';

/**
 * Before/after pairs, or nothing at all.
 *
 * Renders `null` while `src/data/realisations.ts` is empty, which it is until the
 * client's photo archive lands (ROADMAP phase 5, STATUS.md item 6). Same shape as
 * `<Reviews />` and `<TaxCreditBadge />`: the data decides, not the component.
 *
 * Each pair is a `<figure>` holding two images and one caption. The caption is
 * the single `alt` text describing the job, not a label per image — "avant" and
 * "après" are on the images themselves, and repeating the description twice
 * would have a screen reader read the same sentence for both halves.
 *
 * `alt` on the two `<img>` elements is deliberately empty, with the description
 * carried once by the `<figcaption>`. That is the correct pattern for an image
 * whose adjacent caption already describes it; duplicating it is the most common
 * accessibility mistake in a gallery.
 *
 * Server component. No 'use client' — CLAUDE.md rule 2 names the only four, and
 * a before/after slider would need one. Two images side by side needs no script,
 * works with JS off, and is in the export for a crawler to see.
 */
export function BeforeAfter({
  lang,
  serviceSlug,
  communeSlug,
}: {
  lang: Lang;
  /** Show only the pairs for this service. */
  serviceSlug?: string;
  /** Show only the pairs for this commune. */
  communeSlug?: string;
}) {
  const t = strings(lang);

  const shown = serviceSlug
    ? realisationsForService(serviceSlug)
    : communeSlug
      ? realisationsForCommune(communeSlug)
      : realisations;

  if (shown.length === 0) return null;

  return (
    <section className="before-after">
      <h2>{t.work.galleryH2}</h2>
      <ul className="before-after__list">
        {shown.map((r) => (
          <li key={`${r.serviceSlug}-${r.before.src}`}>
            <figure className="pair">
              <div className="pair__frames">
                <div className="pair__frame">
                  <Image
                    src={r.before.src}
                    alt=""
                    width={r.before.width}
                    height={r.before.height}
                  />
                  <span className="pair__label">{t.work.before}</span>
                </div>
                <div className="pair__frame">
                  <Image src={r.after.src} alt="" width={r.after.width} height={r.after.height} />
                  <span className="pair__label">{t.work.after}</span>
                </div>
              </div>
              <figcaption>{r.alt[lang]}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
