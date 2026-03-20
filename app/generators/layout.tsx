import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CUMMINS Generators Kenya | Authorized VOLTKA Dealer | 3-YEAR WARRANTY + 1 Year Free Service | EmersonEIMS",
  description: "Kenya's AUTHORIZED CUMMINS/VOLTKA Dealer. 10KVA-2000KVA diesel generators with 3-YEAR WARRANTY + 1 YEAR FREE SERVICE. Genuine parts, expert installation, 24/7 support. Serving Nairobi, Mombasa, Kisumu & all 47 counties. Call +254793573208",
  // NOTE: keywords meta tag removed - Google ignores it since 2009
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
          telephone: '+254768860665',
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
        streetAddress: 'Embakasi, off Airport North Road',
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
      name: 'Cummins Diesel Generators by Voltka - Authorized Dealer Kenya',
      image: 'https://www.emersoneims.com/wp-content/uploads/2024/09/cummins-generator.jpg',
      brand: {
        '@type': 'Brand',
        name: 'Cummins',
      },
      manufacturer: {
        '@type': 'Organization',
        name: 'Voltka',
      },
      description: 'Authorized Cummins/Voltka dealer in Kenya. 10KVA to 2000KVA diesel generators with 3-YEAR WARRANTY + 1 YEAR FREE SERVICE. Genuine parts, expert installation.',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'KES',
        lowPrice: '850000',
        highPrice: '48000000',
        availability: 'https://schema.org/InStock',
        seller: { '@id': 'https://emersoneims.com/#organization' },
        offerCount: '50',
        warranty: '3 Years Comprehensive Warranty + 1 Year Free Service',
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
      telephone: '+254768860665',
      email: 'info@emersoneims.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Embakasi, off Airport North Road',
        addressLocality: 'Nairobi',
        postalCode: '00521',
        addressCountry: 'KE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -1.3200,
        longitude: 36.8900,
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


