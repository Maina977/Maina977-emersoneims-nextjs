/**
 * Tiny helper that injects a SoftwareApplication / Product JSON-LD blob
 * into a page so that flagship tools show up as real products in search.
 */
import Script from 'next/script';

export type FlagshipSchemaProps = {
  name: string;
  url: string;
  description: string;
  category: string;
  applicationCategory?: string;
  /** Square or banner image URL. */
  image?: string;
  /** e.g. ['EmersonEIMS','Engineering','AI'] */
  keywords?: string[];
  /** e.g. 'Generator Diagnostics' */
  industry?: string;
  /** Optional offer price in KES. */
  priceKes?: number | 'Free';
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export default function FlagshipProductSchema(p: FlagshipSchemaProps) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: p.name,
    url: p.url,
    description: p.description,
    applicationCategory: p.applicationCategory || 'BusinessApplication',
    operatingSystem: 'Web',
    image: p.image || `${SITE}/og-image.jpg`,
    keywords: (p.keywords || []).join(', '),
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: 'EmersonEIMS',
      url: SITE,
      logo: `${SITE}/logo.png`,
      sameAs: [
        'https://www.facebook.com/EmersonEIMS',
        'https://twitter.com/EmersonEIMS',
        'https://www.linkedin.com/company/emersoneims',
      ],
      email: 'info@emersoneims.com',
      telephone: '+254768860665',
    },
    audience: {
      '@type': 'BusinessAudience',
      audienceType: p.industry || 'Engineering, Facility Management, EPC',
    },
    offers: {
      '@type': 'Offer',
      price: p.priceKes === 'Free' || p.priceKes === undefined ? 0 : p.priceKes,
      priceCurrency: 'KES',
      availability: 'https://schema.org/InStock',
      url: p.url,
    },
  };
  return (
    <Script
      id={`flagship-schema-${p.name.replace(/\s+/g, '-').toLowerCase()}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
