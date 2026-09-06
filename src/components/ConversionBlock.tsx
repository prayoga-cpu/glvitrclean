import Link from 'next/link';
import { CallButton, WhatsAppButton } from '@/components/CallButton';
import { strings } from '@/i18n/dictionary';
import { href, type Lang } from '@/i18n/config';

/**
 * The conversion action set, in the one order docs/05-conversion-architecture.md
 * allows: call, then WhatsApp, then the quote form.
 *
 * It exists because the order kept being re-derived per page, and three of the
 * highest-intent route types — /credit-impot, the six service pages and the 12
 * commune hubs — ended up with no in-content action at all. The global chrome
 * linking to /devis is not the same thing: a visitor who has just read why a
 * service qualifies should not have to go looking for the header.
 *
 * Server component. Do not add 'use client' — CLAUDE.md rule 2 lists the only
 * four components allowed to have it, and this is not one of them.
 */
export function ConversionBlock({ lang }: { lang: Lang }) {
  const t = strings(lang);
  return (
    <div className="actions conversion-block">
      <CallButton lang={lang} />
      <WhatsAppButton lang={lang} />
      <Link href={href('/devis', lang)} className="btn btn--quiet">
        {t.common.freeQuote} ›
      </Link>
    </div>
  );
}
