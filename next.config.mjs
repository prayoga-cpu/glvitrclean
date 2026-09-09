/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export. Every page is real HTML before any JS runs.
  // Do not change this. See CLAUDE.md rule 2.
  output: 'export',

  // Enables the `src/app/global-not-found.tsx` convention. Required, not
  // optional: this app has two root layouts (one per language edition) and
  // therefore none at the app root, and a plain `not-found.tsx` cannot compile
  // without one — it 500s every app-root route in `next dev`. See the header
  // comment in that file. `experimental` because the convention is still
  // stabilising; `next` is pinned to an exact version in package.json, so it
  // cannot change under us without a deliberate bump.
  experimental: {
    globalNotFound: true,
  },
  trailingSlash: true,
  images: {
    // No image optimisation server in a static export.
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
