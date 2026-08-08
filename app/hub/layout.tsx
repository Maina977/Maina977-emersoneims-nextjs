import * as React from 'react';
import type { Metadata } from 'next';
import HubChromeIsolator from '@/components/hub/HubChromeIsolator';
import FlagshipProductSchema from '@/components/seo/FlagshipProductSchema';
import './hub.css';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const URL = `${SITE}/hub`;

export const metadata: Metadata = {
  /*
   * "Intelligence Hub" is not a search anyone performs. This page sits at
   * POSITION 34.7 — page four — with 7 impressions and no clicks, and its
   * sub-pages fare little better (/hub/ups-lab 11 impressions at 10.6,
   * /hub/product-intelligence 11 at 19.3, both zero clicks).
   *
   * The words people actually type are "UPS sizing", "inverter battery
   * calculator" and "how long will my UPS last". Job first, as with the other
   * tools; the "Hub" branding survives in the page itself.
   */
  /*
   * Object form, not a bare string. A segment whose `title` is a plain string
   * leaves its DESCENDANTS with no template to inherit, so the root layout's
   * "%s | EmersonEIMS Kenya" stopped applying and all 17 /hub/* pages rendered
   * with no brand at all. `default` titles this page; `template` is what the
   * children inherit.
   */
  title: {
    default: 'UPS & Inverter Sizing Calculator — Free',
    template: '%s | EmersonEIMS Kenya',
  },
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
  /*
   * NO canonical here — layout metadata is INHERITED by every child page, so
   * this made each sub-page canonicalise to the section root and forfeit its
   * own indexing while still being listed in the sitemap. The root layout
   * (app/layout.tsx) emits a correct self-referential canonical from the
   * x-pathname header.
   */
  openGraph: {
    title: 'Solar & UPS Intelligence Hub',
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
