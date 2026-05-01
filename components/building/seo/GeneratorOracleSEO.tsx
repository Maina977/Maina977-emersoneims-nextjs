/**
 * GENERATOR ORACLE SEO SCHEMA
 *
 * Implements structured data for Generator Oracle:
 * - SoftwareApplication schema
 * - FAQ schema for common questions
 * - HowTo schema for diagnostic guides
 * - Organization schema with service offerings
 */

export interface GeneratorOracleSEOProps {
  pageType?: 'home' | 'diagnostic' | 'faq' | 'guide';
}

export default function GeneratorOracleSEO({ pageType = 'home' }: GeneratorOracleSEOProps) {
  // Software Application Schema
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Generator Oracle',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    description: 'Professional generator diagnostic tool for troubleshooting diesel generators, identifying fault codes, and providing repair guidance. Compatible with major engine platforms including J1939 and CAN protocols.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KES',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '847',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: 'EmersonEIMS',
      url: 'https://www.emersoneims.com',
    },
    featureList: [
      'Fault Code Lookup for 10+ Engine Platforms',
      'Live Data Monitoring',
      'Step-by-Step Repair Guides',
      'J1939/CAN Protocol Support',
      'Offline Mode Available',
      'Multi-Language Support',
      'AI-Powered Diagnostics',
    ],
  };

  // FAQ Schema for common generator problems
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Why won\'t my generator start?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Common causes include: dead battery, fuel issues (empty tank, clogged filter, air in lines), faulty starter motor, low oil triggering safety shutoff, or ECM fault codes. Use Generator Oracle to diagnose the exact cause with step-by-step troubleshooting.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does a generator fault code mean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Generator fault codes are diagnostic messages from the ECM (Engine Control Module) indicating a problem. They follow J1939 protocol with SPN (Suspect Parameter Number) and FMI (Failure Mode Identifier). Generator Oracle can decode these codes and provide repair guidance.',
        },
      },
      {
        '@type': 'Question',
        name: 'How often should I service my diesel generator?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Recommended service intervals: Oil change every 250 hours or 6 months. Fuel filter every 500 hours. Air filter every 500 hours or as needed. Full service including coolant, belts, and hoses every 1000 hours or annually. Emergency standby generators should be load-tested monthly.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why is my generator overheating?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Generator overheating causes include: low coolant level, blocked radiator, faulty thermostat, broken water pump, damaged fan belt, or overloading. Check coolant level first, then inspect the cooling system. Generator Oracle provides detailed diagnostic steps for each cause.',
        },
      },
      {
        '@type': 'Question',
        name: 'What size generator do I need for my home/business?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Calculate total wattage of essential equipment, add 25% safety margin. Homes typically need 10-25kVA. Small businesses 30-100kVA. Factories 200-2000kVA. Contact EmersonEIMS for a free site survey and sizing consultation.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I read a J1939 fault code?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'J1939 fault codes have two parts: SPN (Suspect Parameter Number) identifies the component, FMI (Failure Mode Identifier) describes the failure type. Example: SPN 100 FMI 1 = Engine Oil Pressure Low. Generator Oracle decodes these automatically.',
        },
      },
    ],
  };

  // HowTo Schema for diagnostic guide
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Diagnose Generator Problems',
    description: 'Step-by-step guide to troubleshoot common diesel generator issues using Generator Oracle diagnostic tool.',
    totalTime: 'PT15M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'KES',
      value: '0',
    },
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Generator Oracle App',
      },
      {
        '@type': 'HowToTool',
        name: 'Multimeter',
      },
    ],
    step: [
      {
        '@type': 'HowToStep',
        name: 'Check for Fault Codes',
        text: 'Open Generator Oracle and connect to your generator. Read any active fault codes displayed on the controller.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Identify the Problem',
        text: 'Enter the fault code into Generator Oracle. The tool will identify the affected system and component.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Review Possible Causes',
        text: 'Generator Oracle lists possible causes ranked by probability. Start with the most likely cause.',
        position: 3,
      },
      {
        '@type': 'HowToStep',
        name: 'Follow Repair Steps',
        text: 'Follow the step-by-step repair guide provided. Each step includes safety warnings and required tools.',
        position: 4,
      },
      {
        '@type': 'HowToStep',
        name: 'Clear Codes and Test',
        text: 'After repair, clear fault codes and run the generator. Monitor for any returning faults.',
        position: 5,
      },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {pageType === 'guide' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}
