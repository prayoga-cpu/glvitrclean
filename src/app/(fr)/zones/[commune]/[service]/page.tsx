import Link from 'next/link';
import { notFound } from 'next/navigation';
import { communes, getCommune } from '@/data/communes';
import { services, getService } from '@/data/services';
import { allRoutes } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema';
import { TaxCreditBadge } from '@/components/TaxCreditBadge';
import { JsonLd } from '@/components/JsonLd';
import { CallButton } from '@/components/CallButton';

export function generateStaticParams() {
  return communes.flatMap((c) => services.map((s) => ({ commune: c.slug, service: s.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ commune: string; service: string }>;
}) {
  const { commune, service } = await params;
  const route = allRoutes().find(
    (r) => r.kind === 'commune-service' && r.communeSlug === commune && r.serviceSlug === service,
  );
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

  return (
    <>
      <JsonLd data={serviceSchema(s, c)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', path: '/' },
          { name: c.name, path: `/zones/${c.slug}` },
          { name: s.name, path: `/zones/${c.slug}/${s.slug}` },
        ])}
      />

      <h1>
        {s.name} à {c.name} ({c.postalCode})
      </h1>
      <p>{s.summary}</p>
      <p className="local-angle">{c.localAngle}</p>

      <TaxCreditBadge service={s} basePriceEur={s.pricing.fromEur} />
      {!s.taxCreditEligible && <p className="eligibility-note">{s.eligibilityNote}</p>}

      <CallButton />

      {/* TODO(claude): two short paragraphs specific to this pair. Reuse the
          commune's localAngle as the hook, not as the whole body. */}

      <nav aria-label="Liens connexes">
        <Link href={`/services/${s.slug}/`}>{s.name} en Essonne</Link>
        <Link href={`/zones/${c.slug}/`}>Toutes nos prestations à {c.name}</Link>
      </nav>
    </>
  );
}
