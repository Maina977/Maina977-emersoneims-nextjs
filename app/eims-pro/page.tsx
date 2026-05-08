import type { Metadata } from 'next';
import EimsProClient from './EimsProClient';
import B2BCommercialBand from '@/components/b2b/B2BCommercialBand';
import { B2B_PROFILES } from '@/lib/b2b/pageProfiles';
import FlagshipProductSchema from '@/components/seo/FlagshipProductSchema';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
const URL = `${SITE}/eims-pro`;

export const metadata: Metadata = {
  title: 'EIMS PRO — Building Intelligence & Construction Engineering Workspace | EmersonEIMS',
  description:
    'EIMS PRO (Building Suite Pro) is the EmersonEIMS construction engineering workspace: phases, reports, BIM, costing and AI assist for serious building projects across Kenya & East Africa.',
  keywords: [
    'EIMS PRO',
    'Building Suite Pro',
    'construction engineering software Kenya',
    'BIM workspace',
    'BOQ software Kenya',
    'project costing tool',
    'EmersonEIMS PRO',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: '/eims-pro' },
  openGraph: {
    title: 'EIMS PRO — Building Intelligence & Engineering Workspace | EmersonEIMS',
    description: 'Phases, reports, BIM, costing and AI assist for serious building projects.',
    url: URL,
    siteName: 'EmersonEIMS',
    type: 'website',
    locale: 'en_KE',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'EIMS PRO by EmersonEIMS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EIMS PRO — Building Intelligence Workspace',
    description: 'BIM, costing, phases, reports, AI assist.',
    images: [`${SITE}/og-image.jpg`],
    site: '@EmersonEIMS',
  },
  category: 'engineering',
};

export default function EimsProPage() {
  return (
    <>
      <FlagshipProductSchema
        name="EIMS PRO"
        url={URL}
        description="Building Intelligence and construction engineering workspace: phases, reports, BIM, costing and AI assist."
        category="Construction Engineering"
        applicationCategory="DesignApplication"
        keywords={['BIM', 'BOQ', 'Costing', 'Construction Phases', 'Engineering Workspace']}
        industry="EPCs, QS, Architects, Project Managers"
      />
      <B2BCommercialBand profile={B2B_PROFILES.eimsPro} />
      <EimsProClient />
    </>
  );
}
