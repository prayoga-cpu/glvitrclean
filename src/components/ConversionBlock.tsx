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
 *
 * ROADMAP phase 8e changed two things.
 *
 * It is no longer rendered once per page. Every long template put exactly one
 * of these at the bottom, so a visitor who left at 40% scroll — most of them —
 * saw no in-content action at all. Mr Sparkle places a call/quote pair after
 * almost every section; the templates now place two or three.
 *
 * And it can carry the photo-quote line, via `photoNote`. Only the FIRST block
 * on a page should set it: repeated three times down a page it reads as filler
 * rather than as an offer.
 */
export function ConversionBlock({
  lang,
  photoNote = false,
}: {
  lang: Lang;
  /** Show the "send a photo" line under the buttons. First block only. */
  photoNote?: boolean;
}) {
  const t = strings(lang);
  return (
    <div className="conversion-block">
      <div className="actions">
        <CallButton lang={lang} />
        <WhatsAppButton lang={lang} />
        <Link href={href('/devis', lang)} className="btn btn--quiet">
          {t.common.freeQuote} ›
        </Link>
      </div>

      {/* The photo route is already real — `common.whatsapp` labels the button
          "send a photo" and ChatLauncher drafts the first line — but it was
          only ever stated in prose, on two of seven service pages. No response
          time here: that is a client commitment, not ours to invent. */}
      {photoNote && <p className="conversion-block__note">{t.common.photoQuote}</p>}
    </div>
  );
}
