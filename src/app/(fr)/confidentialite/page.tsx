import { allRoutes } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';

const route = allRoutes().find((r) => r.path === '/confidentialite')!;
export const metadata = buildMetadata(route);

export default function ConfidentialitePage() {
  return (
    <>
      <h1>Politique de confidentialité</h1>
      {/* TODO(claude): RGPD notice for the quote form only. What is collected, why, how long it is kept, and how to request deletion. There is no analytics script in v1, so there is nothing else to declare. */}
    </>
  );
}
