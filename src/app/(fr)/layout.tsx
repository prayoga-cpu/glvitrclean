import '../globals.css';
import { BaseLayout, baseMetadata } from '@/components/BaseLayout';

/**
 * Root layout for the French edition.
 *
 * Two root layouts exist because only a root layout may emit <html>, and
 * `<html lang>` differs between editions. Route groups add no URL segment, so
 * this group serves `/` and everything under it.
 * The shared body lives in BaseLayout so the two cannot drift.
 */
export const metadata = baseMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout lang="fr">{children}</BaseLayout>;
}
