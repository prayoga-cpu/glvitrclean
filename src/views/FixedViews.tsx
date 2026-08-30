import Link from 'next/link';
import { faqForPage } from '@/data/faq';
import { faqSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Faq } from '@/components/Faq';
import { QuoteForm } from '@/components/QuoteForm';
import { CallButton, WhatsAppButton } from '@/components/CallButton';
import { services, b2bServices } from '@/data/services';
import { sapVerified, company, TAX_CREDIT_ANNUAL_CAP } from '@/data/company';
import { strings } from '@/i18n/dictionary';
import { href, type Lang } from '@/i18n/config';

export function TaxCreditView({ lang }: { lang: Lang }) {
  const t = strings(lang);
  const entries = faqForPage('credit-impot');

  return (
    <>
      <JsonLd data={faqSchema(entries, lang)} />

      <h1>{t.taxCreditPage.h1}</h1>

      {/* TODO(claude): explain the scheme. Distinguish the deferred credit
          (form 2042-RICI, case 7DB, refunded the following year) from the
          avance immédiate (URSSAF pays the provider directly, customer pays
          only the remainder). Conflating the two is the most common error on
          competitor sites. See docs/04-compliance-sap.md. */}

      <section>
        <h2>{t.taxCreditPage.tableHeading}</h2>
        {/* This table is the trust play. Every competitor stays vague about
            the exclusions. Stating them plainly wins the snippet. */}
        <table>
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

      <Faq entries={entries} lang={lang} />
    </>
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
    <>
      <h1>{t.b2b.h1}</h1>

      {/* TODO(claude): B2B copy. Vitrines, bureaux, façades, conteneurs.
          Sell reliability, scheduling, and a named contact. Do not sell price.
          Never mention the tax credit. */}

      <section>
        <h2>{t.b2b.interventions}</h2>
        <ul>
          {b2bServices.map((s) => (
            <li key={s.slug}>
              <strong>{s.name[lang]}</strong>
              <p>{s.summary[lang]}</p>
            </li>
          ))}
        </ul>
      </section>

      <CallButton lang={lang} />
    </>
  );
}

export function QuoteView({ lang }: { lang: Lang }) {
  const t = strings(lang);

  return (
    <>
      <h1>{t.quote.h1}</h1>

      {/* Call first, WhatsApp second, form third. Do not reorder.
          See docs/05-conversion-architecture.md. */}
      <CallButton lang={lang} />
      <WhatsAppButton lang={lang} />

      <QuoteForm lang={lang} />
    </>
  );
}

export function WorkView({ lang }: { lang: Lang }) {
  return (
    <>
      <h1>{strings(lang).work.h1}</h1>
      {/* TODO(claude): gallery. Real photos only, from the client's Drive folder.
          Placeholder images live in public/assets/placeholder/ and must be
          visibly marked. Never invent a photo or a location. */}
    </>
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
    <>
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
    </>
  );
}

export function PrivacyView({ lang }: { lang: Lang }) {
  const t = strings(lang);

  return (
    <>
      <h1>{t.legal.privacyH1}</h1>
      <CourtesyNote lang={lang} />
      {/* TODO(claude): RGPD notice for the quote form only. What is collected,
          why, how long it is kept, and how to request deletion. There is no
          analytics script in v1, so there is nothing else to declare. */}
    </>
  );
}

export function NotFoundView({ lang }: { lang: Lang }) {
  const t = strings(lang);

  return (
    <>
      <h1>{t.notFound.h1}</h1>
      <p>
        {t.notFound.body} <Link href={href('/', lang)}>{t.notFound.backHome}</Link>
      </p>
    </>
  );
}
