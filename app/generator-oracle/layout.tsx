/*
 * NO HARDCODED CODE COUNTS IN THIS FILE.
 *
 * The metadata and product schema carried "6,700+ verified fault codes" while
 * the index's own health endpoint counted 54,192 verified out of 451,593 total.
 * The literal had gone stale and nothing in the markup revealed which figure
 * was true. Unlike the on-page stats, metadata cannot read the index at request
 * time, so ANY number written here will drift again.
 *
 * The claims are therefore qualitative and permanently true: hand-written
 * controller alarm guides plus the J1939 engine-code reference, named brands,
 * free. (2026-10-18: the range-based template codes and the "manufacturer-
 * curated" wording were removed; see lib/generator-oracle/controllerFaultCodes.ts.)
 *
 * Live counts belong on the page, fetched from /api/generator-oracle/health,
 * where they cannot go out of date.
 */
import type { Metadata, Viewport } from 'next';
import ToolSeoContent from '@/components/seo/ToolSeoContent';
import FlagshipProductSchema from '@/components/seo/FlagshipProductSchema';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const URL = `${SITE}/generator-oracle`;

export const metadata: Metadata = {
  /*
   * LEAD WITH THE JOB, NOT THE PRODUCT NAME.
   *
   * Search Console, July 2026: every AI tool combined drew 50 impressions out of
   * 20,211 site-wide — 0.25%, and one click. Yet this page ranks at POSITION 6.0.
   * It is not failing to rank; it is ranking for "Generator Oracle", which only
   * someone who already knows the product would type.
   *
   * The old title read "Generator Oracle — Generator Fault Diagnostic
   * Intelligence". Nobody searches "diagnostic intelligence". They search
   * "generator fault codes" and "generator diagnostics" — both of which appear
   * in our own query data with impressions we are not capturing properly.
   *
   * So the job goes first, the product name second (it still earns brand recall
   * for returning users), and "free" is stated because it is true and it is the
   * strongest single word available in a search result.
   *
   * The product name and the page design are untouched.
   */
  title: 'Generator Fault Codes & Diagnosis — Free Tool',
  description:
    // Under ~155 characters so Google shows all of it. Leads with what the
    // searcher gets and the fact it costs nothing; the brand names that make it
    // credible (DSE, ComAp, SmartGen) stay, the marketing word "intelligence"
    // goes. Full detail still lives in the page body.
    'Free generator fault-code lookup: DSE, ComAp, SmartGen, Woodward and CAT alarms plus J1939 engine codes, with checks and Kenya engineer support.',
  keywords: [
    'generator diagnostics Kenya',
    'generator fault codes',
    'DeepSea DSE fault codes',
    'ComAp InteliLite diagnostics',
    'Woodward EasyGen troubleshooting',
    'SmartGen HGM error codes',
    'CAT PowerWizard diagnostics',
    'generator reset procedures',
    'generator engineering intelligence',
    'Cummins fault diagnosis',
    'Voltka generator diagnostics',
    'generator oracle',
    'EmersonEIMS Generator Oracle',
  ],
  manifest: '/generator-oracle-manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Gen Oracle' },
  applicationName: 'Generator Oracle',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Generator Oracle — Generator Fault Codes & Diagnosis',
    description:
      'Controller alarms for DSE, ComAp, Woodward, SmartGen and CAT PowerWizard, plus J1939 engine codes, explained by Kenya generator engineers. Free to use.',
    url: URL,
    type: 'website',
    locale: 'en_KE',
    siteName: 'EmersonEIMS',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'Generator Oracle by EmersonEIMS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator Oracle — Generator Fault Codes & Diagnosis',
    description: 'Controller alarms and J1939 engine codes explained. Reset steps. Engineer escalation. Free.',
    images: [`${SITE}/og-image.jpg`],
    site: '@EmersonEIMS',
    creator: '@EmersonEIMS',
  },
  robots: { index: true, follow: true },
  category: 'engineering',
};

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  width: 'device-width',
  initialScale: 1,
  // maximumScale: 1 / userScalable: false were removed (2026-10-18): blocking
  // pinch-zoom fails WCAG 1.4.4 and hurts technicians reading small print.
};

export default function GeneratorOracleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <FlagshipProductSchema
        name="Generator Oracle"
        url={URL}
        description="Generator fault-code lookup: hand-written controller alarm guides for DSE, ComAp, Woodward, SmartGen and CAT PowerWizard plus J1939 engine codes, with reset steps and Kenya engineer escalation."
        category="Generator Diagnostics"
        applicationCategory="EngineeringApplication"
        keywords={['Generator Diagnostics', 'Fault Codes', 'DSE', 'ComAp', 'Woodward', 'SmartGen', 'PowerWizard', 'Cummins', 'Voltka']}
        industry="Facility Management, EPC, Generator Service"
        priceKes="Free"
      />
      {children}
      <ToolSeoContent tool="generator-oracle" />
    </div>
  );
}
