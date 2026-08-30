import Link from 'next/link';
import { notFound } from 'next/navigation';
import { services, getService } from '@/data/services';
import { communes } from '@/data/communes';
import { faqForPage } from '@/data/faq';
import { allRoutes } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { serviceSchema, faqSchema, breadcrumbSchema } from '@/lib/schema';
import { TaxCreditBadge } from '@/components/TaxCreditBadge';
import { JsonLd } from '@/components/JsonLd';
import { Faq } from '@/components/Faq';
import { CallButton } from '@/components/CallButton';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = allRoutes().find((r) => r.kind === 'service' && r.serviceSlug === slug);
  if (!route) notFound();
  return buildMetadata(route);
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const entries = faqForPage(service.slug);

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={faqSchema(entries)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', path: '/' },
          { name: service.name, path: `/services/${service.slug}` },
        ])}
      />

      <h1>{service.name} en Essonne (91)</h1>
      <p>{service.summary}</p>

      {/* Renders null on facade and poubelles. Never override. */}
      <TaxCreditBadge service={service} basePriceEur={service.pricing.fromEur} />

      {/* On non-eligible services this is the honest exclusion note.
          It is the highest-trust element on the page. Do not remove it. */}
      {!service.taxCreditEligible && (
        <p className="eligibility-note">{service.eligibilityNote}</p>
      )}

      <CallButton />

      {/* TODO(claude): body copy. What is included, how it is done, what the
          customer should prepare. Written for a homeowner, not a buyer. */}

      <section>
        <h2>{service.name} dans votre commune</h2>
        <ul>
          {communes.map((c) => (
            <li key={c.slug}>
              <Link href={`/zones/${c.slug}/${service.slug}/`}>
                {service.name} à {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Faq entries={entries} />
    </>
  );
}
