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
      streetAddress: 'P.O. Box 387-00521, Old North Airport Road',
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
      latitude: -1.2921,
      longitude: 36.8219
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
      streetAddress: 'P.O. Box 387-00521',
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
      ratingValue: '4.9',
      reviewCount: '847',
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
    description: 'Professional generator diagnostic tool with 9,500+ error codes covering Cummins, Caterpillar, Perkins, DeepSea, PowerWizard and more. AI-powered fault analysis with step-by-step repair guides.',
    featureList: [
      '9,500+ Error Codes Database',
      'AI-Powered Diagnostics',
      'Multi-Brand Support (Cummins, CAT, Perkins, DeepSea, PowerWizard)',
      'Real-Time Telemetry',
      'Offline Capability',
      'Voice Control',
      '47 Languages Supported',
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

