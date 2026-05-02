import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

// /solutions/building used to mount an older React-based building suite
// (ProBuildingSuiteComplete). The single source-of-truth is now the HTML
// wizard at /pro-building-suite. Redirect permanently so every old link,
// bookmark, and nav entry lands on the new wizard.
export const metadata: Metadata = {
  title: 'Pro Building Suite | Emerson EIMS',
  description:
    'Full EIMS engineering, quantity surveying, BIM, and professional reports — Building Suite Pro.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/pro-building-suite' },
};

export default function BuildingRedirectPage() {
  redirect('/pro-building-suite');
}
