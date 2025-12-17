import type { NextConfig } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const WORDPRESS_SITE_URL = process.env.WORDPRESS_SITE_URL || 'https://www.emersoneims.com';
const isStaticExport = process.env.WORDPRESS_INTEGRATION === 'true' && process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  // Output configuration
  // Use 'standalone' for server deployment, 'export' for static export to WordPress
  ...(isStaticExport ? { output: 'export' as const } : {}),
  
  // Image optimization
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
  },

  // Enable React strict mode
  reactStrictMode: true,

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Webpack configuration for WordPress compatibility
  webpack: (config, { isServer }) => {
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

  // Environment variables
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL || `${WORDPRESS_SITE_URL}/wp-json/wp/v2`,
    WORDPRESS_SITE_URL: WORDPRESS_SITE_URL,
    NEXT_PUBLIC_SITE_URL: SITE_URL,
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
};

// Add headers and redirects only for server mode (not static export)
if (!isStaticExport) {
  nextConfig.headers = async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
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
        ],
      },
    ];
  };

  nextConfig.redirects = async () => [
    {
      source: '/home',
      destination: '/',
      permanent: true,
    },
  ];
}

export default nextConfig;
