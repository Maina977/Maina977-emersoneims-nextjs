'use client';

// Wired to the NEW AquaScan / Borehole AI engine from G:\EMERSONEIMS-AQUASCANPRO (May 2026 source)
// Old AquaScanProComplete preserved at components/borehole/AquaScanProComplete.tsx as fallback.
import dynamic from 'next/dynamic';
import { ToolAppShell, ToolLoadingState } from '@/components/tools/ToolAppShell';
import B2BCommercialBand from '@/components/b2b/B2BCommercialBand';
import { B2B_PROFILES } from '@/lib/b2b/pageProfiles';

const AquaScanProV2 = dynamic(
  () => import('@/components/aquascan-modules/AquaScanProV2'),
  {
    ssr: false,
    loading: () => <ToolLoadingState name="AquaScan Pro" />,
  }
);

export default function AquaScanProV3Page() {
  return (
    <ToolAppShell label="aquascan-pro-v3">
  {/* B2B Commercial Band */}
  <B2BCommercialBand profile={B2B_PROFILES.aquascanPro} />

      <AquaScanProV2 />
    </ToolAppShell>
  );
}
