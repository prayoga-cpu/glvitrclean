import type { MetadataRoute } from 'next';
import { allRoutes } from '@/lib/routes';
import { absoluteUrl } from '@/lib/seo';
import { DEFAULT_LANG } from '@/i18n/config';

export const dynamic = 'force-static';

/**
 * All 194 routes: 97 French at the bare paths, 97 English under /en.
 *
 * Each entry carries its hreflang pair, so a crawler that reaches one edition
 * is told about the other without having to render the page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return allRoutes().map((r) => ({
    url: absoluteUrl(r.basePath, r.lang),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    alternates: {
      languages: {
        fr: absoluteUrl(r.basePath, 'fr'),
        en: absoluteUrl(r.basePath, 'en'),
        'x-default': absoluteUrl(r.basePath, DEFAULT_LANG),
      },
    },
  }));
}
