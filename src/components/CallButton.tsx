import { company } from '@/data/company';
import { strings } from '@/i18n/dictionary';
import type { Lang } from '@/i18n/config';

/**
 * Primary conversion action. A solo tradesman converts by phone, not by form.
 * This must stay above any form on every page. See docs/05-conversion-architecture.md.
 */
export function CallButton({ lang, sticky = false }: { lang: Lang; sticky?: boolean }) {
  return (
    <a
      href={`tel:${company.phone}`}
      className={sticky ? 'call-button call-button--sticky' : 'call-button'}
      data-action="call"
    >
      {strings(lang).common.callPrefix} {company.phoneDisplay}
    </a>
  );
}

export function WhatsAppButton({ lang }: { lang: Lang }) {
  return (
    <a
      href={`https://wa.me/${company.whatsapp}`}
      className="whatsapp-button"
      rel="noopener noreferrer"
      target="_blank"
      data-action="whatsapp"
    >
      {strings(lang).common.whatsapp}
    </a>
  );
}
