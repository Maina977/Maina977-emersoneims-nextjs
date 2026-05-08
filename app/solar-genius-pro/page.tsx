'use client';

// Wired to the NEW Solar Genius Pro from G:\EMERSONEIMS-SolarGeniusPro (May 2026 source)
// Old SolarGeniusProComplete preserved at components/solar/SolarGeniusProComplete.tsx as fallback.
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
      {/* Global-readiness positioning band — frames SolarGeniusPro as a
          flagship engineering AI for Africa and globally relevant solar work. */}
      <SolarGeniusGlobalBand />

      {/* B2B Commercial Band */}
      <B2BCommercialBand profile={B2B_PROFILES.solarGeniusPro} />

      <SolarGeniusProV2 />
    </ToolAppShell>
  );
}
