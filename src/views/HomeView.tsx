import Link from 'next/link';
import Image from 'next/image';
import { services } from '@/data/services';
import { communes } from '@/data/communes';
import { company } from '@/data/company';
import { QuoteForm } from '@/components/QuoteForm';
import { WhatsAppButton } from '@/components/CallButton';
import { strings } from '@/i18n/dictionary';
import { href, type Lang } from '@/i18n/config';

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
 *
 * One component, both languages: every string comes from src/i18n/dictionary.ts
 * so the French and English home pages cannot drift structurally apart.
 */
export function HomeView({ lang }: { lang: Lang }) {
  const t = strings(lang);

  return (
    <>
      <section className="hero">
        <div className="panel hero__panel">
          <p className="hero__flag">{t.home.heroFlagline}</p>

          <div className="hero__split">
            {/*
              The prototype's H1 was "Une société à votre écoute." That is brand
              copy with no search value, and the home page has exactly one H1 to
              spend. The head term stays; the display treatment is kept by
              breaking the line and setting the locative half in the accent face.
            */}
            <h1>
              {t.home.h1a}
              <br />
              <span className="accent">{t.home.h1b}</span>
            </h1>

            <div className="hero__aside">
              <p className="lead">{t.home.lead}</p>

              {/*
                Call first, form second. A solo tradesman converts by phone.
                docs/05-conversion-architecture.md sets this order; do not swap it.
              */}
              <div className="hero__actions">
                <a href={`tel:${company.phone}`} className="btn btn--accent" data-action="call">
                  {t.common.callPrefix} {company.phoneDisplay}
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
                <Link href={href('/devis', lang)} className="btn btn--quiet">
                  {t.common.requestQuoteOnline}
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
            <p className="stat__label">{t.home.statQuote}</p>
          </div>
          <div className="stat">
            <p className="stat__figure">{services.length}</p>
            <p className="stat__label">{t.home.statServices}</p>
          </div>
          <div className="stat">
            <p className="stat__figure">{communes.length}</p>
            <p className="stat__label">{t.home.statCommunes}</p>
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
            <p className="placeholder-note">{t.common.illustrativePhotos}</p>
          </div>

          <div>
            <span className="eyebrow">{t.home.aboutEyebrow}</span>
            <h2>
              {t.home.aboutH2a} <span className="accent">{t.home.aboutH2b}</span>
            </h2>

            {/*
              GLVITR'CLEAN is one operator, Thibaut. The prototype said "nos
              experts", "notre équipe" and "nacelle comprise" — a team, and a
              piece of access equipment, neither of which exists in src/data/ or
              in docs/00-business-model.md. docs/05 asks for a named human
              precisely instead of "notre équipe". Inventing either is a rule 4
              violation, so both are gone.
            */}
            <p className="lead">{t.home.aboutLead}</p>

            <ul className="checklist">
              {t.home.aboutChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="actions">
              <Link href={href('/devis', lang)} className="btn btn--primary">
                {t.common.requestQuote}
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link href={href('/professionnels', lang)} className="btn btn--quiet">
                {t.home.aboutB2bLink}
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
              <span className="eyebrow">{t.home.servicesEyebrow}</span>
              <h2>
                {t.home.servicesH2a} <span className="accent">{t.home.servicesH2b}</span>
              </h2>
            </div>
            <p>{t.home.servicesIntro}</p>
          </div>

          <ul className="service-list">
            {services.map((s, i) => (
              <li key={s.slug} className="service-list__item">
                <Link href={href(`/services/${s.slug}`, lang)} className="service-list__link">
                  <span className="service-list__index" aria-hidden="true">
                    ({String(i + 1).padStart(2, '0')})
                  </span>
                  <span>
                    <span className="service-list__name">{s.name[lang]}</span>
                    <span className="service-list__summary">{s.summary[lang]}</span>
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
            <span className="eyebrow">{t.home.stepsEyebrow}</span>
            <h2>
              {t.home.stepsH2a} <span className="accent">{t.home.stepsH2b}</span>
            </h2>
          </div>
          <div className="actions">
            <Link href={href('/devis', lang)} className="btn btn--primary">
              {t.common.contactUs}
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>

        <ol className="card-grid">
          {t.home.steps.map((step, i) => (
            <li className="card" key={step.title}>
              <div className="card__top">
                <span className="card__glyph" aria-hidden="true">
                  ◆
                </span>
                <span className="card__number" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section section--flush-top" id="avantages">
        <div className="panel">
          <div className="section-head">
            <div>
              <span className="eyebrow">{t.home.whyEyebrow}</span>
              <h2>
                {t.home.whyH2a} <span className="accent">{t.home.whyH2b}</span>
              </h2>
            </div>
            <div className="actions">
              <Link href={href('/devis', lang)} className="btn btn--accent">
                {t.common.requestQuote}
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

            The "Services à la Personne" card names the scheme and stops there —
            no figure, in either language. The rate renders only through
            <TaxCreditBadge /> on eligible service pages, so it can still be
            switched off in one edit. CLAUDE.md rule 1.
          */}
          <ul className="card-grid">
            {t.home.whyCards.map((card, i) => (
              <li className="card card--on-brand" key={card.title}>
                <span className="card__badge" aria-hidden="true">
                  {i === 0 ? '✓' : '◆'}
                </span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </li>
            ))}
            <li className="card card--on-brand">
              {/* Real offer, already on the client's flyer. docs/00-business-model.md */}
              <p className="card__figure">{company.referralBonus} €</p>
              <h3>{t.home.referralTitle}</h3>
              <p>
                {company.referralBonus} € {t.home.referralBody}
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
                  {s.name[lang]}
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
            <span className="eyebrow">{t.home.zonesEyebrow}</span>
            <h2>
              {t.home.zonesH2a} <span className="accent">{t.home.zonesH2b}</span>
            </h2>
          </div>
          <p>{t.home.zonesIntro}</p>
        </div>

        <ul className="commune-grid">
          {communes.map((c) => (
            <li key={c.slug}>
              <Link href={href(`/zones/${c.slug}`, lang)}>
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
            <span className="eyebrow">{t.home.contactEyebrow}</span>
            <h2>
              {t.home.contactH2a} <span className="accent">{t.home.contactH2b}</span>
            </h2>
            <p className="lead">{t.home.contactLead}</p>

            <div className="contact-list">
              <div className="contact-list__row">
                <span className="contact-list__label">{t.home.phoneLabel}</span>
                <a
                  className="contact-list__value"
                  href={`tel:${company.phone}`}
                  data-action="call"
                >
                  {company.phoneDisplay}
                </a>
              </div>
              <div className="contact-list__row">
                <span className="contact-list__label">{t.home.emailLabel}</span>
                <a className="contact-list__value" href={`mailto:${company.email}`}>
                  {company.email}
                </a>
              </div>
            </div>

            <div className="actions actions--spaced">
              <WhatsAppButton lang={lang} />
            </div>

            <Image
              src="/assets/placeholder/contact-01.webp"
              alt=""
              width={800}
              height={520}
              className="contact-media"
            />
            <p className="placeholder-note">{t.common.illustrativePhoto}</p>
          </div>

          {/* The existing three-field form. docs/05: never put a long form in
              front of the phone number, so it sits second in the reading order. */}
          <QuoteForm lang={lang} />
        </div>
      </section>
    </>
  );
}
