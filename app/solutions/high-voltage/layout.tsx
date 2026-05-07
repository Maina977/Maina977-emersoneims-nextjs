import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'High-Voltage Engineering Kenya | Transformers, Switchgear, RMU | EmersonEIMS',
  description:
    'High-voltage engineering services in Kenya — transformer testing, RMU, MV switchgear, cable termination and substation commissioning by EmersonEIMS qualified HV engineers.',
  alternates: { canonical: `${SITE}/solutions/high-voltage` },
  openGraph: {
    title: 'High-Voltage Engineering Kenya | EmersonEIMS',
    description: 'Transformers, switchgear, RMU and substation work.',
    url: `${SITE}/solutions/high-voltage`,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
  },
  robots: { index: true, follow: true },
};

export default function HighVoltageLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
