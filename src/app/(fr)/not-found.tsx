import Link from 'next/link';
import { strings } from '@/i18n/dictionary';
import { href } from '@/i18n/config';

/**
 * The static export emits exactly one 404.html, which the host serves for any
 * unmatched path — including paths under /en. It therefore cannot know the
 * visitor's language, so it answers in both and offers a way back into either
 * edition. It lives in the (fr) group only because a not-found page needs a
 * root layout and the French one owns the bare paths.
 */
export default function NotFound() {
  const fr = strings('fr').notFound;
  const en = strings('en').notFound;

  return (
    <>
      <h1>{fr.h1}</h1>
      <p>
        {fr.body} <Link href={href('/', 'fr')}>{fr.backHome}</Link>
      </p>

      <p lang="en">
        {en.body} <Link href={href('/', 'en')}>{en.backHome}</Link>
      </p>
    </>
  );
}
