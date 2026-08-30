import { services, serviceSlugs } from '@/data/services';
import { communes, communeSlugs } from '@/data/communes';
import { LANGS, localePath, type Lang } from '@/i18n/config';

export type RouteKind = 'home' | 'service' | 'commune' | 'commune-service' | 'fixed';

export interface RouteDescriptor {
  /**
   * Locale-free identity of the page, e.g. '/services/vitres'. Both language
   * versions of a page share one basePath — that is what makes the hreflang
   * pair in seo.ts, and the toggle in the header, computable.
   */
  basePath: string;
  /** Real URL path: '/services/vitres' (fr) or '/en/services/vitres' (en). */
  path: string;
  lang: Lang;
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

/** The locale-free skeleton. One entry per page, regardless of language. */
type BaseRoute = Omit<RouteDescriptor, 'path' | 'lang'>;

function baseRoutes(): BaseRoute[] {
  const routes: BaseRoute[] = [
    { basePath: '/', kind: 'home', priority: 1.0, changeFrequency: 'weekly' },
  ];

  for (const p of FIXED_PATHS) {
    routes.push({
      basePath: p,
      kind: 'fixed',
      priority: p === '/credit-impot' || p === '/devis' ? 0.9 : 0.5,
      changeFrequency: 'monthly',
    });
  }

  for (const s of services) {
    routes.push({
      basePath: `/services/${s.slug}`,
      kind: 'service',
      serviceSlug: s.slug,
      priority: 0.9,
      changeFrequency: 'monthly',
    });
  }

  for (const c of communes) {
    routes.push({
      basePath: `/zones/${c.slug}`,
      kind: 'commune',
      communeSlug: c.slug,
      priority: 0.7,
      changeFrequency: 'monthly',
    });
    for (const s of services) {
      routes.push({
        basePath: `/zones/${c.slug}/${s.slug}`,
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

/**
 * Every route on the site, in every language.
 * If you add a page and do not add it here, it will not be in the sitemap
 * and will not be checked for metadata uniqueness. See CLAUDE.md rule 3.
 */
export function allRoutes(): RouteDescriptor[] {
  return LANGS.flatMap((lang) =>
    baseRoutes().map((r) => ({
      ...r,
      lang,
      path: localePath(r.basePath, lang),
      // English is the secondary market: it must never outrank the French page
      // it mirrors on the same query, so every EN priority is stepped down.
      priority: lang === 'fr' ? r.priority : Math.round(r.priority * 0.8 * 100) / 100,
    })),
  );
}

/** Finds one page by its locale-free path. */
export function routeFor(basePath: string, lang: Lang): RouteDescriptor {
  const route = allRoutes().find((r) => r.basePath === basePath && r.lang === lang);
  if (!route) throw new Error(`No route for ${basePath} (${lang})`);
  return route;
}

/** Finds one generated page by kind and slug. */
export function routeForSlugs(
  kind: RouteKind,
  lang: Lang,
  slugs: { serviceSlug?: string; communeSlug?: string },
): RouteDescriptor | undefined {
  return allRoutes().find(
    (r) =>
      r.kind === kind &&
      r.lang === lang &&
      r.serviceSlug === slugs.serviceSlug &&
      r.communeSlug === slugs.communeSlug,
  );
}

/** 1 + 6 fixed + 6 services + 12 communes + 72 crosses = 97, per language. */
export const EXPECTED_ROUTE_COUNT_PER_LANG =
  1 +
  FIXED_PATHS.length +
  serviceSlugs.length +
  communeSlugs.length +
  communeSlugs.length * serviceSlugs.length;

/** 97 × 2 languages = 194. */
export const EXPECTED_ROUTE_COUNT = EXPECTED_ROUTE_COUNT_PER_LANG * LANGS.length;
