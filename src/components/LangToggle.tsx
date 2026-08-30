'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { basePathOf, href, otherLang, LANG_LABEL, LANG_NAME, type Lang } from '@/i18n/config';
import { strings } from '@/i18n/dictionary';

/**
 * The third — and last — allowed client component. Justified in STATUS.md
 * under 2026-08-31, per CLAUDE.md rule 2.
 *
 * Why it needs the client boundary: the header lives in the root layout, and a
 * layout cannot know which page is rendering inside it. `usePathname()` is the
 * only way to point the toggle at the CURRENT page's counterpart rather than
 * dumping every visitor on the other language's home page.
 *
 * Why that does not break rule 2 ("complete HTML before JavaScript runs"): the
 * export prerenders every route individually, so `usePathname()` resolves at
 * build time and the correct href is baked into each of the 194 HTML files.
 * Nothing here appears only after hydration. If that ever stops being true the
 * `?? fallbackBase` below degrades to the other language's home page rather
 * than to a dead link — verify with:
 *
 *   grep -o 'hreflang="en"[^>]*' out/zones/linas/vitres/index.html
 */
export function LangToggle({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const target = otherLang(lang);
  const base = pathname ? basePathOf(pathname) : '/';

  return (
    <Link
      href={href(base, target)}
      className="lang-toggle"
      hrefLang={target}
      lang={target}
      aria-label={`${strings(lang).common.switchLanguage} — ${LANG_NAME[target]}`}
      data-action="lang"
    >
      {LANG_LABEL[target]}
    </Link>
  );
}
