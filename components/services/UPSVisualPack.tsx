/**
 * UPS Visual Pack
 *
 * Schematic, performance curves and diagnostic gauges for the UPS service page.
 *
 * These components previously lived in a hardcoded route at
 * app/services/ups-systems/page.tsx. That static route shadowed the dynamic
 * /services/[service] route, so the UPS bible, the UPS engineering deep-dive,
 * the diagnostics panel, pricing, FAQs and the JSON-LD structured data never
 * rendered for this slug. The static route has been retired and these visuals
 * moved here so the page keeps them alongside everything it was missing.
 *
 * The explanatory prose that surrounded them on the old page is deliberately
 * not carried over: topology, runtime and temperature derating are covered by
 * UPS_BIBLE in lib/services/serviceBibles.ts, which is the audited source.
 * The old copy contradicted it (see commit message for specifics).
 *
 * Rendered from the server route for slug 'ups-systems'. The visual components
 * themselves are client components.
 */

import { UPSSchematic } from '@/components/visualizations/ServiceSchematics';
import { UPSEfficiencyCurve, BatteryDischargeCurve } from '@/components/visualizations/PerformanceGraphs';
import { EfficiencyGauge, ComponentStatusDashboard } from '@/components/visualizations/DiagnosticTools';

export default function UPSVisualPack() {
  return (
    <section
      id="ups-visual-reference"
      aria-label="UPS schematic, performance curves and diagnostic reference"
      className="border-t border-slate-800 bg-slate-950 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-2">
          Visual Reference
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          UPS Schematic, Curves &amp; Diagnostics
        </h2>
        <p className="mt-3 text-slate-400 max-w-3xl">
          Topology schematic, efficiency and battery-discharge behaviour, and the
          condition indicators used during a service visit. Read these alongside
          the technical reference above — the figures that matter for sizing and
          fault-finding are set out there.
        </p>

        <div className="mt-10 space-y-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Double-conversion topology</h3>
            <UPSSchematic />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Efficiency against load</h3>
              <UPSEfficiencyCurve />
              <p className="mt-3 text-sm text-slate-400">
                Efficiency falls away at low load fractions, which is why a heavily
                oversized UPS costs more to run than a correctly sized one.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Battery discharge</h3>
              <BatteryDischargeCurve />
              <p className="mt-3 text-sm text-slate-400">
                Runtime is not linear with load. Autonomy should be proven by a timed
                discharge test rather than calculated from a datasheet figure.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Efficiency indicator</h3>
              <EfficiencyGauge />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Component status</h3>
              <ComponentStatusDashboard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
