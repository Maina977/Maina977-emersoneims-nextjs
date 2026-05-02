import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'Contact EmersonEIMS | +254768860665 | 24/7 Power & Solar Emergency',
  description:
    'Talk to EmersonEIMS engineers — call +254768860665 or WhatsApp anytime. 24/7 emergency response across 47 Kenya counties. Office in Nairobi. Free site visits for generator, solar, and borehole projects.',
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: 'Contact EmersonEIMS | 24/7 Power & Solar Emergency Kenya',
    description:
      '+254768860665. Nairobi HQ. 47 counties. Free site visits. Generator, solar, borehole engineering.',
    url: `${siteUrl}/contact`,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
