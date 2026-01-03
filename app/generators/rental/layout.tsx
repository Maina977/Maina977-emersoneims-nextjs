import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Rental Kenya | Daily, Weekly, Monthly | 7.5kVA to 2MVA | EmersonEIMS',
  description: 'Generator rental services across all 47 Kenya counties. Rent generators from 7.5kVA to 2MVA for events, construction, emergencies. Same-day delivery in Nairobi. Silent generators for weddings, concerts, corporate events. 24/7 support.',
  keywords: [
    // Primary Rental Keywords
    'generator rental Kenya',
    'generator hire Kenya',
    'rent generator Nairobi',
    'generator for hire',
    'portable generator rental',
    'industrial generator rental',
    // Size Categories
    'small generator rental',
    '10 kVA generator rental',
    '20 kVA generator rental',
    '50 kVA generator rental',
    '100 kVA generator rental',
    '200 kVA generator rental',
    '500 kVA generator rental',
    '1000 kVA generator rental',
    '1 MVA generator rental',
    '2 MVA generator rental',
    // Events
    'generator for wedding Kenya',
    'generator for events',
    'generator for concert',
    'generator for outdoor event',
    'generator for corporate event',
    'silent generator rental',
    'quiet generator for events',
    // Construction
    'construction site generator',
    'generator for construction',
    'temporary power rental',
    'site power rental',
    // Emergency
    'emergency generator rental',
    'backup generator rental',
    'standby generator rental',
    'hospital backup generator',
    // Location Keywords
    'generator rental Mombasa',
    'generator rental Kisumu',
    'generator rental Nakuru',
    'generator rental Eldoret',
    'generator hire Nairobi',
    // Terms
    'daily generator rental',
    'weekly generator rental',
    'monthly generator rental',
    'long term generator rental',
    'short term generator hire',
    // Film/Production
    'generator for film production',
    'generator for TV production',
    'quiet generator filming',
    // Long-tail
    'how much to rent a generator in Kenya',
    'generator rental prices Kenya',
    'generator rental cost Nairobi',
    'cheap generator rental Kenya',
    'best generator rental company Kenya',
    'generator rental with delivery',
    'generator rental with operator',
  ],
  openGraph: {
    title: 'Generator Rental Kenya | 7.5kVA - 2MVA | All 47 Counties',
    description: 'Rent generators for any occasion. 50+ units available. Same-day delivery. Silent units for events. 24/7 support. Best rates in Kenya.',
    type: 'website',
    url: 'https://emersoneims.com/generators/rental',
    siteName: 'EmersonEIMS',
    images: [
      {
        url: 'https://www.emersoneims.com/wp-content/uploads/2024/09/generator-rental.jpg',
        width: 1200,
        height: 630,
        alt: 'EmersonEIMS Generator Rental Fleet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator Rental Kenya | EmersonEIMS',
    description: 'Rent generators 7.5kVA-2MVA. Events, construction, emergencies. All 47 counties.',
  },
  alternates: {
    canonical: 'https://emersoneims.com/generators/rental',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Structured Data for Rental Services
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': 'https://emersoneims.com/generators/rental/#service',
      name: 'Generator Rental Services',
      serviceType: 'Equipment Rental',
      provider: {
        '@type': 'Organization',
        name: 'EmersonEIMS',
        '@id': 'https://emersoneims.com/#organization',
      },
      areaServed: { '@type': 'Country', name: 'Kenya' },
      description: 'Generator rental from 7.5kVA to 2MVA for events, construction, and emergencies across all 47 Kenya counties.',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'KES',
        availability: 'https://schema.org/InStock',
        eligibleDuration: ['P1D', 'P7D', 'P30D'],
        priceSpecification: [
          { '@type': 'PriceSpecification', name: 'Daily Rental', minPrice: 5000, maxPrice: 400000, priceCurrency: 'KES' },
          { '@type': 'PriceSpecification', name: 'Weekly Rental', minPrice: 25000, maxPrice: 2000000, priceCurrency: 'KES' },
          { '@type': 'PriceSpecification', name: 'Monthly Rental', minPrice: 80000, maxPrice: 6000000, priceCurrency: 'KES' },
        ],
      },
    },
    {
      '@type': 'RentalCarReservation', // Using generic rental schema
      '@id': 'https://emersoneims.com/generators/rental/#rental',
      provider: { '@id': 'https://emersoneims.com/#organization' },
      itemOffered: {
        '@type': 'Product',
        name: 'Generator Rental Fleet',
        description: 'Silent diesel generators from 7.5kVA to 2MVA',
        brand: ['Cummins', 'Caterpillar', 'Perkins', 'FG Wilson'],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://emersoneims.com/generators/rental/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What size generator do I need?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Generator sizing depends on your total load. Average home: 5-10 kVA, Small office: 15-20 kVA, Wedding venue: 50-100 kVA, Factory: 100-500 kVA. Our team can do a free load assessment.',
          },
        },
        {
          '@type': 'Question',
          name: 'How quickly can you deliver?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Within Nairobi: Same day delivery for orders placed before 12pm. Outside Nairobi: 24-48 hours depending on location. For urgent requirements, call our emergency line.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is included in the rental price?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our rental includes: generator with silenced canopy, fuel tank, distribution board, delivery and setup within Nairobi, commissioning, 24/7 technical support, and collection.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://emersoneims.com' },
        { '@type': 'ListItem', position: 2, name: 'Generators', item: 'https://emersoneims.com/generators' },
        { '@type': 'ListItem', position: 3, name: 'Rental', item: 'https://emersoneims.com/generators/rental' },
      ],
    },
  ],
};

export default function RentalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
