import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  /*
   * The brand was in here TWICE. This title read "Contact EmersonEIMS | ... |
   * 24/7 Power & Solar Emergency" and the root layout appends
   * "| EmersonEIMS Kenya", so the served title was 86 characters and ended
   * "...Emerge| EmersonEIMS Kenya" in results — the brand shown once in full
   * and once chopped. Dropping our own brand here leaves the template to say it
   * once, and leaves room for the phone number, which is the whole point of a
   * contact page appearing in a search result.
   */
  title: 'Contact Us — +254 768 860 665, 24/7',
  description:
    'Talk to EmersonEIMS engineers. Call +254 768 860 665 or WhatsApp any time — 24/7 emergency response across all 47 counties, office in Nairobi.',
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: 'Contact EmersonEIMS | 24/7 Power & Solar Emergency Kenya',
    description:
      '+254768860665. Nairobi HQ. 47 counties. Qualified technician site surveys. Generator, solar, borehole engineering.',
    url: `${siteUrl}/contact`,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
