import { SITE_URL } from '@/data/company';
import { CallButton } from '@/components/CallButton';
import { JsonLd } from '@/components/JsonLd';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
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
        <JsonLd data={localBusinessSchema(lang)} />

        <SiteHeader lang={lang} />

        <main className="container">{children}</main>

        <SiteFooter lang={lang} />

        <CallButton lang={lang} sticky />
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
