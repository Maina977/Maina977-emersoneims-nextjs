import { Metadata } from 'next';
import Script from 'next/script';

/**
 * Solar Maintenance Hub - SEO Metadata
 * Complete solar system maintenance for Kenya and East Africa
 */

export const metadata: Metadata = {
  title: 'Solar Maintenance Hub | Solar System Diagnostics & Repair Kenya',
  description: 'Professional solar maintenance services in Kenya. Complete diagnostics for residential, commercial & industrial solar systems. Panel cleaning, battery maintenance, inverter repair. Weather-based recommendations for optimal performance.',
  keywords: [
    // Solar maintenance keywords
    'solar maintenance Kenya',
    'solar panel cleaning Kenya',
    'solar system repair Nairobi',
    'solar inverter repair Kenya',
    'solar battery maintenance',
    'solar system diagnostics',

    // System types
    'residential solar Kenya',
    'commercial solar Kenya',
    'industrial solar Kenya',
    'off-grid solar Kenya',
    'hybrid solar system Kenya',
    'solar water pump Kenya',

    // Locations
    'solar maintenance Nairobi',
    'solar repair Mombasa',
    'solar technician Kisumu',
    'solar installation Nakuru',
    'solar service Eldoret',

    // Components
    'solar panel maintenance',
    'MPPT controller service',
    'solar battery replacement',
    'inverter troubleshooting',
    'charge controller repair',

    // Brands
    'Victron solar Kenya',
    'Growatt inverter Kenya',
    'Felicity solar Kenya',
    'Must inverter Kenya',
    'Luminous solar Kenya',
    'Sunking solar Kenya',

    // East Africa
    'solar maintenance East Africa',
    'solar repair Tanzania',
    'solar service Uganda',
    'solar technician Rwanda',
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
    url: 'https://www.emersoneims.com/solar',
    siteName: 'Emerson EiMS',
    title: 'Solar Maintenance Hub | Complete Solar System Diagnostics',
    description: 'Professional solar maintenance for Kenya. Diagnostics, repair, and optimization for all solar system types. Weather-integrated recommendations.',
    images: [
      {
        url: '/images/solar-maintenance-hub-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Solar Maintenance Hub - Professional Solar Diagnostics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Maintenance Hub | Solar System Diagnostics Kenya',
    description: 'Complete solar maintenance services. Panel cleaning, battery service, inverter repair.',
    images: ['/images/solar-maintenance-hub-og.jpg'],
    creator: '@EmersonEiMS',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/solar',
  },
  category: 'Technology',
};

// Structured Data
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Solar System Maintenance',
      serviceType: 'Solar Panel Maintenance and Repair',
      description: 'Complete solar system maintenance including panel cleaning, battery service, inverter repair, and system optimization for residential, commercial, and industrial installations.',
      provider: {
        '@type': 'Organization',
        name: 'Emerson Industrial Maintenance Services',
        telephone: '+254782914717',
        email: 'info@emersoneims.com',
      },
      areaServed: [
        { '@type': 'Country', name: 'Kenya' },
        { '@type': 'Country', name: 'Tanzania' },
        { '@type': 'Country', name: 'Uganda' },
        { '@type': 'Country', name: 'Rwanda' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Solar Maintenance Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Solar Panel Cleaning',
              description: 'Professional cleaning of solar panels to maximize energy output',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Battery Maintenance',
              description: 'Solar battery testing, water level checks, and replacement',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Inverter Repair',
              description: 'Solar inverter diagnostics, repair, and replacement',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'System Optimization',
              description: 'Full solar system audit and performance optimization',
            },
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How often should solar panels be cleaned in Kenya?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In Kenya, solar panels should be cleaned monthly during the dry season and every 2-3 months during rainy periods. Areas with high dust (like near roads or construction sites) may need weekly cleaning for optimal performance.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the lifespan of solar batteries in Kenya?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Lead-acid batteries typically last 3-5 years, while lithium batteries can last 10-15 years. Proper maintenance including regular water checks, avoiding deep discharge, and temperature control can extend battery life significantly.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why is my solar system producing less power?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Common causes include dirty panels, shading from new obstacles, battery degradation, inverter issues, or wiring problems. Weather conditions also affect output - cloudy days produce 25-50% less power than sunny days.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you service all brands of solar equipment?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, we service all major brands including Victron, Growatt, Felicity, Must, Luminous, Sunking, and others. Our technicians are trained on various inverter and charge controller systems.',
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
          name: 'Solar',
          item: 'https://www.emersoneims.com/solar',
        },
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
    </>
  );
}
