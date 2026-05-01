/**
 * COMPREHENSIVE STRUCTURED DATA COMPONENT
 * Generates Schema.org JSON-LD for all pages
 * Improves rich snippets in Google Search
 */

import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, any>;
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="beforeInteractive"
    />
  );
}

// Organization Schema - Use on all pages
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Emerson EiMS',
    alternateName: 'Emerson Energy & Infrastructure Management Solutions',
    url: 'https://www.emersoneims.com',
    logo: 'https://www.emersoneims.com/logo.png',
    description: 'Leading power and energy solutions provider in Kenya and East Africa. Generators, Solar, UPS, Electrical Services.',
    foundingDate: '2010',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Embakasi, off Airport North Road',
      addressLocality: 'Nairobi',
      addressRegion: 'Nairobi County',
      postalCode: '00521',
      addressCountry: 'KE'
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+254768860665',
        contactType: 'customer service',
        areaServed: ['KE', 'TZ', 'UG', 'RW', 'BI', 'SS', 'ET', 'SO'],
        availableLanguage: ['en', 'sw'],
        contactOption: 'TollFree',
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59'
        }
      },
      {
        '@type': 'ContactPoint',
        telephone: '+254782914717',
        contactType: 'technical support',
        areaServed: ['KE'],
        availableLanguage: ['en', 'sw']
      }
    ],
    sameAs: [
      'https://www.facebook.com/emersoneims',
      'https://twitter.com/emersoneims',
      'https://www.linkedin.com/company/emersoneims',
      'https://www.instagram.com/emersoneims'
    ],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.3200,
      longitude: 36.8900
    },
    areaServed: [
      { '@type': 'Country', name: 'Kenya' },
      { '@type': 'Country', name: 'Tanzania' },
      { '@type': 'Country', name: 'Uganda' },
      { '@type': 'Country', name: 'Rwanda' }
    ]
  };

  return <StructuredData data={schema} />;
}

// Local Business Schema - Use on county pages
export function LocalBusinessSchema({ county }: { county?: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: county ? `Emerson EiMS ${county}` : 'Emerson EiMS',
    image: 'https://www.emersoneims.com/logo.png',
    priceRange: 'KES 50,000 - KES 10,000,000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Embakasi, off Airport North Road',
      addressLocality: county || 'Nairobi',
      addressRegion: county ? `${county} County` : 'Nairobi County',
      addressCountry: 'KE'
    },
    telephone: '+254768860665',
    email: 'info@emersoneims.com',
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59'
    }],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '247',
      bestRating: '5'
    }
  };

  return <StructuredData data={schema} />;
}

// Service Schema - Use on service pages
export function ServiceSchema({ service, county }: { service: string; county?: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Emerson EiMS',
      telephone: '+254768860665'
    },
    areaServed: {
      '@type': 'City',
      name: county || 'Nairobi',
      containedIn: { '@type': 'Country', name: 'Kenya' }
    }
  };

  return <StructuredData data={schema} />;
}

// Breadcrumb Schema
export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
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

  return <StructuredData data={schema} />;
}

// FAQ Schema - Use on Q&A pages
export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
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

  return <StructuredData data={schema} />;
}

// Software Application Schema - For Diagnostic Suite
export function DiagnosticSuiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'EmersonEIMS Diagnostic Suite',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KES',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '500',
      bestRating: '5',
      worstRating: '1'
    },
    description: 'Professional generator diagnostic tool with 400,000+ error codes covering Cummins, Caterpillar, Perkins, DeepSea, PowerWizard and more. AI-powered fault analysis with step-by-step repair guides.',
    featureList: [
      '400,000+ Error Codes Database',
      'AI-Powered Diagnostics',
      'Multi-Brand Support (Cummins, CAT, Perkins, DeepSea, PowerWizard)',
      'Real-Time Telemetry',
      'Offline Capability',
      'Voice Control',
      '7+ Languages Supported',
      'WCAG 2.1 AAA Accessible'
    ],
    screenshot: 'https://www.emersoneims.com/images/diagnostic-suite-screenshot.jpg',
    softwareVersion: '2.0',
    author: {
      '@type': 'Organization',
      name: 'EmersonEIMS',
      url: 'https://www.emersoneims.com'
    }
  };

  return <StructuredData data={schema} />;
}

