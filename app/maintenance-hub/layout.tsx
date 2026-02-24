import { Metadata } from 'next';
import Script from 'next/script';

/**
 * Maintenance Hub - Main SEO Layout
 * Central hub for all maintenance services in Kenya
 */

export const metadata: Metadata = {
  title: 'Maintenance Hub | Complete Industrial Maintenance Services Kenya',
  description: 'Your one-stop maintenance solution in Kenya. Generator diagnostics, solar maintenance, pump repair, motor rewinding, AC service, electrical work. 24/7 professional support across Nairobi, Mombasa, Kisumu.',
  keywords: [
    // Main keywords
    'maintenance services Kenya',
    'industrial maintenance Kenya',
    'equipment maintenance Nairobi',
    'maintenance hub Kenya',
    'facility maintenance Kenya',

    // Generators
    'generator maintenance Kenya',
    'generator repair Nairobi',
    'generator fault codes',
    'generator diagnostics',

    // Solar
    'solar maintenance Kenya',
    'solar repair Nairobi',
    'solar panel cleaning',
    'solar system service',

    // Pumps & Motors
    'pump repair Kenya',
    'motor rewinding Nairobi',
    'borehole pump Kenya',
    'submersible pump repair',

    // AC & Electrical
    'AC repair Kenya',
    'electrical services Nairobi',
    'air conditioning Kenya',
    'electrical maintenance',

    // Locations
    'maintenance Nairobi',
    'maintenance Mombasa',
    'maintenance Kisumu',
    'maintenance Nakuru',
    'maintenance Eldoret',

    // Service types
    '24/7 maintenance Kenya',
    'emergency repair Kenya',
    'preventive maintenance',
    'industrial service Kenya',
  ],
  authors: [{ name: 'Emerson Industrial Maintenance Services' }],
  creator: 'Emerson EiMS',
  publisher: 'Emerson Industrial Maintenance Services Limited',
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
    locale: 'en_US',
    url: 'https://www.emersoneims.com/maintenance-hub',
    siteName: 'Emerson EiMS',
    title: 'Maintenance Hub | Complete Maintenance Solutions Kenya',
    description: 'Generator diagnostics, solar maintenance, pump repair, motor rewinding, AC service. All your maintenance needs in one place.',
    images: [
      {
        url: '/images/maintenance-hub-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Maintenance Hub - Complete Industrial Maintenance Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maintenance Hub | Industrial Maintenance Kenya',
    description: 'Generator, solar, pumps, motors, AC, electrical - all maintenance services in one hub.',
    images: ['/images/maintenance-hub-og.jpg'],
    creator: '@EmersonEiMS',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/maintenance-hub',
  },
  category: 'Business',
};

// Structured Data
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.emersoneims.com/#organization',
      name: 'Emerson Industrial Maintenance Services',
      alternateName: 'Emerson EiMS',
      url: 'https://www.emersoneims.com',
      logo: 'https://www.emersoneims.com/logo.png',
      description: 'Complete industrial maintenance services in Kenya including generator diagnostics, solar maintenance, pump repair, motor rewinding, and electrical services.',
      telephone: '+254782914717',
      email: 'info@emersoneims.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nairobi',
        addressCountry: 'KE',
      },
      areaServed: [
        { '@type': 'Country', name: 'Kenya' },
        { '@type': 'Country', name: 'Tanzania' },
        { '@type': 'Country', name: 'Uganda' },
        { '@type': 'Country', name: 'Rwanda' },
      ],
      sameAs: [
        'https://www.facebook.com/emersoneims',
        'https://twitter.com/EmersonEiMS',
        'https://www.linkedin.com/company/emerson-eims',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.emersoneims.com/#website',
      url: 'https://www.emersoneims.com',
      name: 'Emerson EiMS Maintenance Hub',
      publisher: {
        '@id': 'https://www.emersoneims.com/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.emersoneims.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'ItemList',
      name: 'Maintenance Services',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Generator Oracle',
          url: 'https://www.emersoneims.com/generator-oracle',
          description: '400,000+ fault codes for generator diagnostics',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Solar Maintenance',
          url: 'https://www.emersoneims.com/maintenance-hub/solar',
          description: 'Complete solar system diagnostics and repair',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'General Services',
          url: 'https://www.emersoneims.com/maintenance-hub/general',
          description: 'Pumps, motors, AC, electrical services',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Spare Parts',
          url: 'https://www.emersoneims.com/spare-parts',
          description: '1,560+ genuine spare parts available',
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.emersoneims.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Maintenance Hub',
          item: 'https://www.emersoneims.com/maintenance-hub',
        },
      ],
    },
  ],
};

export default function MaintenanceHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="maintenance-hub-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
