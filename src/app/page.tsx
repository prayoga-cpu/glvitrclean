import Link from 'next/link';
import Image from 'next/image';
import { services } from '@/data/services';
import { communes } from '@/data/communes';
import { company } from '@/data/company';
import { allRoutes } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { QuoteForm } from '@/components/QuoteForm';
import { WhatsAppButton } from '@/components/CallButton';

const route = allRoutes().find((r) => r.kind === 'home')!;
export const metadata = buildMetadata(route);

/**
 * Home page, built from the human-supplied prototype (logo+prototype.html).
 *
 * Where the prototype and this repository's rules disagreed, the rules won.
 * Each deviation is commented at the point it happens so the next person does
 * not "restore" it from the prototype by mistake. The full list is in
 * STATUS.md under 2026-08-31.
 *
 * The photography is stock, not the client's work, and is marked as such on
 * screen until the real archive lands in phase 5. CLAUDE.md rule 4.
 */
export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="panel hero__panel">
          <p className="hero__flag">Devis gratuit et sans engagement</p>

          <div className="hero__split">
            {/*
              The prototype's H1 was "Une société à votre écoute." That is brand
              copy with no search value, and the home page has exactly one H1 to
              spend. The head term stays; the display treatment is kept by
              breaking the line and setting the locative half in the accent face.
            */}
            <h1>
              Nettoyage de vitres, terrasses et ménage
              <br />
              <span className="accent">dans le sud de l&apos;Essonne.</span>
            </h1>

            <div className="hero__aside">
              <p className="lead">
                Vitres, terrasses, volets, façades et ménage à domicile. Un seul
                interlocuteur, des produits respectueux de l&apos;environnement, et un
                devis gratuit avant toute intervention.
              </p>

              {/*
                Call first, form second. A solo tradesman converts by phone.
                docs/05-conversion-architecture.md sets this order; do not swap it.
              */}
              <div className="hero__actions">
                <a href={`tel:${company.phone}`} className="btn btn--accent" data-action="call">
                  Appeler le {company.phoneDisplay}
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
                <Link href="/devis/" className="btn btn--quiet">
                  Demander un devis en ligne ›
                </Link>
              </div>
            </div>
          </div>

          <div className="hero__gallery">
            <Image src="/assets/placeholder/hero-01.webp" alt="" width={760} height={947} priority />
            <Image src="/assets/placeholder/hero-02.webp" alt="" width={900} height={614} />
            <Image src="/assets/placeholder/hero-03.webp" alt="" width={760} height={947} />
            <Image src="/assets/placeholder/hero-04.webp" alt="" width={900} height={665} />
          </div>
        </div>

        {/*
          The three figures are read from data, not typed in. The prototype's
          first card claimed "50% de crédit d'impôt" as static text, which
          CLAUDE.md rule 1 forbids outright and which would be an unbacked claim
          while company.sapDeclaration.number is null. The rate now appears only
          where <TaxCreditBadge /> renders it: on eligible service pages.
        */}
        <div className="hero__stats">
          <div className="stat">
            <p className="stat__figure">0 €</p>
            <p className="stat__label">devis gratuit et sans engagement</p>
          </div>
          <div className="stat">
            <p className="stat__figure">{services.length}</p>
            <p className="stat__label">prestations, à l&apos;intérieur comme à l&apos;extérieur</p>
          </div>
          <div className="stat">
            <p className="stat__figure">{communes.length}</p>
            <p className="stat__label">communes desservies dans le sud de l&apos;Essonne</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="split">
          <div className="split__media">
            <Image src="/assets/placeholder/apropos-01.webp" alt="" width={800} height={1029} />
            <Image
              src="/assets/placeholder/apropos-02.webp"
              alt=""
              width={420}
              height={357}
              className="split__inset"
            />
            <p className="placeholder-note">
              Photos d&apos;illustration. Les photos des chantiers réels arrivent avec
              l&apos;archive du client.
            </p>
          </div>

          <div>
            <span className="eyebrow">◆ Qui sommes-nous</span>
            <h2>
              Un travail minutieux, <span className="accent">des résultats impeccables</span>
            </h2>

            {/*
              GLVITR'CLEAN is one operator, Thibaut. The prototype said "nos
              experts", "notre équipe" and "nacelle comprise" — a team, and a
              piece of access equipment, neither of which exists in src/data/ or
              in docs/00-business-model.md. docs/05 asks for a named human
              precisely instead of "notre équipe". Inventing either is a rule 4
              violation, so both are gone.
            */}
            <p className="lead">
              Derrière GLVITR&apos;CLEAN il y a Thibaut, qui se déplace lui-même sur
              chaque chantier. Vous parlez à la personne qui fait le travail, du
              devis jusqu&apos;à la vérification finale.
            </p>

            <ul className="checklist">
              <li>Un seul interlocuteur, du devis à la fin du chantier</li>
              <li>Produits respectueux de l&apos;environnement</li>
              <li>Devis gratuit et sans engagement</li>
              <li>Particuliers et professionnels</li>
            </ul>

            <div className="actions">
              <Link href="/devis/" className="btn btn--primary">
                Demander un devis
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link href="/professionnels/" className="btn btn--quiet">
                Vous êtes une entreprise ? ›
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/*
        The prototype listed four services in a JavaScript accordion. There are
        six, they live in src/data/services.ts, and each one owns a route that
        this page must link to — the home → service → commune chain is the whole
        point of the site. Rendered as plain links: nothing is hidden behind
        hydration, and a crawler sees six anchors. CLAUDE.md rules 2 and 3.
      */}
      <section className="section" id="services">
        <div className="panel">
          <div className="section-head">
            <div>
              <span className="eyebrow">◆ Nos services</span>
              <h2>
                Nos services <span className="accent">sur mesure</span>
              </h2>
            </div>
            <p>
              Vitres, terrasses, volets, façades, poubelles ou ménage complet : chaque
              intervention est adaptée au lieu et à sa fréquence d&apos;usage.
            </p>
          </div>

          <ul className="service-list">
            {services.map((s, i) => (
              <li key={s.slug} className="service-list__item">
                <Link href={`/services/${s.slug}/`} className="service-list__link">
                  <span className="service-list__index" aria-hidden="true">
                    ({String(i + 1).padStart(2, '0')})
                  </span>
                  <span>
                    <span className="service-list__name">{s.name}</span>
                    <span className="service-list__summary">{s.summary}</span>
                  </span>
                  <span className="service-list__arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">◆ Comment ça se passe</span>
            <h2>
              Un devis, une date, <span className="accent">des vitres nettes</span>
            </h2>
          </div>
          <div className="actions">
            <Link href="/devis/" className="btn btn--primary">
              Nous contacter
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>

        <ol className="card-grid">
          <li className="card">
            <div className="card__top">
              <span className="card__glyph" aria-hidden="true">
                ◆
              </span>
              <span className="card__number" aria-hidden="true">
                01
              </span>
            </div>
            <h3>Vous demandez un devis</h3>
            <p>Par téléphone, par WhatsApp ou via le formulaire. Gratuit et sans engagement.</p>
          </li>
          <li className="card">
            <div className="card__top">
              <span className="card__glyph" aria-hidden="true">
                ◆
              </span>
              <span className="card__number" aria-hidden="true">
                02
              </span>
            </div>
            <h3>Nous évaluons vos besoins</h3>
            <p>
              Surfaces, accès, fréquence : l&apos;intervention et son coût sont définis en
              transparence avant de commencer.
            </p>
          </li>
          <li className="card">
            <div className="card__top">
              <span className="card__glyph" aria-hidden="true">
                ◆
              </span>
              <span className="card__number" aria-hidden="true">
                03
              </span>
            </div>
            <h3>Nous intervenons</h3>
            <p>Matériel adapté, produits écologiques, et un résultat vérifié avec vous.</p>
          </li>
        </ol>
      </section>

      <section className="section section--flush-top" id="avantages">
        <div className="panel">
          <div className="section-head">
            <div>
              <span className="eyebrow">◆ Pourquoi nous choisir</span>
              <h2>
                Pourquoi choisir <span className="accent">GLVITR&apos;CLEAN ?</span>
              </h2>
            </div>
            <div className="actions">
              <Link href="/devis/" className="btn btn--accent">
                Demander un devis gratuit
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/*
            The prototype's three cards were "50% de crédit d'impôt", "Satisfaction
            garantie — nous revenons gratuitement" and "Équipe formée et assurée".
            The first is a rule 1 violation, the second is a commercial guarantee
            that appears nowhere in src/data/ or the docs, and the third describes
            a team that does not exist and an insurance policy still blocked on the
            client (STATUS.md item 11). All three replaced with claims that are
            backed by data.
          */}
          <ul className="card-grid">
            <li className="card card--on-brand">
              <span className="card__badge" aria-hidden="true">
                ✓
              </span>
              <h3>Un seul interlocuteur</h3>
              <p>
                Thibaut réalise lui-même chaque intervention. Pas de sous-traitance, pas
                d&apos;intermédiaire.
              </p>
            </li>
            <li className="card card--on-brand">
              <span className="card__badge" aria-hidden="true">
                ◆
              </span>
              <h3>Produits écologiques</h3>
              <p>
                Des produits respectueux de l&apos;environnement, sûrs pour les enfants et
                les animaux du foyer.
              </p>
            </li>
            <li className="card card--on-brand">
              {/* Real offer, already on the client's flyer. docs/00-business-model.md */}
              <p className="card__figure">{company.referralBonus} €</p>
              <h3>Parrainage</h3>
              <p>
                {company.referralBonus} € pour chaque nouveau client que vous nous
                recommandez.
              </p>
            </li>
            <li className="card card--on-brand">
              {/*
                Named, not quantified. The rate renders only through
                <TaxCreditBadge /> on eligible service pages, so it can still be
                switched off in one edit. CLAUDE.md rule 1.
              */}
              <span className="card__badge" aria-hidden="true">
                ◆
              </span>
              <h3>Services à la Personne</h3>
              <p>
                Une partie des prestations à domicile relève de ce dispositif. Les
                conditions sont détaillées sur la page dédiée.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <div className="marquee bleed" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((n) => (
            <div className="marquee__group" key={n}>
              {services.map((s) => (
                <span key={s.slug}>
                  {s.name}
                  <span> ◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/*
        Absent from the prototype entirely, and the single most commercially
        important block on the page: the home → commune → commune×service chain
        is what the 84 local routes rank on. CLAUDE.md rule 3, ROADMAP phase 3.
      */}
      <section className="section" id="zones">
        <div className="section-head">
          <div>
            <span className="eyebrow">◆ Zones d&apos;intervention</span>
            <h2>
              Nous intervenons <span className="accent">dans votre commune</span>
            </h2>
          </div>
          <p>
            Le sud de l&apos;Essonne, sur le corridor N20 et RER C. Votre commune
            n&apos;est pas dans la liste ? Appelez, elle est peut-être sur la route.
          </p>
        </div>

        <ul className="commune-grid">
          {communes.map((c) => (
            <li key={c.slug}>
              <Link href={`/zones/${c.slug}/`}>
                {c.name}
                <span>{c.postalCode}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" id="contact">
        <div className="split">
          <div>
            <span className="eyebrow">◆ Contact</span>
            <h2>
              Prêt à voir <span className="accent">la différence ?</span>
            </h2>
            <p className="lead">
              Appelez pour un devis gratuit, ou envoyez une photo de ce qu&apos;il y a à
              nettoyer. C&apos;est souvent plus rapide qu&apos;un formulaire.
            </p>

            <div className="contact-list">
              <div className="contact-list__row">
                <span className="contact-list__label">Téléphone</span>
                <a
                  className="contact-list__value"
                  href={`tel:${company.phone}`}
                  data-action="call"
                >
                  {company.phoneDisplay}
                </a>
              </div>
              <div className="contact-list__row">
                <span className="contact-list__label">Courriel</span>
                <a className="contact-list__value" href={`mailto:${company.email}`}>
                  {company.email}
                </a>
              </div>
            </div>

            <div className="actions actions--spaced">
              <WhatsAppButton />
            </div>

            <Image
              src="/assets/placeholder/contact-01.webp"
              alt=""
              width={800}
              height={520}
              className="contact-media"
            />
            <p className="placeholder-note">Photo d&apos;illustration.</p>
          </div>

          {/* The existing three-field form. docs/05: never put a long form in
              front of the phone number, so it sits second in the reading order. */}
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