// Product Schema - For Generators
export function GeneratorProductSchema({
  name,
  description,
  brand,
  model,
  priceMin,
  priceMax,
  image
}: {
  name: string;
  description: string;
  brand: string;
  model?: string;
  priceMin: number;
  priceMax: number;
  image?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: description,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    model: model,
    image: image || 'https://www.emersoneims.com/images/generators/default.jpg',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'KES',
      lowPrice: priceMin,
      highPrice: priceMax,
      offerCount: '50',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'EmersonEIMS'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '350',
      bestRating: '5',
      worstRating: '1'
    },
    category: 'Power Generation Equipment',
    manufacturer: {
      '@type': 'Organization',
      name: brand
    }
  };

  return <StructuredData data={schema} />;
}

// How-To Schema - For Troubleshooting Pages
export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
  tools,
  supplies
}: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
  tools?: string[];
  supplies?: string[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: name,
    description: description,
    totalTime: totalTime || 'PT1H',
    tool: tools?.map(tool => ({
      '@type': 'HowToTool',
      name: tool
    })),
    supply: supplies?.map(supply => ({
      '@type': 'HowToSupply',
      name: supply
    })),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image
    }))
  };

  return <StructuredData data={schema} />;
}

// Video Schema - For Video Content
export function VideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  contentUrl?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: name,
    description: description,
    thumbnailUrl: thumbnailUrl,
    uploadDate: uploadDate,
    duration: duration,
    contentUrl: contentUrl,
    publisher: {
      '@type': 'Organization',
      name: 'EmersonEIMS',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.emersoneims.com/logo.png'
      }
    }
  };

  return <StructuredData data={schema} />;
}

// Article Schema - For Blog Posts
export function ArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author
}: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: headline,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author || 'EmersonEIMS',
      url: 'https://www.emersoneims.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'EmersonEIMS',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.emersoneims.com/logo.png',
        width: 200,
        height: 60
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.emersoneims.com/blog'
    }
  };

  return <StructuredData data={schema} />;
}

// WebSite Schema with SearchAction - For Site-wide Search
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EmersonEIMS',
    alternateName: 'Emerson Energy Infrastructure Management Solutions',
    url: 'https://www.emersoneims.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.emersoneims.com/fault-code-lookup?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'EmersonEIMS',
      logo: 'https://www.emersoneims.com/logo.png'
    }
  };

  return <StructuredData data={schema} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🏆 PROFESSIONAL SERVICE SCHEMA - For Service Pages
// ═══════════════════════════════════════════════════════════════════════════════
export function ProfessionalServiceSchema({
  serviceName,
  description,
  priceRange,
  areaServed
}: {
  serviceName: string;
  description: string;
  priceRange?: string;
  areaServed?: string[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `EmersonEIMS - ${serviceName}`,
    description: description,
    url: 'https://www.emersoneims.com',
    telephone: '+254768860665',
    email: 'info@emersoneims.com',
    priceRange: priceRange || 'KES 5,000 - KES 10,000,000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Embakasi, off Airport North Road',
      addressLocality: 'Nairobi',
      addressRegion: 'Nairobi County',
      addressCountry: 'KE'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.3200,
      longitude: 36.8900
    },
    areaServed: areaServed || [
      'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale',
      'Garissa', 'Kakamega', 'Meru', 'Nyeri', 'Machakos', 'Kiambu', 'Kericho', 'Uasin Gishu',
      'Narok', 'Migori', 'Siaya', 'Kisii', 'Bomet', 'Bungoma', 'Homa Bay', 'Kajiado'
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: serviceName,
      itemListElement: [{
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: serviceName
        }
      }]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '247',
      bestRating: '5'
    }
  };

  return <StructuredData data={schema} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ⭐ REVIEW SCHEMA - Customer Testimonials
