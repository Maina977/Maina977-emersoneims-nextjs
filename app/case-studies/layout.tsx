import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'Case Studies | Generator, Solar & UPS Projects in Kenya | EmersonEIMS',
  description:
    'Real EmersonEIMS projects across Kenya — generators, solar PV, UPS, motor rewinding and borehole installations with measured results, ROI and uptime data.',
  alternates: { canonical: `${SITE}/case-studies` },
  openGraph: {
    title: 'EmersonEIMS Case Studies — Real Projects, Real Results',
    description: 'Hospitals, hotels, banks, factories, flower farms — completed projects with verified outcomes.',
    url: `${SITE}/case-studies`,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
  },
  robots: { index: true, follow: true },
};

export default function CaseStudiesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
