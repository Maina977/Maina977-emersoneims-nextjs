import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'Authorized Brands | Cummins · Perkins · FG Wilson · ABB | EmersonEIMS',
  description:
    'EmersonEIMS is the authorized Kenya dealer for Cummins, Perkins, FG Wilson, ABB, Schneider Electric, Caterpillar, John Deere, and more. Genuine parts, factory training, OEM warranty.',
  alternates: { canonical: `${siteUrl}/brands` },
  openGraph: {
    title: 'Authorized Brands | EmersonEIMS Kenya',
    description:
      'Cummins, Perkins, FG Wilson, ABB, Schneider, Caterpillar — authorized Kenya dealer. Genuine parts + OEM warranty.',
    url: `${siteUrl}/brands`,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function BrandsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
