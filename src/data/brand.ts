/**
 * Single source of truth for brand artwork and the handful of brand colours
 * that have to exist outside CSS.
 *
 * Everything the browser is *told about* — favicons, the web app manifest, the
 * theme colour, the social cards, the JSON-LD logo — is declared here and
 * consumed by `baseMetadata()`, `src/app/manifest.ts` and `src/lib/schema.ts`.
 * No component writes one of these paths inline, so moving a file is one edit.
 *
 * CLAUDE.md rule 6 forbids hard-coded colour in a `.tsx`. `THEME_COLOR` and
 * `BACKGROUND_COLOR` below are not styling: they are metadata values that ship
 * inside `<meta name="theme-color">` and the manifest JSON, where a CSS custom
 * property cannot reach. They MIRROR `--color-brand` and `--color-bg` in
 * `globals.css` and must be changed together with them.
 */

/** Mirrors `--color-brand` in globals.css. Android chrome, iOS status bar. */
export const THEME_COLOR = '#1b3a9c';

/** Mirrors `--color-bg`. The splash ground while an installed app boots. */
export const BACKGROUND_COLOR = '#f5f3ee';

/**
 * The brand assets, by role.
 *
 * `lockup` is the only one that renders inside a page. It is the client's
 * horizontal lockup on its own deep-blue plate, cropped to balanced padding —
 * see docs/09-design-system.md, "Logo", for why it is a raster and not the
 * supplied vector.
 */
export const brand = {
  /** Header and footer lockup. 527x160 on a #12276B ground. */
  lockup: {
    src: '/assets/brand/lockup.webp',
    width: 527,
    height: 160,
  },

  /** Circle mark alone, transparent. Not used on-page; kept for handover. */
  mark: '/assets/brand/mark-512.png',

  /**
   * Square 1200x1200 brand card. Feeds `logo` and `image` on the
   * LocalBusiness node — Google wants a square, on-white-or-solid logo it can
   * crop for a knowledge panel, not a wide social banner.
   */
  square: '/assets/brand/thumbnail-1200.png',
} as const;

/**
 * Favicons and app icons.
 *
 * `/favicon.ico` and `/apple-touch-icon.png` sit at the web root on purpose:
 * both are probed by path, without a `<link>`, by Google's favicon fetcher and
 * by iOS respectively. Everything else is discovered through the tags
 * `baseMetadata()` emits, so it is free to live under `/assets/icons/`.
 */
export const icons = {
  ico: '/favicon.ico',
  appleTouch: '/apple-touch-icon.png',
  png16: '/assets/icons/favicon-16.png',
  png32: '/assets/icons/favicon-32.png',
  png48: '/assets/icons/favicon-48.png',
  android192: '/assets/icons/android-chrome-192.png',
  android512: '/assets/icons/android-chrome-512.png',
  maskable512: '/assets/icons/maskable-512.png',
} as const;

/**
 * Social cards. 1200x630, the size every scraper expects.
 *
 * One per edition rather than one per route: 194 generated cards would add
 * ~13 MB to the repository to say almost the same thing on every page.
 * `og-brand` is the language-neutral fallback — it carries the lockup and the
 * service list, no headline — and is what the root layout advertises for any
 * route that does not set its own.
 */
export const socialCards = {
  fr: '/assets/og/og-fr.png',
  en: '/assets/og/og-en.png',
  brand: '/assets/og/og-brand.png',
  width: 1200,
  height: 630,
} as const;
