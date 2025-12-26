import { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Your existing config here
  // This will be merged with the bundle analyzer config
};

export default bundleAnalyzer(nextConfig);