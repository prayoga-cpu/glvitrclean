import { routeFor } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { QuoteView } from '@/views/FixedViews';

export const metadata = buildMetadata(routeFor('/devis', 'fr'));

export default function Page() {
  return <QuoteView lang="fr" />;
}
