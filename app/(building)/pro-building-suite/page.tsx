import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

// Canonical Building Suite URL is /solutions/building.
// /pro-building-suite is kept as a permanent redirect so any existing links,
// service-worker prefetches, or browser bookmarks land on the right page.
export const metadata: Metadata = {
  title: 'Building Suite Pro | Emerson EIMS',
  robots: { index: false, follow: true },
  alternates: { canonical: '/solutions/building' },
};

export default function ProBuildingSuiteRedirect() {
  redirect('/solutions/building');
}
