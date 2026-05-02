import type { Metadata } from 'next';
import ProBuildingSuiteClient from './ProBuildingSuiteClient';

export const metadata: Metadata = {
  title: 'Building Suite Pro | Emerson EIMS',
  description:
    'Full EIMS engineering, quantity surveying, BIM, and professional reports — Building Suite Pro.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/pro-building-suite',
  },
  other: {
    // Hint browser to start fetching the wizard shell + Three.js CDN immediately
    'link-prefetch': '/eims-building-suite-v20260501.html',
  },
};

export default function ProBuildingSuitePage() {
  return (
    <>
      {/* Speed up wizard: warm CDN connections + prefetch the shell */}
      <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
      <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      <link rel="prefetch" href="/eims-building-suite-v20260501.html" as="document" />
      <ProBuildingSuiteClient />
    </>
  );
}
