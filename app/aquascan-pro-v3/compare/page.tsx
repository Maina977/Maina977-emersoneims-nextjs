'use client';

import dynamic from 'next/dynamic';
import { ToolAppShell, ToolLoadingState } from '@/components/tools/ToolAppShell';

const CompareHub = dynamic(
  () => import('@/components/aquascan-modules/compare/CompareHub'),
  { ssr: false, loading: () => <ToolLoadingState name="AquaScan Site Comparison" /> }
);

export default function AquaScanComparePage() {
  return (
    <ToolAppShell label="aquascan-pro-compare">
      <CompareHub />
    </ToolAppShell>
  );
}
