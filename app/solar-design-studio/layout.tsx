import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import FlagshipProductSchema from '@/components/seo/FlagshipProductSchema';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const URL = `${SITE}/solar-design-studio`;

export const metadata: Metadata = {
  title: 'Solar Design Studio — 3D AI Solar Layout, Sizing & BOQ | EmersonEIMS',
  description:
    'Browser-based solar design studio: roof analysis, panel layout, string sizing, shading, irradiance and BOQ. Powered by EmersonEIMS Solar Genius Pro for installers across Kenya and East Africa.',
  keywords: [
    'solar design studio',
    '3D solar layout Kenya',
    'solar BOQ generator',
    'PV string sizing',
    'shading analysis',
    'roof solar layout',
    'EmersonEIMS Solar Design',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Solar Design Studio — 3D Layout, Sizing & BOQ | EmersonEIMS',
    description: '3D solar layout, sizing and BOQ in your browser. Built for Kenya & East Africa installers.',
    url: URL,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'Solar Design Studio by EmersonEIMS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Design Studio — 3D Layout, Sizing & BOQ',
    description: 'Browser-based solar layout, sizing and BOQ.',
    images: [`${SITE}/og-image.jpg`],
    site: '@EmersonEIMS',
  },
  robots: { index: true, follow: true },
  category: 'engineering',
};

export default function SolarDesignStudioLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <FlagshipProductSchema
        name="Solar Design Studio"
        url={URL}
        description="Browser-based solar design studio: roof analysis, panel layout, string sizing, shading and BOQ."
        category="Solar Design"
        applicationCategory="DesignApplication"
        keywords={['Solar Design', 'PV Layout', 'String Sizing', 'Shading', 'BOQ']}
        industry="Solar Installers, EPCs"
        priceKes="Free"
      />
      {children}
    </>
  );
}
