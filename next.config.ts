import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ═══════════════════════════════════════════════════════════════════
  // 🚀 WORLD'S #1 FASTEST WEBSITE - ULTRA PERFORMANCE
  // Target: Sub-500ms First Contentful Paint (FCP)
  // Target: Sub-100ms Time to First Byte (TTFB)
  // Target: 100/100 Lighthouse Score
  // ═══════════════════════════════════════════════════════════════════
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Image optimization - MAXIMUM COMPRESSION + QUALITY
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.emersoneims.com',
        pathname: '/wp-content/**',
      },
      {
        protocol: 'https',
        hostname: 'emersoneims.com',
        pathname: '/wp-content/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 🔥 EXPERIMENTAL - BLEEDING EDGE PERFORMANCE
  // Every millisecond counts!
  // ═══════════════════════════════════════════════════════════════════
  experimental: {
    // Tree-shake these packages for MUCH smaller bundles
    optimizePackageImports: [
      'framer-motion',
      'gsap',
      '@react-three/fiber',
      '@react-three/drei',
      'three',
      'chart.js',
      'echarts',
      'echarts-for-react',
      'lodash',
      'date-fns',
      'lucide-react',
      '@heroicons/react',
      'react-hook-form',
      'mapbox-gl',
      'web-vitals',
    ],
    // Partial Prerendering - Instant static shell with streaming dynamic content
    // ppr: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // BUNDLE OPTIMIZATION - Smaller JS = Faster Load
  // ═══════════════════════════════════════════════════════════════════
  modularizeImports: {
    'lodash': {
      transform: 'lodash/{{member}}',
    },
    '@heroicons/react/24/outline': {
      transform: '@heroicons/react/24/outline/{{member}}',
    },
    '@heroicons/react/24/solid': {
      transform: '@heroicons/react/24/solid/{{member}}',
    },
  },
  
  // TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Headers for security and performance
  async headers() {
    // Content Security Policy - Comprehensive protection
    const ContentSecurityPolicy = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://*.vercel.app;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data: https: http:;
      font-src 'self' https://fonts.gstatic.com data:;
      connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://*.vercel.app wss://*.vercel.app;
      media-src 'self' blob: https:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'self';
      frame-src 'self' https://www.google.com https://maps.google.com https://*.google.com https://www.youtube.com https://player.vimeo.com;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/(.*)',
        headers: [
          // ═══════════════════════════════════════════════════════════
          // SECURITY HEADERS - Enterprise Grade Protection
          // ═══════════════════════════════════════════════════════════
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Cross-Origin policies
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless'
          },
          // Cache Control
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=59'
          }
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Video files - Long cache for fast loading
      {
        source: '/videos/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes',
          },
        ],
      },
      // Images - Long cache
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
        ],
      },
      // Sitemap & Robots - Short cache for quick updates
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=60',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=60',
          },
        ],
      },
    ];
  },

  // ═══════════════════════════════════════════════════════════════════
  // REDIRECTS - Fix duplicate routes for SEO
  // ═══════════════════════════════════════════════════════════════════
  async redirects() {
    return [
      // Fix solution/solutions duplicate
      {
        source: '/solution',
        destination: '/solutions',
        permanent: true,
      },
      {
        source: '/solution/:path*',
        destination: '/solutions/:path*',
        permanent: true,
      },
      // Legacy URL redirects
      {
        source: '/generators-kenya',
        destination: '/generators',
        permanent: true,
      },
      {
        source: '/solar-kenya',
        destination: '/solar',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/generators',
        permanent: true,
      },
      // SEO-friendly redirects
      {
        source: '/generator',
        destination: '/generators',
        permanent: true,
      },
      {
        source: '/services-page',
        destination: '/services',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(bundleAnalyzer(nextConfig));

