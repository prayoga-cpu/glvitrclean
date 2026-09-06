import type { MetadataRoute } from 'next';
import { allRoutes } from '@/lib/routes';
import { absoluteUrl } from '@/lib/seo';
import { DEFAULT_LANG } from '@/i18n/config';

export const dynamic = 'force-static';

/**
 * Every route: French at the bare paths, English under /en. The count comes
 * from allRoutes(), so adding a basePath adds both editions here for free.
 *
 * Each entry carries its hreflang pair, so a crawler that reaches one edition
 * is told about the other without having to render the page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes().map((r) => ({
    url: absoluteUrl(r.basePath, r.lang),
    // No lastModified. It was `new Date()` at build time, which stamped all
    // 198 URLs with the same fresh timestamp on every deploy — including
    // deploys that changed one page or none. A crawler learns to ignore a
    // lastmod that always says "just now", and an absent one is treated
    // better than a distrusted one. changeFrequency and priority below carry
    // the recrawl hint on their own.
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
