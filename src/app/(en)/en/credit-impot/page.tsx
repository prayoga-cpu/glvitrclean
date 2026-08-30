import { routeFor } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { TaxCreditView } from '@/views/FixedViews';

export const metadata = buildMetadata(routeFor('/credit-impot', 'en'));

export default function Page() {
  return <TaxCreditView lang="en" />;
}
