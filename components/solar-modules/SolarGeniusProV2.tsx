'use client';

/**
 * SOLAR GENIUS PRO V2 — wraps the new Vite SPA from G:\EMERSONEIMS-SolarGeniusPro
 * mounted inside Next.js. Uses HashRouter to avoid conflict with Next routing.
 * No SSR (the SPA uses client-only APIs).
 */

import dynamic from 'next/dynamic';
import { ToolLoadingState } from '@/components/tools/ToolAppShell';

const SolarApp = dynamic(
  () => import('./crc/src/App'),
  {
    ssr: false,
    loading: () => <ToolLoadingState name="Solar Genius Pro (Next-Gen)" />,
  },
);

export default function SolarGeniusProV2() {
  return <SolarApp />;
}
