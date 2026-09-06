import Link from 'next/link';
import { faqForPage } from '@/data/faq';
import { faqSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Faq } from '@/components/Faq';
import { QuoteForm } from '@/components/QuoteForm';
import { CallButton, WhatsAppButton } from '@/components/CallButton';
import { ConversionBlock } from '@/components/ConversionBlock';
import { services, b2bServices } from '@/data/services';
import { communes } from '@/data/communes';
import {
  sapVerified,
  company,
  TAX_CREDIT_ANNUAL_CAP,
  TAX_CREDIT_PCT,
} from '@/data/company';
import { strings } from '@/i18n/dictionary';
import { href, type Lang } from '@/i18n/config';

export function TaxCreditView({ lang }: { lang: Lang }) {
  const t = strings(lang);
  const entries = faqForPage('credit-impot');

  return (
    <div className="page">
      <JsonLd data={faqSchema(entries, lang)} />

      <h1>{t.taxCreditPage.h1(TAX_CREDIT_PCT)}</h1>

      {/* TODO(claude): explain the scheme. Distinguish the deferred credit
          (form 2042-RICI, case 7DB, refunded the following year) from the
          avance immédiate (URSSAF pays the provider directly, customer pays
          only the remainder). Conflating the two is the most common error on
          competitor sites. See docs/04-compliance-sap.md. */}

      <section>
        <h2>{t.taxCreditPage.tableHeading}</h2>
        {/* This table is the trust play. Every competitor stays vague about
            the exclusions. Stating them plainly wins the snippet.
            The wrapper lets it scroll itself on a phone instead of forcing the
            whole page sideways. */}
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.taxCreditPage.colService}</th>
                <th>{t.taxCreditPage.colEligible}</th>
                <th>{t.taxCreditPage.colWhy}</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.slug}>
                  <td>{s.name[lang]}</td>
                  <td>{s.taxCreditEligible ? t.taxCreditPage.yes : t.taxCreditPage.no}</td>
                  <td>{s.eligibilityNote[lang]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p>{t.taxCreditPage.cap(String(TAX_CREDIT_ANNUAL_CAP))}</p>

      {sapVerified ? (
        <p>
          {t.taxCreditPage.billedBy(
            company.sapDeclaration.holder ?? '',
            company.sapDeclaration.number ?? '',
          )}
        </p>
      ) : (
        /* Pending mode. Do not replace with a claim, in either language.
           See CLAUDE.md rule 1. */
        <p>{t.taxCreditPage.pending}</p>
      )}

      {/* The pillar page ranks for research intent and had no action in
          <main> at all: the only way on was the header. docs/05. */}
      <ConversionBlock lang={lang} />

      <Faq entries={entries} lang={lang} />
    </div>
  );
}

/**
 * B2B page.
 *
 * HARD RULE: no mention of the tax credit, the 50% figure, the avance
 * immédiate, or URSSAF anywhere on this page, in EITHER language. Not even as
 * a negative. <TaxCreditBadge /> must never be imported here. The English
 * edition at /en/professionnels/ is checked by the same guard as the French
 * one. See CLAUDE.md rule 1.
 */
