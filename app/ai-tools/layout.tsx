import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'AI Tools | Generator Oracle, Solar Genius, AquaScan Pro | EmersonEIMS',
  description:
    'Free AI tools for power & water engineering: Generator Oracle (90% accuracy fault diagnosis), Solar Genius Pro (10 AI engines), AquaScan Pro (borehole AI), Building Suite Pro (28 countries). All in-browser, no signup.',
  alternates: { canonical: `${siteUrl}/ai-tools` },
  openGraph: {
    title: 'AI Tools | EmersonEIMS — Generator Oracle, Solar Genius, AquaScan Pro',
    description:
      'Free AI engineering tools in your browser. Generator diagnostics, solar design, borehole analysis, BIM/QS.',
    url: `${siteUrl}/ai-tools`,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function AIToolsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
