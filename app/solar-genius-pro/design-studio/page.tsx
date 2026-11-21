'use client';

import { ToolAppShell } from '@/components/tools/ToolAppShell';
import { resilient } from '@/lib/loading/ResilientModule';
import SolarGeniusContent from '@/components/solar/SolarGeniusContent';
// Stylesheets for the dynamically-imported Design Studio, shipped with the
// page <head> instead of as lazy CSS chunks (ChunkLoadError prevention — see
// AquaScan 2026-07-09 incident; a lazy stylesheet fetch failure kills the
// whole tool, a page stylesheet cannot throw).
import 'leaflet/dist/leaflet.css';
import '@/components/solar-modules/crc/components/design/DesignStudioAI.css';

// Retry, slow note + Reload, and Try again (lib/loading, 2026-11-21).
const DesignStudioPage = resilient(
  () => import('@/components/solar-modules/crc/src/pages/DesignStudioPage'),
  { name: 'Solar Design Studio AI' }
);

export default function SolarDesignStudioPage() {
  return (
    <ToolAppShell label="solar-genius-pro-design-studio">
      <DesignStudioPage />
      <SolarGeniusContent variant="design-studio" />
    </ToolAppShell>
  );
}
