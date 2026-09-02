// app/case-studies/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Case studies are loaded from data/caseStudies.ts and only entries with
// status === 'PUBLISHED' AND signed evidence are rendered publicly. This is
// enforced by getPublishedCaseStudies(). When the published list is empty
// we show an honest "verified case studies in preparation" state — never
// fabricated counters, success rates, or savings totals.
// See data/caseStudies.ts header for the publication checklist.
// ─────────────────────────────────────────────────────────────────────────────

import { Metadata } from 'next';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/case-studies' },
  title: 'Case Studies — Real Power Solutions Across Kenya',
  description: 'Verified power generation projects with measurable ROI: St. Austin Academy (50kVA Perkins), Bigot Flowers (cold-chain export), NTSA (critical infrastructure), Greenheart Kilifi (real estate), Kivukoni School (coastal). SLA-backed solutions, client testimonials, financial impact analysis.',
  keywords: 'generator case studies Kenya, real projects, verified results, power solutions, Cummins installation, Perkins generators, commercial power systems',
  openGraph: {
    title: 'Real Case Studies — Power Solutions That Work in Kenya',
    description: 'See how we solved power challenges for hospitals, schools, exporters, and government. Verified projects with client testimonials and documented results.',
    type: 'website',
    locale: 'en_KE',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

import CaseStudiesContent from './CaseStudiesContent';

/**
 * Server component. It exists to own the metadata above — a client component
 * cannot export metadata — and renders the view from CaseStudiesContent.tsx.
 * See that file for why the split was necessary.
 */
export default function CaseStudiesPage() {
  return <CaseStudiesContent />;
}
