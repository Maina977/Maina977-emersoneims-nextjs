'use client';

import { ToolAppShell } from '@/components/tools/ToolAppShell';
import { resilient } from '@/lib/loading/ResilientModule';

// Retry, slow note + Reload, and Try again (lib/loading, 2026-11-21).
const CompareHub = resilient(
  () => import('@/components/aquascan-modules/compare/CompareHub'),
  { name: 'AquaScan Site Comparison' }
);

export default function AquaScanComparePage() {
  return (
    <ToolAppShell label="aquascan-pro-compare">
      <CompareHub />
    </ToolAppShell>
  );
}
