import type { Metadata } from 'next';
import ToolSeoContent from '@/components/seo/ToolSeoContent';
import type { ReactNode } from 'react';
import FlagshipProductSchema from '@/components/seo/FlagshipProductSchema';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const URL = `${SITE}/solar-genius-pro`;

export const metadata: Metadata = {
  title: 'Solar Genius Pro — Commercial Solar Design & Engineering Intelligence | EmersonEIMS',
  description:
    'Solar Genius Pro is the EmersonEIMS commercial solar design and engineering intelligence tool: load profiling, hybrid sizing, financials, EPRA-aware compliance and proposal-ready outputs.',
  keywords: [
    'commercial solar design Kenya',
    'solar sizing tool',
    'hybrid solar engineering',
    'EPRA compliance solar',
    'solar feasibility study',
    'Solar Genius Pro',
    'EmersonEIMS solar',
    'C&I solar Kenya',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Solar Genius Pro — Commercial Solar Engineering Intelligence | EmersonEIMS',
    description:
      'Load profiling, hybrid sizing, financials and EPRA-aware compliance for serious commercial solar projects.',
    url: URL,
    type: 'website',
    siteName: 'EmersonEIMS',
    locale: 'en_KE',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'Solar Genius Pro by EmersonEIMS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Genius Pro — Commercial Solar Engineering Intelligence',
    description: 'Sizing, hybrid, financials, EPRA-aware compliance.',
    images: [`${SITE}/og-image.jpg`],
    site: '@EmersonEIMS',
  },
  robots: { index: true, follow: true },
  category: 'engineering',
};

export default function SolarGeniusProLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <FlagshipProductSchema
        name="Solar Genius Pro"
        url={URL}
        description="Commercial solar design and engineering intelligence: load profiling, hybrid sizing, financials, EPRA-aware compliance, proposal-ready outputs."
        category="Solar Engineering"
        applicationCategory="EngineeringApplication"
        keywords={['Commercial Solar', 'Hybrid Solar', 'EPRA', 'Solar Sizing', 'Solar Financials']}
        industry="EPCs, Facility Managers, C&I Buyers"
        priceKes="Free"
      />
      {children}
      <ToolSeoContent tool="solar-genius-pro" />
    </>
  );
}
