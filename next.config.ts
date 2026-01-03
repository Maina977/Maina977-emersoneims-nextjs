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
  // PERFORMANCE OPTIMIZATIONS - Tesla-Level Speed
  // ═══════════════════════════════════════════════════════════════════
  compress: true,
  poweredByHeader: false, // Hide Next.js version (security)
  generateEtags: true,
  
  // Image optimization with security - HIGHLY OPTIMIZED
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000, // Cache images for 1 year
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
  
  // Experimental features for MAXIMUM performance
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'gsap',
      '@react-three/fiber',
      '@react-three/drei',
      'three',
      'chart.js',
      'echarts',
      'echarts-for-react',
    ],
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
      frame-src 'self' https://www.google.com https://www.youtube.com https://player.vimeo.com;
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