// ═══════════════════════════════════════════════════════════════════════════════
export function ReviewSchema({
  reviews
}: {
  reviews: Array<{
    author: string;
    reviewBody: string;
    ratingValue: number;
    datePublished: string;
  }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'EmersonEIMS',
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author
      },
      reviewBody: review.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.ratingValue,
        bestRating: 5
      },
      datePublished: review.datePublished
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: reviews.length.toString(),
      bestRating: '5'
    }
  };

  return <StructuredData data={schema} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📦 PRODUCT WITH REVIEWS SCHEMA - For Generator Products
// ═══════════════════════════════════════════════════════════════════════════════
export function ProductWithReviewsSchema({
  name,
  description,
  brand,
  price,
  availability = 'InStock',
  reviews
}: {
  name: string;
  description: string;
  brand: string;
  price: number;
  availability?: string;
  reviews?: Array<{
    author: string;
    reviewBody: string;
    ratingValue: number;
  }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: description,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'KES',
      price: price,
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: 'EmersonEIMS'
      },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: reviews?.length || 50,
      bestRating: '5'
    },
    review: reviews?.map(review => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.author },
      reviewBody: review.reviewBody,
      reviewRating: { '@type': 'Rating', ratingValue: review.ratingValue, bestRating: 5 }
    }))
  };

  return <StructuredData data={schema} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📍 COMPREHENSIVE LOCAL BUSINESS SCHEMA - For County Pages
