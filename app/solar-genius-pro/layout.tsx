import type { Metadata } from 'next';
import ToolSeoContent from '@/components/seo/ToolSeoContent';
import type { ReactNode } from 'react';
import FlagshipProductSchema from '@/components/seo/FlagshipProductSchema';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const URL = `${SITE}/solar-genius-pro`;

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/solar-genius-pro' },
  /*
   * Job first, product name second. See app/generator-oracle/layout.tsx for the
   * full reasoning and the Search Console evidence behind it.
   *
   * This page ranks at POSITION 3.8 — top four — and drew 12 impressions with
   * zero clicks, because "Solar Genius Pro" is a phrase only someone who already
   * knows the product would type. Meanwhile our own query data shows real people
   * searching "solar system size calculator", "solar system sizing calculator"
   * and "solar panel inverter size calculator" — the exact job this tool does.
   *
   * Product name and page design untouched.
   */
  // Object form, not a bare string: a bare layout title leaves the pages
  // below it with no template, so they ship unbranded. Full reasoning and
  // the sections deliberately left alone: app/ai-tools/layout.tsx.
  title: { default: 'Solar System Size Calculator — Free', template: "%s | EmersonEIMS Kenya" },
  description:
    // Answers the searcher's actual question — how big a system do I need, and
    // what will it cost — instead of describing the product's feature list.
    'Work out what size solar system you need, free. Panel and battery sizing, payback and running costs at Kenya prices, with EPRA-aware output you can quote from.',
  keywords: [
    'commercial solar design Kenya',
    'solar sizing tool',
    'hybrid solar engineering',
    'EPRA compliance solar',
    'solar feasibility study',
    'Solar Genius Pro',
    'EmersonEIMS solar',
    'C&I solar Kenya',
  ],
  /*
   * NO canonical here — layout metadata is INHERITED by every child page, so
   * this made each sub-page canonicalise to the section root and forfeit its
   * own indexing while still being listed in the sitemap. The root layout
   * (app/layout.tsx) emits a correct self-referential canonical from the
   * x-pathname header.
   */
  openGraph: {
    title: 'Solar Genius Pro — Commercial Solar Engineering Intelligence',
    description:
      'Load profiling, hybrid sizing, financials and EPRA-aware compliance for serious commercial solar projects.',
    url: URL,
    type: 'website',
    siteName: 'EmersonEIMS',
    locale: 'en_KE',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'Solar Genius Pro by EmersonEIMS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Genius Pro — Commercial Solar Engineering Intelligence',
    description: 'Sizing, hybrid, financials, EPRA-aware compliance.',
    images: [`${SITE}/og-image.jpg`],
    site: '@EmersonEIMS',
  },
  robots: { index: true, follow: true },
  category: 'engineering',
};

export default function SolarGeniusProLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <FlagshipProductSchema
        name="Solar Genius Pro"
        url={URL}
        description="Commercial solar design and engineering intelligence: load profiling, hybrid sizing, financials, EPRA-aware compliance, proposal-ready outputs."
        category="Solar Engineering"
        applicationCategory="EngineeringApplication"
        keywords={['Commercial Solar', 'Hybrid Solar', 'EPRA', 'Solar Sizing', 'Solar Financials']}
        industry="EPCs, Facility Managers, C&I Buyers"
        priceKes="Free"
      />
      {children}
      <ToolSeoContent tool="solar-genius-pro" headingLevel="h1" />
    </>
  );
}
