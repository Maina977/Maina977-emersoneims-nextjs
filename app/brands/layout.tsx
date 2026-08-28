import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'Multi-Brand Generator & Engineering Services',
  description:
    'EmersonEIMS supplies and maintains Cummins, Perkins, FG Wilson, ABB, Schneider Electric, Caterpillar generators and equipment across Kenya. Specialist sales, maintenance, genuine parts & technical support.',
  alternates: { canonical: `${siteUrl}/brands` },
  openGraph: {
    title: 'Multi-Brand Generators & Engineering',
    description:
      'Cummins, Perkins, FG Wilson, ABB, Schneider, Caterpillar sales & maintenance specialist. Genuine parts & expert support across Kenya.',
    url: `${siteUrl}/brands`,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function BrandsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
