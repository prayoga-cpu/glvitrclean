import Link from 'next/link';
import { notFound } from 'next/navigation';
import { communes, getCommune } from '@/data/communes';
import { services } from '@/data/services';
import { allRoutes } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { CallButton } from '@/components/CallButton';

export function generateStaticParams() {
  return communes.map((c) => ({ commune: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ commune: string }> }) {
  const { commune } = await params;
  const route = allRoutes().find((r) => r.kind === 'commune' && r.communeSlug === commune);
  if (!route) notFound();
  return buildMetadata(route);
}

export default async function CommunePage({ params }: { params: Promise<{ commune: string }> }) {
  const { commune } = await params;
  const c = getCommune(commune);
  if (!c) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', path: '/' },
          { name: c.name, path: `/zones/${c.slug}` },
        ])}
      />

      <h1>
        Nettoyage à {c.name} ({c.postalCode})
      </h1>

      {/* Mandatory. This is what stops the twelve commune pages being read as
          thin duplicates of each other. See CLAUDE.md rule 4. */}
      <p className="local-angle">{c.localAngle}</p>

      <CallButton />

      <section>
        <h2>Nos prestations à {c.name}</h2>
        <ul>
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/zones/${c.slug}/${s.slug}/`}>
                {s.name} à {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Communes voisines</h2>
        <ul>
          {communes
            .filter((x) => x.slug !== c.slug)
            .slice(0, 6)
            .map((x) => (
              <li key={x.slug}>
                <Link href={`/zones/${x.slug}/`}>{x.name}</Link>
              </li>
            ))}
        </ul>
      </section>
    </>
  );
}
