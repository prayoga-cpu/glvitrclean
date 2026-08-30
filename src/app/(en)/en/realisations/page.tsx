import { routeFor } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { WorkView } from '@/views/FixedViews';

export const metadata = buildMetadata(routeFor('/realisations', 'en'));

export default function Page() {
  return <WorkView lang="en" />;
}
