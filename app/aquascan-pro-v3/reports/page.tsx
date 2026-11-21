'use client';

import { ToolAppShell } from '@/components/tools/ToolAppShell';
import { resilient } from '@/lib/loading/ResilientModule';

// Retry, slow note + Reload, and Try again (lib/loading, 2026-11-21).
const ReportsHub = resilient(
  () => import('@/components/aquascan-modules/reports/ReportsHub'),
  { name: 'AquaScan Reports' }
);

export default function AquaScanReportsPage() {
  return (
    <ToolAppShell label="aquascan-pro-reports">
      <ReportsHub />
    </ToolAppShell>
  );
}
