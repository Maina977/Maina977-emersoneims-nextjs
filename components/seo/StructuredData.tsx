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

