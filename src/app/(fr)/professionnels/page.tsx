import { routeFor } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { BusinessView } from '@/views/FixedViews';

export const metadata = buildMetadata(routeFor('/professionnels', 'fr'));

export default function Page() {
  return <BusinessView lang="fr" />;
}
