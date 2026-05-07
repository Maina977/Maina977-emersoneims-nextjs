'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, SectionHeading, SampleBadge, HubConnectStrip, ProOnly } from '@/components/hub/HubShell';
import { KPICard, LockedChart, formatValue } from '@/components/charts/dataviz';

/**
 * Lifecycle cost calculator — 25-year discounted cashflow comparison
 * between three strategies: grid-only, grid + diesel, grid + solar/UPS hybrid.
 *
 * Sources for default assumptions:
 *  - KPLC small-commercial schedule (KSh/kWh)
 *  - NEMA / EPRA diesel retail (KSh/L) — 12-month average
 *  - PV system cost from local 2024 quote sample (KSh/kWp installed)
 *  - Battery cost from Pylontech / BYD distributor quotes (KSh/kWh installed)
 *
 *  All currency in KSh. SAMPLE figures — re-enter your own inputs.
 */

interface Inputs {
  loadKWh: number;        // daily kWh
  capexGrid: number;      // KSh
  capexDiesel: number;    // KSh
  capexHybrid: number;    // KSh
  tariff: number;         // KSh / kWh
  tariffEsc: number;      // % per year
  fuelPrice: number;      // KSh / litre
  fuelEsc: number;        // % per year
  fuelKWhPerL: number;    // kWh per litre @ load
  dieselHrsPerDay: number;
  dieselKW: number;
  solarShare: number;     // 0..1 — how much of daily kWh hybrid covers
  omGridPct: number;      // % of capex / yr
  omDieselPct: number;
  omHybridPct: number;
  wacc: number;           // discount rate %
  years: number;
}

const DEFAULT: Inputs = {
  loadKWh: 120,
  capexGrid: 0,
  capexDiesel: 1_350_000,
  capexHybrid: 4_200_000,
  tariff: 27,
  tariffEsc: 7,
  fuelPrice: 195,
  fuelEsc: 5,
  fuelKWhPerL: 3.2,
  dieselHrsPerDay: 4,
  dieselKW: 30,
  solarShare: 0.7,
  omGridPct: 0,
  omDieselPct: 6,
  omHybridPct: 2,
  wacc: 14,
  years: 25,
};

function npv(cashflows: number[], wacc: number) {
  return cashflows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + wacc / 100, i), 0);
}

function payback(capex: number, savingsPerYear: number[]): number | null {
  let cum = -capex;
  for (let i = 0; i < savingsPerYear.length; i++) {
    cum += savingsPerYear[i];
    if (cum >= 0) return i + (1 - cum / savingsPerYear[i]);
  }
  return null;
}

