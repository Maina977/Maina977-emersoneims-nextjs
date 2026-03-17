import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Spare Parts Kenya | 2000+ Parts | M-Pesa Payment | EmersonEIMS',
  description: 'Buy 2000+ genuine generator spare parts online in Kenya. Oil filters, fuel filters, engine parts, AVR, controllers for Cummins, Caterpillar, Perkins. Pay via M-Pesa. Same-day delivery in Nairobi. Call +254 793 573 208.',
  keywords: [
    'generator oil filter Kenya', 'generator fuel filter', 'generator air filter', 'oil filter Cummins',
    'fuel filter Perkins', 'air filter Caterpillar', 'coolant filter generator', 'hydraulic filter',
    'Fleetguard filters Kenya', 'Donaldson filters', 'Mann filters generator', 'Baldwin filters',
    'generator piston Kenya', 'cylinder liner generator', 'piston rings Cummins', 'engine bearings',
    'crankshaft generator', 'camshaft Perkins', 'connecting rod', 'cylinder head gasket',
    'valve set generator', 'turbocharger Caterpillar', 'injector Cummins', 'fuel pump Perkins',
    'generator AVR Kenya', 'alternator diodes', 'generator controller', 'DSE controller',
    'ComAp controller', 'generator battery charger', 'starter motor generator', 'glow plug',
    'Cummins spare parts Kenya', 'Caterpillar parts', 'Perkins parts Kenya', 'FG Wilson parts',
    'Kohler generator parts', 'MTU parts', 'Deutz parts Kenya', 'Sdmo parts',
  ],
  openGraph: {
    title: 'Buy Generator Spare Parts Online Kenya | 2000+ Parts | M-Pesa | EmersonEIMS',
    description: 'Shop 2000+ genuine generator spare parts online. Oil filters, fuel filters, AVR, controllers, engine parts. Pay via M-Pesa (0793573208). Same-day delivery in Nairobi.',
    type: 'website',
    url: 'https://emersoneims.com/generators/spare-parts',
    siteName: 'EmersonEIMS',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/generators/spare-parts',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Structured Data for Spare Parts
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ItemList',
      '@id': 'https://emersoneims.com/generators/spare-parts/#itemlist',
      name: 'Generator Spare Parts Categories',
      numberOfItems: 12,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Oil Filters', description: 'Fleetguard, Donaldson, Mann, Baldwin oil filters for all generators' },
        { '@type': 'ListItem', position: 2, name: 'Fuel Filters', description: 'Primary and secondary fuel filters, water separators' },
        { '@type': 'ListItem', position: 3, name: 'Air Filters', description: 'Heavy-duty air filters for all generator brands' },
        { '@type': 'ListItem', position: 4, name: 'Coolant Filters', description: 'Coolant filters and SCA additives' },
        { '@type': 'ListItem', position: 5, name: 'Engine Parts', description: 'Pistons, liners, bearings, gaskets, valves' },
        { '@type': 'ListItem', position: 6, name: 'Turbochargers', description: 'Turbochargers and turbo repair kits' },
        { '@type': 'ListItem', position: 7, name: 'Fuel Injectors', description: 'Fuel injectors and injection pumps' },
        { '@type': 'ListItem', position: 8, name: 'AVR Units', description: 'Automatic voltage regulators for all brands' },
        { '@type': 'ListItem', position: 9, name: 'Controllers', description: 'DSE, ComAp, and original controllers' },
        { '@type': 'ListItem', position: 10, name: 'Starter Motors', description: 'Starter motors and solenoids' },
        { '@type': 'ListItem', position: 11, name: 'Alternator Parts', description: 'Diodes, bearings, regulators' },
        { '@type': 'ListItem', position: 12, name: 'Bearings', description: 'Main bearings, rod bearings, cam bearings' },
      ],
    },
    {
      '@type': 'Store',
      '@id': 'https://emersoneims.com/generators/spare-parts/#store',
      name: 'EmersonEIMS Generator Parts Store',
      description: 'Kenya\'s largest inventory of 2000+ genuine generator spare parts for Cummins, Caterpillar, Perkins, FG Wilson, and all major brands. Shop online with M-Pesa payment.',
      telephone: '+254793573208',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Embakasi, off Airport North Road',
        addressLocality: 'Nairobi',
        addressCountry: 'KE',
      },
      areaServed: { '@type': 'Country', name: 'Kenya' },
      brand: ['Cummins', 'Caterpillar', 'Perkins', 'FG Wilson', 'Kohler', 'MTU', 'Deutz', 'Fleetguard', 'Donaldson'],
      paymentAccepted: ['M-Pesa', 'Cash', 'Bank Transfer'],
      currenciesAccepted: 'KES',
      priceRange: 'KES 1,500 - KES 500,000',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://emersoneims.com' },
        { '@type': 'ListItem', position: 2, name: 'Generators', item: 'https://emersoneims.com/generators' },
        { '@type': 'ListItem', position: 3, name: 'Spare Parts', item: 'https://emersoneims.com/generators/spare-parts' },
      ],
    },
  ],
};

export default function SparePartsLayout({
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
