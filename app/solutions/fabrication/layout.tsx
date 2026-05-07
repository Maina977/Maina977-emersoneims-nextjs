import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'Steel Fabrication & Sound-Attenuated Canopies Kenya | EmersonEIMS',
  description:
    'Custom steel fabrication, generator canopies, sound-attenuated enclosures, fuel tanks and skids — designed and welded in Nairobi by EmersonEIMS.',
  alternates: { canonical: `${SITE}/solutions/fabrication` },
  openGraph: {
    title: 'Fabrication & Canopies Kenya | EmersonEIMS',
    description: 'Custom enclosures, canopies, fuel tanks and steelwork.',
    url: `${SITE}/solutions/fabrication`,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
  },
  robots: { index: true, follow: true },
};

export default function FabricationLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
