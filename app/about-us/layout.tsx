import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'About Us | Power & Engineering in Kenya',
  description:
    'EmersonEIMS — Nairobi-based B2B power & engineering partner. Cummins, Perkins & FG Wilson generator sales & maintenance specialist. 47 Kenya counties coverage. 2-year warranty, SLA-backed maintenance, 24/7 emergency response.',
  alternates: { canonical: `${siteUrl}/about-us` },
  openGraph: {
    title: 'About EmersonEIMS | B2B Generator, Solar & Engineering Partner — Kenya',
    description:
      'Cummins, Perkins & FG Wilson generator specialist. Multi-brand engineering partner for 47 Kenya counties. 2-year warranty, SLA maintenance, 24/7 support.',
    url: `${siteUrl}/about-us`,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
