/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export. Every page is real HTML before any JS runs.
  // Do not change this. See CLAUDE.md rule 2.
  output: 'export',
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
