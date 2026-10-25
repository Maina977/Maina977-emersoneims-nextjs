import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import FlagshipProductSchema from '@/components/seo/FlagshipProductSchema';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const URL = `${SITE}/solar-design-studio`;

export const metadata: Metadata = {
  title: 'Solar Design Studio — Roof Layout, Sun Path & Wiring',
  description:
    'Draw your roof, place panels, follow the path and angle of the sun through the day (trees and walls are not modelled), and get a single-line diagram and wire schedule. Free in your browser; an EmersonEIMS engineer can turn it into a quotation.',
  keywords: [
    'solar design studio',
    'solar roof layout Kenya',
    'solar single-line diagram',
    'PV string sizing',
    'sun path',
    'roof solar layout',
    'EmersonEIMS Solar Design',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Solar Design Studio — Roof Layout, Sun Path & Wiring',
    description: 'Roof layout, sun path, single-line diagram and wire schedule in your browser.',
    url: URL,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'Solar Design Studio by EmersonEIMS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Design Studio — Roof Layout, Sun Path & Wiring',
    description: 'Roof layout, sun path and wiring in your browser.',
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
        description="Browser-based solar design studio: roof layout, panel placement, sun path, single-line diagram and wire schedule."
        category="Solar Design"
        applicationCategory="DesignApplication"
        keywords={['Solar Design', 'PV Layout', 'Sun Path', 'Single-Line Diagram', 'Wire Schedule']}
        industry="Solar Installers, EPCs"
        priceKes="Free"
      />
      {children}
    </>
  );
}