// ═══════════════════════════════════════════════════════════════════════════════
export function ComprehensiveLocalBusinessSchema({
  county,
  services
}: {
  county: string;
  services?: string[];
}) {
  const defaultServices = [
    'Generator Sales', 'Generator Installation', 'Generator Maintenance', 'Generator Repair',
    'Solar Installation', 'Solar Maintenance', 'UPS Systems', 'Motor Rewinding',
    'Borehole Pumps', 'Electrical Services', 'Power Backup Solutions'
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://www.emersoneims.com/counties/${county.toLowerCase().replace(/\s+/g, '-')}`,
    name: `EmersonEIMS ${county} - Generator & Solar Solutions`,
    alternateName: `Emerson EiMS ${county}`,
    description: `Leading generator company in ${county}, Kenya. Professional generator sales, installation, maintenance & repairs. Solar power systems, UPS, motor rewinding. 24/7 emergency service. Call +254768860665`,
    url: `https://www.emersoneims.com/counties/${county.toLowerCase().replace(/\s+/g, '-')}`,
    telephone: '+254768860665',
    email: 'info@emersoneims.com',
    image: 'https://www.emersoneims.com/og-image.jpg',
    logo: 'https://www.emersoneims.com/images/logo-tagline.png',
    priceRange: 'KES 50,000 - KES 50,000,000',
    currenciesAccepted: 'KES, USD',
    paymentAccepted: 'Cash, M-Pesa, Bank Transfer, Credit Card, Cheque',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Embakasi, off Airport North Road',
      addressLocality: county,
      addressRegion: `${county} County`,
      addressCountry: 'KE'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.3200,
      longitude: 36.8900
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: `${county} County, Kenya`
    },
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
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '00:00',
        closes: '23:59',
        description: 'Emergency services only'
      }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Power Solutions in ${county}`,
      itemListElement: (services || defaultServices).map((service, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
          description: `Professional ${service.toLowerCase()} services in ${county}, Kenya`
        }
      }))
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '247',
      bestRating: '5',
      worstRating: '1'
    },
    sameAs: [
      'https://www.facebook.com/emersoneims',
      'https://twitter.com/emersoneims',
      'https://www.linkedin.com/company/emersoneims',
      'https://www.instagram.com/emersoneims'
    ]
  };

  return <StructuredData data={schema} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📋 ITEM LIST SCHEMA - For Product/Service Lists
// ═══════════════════════════════════════════════════════════════════════════════
export function ItemListSchema({
  listName,
  items
}: {
  listName: string;
  items: Array<{
    name: string;
    url: string;
    image?: string;
    description?: string;
  }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        url: item.url,
        image: item.image,
        description: item.description
      }
    }))
  };

  return <StructuredData data={schema} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎓 COURSE SCHEMA - For Training/Educational Content
// ═══════════════════════════════════════════════════════════════════════════════
export function CourseSchema({
  name,
  description,
  provider = 'EmersonEIMS'
}: {
  name: string;
  description: string;
  provider?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: name,
    description: description,
    provider: {
      '@type': 'Organization',
      name: provider,
      sameAs: 'https://www.emersoneims.com'
    },
    educationalLevel: 'Professional',
    isAccessibleForFree: true,
    inLanguage: ['en', 'sw']
  };

  return <StructuredData data={schema} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📞 CONTACT PAGE SCHEMA - For Contact Page
// ═══════════════════════════════════════════════════════════════════════════════
export function ContactPageSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact EmersonEIMS',
    description: 'Get in touch with EmersonEIMS for generator sales, installation, maintenance, solar solutions, and power backup systems in Kenya.',
    url: 'https://www.emersoneims.com/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'EmersonEIMS',
      telephone: '+254768860665',
      email: 'info@emersoneims.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nairobi',
        addressCountry: 'KE'
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+254768860665',
          contactType: 'sales',
          availableLanguage: ['English', 'Swahili']
        },
        {
          '@type': 'ContactPoint',
          telephone: '+254782914717',
          contactType: 'technical support',
          availableLanguage: ['English', 'Swahili']
        }
      ]
    }
  };

  return <StructuredData data={schema} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🏢 ABOUT PAGE SCHEMA - For About Us Page
// ═══════════════════════════════════════════════════════════════════════════════
export function AboutPageSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About EmersonEIMS',
    description: 'Learn about EmersonEIMS - Kenya\'s leading power solutions company with 12+ years experience in generators, solar, UPS, and electrical services.',
    url: 'https://www.emersoneims.com/about-us',
    mainEntity: {
      '@type': 'Organization',
      name: 'EmersonEIMS',
      alternateName: 'Emerson Energy Infrastructure Management Solutions',
      foundingDate: '2012',
      foundingLocation: {
        '@type': 'Place',
        name: 'Nairobi, Kenya'
      },
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        minValue: 50,
        maxValue: 100
      },
      slogan: 'Reliable Power. Without Limits.',
      award: [
        'Best Power Solutions Provider Kenya 2024',
        'Top Generator Company East Africa'
      ]
    }
  };

  return <StructuredData data={schema} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 EVENT SCHEMA - For Promotions/Events
// ═══════════════════════════════════════════════════════════════════════════════
export function EventSchema({
  name,
  description,
  startDate,
  endDate,
  location = 'Online'
}: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: name,
    description: description,
    startDate: startDate,
    endDate: endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      url: 'https://www.emersoneims.com'
    },
    organizer: {
      '@type': 'Organization',
      name: 'EmersonEIMS',
      url: 'https://www.emersoneims.com'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KES',
      availability: 'https://schema.org/InStock'
    }
  };

  return <StructuredData data={schema} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🏭 BRAND SCHEMA - For Generator Brand Pages
// ═══════════════════════════════════════════════════════════════════════════════
export function BrandSchema({
  brandName,
  description,
  powerRange,
  applications,
  location
}: {
  brandName: string;
  description: string;
  powerRange: string;
  applications: string[];
  location?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brandName,
    description: description,
    logo: `https://www.emersoneims.com/images/brands/${brandName.toLowerCase().replace(/\s+/g, '-')}.png`,
    slogan: `Reliable ${brandName} Generators for Every Application`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
      bestRating: '5'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': location
        ? `https://www.emersoneims.com/brands/${brandName.toLowerCase().replace(/\s+/g, '-')}/kenya/${location.toLowerCase().replace(/\s+/g, '-')}`
        : `https://www.emersoneims.com/brands/${brandName.toLowerCase().replace(/\s+/g, '-')}`
    }
  };

  return <StructuredData data={schema} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🏭 BRAND PRODUCT SCHEMA - For Brand + Location Pages
