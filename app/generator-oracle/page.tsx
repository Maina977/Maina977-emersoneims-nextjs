'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
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
 * What it holds (2026-10-18 tool audit, owner chose an honest count):
 * - Hand-written controller alarm guides for 10 controller brands, one entry
 *   per brand + code, plus the J1939 SPN/FMI engine-code reference. Live
 *   totals come from /api/generator-oracle/health; never write them here.
 * - The ~397,401 range-generated "template" codes and the generated VODIA
 *   rows are gone, and nothing is described as manufacturer text.
 * - Reset steps per alarm, Repair Centre guides for symptoms, and a
 *   one-tap route to an EmersonEIMS engineer on every result.
 * - Simulators (dashboard, monitoring, controller displays) are training
 *   views on simulated data and say so on screen.
 * - 7-language support including RTL Arabic
 */
export default function GeneratorOraclePage() {
  return (
    <>
      {/* SEO Schema Markup - SoftwareApplication, FAQ, HowTo, Service */}
      <GeneratorOracleSEO pageType="diagnostic" />
      {/* Disable DevTools protection - it causes false positives on Windows with display scaling */}
      <DMCAProtection enableDevToolsProtection={false} />
      {/* B2B Commercial Band — moved here 2026-10-16, above the tool as on
          the other tool pages. It had been inside LoadingFallback, so it
          showed only while the tool loaded, squeezed beside the spinner. */}
      <B2BCommercialBand profile={B2B_PROFILES.generatorOracle} />
      <div className="px-4 pt-4 max-w-7xl mx-auto">
        <LiveBackendStatus variant="compact" />
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <GeneratorOracleModule />
      </Suspense>
    </>
  );
}

/** Deterministic thousands separator — never toLocaleString() (hydration). */
function fmtNum(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

interface OracleTotals {
  controllerAlarms: number;
  j1939Codes: number;
  brands: number;
}

function LoadingFallback() {
  const [stats, setStats] = useState<OracleTotals | null>(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/generator-oracle/health')
      .then((r) => r.json())
      .then((j) => { if (alive && j?.totals) setStats(j.totals as OracleTotals); })
      .catch(() => { /* leave the figures blank rather than guess */ });
    return () => { alive = false; };
  }, []);

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
            {/*
              COUNTS COME FROM THE INDEX, NOT FROM A LITERAL.
              These were hardcoded, and the verified figure had gone stale: the
              page claimed "6,700+" while /api/generator-oracle/health — which
              counts `verified === true` across the loaded index — reported
              54,192. Neither of us could say which was right, and that is the
              problem with writing a number into markup. It is now read from the
              same endpoint the tool itself uses, so the page states whatever the
              data actually holds and cannot drift again.

              Until the fetch resolves the figures are simply absent rather than
              approximated — a placeholder number is how the stale one got here.

              The two counts stay separate on purpose: hand-written controller
              alarm guides, and J1939 engine-code reference entries. They are
              different kinds of entry, so they are not summed into one headline.
            */}
            <div className="text-amber-400 font-bold">{stats ? fmtNum(stats.controllerAlarms) : '—'}</div>
            <div className="text-slate-500">Controller Alarms</div>
          </div>
          <div className="text-center">
            <div className="text-amber-400 font-bold">{stats ? fmtNum(stats.j1939Codes) : '—'}</div>
            <div className="text-slate-500">J1939 Engine Codes</div>
          </div>
          <div className="text-center">
            <div className="text-amber-400 font-bold">{stats ? stats.brands : '—'}</div>
            <div className="text-slate-500">Controller Brands</div>
          </div>
        </div>
      </div>
    </div>
  );
}
