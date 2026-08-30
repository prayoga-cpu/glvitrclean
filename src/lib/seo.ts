import type { Metadata } from 'next';
import { SITE_URL, company } from '@/data/company';
import { getService } from '@/data/services';
import { getCommune } from '@/data/communes';
import type { RouteDescriptor } from '@/lib/routes';

const BRAND = "GLVITR'CLEAN";

export interface SeoFields {
  title: string;
  description: string;
  canonical: string;
}

/**
 * The single generator for titles and descriptions.
 * Never hand-write a metadata export on a route this can serve.
 *
 * Uniqueness is enforced by scripts/check-metadata-unique.mjs, which fails the
 * build on any collision. That check exists because duplicate metadata left
 * 39 of 51 pages unindexed on a previous project.
 */
export function seoFor(route: RouteDescriptor): SeoFields {
  const canonical = `${SITE_URL}${route.path === '/' ? '/' : route.path + '/'}`;

  switch (route.kind) {
    case 'home':
      return {
        title: `Nettoyage vitres et terrasse en Essonne (91) | ${BRAND}`,
        description:
          "Nettoyage de vitres, terrasses, volets et ménage à domicile dans le sud de l'Essonne. Devis gratuit, produits écologiques, intervention rapide.",
        canonical,
      };

    case 'service': {
      const s = getService(route.serviceSlug!);
      if (!s) throw new Error(`Unknown service: ${route.serviceSlug}`);
      return {
        title: `${s.name} en Essonne (91) | ${BRAND}`,
        description: `${s.summary} Intervention dans le sud de l'Essonne, devis gratuit.`,
        canonical,
      };
    }

    case 'commune': {
      const c = getCommune(route.communeSlug!);
      if (!c) throw new Error(`Unknown commune: ${route.communeSlug}`);
      return {
        title: `Nettoyage à ${c.name} (91) | ${BRAND}`,
        description: `Entreprise de nettoyage à ${c.name}. Vitres, terrasses, volets, ménage et façades. Devis gratuit, réponse rapide.`,
        canonical,
      };
    }

    case 'commune-service': {
      const c = getCommune(route.communeSlug!);
      const s = getService(route.serviceSlug!);
      if (!c || !s) throw new Error(`Unknown pair: ${route.communeSlug}/${route.serviceSlug}`);
      return {
        // Brand omitted on the 72 deepest pages: these are won on query match,
        // not brand recall, and the suffix would push every title past 60 chars.
        title: `${s.name} à ${c.name} (91)`,
        // Description varies by BOTH service and commune, so no two collide.
        description: `${s.name} à ${c.name} et alentours. ${s.summary.split('.')[0]}. Devis gratuit au ${company.phoneDisplay}.`,
        canonical,
      };
    }

    case 'fixed':
      return { ...fixedSeo(route.path), canonical };
  }
}

function fixedSeo(path: string): Omit<SeoFields, 'canonical'> {
  switch (path) {
    case '/credit-impot':
      return {
        title: `Crédit d'impôt 50 % sur le nettoyage à domicile | ${BRAND}`,
        description:
          "Comment fonctionne le crédit d'impôt Services à la Personne, quelles prestations de nettoyage y ouvrent droit, et lesquelles en sont exclues.",
      };
    case '/professionnels':
      return {
        title: `Nettoyage pour professionnels en Essonne (91) | ${BRAND}`,
        description:
          "Vitrines, bureaux, façades et conteneurs. Interventions ponctuelles ou régulières pour commerces et entreprises du sud de l'Essonne.",
      };
    case '/devis':
      return {
        title: `Devis gratuit de nettoyage en Essonne | ${BRAND}`,
        description: `Demandez un devis gratuit pour le nettoyage de vos vitres, terrasse ou logement. Réponse rapide, ou appelez le ${company.phoneDisplay}.`,
      };
    case '/realisations':
      return {
        title: `Nos réalisations de nettoyage en Essonne | ${BRAND}`,
        description:
          'Photos avant et après de chantiers réalisés dans le sud de l\u2019Essonne : vitres, terrasses, façades et volets.',
      };
    case '/mentions-legales':
      return {
        title: `Mentions légales | ${BRAND}`,
        description: `Mentions légales, éditeur, hébergeur et informations réglementaires du site ${BRAND}.`,
      };
    case '/confidentialite':
      return {
        title: `Politique de confidentialité | ${BRAND}`,
        description: `Traitement des données personnelles collectées via le formulaire de devis de ${BRAND}.`,
      };
    default:
      throw new Error(`No SEO defined for fixed path: ${path}`);
  }
}

/** Converts SeoFields into a Next.js Metadata object. */
export function toMetadata(fields: SeoFields): Metadata {
  return {
    title: fields.title,
    description: fields.description,
    alternates: { canonical: fields.canonical },
    openGraph: {
      title: fields.title,
      description: fields.description,
      url: fields.canonical,
      siteName: BRAND,
      locale: 'fr_FR',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export function buildMetadata(route: RouteDescriptor): Metadata {
  return toMetadata(seoFor(route));
}
