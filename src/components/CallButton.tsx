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

/**
 * The one place a wa.me URL is built. `ChatLauncher` opens the same thread with
 * a draft first line, so the number and the query-string encoding cannot drift
 * between the two entry points.
 */
export function whatsappHref(draft?: string): string {
  const base = `https://wa.me/${company.whatsapp}`;
  return draft ? `${base}?text=${encodeURIComponent(draft)}` : base;
}

export function WhatsAppButton({ lang }: { lang: Lang }) {
  return (
    <a
      href={whatsappHref()}
      className="whatsapp-button"
      rel="noopener noreferrer"
      target="_blank"
      data-action="whatsapp"
    >
      {strings(lang).common.whatsapp}
    </a>
  );
}
