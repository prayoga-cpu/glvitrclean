import { routeFor } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { PrivacyView } from '@/views/FixedViews';

export const metadata = buildMetadata(routeFor('/confidentialite', 'fr'));

export default function Page() {
  return <PrivacyView lang="fr" />;
}
