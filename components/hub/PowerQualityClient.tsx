'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, SectionHeading, SampleBadge, HubConnectStrip, ProOnly } from '@/components/hub/HubShell';
import { KPICard, StatusBar, LockedChart, formatValue, statusPalette, type StatusKey } from '@/components/charts/dataviz';

/**
 * Power Quality module — voltage stats, THD, frequency, sag/swell tally.
 * Pulls live samples from the simulator's HarmonicsPanel logic; here we
 * surface them as a standalone power-quality dashboard.
 */

interface PqInputs {
  nominalV: number;
  measuredV: number;
  thdVPct: number;
  thdIPct: number;
  freqHz: number;
  sagsPerDay: number;
  swellsPerDay: number;
  flickerPst: number;
}

const DEFAULT: PqInputs = {
  nominalV: 230,
  measuredV: 218,
  thdVPct: 6.4,
  thdIPct: 14.5,
  freqHz: 49.7,
  sagsPerDay: 7,
  swellsPerDay: 2,
  flickerPst: 1.2,
};

function bandV(measured: number, nominal: number): StatusKey {
  const dev = Math.abs(measured - nominal) / nominal;
  if (dev <= 0.05) return 'success';
  if (dev <= 0.1) return 'warning';
  return 'danger';
}
function bandThd(p: number, danger: number, warning: number): StatusKey {
  if (p >= danger) return 'danger';
  if (p >= warning) return 'warning';
  return 'success';
}
function bandFreq(f: number): StatusKey {
  const dev = Math.abs(f - 50);
  if (dev <= 0.5) return 'success';
  if (dev <= 1) return 'warning';
  return 'danger';
}

