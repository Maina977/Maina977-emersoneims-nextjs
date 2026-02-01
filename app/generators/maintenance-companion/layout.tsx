import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Maintenance AI Companion | Oracle Heavy Plant & Equipment',
  description: 'Your complete AI-powered generator maintenance companion. Repair guides, parts catalog, predictive failure analysis, efficiency calculator, and financial dashboard. The ultimate fusion of repair manual, parts manual, and AI diagnostics.',
  keywords: [
    'generator maintenance',
    'generator repair guide',
    'generator parts catalog',
    'predictive maintenance',
    'generator efficiency calculator',
    'generator ROI analysis',
    'generator troubleshooting',
    'diesel generator service',
    'generator fault diagnosis',
    'generator schematic',
    'Cummins maintenance',
    'Caterpillar generator parts',
    'Perkins service manual',
    'Kenya generator service',
    'Africa generator maintenance'
  ],
  openGraph: {
    title: 'Generator Maintenance AI Companion | Oracle Heavy Plant',
    description: 'The ultimate AI-powered generator maintenance platform. Repair guides, parts catalog, predictive analysis, and financial intelligence.',
    type: 'website',
    locale: 'en_KE',
    images: [
      {
        url: '/images/maintenance-companion-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Generator Maintenance AI Companion'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator Maintenance AI Companion',
    description: 'Complete AI-powered maintenance platform for generators'
  }
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
            name: 'Generator Maintenance AI Companion',
            applicationCategory: 'MaintenanceApplication',
            description: 'AI-powered generator maintenance companion with repair guides, parts catalog, predictive analysis, and financial dashboard',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'KES'
            },
            operatingSystem: 'Web Browser',
            provider: {
              '@type': 'Organization',
              name: 'Oracle Heavy Plant & Equipment',
              url: 'https://oracleheavyplant.com'
            },
            featureList: [
              'AI-powered failure prediction',
              'Interactive schematic diagrams',
              'Step-by-step repair guides',
              'Comprehensive parts catalog',
              'Real-time efficiency calculator',
              'Repair vs replace analysis',
              'ROI tracking and projections'
            ]
          })
        }}
      />
      {children}
    </>
  );
}
