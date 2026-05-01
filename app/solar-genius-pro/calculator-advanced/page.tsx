'use client';

import dynamic from 'next/dynamic';
import { ToolAppShell, ToolLoadingState } from '@/components/tools/ToolAppShell';

const CalculatorPage = dynamic(
  () => import('@/components/solar-modules/crc/src/pages/CalculatorPage'),
  { ssr: false, loading: () => <ToolLoadingState name="Solar System Calculator" /> }
);

export default function SolarCalculatorAdvancedPage() {
  return (
    <ToolAppShell label="solar-genius-pro-calculator">
      <CalculatorPage />
    </ToolAppShell>
  );
}
