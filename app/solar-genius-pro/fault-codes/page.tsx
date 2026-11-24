'use client';

import { ToolAppShell } from '@/components/tools/ToolAppShell';
import SolarGeniusContent from '@/components/solar/SolarGeniusContent';
import { resilient } from '@/lib/loading/ResilientModule';

// Retry, slow note + Reload, and Try again (lib/loading, 2026-11-21).
const FaultCodesPage = resilient(
  () => import('@/components/solar-modules/crc/src/pages/FaultCodesPage'),
  { name: 'Solar Fault Codes AI' }
);

export default function SolarFaultCodesPage() {
  return (
    <ToolAppShell label="solar-genius-pro-fault-codes">
      <FaultCodesPage />
      <SolarGeniusContent variant="fault-codes" />
    </ToolAppShell>
  );
}
