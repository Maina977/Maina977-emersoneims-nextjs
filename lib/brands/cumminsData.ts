import { VOLTKA_CONFIRMED_PRICES, confirmedSpan, priceTextFor } from '@/lib/pricing/voltkaConfirmedPrices';

/**
 * CUMMINS GENERATORS BY VOLTKA - BRAND DATA
 * EmersonEIMS sells and services Cummins generators supplied by Voltka in Kenya
 *
 * SEO Keywords: Cummins generators Kenya, Voltka generators,
 * Cummins generator supplier Kenya, Cummins 10-2000KVA
 */

export const CUMMINS_BRAND_INFO = {
  brandName: 'Cummins',
  supplier: 'Voltka',
  dealerStatus: 'Sales & Service',
  country: 'Kenya',
  powerRange: {
    min: 10,
    max: 2000,
    unit: 'KVA'
  },
  warranty: {
    years: 3,
    description: '2 Years Comprehensive Warranty'
  },
  freeService: {
    years: 1,
    description: '1 Year Free Servicing & Maintenance on new sets'
  },
  taglines: [
    'Cummins Sales & Service Across Kenya',
    'Powered by Voltka - Trusted Worldwide',
    '2 Years Warranty + 1 Year Free Servicing on new sets',
    '10KVA to 2000KVA - All Power Needs Covered',
    'Genuine Cummins Parts & Expert Service'
  ],
  benefits: [
    {
      title: '2 Years Warranty',
      description: 'Comprehensive warranty on all new Cummins generators, with terms confirmed in your quotation',
      icon: 'shield'
    },
    {
      title: '1 Year Free Servicing',
      description: 'Scheduled maintenance included for the first year on new generator sets',
      icon: 'wrench'
    },
    {
      title: 'Sales & Service',
      description: 'Cummins (Voltka) generator sales and service in Kenya',
      icon: 'badge'
    },
    {
      title: '10-2000KVA Range',
      description: 'Complete power solutions from small business to industrial',
      icon: 'zap'
    },
    {
      title: 'Genuine Parts',
      description: '100% genuine Cummins spare parts with full traceability',
      icon: 'check'
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock technical support and emergency service',
      icon: 'phone'
    }
  ],
  seoKeywords: [
    'Cummins generators Kenya',
    'Voltka generators Kenya',
    'Cummins generator supplier Kenya',
    'Cummins generator price Kenya',
    'Cummins 10KVA generator',
    'Cummins 20KVA generator',
    'Cummins 50KVA generator',
    'Cummins 100KVA generator',
    'Cummins 200KVA generator',
    'Cummins 500KVA generator',
    'Cummins 1000KVA generator',
    'Cummins 2000KVA generator',
    'buy Cummins generator Kenya',
    'Cummins generator dealer Nairobi',
    'industrial generators Kenya',
    'diesel generators Kenya',
    'Cummins warranty Kenya',
    'generator 2 Years warranty',
    'Voltka Kenya dealer'
  ],
  // Owner-confirmed VOLTKA prices (2026-11-05), read from the one source.
  // Only confirmed sizes are listed; every other size is "Request current
  // price". `price` is display text; the numbers live in voltkaConfirmedPrices.
  models: VOLTKA_CONFIRMED_PRICES.map((p) => ({
    kva: p.kva,
    price: priceTextFor(p.kva),
    application: p.kva <= 150 ? 'Commercial / institutional' : p.kva <= 375 ? 'Industrial' : 'Large industrial',
  })),
  contact: {
    phone: '+254 768 860 665',
    whatsapp: '254768860665',
    email: 'sales@emersoneims.com'
  },
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Cummins Diesel Generators",
    "brand": {
      "@type": "Brand",
      "name": "Cummins"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Voltka"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "KES",
      "lowPrice": String(confirmedSpan().lowKes),
      "highPrice": String(confirmedSpan().highKes),
      "offerCount": String(VOLTKA_CONFIRMED_PRICES.length)
    }
    /*
     * A fabricated aggregateRating was removed here (2026-08-29):
     *     "aggregateRating": { "ratingValue": "4.9", "reviewCount": "127" }
     *
     * No 127 reviews exist. Nothing on this site collects, stores or displays
     * a review corpus, and no source was ever cited for the 4.9. Review
     * markup that is not backed by reviews visible on the page is a direct
     * breach of Google's structured-data policy and draws a manual action
     * against the whole domain, not one page.
     *
     * It was dormant rather than live — the pages importing CUMMINS_BRAND_INFO
     * read .warranty, .supplier and .powerRange, never .structuredData, and
     * checking the live HTML as Googlebot confirmed no aggregateRating was
     * being served. It is deleted anyway, because it sat one render away from
     * shipping and anyone wiring this object up would have published it
     * without knowing.
     *
     * If genuine reviews are ever collected, this can return — with the
     * reviews themselves rendered on the page, which is what the policy
     * actually requires.
     */
  }
};

export const CUMMINS_FAQ = [
  {
    question: "Does EmersonEIMS supply and service Cummins generators in Kenya?",
    answer: "EmersonEIMS sells and services Cummins generators supplied by Voltka in Kenya. We supply genuine Cummins generators from 10KVA to 2000KVA with full manufacturer warranty and support."
  },
  {
    question: "What warranty do Cummins generators come with?",
    answer: "All Cummins generators from EmersonEIMS come with a comprehensive 2-year warranty covering parts and labor, plus 1 year of free service and maintenance included."
  },
  {
    question: "What sizes of Cummins generators are available?",
    answer: "We stock Cummins generators ranging from 10KVA for small offices to 2000KVA for utility-scale power plants. Popular sizes include 20KVA, 50KVA, 100KVA, 250KVA, 500KVA, and 1000KVA."
  },
  {
    question: "What is included in the 1 year free servicing?",
    answer: "One year of free servicing on new generator sets: scheduled maintenance visits, oil and filter changes, system inspections and technical support. It runs from commissioning, and the visit schedule is set out in your written quotation."
  },
  {
    question: "Do you provide installation services?",
    answer: "Yes, we provide complete turnkey installation including site preparation, electrical connections, ATS installation, commissioning, and operator training."
  },
  {
    question: "Are genuine Cummins spare parts available?",
    answer: "Yes, we maintain a comprehensive inventory of genuine Cummins spare parts, with full traceability and manufacturer guarantee."
  },
  {
    question: "What industries do you serve?",
    answer: "We serve all industries including hospitals, hotels, manufacturing, agriculture, telecommunications, data centers, schools, shopping malls, and residential estates."
  },
  {
    question: "Do you offer financing for Cummins generators?",
    answer: "Yes, we work with leading banks and financial institutions to offer flexible payment plans and asset financing options for Cummins generator purchases."
  }
];

export default CUMMINS_BRAND_INFO;
