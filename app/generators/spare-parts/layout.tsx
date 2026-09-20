import { Metadata } from 'next';
import PartsCategoryLinks, {
  totalCataloguedParts,
  totalPartCategories,
} from '@/components/parts/PartsCategoryLinks';

/*
 * THE PARTS COUNT IS COUNTED, NOT ASSERTED (2026-09-20).
 *
 * This page stated its own size three different ways and got it wrong three
 * times. The title and OG copy said "2000+ Parts". lib/maintenance-hub/
 * enhanced-services-data.ts said "over 1,560 items in stock". The index
 * rendered below said "1,248 parts", having never counted the verified
 * additions file the category pages merge.
 *
 * The catalogue holds 1,315 parts across 27 categories — 1,248 in the base
 * file plus 67 verified additions — and a visitor can add the category tiles
 * up and check. "2000+" overstated it by more than half, on the one page where
 * a buyer is deciding whether we can supply their part.
 *
 * Read at build time from the same two JSON files the pages render from, so
 * the number in the tab title, the number in the search snippet and the number
 * in the page body are the same number and cannot drift apart again.
 */
const PARTS_TOTAL = totalCataloguedParts();
const PARTS_CATEGORIES = totalPartCategories();

export const metadata: Metadata = {
  title: `Generator Spare Parts Kenya | ${PARTS_TOTAL.toLocaleString('en-KE')} Parts Catalogued`,
  description: `Generator spare parts in Kenya: ${PARTS_TOTAL.toLocaleString('en-KE')} parts across ${PARTS_CATEGORIES} categories — filters, engine parts, AVRs and controllers for Cummins, Caterpillar and Perkins. Pay via M-Pesa. Call +254 768 860 665.`,
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
    title: `Generator Spare Parts Kenya | ${PARTS_TOTAL.toLocaleString('en-KE')} Parts | M-Pesa`,
    description: `${PARTS_TOTAL.toLocaleString('en-KE')} genuine generator spare parts catalogued across ${PARTS_CATEGORIES} categories — oil filters, fuel filters, AVRs, controllers and engine parts, each listed with its manufacturer part number and the engines it fits. Pay via M-Pesa (0768860665).`,
    type: 'website',
    url: 'https://www.emersoneims.com/generators/spare-parts',
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
      '@id': 'https://www.emersoneims.com/generators/spare-parts/#itemlist',
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
      '@id': 'https://www.emersoneims.com/generators/spare-parts/#store',
      name: 'EmersonEIMS Generator Parts Store',
      /*
       * Was: "Kenya's largest inventory of 2000+ genuine generator spare
       * parts". Two separate problems in one sentence, both removed.
       *
       * "Kenya's largest" is a market-position claim. It is the same family as
       * the "#1" claims the number-one-claim guard blocks, and it escaped only
       * because it says "largest" instead of "#1" — no ranking, no survey, no
       * citation exists for it anywhere in this project. Structured data is the
       * worst place to carry one: Google reads it as a factual assertion about
       * the business, and its structured-data policies require markup to
       * represent the page honestly.
       *
       * "2000+" was simply wrong — the catalogue holds 1,315. Overstating stock
       * by more than half in machine-readable markup is the kind of thing that
       * costs a manual action, not just a ranking.
       *
       * What replaces it is checkable by anyone who counts the category tiles.
       */
      description: `${PARTS_TOTAL.toLocaleString('en-KE')} genuine generator spare parts catalogued across ${PARTS_CATEGORIES} categories, for Cummins, Caterpillar, Perkins and other major brands — each listed with its manufacturer part number and the engines it fits. Order with M-Pesa payment.`,
      telephone: '+254768860665',
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
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
        { '@type': 'ListItem', position: 2, name: 'Generators', item: 'https://www.emersoneims.com/generators' },
        { '@type': 'ListItem', position: 3, name: 'Spare Parts', item: 'https://www.emersoneims.com/generators/spare-parts' },
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
      {/*
        THE CATALOGUE'S ONLY CRAWLABLE INDEX — wired in 2026-09-20.

        app/generators/spare-parts/page.tsx is 'use client', so the hub's
        entire body arrives after hydration and the server HTML holds nothing
        but the site chrome. Measured that day against production: 109 unique
        8-word sequences once chrome was subtracted — the thinnest page on the
        site — with zero links to its category pages and zero to its engine
        pages. Forty-odd /generators/spare-parts/<category> routes and
        twenty-three /engine/<slug> routes were reachable from the sitemap and
        from nowhere else on the page that owns them.

        PartsCategoryLinks was written for precisely this in the 2026-07-21
        audit and then never rendered anywhere. Its own header warns that
        "the category pages are useless if nothing links to them" and cites two
        earlier page sets lost the same way. The component was correct; only
        the wiring was missing.

        It lives in the layout rather than the page because the page is a
        client component and cannot render a server one. That also puts the
        index on the category and engine pages beneath, which is wanted: from
        a filters page you can reach another category or jump to the engine
        you are actually buying for.

        Every count it prints is read from the same JSON the pages render
        from, so the numbers cannot drift from the catalogue.
      */}
      <PartsCategoryLinks />
    </>
  );
}
