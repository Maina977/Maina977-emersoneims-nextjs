/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  transpilePackages: [],
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    config.resolve.alias['ai-borehole-analyzer'] = path.resolve(__dirname, '../ai-borehole-analyzer/src');
    return config;
  },
}

module.exports = nextConfig