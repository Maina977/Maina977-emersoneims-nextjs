import * as React from 'react';
import type { Metadata } from 'next';
import HubChromeIsolator from '@/components/hub/HubChromeIsolator';
import FlagshipProductSchema from '@/components/seo/FlagshipProductSchema';
import './hub.css';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const URL = `${SITE}/hub`;

export const metadata: Metadata = {
  title: 'Solar & UPS Intelligence Hub — Sizing, Verification & Compatibility | EmersonEIMS',
  description:
    'Solar & UPS Intelligence Hub: smart sizing simulator, quotation audit, product intelligence, safety & diagnostics and a curated case library — built and maintained by EmersonEIMS engineers in Kenya.',
  keywords: [
    'solar UPS hub',
    'solar sizing simulator Kenya',
    'UPS sizing tool',
    'quotation audit solar',
    'solar product intelligence',
    'EmersonEIMS Hub',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Solar & UPS Intelligence Hub | EmersonEIMS',
    description:
      'Smart sizing, quotation audit, product intelligence and a curated case library for Kenya solar & UPS.',
    url: URL,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'Solar & UPS Intelligence Hub by EmersonEIMS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar & UPS Intelligence Hub',
    description: 'Smart sizing, quotation audit, product intelligence, case library.',
    images: [`${SITE}/og-image.jpg`],
    site: '@EmersonEIMS',
  },
  robots: { index: true, follow: true },
  category: 'engineering',
};

export default function HubLayout({ children }: { children: React.ReactNode }) {
  // Suppress global nav/footer, enforce locked shell
  return (
    <>
      <HubChromeIsolator />
      <FlagshipProductSchema
        name="Solar & UPS Intelligence Hub"
        url={URL}
        description="Smart sizing simulator, quotation audit, product intelligence, safety & diagnostics and a curated case library."
        category="Solar & UPS Intelligence"
        applicationCategory="EngineeringApplication"
        keywords={['Solar Sizing', 'UPS Sizing', 'Quotation Audit', 'Product Intelligence', 'Case Library']}
        industry="Facility Managers, EPCs, Procurement"
        priceKes="Free"
      />
      {children}
    </>
  );
}
