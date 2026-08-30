/**
 * Locale configuration.
 *
 * French is the primary market and keeps the bare paths (`/services/vitres`).
 * English is served from a `/en` prefix off the same slugs, so a route has
 * exactly one locale-free identity (`basePath`) and two URLs.
 *
 * Slugs are NOT translated. `/en/services/vitres` rather than
 * `/en/services/window-cleaning`: the slug is an opaque key shared by both
 * trees, which keeps routes.ts, the sitemap, and the two guard scripts in
 * scripts/ able to reason about a page without a translation table.
 */

export const LANGS = ['fr', 'en'] as const;

export type Lang = (typeof LANGS)[number];

/** The locale that owns the bare paths. */
export const DEFAULT_LANG: Lang = 'fr';

/** A value that exists in both languages. */
export type Localized<T = string> = Record<Lang, T>;

/** `<html lang>` value. */
export const HTML_LANG: Localized<string> = { fr: 'fr', en: 'en' };

/** Open Graph locale. */
export const OG_LOCALE: Localized<string> = { fr: 'fr_FR', en: 'en_GB' };

/** Label shown on the language toggle for the language it switches TO. */
export const LANG_LABEL: Localized<string> = { fr: 'FR', en: 'EN' };

/** Full language name, for the toggle's aria-label. */
export const LANG_NAME: Localized<string> = { fr: 'Français', en: 'English' };

/** The other language. */
export function otherLang(lang: Lang): Lang {
  return lang === 'fr' ? 'en' : 'fr';
}

/**
 * Locale-free path -> real path.
 * `/` -> `/` (fr) or `/en` (en); `/devis` -> `/devis` or `/en/devis`.
 */
export function localePath(basePath: string, lang: Lang): string {
  if (lang === DEFAULT_LANG) return basePath;
  return basePath === '/' ? '/en' : `/en${basePath}`;
}

/**
 * Real path -> locale-free path. Inverse of `localePath`.
 * Used by the language toggle to find the current page's counterpart.
 */
export function basePathOf(path: string): string {
  const clean = path.replace(/\/+$/, '') || '/';
  if (clean === '/en') return '/';
  if (clean.startsWith('/en/')) return clean.slice(3);
  return clean;
}

/** Reads the locale out of a real path. */
export function langOf(path: string): Lang {
  const clean = path.replace(/\/+$/, '') || '/';
  return clean === '/en' || clean.startsWith('/en/') ? 'en' : 'fr';
}

/**
 * `href` for a locale-free path, with the trailing slash the export uses
 * (`trailingSlash: true` in next.config.mjs).
 */
export function href(basePath: string, lang: Lang): string {
  const p = localePath(basePath, lang);
  return p === '/' ? '/' : `${p}/`;
}
