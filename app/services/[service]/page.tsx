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
// Lead capture for the #quote section below. All ten service pages previously
// shipped ZERO forms while publishing 4,700-7,300 words and 26-42 real prices.
import QuickInquiryForm from '@/components/forms/QuickInquiryForm';

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

      {/*
        LEAD CAPTURE — one section, all ten service pages.

        Measured against the market before building this. Every service page
        here carried ZERO forms while publishing 4,700-7,300 words and 26-42
        real prices. Meanwhile:

            Davis & Shirtliff   483 words, no prices, 2-4 forms per page
            Car & General     2,800 words, no prices, 27 forms on one page

        We were writing 6-11x more than the market leader, were the only
        supplier publishing prices at all, and then gave the buyer nowhere to
        leave their name. Best content, no bucket.

        BETTER IS NOT 27 FORMS. Car & General's 27 is one per product tile —
        the same generic box repeated until it becomes wallpaper. This is one
        form that already knows which service the visitor is reading, asks four
        questions instead of ten, states when we reply, and offers a phone and
        WhatsApp route for the many buyers here who will never fill anything in.

        `source` carries the slug through to /api/contact so enquiries can be
        attributed to the page that produced them — otherwise every lead looks
        identical in the inbox and no page can be shown to be earning its keep.
      */}
      <section
        id="quote"
        className="py-16 bg-gradient-to-b from-black via-amber-950/20 to-black scroll-mt-28"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-display text-brand-gold mb-4">
                Get a quote for {service.shortName.toLowerCase()}
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                Tell us the site and what it has to run. We come back with a written
                scope and price — not a brochure range. If a smaller or simpler
                solution does the job, we will say so.
              </p>
              <ul className="space-y-3 text-white/75">
                <li className="flex gap-3">
                  <span className="text-brand-gold font-bold">✓</span>
                  <span>Engineers on site across all 47 counties</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-gold font-bold">✓</span>
                  <span>Genuine spare parts held in stock</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-gold font-bold">✓</span>
                  <span>Independent — we fit the solution to your load, not to a quota</span>
                </li>
              </ul>
              <p className="mt-6 text-white/60 text-sm">
                Prefer to talk?{' '}
                <a
                  href={`tel:${BUSINESS_CONTACT.phoneIntl}`}
                  className="text-brand-gold hover:underline"
                >
                  {BUSINESS_CONTACT.phoneDisplay}
                </a>
                {' · '}
                <a
                  href={`https://wa.me/${BUSINESS_CONTACT.whatsapp}?text=${encodeURIComponent(
                    `Hello EmersonEIMS, I would like a quote for ${service.name}.`,
                  )}`}
                  className="text-brand-gold hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  WhatsApp
                </a>
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-black/60 p-6 md:p-8 backdrop-blur">
              <h3 className="text-xl font-bold text-white mb-1">
                Request a {service.shortName.toLowerCase()} quote
              </h3>
              <p className="text-white/60 text-sm mb-6">
                Four questions. We reply the same working day.
              </p>
              <QuickInquiryForm
                service={service.name}
                ctaLabel="Get My Quote"
                source={`service-${service.slug}`}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