export default function LifecycleClient() {
  const [v, setV] = React.useState<Inputs>(DEFAULT);

  const dailyKWh = v.loadKWh;
  const yearKWh = dailyKWh * 365;

  // Year-by-year cashflows (out-flows positive)
  const gridCash: number[] = [v.capexGrid];
  const dieselCash: number[] = [v.capexDiesel];
  const hybridCash: number[] = [v.capexHybrid];
  const gridSavings: number[] = [];
  const hybridSavings: number[] = [];

  for (let y = 1; y <= v.years; y++) {
    const tariffY = v.tariff * Math.pow(1 + v.tariffEsc / 100, y - 1);
    const fuelY = v.fuelPrice * Math.pow(1 + v.fuelEsc / 100, y - 1);

    // Grid-only: pays full tariff for everything
    const gridOpY = yearKWh * tariffY;
    const gridOmY = v.capexGrid * (v.omGridPct / 100);
    gridCash.push(gridOpY + gridOmY);

    // Diesel-supported: 4 h/day diesel + rest from grid
    const dieselKWhY = v.dieselKW * v.dieselHrsPerDay * 365;
    const dieselFuelY = (dieselKWhY / v.fuelKWhPerL) * fuelY;
    const dieselGridKWhY = Math.max(0, yearKWh - dieselKWhY);
    const dieselGridY = dieselGridKWhY * tariffY;
    const dieselOmY = v.capexDiesel * (v.omDieselPct / 100);
    dieselCash.push(dieselFuelY + dieselGridY + dieselOmY);

    // Hybrid: solarShare of yearKWh from PV/battery (free fuel), rest from grid
    const hybridSolarKWhY = yearKWh * v.solarShare;
    const hybridGridKWhY = yearKWh - hybridSolarKWhY;
    const hybridGridY = hybridGridKWhY * tariffY;
    const hybridOmY = v.capexHybrid * (v.omHybridPct / 100);
    hybridCash.push(hybridGridY + hybridOmY);

    gridSavings.push(gridOpY + gridOmY - (dieselFuelY + dieselGridY + dieselOmY));
    hybridSavings.push(gridOpY + gridOmY - (hybridGridY + hybridOmY));
  }

  const npvGrid = npv(gridCash, v.wacc);
  const npvDiesel = npv(dieselCash, v.wacc);
  const npvHybrid = npv(hybridCash, v.wacc);

  const dieselPayback = payback(v.capexDiesel, gridSavings);
  const hybridPayback = payback(v.capexHybrid, hybridSavings);

  // Cumulative cost chart
  const labels = Array.from({ length: v.years + 1 }, (_, i) => `Y${i}`);
  const cum = (arr: number[]) => arr.reduce<number[]>((out, c) => { out.push((out[out.length - 1] ?? 0) + c); return out; }, []);
  const cumGrid = cum(gridCash);
  const cumDiesel = cum(dieselCash);
  const cumHybrid = cum(hybridCash);

  const cheapest = Math.min(npvGrid, npvDiesel, npvHybrid);
  const winner =
    cheapest === npvHybrid ? 'Solar / UPS hybrid' :
    cheapest === npvDiesel ? 'Grid + diesel' : 'Grid only';

  return (
    <div className="space-y-6">
      <Card>
        <SectionHeading
          eyebrow="Step 1"
          title="Project assumptions"
          caption="All figures in Kenyan Shillings. Defaults are sample 2024 distributor quotes — replace with your own."
        />
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 text-sm">
          {([
            ['loadKWh',         'Daily load',          'kWh'],
            ['tariff',          'Grid tariff',         'KSh/kWh'],
            ['tariffEsc',       'Tariff escalation',   '%/yr'],
            ['fuelPrice',       'Diesel retail',       'KSh/L'],
            ['fuelEsc',         'Diesel escalation',   '%/yr'],
            ['fuelKWhPerL',     'Diesel kWh per L',    'kWh/L'],
            ['dieselKW',        'Diesel set rating',   'kW'],
            ['dieselHrsPerDay', 'Diesel run hours',    'h/day'],
            ['solarShare',      'Hybrid solar share',  '0..1'],
            ['capexDiesel',     'Diesel capex',        'KSh'],
            ['capexHybrid',     'Hybrid capex',        'KSh'],
            ['wacc',            'Discount rate (WACC)','%'],
            ['years',           'Horizon',             'years'],
            ['omDieselPct',     'Diesel O&M',          '%/yr'],
            ['omHybridPct',     'Hybrid O&M',          '%/yr'],
          ] as const).map(([k, label, unit]) => (
            <label key={k} className="grid gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{label} ({unit})</span>
              <input
                type="number"
                value={v[k] as number}
                step={k === 'solarShare' ? 0.05 : 1}
                onChange={(e) => setV((p) => ({ ...p, [k]: Number(e.target.value) || 0 }))}
                className="rounded-md border bg-surface-base px-2 py-1.5 tabular-nums"
                style={{ borderColor: 'var(--color-border-subtle)' }}
              />
            </label>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <KPICard label="NPV · Grid only"      value={Math.round(npvGrid / 1000)}   unit="KSh ’000" status={cheapest === npvGrid   ? 'success' : 'neutral'} decimals={0} />
        <KPICard label="NPV · Grid + diesel"  value={Math.round(npvDiesel / 1000)} unit="KSh ’000" status={cheapest === npvDiesel ? 'success' : 'neutral'} decimals={0} />
        <KPICard label="NPV · Solar/UPS hybrid" value={Math.round(npvHybrid / 1000)} unit="KSh ’000" status={cheapest === npvHybrid ? 'success' : 'neutral'} decimals={0} />
      </div>

      <Card className="border-l-4 border-l-emerald-500">
        <div className="text-xs uppercase tracking-[0.2em] text-ink-muted">Lowest 25-year NPV</div>
        <div className="text-2xl font-semibold mt-1">{winner}</div>
        <div className="text-sm text-ink-secondary mt-2">
          Diesel payback vs grid: <strong>{dieselPayback ? `${dieselPayback.toFixed(1)} yr` : 'never within horizon'}</strong>{' '}
          · Hybrid payback vs grid: <strong>{hybridPayback ? `${hybridPayback.toFixed(1)} yr` : 'never within horizon'}</strong>
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading eyebrow="Cumulative cashflow" title={`${v.years}-year cumulative cost`} caption="Lower is better. Includes capex + tariff + diesel + O&M, no discounting on the chart." />
          <SampleBadge />
        </div>
        <LockedChart
          type="line"
          title="Cumulative cost"
          unit="KSh"
          decimals={0}
          labels={labels}
          series={[
            { label: 'Grid only',        data: cumGrid.map((x) => Math.round(x)) },
            { label: 'Grid + diesel',    data: cumDiesel.map((x) => Math.round(x)) },
            { label: 'Solar/UPS hybrid', data: cumHybrid.map((x) => Math.round(x)) },
          ]}
        />
      </Card>

      <Card>
        <SectionHeading eyebrow="Year 1 vs Year 25" title="Operating cost trajectory" />
        <div className="grid gap-4 md:grid-cols-3 text-sm">
          <div className="rounded-md border p-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <div className="text-xs uppercase text-ink-muted">Grid Y1 → Y{v.years}</div>
            <div className="font-semibold tabular-nums">{formatValue(gridCash[1] || 0, { unit: 'KSh', decimals: 0 })} → {formatValue(gridCash[v.years] || 0, { unit: 'KSh', decimals: 0 })}</div>
          </div>
          <div className="rounded-md border p-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <div className="text-xs uppercase text-ink-muted">Diesel Y1 → Y{v.years}</div>
            <div className="font-semibold tabular-nums">{formatValue(dieselCash[1] || 0, { unit: 'KSh', decimals: 0 })} → {formatValue(dieselCash[v.years] || 0, { unit: 'KSh', decimals: 0 })}</div>
          </div>
          <div className="rounded-md border p-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <div className="text-xs uppercase text-ink-muted">Hybrid Y1 → Y{v.years}</div>
            <div className="font-semibold tabular-nums">{formatValue(hybridCash[1] || 0, { unit: 'KSh', decimals: 0 })} → {formatValue(hybridCash[v.years] || 0, { unit: 'KSh', decimals: 0 })}</div>
          </div>
        </div>
      </Card>

      <ProOnly note="Pro · methodology — switch to Pro mode to view.">
        <Card>
          <SectionHeading eyebrow="Pro · methodology" title="How the math works" />
          <ul className="list-disc pl-5 text-sm text-ink-secondary space-y-1">
            <li>NPV = Σ CF<sub>y</sub> / (1+WACC)<sup>y</sup>, y = 0..N. Capex sits at y = 0; opex starts at y = 1.</li>
            <li>Tariff and fuel are escalated by their own rates compounded annually.</li>
            <li>Hybrid model assumes the PV/battery covers <code>solarShare × annual kWh</code> with zero marginal fuel cost.</li>
            <li>O&M is a flat % of capex; for a real proposal replace with a 25-year capex/replacement schedule (battery replacement at year 10–15).</li>
            <li>Payback is undiscounted; the NPV verdict is the discounted comparison.</li>
            <li>Battery degradation, IRR, and EAC (equivalent annual cost) are available on request — this widget surfaces NPV + payback for clarity.</li>
          </ul>
        </Card>
      </ProOnly>

      <Card>
        <SectionHeading eyebrow="Use this with" title="Connected workflow" />
        <p className="text-sm text-ink-secondary">
          Pull system size + capex from the{' '}
          <Link href="/hub/verifier" className="text-ink-link">Combination Verifier</Link>; sense-check the operating profile against the{' '}
          <Link href="/hub/simulator" className="text-ink-link">Smart Sizing Simulator</Link>; then compare written proposals with the{' '}
          <Link href="/hub/quote-audit" className="text-ink-link">Quotation Audit</Link>.
        </p>
      </Card>

      <HubConnectStrip active="/hub/lifecycle" />
    </div>
  );
}
