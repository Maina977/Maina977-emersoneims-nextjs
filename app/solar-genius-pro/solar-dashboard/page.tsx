'use client';

import dynamic from 'next/dynamic';
import { ToolAppShell, ToolLoadingState } from '@/components/tools/ToolAppShell';
import SolarGeniusContent from '@/components/solar/SolarGeniusContent';

const DashboardPage = dynamic(
  () => import('@/components/solar-modules/crc/src/pages/DashboardPage'),
  { ssr: false, loading: () => <ToolLoadingState name="Solar Dashboard" /> }
);

export default function SolarDashboardPage() {
  return (
    <ToolAppShell label="solar-genius-pro-dashboard">
      <DashboardPage />
      <SolarGeniusContent variant="solar-dashboard" />
    </ToolAppShell>
  );
}
