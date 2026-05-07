import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

export const metadata: Metadata = {
  title: 'Knowledge Base | Power Systems Engineering Library | EmersonEIMS Kenya',
  description:
    'In-depth technical articles for engineers, facility managers and procurement teams: generator commissioning, solar design, UPS topology, motor rewinding, NEMA compliance, fuel polishing and more.',
  alternates: { canonical: `${SITE}/knowledge-base` },
  openGraph: {
    title: 'EmersonEIMS Knowledge Base — Engineering Library',
    description: 'Reference articles on generators, solar, UPS, motors, boreholes and incinerators.',
    url: `${SITE}/knowledge-base`,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
  },
  robots: { index: true, follow: true },
};

export default function KnowledgeBaseLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
