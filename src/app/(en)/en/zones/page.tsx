import { routeFor } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { ZonesHubView } from '@/views/FixedViews';

export const metadata = buildMetadata(routeFor('/zones', 'en'));

export default function Page() {
  return <ZonesHubView lang="en" />;
}
