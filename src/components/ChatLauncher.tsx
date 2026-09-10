import Link from 'next/link';
import { company } from '@/data/company';
import { whatsappHref } from '@/components/CallButton';
import { strings } from '@/i18n/dictionary';
import { href, type Lang } from '@/i18n/config';

/**
 * The chatbox, answered as a static disclosure.
 *
 * The client asked (feedback round 1, §10) whether a chatbox can be added.
 * What ships here is the smallest thing that does the job: a floating bubble
 * that opens a panel offering the three channels `docs/05` already ranks —
 * call, WhatsApp, quote form — with the WhatsApp draft pre-filled.
 *
 * Why not a real chat widget. Crisp, Tawk.to, Intercom and every other hosted
 * widget is a third-party script that sets cookies or localStorage, which
 * CLAUDE.md rule 2 forbids outright and which would force a consent banner
 * this site does not have. It also lands 200 kB+ of JavaScript on a build
 * measured at 97–99 Lighthouse. An AI chatbot needs a server to hold the
 * conversation, and rule 2 pins the site to `output: 'export'`. Both were
 * ruled out on `docs/05`'s own grounds long before the cost: a chat nobody is
 * standing by to answer converts worse than no chat at all.
 *
 * So this is not a chat, and it does not pretend to be one. It never says
 * "we are online", it shows no typing indicator, and it promises no response
 * time — the same reason `footer.responseTime` carries none. It moves the
 * visitor into WhatsApp, where the client already reads messages on the phone
 * he carries to the job.
 *
 * Server component, and it must stay one. There is no `'use client'` here:
 * `<details>` is the disclosure, so the panel and all three links are in the
 * exported HTML of every route and work with JavaScript off. That keeps it out
 * of CLAUDE.md rule 2's list of the only four client components allowed.
 *
 * It also carries the welcome message the client asked for in feedback round 2,
 * item 9 — a greeting bubble above the pill, dismissible without script. See
 * the comment at the markup itself.
 *
 * Placement is CSS, in globals.css: it clears the sticky call bar on mobile,
 * and hides itself while the mobile menu is open, using the `data-scroll`,
 * `data-footer` and `data-nav` attributes that already exist. It never covers
 * the call bar, which stays the primary action.
 */
export function ChatLauncher({ lang }: { lang: Lang }) {
  const t = strings(lang);

  return (
    /*
      The dock is the fixed element; the disclosure and the greeting are its two
      children. All the placement rules in globals.css — the sticky-call-bar
      clearance, the scroll-direction offsets, the mobile-menu hide — were
      already written against `.chat`, and they still are: the class moved from
      the <details> to this wrapper so none of them had to be rewritten.
    */
    <div className="chat">
      <details className="chat__disclosure">
        <summary className="chat__toggle">
          {/* Inline, because rule 6 forbids an icon library. One path, no fill
              rules, currentColor so it inherits the pill's text colour. */}
          <svg
            className="chat__icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="currentColor"
              d="M12 3C6.9 3 3 6.4 3 10.6c0 2.3 1.15 4.35 2.98 5.72V21l3.4-1.86c.84.2 1.72.3 2.62.3 5.1 0 9-3.4 9-7.84S17.1 3 12 3Z"
            />
          </svg>
          {/* Only one of these is ever in the accessibility tree: the other is
              display:none, which removes it. The pill is the close control too,
              because a details panel has nowhere else to put one. */}
          <span className="chat__label chat__label--open">{t.chat.open}</span>
          <span className="chat__label chat__label--close">{t.chat.close}</span>
        </summary>

        <div className="chat__panel">
          <p className="chat__title">{t.chat.title}</p>
          <p className="chat__body">{t.chat.body}</p>

          {/* docs/05 order, unchanged: call, then WhatsApp, then the form. The
              bubble is labelled for writing, but a phone call still converts
              best and the ranking is not reversed inside the panel. */}
          <a
            href={`tel:${company.phone}`}
            className="chat__action chat__action--call"
            data-action="call"
          >
            {t.common.callPrefix} {company.phoneDisplay}
          </a>

          <a
            href={whatsappHref(t.chat.prefill)}
            className="chat__action chat__action--whatsapp"
            rel="noopener noreferrer"
            target="_blank"
            data-action="whatsapp"
          >
            {t.chat.whatsapp}
          </a>

          <Link href={href('/devis', lang)} className="chat__action chat__action--quote">
            {t.common.requestQuote} ›
          </Link>
        </div>
      </details>

      {/*
        The welcome message. Client feedback round 2, item 9: "a small floating
        welcome message that appears to visitors".

        It is a sibling of the disclosure rather than a second floating widget
        of its own, because the corner already has one and two bubbles fighting
        for the same corner is worse than neither. CSS reverses the column, so
        the greeting sits ABOVE the pill while coming after it in source order —
        which keeps the launcher first for the keyboard and lets both "hide the
        greeting" rules be plain sibling selectors instead of `:has()`.

        No JavaScript, and therefore still a server component. It appears on an
        animation delay, it disappears when the panel is opened, and the
        checkbox is the dismiss: `:checked` hides it for the rest of the page.
        Nothing here is content — with CSS off it is a paragraph and a checkbox,
        and with JS off it behaves exactly as it does with JS on.
      */}
      <input
        type="checkbox"
        id="chat-greeting-dismiss"
        className="chat__dismiss"
        aria-label={t.welcome.dismiss}
      />
      <div className="chat__greeting">
        <p className="chat__greeting-text">{t.welcome.message}</p>
        <label htmlFor="chat-greeting-dismiss" className="chat__greeting-close">
          <span aria-hidden="true">×</span>
        </label>
      </div>
    </div>
  );
}
