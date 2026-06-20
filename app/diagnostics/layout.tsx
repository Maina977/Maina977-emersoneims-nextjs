import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import FlagshipProductSchema from '@/components/seo/FlagshipProductSchema';

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
  return (
    <>
      <FlagshipProductSchema
        name="EmersonEIMS Diagnostic Suite"
        url={`${siteUrl}/diagnostics`}
        description="Multi-service equipment diagnostics and sizing calculators: generators, solar, UPS, motors, AC, borehole pumps, high voltage, fabrication and incinerators — with fault-code search and quick-fix guidance."
        category="Equipment Diagnostics"
        applicationCategory="EngineeringApplication"
        keywords={['Generator Diagnostics', 'Fault Code Lookup', 'Solar Diagnostics', 'UPS Sizing', 'Pump Sizing', 'Equipment Troubleshooting']}
        industry="Technicians, Facility Managers, Engineers"
        priceKes="Free"
      />
      {children}
    </>
  );
}
