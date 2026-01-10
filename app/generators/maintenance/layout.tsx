import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Maintenance & Engine Overhaul Services Kenya | All 47 Counties | EmersonEIMS',
  description: 'Expert generator maintenance, engine overhaul, repair & servicing across all 47 Kenya counties. Certified technicians for Cummins, Caterpillar, Perkins, FG Wilson, Kohler, MTU, Deutz generators. 24/7 emergency service. Call +254 768 860 665.',
  keywords: [
    'generator maintenance Kenya', 'generator repair Kenya', 'generator servicing Kenya',
    'engine overhaul Kenya', 'generator engine rebuild', 'diesel generator maintenance',
    'Cummins generator service Kenya', 'Caterpillar generator maintenance', 'Perkins generator repair',
    'FG Wilson generator service', 'Kohler generator maintenance', 'MTU generator repair',
    'generator maintenance Nairobi', 'generator repair Mombasa', 'generator service Kisumu',
    'preventive generator maintenance', 'generator load bank testing', 'generator oil change',
  ],
  openGraph: {
    title: 'Generator Maintenance & Engine Overhaul | All 47 Counties | EmersonEIMS',
    description: 'Kenya\'s leading generator maintenance company. Expert engine overhauls, repairs & servicing for all brands across all 47 counties.',
    type: 'website',
    url: 'https://emersoneims.com/generators/maintenance',
    siteName: 'EmersonEIMS',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/generators/maintenance',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Structured Data for Maintenance Services
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': 'https://emersoneims.com/generators/maintenance/#service',
      name: 'Generator Maintenance Services',
      serviceType: 'Generator Maintenance',
      provider: {
        '@type': 'Organization',
        name: 'EmersonEIMS',
        '@id': 'https://emersoneims.com/#organization',
      },
      areaServed: {
        '@type': 'Country',
        name: 'Kenya',
      },
      description: 'Comprehensive generator maintenance, repair, engine overhaul and servicing for all major brands including Cummins, Caterpillar, Perkins, FG Wilson, Kohler, MTU.',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'KES',
        },
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://emersoneims.com/generators/maintenance/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How often should I service my generator?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For standby generators: every 6 months or 200 running hours. For prime power generators: every 250-500 running hours. Oil change every 100-250 hours depending on manufacturer recommendations.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are signs my generator needs maintenance?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Common signs include: difficulty starting, black smoke from exhaust, unusual noises, oil leaks, coolant loss, voltage fluctuations, and fuel consumption increase.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you service all generator brands?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, we service all major brands including Cummins, Caterpillar, Perkins, FG Wilson, Kohler, MTU, Deutz, Volvo Penta, Scania, and Chinese brands.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://emersoneims.com' },
        { '@type': 'ListItem', position: 2, name: 'Generators', item: 'https://emersoneims.com/generators' },
        { '@type': 'ListItem', position: 3, name: 'Maintenance', item: 'https://emersoneims.com/generators/maintenance' },
      ],
    },
  ],
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
