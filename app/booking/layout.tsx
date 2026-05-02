import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'Book a Service | Generator, Solar, Borehole | EmersonEIMS Kenya',
  description:
    'Book free consultation, site survey, installation, or maintenance. Same-day response across 47 Kenya counties. Generator, solar, borehole, motor, ATS — call +254768860665 or book online.',
  alternates: { canonical: `${siteUrl}/booking` },
  openGraph: {
    title: 'Book a Service | EmersonEIMS Kenya',
    description:
      'Free consultation & site survey. Same-day response, 47 counties. Generator / solar / borehole / motor.',
    url: `${siteUrl}/booking`,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function BookingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
