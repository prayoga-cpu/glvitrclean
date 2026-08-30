import { notFound } from 'next/navigation';
import { communes, getCommune } from '@/data/communes';
import { services, getService } from '@/data/services';
import { routeForSlugs } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { CommuneServiceView } from '@/views/CommuneServiceView';

const LANG = 'en' as const;

export function generateStaticParams() {
  return communes.flatMap((c) => services.map((s) => ({ commune: c.slug, service: s.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ commune: string; service: string }>;
}) {
  const { commune, service } = await params;
  const route = routeForSlugs('commune-service', LANG, {
    communeSlug: commune,
    serviceSlug: service,
  });
  if (!route) notFound();
  return buildMetadata(route);
}

export default async function CommuneServicePage({
  params,
}: {
  params: Promise<{ commune: string; service: string }>;
}) {
  const { commune, service } = await params;
  const c = getCommune(commune);
  const s = getService(service);
  if (!c || !s) notFound();
  return <CommuneServiceView commune={c} service={s} lang={LANG} />;
}
