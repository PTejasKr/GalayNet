import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.googletagmanager.com https://static.cloudflareinsights.com; script-src-elem 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://static.cloudflareinsights.com; connect-src 'self' https://challenges.cloudflare.com https://nominatim.openstreetmap.org https://www.google-analytics.com https://cloudflareinsights.com https://static.cloudflareinsights.com; img-src 'self' data: https://*.tile.openstreetmap.org https://unpkg.com; style-src 'self' 'unsafe-inline'; frame-src 'self' https://challenges.cloudflare.com;"
          }
        ]
      }
    ]
  }
};

export default nextConfig;
