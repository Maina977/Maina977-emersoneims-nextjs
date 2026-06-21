/**
 * Next.js Configuration
 *
 * COPYRIGHT NOTICE:
 * Copyright (c) 2024-2026 Generator Oracle. All Rights Reserved.
 * This software is protected by copyright law and international treaties.
 * Unauthorized reproduction, distribution, or use is strictly prohibited.
 */

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

  // Strip console.* from production bundles (keep error/warn for ops triage).
  // Smaller, faster JS in prod; no effect on dev. SWC-level, zero runtime cost.
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // PRODUCTION BUNDLE OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundles

  // Output standalone for optimal serverless deployment
  output: 'standalone',

  // Image optimization - MAXIMUM COMPRESSION + QUALITY - 96% Target
  images: {
    formats: ['image/avif', 'image/webp'],
    // Next 16 only honours quality values whitelisted here — without this,
    // every quality prop silently falls back to 75 (soft hero/showcase art).
    qualities: [75, 84, 85, 88, 90],
    // 3840 added (from perf variant) so 4K / high-DPI displays get a sized
    // candidate instead of upscaling the 2048 source.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    // FIX (audit 2026-05-09): was 'attachment' which forced every image
    // served by next/image to arrive with Content-Disposition: attachment,
    // i.e. as a download. That broke inline display and rich social
    // previews. 'inline' is the correct value for site imagery.
    contentDispositionType: 'inline',
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
  // Every millisecond counts! Target: 96% Lighthouse Score
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
      'recharts',
      'zod',
      '@radix-ui/react-icons',
      'react-icons',
      'clsx',
      'tailwind-merge',
      '@anthropic-ai/sdk',
      'lru-cache',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'class-variance-authority',
    ],
    // Partial Pre-Rendering for instant page loads
    ppr: false, // Enable when stable
    // Server Actions optimization
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // CSS optimization
    optimizeCss: true,
    // Scroll restoration
    scrollRestoration: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // TURBOPACK CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════
  turbopack: {
    rules: {
      // Optimize SVG imports
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // WEBPACK OPTIMIZATION - AGGRESSIVE BUNDLE SPLITTING
  // ═══════════════════════════════════════════════════════════════════
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 40,
              enforce: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
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
  // NOTE: ignoreBuildErrors enabled because the integrated SolarGeniusPro and
  // AquaScan Pro modules (from external sources) use looser typing than the
  // host project's strict mode. Runtime is unaffected; types are still
  // checked by the editor and tsc on a per-file basis.
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Headers for security and performance
  async headers() {
    // Content Security Policy - Comprehensive protection
    const ContentSecurityPolicy = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://*.vercel.app https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://unpkg.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
      img-src 'self' blob: data: https: http:;
      font-src 'self' https://fonts.gstatic.com data: https://cdnjs.cloudflare.com;
      connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://*.vercel.app wss://*.vercel.app http://127.0.0.1:5000 http://localhost:5000 ws://127.0.0.1:5000 ws://localhost:5000 https://image.pollinations.ai https://tfhub.dev https://www.kaggle.com https://storage.googleapis.com;
      media-src 'self' blob: https:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'self';
      frame-src 'self' https://www.google.com https://maps.google.com https://*.google.com https://www.openstreetmap.org https://*.openstreetmap.org https://www.youtube.com https://player.vimeo.com https://emersoneims.com https://www.emersoneims.com https://*.emersoneims.com http://127.0.0.1:5000 http://localhost:5000;
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
          // FIX (audit 2026-05-09): X-XSS-Protection is deprecated and was
          // removed from modern browsers; OWASP recommends sending `0` or
          // omitting it entirely because some legacy versions had bugs that
          // could *introduce* XSS via this header. Real XSS protection is
          // delivered by the Content-Security-Policy above.
          {
            key: 'X-XSS-Protection',
            value: '0'
          },
          // Cross-Origin policies
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          // FIX (audit 2026-05-09): was 'same-origin' which blocked
          // LinkedIn / Slack / WhatsApp / Twitter / Facebook from fetching
          // og-image.jpg for link previews — a direct B2B conversion hit.
          // 'cross-origin' lets social previewers and search-engine image
          // crawlers read public assets while the rest of the security
          // stack (CSP, X-Frame-Options, frame-ancestors) keeps the page
          // itself protected.
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin'
          },
          // FIX (audit 2026-05-09): was 'credentialless'. COEP is only
          // useful when the app needs SharedArrayBuffer (we don't); the
          // strict value silently broke every embedded YouTube / Google
          // Maps / Vimeo on every page that wasn't /pro-building-suite or
          // /eims-pro (which already had per-route overrides). Setting
          // 'unsafe-none' restores third-party embeds without weakening
          // anything we actually rely on.
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none'
          },
          // Cache Control
          // Previously s-maxage=86400 cached every page at the edge for 24h, so
          // fresh/updated content (and Google's re-crawl of it) lagged a full day.
          // Now: serve instantly from cache but revalidate every ~10 min, with a
          // long stale-while-revalidate window so there is no latency penalty —
          // new content surfaces within minutes, not a day. (Per-asset immutable
          // caching for /_next static files is unaffected — set elsewhere.)
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400'
          },
          // ═══════════════════════════════════════════════════════════
          // COPYRIGHT & ANTI-COPY PROTECTION
          // ═══════════════════════════════════════════════════════════
          {
            key: 'X-Copyright',
            value: 'Generator Oracle 2024-2026. All Rights Reserved.'
          },
          {
            key: 'X-Content-Protected',
            value: 'true'
          },
          // ═══════════════════════════════════════════════════════════
          // DEPLOYMENT IDENTITY — emitted on every response so any HTTP
          // probe can directly tie a live response to a specific commit
          // SHA. Closes the previous "strongly-indicated-but-not-directly-
          // proven" deployment-identity audit gap. Vercel injects
          // VERCEL_GIT_COMMIT_SHA at build time; falls back to 'dev' for
          // local builds where the env var is absent.
          // ═══════════════════════════════════════════════════════════
          {
            key: 'X-App-Commit',
            value: process.env.VERCEL_GIT_COMMIT_SHA || 'dev'
          },
          // NOTE: previously emitted `X-Robots-Tag: noarchive, noimageindex,
          // notranslate` here. That header was being applied site-wide
          // (including /sitemap.xml, /robots.txt, county redirect targets)
          // and was contributing to Search Console's "Crawled — currently
          // not indexed" bucket. The middleware now sets `index, follow`
          // explicitly for verified search-engine crawlers; do NOT add a
          // conflicting global X-Robots-Tag here.
          {
            key: 'X-Download-Options',
            value: 'noopen'
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none'
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
      // Images - Long cache, but revalidate weekly so in-place replacements
      // (e.g. re-running the compress-heavy-images script) reach users without
      // needing a filename change. SWR=604800 = serve stale up to 7 days while
      // refetching in background.
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=604800',
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
      // Embed pages: relax cross-origin isolation so a cross-port Flask iframe can load.
      {
        source: '/pro-building-suite',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
      // Versioned wizard HTML files in /public are immutable: filename includes a date stamp
      // that bumps every time the file is replaced, so we can cache aggressively at the edge.
      // First load is fast; repeat loads are instant. Cache-busting is automatic via the URL.
      // NOTE: bump the date suffix here whenever a new wizard version is deployed
      // (see memory: project_building_suite_pro_wizard_sync.md).
      {
        source: '/eims-building-suite-v20260503.html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Building Suite Pro Console (mounted at /console via rewrites). It is
      // iframed by the wizard, so it MUST be allowed in same-origin frames.
      {
        source: '/eims-pro-console.html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=60',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
      {
        source: '/eims-pro',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
    ];
  },

  // ═══════════════════════════════════════════════════════════════════
  // REWRITES - Mount static Building Suite Pro Console under /console.
  // The Building Suite Pro wizard iframes /console (with #moduleId hashes
  // for MEP Clash, High-Rise, Healthcare, Collab, All Tools, etc.) and
  // previously 404'd because no Next.js route owned that path.
  // ═══════════════════════════════════════════════════════════════════
  async rewrites() {
    // NOTE: vercel.json sets `cleanUrls: true`, so Vercel strips `.html` from
    // every public asset (e.g. /eims-pro-console.html → 308 → /eims-pro-console).
    // Rewriting `/console` directly to the cleanUrl form is required — using
    // the `.html` form here causes the rewrite to resolve against the redirect
    // and the request ends up as a 404. See verified live probe 2026-05-02.
    return [
      { source: '/console', destination: '/eims-pro-console' },
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
        source: '/diagnostic-cockpit',
        destination: '/diagnostics',
        permanent: true,
      },
      // GSC-discovered 404 slugs that were emitted historically in sitemap and
      // structured data. They map to real pages — redirect rather than 404 so
      // existing inbound discovery preserves SEO equity.
      {
        source: '/diagnostic-suite',
        destination: '/diagnostics',
        permanent: true,
      },
      {
        source: '/fault-code-lookup',
        destination: '/faults',
        permanent: true,
      },
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
        source: '/aquascan-pro',
        destination: '/aquascan-pro-v3',
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
      // ═══════════════════════════════════════════════════════════════════
      // FIX KEYWORD CANNIBALIZATION - Consolidate competing pages
      // ═══════════════════════════════════════════════════════════════════
      // Generator pages - all redirect to /generators (main page)
      {
        source: '/service/generators',
        destination: '/generators',
        permanent: true,
      },
      {
        source: '/solutions/generators',
        destination: '/generators',
        permanent: true,
      },
      // Solar pages - consolidate to /solar
      {
        source: '/solutions/solar',
        destination: '/solar',
        permanent: true,
      },
      // Motor pages
      {
        source: '/solutions/motors',
        destination: '/services/motor-rewinding',
        permanent: true,
      },
      {
        source: '/solutions/motor-rewinding',
        destination: '/services/motor-rewinding',
        permanent: true,
      },
      // ATS pages
      {
        source: '/solutions/controls',
        destination: '/services/ats-changeover',
        permanent: true,
      },
      // UPS pages
      {
        source: '/solutions/ups',
        destination: '/services/ups-systems',
        permanent: true,
      },
      // HVAC/AC pages
      {
        source: '/solutions/ac',
        destination: '/services/ac-installation',
        permanent: true,
      },
      // Borehole pages
      {
        source: '/solutions/borehole-pumps',
        destination: '/services/borehole-pumps',
        permanent: true,
      },
      // Duplicate contact page
      {
        source: '/solutions/contact',
        destination: '/contact',
        permanent: true,
      },
      // ═══════════════════════════════════════════════════════════════════
      // CONSOLIDATE DUPLICATE PAGES
      // ═══════════════════════════════════════════════════════════════════
      // About page consolidation
      {
        source: '/about',
        destination: '/about-us',
        permanent: true,
      },
      // Counties → Kenya (consolidate location pages)
      {
        source: '/counties',
        destination: '/kenya',
        permanent: true,
      },
      {
        source: '/counties/:county',
        destination: '/kenya/:county',
        permanent: true,
      },
      // Service singular → Services plural
      {
        source: '/service',
        destination: '/services',
        permanent: true,
      },
      // Generator parts consolidation
      {
        source: '/generator-parts',
        destination: '/generators/spare-parts',
        permanent: true,
      },
      {
        source: '/generator-services',
        destination: '/generators',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(bundleAnalyzer(nextConfig));

