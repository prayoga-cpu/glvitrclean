import type { MetadataRoute } from 'next';
import { company } from '@/data/company';
import { icons, THEME_COLOR, BACKGROUND_COLOR } from '@/data/brand';
import { allRoutes } from '@/lib/routes';
import { seoFor } from '@/lib/seo';
import { DEFAULT_LANG } from '@/i18n/config';

export const dynamic = 'force-static';

/**
 * Web app manifest, generated rather than hand-written — the same reasoning as
 * `sitemap.ts` and `robots.ts`. The icon list comes from `src/data/brand.ts`,
 * so a renamed file cannot leave a dead entry behind here.
 *
 * Next emits this at `/manifest.webmanifest` and injects the
 * `<link rel="manifest">` into both root layouts itself. The supplied kit
 * called the file `site.webmanifest`; the path is arbitrary as long as the
 * link tag points at it, and generating it is worth more than matching a name.
 *
 * A manifest has exactly one `lang`, so it is the French edition's — French is
 * the commercial edition and owns the bare paths. `start_url` is `/` for the
 * same reason. This is an install target and a theme-colour carrier, not a
 * routing surface: there is no service worker and the site is not a PWA.
 */
export default function manifest(): MetadataRoute.Manifest {
  // Reuse the French home page's description rather than introduce a second
  // sentence about the business that could drift away from it.
  const home = allRoutes().find((r) => r.kind === 'home' && r.lang === DEFAULT_LANG);
  if (!home) throw new Error('No home route: allRoutes() is broken.');

  return {
    name: company.legalName,
    short_name: company.legalName,
    description: seoFor(home).description,
    lang: DEFAULT_LANG,
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    categories: ['business', 'lifestyle'],
    icons: [
      { src: icons.android192, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: icons.android512, sizes: '512x512', type: 'image/png', purpose: 'any' },
      // A maskable icon is drawn edge to edge and cropped to whatever shape the
      // launcher uses. Without one, Android pads the `any` icon into a white
      // circle, which puts a white ring around the gold one.
      { src: icons.maskable512, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
