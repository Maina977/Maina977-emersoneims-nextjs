import type { Metadata, Viewport } from 'next';
import FlagshipProductSchema from '@/components/seo/FlagshipProductSchema';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const URL = `${SITE}/generator-oracle`;

export const metadata: Metadata = {
  title: 'Generator Oracle — Generator Fault Diagnostic Intelligence | EmersonEIMS',
  description:
    'Generator Oracle is the EmersonEIMS generator fault & controller diagnostic intelligence tool. 400,000+ fault codes for DeepSea (DSE), ComAp, Woodward, SmartGen and CAT PowerWizard — with reset pathways and direct escalation to Kenya engineers. Free to use.',
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
    title: 'Generator Oracle — Generator Diagnostic Intelligence | EmersonEIMS',
    description:
      '400,000+ fault codes for DSE, ComAp, Woodward, SmartGen and PowerWizard. Built and maintained by Kenya generator engineers. Free to use.',
    url: URL,
    type: 'website',
    locale: 'en_KE',
    siteName: 'EmersonEIMS',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'Generator Oracle by EmersonEIMS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator Oracle — Generator Diagnostic Intelligence',
    description: '400,000+ fault codes. Reset pathways. Engineer escalation. Free.',
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
  maximumScale: 1,
  userScalable: false,
};

export default function GeneratorOracleLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <FlagshipProductSchema
        name="Generator Oracle"
        url={URL}
        description="Generator fault & controller diagnostic intelligence: 400,000+ fault codes for DSE, ComAp, Woodward, SmartGen and PowerWizard, with reset pathways and Kenya engineer escalation."
        category="Generator Diagnostics"
        applicationCategory="EngineeringApplication"
        keywords={['Generator Diagnostics', 'Fault Codes', 'DSE', 'ComAp', 'Woodward', 'SmartGen', 'PowerWizard', 'Cummins', 'Voltka']}
        industry="Facility Management, EPC, Generator Service"
        priceKes="Free"
      />
      {children}
    </main>
  );
}
