'use client';

// Wired to the NEW Solar Genius Pro from G:\EMERSONEIMS-SolarGeniusPro (May 2026 source)
// Old SolarGeniusProComplete preserved at components/solar/SolarGeniusProComplete.tsx as fallback.
import dynamic from 'next/dynamic';
import { ToolAppShell, ToolLoadingState } from '@/components/tools/ToolAppShell';

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
    </ToolAppShell>
  );
}
