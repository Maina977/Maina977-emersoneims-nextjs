import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Generator Oracle | Professional Controller Diagnostic System',
  description: 'Advanced diagnostic tool for DeepSea, ComAp, Woodward, SmartGen, and CAT PowerWizard controllers. 230,000+ fault codes, step-by-step reset pathways, and offline capability.',
  keywords: [
    'generator controller diagnostics',
    'DeepSea DSE fault codes',
    'ComAp InteliLite diagnostics',
    'Woodward EasyGen troubleshooting',
    'SmartGen HGM error codes',
    'PowerWizard diagnostics',
    'generator reset procedures',
    'offline generator diagnostics',
    'controller fault finder',
    'generator technician tool'
  ],
  manifest: '/generator-oracle-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Gen Oracle',
  },
  applicationName: 'Generator Oracle',
  openGraph: {
    title: 'Generator Oracle - Professional Controller Diagnostic System',
    description: '230,000+ fault codes for DSE, ComAp, Woodward, SmartGen & PowerWizard controllers. Works offline.',
    type: 'website',
    locale: 'en_US',
    siteName: 'EmersonEIMS Generator Oracle',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/generator-oracle',
  },
};

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function GeneratorOracleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {children}
    </main>
  );
}
