import { notFound } from 'next/navigation';
import { services, getService } from '@/data/services';
import { routeForSlugs } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { ServiceView } from '@/views/ServiceView';

const LANG = 'fr' as const;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = routeForSlugs('service', LANG, { serviceSlug: slug });
  if (!route) notFound();
  return buildMetadata(route);
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return <ServiceView service={service} lang={LANG} />;
}
