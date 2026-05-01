'use client';

import dynamic from 'next/dynamic';
import { ToolAppShell, ToolLoadingState } from '@/components/tools/ToolAppShell';

const AquaScanProComplete = dynamic(
  () => import('@/components/borehole/AquaScanProComplete'),
  {
    ssr: false,
    loading: () => <ToolLoadingState name="AquaScan Pro" />,
  }
);

export default function AquaScanProV3Page() {
  return (
    <ToolAppShell label="aquascan-pro-v3">
      <AquaScanProComplete />
    </ToolAppShell>
  );
}
