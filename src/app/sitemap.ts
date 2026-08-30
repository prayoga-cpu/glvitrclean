import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/company';
import { allRoutes } from '@/lib/routes';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return allRoutes().map((r) => ({
    url: `${SITE_URL}${r.path === '/' ? '/' : r.path + '/'}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
