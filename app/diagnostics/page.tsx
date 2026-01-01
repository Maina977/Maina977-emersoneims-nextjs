// Full-page Generator Diagnostic Module
// Professional diagnostic tool with 5,930+ error codes
'use client';

import dynamic from 'next/dynamic';

// Dynamically import the UltimateDiagnosticModule to avoid SSR issues with Web APIs
const UltimateDiagnosticModule = dynamic(
  () => import('@/components/diagnostics/UltimateDiagnosticModule'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            {/* Aerospace-style loading animation */}
            <div className="w-16 h-16 border-2 border-cyan-500/30 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-2 w-12 h-12 border border-cyan-400/20 rounded-full" />
          </div>
          <p className="text-cyan-400 mt-6 font-mono text-sm tracking-wider">INITIALIZING DIAGNOSTIC SYSTEM</p>
          <p className="text-slate-500 text-xs mt-2 font-mono">Loading 5,930+ error codes...</p>
        </div>
      </div>
    )
  }
);

export default function DiagnosticsPage() {
  return <UltimateDiagnosticModule />;
}