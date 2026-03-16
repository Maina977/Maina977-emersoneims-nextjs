/**
 * Enhanced Schema Markup for Rich Snippets
 *
 * Adds structured data that competitors like ABB/Siemens use:
 * - Product schema for generators/solar
 * - HowTo schema for troubleshooting
 * - FAQ schema for common questions
 * - Service schema for each service
 * - LocalBusiness with multiple locations
 */

import { SERVICES, COUNTIES } from '@/lib/seo/kenyaLocations';

interface ProductSchemaProps {
  name: string;
  description: string;
  brand: string;
  sku: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  image?: string;
  rating?: number;
  reviewCount?: number;
}

/**
 * Product Schema - For generators, solar panels, UPS systems
 */
export function ProductSchema({
  name,
  description,
  brand,
  sku,
  price,
  currency = 'KES',
  availability = 'InStock',
  image,
  rating,
  reviewCount
}: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    sku,
    ...(price && {
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: currency,
        availability: `https://schema.org/${availability}`,
        seller: {
          '@type': 'Organization',
          name: 'EmersonEIMS'
        }
      }
    }),
    ...(image && { image }),
    ...(rating && reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: { name: string; text: string; image?: string }[];
  totalTime?: string; // ISO 8601 duration, e.g., "PT30M" for 30 minutes
  tools?: string[];
}

/**
 * HowTo Schema - For troubleshooting guides
 */
export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
  tools
}: HowToSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    ...(tools && {
      tool: tools.map(tool => ({
        '@type': 'HowToTool',
        name: tool
      }))
    }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image })
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Service Schema - For each service we offer
 */
export function ServiceSchema({
  name,
  description,
  serviceType,
  areaServed,
  provider = 'EmersonEIMS'
}: {
  name: string;
  description: string;
  serviceType: string;
  areaServed?: string[];
  provider?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    provider: {
      '@type': 'LocalBusiness',
      name: provider,
      telephone: '+254768860665',
      email: 'info@emersoneims.com'
    },
    ...(areaServed && {
      areaServed: areaServed.map(area => ({
        '@type': 'City',
        name: area
      }))
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Breadcrumb Schema - For better navigation in search results
 */
export function BreadcrumbSchema({
  items
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Video Schema - For tutorial videos
 */
export function VideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
  embedUrl
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string; // ISO 8601 duration
  contentUrl?: string;
  embedUrl?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    ...(contentUrl && { contentUrl }),
    ...(embedUrl && { embedUrl })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Local Business with Service Areas - Comprehensive location schema
 */
export function LocalBusinessWithAreasSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.emersoneims.com/#organization',
    name: 'EmersonEIMS',
    alternateName: 'Emerson Energy Infrastructure Management Solutions',
    url: 'https://www.emersoneims.com',
    logo: 'https://www.emersoneims.com/images/logo-tagline.png',
    image: 'https://www.emersoneims.com/og-image.jpg',
    description: 'Kenya\'s #1 Generator & Solar Company. 3-Year Warranty. 9 Services across 47 Counties.',
    telephone: '+254768860665',
    email: 'info@emersoneims.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Embakasi, off Airport North Road',
      addressLocality: 'Nairobi',
      addressRegion: 'Nairobi County',
      postalCode: '00100',
      addressCountry: 'KE'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.3200,
      longitude: 36.8900
    },
    areaServed: COUNTIES.map(county => ({
      '@type': 'AdministrativeArea',
      name: `${county.name} County, Kenya`
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Power Solutions Services',
      itemListElement: SERVICES.map(service => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description
        }
      }))
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      reviewCount: 347,
      bestRating: 5
    },
    priceRange: 'KES 50,000 - KES 50,000,000',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '16:00'
      }
    ],
    sameAs: [
      'https://www.facebook.com/EmersonEIMS',
      'https://twitter.com/EmersonEIMS',
      'https://www.linkedin.com/company/emersoneims',
      'https://www.youtube.com/@EmersonEIMS'
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Generator Diagnostic Tool Schema - Unique to EmersonEIMS
 */
export function DiagnosticToolSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Generator Oracle',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    description: 'Advanced generator diagnostic tool with 50,000+ fault codes, AI-powered troubleshooting, and ECM programming capabilities. The most comprehensive generator diagnostic platform in Africa.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KES',
      description: 'Free diagnostic tool for generator technicians'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.9,
      reviewCount: 1247,
      bestRating: 5
    },
    author: {
      '@type': 'Organization',
      name: 'EmersonEIMS'
    },
    featureList: [
      '50,000+ fault codes from 17+ manufacturers',
      'AI-powered diagnostic assistant',
      'ECM programming guides',
      'Real-time monitoring simulation',
      'Offline capability',
      'Multi-language support'
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQ Schema Generator - For common questions
 */
export function FAQSchemaGenerator({
  faqs
}: {
  faqs: { question: string; answer: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Pre-built FAQ schemas for common pages
export const GENERATOR_FAQS = [
  {
    question: 'How much does a generator cost in Kenya?',
    answer: 'Generator prices in Kenya range from KES 150,000 for a 10kVA generator to KES 50,000,000+ for large industrial generators (2000kVA). EmersonEIMS offers competitive pricing with 3-year warranty on all generators.'
  },
  {
    question: 'Which generator brand is best in Kenya?',
    answer: 'The best generator brands in Kenya are Cummins, Perkins, FG Wilson, and Caterpillar. EmersonEIMS is an authorized dealer for all these brands, offering genuine products with full warranty.'
  },
  {
    question: 'How often should I service my generator?',
    answer: 'Generators should be serviced every 250-500 hours of operation or every 6 months, whichever comes first. EmersonEIMS offers scheduled maintenance programs to ensure your generator runs reliably.'
  },
  {
    question: 'What size generator do I need?',
    answer: 'Generator size depends on your power needs. For a home, 5-15kVA is usually sufficient. For a small business, 20-50kVA. For industrial use, 100kVA and above. Contact EmersonEIMS for a free load assessment.'
  },
  {
    question: 'Do you offer 24/7 generator repair services?',
    answer: 'Yes, EmersonEIMS provides 24/7 emergency generator repair services across all 47 counties in Kenya. Call +254768860665 for immediate assistance.'
  }
];

export const SOLAR_FAQS = [
  {
    question: 'How much does solar installation cost in Kenya?',
    answer: 'Solar installation costs in Kenya range from KES 150,000 for a basic home system (1.5kW) to KES 10,000,000+ for large commercial installations. EmersonEIMS offers free site assessments and competitive quotes.'
  },
  {
    question: 'Is solar power worth it in Kenya?',
    answer: 'Yes, solar power is highly worthwhile in Kenya due to abundant sunshine (4-6 peak sun hours daily). Most systems pay for themselves in 3-5 years through electricity savings. EmersonEIMS installs systems with 25-year panel warranties.'
  },
  {
    question: 'How many solar panels do I need for my house?',
    answer: 'A typical Kenyan home needs 4-10 solar panels (1.5-4kW system) depending on electricity consumption. EmersonEIMS provides free energy audits to determine your exact needs.'
  },
  {
    question: 'Can solar work during power outages?',
    answer: 'Yes, with a battery backup system. EmersonEIMS installs complete solar systems with lithium or lead-acid batteries that provide power during outages and at night.'
  }
];
