'use client';

import dynamic from 'next/dynamic';
import { ToolAppShell, ToolLoadingState } from '@/components/tools/ToolAppShell';
import SolarGeniusContent from '@/components/solar/SolarGeniusContent';
// Stylesheets for the dynamically-imported Design Studio, shipped with the
// page <head> instead of as lazy CSS chunks (ChunkLoadError prevention — see
// AquaScan 2026-07-09 incident; a lazy stylesheet fetch failure kills the
// whole tool, a page stylesheet cannot throw).
import 'leaflet/dist/leaflet.css';
import '@/components/solar-modules/crc/components/design/DesignStudioAI.css';

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
