'use client';

import { Suspense } from 'react';
import AerospaceCockpit from '@/components/diagnostics/AerospaceCockpit';

/**
 * Full-page diagnostic cockpit
 * Features aerospace-style gauges, pressure monitoring, real-time charts
 * Generator Diagnostic Cockpit - Real-time telemetry, pressure gauges, and fault code monitoring
 */
export default function DiagnosticCockpitPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyan-400 font-mono text-xl">INITIALIZING MISSION CONTROL...</p>
        </div>
      </div>
    }>
      <AerospaceCockpit />
    </Suspense>
  );
}
