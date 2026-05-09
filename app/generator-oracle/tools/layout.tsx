import { Metadata } from 'next';
import Script from 'next/script';

/**
 * Generator Oracle Tools - SEO Layout
 * Controller simulators, wiring diagrams, programming guides
 */

export const metadata: Metadata = {
  title: 'Generator Tools | Controller Simulators & Wiring Diagrams',
  description: 'Interactive generator controller simulators for DeepSea, ComAp, Woodward, SmartGen. Complete wiring diagrams with terminal labels. Program controllers without a laptop. Real-time fault analysis.',
  keywords: [
    // Controller simulators
    'generator controller simulator',
    'DSE controller simulator',
    'ComAp controller simulator',
    'DeepSea simulator',
    'InteliLite simulator',

    // Wiring diagrams
    'generator wiring diagram',
    'DSE wiring diagram',
    'ComAp wiring diagram',
    'generator controller wiring',
    'generator terminal diagram',

    // Programming
    'program generator controller',
    'DSE programming without laptop',
    'ComAp programming guide',
    'generator controller setup',
    'controller parameter setup',

    // Fault analysis
    'generator fault analysis',
    'fault code interpretation',
    'generator diagnostics tool',
    'controller troubleshooting',

    // Brands
    'DeepSea DSE 7320',
    'ComAp InteliLite',
    'Woodward EasyGen',
    'SmartGen HGM',
    'CAT PowerWizard',

    // Technical
    'generator sensor wiring',
    'oil pressure sensor wiring',
    'coolant temp sensor wiring',
    'generator starting circuit',
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
    url: 'https://www.emersoneims.com/generator-oracle/tools',
    siteName: 'Generator Oracle',
    title: 'Generator Tools | Controller Simulators & Wiring Diagrams',
    description: 'Interactive controller simulators and complete wiring diagrams for all major generator controllers. Program without a laptop.',
    images: [
      {
        url: '/images/generator-tools-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Generator Oracle Tools - Controller Simulators & Wiring Diagrams',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator Tools | Simulators & Wiring Diagrams',
    description: 'Interactive controller simulators and wiring diagrams for DeepSea, ComAp, Woodward.',
    images: ['/images/generator-tools-og.jpg'],
    creator: '@EmersonEiMS',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/generator-oracle/tools',
  },
  category: 'Technology',
};

// Structured Data
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Generator Oracle Tools',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'Interactive generator controller simulators and wiring diagrams for professional technicians. Supports DeepSea, ComAp, Woodward, SmartGen, and CAT controllers.',
      featureList: [
        'Interactive controller simulators',
        'Complete wiring diagrams with terminal labels',
        'Program controllers without laptop',
        'Real-time sensor value analysis',
        'AI-powered fault diagnosis',
        'Step-by-step repair procedures',
      ],
      author: {
        '@type': 'Organization',
        name: 'Emerson Industrial Maintenance Services',
      },
    },
    {
      '@type': 'HowTo',
      name: 'How to Use Generator Controller Simulator',
      description: 'Learn how to use the interactive controller simulator to diagnose generator problems',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Select Controller Type',
          text: 'Choose your controller type (DeepSea, ComAp, Woodward, SmartGen, or CAT)',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Enter Sensor Values',
          text: 'Input actual readings from your generator sensors',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'View Simulated Display',
          text: 'See how values appear on the controller display',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Get AI Analysis',
          text: 'Receive automatic analysis of entered values and potential issues',
        },
      ],
    },
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
          name: 'Tools',
          item: 'https://www.emersoneims.com/generator-oracle/tools',
        },
      ],
    },
  ],
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="tools-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
