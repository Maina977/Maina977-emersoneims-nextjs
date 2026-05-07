import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'Generator Troubleshooting Wizard Kenya | Step-by-Step Fault Diagnosis | EmersonEIMS',
  description:
    'Free interactive generator troubleshooting wizard. Diagnose starting failures, alarms, AVR, ATS, fuel, charging and load faults in minutes. Backed by EmersonEIMS field engineers — call +254 768 860 665 for on-site repair across Kenya.',
  alternates: { canonical: `${SITE}/troubleshooting` },
  openGraph: {
    title: 'Generator Troubleshooting Wizard | EmersonEIMS',
    description: 'Step-by-step generator fault diagnosis. Free interactive tool by EmersonEIMS Kenya.',
    url: `${SITE}/troubleshooting`,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator Troubleshooting Wizard | EmersonEIMS',
    description: 'Free step-by-step diagnostic tool for generators. Kenya-wide field support.',
  },
  robots: { index: true, follow: true },
};

export default function TroubleshootingLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Generator Troubleshooting Wizard',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any',
        url: `${SITE}/troubleshooting`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' },
        provider: { '@type': 'Organization', name: 'EmersonEIMS', url: SITE },
      },
      {
        '@type': 'Service',
        serviceType: 'Generator Repair & Emergency Diagnostics',
        provider: {
          '@type': 'LocalBusiness',
          name: 'EmersonEIMS',
          telephone: '+254768860665',
          areaServed: { '@type': 'Country', name: 'Kenya' },
        },
        areaServed: { '@type': 'Country', name: 'Kenya' },
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
