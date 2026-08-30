import { allRoutes } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { b2bServices } from '@/data/services';
import { CallButton } from '@/components/CallButton';

const route = allRoutes().find((r) => r.path === '/professionnels')!;
export const metadata = buildMetadata(route);

/**
 * B2B page.
 *
 * HARD RULE: no mention of the tax credit, the 50% figure, the avance
 * immédiate, or URSSAF anywhere on this page. Not even as a negative.
 * <TaxCreditBadge /> must never be imported here. See CLAUDE.md rule 1.
 */
export default function ProfessionnelsPage() {
  return (
    <>
      <h1>Nettoyage pour professionnels en Essonne</h1>

      {/* TODO(claude): B2B copy. Vitrines, bureaux, façades, conteneurs.
          Sell reliability, scheduling, and a named contact. Do not sell price.
          Never mention the tax credit. */}

      <section>
        <h2>Nos interventions</h2>
        <ul>
          {b2bServices.map((s) => (
            <li key={s.slug}>
              <strong>{s.name}</strong>
              <p>{s.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <CallButton />
    </>
  );
}
