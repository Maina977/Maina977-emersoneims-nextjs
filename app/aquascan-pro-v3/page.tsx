'use client';

// Wired to the NEW AquaScan / Borehole AI engine from G:\EMERSONEIMS-AQUASCANPRO (May 2026 source)
// Old AquaScanProComplete preserved at components/borehole/AquaScanProComplete.tsx as fallback.
import dynamic from 'next/dynamic';
import { ToolAppShell, ToolLoadingState } from '@/components/tools/ToolAppShell';
import B2BCommercialBand from '@/components/b2b/B2BCommercialBand';
import { B2B_PROFILES } from '@/lib/b2b/pageProfiles';
// Engine stylesheet imported HERE (statically) instead of inside the
// dynamically-imported engine: this ships it in the initial page <head>,
// eliminating the lazy CSS chunk whose fetch failure crashed the tool with
// ChunkLoadError on 2026-07-09 (twice, same chunk, across deployments).
// An initial-page stylesheet cannot throw — worst case is unstyled content.
import '@/external/borehole-ai-engine/src/styles.css';

/**
 * Retry a dynamic import with backoff. THIS import is where every user-facing
 * ChunkLoadError on this page has originated: it pulls the tool's JS + CSS
 * chunks, and a single failed fetch (network blip) used to crash straight to
 * the error boundary. Re-invoking the factory makes the bundler re-attempt
 * the failed chunks, so a 2-second blip costs 2 seconds — not a crash.
 */
function importWithRetry<T>(factory: () => Promise<T>, retries = 3, delayMs = 700): Promise<T> {
  return factory().catch((err) => {
    if (retries <= 0) throw err;
    return new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        importWithRetry(factory, retries - 1, delayMs * 2).then(resolve, reject);
      }, delayMs);
    });
  });
}

const AquaScanProV2 = dynamic(
  () => importWithRetry(() => import('@/components/aquascan-modules/AquaScanProV2')),
  {
    ssr: false,
    loading: () => <ToolLoadingState name="AquaScan Pro" />,
  }
);

export default function AquaScanProV3Page() {
  return (
    <ToolAppShell label="aquascan-pro-v3">
      {/* B2B Commercial Band */}
      <B2BCommercialBand profile={B2B_PROFILES.aquascanPro} />

      <AquaScanProV2 />
    </ToolAppShell>
  );
}
