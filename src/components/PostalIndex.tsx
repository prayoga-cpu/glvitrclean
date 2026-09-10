import Link from 'next/link';
import { communes, communesByPostalCode } from '@/data/communes';
import { strings } from '@/i18n/dictionary';
import { href, type Lang } from '@/i18n/config';

/**
 * The served postal codes, each linking to the commune pages it covers.
 *
 * ROADMAP phase 8b. The SPIC AND SPAN Paris page makes a postal-code field its
 * primary call to action — one input instead of a form. We cannot copy that
 * shape: resolving a code to a page in the browser needs a fifth `'use client'`
 * component and CLAUDE.md rule 2 names the only four that may exist. It would
 * also be the wrong shape here, because three of our nine codes cover more than
 * one commune (91290 alone covers Arpajon, La Norville and Ollainville), so
 * there is frequently no single page to send anyone to.
 *
 * An index is the better trade in both directions. It is complete, it is
 * crawlable — which the Paris page's own unlinked arrondissement list is not —
 * and it puts a real anchor on `nettoyage 91150`, a query shape no other page
 * on this site targets. See TODO.md, teardown 2, items 5 and 6.
 *
 * Counts are derived, never typed: CLAUDE.md rule 0 on the route totals applies
 * just as much to a sentence that says how many towns there are.
 */
export function PostalIndex({ lang }: { lang: Lang }) {
  const t = strings(lang);
  const groups = communesByPostalCode();

  return (
    <section>
      <h2>{t.hubs.postalH2}</h2>
      <p>{t.hubs.postalIntro(communes.length, groups.length)}</p>

      <ul className="postal-index">
        {groups.map((group) => (
          <li key={group.postalCode} className="postal-index__group">
            <p className="postal-index__code">{group.postalCode}</p>
            <ul aria-label={t.hubs.postalGroupLabel(group.postalCode)}>
              {group.communes.map((c) => (
                <li key={c.slug}>
                  <Link href={href(`/zones/${c.slug}`, lang)}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
