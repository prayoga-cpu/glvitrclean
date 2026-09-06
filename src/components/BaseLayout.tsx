import { SITE_URL } from '@/data/company';
import { CallButton } from '@/components/CallButton';
import { JsonLd } from '@/components/JsonLd';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { ScrollChrome } from '@/components/ScrollChrome';
import { localBusinessSchema } from '@/lib/schema';
import { HTML_LANG, type Lang } from '@/i18n/config';
import type { Metadata } from 'next';

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

        {/* Renders nothing; toggles <html data-scroll> so CSS can hide the
            header on the way down and the call bar on the way back up. */}
        <ScrollChrome />
      </body>
    </html>
  );
}

/** Root metadata. Per-page titles come from buildMetadata(). */
export function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: "GLVITR'CLEAN", template: '%s' },
  };
}
