import type { Metadata } from 'next';
import EimsProClient from './EimsProClient';

export const metadata: Metadata = {
  title: 'EIMS PRO | Emerson EIMS',
  description:
    'Live EIMS PRO engineering workspace — phases, reports, BIM, and costing. Runs in-page from your suite server (local http://127.0.0.1:5000 or production URL via env).',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/eims-pro',
  },
};

export default function EimsProPage() {
  return <EimsProClient />;
}
