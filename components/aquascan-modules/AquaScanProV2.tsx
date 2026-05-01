'use client';

/**
 * AQUASCAN PRO V2 — mounts the new Borehole AI engine UI from
 * G:\EMERSONEIMS-AQUASCANPRO inside Next.js. Engine is a single React component
 * (external/borehole-ai-engine/src/index.tsx) with its own internal navigation.
 */

import dynamic from 'next/dynamic';
import { ToolLoadingState } from '@/components/tools/ToolAppShell';

const BoreholeAnalyzerApp = dynamic(
  () => import('@/external/borehole-ai-engine/src/index'),
  {
    ssr: false,
    loading: () => <ToolLoadingState name="AquaScan Pro (Borehole AI)" />,
  },
);

export default function AquaScanProV2() {
  return <BoreholeAnalyzerApp />;
}
