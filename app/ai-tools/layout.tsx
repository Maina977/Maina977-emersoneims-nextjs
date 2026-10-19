import type { Metadata } from 'next';
import ToolSeoContent from '@/components/seo/ToolSeoContent';
import type { ReactNode } from 'react';
// next/script is deliberately NOT imported. Its <Script> injects tags
// client-side, so JSON-LD written that way never reaches a crawler — verified
// as Googlebot: ten service pages emitted no Service schema at all. Structured
// data must use a plain <script> so it lands in the server HTML.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const URL = `${SITE}/ai-tools`;

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/ai-tools' },
  /*
   * The old title listed four product names, none of which anyone searches, and
   * ran to 89 characters so Google cut it anyway. This leads with what the tools
   * DO and that they are free. "No signup" earns its place: it removes the
   * single most common reason people bounce off a free tool.
   * See app/generator-oracle/layout.tsx for the Search Console evidence.
   */
  /*
   * OBJECT FORM, NOT A BARE STRING. A bare `title` in a layout leaves every
   * page BELOW it with no template, so the root's "%s | EmersonEIMS Kenya"
   * stops applying and the children ship unbranded. Re-checked 2026-09-02
   * against the built HTML: 92 child pages across 12 sections were
   * unbranded. Only the sections whose child titles still fit 65 characters
   * once the 20-char suffix lands were converted — /brands, /faults,
   * /generators and /generators/spare-parts children already run to 65-74
   * characters and carry their own "Kenya" tail, so branding them here
   * would push ~290 titles past the truncation point instead of fixing them.
   */
  title: { default: 'Free Engineering Calculators — No Signup', template: "%s | EmersonEIMS Kenya" },
  description:
    'Free browser tools for Kenyan engineers: generator fault code lookup, solar system sizing, borehole site pre-screening and building engineering calculators. No signup.',
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
  /*
   * NO canonical here — layout metadata is INHERITED by every child page, so
   * this made each sub-page canonicalise to the section root and forfeit its
   * own indexing while still being listed in the sitemap. The root layout
   * (app/layout.tsx) emits a correct self-referential canonical from the
   * x-pathname header.
   */
  openGraph: {
    title: 'Free Engineering Tools — Generator Oracle, Solar Genius, AquaScan Pro',
    description:
      'Free engineering tools in your browser: generator fault codes, solar sizing, borehole pre-screening and building calculators.',
    url: URL,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'EmersonEIMS AI Engineering Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Engineering Tools — EmersonEIMS',
    description: 'Generator Oracle, Solar Genius Pro, AquaScan Pro and the Building Suite. Free, no sign-up.',
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
    { '@type': 'ListItem', position: 4, url: `${SITE}/solutions/building`, name: 'Building Suite' },
    { '@type': 'ListItem', position: 5, url: `${SITE}/solar-design-studio`, name: 'Solar Design Studio' },
    { '@type': 'ListItem', position: 6, url: `${SITE}/hub`, name: 'Solar & UPS Intelligence Hub' },
  ],
};

// ────────────────────────────────────────────────────────────────────
// Per-tool SoftwareApplication schemas. This is the schema type Google
// uses for the SoftwareApp rich result in search — without it the
// tools could only ever appear as plain blue links. Rewritten 2026-10-19
// (tool audit): the old text claimed AI, wiring diagrams, predictive
// maintenance, floor plans and BoQs the tools do not have. Every fact below
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
      'Free generator fault-code lookup and symptom diagnosis: controller alarms (DeepSea, ComAp, Woodward, SmartGen and more) and J1939 engine codes, with likely causes, checks and repair guides. Rule-based, written by our engineers.',
  },
  {
    name: 'Solar Genius Pro',
    url: `${SITE}/solar-genius-pro`,
    applicationCategory: 'DesignApplication',
    description:
      'Free solar sizing estimate for Kenya: panels, inverter and battery for grid-tied, hybrid or off-grid systems from your monthly kWh and NASA POWER sun-hours, with an installed-cost range and simple payback.',
  },
  {
    name: 'AquaScan Pro',
    url: `${SITE}/aquascan-pro-v3`,
    applicationCategory: 'BusinessApplication',
    description:
      'Free desktop borehole pre-screen for Kenya: likely depth, yield and drilling-cost ranges from NASA POWER, ERA5-Land, ISRIC SoilGrids and mapped water points, with every source named. A survey confirms where to drill.',
  },
  {
    name: 'Building Suite',
    url: `${SITE}/solutions/building`,
    applicationCategory: 'EngineeringApplication',
    description:
      'Free building design calculators: ASCE 7 and Eurocode wind, seismic ELF, EN 1992 RC beam, EN 1993 bolt, bearing capacity, rational runoff, U-value, daylight factor and reverberation time, each with its code clause.',
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
      'Browser-based solar roof layout: place panels, follow the sun through the day to see shading, and draft a single-line diagram and wire schedule.',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ITEM_LIST_SCHEMA) }}/>
      {TOOL_SOFTWARE_SCHEMAS.map((schema, i) => (
        <script key={schema.name} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      {children}
      <ToolSeoContent tool="ai-tools" />
    </>
  );
}
