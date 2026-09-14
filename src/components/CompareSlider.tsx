'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

/**
 * The fifth allowed client component. Justified in STATUS.md, per CLAUDE.md
 * rule 2.
 *
 * A draggable before/after comparison. One native `<input type="range">` is
 * stretched over the whole frame and drives a CSS custom property (`--pos`);
 * CSS alone does the rest — clipping the "before" layer and positioning the
 * divider. The range gives dragging, touch and keyboard support for free, so
 * there is no pointer-event math to maintain here.
 *
 * Uncontrolled on purpose: the value is written straight to the DOM via the
 * ref on every `onChange` (React fires that on the native `input` event for
 * range controls, i.e. continuously while dragging), so dragging never
 * triggers a React re-render.
 *
 * With JS off, both stills and both labels are still in the HTML — nothing is
 * hidden behind hydration (CLAUDE.md rule 2). The range control itself is
 * native and stays draggable by mouse, touch and keyboard even then; only the
 * live visual sync (the CSS var this component writes) does not happen, so
 * the split simply stays at its starting position instead of tracking drags.
 *
 * Video is optional and additive, not a second mode: `before`/`after` are
 * always a real still (also the `<video>` poster), so a card never has
 * nothing to show. Clicking "play" swaps that still for the matching
 * `<video>` in place — same clip-path, same drag — which is also why the
 * button sits off-centre rather than over the handle: dragging must keep
 * working on the stills without it.
 */
export function CompareSlider({
  before,
  after,
  beforeVideo,
  afterVideo,
  beforeLabel,
  afterLabel,
  ariaLabel,
  playLabel,
  caption,
}: {
  before: string;
  after: string;
  /** Optional. When set alongside `afterVideo`, a "play" button reveals both. */
  beforeVideo?: string;
  afterVideo?: string;
  beforeLabel: string;
  afterLabel: string;
  ariaLabel: string;
  playLabel?: string;
  /** What the pair shows, in the caller's language. Not a keyword slot — see
   * `src/data/realisations.ts`'s header for why that discipline matters here
   * too, even though this component doesn't read that file. */
  caption: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(beforeVideo && afterVideo);

  return (
    <figure className="compare">
      <div className="compare__frame" ref={frameRef}>
        {playing && hasVideo ? (
          <video
            src={afterVideo}
            poster={after}
            className="compare__image compare__image--after"
            aria-hidden="true"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <Image
            src={after}
            alt=""
            fill
            sizes="(max-width: 40rem) 100vw, 480px"
            className="compare__image compare__image--after"
          />
        )}
        <div className="compare__before">
          {playing && hasVideo ? (
            <video
              src={beforeVideo}
              poster={before}
              className="compare__image compare__image--before"
              aria-hidden="true"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image
              src={before}
              alt=""
              fill
              sizes="(max-width: 40rem) 100vw, 480px"
              className="compare__image compare__image--before"
            />
          )}
        </div>

        <span className="compare__label compare__label--before" aria-hidden="true">
          {beforeLabel}
        </span>
        <span className="compare__label compare__label--after" aria-hidden="true">
          {afterLabel}
        </span>

        <div className="compare__divider" aria-hidden="true">
          <span className="compare__handle">
            <span className="compare__chevron compare__chevron--left" />
            <span className="compare__chevron compare__chevron--right" />
          </span>
        </div>

        {hasVideo && !playing && (
          <button type="button" className="compare__play" onClick={() => setPlaying(true)}>
            <span className="compare__play-icon" aria-hidden="true" />
            {playLabel}
          </button>
        )}

        <input
          type="range"
          min={0}
          max={100}
          defaultValue={50}
          className="compare__range"
          aria-label={ariaLabel}
          onChange={(e) => frameRef.current?.style.setProperty('--pos', `${e.target.value}%`)}
        />
      </div>
      <figcaption className="compare__caption">{caption}</figcaption>
    </figure>
  );
}
