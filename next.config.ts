import type { NextConfig } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emersoneims.com';
const WORDPRESS_SITE_URL = process.env.WORDPRESS_SITE_URL || 'https://www.emersoneims.com';
const isStaticExport = process.env.WORDPRESS_INTEGRATION === 'true' && process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  // Output configuration
  ...(isStaticExport ? { output: 'export' as const } : {}),

  // Image optimization - EXTREME PERFORMANCE
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.emersoneims.com',
      },
      {
        protocol: 'https',
        hostname: 'emersoneims.com',
      },
      {
        protocol: 'https',
        hostname: '**.emersoneims.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // React strict mode
  reactStrictMode: true,

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Transpile packages
  transpilePackages: [
    '@react-three/fiber',
    '@react-three/drei',
    'three',
    '@react-spring/three',
    '@upstash/redis',
  ],

  // Webpack configuration - DISABLED when using Turbopack
  // webpack: (config, { isServer }) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     '@/app/components': require('path').resolve(__dirname, 'app/components'),
  //   };

  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //       net: false,
  //       tls: false,
  //     };
  //   }

  //   // Code splitting optimization
  //   config.optimization = {
  //     ...config.optimization,
  //     splitChunks: {
  //       chunks: 'all',
  //       cacheGroups: {
  //         framework: {
  //           chunks: 'all',
  //           name: 'framework',
  //           test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
  //           priority: 40,
  //           enforce: true,
  //         },
  //         lib: {
  //           test: /[\\/]node_modules[\\/]/,
  //           name: 'lib',
  //           priority: 30,
  //           chunks: 'all',
  //         },
  //       },
  //     },
  //   };

  //   return config;
  // },

  // Environment variables
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL || `${WORDPRESS_SITE_URL}/wp-json/wp/v2`,
    WORDPRESS_SITE_URL: WORDPRESS_SITE_URL,
    NEXT_PUBLIC_SITE_URL: SITE_URL,
  },

  // Experimental features
  experimental: {
    optimizePackageImports: [
      '@react-three/fiber',
      '@react-three/drei',
      'three',
      'framer-motion',
      'gsap',
      'chart.js',
      'react-chartjs-2',
    ],
    optimizeCss: true,
    optimizeServerReact: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
    ppr: false,
  },

  // Compression
  compress: true,

  // Service Worker
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/sw.js',
      },
    ];
  },

  // Power optimization
  poweredByHeader: false,

  // Headers for performance
  async headers() {
    if (isStaticExport) return [];

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: [
              '</fonts/geist-sans.woff2>; rel=preload; as=font; type=font/woff2; crossorigin',
              '</fonts/space-grotesk.woff2>; rel=preload; as=font; type=font/woff2; crossorigin',
              '</fonts/inter.woff2>; rel=preload; as=font; type=font/woff2; crossorigin',
            ].join(', '),
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
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
        source: '/media/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/models/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

// Add redirects
if (!isStaticExport) {
  nextConfig.redirects = async () => [
    {
      source: '/home',
      destination: '/',
      permanent: true,
    },
  ];
}

export default nextConfig;

