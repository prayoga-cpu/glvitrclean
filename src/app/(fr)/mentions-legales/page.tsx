import { routeFor } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { LegalNoticeView } from '@/views/FixedViews';

export const metadata = buildMetadata(routeFor('/mentions-legales', 'fr'));

export default function Page() {
  return <LegalNoticeView lang="fr" />;
}
