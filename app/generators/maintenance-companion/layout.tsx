import type { Metadata } from 'next';

/*
 * 2026-10-25 audit: the metadata named another organisation ("Oracle Heavy
 * Plant & Equipment", oracleheavyplant.com) as the provider of this page,
 * promised "AI-powered failure prediction", and pointed at an Open Graph image
 * that does not exist. It now describes this page, provided by EmersonEIMS.
 */
const DESCRIPTION =
  'Generator maintenance companion: repair guides, a parts catalogue, an efficiency calculator and repair-or-replace costing, written by EmersonEIMS engineers in Kenya.';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/generators/maintenance-companion' },
  title: 'Generator Maintenance Companion',
  description: DESCRIPTION,
  keywords: [
    'generator maintenance',
    'generator repair guide',
    'generator parts catalog',
    'generator efficiency calculator',
    'generator troubleshooting',
    'diesel generator service',
    'generator fault diagnosis',
    'Kenya generator service',
  ],
  openGraph: {
    title: 'Generator Maintenance Companion | EmersonEIMS',
    description: DESCRIPTION,
    type: 'website',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary',
    title: 'Generator Maintenance Companion',
    description: DESCRIPTION,
  },
};

export default function MaintenanceCompanionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Generator Maintenance Companion',
            applicationCategory: 'BusinessApplication',
            description: DESCRIPTION,
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'KES',
            },
            operatingSystem: 'Web Browser',
            provider: {
              '@type': 'Organization',
              name: 'EmersonEIMS',
              url: 'https://www.emersoneims.com',
            },
            featureList: [
              'Step-by-step repair guides',
              'Parts catalogue',
              'Efficiency calculator',
              'Repair vs replace costing',
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
