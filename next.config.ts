import type { NextConfig } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emersoneims.com';
const WORDPRESS_SITE_URL = process.env.WORDPRESS_SITE_URL || 'https://www.emersoneims.com';
const isStaticExport = process.env.WORDPRESS_INTEGRATION === 'true' && process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  // Output configuration
  // Use 'standalone' for server deployment, 'export' for static export to WordPress
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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // 4K support
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enable React strict mode
  reactStrictMode: true,

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Transpile packages for ES modules compatibility (fixes "window is not defined" errors)
  transpilePackages: [
    '@react-three/fiber',
    '@react-three/drei',
    'three',
    '@react-spring/three',
  ],

  // Webpack configuration for WordPress compatibility and path aliases
  webpack: (config, { isServer }) => {
        // Add path alias for app components folder
        config.resolve.alias = {
          ...config.resolve.alias,
          '@/app/components': require('path').resolve(__dirname, 'app/components'),
        };

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

  // Experimental features - PERFORMANCE OPTIMIZED (Apple-Level)
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
    optimizeCss: true, // Optimize CSS
    optimizeServerReact: true, // Optimize server-side React rendering
    serverActions: {
      bodySizeLimit: '2mb', // Limit server action body size for security
    },
    // Enable partial prerendering for faster initial loads
    ppr: false, // Set to true when stable
  },
  

  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  turbopack: {
    root: __dirname, // Fix lockfile warning
    resolveAlias: {
      // Optimize Three.js imports - use ES module path for Windows compatibility
      'three': 'three',
    },
  },

  // Compression - Enable gzip and brotli
  compress: true,

  // Service Worker support
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/sw.js',
      },
    ];
  },

  // Power optimization
  poweredByHeader: false, // Remove X-Powered-By header for security
  // Note: SWC minification is enabled by default in Next.js 16

  // Headers for performance and security (Note: Middleware handles most security headers)
  // Apple-Level Performance: Aggressive Preloading
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

// Add redirects only for server mode (not static export)
if (!isStaticExport) {
  nextConfig.redirects = async () => {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  };
}

export default nextConfig;
