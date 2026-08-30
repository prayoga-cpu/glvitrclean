import { routeFor } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { BusinessView } from '@/views/FixedViews';

export const metadata = buildMetadata(routeFor('/professionnels', 'en'));

export default function Page() {
  return <BusinessView lang="en" />;
}
