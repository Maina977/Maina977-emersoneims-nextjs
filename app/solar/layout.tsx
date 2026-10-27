import { Metadata } from 'next';
import ToolSeoContent from '@/components/seo/ToolSeoContent';
import Script from 'next/script';

/**
 * /solar — SEO metadata.
 *
 * 2026-10-25 audit: the title, Open Graph text and JSON-LD described "10 AI
 * engines", voice control, a drone commander and 15 countries — none of which
 * the page offers — plus an FAQPage whose questions were not on the page
 * (Google requires FAQ markup to match visible content). The OG image did not
 * exist. Everything below describes what the page actually has.
 */

const DESCRIPTION =
  'Solar for homes, farms and businesses in Kenya: design, supply, installation and maintenance, with free sizing and savings calculators before you commit.';
const OG_IMAGE = '/images/solar%20power%20farms.png';

export const metadata: Metadata = {
  title: 'Solar Installation & Free Sizing Tools', // + ' | EmersonEIMS Kenya' = 58 characters
  description: DESCRIPTION,
  authors: [{ name: 'EmersonEIMS' }],
  creator: 'EmersonEIMS',
  publisher: 'EmersonEIMS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://www.emersoneims.com/solar',
    siteName: 'EmersonEIMS',
    title: 'Solar Installation & Free Sizing Tools Kenya',
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, alt: 'Solar power installation by EmersonEIMS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Installation & Free Sizing Tools Kenya',
    description: DESCRIPTION,
    images: [OG_IMAGE],
    creator: '@EmersonEiMS',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/solar',
  },
  category: 'Technology',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Solar design, supply and installation',
      serviceType: 'Solar PV system design and installation',
      description: DESCRIPTION,
      provider: {
        '@type': 'Organization',
        name: 'EmersonEIMS',
        telephone: '+254768860665',
        email: 'info@emersoneims.com',
      },
      areaServed: { '@type': 'Country', name: 'Kenya' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
        { '@type': 'ListItem', position: 2, name: 'Solar', item: 'https://www.emersoneims.com/solar' },
      ],
    },
  ],
};

export default function SolarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="solar-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
      <ToolSeoContent tool="solar" />
    </>
  );
}
