import { Metadata } from 'next';
import Script from 'next/script';

/**
 * Solar Maintenance Hub - SEO Metadata
 * Complete solar system maintenance for Kenya and East Africa
 */

export const metadata: Metadata = {
  title: 'Solar Solution School | 10 AI Engines | World\'s Most Advanced Solar Platform | EmersonEIMS',
  description: 'World\'s most advanced solar design platform with 10 AI engines. 3D AI modeling, voice commands, neural optimization, 25-year predictions. Covers 15 African countries. Enterprise integrations with Salesforce & DocuSign. Free AI-powered solar design.',
  authors: [{ name: 'EmersonEIMS' }],
  creator: 'EmersonEIMS',
  publisher: 'EmersonEIMS',
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
    locale: 'en_KE',
    url: 'https://www.emersoneims.com/solar',
    siteName: 'EmersonEIMS',
    title: 'Solar Solution School | 10 AI Engines | EmersonEIMS',
    description: 'World\'s most advanced solar platform. 10 AI engines: 3D Design, Voice Control, Neural Optimizer, Permit Generator, Energy Oracle, Financial Genius, Design Copilot, Anomaly Detector, Drone Commander, Grid Analyzer. 15 African countries.',
    images: [
      {
        url: '/images/solar-ai-platform-og.jpg',
        width: 1200,
        height: 630,
        alt: 'EmersonEIMS Solar Solution School - 10 AI Engines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Solution School | 10 AI Engines | EmersonEIMS',
    description: 'World\'s most advanced solar AI. 10 engines, 15 countries, voice control, 3D design. Free.',
    images: ['/images/solar-ai-platform-og.jpg'],
    creator: '@EmersonEiMS',
  },
  alternates: {
    canonical: 'https://www.emersoneims.com/solar',
  },
  category: 'Technology',
};

// Structured Data
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Solar Solution School',
      applicationCategory: 'BusinessApplication',
      description: 'World\'s most advanced solar design platform featuring 10 AI engines: AI Depth Estimator, Neural Panel Optimizer, AI Permit Generator, Satellite Roof Analyzer, AI Energy Oracle, Financial Genius, Design Copilot, Anomaly Detector, Drone Commander, and Grid Analyzer.',
      operatingSystem: 'Any (Web-based)',
      url: 'https://www.emersoneims.com/solar',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'KES',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '500',
        bestRating: '5',
      },
      featureList: '10 AI Engines, 3D Design Studio, Voice Commands, 25-Year Predictions, 15 Countries Coverage, Enterprise Integrations, Neural Optimization, Permit Generation, Drone Planning, Grid Analysis',
      provider: {
        '@type': 'Organization',
        name: 'EmersonEIMS',
        telephone: '+254768860665',
        email: 'info@emersoneims.com',
      },
    },
    {
      '@type': 'Service',
      name: 'AI-Powered Solar Design & Installation',
      serviceType: 'Solar System Design and Installation',
      description: 'Complete AI-powered solar design with 10 AI engines, 3D modeling, voice control, and installation services across 15 African countries.',
      provider: {
        '@type': 'Organization',
        name: 'EmersonEIMS',
        telephone: '+254768860665',
        email: 'info@emersoneims.com',
      },
      areaServed: [
        { '@type': 'Country', name: 'Kenya' },
        { '@type': 'Country', name: 'Tanzania' },
        { '@type': 'Country', name: 'Uganda' },
        { '@type': 'Country', name: 'Rwanda' },
        { '@type': 'Country', name: 'Ethiopia' },
        { '@type': 'Country', name: 'Burundi' },
        { '@type': 'Country', name: 'South Sudan' },
        { '@type': 'Country', name: 'Somalia' },
        { '@type': 'Country', name: 'DR Congo' },
        { '@type': 'Country', name: 'Cameroon' },
        { '@type': 'Country', name: 'Central African Republic' },
        { '@type': 'Country', name: 'Gabon' },
        { '@type': 'Country', name: 'Congo' },
        { '@type': 'Country', name: 'Chad' },
        { '@type': 'Country', name: 'Madagascar' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Solar Solution School?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Solar Solution School is the world\'s most advanced solar design platform by EmersonEIMS. It features 10 AI engines including 3D design, voice control, neural optimization, permit generation, and 25-year production predictions. It covers 15 African countries.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the 10 AI engines in Solar Solution School?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The 10 AI engines are: 1) AI Depth Estimator - 3D from photos, 2) Neural Panel Optimizer - ML placement, 3) AI Permit Generator - auto documents, 4) Satellite Roof Analyzer, 5) AI Energy Oracle - 25-year predictions, 6) Financial Genius - ROI analysis, 7) Design Copilot - voice commands, 8) Anomaly Detector - predictive maintenance, 9) Drone Commander - survey planning, 10) Grid Analyzer - optimization.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which countries does Solar Solution School cover?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Solar Solution School covers 15 African countries: Kenya, Tanzania, Uganda, Rwanda, Ethiopia, Burundi, South Sudan, Somalia, DR Congo, Cameroon, Central African Republic, Gabon, Congo, Chad, and Madagascar. Each country has local utility data, incentives, and currency support.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Solar Solution School free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Solar Solution School is free to use. All 10 AI engines, 3D design tools, voice control, and calculators are available at no cost. Enterprise integrations with Salesforce, DocuSign, and QuickBooks are also included.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I design solar systems using voice commands?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Solar Solution School features AI Design Copilot that accepts natural language voice commands like "Add 10 panels avoiding the chimney" or "Maximize production on south roof". This is an industry-first feature.',
          },
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
          name: 'Solar Solution School',
          item: 'https://www.emersoneims.com/solar',
        },
      ],
    },
  ],
};

export default function SolarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="solar-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
