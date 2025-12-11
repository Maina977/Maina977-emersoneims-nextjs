/**
 * Production-specific Next.js configuration
 * Use this for production builds with WordPress integration
 */

import type { NextConfig } from "next";

const productionConfig: NextConfig = {
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Static export for WordPress integration
  output: 'export',
  
  // Image optimization disabled for static export
  images: {
    unoptimized: true,
  },
  
  // Trailing slash for WordPress compatibility
  trailingSlash: true,
  
  // Disable server-side features for static export
  reactStrictMode: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://www.emersoneims.com',
    WORDPRESS_API_URL: 'https://www.emersoneims.com/wp-json/wp/v2',
    WORDPRESS_SITE_URL: 'https://www.emersoneims.com',
  },
};

export default productionConfig;




