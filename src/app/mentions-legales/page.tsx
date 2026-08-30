import { allRoutes } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { company } from '@/data/company';

const route = allRoutes().find((r) => r.path === '/mentions-legales')!;
export const metadata = buildMetadata(route);

export default function MentionsLegalesPage() {
  return (
    <>
      <h1>Mentions légales</h1>

      {/* Required by LCEN art. 6-III. The current live site has none.
          TODO(human): RC Pro insurer, policy number, and the cooperative's
          details. See docs/08-non-code-checklist.md. */}

      <h2>Éditeur</h2>
      <p>
        {company.legalName}
        <br />
        SIRET : {company.siret}
        <br />
        {company.address.locality} ({company.address.postalCode}),{' '}
        {company.address.region}, France
        <br />
        Téléphone : {company.phoneDisplay}
        <br />
        E-mail : {company.email}
      </p>

      <h2>Hébergeur</h2>
      {/* TODO(human): fill once hosting is decided. */}
      <p>À compléter.</p>

      <h2>Assurance responsabilité civile professionnelle</h2>
      <p>À compléter.</p>
    </>
  );
}
