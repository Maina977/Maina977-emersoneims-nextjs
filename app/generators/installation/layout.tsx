import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Installation Services Kenya | Professional Installation | EmersonEIMS',
  description: 'Professional generator installation services across all 47 Kenya counties. Complete 8-phase installation process: site assessment, engineering design, civil works, electrical installation, commissioning. KEBS certified. All brands: Cummins, Caterpillar, Perkins, FG Wilson.',
  keywords: [
    // Primary Installation Keywords
    'generator installation Kenya',
    'generator installation services',
    'generator installation Nairobi',
    'professional generator installation',
    'commercial generator installation',
    'industrial generator installation',
    'residential generator installation',
    // Installation Types
    'indoor generator installation',
    'outdoor generator installation',
    'rooftop generator installation',
    'containerized generator installation',
    'temporary generator installation',
    // Brands
    'Cummins generator installation',
    'Caterpillar generator installation',
    'Perkins generator installation',
    'FG Wilson generator installation',
    'Kohler generator installation',
    // Technical Terms
    'ATS installation Kenya',
    'automatic transfer switch installation',
    'generator foundation construction',
    'generator electrical wiring',
    'generator commissioning',
    'load bank testing Kenya',
    'generator earthing system',
    // Compliance
    'KEBS generator certification',
    'NEMA generator permit',
    'Kenya Power generator connection',
    'generator compliance Kenya',
    // Services
    'generator site assessment',
    'generator engineering design',
    'generator civil works',
    'generator mechanical installation',
    'generator electrical installation',
    'generator testing commissioning',
    // Location Keywords
    'generator installation Mombasa',
    'generator installation Kisumu',
    'generator installation Nakuru',
    'generator installation Eldoret',
    'generator installation Kiambu',
    'generator installation Machakos',
    // Long-tail
    'how to install a generator Kenya',
    'generator installation cost Kenya',
    'generator installation requirements',
    'generator installation checklist',
    'generator installation guide Kenya',
    'best generator installation company Kenya',
  ],
  openGraph: {
    title: 'Professional Generator Installation Services | EmersonEIMS Kenya',
    description: 'Complete generator installation from site assessment to commissioning. 1,200+ installations completed. 47 counties coverage. 100% compliance rate.',
    type: 'website',
    url: 'https://emersoneims.com/generators/installation',
    siteName: 'EmersonEIMS',
    images: [
      {
        url: 'https://www.emersoneims.com/wp-content/uploads/2024/09/gen-installation.jpg',
        width: 1200,
        height: 630,
        alt: 'EmersonEIMS Professional Generator Installation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator Installation Kenya | EmersonEIMS',
    description: 'Professional generator installation services. 8-phase process. All brands. 47 counties.',
  },
  alternates: {
    canonical: 'https://emersoneims.com/generators/installation',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Structured Data for Installation Services
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': 'https://emersoneims.com/generators/installation/#service',
      name: 'Generator Installation Services',
      serviceType: 'Generator Installation',
      provider: {
        '@type': 'Organization',
        name: 'EmersonEIMS',
        '@id': 'https://emersoneims.com/#organization',
      },
      areaServed: { '@type': 'Country', name: 'Kenya' },
      description: 'Professional generator installation services including site assessment, foundation construction, electrical wiring, ATS installation, and commissioning.',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Installation Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Site Assessment', description: 'Complete site survey and load analysis' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Engineering Design', description: 'Professional engineering drawings and specifications' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Civil Works', description: 'Foundation construction and site preparation' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Electrical Installation', description: 'Cabling, ATS, and control systems' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Commissioning', description: 'Testing and handover' } },
        ],
      },
    },
    {
      '@type': 'HowTo',
      '@id': 'https://emersoneims.com/generators/installation/#howto',
      name: 'Generator Installation Process',
      description: 'Our 8-phase professional generator installation process',
      totalTime: 'P14D',
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Site Assessment', text: 'Complete evaluation of your site for optimal generator placement' },
        { '@type': 'HowToStep', position: 2, name: 'Engineering Design', text: 'Professional drawings and specifications' },
        { '@type': 'HowToStep', position: 3, name: 'Equipment Procurement', text: 'Sourcing generator and all installation materials' },
        { '@type': 'HowToStep', position: 4, name: 'Civil Works', text: 'Foundation construction and site preparation' },
        { '@type': 'HowToStep', position: 5, name: 'Mechanical Installation', text: 'Generator positioning and fuel system setup' },
        { '@type': 'HowToStep', position: 6, name: 'Electrical Installation', text: 'Cabling, ATS, and control connections' },
        { '@type': 'HowToStep', position: 7, name: 'Testing & Commissioning', text: 'Load bank testing and acceptance' },
        { '@type': 'HowToStep', position: 8, name: 'Handover & Training', text: 'Documentation and operator training' },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://emersoneims.com' },
        { '@type': 'ListItem', position: 2, name: 'Generators', item: 'https://emersoneims.com/generators' },
        { '@type': 'ListItem', position: 3, name: 'Installation', item: 'https://emersoneims.com/generators/installation' },
      ],
    },
  ],
};

export default function InstallationLayout({
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
