import Link from 'next/link';
import type { Commune } from '@/data/communes';
import { nearestCommunes } from '@/data/communes';
import { services } from '@/data/services';
import { breadcrumbSchema, serviceSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { ConversionBlock } from '@/components/ConversionBlock';
import { ProcessSteps } from '@/components/ProcessSteps';
import { Reviews } from '@/components/Reviews';
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

      <ConversionBlock lang={lang} photoNote />

      {/* ROADMAP phase 8a. One templated sentence was carrying the whole weight
          of rule 4 on twelve pages. `soiling` names the physical cause and
          `housing` names what it lands on — the two axes on which two
          neighbouring Essonne towns with identical weather actually differ.

          The limit on what may be claimed here is in src/data/communes.ts and
          it is a hard one: nothing invented about a real place. */}
      <section>
        <h2>{t.commune.soilingH2(c.name)}</h2>
        <p>{c.soiling[lang]}</p>
      </section>

      <section>
        <h2>{t.commune.housingH2(c.name)}</h2>
        <p>{c.housing[lang]}</p>
      </section>

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

      {/* Phase 8e: mid-page action. This is the point a visitor has read what
          we do here and decided whether it applies to them. */}
      <ConversionBlock lang={lang} />

      {/* Phase 8e: the process, on the pages that actually receive local search
          traffic. Someone who arrives here from Google has never seen the home
          page, where these steps used to live alone. */}
      <section>
        <h2>{t.commune.processH2(c.name)}</h2>
        <ProcessSteps lang={lang} />
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

      {/* The heading names the commune rather than saying "neighbouring towns"
          in the abstract. Phase 8c: six of the ten H2s on the SPIC AND SPAN
          Paris page contain the word Paris, and ours named the place once and
          then stopped. */}
      <section>
        <h2>{t.commune.neighbouring(c.name)}</h2>
        <ul className="link-grid">
          {nearestCommunes(c).map((x) => (
            <li key={x.slug}>
              <Link href={href(`/zones/${x.slug}`, lang)}>{x.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      {/* This commune's own reviews. Renders null while the array is empty, and
          will render null for most communes even after phase 7 — a review is
          only shown on the page for the town it was actually left about. */}
      <Reviews lang={lang} communeSlug={c.slug} />

      <ConversionBlock lang={lang} />
    </div>
  );
}
