'use client';

// Wired to the NEW Solar Genius Pro from G:\EMERSONEIMS-SolarGeniusPro (May 2026 source)
// (The old SolarGeniusProComplete component was deleted on 2026-10-30: it was unreachable and showed fabricated figures.)
import { ToolAppShell } from '@/components/tools/ToolAppShell';
import B2BCommercialBand from '@/components/b2b/B2BCommercialBand';
import { B2B_PROFILES } from '@/lib/b2b/pageProfiles';
import SolarGeniusGlobalBand from '@/components/solar-modules/SolarGeniusGlobalBand';
// Imported directly (2026-11-21): the wrapper is small and starts the workspace
// download itself, so a second on-demand chunk no longer delays it.
import SolarGeniusProV2 from '@/components/solar-modules/SolarGeniusProV2';

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
