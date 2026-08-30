import { allRoutes } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { QuoteForm } from '@/components/QuoteForm';
import { CallButton, WhatsAppButton } from '@/components/CallButton';

const route = allRoutes().find((r) => r.path === '/devis')!;
export const metadata = buildMetadata(route);

export default function DevisPage() {
  return (
    <>
      <h1>Demander un devis gratuit</h1>

      {/* Call first, WhatsApp second, form third. Do not reorder.
          See docs/05-conversion-architecture.md. */}
      <CallButton />
      <WhatsAppButton />

      <QuoteForm />
    </>
  );
}
