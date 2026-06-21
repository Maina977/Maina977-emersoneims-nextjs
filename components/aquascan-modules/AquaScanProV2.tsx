'use client';

/**
 * AQUASCAN PRO V2 — mounts the new Borehole AI engine UI from
 * G:\EMERSONEIMS-AQUASCANPRO inside Next.js. Engine is a single React component
 * (external/borehole-ai-engine/src/index.tsx) with its own internal navigation.
 */

import dynamic from 'next/dynamic';
import { ToolLoadingState } from '@/components/tools/ToolAppShell';

/**
 * Retry a dynamic import on transient chunk-load failures. A single stale/404'd
 * /_next chunk (common right after a deploy) would otherwise dead-end at the
 * route error boundary; one retry recovers most of those without any UI flash.
 */
function importWithRetry<T>(factory: () => Promise<T>, retries = 2, delayMs = 600): Promise<T> {
  return factory().catch((err) => {
    if (retries <= 0) throw err;
    return new Promise<T>((resolve) => setTimeout(resolve, delayMs)).then(() =>
      importWithRetry(factory, retries - 1, delayMs * 2),
    );
  });
}

const BoreholeAnalyzerApp = dynamic(
  () => importWithRetry(() => import('@/external/borehole-ai-engine/src/index')),
  {
    ssr: false,
    loading: () => <ToolLoadingState name="AquaScan Pro (Borehole AI)" />,
  },
);

export default function AquaScanProV2() {
  return <BoreholeAnalyzerApp />;
}
