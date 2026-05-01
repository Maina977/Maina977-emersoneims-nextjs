import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'AquaScan Pro V3 | AI borehole, satellite, water & reports | EmersonEIMS',
  description:
    'AquaScan Pro: satellite indices, GLDAS, water quality, nearby boreholes, and full site analysis. Uses EmersonEIMS /api/borehole and payment/notification routes — one integrated stack.',
  alternates: { canonical: `${siteUrl}/aquascan-pro-v3` },
  openGraph: {
    title: 'AquaScan Pro V3 | EmersonEIMS',
    url: `${siteUrl}/aquascan-pro-v3`,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function AquaScanProV3Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
