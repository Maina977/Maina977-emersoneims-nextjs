import { Metadata } from 'next';
import Script from 'next/script';

/**
 * Services Section Layout - SEO Metadata
 * Comprehensive power solutions in Kenya
 */

export const metadata: Metadata = {
  title: 'Services | Generators, Solar, Electrical, HVAC | EmersonEIMS Kenya',
  description: 'Complete power solutions in Kenya: Cummins generators with 3-year warranty, solar installation, ATS changeovers, distribution boards, UPS, motor rewinding, AC, borehole pumps. Call +254768860665',
  keywords: [
    // Generator Keywords
    'generator services Kenya',
    'Cummins generators Kenya',
    'generator installation Nairobi',
    'generator repair Kenya',
    'generator maintenance Kenya',
    'backup power solutions Kenya',

    // Solar Keywords
    'solar installation Kenya',
    'solar panels Kenya',
    'solar companies Nairobi',
    'commercial solar Kenya',

    // Electrical Keywords
    'ATS installation Kenya',
    'automatic changeover Kenya',
    'distribution board Kenya',
    'electrical services Kenya',

    // Other Services
    'UPS systems Kenya',
    'motor rewinding Kenya',
    'AC installation Kenya',
    'borehole pump Kenya',
    'incinerator Kenya',

    // Location Keywords
    'power solutions Nairobi',
    'electrical contractor Kenya',
    'industrial electrician Kenya'
  ],
  authors: [{ name: 'Emerson Industrial Maintenance Services' }],
  creator: 'EmersonEIMS',
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
    siteName: 'EmersonEIMS',
    title: 'Professional Power Solutions | EmersonEIMS Kenya',
    description: 'Complete power solutions: Cummins generators (3-year warranty), solar, electrical, HVAC. Professional installation and maintenance. 24/7 support.',
    images: [
      {
        url: '/images/services-og.jpg',
        width: 1200,
        height: 630,
        alt: 'EmersonEIMS Services - Power Solutions Kenya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Power Solutions Kenya | EmersonEIMS',
    description: 'Generators, solar, electrical, HVAC solutions with 3-year warranty. Professional service across Kenya.',
    images: ['/images/services-og.jpg'],
    creator: '@EmersonEIMS',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/services',
  },
  category: 'Business Services',
};

// Structured Data for Services
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.emersoneims.com/#organization',
      name: 'Emerson Industrial Maintenance Services',
      description: 'Kenya\'s leading provider of power solutions including Cummins generators, solar systems, electrical services, and HVAC.',
      url: 'https://www.emersoneims.com',
      telephone: '+254768860665',
      email: 'info@emersoneims.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Industrial Area',
        addressLocality: 'Nairobi',
        addressCountry: 'KE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -1.3200,
        longitude: 36.8900,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '09:00',
          closes: '16:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Sunday',
          opens: '00:00',
          closes: '00:00',
          description: 'Emergency service available',
        },
      ],
      priceRange: 'KES 5,000 - 25,000,000',
      areaServed: [
        { '@type': 'Country', name: 'Kenya' },
        { '@type': 'Country', name: 'Uganda' },
        { '@type': 'Country', name: 'Tanzania' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'EmersonEIMS Services',
        itemListElement: [
          {
            '@type': 'OfferCatalog',
            name: 'Generator Services',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cummins Generator Sales', description: '10kVA-2000kVA with 3-year warranty' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Generator Repairs', description: '24/7 emergency repair service' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Generator Maintenance', description: 'AMC and preventive maintenance' } },
            ],
          },
          {
            '@type': 'OfferCatalog',
            name: 'Solar Energy',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Residential Solar', description: 'Home solar systems' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Commercial Solar', description: 'Business solar installations' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hybrid Systems', description: 'Solar-generator hybrid' } },
            ],
          },
          {
            '@type': 'OfferCatalog',
            name: 'Electrical Services',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'ATS Installation', description: 'Automatic transfer switches' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Distribution Boards', description: 'Panel fabrication and installation' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'UPS Systems', description: 'Sales and installation' } },
            ],
          },
          {
            '@type': 'OfferCatalog',
            name: 'Other Services',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Motor Rewinding', description: 'All motor types' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AC Installation', description: 'HVAC solutions' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Borehole Pumps', description: 'Pump installation and repair' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hospital Incinerators', description: 'Medical waste disposal' } },
            ],
          },
        ],
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '156',
      },
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
          name: 'Services',
          item: 'https://www.emersoneims.com/services',
        },
      ],
    },
  ],
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="services-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
