import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/company';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // AI crawlers are explicitly welcome. AEO is a target, not a threat.
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
