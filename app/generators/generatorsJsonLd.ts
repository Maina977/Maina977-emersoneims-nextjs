/**
 * JSON-LD for /generators ONLY. Moved out of app/generators/layout.tsx on
 * 2026-11-05 so child routes no longer inherit it; rendered by page.tsx.
 */
import { publishedPriceRange } from '@/lib/products/generatorSizes';

/** Parsed once at module load — see the comment in the offers block below. */
const PRICE_BAND = publishedPriceRange();

// JSON-LD Structured Data for Generators
export const generatorsJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.emersoneims.com/#organization',
      name: 'EmersonEIMS',
      url: 'https://www.emersoneims.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.emersoneims.com/emerson-eims-logo.png',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+254768860665',
          contactType: 'sales',
          areaServed: 'KE',
          availableLanguage: ['English', 'Swahili'],
        },
        {
          '@type': 'ContactPoint',
          telephone: '+254782914717',
          contactType: 'customer service',
          areaServed: 'KE',
          availableLanguage: ['English', 'Swahili'],
        },
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Embakasi, off Airport North Road',
        addressLocality: 'Nairobi',
        postalCode: '00521',
        addressCountry: 'KE',
      },
      sameAs: [
        'https://x.com/mitumba_s',
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.emersoneims.com/generators/#webpage',
      url: 'https://www.emersoneims.com/generators',
      name: 'Generators - Cummins & Voltka Diesel Generators Kenya',
      isPartOf: { '@id': 'https://www.emersoneims.com/#website' },
      about: { '@id': 'https://www.emersoneims.com/#organization' },
      description: 'Buy NEW Cummins & Voltka diesel generators in Kenya. 10kVA to 3000kVA with warranty and free maintenance.',
    },
    {
      '@type': 'Product',
      '@id': 'https://www.emersoneims.com/generators/#product',
      name: 'Cummins Diesel Generators by Voltka - Kenya',
      image: 'https://www.emersoneims.com/images/desktop/generators/cummins-teal-canopy.jpg',
      brand: {
        '@type': 'Brand',
        name: 'Cummins',
      },
      manufacturer: {
        '@type': 'Organization',
        name: 'Voltka',
      },
      description: 'Cummins & Voltka diesel generators in Kenya, 10KVA to 3000KVA, supplied, installed and commissioned. Genuine parts, expert installation. Multi-brand specialist.',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'KES',
        /*
         * THESE FIGURES USED TO CONTRADICT THE PAGE THEY SIT ON.
         *
         * Until 2026-09-06 this block hard-coded lowPrice 500,000, highPrice
         * 48,000,000 and offerCount 50. The price table this page renders runs
         * from KES 280,000 to KES 9,000,000 across 13 published sizes, and the
         * layout's own meta description a few lines above reads "from KES
         * 280,000". A buyer was shown one opening price and Google another, and
         * neither schema figure appeared anywhere in the published data.
         *
         * Now parsed from GENERATOR_SIZES — the same table the page renders —
         * so a price change updates both at once. See publishedPriceRange().
         */
        ...(PRICE_BAND
          ? {
              lowPrice: String(PRICE_BAND.low),
              highPrice: String(PRICE_BAND.high),
              offerCount: String(PRICE_BAND.count),
            }
          : {}),
        /*
         * availability: InStock was REMOVED 2026-08-31. It asserted to Google
         * that every set across the whole range was in stock, on a site with no
         * inventory system to derive that from. Structured data must match what
         * we can actually honour on the phone.
         */
        seller: { '@id': 'https://www.emersoneims.com/#organization' },
        // Warranty duration removed from structured data 2026-08-31: no
        // approved schedule exists, and the term differs for new, used and
        // refurbished sets. See lib/commercial/policy.ts.
        warranty: 'Warranty terms are confirmed in the written quotation',
      },
      // No self-asserted aggregateRating — violates Google's structured-data
      // policy without on-page UGC reviews, and triggered "Review has multiple
      // aggregate ratings" in Search Console alongside other schema on /generators.
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.emersoneims.com/#localbusiness',
      name: 'EmersonEIMS - Generator Sales & Services',
      image: 'https://www.emersoneims.com/emerson-eims-logo.png',
      telephone: '+254768860665',
      email: 'info@emersoneims.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Embakasi, off Airport North Road',
        addressLocality: 'Nairobi',
        postalCode: '00521',
        addressCountry: 'KE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -1.3200,
        longitude: 36.8900,
      },
      url: 'https://www.emersoneims.com',
      priceRange: '$$',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '17:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '08:00',
          closes: '13:00',
        },
      ],
      areaServed: {
        '@type': 'Country',
        name: 'Kenya',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.emersoneims.com/generators/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.emersoneims.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Generators',
          item: 'https://www.emersoneims.com/generators',
        },
      ],
    },
  ],
};
