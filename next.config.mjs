/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Turbopack configuration (Next.js 16+)
  turbopack: {
    resolveAlias: {
      // Empty canvas module for @react-pdf/renderer
      canvas: './lib/empty-canvas.js',
    },
  },
  // Fallback webpack config for non-turbopack builds
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
