'use client';

/**
 * AQUASCAN PRO V2 — mounts the new Borehole AI engine UI from
 * G:\EMERSONEIMS-AQUASCANPRO inside Next.js. Engine is a single React component
 * (external/borehole-ai-engine/src/index.tsx) with its own internal navigation.
 *
 * A transient chunk-load failure (a stale/404'd /_next chunk right after a
 * deploy, a dropped connection) is retried with back-off; a stalled download
 * shows a slow note with Reload after 12 s, and 3 failures a Try again
 * (lib/loading, 2026-11-21). Before, it dead-ended at the route error boundary.
 */

import { resilient } from '@/lib/loading/ResilientModule';

const BoreholeAnalyzerApp = resilient(
  () => import('@/external/borehole-ai-engine/src/index'),
  { name: 'AquaScan Pro (Borehole AI)' },
);

export default function AquaScanProV2() {
  return <BoreholeAnalyzerApp />;
}
