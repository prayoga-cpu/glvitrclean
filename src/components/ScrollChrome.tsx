'use client';

import { useEffect } from 'react';

/**
 * The fourth allowed client component. Justified in STATUS.md, per CLAUDE.md
 * rule 2.
 *
 * Renders nothing. It writes the scroll DIRECTION onto <html data-scroll>, and
 * globals.css does the hiding:
 *
 *   data-scroll="top"   at rest near the top — header shown, call bar hidden
 *   data-scroll="down"  reading further down — header hidden, call bar shown
 *   data-scroll="up"    heading back up      — header shown, call bar hidden
 *
 * Why a client component is unavoidable: scroll-driven CSS animations can react
 * to scroll POSITION but not to DIRECTION, and there is no CSS primitive for
 * "which way did they just move". Nothing here is content — with JS off the
 * attribute is simply absent and both bars stay permanently visible, which is
 * the pre-existing behaviour. Rule 2's "complete HTML before JavaScript runs"
 * still holds.
 */
export function ScrollChrome() {
  useEffect(() => {
    const root = document.documentElement;

    /* Ignore sub-pixel jitter and iOS rubber-banding, or the bars flicker. */
    const THRESHOLD = 8;
    /* Near the top the header is always shown: hiding it there reads as a bug. */
    const TOP_ZONE = 24;

    let last = window.scrollY;

    /*
      Deliberately NOT rAF-throttled. The obvious `if (ticking) return;
      ticking = true; requestAnimationFrame(...)` guard wedges permanently the
      moment a frame is never served — a background tab, a headless render,
      a throttled mobile browser — because `ticking` is only ever reset inside
      the callback that did not run. Caught exactly that while verifying: after
      the first scroll the bars froze and even synthetic scroll events did
      nothing.

      The handler is cheap enough to run raw: one scroll-position read, and a
      dataset write only when the value actually changes, so style invalidation
      happens on direction changes rather than on every scroll event.
    */
    const apply = () => {
      const y = window.scrollY;
      let next: 'top' | 'up' | 'down';

      if (y <= TOP_ZONE) {
        last = y;
        next = 'top';
      } else {
        const delta = y - last;
        if (Math.abs(delta) < THRESHOLD) return;
        last = y;
        next = delta > 0 ? 'down' : 'up';
      }

      if (root.dataset.scroll !== next) root.dataset.scroll = next;
    };

    apply();
    window.addEventListener('scroll', apply, { passive: true });

    return () => {
      window.removeEventListener('scroll', apply);
      delete root.dataset.scroll;
    };
  }, []);

  return null;
}
