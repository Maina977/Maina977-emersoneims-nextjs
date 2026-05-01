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
};

export default function ProBuildingSuitePage() {
  return <ProBuildingSuiteClient />;
}
