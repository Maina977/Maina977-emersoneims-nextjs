import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const URL = `${SITE}/ai-tools`;

export const metadata: Metadata = {
  title: 'AI Engineering Tools — Generator Oracle, Solar Genius, AquaScan Pro | EmersonEIMS',
  description:
    'Free AI tools for power, solar and water engineering: Generator Oracle (controller fault diagnosis), Solar Genius Pro (commercial solar engineering), AquaScan Pro (borehole intelligence) and Building Suite Pro. All in-browser, no signup.',
  keywords: [
    'AI engineering tools Kenya',
    'Generator Oracle',
    'Solar Genius Pro',
    'AquaScan Pro',
    'Building Suite Pro',
    'EIMS PRO',
    'free engineering AI',
    'EmersonEIMS AI tools',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'AI Engineering Tools — Generator Oracle, Solar Genius, AquaScan Pro | EmersonEIMS',
    description:
      'Free AI engineering tools in your browser: generator diagnostics, solar design, borehole analysis, BIM/QS.',
    url: URL,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'EmersonEIMS AI Engineering Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Engineering Tools — EmersonEIMS',
    description: 'Generator Oracle, Solar Genius Pro, AquaScan Pro, Building Suite Pro. Free.',
    images: [`${SITE}/og-image.jpg`],
    site: '@EmersonEIMS',
  },
  robots: { index: true, follow: true },
  category: 'engineering',
};

const ITEM_LIST_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'EmersonEIMS AI Engineering Tools',
  itemListElement: [
    { '@type': 'ListItem', position: 1, url: `${SITE}/generator-oracle`, name: 'Generator Oracle' },
    { '@type': 'ListItem', position: 2, url: `${SITE}/solar-genius-pro`, name: 'Solar Genius Pro' },
    { '@type': 'ListItem', position: 3, url: `${SITE}/aquascan-pro-v3`, name: 'AquaScan Pro' },
    { '@type': 'ListItem', position: 4, url: `${SITE}/eims-pro`, name: 'Building Suite Pro' },
    { '@type': 'ListItem', position: 5, url: `${SITE}/solar-design-studio`, name: 'Solar Design Studio' },
    { '@type': 'ListItem', position: 6, url: `${SITE}/hub`, name: 'Solar & UPS Intelligence Hub' },
  ],
};

// ────────────────────────────────────────────────────────────────────
// Per-tool SoftwareApplication schemas. This is the schema type Google
// uses for the SoftwareApp rich result in search — without it the
// tools could only ever appear as plain blue links. Every fact below
// is verifiable on the live tool page; per data policy, no fabricated
// metrics. Free tools => price 0 / KES with InStock availability so
// search engines don't flag them as paywalled SaaS.
// ────────────────────────────────────────────────────────────────────
const TOOL_SOFTWARE_SCHEMAS = [
  {
    name: 'Generator Oracle',
    url: `${SITE}/generator-oracle`,
    applicationCategory: 'BusinessApplication',
    description:
      'AI-powered generator fault-code diagnostic platform with a large fault-code database, interactive wiring diagrams and step-by-step repair guides. Supports major generator brands and controllers.',
  },
  {
    name: 'Solar Genius Pro',
    url: `${SITE}/solar-genius-pro`,
    applicationCategory: 'DesignApplication',
    description:
      'AI solar system design, sizing and ROI optimisation. Panel placement, battery and inverter selection, weather-adjusted performance modelling and payback analysis for residential, commercial and industrial PV.',
  },
  {
    name: 'AquaScan Pro',
    url: `${SITE}/aquascan-pro-v3`,
    applicationCategory: 'BusinessApplication',
    description:
      'Intelligent borehole and water-pump diagnostic system with predictive maintenance, energy-optimisation and flow-rate guidance. Backed by authoritative hydrological and meteorological data sources.',
  },
  {
    name: 'EIMS Pro Building Suite',
    url: `${SITE}/eims-pro`,
    applicationCategory: 'DesignApplication',
    description:
      'AI architecture, structural engineering and quantity-surveying suite. Generates floor plans, structural analyses and itemised bills of quantities with current pricing inputs.',
  },
  {
    name: 'Solar & UPS Intelligence Hub',
    url: `${SITE}/hub`,
    applicationCategory: 'BusinessApplication',
    description:
      'Decision-support hub for solar + UPS buyers: smart sizing simulator, quotation audit (PDF + Excel export), product intelligence, scope-coverage verifier, installation visualiser and lifecycle planner.',
  },
  {
    name: 'Solar Design Studio',
    url: `${SITE}/solar-design-studio`,
    applicationCategory: 'DesignApplication',
    description:
      'Browser-based solar design canvas — array layout, string sizing, shading and quick BoQ for engineers and contractors.',
  },
].map((t) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: t.name,
  url: t.url,
  applicationCategory: t.applicationCategory,
  operatingSystem: 'Web',
  description: t.description,
  publisher: {
    '@type': 'Organization',
    name: 'EmersonEIMS',
    url: SITE,
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KES',
    availability: 'https://schema.org/InStock',
  },
}));

export default function AIToolsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script
        id="ai-tools-itemlist"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ITEM_LIST_SCHEMA) }}
      />
      {TOOL_SOFTWARE_SCHEMAS.map((schema, i) => (
        <Script
          key={schema.name}
          id={`ai-tools-softwareapp-${i}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
