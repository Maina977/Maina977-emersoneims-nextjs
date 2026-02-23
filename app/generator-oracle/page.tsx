'use client';

import { Suspense, lazy } from 'react';
import DMCAProtection from '@/components/security/DMCAProtection';

// Lazy load the main component for better initial load performance
const GeneratorOracleModule = lazy(() => import('@/components/generator-oracle/GeneratorOracleModule'));

/**
 * Generator Oracle
 * Premium diagnostic system compatible with generator controllers
 *
 * DISCLAIMER: Generator Oracle is an independently developed diagnostic tool.
 * It is NOT affiliated with, endorsed by, or sponsored by any controller manufacturer.
 * All brand names are trademarks of their respective owners.
 *
 * Features:
 * - 250,000+ fault codes compatible with 10 controller types
 * - Step-by-step reset pathways for every fault
 * - Parameter-based diagnosis with live readings
 * - 100% offline capability via IndexedDB
 * - 7-language support including RTL Arabic
 * - Technician feedback loop
 * - Licensed product with M-Pesa/Bank payment verification
 * - Volvo Penta VODIA diagnostic integration
 */
export default function GeneratorOraclePage() {
  return (
    <>
      {/* Disable DevTools protection - it causes false positives on Windows with display scaling */}
      <DMCAProtection enableDevToolsProtection={false} />
      <Suspense fallback={<LoadingFallback />}>
        <GeneratorOracleModule />
      </Suspense>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-center px-4">
        {/* Oracle Logo Animation */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-4 border-amber-500/40 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-white mb-2">
          Generator Oracle
        </h2>
        <p className="text-amber-400 font-medium mb-4">
          Initializing Diagnostic System
        </p>

        {/* Progress Indicator */}
        <div className="w-64 h-2 bg-slate-800 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"
               style={{ width: '60%' }} />
        </div>

        {/* Loading Stats */}
        <div className="mt-6 flex justify-center gap-6 text-sm">
          <div className="text-center">
            <div className="text-amber-400 font-bold">250,000+</div>
            <div className="text-slate-500">Fault Codes</div>
          </div>
          <div className="text-center">
            <div className="text-amber-400 font-bold">10</div>
            <div className="text-slate-500">Compatible Types</div>
          </div>
          <div className="text-center">
            <div className="text-amber-400 font-bold">100%</div>
            <div className="text-slate-500">Offline</div>
          </div>
        </div>
      </div>
    </div>
  );
}
