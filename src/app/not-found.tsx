import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <h1>Page introuvable</h1>
      <p>
        Cette page n&apos;existe pas. <Link href="/">Retour à l&apos;accueil</Link>
      </p>
    </>
  );
}
