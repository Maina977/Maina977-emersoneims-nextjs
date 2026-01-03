import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cummins & Voltka Generators 10-2000KVA Kenya | 1 Year Free Service | EmersonEIMS",
  description: "Buy NEW Cummins & Voltka diesel generators in Kenya. 10kVA to 2000kVA with complete warranty + 1 year FREE maintenance. Same-day quotes. Delivery to Nairobi, Mombasa, Kisumu & all 47 counties. Authorized Cummins dealer. Generator sales, installation, maintenance, rental, spare parts.",
  keywords: [
    // Brand Keywords
    'cummins generators Kenya',
    'voltka generators Kenya', 
    'perkins generators Kenya',
    'caterpillar generators Kenya',
    'FG Wilson generators Kenya',
    // Size Keywords
    '10kva generator Kenya',
    '20kva generator Kenya',
    '50kva generator Kenya',
    '100kva generator Kenya',
    '200kva generator Kenya',
    '500kva generator Kenya',
    '1000kva generator Kenya',
    '1 mva generator Kenya',
    '2000kva generator Kenya',
    // Type Keywords
    'diesel generator Kenya',
    'silent generator Kenya',
    'soundproof generator Kenya',
    'industrial generator Kenya',
    'commercial generator Kenya',
    'standby generator Kenya',
    'prime power generator Kenya',
    // Service Keywords
    'generator sales Kenya',
    'generator installation Kenya',
    'generator maintenance Kenya',
    'generator repair Kenya',
    'generator spare parts Kenya',
    'generator rental Kenya',
    // Location Keywords
    'generator Nairobi',
    'generator Mombasa',
    'generator Kisumu',
    'generator Nakuru',
    'generator Eldoret',
    'cummins dealer Nairobi',
    'generator supplier Kenya',
    // Long-tail
    'buy generator Kenya',
    'generator price Kenya',
    'generator for sale Nairobi',
    'best generator company Kenya',
    'generator with warranty Kenya',
    'generator free maintenance',
  ].join(', '),
  openGraph: {
    title: 'Cummins & Voltka Generators Kenya | 10-2000kVA | EmersonEIMS',
    description: 'Kenya\'s leading generator supplier. Cummins authorized dealer. NEW generators with warranty + 1 year free maintenance. All 47 counties.',
    type: 'website',
    url: 'https://emersoneims.com/generators',
    siteName: 'EmersonEIMS',
    images: [
      {
        url: 'https://www.emersoneims.com/wp-content/uploads/2024/09/cummins-generator.jpg',
        width: 1200,
        height: 630,
        alt: 'Cummins Generator Kenya - EmersonEIMS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cummins Generators Kenya | EmersonEIMS',
    description: 'Buy NEW Cummins generators in Kenya. 10kVA-2000kVA. 1 year free service.',
  },
  alternates: {
    canonical: 'https://emersoneims.com/generators',
  },
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
};

// JSON-LD Structured Data for Generators
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://emersoneims.com/#organization',
      name: 'EmersonEIMS',
      url: 'https://emersoneims.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://emersoneims.com/logo.png',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+254768860655',
          contactType: 'sales',
          areaServed: 'KE',
          availableLanguage: ['English', 'Swahili'],
        },
        {
          '@type': 'ContactPoint',
          telephone: '+254782914717',
          contactType: 'customer service',
          areaServed: 'KE',
          availableLanguage: ['English', 'Swahili'],
        },
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Old North Airport Road',
        addressLocality: 'Nairobi',
        postalCode: '00521',
        addressCountry: 'KE',
      },
      sameAs: [
        'https://www.facebook.com/emersoneims',
        'https://twitter.com/emersoneims',
        'https://www.linkedin.com/company/emersoneims',
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://emersoneims.com/generators/#webpage',
      url: 'https://emersoneims.com/generators',
      name: 'Generators - Cummins & Voltka Diesel Generators Kenya',
      isPartOf: { '@id': 'https://emersoneims.com/#website' },
      about: { '@id': 'https://emersoneims.com/#organization' },
      description: 'Buy NEW Cummins & Voltka diesel generators in Kenya. 10kVA to 2000kVA with warranty and free maintenance.',
    },
    {
      '@type': 'Product',
      '@id': 'https://emersoneims.com/generators/#product',
      name: 'Cummins Diesel Generators',
      brand: {
        '@type': 'Brand',
        name: 'Cummins',
      },
      description: 'Premium Cummins diesel generators from 10kVA to 2000kVA with 1 year free maintenance service',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'KES',
        availability: 'https://schema.org/InStock',
        seller: { '@id': 'https://emersoneims.com/#organization' },
        offerCount: '50+',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '847',
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://emersoneims.com/#localbusiness',
      name: 'EmersonEIMS - Generator Sales & Services',
      image: 'https://emersoneims.com/logo.png',
      telephone: '+254768860655',
      email: 'info@emersoneims.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Old North Airport Road',
        addressLocality: 'Nairobi',
        postalCode: '00521',
        addressCountry: 'KE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -1.2921,
        longitude: 36.8219,
      },
      url: 'https://emersoneims.com',
      priceRange: '$$',
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
          opens: '08:00',
          closes: '13:00',
        },
      ],
      areaServed: {
        '@type': 'Country',
        name: 'Kenya',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://emersoneims.com/generators/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://emersoneims.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Generators',
          item: 'https://emersoneims.com/generators',
        },
      ],
    },
  ],
};

export default function GeneratorsLayout({
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


