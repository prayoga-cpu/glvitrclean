import { TAX_CREDIT_RATE, sapVerified, company } from '@/data/company';
import type { Service } from '@/data/services';

/**
 * The single component allowed to display the tax credit.
 *
 * Three states, no more. Do not add an override prop. Do not add a `force`
 * flag. Do not render the percentage anywhere else in the codebase.
 *
 *   hidden   service is not eligible                     -> null
 *   pending  eligible, but no SAP number confirmed        -> explains the scheme
 *   live     eligible and SAP number present              -> full claim + maths
 *
 * See docs/04-compliance-sap.md before touching this file.
 */
export function TaxCreditBadge({
  service,
  basePriceEur,
}: {
  service: Service;
  basePriceEur?: number | null;
}) {
  // State 1: hidden. Facade, bins, and anything B2B.
  if (!service.taxCreditEligible) return null;

  const pct = Math.round(TAX_CREDIT_RATE * 100);

  // State 2: pending. Describes the scheme without claiming registration.
  if (!sapVerified) {
    return (
      <aside className="tax-credit tax-credit--pending" data-state="pending">
        <p>
          Cette prestation entre dans le champ des Services à la Personne, qui
          ouvre droit à un crédit d&apos;impôt de {pct} % pour les particuliers.
        </p>
        <p className="tax-credit__note">
          {/* Deliberate wording: no "vous bénéficiez de". Nothing is promised
              until the cooperative's declaration number is confirmed. */}
          Les conditions et le numéro de déclaration de l&apos;organisme
          prestataire vous sont communiqués avec le devis.
        </p>
      </aside>
    );
  }

  // State 3: live. Only reachable once company.sapDeclaration.number is set.
  const after =
    typeof basePriceEur === 'number'
      ? Math.round(basePriceEur * (1 - TAX_CREDIT_RATE))
      : null;

  return (
    <aside className="tax-credit tax-credit--live" data-state="live">
      <p>
        <strong>{pct} % de crédit d&apos;impôt</strong> pour les particuliers.
      </p>
      {after !== null && basePriceEur !== null && basePriceEur !== undefined && (
        <p className="tax-credit__maths">
          {basePriceEur} € <span aria-hidden="true">→</span>{' '}
          <strong>{after} €</strong> après crédit d&apos;impôt
        </p>
      )}
      <p className="tax-credit__note">
        Prestation facturée par {company.sapDeclaration.holder}, déclaré sous le
        numéro {company.sapDeclaration.number}.
      </p>
    </aside>
  );
}
