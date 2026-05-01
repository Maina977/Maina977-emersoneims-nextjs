'use client';

import dynamic from 'next/dynamic';
import { ToolAppShell, ToolLoadingState } from '@/components/tools/ToolAppShell';

const SolarGeniusProComplete = dynamic(
  () => import('@/components/solar/SolarGeniusProComplete'),
  {
    ssr: false,
    loading: () => <ToolLoadingState name="Solar Genius Pro" />,
  }
);

export default function SolarGeniusProPage() {
  return (
    <ToolAppShell label="solar-genius-pro">
      <SolarGeniusProComplete />
    </ToolAppShell>
  );
}
