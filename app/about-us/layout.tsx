import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'About EmersonEIMS | Kenya\'s #1 Generator & Solar Engineering Company',
  description:
    'EmersonEIMS — founded 2013 in Nairobi. Authorized Cummins, Perkins & FG Wilson dealer covering 47 Kenya counties and 15 African countries. AI-powered diagnostics, 3-year warranty, 24/7 emergency response.',
  alternates: { canonical: `${siteUrl}/about-us` },
  openGraph: {
    title: 'About EmersonEIMS | Kenya\'s #1 Generator & Solar Company',
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
