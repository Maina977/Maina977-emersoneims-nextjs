'use client';

// Wired to the NEW Solar Genius Pro from G:\EMERSONEIMS-SolarGeniusPro (May 2026 source)
// (The old SolarGeniusProComplete component was deleted on 2026-10-30: it was unreachable and showed fabricated figures.)
import dynamic from 'next/dynamic';
import { ToolAppShell, ToolLoadingState } from '@/components/tools/ToolAppShell';
import B2BCommercialBand from '@/components/b2b/B2BCommercialBand';
import { B2B_PROFILES } from '@/lib/b2b/pageProfiles';
import SolarGeniusGlobalBand from '@/components/solar-modules/SolarGeniusGlobalBand';

const SolarGeniusProV2 = dynamic(
  () => import('@/components/solar-modules/SolarGeniusProV2'),
  {
    ssr: false,
    loading: () => <ToolLoadingState name="Solar Genius Pro" />,
  }
);

export default function SolarGeniusProPage() {
  return (
    <ToolAppShell label="solar-genius-pro">
      <SolarGeniusProV2 />

      {/* Bands moved below the tool (2026-10-19 re-audit): above it they pushed
          the calculator ~2,700 px down on a phone. */}
      <SolarGeniusGlobalBand />
      <B2BCommercialBand profile={B2B_PROFILES.solarGeniusPro} />
    </ToolAppShell>
  );
}
