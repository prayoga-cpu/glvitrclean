import { TAX_CREDIT_RATE, sapVerified, company } from '@/data/company';
import type { Service } from '@/data/services';
import { strings } from '@/i18n/dictionary';
import type { Lang } from '@/i18n/config';

/**
 * The single component allowed to display the tax credit, in either language.
 *
 * Three states, no more. Do not add an override prop. Do not add a `force`
 * flag. Do not render the percentage anywhere else in the codebase. The English
 * edition gets NO extra state and no softer wording: `taxCreditEligible` is the
 * only input that decides visibility, exactly as in French.
 *
 *   hidden   service is not eligible                     -> null
 *   pending  eligible, but no SAP number confirmed        -> explains the scheme
 *   live     eligible and SAP number present              -> full claim + maths
 *
 * See docs/04-compliance-sap.md before touching this file.
 */
export function TaxCreditBadge({
  service,
  lang,
  basePriceEur,
}: {
  service: Service;
  lang: Lang;
  basePriceEur?: number | null;
}) {
  // State 1: hidden. Facade, bins, and anything B2B.
  if (!service.taxCreditEligible) return null;

  const t = strings(lang).taxCreditBadge;
  const pct = Math.round(TAX_CREDIT_RATE * 100);

  // State 2: pending. Describes the scheme without claiming registration.
  if (!sapVerified) {
    return (
      <aside className="tax-credit tax-credit--pending" data-state="pending">
        {/* Deliberate wording in both languages: no "vous bénéficiez de", no
            "you benefit from". Nothing is promised until the cooperative's
            declaration number is confirmed. */}
        <p>{t.pending(pct)}</p>
        <p className="tax-credit__note">{t.pendingNote}</p>
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
        <strong>{t.live(pct)}</strong>
      </p>
      {after !== null && basePriceEur !== null && basePriceEur !== undefined && (
        <p className="tax-credit__maths">
          {basePriceEur} € <span aria-hidden="true">→</span> <strong>{after} €</strong>{' '}
          {t.liveAfter}
        </p>
      )}
      <p className="tax-credit__note">
        {t.liveNote(company.sapDeclaration.holder ?? '', company.sapDeclaration.number ?? '')}
      </p>
    </aside>
  );
}
