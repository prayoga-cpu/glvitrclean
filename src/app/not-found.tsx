import Link from 'next/link';
import './globals.css';
import Image from 'next/image';
import { company } from '@/data/company';
import { strings } from '@/i18n/dictionary';
import { href } from '@/i18n/config';

/**
 * The global 404.
 *
 * Three things about this file are load-bearing; none of them are obvious.
 *
 *  1. It must live at `src/app/not-found.tsx`, NOT inside a route group. A
 *     `not-found.tsx` scoped to `(fr)/` only serves `notFound()` calls made
 *     within that group — the static export ignores it and ships Next's bare
 *     built-in error page as 404.html. That is exactly what shipped while this
 *     file lived at `(fr)/not-found.tsx`: out/404.html had no chrome, no
 *     stylesheet and no French. Verify after any change with:
 *
 *         grep -o '<main[^>]*>' out/404.html
 *
 *  2. It returns a FRAGMENT, not a document. Sitting above both route groups it
 *     has no root layout — there are two, `(fr)/` and `(en)/`, and neither
 *     covers this path — so Next injects its own <html><head><body> shell. If
 *     this component renders its own <html>/<body> they end up NESTED inside
 *     that shell, which is invalid markup the browser silently discards. The
 *     `import './globals.css'` still gets the stylesheet into that shell.
 *
 *  3. Because Next owns the <html>, this page cannot set a document `lang`.
 *     That is acceptable here and nowhere else: the export emits exactly ONE
 *     404.html which the host serves for any unmatched path, /en included, so
 *     there is no single correct document language. Each block is marked with
 *     its own `lang` instead, which is the correct way to express mixed-language
 *     content anyway.
 *
 * It deliberately does NOT render <SiteHeader />: that pulls in <LangToggle />,
 * whose usePathname() resolves to `/_not-found` during prerender and would bake
 * a dead `/en/_not-found/` link into the page.
 */
export default function NotFound() {
  const fr = strings('fr');
  const en = strings('en');

  return (
    <main className="container not-found">
      <Link href="/" aria-label={`${company.displayName} — ${fr.common.homeLabel}`}>
        <Image
          src="/assets/brand/logo.webp"
          alt={company.displayName}
          width={441}
          height={512}
          className="brand__lockup brand__lockup--header"
        />
      </Link>

      <div lang="fr">
        <h1>{fr.notFound.h1}</h1>
        <p>
          {fr.notFound.body} <Link href={href('/', 'fr')}>{fr.notFound.backHome}</Link>
        </p>
      </div>

      <hr className="not-found__rule" />

      <p lang="en">
        <strong>{en.notFound.h1}.</strong> {en.notFound.body}{' '}
        <Link href={href('/', 'en')} hrefLang="en">
          {en.notFound.backHome}
        </Link>
      </p>

      <p className="not-found__call">
        <a href={`tel:${company.phone}`} className="btn btn--primary" data-action="call">
          {fr.common.callPrefix} {company.phoneDisplay}
        </a>
      </p>
    </main>
  );
}