export function BusinessView({ lang }: { lang: Lang }) {
  const t = strings(lang);

  return (
    <div className="page">
      <h1>{t.b2b.h1}</h1>

      {/* Nothing here may mention the tax credit, the rate, the avance
          immédiate or URSSAF, in either language — not even to say it does
          not apply. CLAUDE.md rule 1; scripts/check-compliance.mjs enforces
          it on both /professionnels and /en/professionnels. */}
      <p className="lead">{t.b2b.intro}</p>

      <section>
        <h2>{t.b2b.interventions}</h2>
        <ul className="service-notes">
          {b2bServices.map((s) => (
            <li key={s.slug}>
              <strong>{s.name[lang]}</strong>
              <p>{s.summary[lang]}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t.b2b.whyH2}</h2>
        <ul className="checklist">
          {t.b2b.why.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t.b2b.contactH2}</h2>
        <p>{t.b2b.contactBody(company.operator)}</p>
      </section>

      {/* Call, WhatsApp, quote — same order as everywhere else. Note this is
          the plain block: no tax-credit copy is reachable from it. */}
      <ConversionBlock lang={lang} />
    </div>
  );
}

export function QuoteView({ lang }: { lang: Lang }) {
  const t = strings(lang);

  return (
    <div className="page">
      <h1>{t.quote.h1}</h1>

      {/* Call first, WhatsApp second, form third. Do not reorder.
          See docs/05-conversion-architecture.md. The two buttons need a flex
          row of their own — as bare siblings they sat flush against each
          other and against the form card below. */}
      <div className="actions">
        <CallButton lang={lang} />
        <WhatsAppButton lang={lang} />
      </div>

      <QuoteForm lang={lang} />
    </div>
  );
}

/**
 * /realisations.
 *
 * There is no gallery because there are no photographs: the client's archive
 * is STATUS.md item 6 and still outstanding. Rather than leave an indexable,
 * sitewide-linked page with nothing but an H1 — or dress it with stock images
 * pretending to be this business's work, which CLAUDE.md rule 4 forbids — the
 * page says what each job covers and states plainly that the photographs are
 * coming. Swap in the real before/after pairs in phase 5.
 */
export function WorkView({ lang }: { lang: Lang }) {
  const t = strings(lang);

  return (
    <div className="page">
      <h1>{t.work.h1}</h1>
      <p className="lead">{t.work.intro}</p>

      <section>
        <h2>{t.work.whatH2}</h2>
        <ul className="service-notes">
          {services.map((s) => (
            <li key={s.slug}>
              <strong>{s.name[lang]}</strong>
              <p>{s.summary[lang]}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t.work.photosPendingH2}</h2>
        <p>{t.work.photosPending}</p>
      </section>

      <ConversionBlock lang={lang} />
    </div>
  );
}

/**
 * The English legal pages carry a line saying the French version prevails.
 * That is not boilerplate politeness: `legal.courtesyTranslation` is empty on
 * the French side, so the note renders only under /en/. Confirming the actual
 * wording with the client's accountant is human-only work — CLAUDE.md rule 7,
 * tracked in STATUS.md.
 */
function CourtesyNote({ lang }: { lang: Lang }) {
  const note = strings(lang).legal.courtesyTranslation;
  if (!note) return null;
  return <p className="legal-note">{note}</p>;
}

export function LegalNoticeView({ lang }: { lang: Lang }) {
  const t = strings(lang);

  return (
    <div className="page">
      <h1>{t.legal.noticeH1}</h1>
      <CourtesyNote lang={lang} />

      {/* Required by LCEN art. 6-III. The current live site has none.
          TODO(human): RC Pro insurer, policy number, and the cooperative's
          details. See docs/08-non-code-checklist.md. */}

      <h2>{t.legal.publisher}</h2>
      <p>
        {company.legalName}
        <br />
        {t.legal.siret} : {company.siret}
        <br />
        {company.address.locality} ({company.address.postalCode}), {company.address.region}, France
        <br />
        {t.legal.phone} : {company.phoneDisplay}
        <br />
        {t.legal.email} : {company.email}
      </p>

      <h2>{t.legal.host}</h2>
      {/* TODO(human): fill once hosting is decided. */}
      <p>{t.legal.toComplete}</p>

      <h2>{t.legal.insurance}</h2>
      <p>{t.legal.toComplete}</p>
    </div>
  );
}

export function PrivacyView({ lang }: { lang: Lang }) {
  const t = strings(lang);
  const p = t.legal.privacy;

  /* RGPD Art. 13. The quote form is the only collection point on the site:
     no analytics, no cookie, no database (CLAUDE.md rule 2), so the notice
     describes the form and says plainly that there is nothing else.

     Two facts are still the client's to supply — the retention period and the
     identity of the form processor. Rather than inventing either, the two
     paragraphs state that the answer will appear here before the form goes
     live, which is true and is not a claim. STATUS.md items 18 and 19. */
  return (
    <div className="page">
      <h1>{t.legal.privacyH1}</h1>
      <CourtesyNote lang={lang} />

      <h2>{p.controllerH2}</h2>
      <p>{p.controllerBody(company.legalName, company.email)}</p>

      <h2>{p.collectedH2}</h2>
      <p>{p.collectedIntro}</p>
      <ul className="plain-list">
        {p.collectedItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>{p.purposeH2}</h2>
      <p>{p.purposeBody}</p>

      <h2>{p.basisH2}</h2>
      <p>{p.basisBody}</p>

      <h2>{p.recipientsH2}</h2>
      <p>{p.recipientsBody}</p>

      <h2>{p.retentionH2}</h2>
      <p>{p.retentionBody}</p>

      <h2>{p.rightsH2}</h2>
      <p>{p.rightsIntro}</p>
      <ul className="plain-list">
        {p.rightsItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>{p.rightsHow(company.email)}</p>
      <p>{p.cnil}</p>

      <h2>{p.cookiesH2}</h2>
      <p>{p.cookiesBody}</p>
    </div>
  );
}

/**
 * /services — the service hub.
 *
 * Exists because ROADMAP phase 6 names it as the 301 target for the old site's
 * /services-1/, and because "entreprise de nettoyage Essonne" has no other
 * home: the six service pages each target one service, and the home page
 * targets the brand plus the two head services.
 */
export function ServicesHubView({ lang }: { lang: Lang }) {
  const t = strings(lang);

  return (
    <div className="page">
      <h1>{t.hubs.servicesH1}</h1>
      <p className="lead">{t.hubs.servicesIntro}</p>

      <ul className="service-notes">
        {services.map((s) => (
          <li key={s.slug}>
            <Link href={href(`/services/${s.slug}`, lang)}>
              <strong>{s.name[lang]}</strong>
            </Link>
            <p>{s.summary[lang]}</p>
          </li>
        ))}
      </ul>

      <ConversionBlock lang={lang} />
    </div>
  );
}

/**
 * /zones — the commune hub. The counterpart of ServicesHubView, and the parent
 * every /zones/[commune] breadcrumb previously pointed past.
 */
export function ZonesHubView({ lang }: { lang: Lang }) {
  const t = strings(lang);

  return (
    <div className="page">
      <h1>{t.hubs.zonesH1}</h1>
      <p className="lead">{t.hubs.zonesIntro}</p>

      <section>
        <h2>{t.hubs.zonesListH2}</h2>
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

      <ConversionBlock lang={lang} />
    </div>
  );
}
