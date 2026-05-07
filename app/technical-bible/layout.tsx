import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'Technical Bible | Generator, Solar & UPS Engineering Reference | EmersonEIMS',
  description:
    'The Technical Bible — deep engineering documentation for generators, solar PV, UPS, motors and boreholes. Standards, derate factors, fault trees, single-line diagrams and field procedures used by EmersonEIMS engineers.',
  alternates: { canonical: `${SITE}/technical-bible` },
  openGraph: {
    title: 'Technical Bible | EmersonEIMS',
    description: 'Engineering reference: generators, solar, UPS, motors, boreholes.',
    url: `${SITE}/technical-bible`,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
  },
  robots: { index: true, follow: true },
};

export default function TechnicalBibleLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
