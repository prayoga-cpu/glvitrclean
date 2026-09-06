import { routeFor } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { ServicesHubView } from '@/views/FixedViews';

export const metadata = buildMetadata(routeFor('/services', 'fr'));

export default function Page() {
  return <ServicesHubView lang="fr" />;
}
