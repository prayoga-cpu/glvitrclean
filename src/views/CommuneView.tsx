import Link from 'next/link';
import type { Commune } from '@/data/communes';
import { nearestCommunes } from '@/data/communes';
import { services } from '@/data/services';
import { breadcrumbSchema, serviceSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { ConversionBlock } from '@/components/ConversionBlock';
import { strings } from '@/i18n/dictionary';
import { href, type Lang } from '@/i18n/config';

export function CommuneView({ commune, lang }: { commune: Commune; lang: Lang }) {
  const t = strings(lang);
  const c = commune;

  return (
    <div className="page">
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: t.nav.home, path: '/' },
            { name: c.name, path: `/zones/${c.slug}` },
          ],
          lang,
        )}
      />

      {/* Rule 3: Service + areaServed on commune pages too. One node per
          service actually offered here, each scoped to this commune. */}
      {services.map((s) => (
        <JsonLd key={s.slug} data={serviceSchema(s, lang, c)} />
      ))}

      <h1>{t.commune.h1(c.name, c.postalCode)}</h1>

      {/* Mandatory, and translated per commune rather than templated. This is
          what stops the twelve commune pages being read as thin duplicates of
          each other — in either language. See CLAUDE.md rule 4. */}
      <p className="local-angle">{c.localAngle[lang]}</p>

      <ConversionBlock lang={lang} />

      <section>
        <h2>{t.commune.ourServicesIn(c.name)}</h2>
        <ul className="link-grid">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={href(`/zones/${c.slug}/${s.slug}`, lang)}>
                {t.commune.linkServiceIn(s.name[lang], c.name)}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Closes the internal-link loop. Without this the chain ran one way
          only: nothing under /zones/ pointed back up to a service hub.
          ROADMAP phase 3, "and back". */}
      <section>
        <h2>{t.commune.allServiceHubs}</h2>
        <ul className="link-grid">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={href(`/services/${s.slug}`, lang)}>
                {t.communeService.serviceInRegion(s.name[lang])}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t.commune.neighbouring}</h2>
        <ul className="link-grid">
          {nearestCommunes(c).map((x) => (
            <li key={x.slug}>
              <Link href={href(`/zones/${x.slug}`, lang)}>{x.name}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
