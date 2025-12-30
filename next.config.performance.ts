import type { NextConfig } from 'next';

/**
 * PERFORMANCE-OPTIMIZED NEXT.JS CONFIGURATION
 * Targets: Awwwards SOTD, Top 10 Global Website
 * Performance: Tesla.com speed, Apple.com efficiency
 */

const performanceConfig: NextConfig = {
  reactStrictMode: true,
  
  // Remove powered by header for security
  poweredByHeader: false,
  
  // Enable compression
  compress: true,
  
  // Performance optimizations
  swcMinify: true,
  
  // Image optimization - Maximum quality with minimum size
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Aggressive optimization
    unoptimized: false,
  },
  
  // Experimental features for maximum performance
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'gsap',
      '@react-three/fiber',
      '@react-three/drei',
      'three',
      'chart.js',
    ],
    // Enable turbo for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Vendor splitting for better caching
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module: any) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )?.[1];
              return `vendor-${packageName?.replace('@', '')}`;
            },
            priority: 10,
          },
          // Common components
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
          // Three.js optimization
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'three',
            priority: 20,
          },
          // Animation libraries
          animations: {
            test: /[\\/]node_modules[\\/](framer-motion|gsap)[\\/]/,
            name: 'animations',
            priority: 15,
          },
        },
      },
    };
    
    // Only include necessary polyfills
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // Headers for security and performance
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
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Performance headers
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Static assets - aggressive caching
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Output standalone for optimal deployment
  output: 'standalone',
};

export default performanceConfig;
