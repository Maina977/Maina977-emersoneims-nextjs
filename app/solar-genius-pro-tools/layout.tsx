import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'Solar Genius Pro Tools | Sizing, ROI, Inverter & Battery Calculators | EmersonEIMS',
  description:
    'Solar Genius Pro toolkit — sizing, ROI, inverter selection, battery bank, string voltage, payback and tariff calculators. Engineering-grade tools for Kenyan installers and facility managers.',
  alternates: { canonical: `${SITE}/solar-genius-pro-tools` },
  openGraph: {
    title: 'Solar Genius Pro Tools | EmersonEIMS',
    description: 'Engineering-grade solar calculators and tools.',
    url: `${SITE}/solar-genius-pro-tools`,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
  },
  robots: { index: true, follow: true },
};

export default function SolarGeniusProToolsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
