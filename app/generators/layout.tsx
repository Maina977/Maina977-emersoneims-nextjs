import type { Metadata } from "next";

export const metadata: Metadata = {
  /*
   * TITLE LENGTH — do not append "| EmersonEIMS" here.
   * The root layout applies the template "%s | EmersonEIMS Kenya", so anything
   * added here is on top of that. The previous title ended in "| EmersonEIMS"
   * and rendered as "... | EmersonEIMS | EmersonEIMS Kenya" — 107 characters
   * with the brand twice, which Google truncates at roughly 60 and which reads
   * as keyword stuffing. Keep this field to ~45 characters.
   */
  /*
   * "VOLTKA Cummins", not "Cummins & VOLTKA".
   * They are not two competing brands. Per lib/brands/cumminsData.ts the
   * relationship is brandName: 'Cummins', supplier: 'Voltka' — Cummins sets
   * supplied through Voltka, sold and serviced by EmersonEIMS. The ampersand
   * implied a choice between two makes and split the keyword; the real
   * flagship line is named VOLTKA Cummins (VKS 44 through VKS 275).
   */
  title: "VOLTKA Cummins Generators | 10-2000kVA",
  /*
   * KEEP THIS UNDER ~155 CHARACTERS.
   * The previous version ran to 260 and Google cut it mid-sentence, which
   * wasted the part that actually sells: the warranty and the price range.
   * Lead with the numbers a buyer is searching for.
   */
  description: "Diesel generators in Kenya, 10kVA-2000kVA, from KES 350,000. 2-year warranty + 1 year free servicing. Installed and serviced in all 47 counties.",
  // NOTE: keywords meta tag removed - Google ignores it since 2009
  openGraph: {
    title: 'Cummins & Voltka Generators Kenya | 10-2000kVA',
    description: 'Cummins generator sales & maintenance specialist. NEW generators with warranty + 1 year free maintenance. Serving all 47 counties. Expert installation & support.',
    type: 'website',
    url: 'https://www.emersoneims.com/generators',
    siteName: 'EmersonEIMS',
    images: [
      {
        url: 'https://www.emersoneims.com/wp-content/uploads/2024/09/cummins-generator.jpg',
        width: 1200,
        height: 630,
        alt: 'Cummins Generator Kenya - EmersonEIMS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cummins Generators Kenya',
    description: 'Buy NEW Cummins generators in Kenya. 10kVA-2000kVA. 1 year free service.',
  },
  /*
   * NO `alternates.canonical` HERE — a layout's metadata is inherited by every
   * page beneath it, so this hard-coded value made /generators/used,
   * /generators/leasing, /generators/systems, /generators/case-studies and
   * /generators/maintenance-companion all canonicalise to /generators and lose
   * their own ranking. Those are commercial pages. The root layout emits a
   * correct self-referential canonical from `x-pathname`.
   */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// JSON-LD Structured Data for Generators
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.emersoneims.com/#organization',
      name: 'EmersonEIMS',
      url: 'https://www.emersoneims.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.emersoneims.com/logo.png',
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
        'https://www.facebook.com/emersoneims',
        'https://twitter.com/emersoneims',
        'https://www.linkedin.com/company/emersoneims',
      ],
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.emersoneims.com/generators/#webpage',
      url: 'https://www.emersoneims.com/generators',
      name: 'Generators - Cummins & Voltka Diesel Generators Kenya',
      isPartOf: { '@id': 'https://www.emersoneims.com/#website' },
      about: { '@id': 'https://www.emersoneims.com/#organization' },
      description: 'Buy NEW Cummins & Voltka diesel generators in Kenya. 10kVA to 2000kVA with warranty and free maintenance.',
    },
    {
      '@type': 'Product',
      '@id': 'https://www.emersoneims.com/generators/#product',
      name: 'Cummins Diesel Generators by Voltka - Kenya',
      image: 'https://www.emersoneims.com/wp-content/uploads/2024/09/cummins-generator.jpg',
      brand: {
        '@type': 'Brand',
        name: 'Cummins',
      },
      manufacturer: {
        '@type': 'Organization',
        name: 'Voltka',
      },
      description: 'Cummins & Voltka diesel generators in Kenya. 10KVA to 2000KVA with 2-YEAR WARRANTY + 1 YEAR FREE SERVICE. Genuine parts, expert installation. Multi-brand specialist.',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'KES',
        lowPrice: '500000',
        highPrice: '48000000',
        availability: 'https://schema.org/InStock',
        seller: { '@id': 'https://www.emersoneims.com/#organization' },
        offerCount: '50',
        warranty: '2 Years Comprehensive Warranty + 1 Year Free Service',
      },
      // No self-asserted aggregateRating — violates Google's structured-data
      // policy without on-page UGC reviews, and triggered "Review has multiple
      // aggregate ratings" in Search Console alongside other schema on /generators.
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.emersoneims.com/#localbusiness',
      name: 'EmersonEIMS - Generator Sales & Services',
      image: 'https://www.emersoneims.com/logo.png',
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
          closes: '18:00',
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

export default function GeneratorsLayout({
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


