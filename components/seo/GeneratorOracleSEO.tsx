/**
 * GENERATOR ORACLE SEO SCHEMA
 *
 * Implements structured data for Generator Oracle:
 * - SoftwareApplication schema
 * - Service schema with service offerings
 * (FAQ and HowTo schemas deleted 2026-11-25, content-safety withdrawal.)
 */

export interface GeneratorOracleSEOProps {
  pageType?: 'home' | 'diagnostic' | 'faq' | 'guide';
}

// pageType is kept for callers; since 2026-11-25 no schema depends on it.
export default function GeneratorOracleSEO(_props: GeneratorOracleSEOProps) {
  // Software Application Schema
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Generator Oracle',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    // 2026-11-25: describes only what /generator-oracle shows (the fault-code
    // lookup and repair guides are withdrawn).
    description: 'Generator diagnostic tool for diesel generators: Guided Diagnosis, wiring diagrams and service job cards, with escalation to an EmersonEIMS engineer.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KES',
      availability: 'https://schema.org/InStock',
    },
    // No self-asserted aggregateRating — violates Google's structured-data
    // policy without on-page UGC reviews, and triggers "multiple aggregate
    // ratings" when several schema blocks coexist on one URL.
    author: {
      '@type': 'Organization',
      name: 'EmersonEIMS',
      url: 'https://www.emersoneims.com',
    },
    featureList: [
      'Guided Diagnosis',
      'Wiring diagrams',
      'Service job cards',
      'One-tap escalation to an EmersonEIMS engineer',
    ],
  };

  // Service Schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Generator Diagnostic Service',
    provider: {
      '@type': 'Organization',
      name: 'EmersonEIMS',
      url: 'https://www.emersoneims.com',
      telephone: '+254768860665',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nairobi',
        addressCountry: 'KE',
      },
    },
    areaServed: {
      '@type': 'Country',
      name: 'Kenya',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Generator Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Generator Installation',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Generator Maintenance',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Emergency Generator Repair',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Generator Diagnostics',
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      {/* CONTENT-SAFETY WITHDRAWAL 2026-11-25: the unused FAQPage object (it
          was never emitted: no visible counterpart on /generator-oracle) and
          the HowTo ("enter the fault code … follow the repair steps … clear
          fault codes and run the generator") are deleted. Both described the
          withdrawn fault-code lookup and repair guides, and the HowTo ended
          by running the set after clearing codes. The visible FAQ and its
          FAQPage on this URL come from ToolSeoContent. */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}
