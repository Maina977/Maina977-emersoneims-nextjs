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

export default function AIToolsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script
        id="ai-tools-itemlist"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ITEM_LIST_SCHEMA) }}
      />
      {children}
    </>
  );
}
