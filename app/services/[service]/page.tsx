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
import { getServiceDiagnostics } from '@/lib/services/serviceDiagnostics';
import { getServiceBible } from '@/lib/services/serviceBibles';
import ServiceRepairLinks from '@/components/repair-centre/ServiceRepairLinks';
import ServiceDeepDive from '@/components/services/ServiceDeepDive';
import UPSVisualPack from '@/components/services/UPSVisualPack';

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
    return { title: 'Service Not Found' };
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
  const diagnostics = getServiceDiagnostics(service.slug);
  const bible = getServiceBible(service.slug);
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
        trustBadges={
          service.slug === 'cummins-generators'
            ? TRUST_BADGES
            : TRUST_BADGES.filter((b) => !/warranty/i.test(b.title))
        }
        contact={BUSINESS_CONTACT}
        diagnostics={diagnostics}
        bible={bible}
      />

      {/* ENGINEERING REFERENCE — surfaces deep-dives for service slugs whose
          /solutions/* equivalents redirect here (ups, motor-rewinding, ac,
          borehole, ats). Renders nothing for other slugs. */}
      <ServiceDeepDive slug={service.slug} />

      {/* Contextual links into the Repair Centre. Added 2026-07-27 after an SEO
          audit found the Repair Centre had ONE inbound internal link from the
          whole site, leaving 54 routes and ~115,000 words isolated. Renders
          nothing for service slugs with no matching hub. */}
      <ServiceRepairLinks slug={service.slug} />

      {/* UPS schematic, curves and diagnostic gauges. Moved here from the
          retired hardcoded route app/services/ups-systems/page.tsx, which was
          shadowing this dynamic route and suppressing the bible, deep-dive,
          diagnostics, pricing, FAQs and structured data for this slug. */}
      {service.slug === 'ups-systems' && <UPSVisualPack />}
    </>
  );
}
