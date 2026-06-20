import type { Metadata } from 'next';
import ProBuildingSuiteClient from '@/app/(building)/pro-building-suite/ProBuildingSuiteClient';
import B2BCommercialBand from '@/components/b2b/B2BCommercialBand';
import { B2B_PROFILES } from '@/lib/b2b/pageProfiles';
import FlagshipProductSchema from '@/components/seo/FlagshipProductSchema';

// /solutions/building IS the canonical Building Suite page. It mounts the
// new HTML wizard (eims-building-suite-vYYYYMMDD.html) via a same-origin
// iframe — exactly the same component used by /pro-building-suite. There is
// only ONE building-suite UI in this codebase and this is its home.
export const metadata: Metadata = {
  title: 'Pro Building Suite | EmersonEIMS',
  description:
    'Full EIMS engineering, quantity surveying, BIM, and professional reports — Building Suite Pro.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/solutions/building' },
  other: {
    'link-prefetch': '/eims-building-suite-v20260503.html',
  },
};

export default function BuildingPage() {
  return (
    <>
      <FlagshipProductSchema
        name="Pro Building Suite"
        url="https://www.emersoneims.com/solutions/building"
        description="AI architectural design, structural engineering analysis and professional BOQ / quantity surveying with BIM and downloadable reports — complete construction documentation in minutes."
        category="Construction & Quantity Surveying"
        applicationCategory="EngineeringApplication"
        keywords={['BOQ generator', 'Quantity Surveying', 'Structural Design', 'Architectural Design', 'BIM', 'Bill of Quantities Kenya']}
        industry="Architects, Engineers, Quantity Surveyors, Developers"
        priceKes="Free"
      />
      <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
      <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      <link rel="prefetch" href="/eims-building-suite-v20260503.html" as="document" />
      <B2BCommercialBand profile={B2B_PROFILES.mepClash} />
      <ProBuildingSuiteClient />
    </>
  );
}
