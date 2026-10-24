import type { Metadata } from 'next';
import EimsProClient from './EimsProClient';
import B2BCommercialBand from '@/components/b2b/B2BCommercialBand';
import { B2B_PROFILES } from '@/lib/b2b/pageProfiles';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const URL = `${SITE}/solutions/building`; // canonical (2026-10-20)

export const metadata: Metadata = {
  // 2026-10-19 tool audit: promised "phases, reports, BIM, costing and AI
  // assist". What loads here is the Building Suite; describe that.
  title: 'EIMS PRO | Building Design Calculators',
  description:
    'EIMS PRO opens the EmersonEIMS Building Suite: free wind, seismic, RC beam, steel bolt, bearing capacity, runoff, U-value, daylight and acoustics calculators, each worked to the cited code clause.',
  keywords: [
    'EIMS PRO',
    'Building Suite Pro',
    'construction engineering software Kenya',
    'structural calculators Kenya',
    'wind load calculator',
    'EmersonEIMS PRO',
  ],
  robots: { index: true, follow: true },
  // Same suite as /solutions/building: one canonical page for it (2026-10-20 audit).
  alternates: { canonical: '/solutions/building' },
  openGraph: {
    title: 'EIMS PRO — Building Design Calculators',
    description: 'Free structural, wind, geotechnical, daylight and acoustics calculators with the code clause on every result.',
    url: URL,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'EIMS PRO by EmersonEIMS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EIMS PRO — Building Design Calculators',
    description: 'Structural, wind, geotechnical, daylight and acoustics calculators.',
    images: [`${SITE}/og-image.jpg`],
    site: '@EmersonEIMS',
  },
  category: 'engineering',
};

export default function EimsProPage() {
  return (
    <>
      {/* Product schema lives on /solutions/building, this page's canonical (2026-10-20). */}
      <B2BCommercialBand profile={B2B_PROFILES.buildingSuite} />
      {/*
        EimsProClient is dynamically imported with ssr:false, so NOTHING it
        renders reaches the initial HTML. A Googlebot scan on 2026-07-31 found
        this page serving no <h1> at all. This heading is server-rendered so the
        page states what it is before any JavaScript runs; the visual design is
        unchanged because the client workspace renders its own chrome below.
      */}
      <h1 className="sr-only">EIMS PRO — Building Design Calculators</h1>
      <EimsProClient />
    </>
  );
}
