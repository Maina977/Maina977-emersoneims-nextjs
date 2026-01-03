import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Spare Parts Kenya | Filters, Engine Parts, Electrical | All Brands | EmersonEIMS',
  description: 'Complete generator spare parts inventory: oil filters, fuel filters, air filters, engine parts, electrical components for Cummins, Caterpillar, Perkins, FG Wilson, Kohler, MTU generators. Genuine & OEM parts. Fast delivery across Kenya. Call 0768860655.',
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
    title: 'Generator Spare Parts Kenya | Complete Inventory | EmersonEIMS',
    description: 'Kenya\'s largest generator spare parts inventory. Genuine filters, engine parts, electrical components for all brands. Same-day delivery in Nairobi.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/generators/spare-parts',
  },
};

export default function SparePartsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
