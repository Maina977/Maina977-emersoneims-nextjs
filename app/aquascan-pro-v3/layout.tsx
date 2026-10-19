import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import FlagshipProductSchema from '@/components/seo/FlagshipProductSchema';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const URL = `${SITE}/aquascan-pro-v3`;

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/aquascan-pro-v3' },
  /*
   * Job first, product name second — see app/generator-oracle/layout.tsx for the
   * evidence. "Hydrogeology intelligence" is not a search anyone performs;
   * "borehole survey", "borehole depth" and "how deep to drill" are.
   * Product name and page design untouched.
   */
  // Object form, not a bare string: a bare layout title leaves the pages
  // below it with no template, so they ship unbranded. Full reasoning and
  // the sections deliberately left alone: app/ai-tools/layout.tsx.
  title: { default: 'Borehole Survey & Depth Estimator — Free', template: "%s | EmersonEIMS Kenya" },
  description:
    // The question a landowner actually asks before drilling: is there water,
    // how deep, and what will it cost. Data sources stay because they are what
    // make the answer credible.
    // "GLDAS" removed 2026-10-19: the module of that name fetches ERA5-Land and
    // NASA POWER data. Name the sources the tool really uses.
    'Check any site in Kenya before you drill, free. A first look at likely depth, yield and drilling cost from NASA POWER, ERA5-Land, soil and water-point data — then a survey confirms it.',
  keywords: [
    'borehole analysis Kenya',
    'borehole intelligence',
    'hydrogeology software',
    'borehole depth Kenya',
    'borehole pre-screen',
    'NASA POWER water',
    'AquaScan Pro',
    'EmersonEIMS borehole',
    'pump sizing Kenya',
  ],
  /*
   * NO canonical here — layout metadata is INHERITED by every child page, so
   * this made each sub-page canonicalise to the section root and forfeit its
   * own indexing while still being listed in the sitemap. The root layout
   * (app/layout.tsx) emits a correct self-referential canonical from the
   * x-pathname header.
   */
  openGraph: {
    title: 'AquaScan Pro — Borehole & Water Intelligence',
    description:
      'A free desktop pre-screen for a borehole site in Kenya: likely depth, yield and cost ranges, each with its data source. A survey confirms where to drill.',
    url: URL,
    type: 'website',
    siteName: 'EmersonEIMS',
    locale: 'en_KE',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'AquaScan Pro by EmersonEIMS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AquaScan Pro — Borehole & Water Intelligence',
    description: 'Free borehole pre-screen for Kenya: depth, yield and cost ranges from public data.',
    images: [`${SITE}/og-image.jpg`],
    site: '@EmersonEIMS',
  },
  robots: { index: true, follow: true },
  category: 'engineering',
};

export default function AquaScanProV3Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <FlagshipProductSchema
        name="AquaScan Pro"
        url={URL}
        description="Free desktop borehole pre-screen for Kenya: likely depth, yield and drilling-cost ranges from NASA POWER, ERA5-Land, ISRIC SoilGrids and mapped water points, with the water-quality risks to test for."
        category="Borehole Intelligence"
        applicationCategory="EngineeringApplication"
        keywords={['Borehole Analysis', 'Hydrogeology', 'Borehole Depth', 'Water Quality', 'NASA POWER']}
        industry="Drillers, NGOs, County Governments, Agribusiness"
        priceKes="Free"
      />
      {/* ToolSeoContent (the h1) moved into page.tsx 2026-10-19: rendered here it
          gave /aquascan-pro-v3/methodology a second h1 above its own. */}
      {children}
    </>
  );
}
