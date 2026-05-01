import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'Solar Genius Pro | AI solar design, BIM & financials | EmersonEIMS',
  description:
    'Full-featured solar AI: roof analysis, NASA weather, sizing, BOQ, ROI, 3D roof canvas, and reports — on EmersonEIMS with live /api/solar, payments, and notifications.',
  alternates: { canonical: `${siteUrl}/solar-genius-pro` },
  openGraph: {
    title: 'Solar Genius Pro | EmersonEIMS',
    url: `${siteUrl}/solar-genius-pro`,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function SolarGeniusProLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
