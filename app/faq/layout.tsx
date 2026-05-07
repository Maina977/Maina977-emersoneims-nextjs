import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'Generator, Solar & UPS FAQ Kenya | Sizing, Cost, Maintenance | EmersonEIMS',
  description:
    'Answers to the most common questions about generators, solar, UPS, motor rewinding, boreholes and incinerators in Kenya. Sizing, pricing, warranty, maintenance, NEMA compliance and more.',
  alternates: { canonical: `${SITE}/faq` },
  openGraph: {
    title: 'Power Systems FAQ | EmersonEIMS Kenya',
    description: 'Generators, solar, UPS, boreholes, incinerators — your questions answered.',
    url: `${SITE}/faq`,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
  },
  robots: { index: true, follow: true },
};

export default function FAQLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
