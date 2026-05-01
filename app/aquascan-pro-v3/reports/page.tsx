'use client';

import dynamic from 'next/dynamic';
import { ToolAppShell, ToolLoadingState } from '@/components/tools/ToolAppShell';

const ReportsHub = dynamic(
  () => import('@/components/aquascan-modules/reports/ReportsHub'),
  { ssr: false, loading: () => <ToolLoadingState name="AquaScan Reports" /> }
);

export default function AquaScanReportsPage() {
  return (
    <ToolAppShell label="aquascan-pro-reports">
      <ReportsHub />
    </ToolAppShell>
  );
}
