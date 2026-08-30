import { routeFor } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { HomeView } from '@/views/HomeView';

export const metadata = buildMetadata(routeFor('/', 'en'));

export default function HomePage() {
  return <HomeView lang="en" />;
}