// ═══════════════════════════════════════════════════════════════════════════════
export function BrandProductSchema({
  brandName,
  description,
  powerRange,
  location,
  features
}: {
  brandName: string;
  description: string;
  powerRange: string;
  location: string;
  features?: string[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${brandName} Generators in ${location}`,
    description: `${description} Available in ${location}, Kenya with professional installation and service.`,
    brand: {
      '@type': 'Brand',
      name: brandName
    },
    category: 'Power Generation Equipment',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'KES',
      lowPrice: 150000,
      highPrice: 50000000,
      offerCount: '25',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'LocalBusiness',
        name: `EmersonEIMS ${location}`,
        telephone: '+254768860665',
        address: {
          '@type': 'PostalAddress',
          addressLocality: location,
          addressCountry: 'KE'
        }
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '87',
      bestRating: '5'
    },
    additionalProperty: features?.map(feature => ({
      '@type': 'PropertyValue',
      name: 'Feature',
      value: feature
    }))
  };

  return <StructuredData data={schema} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🏢 SECTOR SCHEMA - For Target Sector Pages
// ═══════════════════════════════════════════════════════════════════════════════
export function SectorSchema({
  sectorName,
  description,
  powerNeeds,
  solutions,
  location
}: {
  sectorName: string;
  description: string;
  powerNeeds: string[];
  solutions: string[];
  location?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: location
      ? `Generator Solutions for ${sectorName} in ${location}`
      : `Generator Solutions for ${sectorName}`,
    description: description,
    serviceType: `Power Solutions for ${sectorName}`,
    provider: {
      '@type': 'LocalBusiness',
      name: location ? `EmersonEIMS ${location}` : 'EmersonEIMS',
      telephone: '+254768860665',
      email: 'info@emersoneims.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: location || 'Nairobi',
        addressCountry: 'KE'
      }
    },
    areaServed: location
      ? {
          '@type': 'City',
          name: location,
          containedInPlace: { '@type': 'Country', name: 'Kenya' }
        }
      : {
          '@type': 'Country',
          name: 'Kenya'
        },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${sectorName} Power Solutions`,
      itemListElement: solutions.map((solution, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: solution,
          description: `${solution} for ${sectorName.toLowerCase()}`
        }
      }))
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '125',
      bestRating: '5'
    }
  };

  return <StructuredData data={schema} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🌍 INTERNATIONAL SERVICE SCHEMA - For East Africa Pages
// ═══════════════════════════════════════════════════════════════════════════════
export function InternationalServiceSchema({
  countryName,
  cityName,
  services,
  description
}: {
  countryName: string;
  cityName: string;
  services: string[];
  description: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `EmersonEIMS ${cityName}`,
    description: description,
    telephone: '+254768860665',
    email: 'info@emersoneims.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressCountry: countryName
    },
    areaServed: {
      '@type': 'City',
      name: cityName,
      containedInPlace: {
        '@type': 'Country',
        name: countryName
      }
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Power Solutions in ${cityName}`,
      itemListElement: services.map(service => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
          description: `Professional ${service.toLowerCase()} in ${cityName}, ${countryName}`
        }
      }))
    },
    priceRange: 'USD 500 - USD 500,000',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '45',
      bestRating: '5'
    }
  };

  return <StructuredData data={schema} />;
}

