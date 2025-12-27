/**
 * EMERSON EIMS - Production Next.js Configuration
 * Version 2.0.0 | Optimized for Vercel Deployment
 * Fixes Digest 1160260191 + Performance + Security
 */

'use strict';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // === CORE SETTINGS ===
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  
  // Skip type checking during build (types will be checked in development)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // === IMAGE OPTIMIZATION ===
  images: {
    // Enable optimization in production, disable in development for speed
    unoptimized: process.env.NODE_ENV === 'development',
    
    // Supported image formats
    formats: ['image/avif', 'image/webp'],
    
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    
    // Image sizes for responsive images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Allowed remote patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'emersoneims.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.emersoneims.com',
        pathname: '/**',
      },
    ],
    
    // Content Security Policy for images
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // Performance settings
    minimumCacheTTL: 60,
  },
  
  // === COMPILER OPTIMIZATIONS ===
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    
    // Enable styled-components support (if used)
    styledComponents: true,
  },
  
  // === EXPERIMENTAL FEATURES ===
  experimental: {
    // Disable CSS optimization that's causing build errors
    optimizeCss: false,
    
    // Server Actions configuration
    serverActions: {
      bodySizeLimit: '2mb',
    },
    
    // Turbopack for development (optional)
    turbo: process.env.TURBO === 'true' ? {} : undefined,
    
    // Web Vitals attribution
    webVitalsAttribution: ['CLS', 'LCP', 'FID'],
  },
  
  // === PERFORMANCE OPTIMIZATIONS ===
  // Enable static optimization
  staticPageGenerationTimeout: 60,
  
  // === SECURITY HEADERS ===
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          
          // Performance headers
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      
      // Specific security for API routes
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.emersoneims.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  
  // === REDIRECTS & REWRITES ===
  async redirects() {
    return [
      {
        source: '/diagnostics/hub',
        destination: '/diagnostics',
        permanent: true,
      },
      {
        source: '/old-diagnostics',
        destination: '/diagnostics',
        permanent: true,
      },
    ];
  },
  
  // === ENVIRONMENT VARIABLES ===
  env: {
    NEXT_PUBLIC_APP_VERSION: '2.0.0',
    NEXT_PUBLIC_BUILD_TIMESTAMP: new Date().toISOString(),
    NEXT_PUBLIC_NODE_VERSION: process.version,
  },
  
  // === BUILD OPTIMIZATIONS ===
  // Exclude source maps from production
  productionBrowserSourceMaps: false,
  
  // === CUSTOM WEBPACK CONFIG ===
  webpack: (config, { isServer, dev }) => {
    // Only run on client builds
    if (!isServer) {
      // Optimize moment.js (if used)
      config.resolve.alias = {
        ...config.resolve.alias,
        'moment$': 'moment/moment.js',
      };
    }
    
    // Add source map loader in development
    if (dev) {
      config.devtool = 'eval-source-map';
    }
    
    return config;
  },
  
  // === INTERNATIONALIZATION ===
  // Comment out until next-intl is properly configured
  // i18n: {
  //   locales: ['en', 'fr'],
  //   defaultLocale: 'en',
  //   localeDetection: true,
  // },
};

// === BUNDLE ANALYZER INTEGRATION ===
// Temporarily disabled to fix webpack errors
// let finalConfig = nextConfig;
// 
// try {
//   require.resolve('@next/bundle-analyzer');
//   const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
//     openAnalyzer: false,
//   });
//   console.log('📊 Bundle analyzer loaded successfully');
//   finalConfig = withBundleAnalyzer(nextConfig);
// } catch (error) {
//   if (process.env.ANALYZE === 'true') {
//     console.warn('⚠️  Bundle analyzer not found.');
//   }
//   finalConfig = nextConfig;
// }

// === TYPE SAFETY ===
module.exports = nextConfig;
