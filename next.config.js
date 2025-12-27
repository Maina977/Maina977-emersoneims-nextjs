/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['vercel.app'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  experimental: {
    serverActions: true,
  },
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;
