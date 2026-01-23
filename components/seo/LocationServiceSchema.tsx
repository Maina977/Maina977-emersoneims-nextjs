'use client';

import { SEOService, generateServiceFAQs } from '@/lib/data/seo-services';

interface LocationServiceSchemaProps {
  location: string;
  locationType: 'county' | 'constituency' | 'village';
  service: SEOService;
  county?: string;
  constituency?: string;
  url: string;
}

/**
 * Generate structured data (JSON-LD) for location + service pages
 * Includes LocalBusiness, Service, FAQ, and BreadcrumbList schemas
 */
export function LocationServiceSchema({
  location,
  locationType,
  service,
  county,
  constituency,
  url
}: LocationServiceSchemaProps) {
  // LocalBusiness + Service Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://www.emersoneims.com/#${service.slug}-${location.toLowerCase().replace(/\s+/g, '-')}`,
    name: `Emerson EiMS - ${service.name} in ${location}`,
    description: service.metaTemplate.description.replace(/{location}/g, location),
    url: `https://www.emersoneims.com${url}`,
    telephone: '+254768860665',
    email: 'info@emersoneims.com',
    priceRange: 'KES 10,000 - KES 10,000,000',
    openingHours: 'Mo-Su 00:00-24:00',
    image: 'https://www.emersoneims.com/images/emerson-eims-logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'P.O. Box 387-00521, Old North Airport Road',
      addressLocality: 'Nairobi',
      addressRegion: 'Nairobi County',
      postalCode: '00521',
      addressCountry: 'KE'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.2921,
      longitude: 36.8219
    },
    areaServed: {
      '@type': locationType === 'county' ? 'AdministrativeArea' : 'Place',
      name: location,
      containedInPlace: {
        '@type': 'Country',
        name: 'Kenya'
      }
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.name} Services`,
      itemListElement: service.keywords.map((keyword, i) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
          description: `Professional ${keyword} services in ${location}`,
          provider: {
            '@type': 'Organization',
            name: 'Emerson EiMS'
          },
          areaServed: location,
          serviceType: service.name
        },
        position: i + 1
      }))
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
      bestRating: '5',
      worstRating: '1'
    },
    sameAs: [
      'https://www.facebook.com/emersoneims',
      'https://twitter.com/emersoneims',
      'https://www.linkedin.com/company/emersoneims'
    ]
  };

  // FAQ Schema
  const faqs = generateServiceFAQs(service, location);
  const faqSchema = {
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

  // Breadcrumb Schema
  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.emersoneims.com' },
    { name: 'Kenya', url: 'https://www.emersoneims.com/kenya' }
  ];

  if (county) {
    breadcrumbItems.push({
      name: county,
      url: `https://www.emersoneims.com/kenya/${county.toLowerCase().replace(/\s+/g, '-')}`
    });
  }

  if (constituency) {
    breadcrumbItems.push({
      name: constituency,
      url: `https://www.emersoneims.com/kenya/${county?.toLowerCase().replace(/\s+/g, '-')}/${constituency.toLowerCase().replace(/\s+/g, '-')}`
    });
  }

  if (locationType === 'village') {
    breadcrumbItems.push({
      name: location,
      url: `https://www.emersoneims.com${url.replace(`/${service.slug}`, '')}`
    });
  }

  breadcrumbItems.push({
    name: service.name,
    url: `https://www.emersoneims.com${url}`
  });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  // Service Schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.metaTemplate.h1.replace(/{location}/g, location),
    description: service.metaTemplate.description.replace(/{location}/g, location),
    provider: {
      '@type': 'Organization',
      name: 'Emerson EiMS',
      url: 'https://www.emersoneims.com'
    },
    areaServed: {
      '@type': locationType === 'county' ? 'AdministrativeArea' : 'Place',
      name: location,
      containedInPlace: {
        '@type': 'Country',
        name: 'Kenya'
      }
    },
    serviceType: service.name,
    termsOfService: 'https://www.emersoneims.com/terms',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.name} Options`,
      itemListElement: service.features.map((feature, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: feature
        },
        position: index + 1
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}

export default LocationServiceSchema;
