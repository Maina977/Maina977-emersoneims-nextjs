'use client';

import { ToolAppShell } from '@/components/tools/ToolAppShell';
import SolarGeniusContent from '@/components/solar/SolarGeniusContent';
import { resilient } from '@/lib/loading/ResilientModule';

// Retry, slow note + Reload, and Try again (lib/loading, 2026-11-21).
const DashboardPage = resilient(
  () => import('@/components/solar-modules/crc/src/pages/DashboardPage'),
  { name: 'Solar Dashboard' }
);

export default function SolarDashboardPage() {
  return (
    <ToolAppShell label="solar-genius-pro-dashboard">
      <DashboardPage />
      <SolarGeniusContent variant="solar-dashboard" />
    </ToolAppShell>
  );
}
