import { Metadata } from 'next';
import Script from 'next/script';

/**
 * Africa Landing Page - SEO Metadata
 * Targeting all African generator technicians and maintenance professionals
 *
 * DISCLAIMER: Generator Oracle is an independently developed diagnostic tool.
 * NOT affiliated with, endorsed by, or sponsored by any controller manufacturer.
 * All brand names are trademarks of their respective owners.
 */

export const metadata: Metadata = {
  title: 'Generator Oracle Africa | 230,000+ Fault Codes for African Technicians',
  description: 'The #1 generator diagnostic tool for Africa. 230,000+ fault codes compatible with DSE, ComAp, Woodward, SmartGen, PowerWizard & more. Works offline. Available in Swahili, Arabic, French. Used by technicians in Kenya, Nigeria, Tanzania, Uganda, South Africa & 50+ countries.',
  keywords: [
    // Pan-African keywords
    'generator fault codes Africa',
    'generator diagnostics Africa',
    'generator technician Africa',
    'power generator Africa',
    'diesel generator Africa',
    'generator maintenance Africa',
    'generator repair Africa',

    // East Africa
    'generator fault codes Kenya',
    'generator diagnostics Tanzania',
    'generator technician Uganda',
    'generator maintenance Rwanda',
    'generator repair Ethiopia',
    'power generator East Africa',

    // West Africa
    'generator fault codes Nigeria',
    'generator diagnostics Ghana',
    'generator technician Lagos',
    'generator maintenance Abuja',
    'generator repair West Africa',

    // Southern Africa
    'generator fault codes South Africa',
    'generator diagnostics Johannesburg',
    'generator technician Cape Town',
    'generator maintenance Zambia',
    'generator repair Zimbabwe',

    // North Africa
    'generator fault codes Egypt',
    'generator diagnostics Morocco',
    'generator technician Cairo',

    // Controller brands
    'DeepSea fault codes Africa',
    'ComAp diagnostics Africa',
    'Woodward generator Africa',
    'SmartGen controller Africa',
    'PowerWizard fault codes Africa',
    'DSE 7320 Africa',
    'InteliLite Africa',

    // Generator brands
    'Cummins generator Africa',
    'Perkins generator Africa',
    'CAT generator Africa',
    'FG Wilson Africa',
    'Kohler generator Africa',
    'Sdmo generator Africa',

    // Languages
    'generator diagnostics Swahili',
    'generator fault codes Arabic',
    'generator maintenance French',
    'generator repair Kiswahili',

    // Features
    'offline generator diagnostics',
    'generator fault code lookup',
    'generator error code database',
    'generator troubleshooting app',
    'generator diagnostic tool',
    'generator maintenance app',
  ],
  authors: [{ name: 'Emerson Industrial Maintenance Services' }],
  creator: 'Emerson EiMS',
  publisher: 'Emerson Industrial Maintenance Services Limited',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['sw_KE', 'fr_FR', 'ar_SA'],
    url: 'https://www.emersoneims.com/generator-oracle/africa',
    siteName: 'Generator Oracle',
    title: 'Generator Oracle Africa | #1 Diagnostic Tool for African Technicians',
    description: '230,000+ fault codes compatible with all major controller types. Works offline. Available in 7 languages including Swahili, Arabic & French. Trusted by technicians across Africa.',
    images: [
      {
        url: '/images/generator-oracle-africa-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Generator Oracle - Africa\'s Leading Diagnostic Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator Oracle Africa | 230,000+ Fault Codes',
    description: 'The #1 generator diagnostic tool for African technicians. Works offline, supports 7 languages.',
    images: ['/images/generator-oracle-africa-og.jpg'],
    creator: '@EmersonEiMS',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/generator-oracle/africa',
    languages: {
      'en': 'https://www.emersoneims.com/generator-oracle/africa',
      'sw': 'https://www.emersoneims.com/generator-oracle/africa?lang=sw',
      'fr': 'https://www.emersoneims.com/generator-oracle/africa?lang=fr',
      'ar': 'https://www.emersoneims.com/generator-oracle/africa?lang=ar',
    },
  },
  category: 'Technology',
};

// Structured Data for Africa page
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    // Software Application
    {
      '@type': 'SoftwareApplication',
      name: 'Generator Oracle',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      description: 'Professional generator diagnostic tool with 230,000+ fault codes compatible with DSE, ComAp, Woodward, SmartGen, PowerWizard and more controller types. Independently developed - not affiliated with any manufacturer.',
      offers: {
        '@type': 'Offer',
        price: '20000',
        priceCurrency: 'KES',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '500',
        bestRating: '5',
        worstRating: '1',
      },
      featureList: [
        '230,000+ fault codes',
        'Compatible with 9 controller types',
        '7 languages including Swahili, Arabic, French',
        '100% offline capability',
        'Step-by-step reset procedures',
        'Instant diagnostics',
      ],
      screenshot: 'https://www.emersoneims.com/images/generator-oracle-screenshot.jpg',
      softwareVersion: '2.0',
      author: {
        '@type': 'Organization',
        name: 'Emerson Industrial Maintenance Services',
      },
    },
    // Organization
    {
      '@type': 'Organization',
      name: 'Emerson Industrial Maintenance Services',
      url: 'https://www.emersoneims.com',
      logo: 'https://www.emersoneims.com/logo.png',
      description: 'Leading provider of generator maintenance services and diagnostic tools across Africa.',
      areaServed: [
        { '@type': 'Continent', name: 'Africa' },
        { '@type': 'Country', name: 'Kenya' },
        { '@type': 'Country', name: 'Nigeria' },
        { '@type': 'Country', name: 'Tanzania' },
        { '@type': 'Country', name: 'Uganda' },
        { '@type': 'Country', name: 'South Africa' },
        { '@type': 'Country', name: 'Ghana' },
        { '@type': 'Country', name: 'Ethiopia' },
        { '@type': 'Country', name: 'Rwanda' },
        { '@type': 'Country', name: 'Egypt' },
        { '@type': 'Country', name: 'Morocco' },
        { '@type': 'Country', name: 'Zambia' },
        { '@type': 'Country', name: 'Zimbabwe' },
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+254782914717',
          contactType: 'sales',
          areaServed: 'Africa',
          availableLanguage: ['English', 'Swahili', 'French', 'Arabic'],
        },
        {
          '@type': 'ContactPoint',
          telephone: '+254768860665',
          contactType: 'customer service',
          areaServed: 'Africa',
          availableLanguage: ['English', 'Swahili'],
        },
      ],
      sameAs: [
        'https://www.facebook.com/emersoneims',
        'https://twitter.com/EmersonEiMS',
        'https://www.linkedin.com/company/emerson-eims',
      ],
    },
    // FAQPage
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Does Generator Oracle work in Africa without internet?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Generator Oracle works 100% offline. Once installed, you can diagnose generators anywhere in Africa without internet connectivity - perfect for remote sites and rural areas.',
          },
        },
        {
          '@type': 'Question',
          name: 'What languages does Generator Oracle support for African users?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Generator Oracle supports 7 languages including English, Kiswahili (for East Africa), French (for West and Central Africa), Arabic (for North Africa), Spanish, Hindi, and Chinese.',
          },
        },
        {
          '@type': 'Question',
          name: 'What controller types is Generator Oracle compatible with?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Generator Oracle is compatible with all major controller types used in Africa including DSE, ComAp, Woodward, SmartGen, PowerWizard, Datakom, Lovato, Siemens, and ENKO type controllers. Note: Generator Oracle is independently developed and not affiliated with any manufacturer.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does Generator Oracle cost in Africa?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Generator Oracle costs KES 20,000 per year (approximately $154 USD). This includes full access to 230,000+ fault codes, all languages, offline capability, and all updates. Free trial available until March 2026.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I pay for Generator Oracle using M-Pesa or mobile money?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! You can pay via M-Pesa (send to 0782914717) or bank transfer to Equity Bank account 1320285133753. We support mobile money payments from across Africa.',
          },
        },
      ],
    },
    // BreadcrumbList
    {
      '@type': 'BreadcrumbList',
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
          name: 'Generator Oracle',
          item: 'https://www.emersoneims.com/generator-oracle',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Africa',
          item: 'https://www.emersoneims.com/generator-oracle/africa',
        },
      ],
    },
  ],
};

export default function AfricaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="africa-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