export default function PowerQualityClient() {
  const [pq, setPq] = React.useState<PqInputs>(DEFAULT);

  const vSk = bandV(pq.measuredV, pq.nominalV);
  const thdVSk = bandThd(pq.thdVPct, 8, 5);
  const thdISk = bandThd(pq.thdIPct, 20, 12);
  const freqSk = bandFreq(pq.freqHz);

  // 24 h voltage profile (sample, deterministic)
  const hours = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`);
  const profile = hours.map((_, h) => {
    const base = pq.measuredV;
    const evening = h >= 18 && h <= 22 ? -8 : 0;
    const morning = h >= 6 && h <= 9 ? -4 : 0;
    return Math.round(base + evening + morning + Math.sin(h) * 2);
  });
  const limitHi = pq.nominalV * 1.10;
  const limitLo = pq.nominalV * 0.90;

  // Recommendations
  const recs: { sk: StatusKey; title: string; detail: string }[] = [];
  if (vSk !== 'success') recs.push({ sk: vSk, title: 'Voltage outside ±5 % band', detail: 'Add an AVR / line-conditioner; protect electronics from premature capacitor failure.' });
  if (thdVSk !== 'success') recs.push({ sk: thdVSk, title: 'Voltage THD elevated', detail: 'Look for upstream non-linear loads (VFDs without filters). Consider passive harmonic filter.' });
  if (thdISk !== 'success') recs.push({ sk: thdISk, title: 'Current THD elevated', detail: 'Likely cause: switched-mode supplies + LED drivers. Mitigate at source or with K-rated transformer.' });
  if (freqSk !== 'success') recs.push({ sk: freqSk, title: 'Frequency drift', detail: 'Sustained drift above ±0.5 Hz indicates weak grid; sensitive loads should run via UPS double-conversion.' });
  if (pq.sagsPerDay >= 5) recs.push({ sk: 'warning', title: 'High sag count', detail: 'Servers / refrigeration must sit behind UPS with 0 ms transfer. Audit critical-load wiring.' });
  if (recs.length === 0) recs.push({ sk: 'success', title: 'Within tolerances', detail: 'Power quality compliant for general electronics. Re-measure after any new large load is added.' });

  return (
    <div className="space-y-6">
      <Card>
        <SectionHeading
          eyebrow="Step 1"
          title="Site measurements"
          caption="Enter readings from the meter, oscilloscope, or power-quality analyser. Sample defaults shown."
        />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 text-sm">
          {([
            ['nominalV',    'Nominal V',           'V'],
            ['measuredV',   'Measured V',          'V'],
            ['thdVPct',     'Voltage THD',         '%'],
            ['thdIPct',     'Current THD',         '%'],
            ['freqHz',      'Frequency',           'Hz'],
            ['sagsPerDay',  'Sags / day',          ''],
            ['swellsPerDay','Swells / day',        ''],
            ['flickerPst',  'Flicker P_st',        ''],
          ] as const).map(([k, label, unit]) => (
            <label key={k} className="grid gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">{label} {unit && `(${unit})`}</span>
              <input
                type="number"
                value={pq[k] as number}
                step={0.1}
                onChange={(e) => setPq((p) => ({ ...p, [k]: Number(e.target.value) || 0 }))}
                className="rounded-md border bg-surface-base px-2 py-1.5 tabular-nums"
                style={{ borderColor: 'var(--color-border-subtle)' }}
              />
            </label>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <KPICard label="Voltage"        value={pq.measuredV}  unit="V"  status={vSk}    decimals={0} />
        <KPICard label="Voltage THD"    value={pq.thdVPct}    unit="%"  status={thdVSk} decimals={1} />
        <KPICard label="Current THD"    value={pq.thdIPct}    unit="%"  status={thdISk} decimals={1} />
        <KPICard label="Frequency"      value={pq.freqHz}     unit="Hz" status={freqSk} decimals={2} />
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading eyebrow="24 h profile" title="Voltage envelope" caption={`±10 % band: ${formatValue(limitLo, { unit: 'V', decimals: 0 })} – ${formatValue(limitHi, { unit: 'V', decimals: 0 })}`} />
          <SampleBadge />
        </div>
        <LockedChart
          type="line"
          title="Voltage"
          unit="V"
          decimals={0}
          labels={hours}
          series={[
            { label: 'Measured',    data: profile },
            { label: 'Upper limit', data: hours.map(() => Math.round(limitHi)) },
            { label: 'Lower limit', data: hours.map(() => Math.round(limitLo)) },
          ]}
        />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionHeading eyebrow="Disturbances" title="Sag / swell tally" />
          <div className="space-y-3">
            <StatusBar
              label="Sags per day"
              value={pq.sagsPerDay}
              max={20}
              unit="events"
              thresholds={{ danger: 10, warning: 5, success: 2, invert: true }}
            />
            <StatusBar
              label="Swells per day"
              value={pq.swellsPerDay}
              max={20}
              unit="events"
              thresholds={{ danger: 10, warning: 5, success: 2, invert: true }}
            />
            <StatusBar
              label="Flicker (P_st short-term)"
              value={pq.flickerPst}
              max={3}
              unit=""
              thresholds={{ danger: 1.6, warning: 1.0, success: 0.6, invert: true }}
            />
          </div>
        </Card>

        <Card>
          <SectionHeading eyebrow="Findings" title="Recommendations" />
          <ul className="space-y-2">
            {recs.map((r, i) => {
              const p = statusPalette(r.sk);
              return (
                <li key={i} className="rounded-md border p-3" style={{ borderColor: p.border, background: p.bg }}>
                  <div className="text-sm font-semibold" style={{ color: p.fg }}>{r.title}</div>
                  <div className="text-xs text-ink-secondary">{r.detail}</div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <ProOnly note="Pro · standards & limits — switch to Pro mode to view.">
        <Card>
          <SectionHeading eyebrow="Pro · standards" title="Reference limits (selected)" />
          <ul className="grid gap-2 md:grid-cols-2 text-xs text-ink-secondary">
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>EN 50160: V ±10 % for 95 % of week, frequency ±1 % normal grid</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>IEEE 519: V-THD ≤ 5 % at PCC for &lt; 1 kV systems</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>IEC 61000-4-15: P_st ≤ 1.0 (long-term P_lt ≤ 0.8)</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>I-THD ≤ 12 % typical for general loads; ≤ 5 % for sensitive plant</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Sag/swell: ITIC curve defines equipment ride-through envelope</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Frequency excursion ≥ 1 Hz for &gt; 1 s = unstable grid</li>
          </ul>
        </Card>
      </ProOnly>

      <Card>
        <SectionHeading eyebrow="Use this with" title="Connected workflow" />
        <p className="text-sm text-ink-secondary">
          The same harmonics + voltage logic drives the cockpit{' '}
          <Link href="/hub/simulator" className="text-ink-link">Smart Sizing Simulator</Link>. Pair this dashboard with{' '}
          <Link href="/hub/diagnostics" className="text-ink-link">Diagnostics</Link>{' '}and{' '}
          <Link href="/hub/abuse" className="text-ink-link">Abuse Predictor</Link> when investigating premature failures.
        </p>
      </Card>

      <HubConnectStrip active="/hub/power-quality" />
    </div>
  );
}
