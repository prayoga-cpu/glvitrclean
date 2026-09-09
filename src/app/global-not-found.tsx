import Link from 'next/link';
import './globals.css';
import Image from 'next/image';
import { company } from '@/data/company';
import { brand } from '@/data/brand';
import { strings } from '@/i18n/dictionary';
import { href } from '@/i18n/config';
import { DEFAULT_LANG, HTML_LANG } from '@/i18n/config';

/**
 * The global 404.
 *
 * Why this file exists at all, and why it is `global-not-found.tsx` rather than
 * the `not-found.tsx` it replaced:
 *
 * A `not-found.tsx` at the app root needs a root layout to render, and this app
 * deliberately has none — there are two, `(fr)/layout.tsx` and `(en)/layout.tsx`,
 * because only a root layout may emit <html> and `<html lang>` has to differ
 * between the editions. Next injects a synthetic layout for the /_not-found
 * route ONLY when the app has no not-found file of its own, so writing one put
 * the route into a state Next cannot compile: `next dev` answered 500 for every
 * app-root entry — the 404 itself, /sitemap.xml, /robots.txt and
 * /manifest.webmanifest — with "not-found.tsx doesn't have a root layout".
 * `next build` happened to survive it, so it shipped unnoticed.
 *
 * `global-not-found` is the convention for exactly this case. It renders its
 * OWN <html> and <body> instead of inheriting a layout, which is what a 404
 * that belongs to neither edition needs. It requires
 * `experimental.globalNotFound` in next.config.mjs — see the note there.
 *
 * Two things carried over from the file it replaces and are still load-bearing:
 *
 *  1. It returns ONE <html>. Do not also keep a `src/app/not-found.tsx`: the
 *     two would fight over the same route.
 *
 *  2. `<html lang>` is French. The export emits exactly ONE 404.html, which the
 *     host serves for any unmatched path, /en included, so there is no single
 *     correct document language — French wins because it is the x-default
 *     edition. Each block below then carries its own `lang`, which is the
 *     correct way to express mixed-language content anyway. Before this file
 *     existed, Next's injected shell emitted `<html>` with no `lang` at all.
 *
 * It deliberately does NOT render <SiteHeader />: that pulls in <LangToggle />,
 * whose usePathname() resolves to `/_not-found` during prerender and would bake
 * a dead `/en/_not-found/` link into the page.
 *
 * Verify after any change:
 *     grep -c '<html' out/404.html      # exactly 1
 *     grep -o '<main[^>]*>' out/404.html
 */
export default function GlobalNotFound() {
  const fr = strings('fr');
  const en = strings('en');

  return (
    <html lang={HTML_LANG[DEFAULT_LANG]}>
      <body>
        {/* Next reads a `metadata` export from layout.tsx and page.tsx only,
            never from a not-found file, so the title is rendered directly.
            React 19 hoists it into <head>. Without it out/404.html ships
            untitled. */}
        <title>{`${fr.notFound.h1} · ${en.notFound.h1} | ${company.displayName}`}</title>

        <main className="container not-found">
          <Link href="/" aria-label={`${company.displayName} — ${fr.common.homeLabel}`}>
            <Image
              src={brand.mark.src}
              alt={company.displayName}
              width={brand.mark.width}
              height={brand.mark.height}
              className="brand__mark"
            />
          </Link>

          <div lang="fr">
            <h1>{fr.notFound.h1}</h1>
            <p>
              {fr.notFound.body} <Link href={href('/', 'fr')}>{fr.notFound.backHome}</Link>
            </p>
          </div>

          <hr className="not-found__rule" />

          {/* Same shape as the French block above: on a bilingual site the two
              editions are equals, and a 404 is not indexed, so a second h1 is
              harmless. */}
          <div lang="en">
            <h1>{en.notFound.h1}</h1>
            <p>
              {en.notFound.body}{' '}
              <Link href={href('/', 'en')} hrefLang="en">
                {en.notFound.backHome}
              </Link>
            </p>
          </div>

          <p className="not-found__call">
            <a href={`tel:${company.phone}`} className="btn btn--primary" data-action="call">
              {fr.common.callPrefix} {company.phoneDisplay}
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
