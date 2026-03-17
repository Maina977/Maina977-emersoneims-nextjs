/**
 * Dynamic Service Detail Page
 *
 * Comprehensive, conversion-focused service pages
 * Phone: +254768860665 | WhatsApp: +254768860665
 */

import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import {
  ALL_SERVICES,
  getServiceBySlug,
  getRelatedServices,
  getAllServiceSlugs,
  TRUST_BADGES,
  BUSINESS_CONTACT,
  SERVICE_CATEGORIES
} from '@/lib/services/allServices';

// Import client components
import ServiceDetailClient from './ServiceDetailClient';

interface Props {
  params: Promise<{ service: string }>;
}

// Generate static paths for all services
export async function generateStaticParams() {
  return getAllServiceSlugs().map(slug => ({
    service: slug
  }));
}

// Generate SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: serviceSlug } = await params;
  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    return { title: 'Service Not Found | EmersonEIMS' };
  }

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      type: 'website',
      url: `https://www.emersoneims.com/services/${service.slug}`,
      images: [
        {
          url: service.heroImage || '/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: service.name
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription
    },
    alternates: {
      canonical: `https://www.emersoneims.com/services/${service.slug}`
    }
  };
}

// Structured Data for Service
function generateStructuredData(service: NonNullable<ReturnType<typeof getServiceBySlug>>) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `https://www.emersoneims.com/services/${service.slug}#service`,
        name: service.name,
        description: service.description,
        provider: {
          '@type': 'LocalBusiness',
          '@id': 'https://www.emersoneims.com/#organization',
          name: 'Emerson Industrial Maintenance Services',
          telephone: BUSINESS_CONTACT.phoneIntl,
          email: BUSINESS_CONTACT.email,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Nairobi',
            addressCountry: 'KE'
          }
        },
        areaServed: {
          '@type': 'Country',
          name: 'Kenya'
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${service.name} Pricing`,
          itemListElement: service.pricingTiers.map(tier => ({
            '@type': 'Offer',
            name: tier.name,
            description: tier.description,
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: tier.price,
              priceCurrency: 'KES'
            }
          }))
        }
      },
      {
        '@type': 'FAQPage',
        mainEntity: service.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.emersoneims.com'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Services',
            item: 'https://www.emersoneims.com/services'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: service.name,
            item: `https://www.emersoneims.com/services/${service.slug}`
          }
        ]
      }
    ]
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { service: serviceSlug } = await params;
  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    notFound();
  }

  const relatedServices = getRelatedServices(serviceSlug);
  const category = SERVICE_CATEGORIES.find(c => c.id === service.category);
  const structuredData = generateStructuredData(service);

  return (
    <>
      <Script
        id={`service-structured-data-${service.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <ServiceDetailClient
        service={service}
        relatedServices={relatedServices}
        category={category}
        trustBadges={TRUST_BADGES}
        contact={BUSINESS_CONTACT}
      />
    </>
  );
}
