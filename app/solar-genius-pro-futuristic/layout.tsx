import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'Solar Genius Pro — Futuristic AI Cockpit | EmersonEIMS',
  description:
    'Next-generation solar AI cockpit — voice control, 3D site canvas, neural sizing, NASA irradiance and live BOQ. Part of the EmersonEIMS Solar Genius Pro platform.',
  alternates: { canonical: `${SITE}/solar-genius-pro-futuristic` },
  openGraph: {
    title: 'Solar Genius Pro — Futuristic Cockpit | EmersonEIMS',
    description: 'Voice-controlled, 3D solar AI design cockpit.',
    url: `${SITE}/solar-genius-pro-futuristic`,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
  },
  robots: { index: true, follow: true },
};

export default function SolarGeniusProFuturisticLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
