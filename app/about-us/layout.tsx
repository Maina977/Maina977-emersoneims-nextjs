import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'About EmersonEIMS | B2B Generator, Solar & Engineering Partner — Kenya',
  description:
    'EmersonEIMS — Nairobi-based B2B power & engineering partner. Authorised Cummins, Perkins & FG Wilson dealer covering all 47 Kenya counties. 3-year warranty, SLA-backed maintenance, 24/7 emergency response.',
  alternates: { canonical: `${siteUrl}/about-us` },
  openGraph: {
    title: 'About EmersonEIMS | B2B Generator, Solar & Engineering Partner — Kenya',
    description:
      'Authorized Cummins/Perkins/FG Wilson dealer. 47 counties, 15 African countries, 3-year warranty, AI-powered.',
    url: `${siteUrl}/about-us`,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
