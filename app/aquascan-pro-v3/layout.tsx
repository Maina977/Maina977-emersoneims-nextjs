import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import FlagshipProductSchema from '@/components/seo/FlagshipProductSchema';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const URL = `${SITE}/aquascan-pro-v3`;

export const metadata: Metadata = {
  title: 'AquaScan Pro — Borehole, Hydrogeology & Water Intelligence | EmersonEIMS',
  description:
    'AquaScan Pro is the EmersonEIMS borehole and water intelligence platform: satellite indices, GLDAS, NASA POWER, water quality and audit-grade reports — used by drillers, NGOs and county projects across Kenya.',
  keywords: [
    'borehole analysis Kenya',
    'borehole intelligence',
    'hydrogeology software',
    'water quality analysis',
    'satellite borehole survey',
    'GLDAS water modelling',
    'NASA POWER water',
    'AquaScan Pro',
    'EmersonEIMS borehole',
    'donor-grade borehole reports',
    'pump sizing Kenya',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'AquaScan Pro — Borehole & Water Intelligence | EmersonEIMS',
    description:
      'Audit-grade borehole, hydrogeology and water-quality intelligence with full data provenance — for drillers, NGOs and counties in Kenya.',
    url: URL,
    type: 'website',
    siteName: 'EmersonEIMS',
    locale: 'en_KE',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'AquaScan Pro by EmersonEIMS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AquaScan Pro — Borehole & Water Intelligence',
    description: 'Satellite, GLDAS, NASA POWER, water quality, donor-grade reports.',
    images: [`${SITE}/og-image.jpg`],
    site: '@EmersonEIMS',
  },
  robots: { index: true, follow: true },
  category: 'engineering',
};

export default function AquaScanProV3Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <FlagshipProductSchema
        name="AquaScan Pro"
        url={URL}
        description="Borehole, hydrogeology and water intelligence platform: satellite indices, GLDAS, NASA POWER, water quality and donor-grade reports."
        category="Borehole Intelligence"
        applicationCategory="EngineeringApplication"
        keywords={['Borehole Analysis', 'Hydrogeology', 'Satellite Survey', 'Water Quality', 'GLDAS', 'NASA POWER']}
        industry="Drillers, NGOs, County Governments, Agribusiness"
        priceKes="Free"
      />
      {children}
    </>
  );
}
