import { services, serviceSlugs } from '@/data/services';
import { communes, communeSlugs } from '@/data/communes';

export type RouteKind = 'home' | 'service' | 'commune' | 'commune-service' | 'fixed';

export interface RouteDescriptor {
  path: string;
  kind: RouteKind;
  serviceSlug?: string;
  communeSlug?: string;
  /** Sitemap priority, 0..1 */
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

const FIXED_PATHS = [
  '/credit-impot',
  '/professionnels',
  '/devis',
  '/realisations',
  '/mentions-legales',
  '/confidentialite',
];

/**
 * Every route on the site, generated from data.
 * If you add a page and do not add it here, it will not be in the sitemap
 * and will not be checked for metadata uniqueness. See CLAUDE.md rule 3.
 */
export function allRoutes(): RouteDescriptor[] {
  const routes: RouteDescriptor[] = [
    { path: '/', kind: 'home', priority: 1.0, changeFrequency: 'weekly' },
  ];

  for (const p of FIXED_PATHS) {
    routes.push({
      path: p,
      kind: 'fixed',
      priority: p === '/credit-impot' || p === '/devis' ? 0.9 : 0.5,
      changeFrequency: 'monthly',
    });
  }

  for (const s of services) {
    routes.push({
      path: `/services/${s.slug}`,
      kind: 'service',
      serviceSlug: s.slug,
      priority: 0.9,
      changeFrequency: 'monthly',
    });
  }

  for (const c of communes) {
    routes.push({
      path: `/zones/${c.slug}`,
      kind: 'commune',
      communeSlug: c.slug,
      priority: 0.7,
      changeFrequency: 'monthly',
    });
    for (const s of services) {
      routes.push({
        path: `/zones/${c.slug}/${s.slug}`,
        kind: 'commune-service',
        communeSlug: c.slug,
        serviceSlug: s.slug,
        priority: 0.8,
        changeFrequency: 'monthly',
      });
    }
  }

  return routes;
}

/** 1 + 6 fixed + 6 services + 12 communes + 72 crosses = 97 */
export const EXPECTED_ROUTE_COUNT =
  1 + FIXED_PATHS.length + serviceSlugs.length + communeSlugs.length + communeSlugs.length * serviceSlugs.length;
