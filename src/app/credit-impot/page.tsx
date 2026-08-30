import { allRoutes } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { faqForPage } from '@/data/faq';
import { faqSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Faq } from '@/components/Faq';
import { services } from '@/data/services';
import { sapVerified, company, TAX_CREDIT_ANNUAL_CAP } from '@/data/company';

const route = allRoutes().find((r) => r.path === '/credit-impot')!;
export const metadata = buildMetadata(route);

export default function CreditImpotPage() {
  const entries = faqForPage('credit-impot');

  return (
    <>
      <JsonLd data={faqSchema(entries)} />

      <h1>Le crédit d&apos;impôt de 50 % sur le nettoyage à domicile</h1>

      {/* TODO(claude): explain the scheme. Distinguish the deferred credit
          (form 2042-RICI, case 7DB, refunded the following year) from the
          avance immédiate (URSSAF pays the provider directly, customer pays
          only the remainder). Conflating the two is the most common error on
          competitor sites. See docs/04-compliance-sap.md. */}

      <section>
        <h2>Quelles prestations y ouvrent droit</h2>
        {/* This table is the trust play. Every competitor stays vague about
            the exclusions. Stating them plainly wins the snippet. */}
        <table>
          <thead>
            <tr>
              <th>Prestation</th>
              <th>Crédit d&apos;impôt</th>
              <th>Pourquoi</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.slug}>
                <td>{s.name}</td>
                <td>{s.taxCreditEligible ? 'Oui' : 'Non'}</td>
                <td>{s.eligibilityNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p>
        Plafond : {TAX_CREDIT_ANNUAL_CAP} € de dépenses par an et par foyer
        fiscal, tous services à la personne confondus.
      </p>

      {sapVerified ? (
        <p>
          Prestations facturées par {company.sapDeclaration.holder}, déclaré
          sous le numéro {company.sapDeclaration.number}.
        </p>
      ) : (
        /* Pending mode. Do not replace with a claim. See CLAUDE.md rule 1. */
        <p>
          Le numéro de déclaration de l&apos;organisme prestataire vous est
          communiqué avec le devis.
        </p>
      )}

      <Faq entries={entries} />
    </>
  );
}
