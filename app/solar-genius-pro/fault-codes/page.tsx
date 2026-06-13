'use client';

import dynamic from 'next/dynamic';
import { ToolAppShell, ToolLoadingState } from '@/components/tools/ToolAppShell';
import SolarGeniusContent from '@/components/solar/SolarGeniusContent';

const FaultCodesPage = dynamic(
  () => import('@/components/solar-modules/crc/src/pages/FaultCodesPage'),
  { ssr: false, loading: () => <ToolLoadingState name="Solar Fault Codes AI" /> }
);

export default function SolarFaultCodesPage() {
  return (
    <ToolAppShell label="solar-genius-pro-fault-codes">
      <FaultCodesPage />
      <SolarGeniusContent variant="fault-codes" />
    </ToolAppShell>
  );
}
