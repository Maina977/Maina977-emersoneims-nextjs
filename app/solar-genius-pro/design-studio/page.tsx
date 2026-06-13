'use client';

import dynamic from 'next/dynamic';
import { ToolAppShell, ToolLoadingState } from '@/components/tools/ToolAppShell';
import SolarGeniusContent from '@/components/solar/SolarGeniusContent';

const DesignStudioPage = dynamic(
  () => import('@/components/solar-modules/crc/src/pages/DesignStudioPage'),
  { ssr: false, loading: () => <ToolLoadingState name="Solar Design Studio AI" /> }
);

export default function SolarDesignStudioPage() {
  return (
    <ToolAppShell label="solar-genius-pro-design-studio">
      <DesignStudioPage />
      <SolarGeniusContent variant="design-studio" />
    </ToolAppShell>
  );
}
