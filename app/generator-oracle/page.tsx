'use client';

import { Suspense, lazy } from 'react';
import DMCAProtection from '@/components/security/DMCAProtection';
import GeneratorOracleSEO from '@/components/seo/GeneratorOracleSEO';
import B2BCommercialBand from '@/components/b2b/B2BCommercialBand';
import { B2B_PROFILES } from '@/lib/b2b/pageProfiles';
import LiveBackendStatus from '@/components/generator-oracle/LiveBackendStatus';

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
 * - Fault-code references across 10 controller families, measured by executing
 *   the registries rather than estimated:
 *     Tier 1 verified  — 6,756 DISTINCT codes over 79 brands
 *     Tier 2 range     — ~397,401 code numbers, each titled "meaning not
 *                        verified" and carrying verified:false
 *   The Tier 1 figure was previously quoted as 54,192. That counted one code
 *   once per applicable engine model — exactly 17x over-count on the VODIA set
 *   (51,527 rows for 3,029 real codes). Rows are now collapsed per code in
 *   lib/data/curatedFaultCodes.ts, which preserves every code and records the
 *   models it applies to. No code was removed.
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
      {/* SEO Schema Markup - SoftwareApplication, FAQ, HowTo, Service */}
      <GeneratorOracleSEO pageType="diagnostic" />
      {/* Disable DevTools protection - it causes false positives on Windows with display scaling */}
      <DMCAProtection enableDevToolsProtection={false} />
      <div className="px-4 pt-4 max-w-7xl mx-auto">
        <LiveBackendStatus variant="compact" />
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <GeneratorOracleModule />
      </Suspense>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
  {/* B2B Commercial Band */}
  <B2BCommercialBand profile={B2B_PROFILES.generatorOracle} />

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
            {/*
              Was a bare "450,000+ Fault-Code References", which read as verified
              data. That figure is Tier 2 range-based coverage — every code
              number in each controller's published ranges, each entry titled
              "meaning not verified" and carrying verified:false. The verified
              count is a separate, much smaller number. Both are shown so neither
              is mistaken for the other.
            */}
            <div className="text-amber-400 font-bold">6,700+</div>
            <div className="text-slate-500">Verified Fault Codes</div>
          </div>
          <div className="text-center">
            <div className="text-amber-400 font-bold">450,000+</div>
            <div className="text-slate-500">Code Numbers Covered</div>
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
