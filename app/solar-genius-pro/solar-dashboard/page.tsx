'use client';

import dynamic from 'next/dynamic';
import { ToolAppShell, ToolLoadingState } from '@/components/tools/ToolAppShell';

const DashboardPage = dynamic(
  () => import('@/components/solar-modules/crc/src/pages/DashboardPage'),
  { ssr: false, loading: () => <ToolLoadingState name="Solar Dashboard" /> }
);

export default function SolarDashboardPage() {
  return (
    <ToolAppShell label="solar-genius-pro-dashboard">
      <DashboardPage />
    </ToolAppShell>
  );
}
