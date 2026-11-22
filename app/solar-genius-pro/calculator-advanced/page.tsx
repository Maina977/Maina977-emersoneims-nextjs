'use client';

import { ToolAppShell } from '@/components/tools/ToolAppShell';
import { resilient } from '@/lib/loading/ResilientModule';

// Retry, slow note + Reload, and Try again (lib/loading, 2026-11-21).
const CalculatorPage = resilient(
  () => import('@/components/solar-modules/crc/src/pages/CalculatorPage'),
  { name: 'Solar System Calculator' }
);

export default function SolarCalculatorAdvancedPage() {
  return (
    <ToolAppShell label="solar-genius-pro-calculator">
      <CalculatorPage />
    </ToolAppShell>
  );
}
