import { Metadata } from 'next';
import Script from 'next/script';

/**
 * General Services Maintenance Hub - SEO Metadata
 * Borehole pumps, motor rewinding, AC, electrical services in Kenya
 */

export const metadata: Metadata = {
  title: 'General Services Hub | Pumps, Motors, AC, Electrical Kenya',
  description: 'Professional maintenance services in Kenya: Borehole pump repair, motor rewinding, AC installation & service, electrical work. 24/7 emergency support. Certified technicians across Nairobi, Mombasa, Kisumu.',
  keywords: [
    // Borehole & Pumps
    'borehole pump repair Kenya',
    'submersible pump Kenya',
    'borehole drilling Kenya',
    'water pump maintenance Nairobi',
    'pump motor rewinding',
    'borehole pump installation',
    'Grundfos pump Kenya',
    'Pedrollo pump Kenya',
    'DAB pump Kenya',

    // Motor rewinding
    'motor rewinding Kenya',
    'motor rewinding Nairobi',
    'electric motor repair',
    'motor winding Kenya',
    'generator motor repair',
    'industrial motor repair',
    'three phase motor rewinding',
    'single phase motor repair',

    // AC & Refrigeration
    'AC repair Kenya',
    'AC installation Nairobi',
    'air conditioning service Kenya',
    'AC maintenance Kenya',
    'cold room installation Kenya',
    'refrigeration repair Kenya',
    'split AC installation',
    'AC gas refill Kenya',

    // Electrical
    'electrical services Kenya',
    'industrial electrical Kenya',
    'power factor correction Kenya',
    'electrical panel installation',
    'changeover switch Kenya',
    'ATS installation Kenya',
    'electrical wiring Kenya',

    // Locations
    'maintenance services Nairobi',
    'pump repair Mombasa',
    'motor rewinding Kisumu',
    'AC service Nakuru',
    'electrical Eldoret',
    'plumbing services Kenya',
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
    url: 'https://www.emersoneims.com/services',
    siteName: 'Emerson EiMS',
    title: 'General Services Hub | Complete Maintenance Solutions Kenya',
    description: 'Borehole pumps, motor rewinding, AC, electrical services. 24/7 professional maintenance across Kenya.',
    images: [
      {
        url: '/images/general-services-hub-og.jpg',
        width: 1200,
        height: 630,
        alt: 'General Services Hub - Professional Maintenance Kenya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'General Services Hub | Pumps, Motors, AC Kenya',
    description: 'Professional maintenance services. Borehole pumps, motor rewinding, AC, electrical.',
    images: ['/images/general-services-hub-og.jpg'],
    creator: '@EmersonEiMS',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/services',
  },
  category: 'Business',
};

// Structured Data
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.emersoneims.com/#organization',
      name: 'Emerson Industrial Maintenance Services',
      description: 'Professional maintenance services including borehole pump repair, motor rewinding, AC installation, and electrical services across Kenya.',
      url: 'https://www.emersoneims.com',
      telephone: '+254782914717',
      email: 'info@emersoneims.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nairobi',
        addressCountry: 'KE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -1.2921,
        longitude: 36.8219,
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
      priceRange: 'KES 2,500 - 500,000',
      areaServed: [
        { '@type': 'City', name: 'Nairobi' },
        { '@type': 'City', name: 'Mombasa' },
        { '@type': 'City', name: 'Kisumu' },
        { '@type': 'City', name: 'Nakuru' },
        { '@type': 'City', name: 'Eldoret' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Maintenance Services',
        itemListElement: [
          {
            '@type': 'OfferCatalog',
            name: 'Borehole Pump Services',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pump Installation' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pump Repair & Overhaul' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Borehole Rehabilitation' } },
            ],
          },
          {
            '@type': 'OfferCatalog',
            name: 'Motor Rewinding Services',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AC Motor Rewinding' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'DC Motor Repair' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'VFD Installation' } },
            ],
          },
          {
            '@type': 'OfferCatalog',
            name: 'AC & Refrigeration Services',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AC Installation' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AC Servicing' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cold Room Maintenance' } },
            ],
          },
          {
            '@type': 'OfferCatalog',
            name: 'Electrical Services',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Panel Installation' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Power Factor Correction' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Industrial Wiring' } },
            ],
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does motor rewinding cost in Kenya?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Motor rewinding costs start from KES 5,000 for small single-phase motors. Three-phase motors range from KES 8,000 to KES 50,000+ depending on size and complexity. We provide free inspection and quotes.',
          },
        },
        {
          '@type': 'Question',
          name: 'How often should AC be serviced in Kenya?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'AC units should be serviced every 3-4 months in Kenya due to dust. This includes filter cleaning, coil cleaning, and performance check. Regular service extends equipment life and maintains efficiency.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you offer emergency pump repair services?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, we offer 24/7 emergency services for borehole pumps and critical equipment. Our technicians can respond within hours in Nairobi and same-day in most other areas.',
          },
        },
        {
          '@type': 'Question',
          name: 'What brands of pumps do you service?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We service all major brands including Grundfos, Pedrollo, DAB, Calpeda, KSB, Lowara, and local brands. Our technicians are trained on various pump types including submersible, centrifugal, and booster pumps.',
          },
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
        {
          '@type': 'ListItem',
          position: 3,
          name: 'General Services',
          item: 'https://www.emersoneims.com/services',
        },
      ],
    },
  ],
};

export default function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="general-services-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
