import { allRoutes } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';

const route = allRoutes().find((r) => r.path === '/realisations')!;
export const metadata = buildMetadata(route);

export default function RealisationsPage() {
  return (
    <>
      <h1>Nos réalisations</h1>
      {/* TODO(claude): gallery. Real photos only, from the client's Drive folder. Placeholder images live in public/assets/placeholder/ and must be visibly marked. Never invent a photo or a location. */}
    </>
  );
}
