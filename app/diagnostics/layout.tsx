import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'Equipment Diagnostics & Calculators | EmersonEIMS',
  description:
    'Multi-service equipment diagnostics: generators, solar, high voltage, motors, AC, UPS, borehole pumps, fabrication, and incinerators. Q&A, sizing calculators, and quick-fix guidance. Kenya: +254 768 860 665.',
  alternates: { canonical: `${siteUrl}/diagnostics` },
  openGraph: {
    title: 'Equipment Diagnostics & Calculators | EmersonEIMS',
    description:
      'Interactive diagnostics and calculators for generators, solar, high voltage, motors, and more. EmersonEIMS — Reliable Power. Without Limits.',
    url: `${siteUrl}/diagnostics`,
    type: 'website',
  },
};

export default function DiagnosticsLayout({ children }: { children: ReactNode }) {
  return children;
}
