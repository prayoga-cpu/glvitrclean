import { company } from '@/data/company';

/**
 * Primary conversion action. A solo tradesman converts by phone, not by form.
 * This must stay above any form on every page. See docs/05-conversion-architecture.md.
 */
export function CallButton({ sticky = false }: { sticky?: boolean }) {
  return (
    <a
      href={`tel:${company.phone}`}
      className={sticky ? 'call-button call-button--sticky' : 'call-button'}
      data-action="call"
    >
      Appeler le {company.phoneDisplay}
    </a>
  );
}

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${company.whatsapp}`}
      className="whatsapp-button"
      rel="noopener noreferrer"
      target="_blank"
      data-action="whatsapp"
    >
      Envoyer une photo par WhatsApp
    </a>
  );
}
