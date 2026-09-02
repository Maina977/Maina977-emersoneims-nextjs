import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  // Object form, not a bare string: a bare layout title leaves the pages
  // below it with no template, so they ship unbranded. Full reasoning and
  // the sections deliberately left alone: app/ai-tools/layout.tsx.
  title: { default: 'About Us | Power & Engineering in Kenya', template: "%s | EmersonEIMS Kenya" },
  description:
    'EmersonEIMS — Nairobi-based B2B power & engineering partner. Cummins, Perkins & FG Wilson generator sales & maintenance specialist. 47 Kenya counties coverage. SLA-backed maintenance and 24/7 emergency response.',
  alternates: { canonical: `${siteUrl}/about-us` },
  openGraph: {
    title: 'About EmersonEIMS | B2B Generator, Solar & Engineering Partner — Kenya',
    description:
      'Cummins, Perkins & FG Wilson generator specialist. Multi-brand engineering partner for 47 Kenya counties. SLA maintenance, 24/7 support.',
    url: `${siteUrl}/about-us`,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
