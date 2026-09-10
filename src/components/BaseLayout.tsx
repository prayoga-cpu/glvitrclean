import { SITE_URL, company } from '@/data/company';
import { CallButton } from '@/components/CallButton';
import { JsonLd } from '@/components/JsonLd';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { ScrollChrome } from '@/components/ScrollChrome';
import { ChatLauncher } from '@/components/ChatLauncher';
import { localBusinessSchema } from '@/lib/schema';
import { icons, socialCards, THEME_COLOR } from '@/data/brand';
import { HTML_LANG, type Lang } from '@/i18n/config';
import type { Metadata, Viewport } from 'next';

/**
 * The shared body of both root layouts.
 *
 * There are two root layouts — src/app/(fr)/layout.tsx and
 * src/app/(en)/layout.tsx — because only a root layout may emit <html>, and
 * `<html lang>` has to differ between the two editions. Route groups do not add
 * a URL segment, so `(fr)/page.tsx` is `/` and `(en)/en/page.tsx` is `/en`.
 *
 * Everything below the <html> element is identical and lives here, so the two
 * layouts cannot drift apart.
 */
export function BaseLayout({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={HTML_LANG[lang]}>
      <body>
        {/* Both faces are used above the fold — Schibsted for the H1, Newsreader
            for its italic accent. Without a preload the browser only discovers
            them after the stylesheet parses, which pushes the largest text on
            the page into a second paint. React 19 hoists these into <head>. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/assets/fonts/schibsted-grotesk-latin.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/assets/fonts/newsreader-italic-latin.woff2"
          crossOrigin="anonymous"
        />

        <JsonLd data={localBusinessSchema()} />

        <SiteHeader lang={lang} />

        <main className="container">{children}</main>

        <SiteFooter lang={lang} />

        <CallButton lang={lang} sticky />

        {/* The chatbox. A static <details>, not a widget — see the header
            comment in ChatLauncher.tsx. It sits after the call bar in source
            order so the bar is reached first by keyboard and by a screen
            reader: docs/05 puts the call first and this does not reorder it. */}
        <ChatLauncher lang={lang} />

        {/* Renders nothing; toggles <html data-scroll> so CSS can hide the
            header on the way down and the call bar on the way back up. */}
        <ScrollChrome />
      </body>
    </html>
  );
}

/**
 * Root metadata. Per-page titles and cards come from buildMetadata().
 *
 * Both root layouts call this, so the icon set is declared exactly once for all
 * 194 routes. It replaces the old `src/app/icon.png`: Next's file convention
 * emits a single icon at a URL it chooses, which cannot express the size set, a
 * `.ico`, or the Apple touch icon.
 */
export function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    // The fallback for a route that ships no metadata of its own — in practice
    // only the 404, which is noindex. Every real route overwrites it from
    // seo.ts. The client's brand line, since that is what a bare tab should say.
    title: { default: company.brandLine, template: '%s' },

    icons: {
      // `/favicon.ico` is also served at the root without a tag, because
      // Google's favicon fetcher and most feed readers ask for that path
      // directly rather than parsing the document.
      icon: [
        { url: icons.ico, sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
        { url: icons.png16, sizes: '16x16', type: 'image/png' },
        { url: icons.png32, sizes: '32x32', type: 'image/png' },
        { url: icons.png48, sizes: '48x48', type: 'image/png' },
      ],
      apple: [{ url: icons.appleTouch, sizes: '180x180', type: 'image/png' }],
    },

    // The language-neutral card. Every real route overwrites this with its own
    // edition's card in toMetadata(); this is what a route without a metadata
    // export of its own would otherwise ship with none at all.
    openGraph: {
      siteName: company.brandLine,
      type: 'website',
      images: [
        {
          url: socialCards.brand,
          width: socialCards.width,
          height: socialCards.height,
          alt: "GLVITR'CLEAN",
        },
      ],
    },
  };
}

/**
 * `themeColor` is a viewport export in Next 15, not a metadata one — it is
 * emitted as `<meta name="theme-color">` and tints the Android address bar and
 * the iOS status bar once the site is installed. Both root layouts re-export
 * this; it is declared here so the two cannot drift.
 */
export const baseViewport: Viewport = {
  themeColor: THEME_COLOR,
};
