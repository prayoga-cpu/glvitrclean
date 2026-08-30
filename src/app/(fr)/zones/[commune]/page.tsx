import { notFound } from 'next/navigation';
import { communes, getCommune } from '@/data/communes';
import { routeForSlugs } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { CommuneView } from '@/views/CommuneView';

const LANG = 'fr' as const;

export function generateStaticParams() {
  return communes.map((c) => ({ commune: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ commune: string }> }) {
  const { commune } = await params;
  const route = routeForSlugs('commune', LANG, { communeSlug: commune });
  if (!route) notFound();
  return buildMetadata(route);
}

export default async function CommunePage({ params }: { params: Promise<{ commune: string }> }) {
  const { commune } = await params;
  const c = getCommune(commune);
  if (!c) notFound();
  return <CommuneView commune={c} lang={LANG} />;
}
