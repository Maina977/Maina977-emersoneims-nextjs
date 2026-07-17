import type { Metadata } from 'next';
import ToolSeoContent from '@/components/seo/ToolSeoContent';
import type { ReactNode } from 'react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'Free Generator, Solar, UPS & Borehole Calculators Kenya | EmersonEIMS',
  description:
    'Free professional calculators: generator kVA sizing, solar system sizing, UPS load & runtime, battery bank, ROI, fuel consumption, payback. Built by EmersonEIMS engineers for Kenya conditions.',
  alternates: { canonical: `${SITE}/calculators` },
  openGraph: {
    title: 'Power Calculators — Generators, Solar, UPS, Borehole | EmersonEIMS',
    description: 'Free engineering calculators for power systems in Kenya.',
    url: `${SITE}/calculators`,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
  },
  robots: { index: true, follow: true },
};

export default function CalculatorsLayout({ children }: { children: ReactNode }) {
  return <>{children}
      <ToolSeoContent tool="calculators" /></>;
}
