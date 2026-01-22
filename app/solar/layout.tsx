import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solar Power Solutions Kenya | Commercial & Residential Solar Installation | EmersonEIMS',
  description: 'Leading solar installation company in Kenya. Complete solar solutions: panels, batteries, inverters for homes, businesses, industries. 47 counties coverage. 25-year warranty. Free consultation. Calculate your savings today.',
  keywords: [
    // Primary Keywords
    'solar installation Kenya',
    'solar panels Kenya',
    'solar power systems Nairobi',
    'commercial solar Kenya',
    'residential solar Kenya',
    'solar company Kenya',
    // Products
    'solar panels for sale Kenya',
    'solar batteries Kenya',
    'solar inverters Kenya',
    'lithium batteries solar',
    'LFP batteries Kenya',
    'hybrid solar system',
    // Services
    'solar installation services',
    'solar system design Kenya',
    'solar maintenance Kenya',
    'solar repair Kenya',
    'off-grid solar Kenya',
    'grid-tied solar Kenya',
    // Applications
    'solar for homes Kenya',
    'solar for businesses Kenya',
    'solar for hospitals Kenya',
    'solar for hotels Kenya',
    'solar for factories Kenya',
    'solar for schools Kenya',
    'solar for farms Kenya',
    'solar irrigation Kenya',
    'solar water pumping',
    // County Coverage
    'solar Nairobi',
    'solar Mombasa',
    'solar Kisumu',
    'solar Nakuru',
    'solar Eldoret',
    'solar Kiambu',
    'solar Machakos',
    'solar Kajiado',
    'solar Garissa',
    'solar Turkana',
    // Benefits
    'solar savings Kenya',
    'reduce electricity bills Kenya',
    'solar ROI calculator',
    'solar payback period',
    'solar financing Kenya',
    // Technical
    'solar system sizing Kenya',
    'solar irradiance Kenya',
    'peak sun hours Kenya',
    'solar calculator Kenya',
    'kWh solar production',
    // Brands
    'tier 1 solar panels Kenya',
    'monocrystalline panels Kenya',
    'premium solar panels',
    // Long-tail
    'how much does solar cost in Kenya',
    'best solar company in Kenya',
    'solar installation cost Kenya',
    'solar power for home Nairobi',
    'commercial solar installation Kenya',
    'industrial solar solutions Kenya',
    'solar backup power Kenya',
    'solar vs generator Kenya',
    'solar energy Kenya 2024',
    'clean energy Kenya',
    'renewable energy Kenya',
    'sustainable power Kenya',
    'green energy solutions Kenya',
    'ESG solar Kenya',
  ],
  openGraph: {
    title: 'Solar Power Solutions Kenya | 47 Counties Coverage | EmersonEIMS',
    description: 'Transform your energy with premium solar solutions. 2,450+ projects completed. 98.7% system uptime. 25-year warranty. Interactive calculator for instant quotes.',
    type: 'website',
    url: 'https://emersoneims.com/solar',
    siteName: 'EmersonEIMS',
    images: [
      {
        url: 'https://www.emersoneims.com/wp-content/uploads/2025/11/SOLAR-IMAGE-KADENCE.png',
        width: 1200,
        height: 630,
        alt: 'EmersonEIMS Premium Solar Installation Kenya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Power Solutions Kenya | EmersonEIMS',
    description: 'Premium solar installations across 47 counties. Calculate your savings instantly. 25-year warranty.',
    images: ['https://www.emersoneims.com/wp-content/uploads/2025/11/SOLAR-IMAGE-KADENCE.png'],
  },
  alternates: {
    canonical: 'https://emersoneims.com/solar',
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

// JSON-LD Structured Data for Solar
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': 'https://emersoneims.com/solar/#service',
      name: 'Solar Installation Services',
      serviceType: 'Solar Panel Installation',
      provider: {
        '@type': 'Organization',
        name: 'EmersonEIMS',
        '@id': 'https://emersoneims.com/#organization',
      },
      areaServed: {
        '@type': 'Country',
        name: 'Kenya',
      },
      description: 'Complete solar solutions for homes, businesses, and industries across all 47 Kenya counties. 25-year warranty on panels.',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Solar Products & Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Residential Solar Installation',
              description: 'Complete home solar systems from 3kW to 20kW with professional installation',
              provider: { '@id': 'https://emersoneims.com/#organization' },
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Commercial Solar Installation',
              description: 'Business and industrial solar from 20kW to 1MW+ with turnkey solutions',
              provider: { '@id': 'https://emersoneims.com/#organization' },
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Solar Battery Storage Solutions',
              description: 'LFP lithium batteries for energy storage with installation and warranty',
              provider: { '@id': 'https://emersoneims.com/#organization' },
            },
          },
        ],
      },
    },
    {
      '@type': 'Product',
      '@id': 'https://emersoneims.com/solar/#product',
      name: 'Solar Panel Systems Kenya',
      image: 'https://www.emersoneims.com/wp-content/uploads/2025/11/SOLAR-IMAGE-KADENCE.png',
      brand: {
        '@type': 'Brand',
        name: 'EmersonEIMS Solar',
      },
      description: 'Premium tier-1 solar panels with 25-year performance warranty',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'KES',
        lowPrice: '150000',
        highPrice: '15000000',
        availability: 'https://schema.org/InStock',
        seller: { '@id': 'https://emersoneims.com/#organization' },
        offerCount: '100',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '2450',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://emersoneims.com/solar/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does solar cost in Kenya?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Solar system costs in Kenya range from KSh 150,000 for a basic home system (3kW) to KSh 15,000,000+ for large commercial installations. The cost depends on system size, battery storage, and installation complexity. Our calculator provides instant estimates.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does solar take to pay back?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Typical solar payback period in Kenya is 3-5 years depending on your electricity costs and system size. After payback, you enjoy virtually free electricity for the remaining 20+ years of panel life.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does solar work in all Kenya counties?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Kenya has excellent solar potential with 5.0-6.5 kWh/m²/day solar irradiance across all 47 counties. Northern counties like Turkana, Garissa, and Marsabit have the highest solar potential.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://emersoneims.com' },
        { '@type': 'ListItem', position: 2, name: 'Solar', item: 'https://emersoneims.com/solar' },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
