'use client';

// Wired to the NEW AquaScan / Borehole AI engine from G:\EMERSONEIMS-AQUASCANPRO (May 2026 source)
// Old AquaScanProComplete preserved at components/borehole/AquaScanProComplete.tsx as fallback.
import { ToolAppShell } from '@/components/tools/ToolAppShell';
import { resilient } from '@/lib/loading/ResilientModule';
import B2BCommercialBand from '@/components/b2b/B2BCommercialBand';
import { B2B_PROFILES } from '@/lib/b2b/pageProfiles';
import ToolSeoContent from '@/components/seo/ToolSeoContent';
// Engine stylesheet imported HERE (statically) instead of inside the
// dynamically-imported engine: this ships it in the initial page <head>,
// eliminating the lazy CSS chunk whose fetch failure crashed the tool with
// ChunkLoadError on 2026-07-09 (twice, same chunk, across deployments).
// An initial-page stylesheet cannot throw — worst case is unstyled content.
import '@/external/borehole-ai-engine/src/styles.css';
// Privacy correction 2026-11-28: the Inter faces this tool used to fetch from
// fonts.googleapis.com, now served from our own domain (see the file's header).
// They back the 'Inter' family named second in the engine's --font.
import './inter-self-hosted.css';

/**
 * THIS import is where every user-facing ChunkLoadError on this page has
 * originated: it pulls the tool's JS + CSS chunks, and a single failed fetch
 * (network blip) used to crash straight to the error boundary. It is now
 * retried with back-off, shows a slow note with Reload after 12 s (a stalled
 * request never fails) and a Try again after 3 failures (lib/loading, 2026-11-21).
 */
const AquaScanProV2 = resilient(
  () => import('@/components/aquascan-modules/AquaScanProV2'),
  { name: 'AquaScan Pro' }
);

export default function AquaScanProV3Page() {
  return (
    <ToolAppShell label="aquascan-pro-v3">
      {/* Visible, server-rendered h1 at the top (2026-10-19 re-audit: the only h1
          was the SEO block below the tool, ~12,400 px down on a phone). */}
      <h1 className="px-4 pt-4 text-center text-lg font-semibold text-white sm:text-xl">
        AquaScan Pro — free borehole pre-screen for Kenya
      </h1>
      <AquaScanProV2 />
      {/* B2B band below the tool (2026-10-19 re-audit): above it, it pushed the upload form further down on phones. */}
      <B2BCommercialBand profile={B2B_PROFILES.aquascanPro} />
      <ToolSeoContent tool="aquascan-pro-v3" headingLevel="h2" />
    </ToolAppShell>
  );
}
