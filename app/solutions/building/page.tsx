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
  // No "| EmersonEIMS" — the root layout appends "| EmersonEIMS Kenya", so this
  // rendered the brand twice. Leads with the job instead: this tool does HVAC
  // load sizing, electrical design and quantity take-offs, and none of those
  // words appeared in the title anyone searched.
  // 2026-10-19 tool audit: the title promised HVAC, electrical and QS, and the
  // schema "AI design … BOQ … complete construction documentation in minutes".
  // None of those run online; these are the calculators that do.
  title: 'Building Design Calculators — Wind, Structural & Daylight',
  description:
    'Free building design calculators: wind and seismic loads, RC beam, steel bolt, bearing capacity, storm runoff, U-value, daylight and acoustics — each worked to the cited code clause.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/solutions/building' },
  other: {
    'link-prefetch': '/eims-building-suite-v20261019.html',
  },
};

export default function BuildingPage() {
  return (
    <>
      <FlagshipProductSchema
        name="Pro Building Suite"
        url="https://www.emersoneims.com/solutions/building"
        description="Free building design calculators: ASCE 7 and Eurocode wind, ASCE 7 seismic ELF, EN 1992 RC beam, EN 1993 bolt, bearing capacity, rational runoff, U-value, daylight factor and reverberation time."
        category="Building Design Calculators"
        applicationCategory="EngineeringApplication"
        keywords={['Wind Load Calculator', 'RC Beam Design', 'Bearing Capacity', 'U-value Calculator', 'Daylight Factor', 'Structural Engineering Kenya']}
        industry="Architects, Engineers, Developers, Contractors"
        priceKes="Free"
      />
      <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
      <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      <link rel="prefetch" href="/eims-building-suite-v20261019.html" as="document" />
      <B2BCommercialBand profile={B2B_PROFILES.buildingSuite} />
      {/*
        Server-rendered heading. ProBuildingSuiteClient is a client component,
        so a Googlebot scan on 2026-07-31 found this page — and the /all-tools
        and /pro-building-suite aliases that canonicalise to it — serving no
        <h1>. Fixing it here fixes all three.
      */}
      <h1 className="sr-only">
        Building Suite — Free Building Design Calculators (Wind, Structural, Geotechnical, Daylight &amp; Acoustics)
      </h1>
      <ProBuildingSuiteClient />
    </>
  );
}
