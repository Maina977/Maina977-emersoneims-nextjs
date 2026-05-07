'use client';

import * as React from 'react';
import { CockpitPanel } from './CockpitPanel';
import { DigitalReadout } from './DigitalReadout';

/**
 * Power-quality / harmonics panel.
 *
 * Renders THD%, frequency deviation, voltage deviation, and load balance
 * across phases (synthetic but transparent — derived from input mix).
 *
 * Inputs are caller-provided; this component is purely presentational so the
 * cockpit can drive it from the sizing model without coupling.
 */
export interface PowerQuality {
  thdPct: number;          // Total harmonic distortion (current) %
  freqHz: number;          // Operating frequency (Hz)
  voltageDeviationPct: number; // % deviation from nominal
  phaseImbalancePct: number;   // 0..100, lower = better
  pf: number;              // operating power factor
}

const COLOR_OK = 'var(--lamp-ok)';
const COLOR_WARN = 'var(--lamp-warn)';
const COLOR_FAULT = 'var(--lamp-fault)';

export function HarmonicsPanel({ pq, nominalHz = 50 }: { pq: PowerQuality; nominalHz?: number }) {
  const thdState: 'ok' | 'warn' | 'fault' =
    pq.thdPct >= 8 ? 'fault' : pq.thdPct >= 5 ? 'warn' : 'ok';
  const freqDev = Math.abs(pq.freqHz - nominalHz);
  const freqState: 'ok' | 'warn' | 'fault' =
    freqDev >= 1.0 ? 'fault' : freqDev >= 0.5 ? 'warn' : 'ok';
  const vState: 'ok' | 'warn' | 'fault' =
    Math.abs(pq.voltageDeviationPct) >= 10 ? 'fault' : Math.abs(pq.voltageDeviationPct) >= 5 ? 'warn' : 'ok';
  const balanceState: 'ok' | 'warn' | 'fault' =
    pq.phaseImbalancePct >= 4 ? 'fault' : pq.phaseImbalancePct >= 2 ? 'warn' : 'ok';

  return (
    <CockpitPanel
      eyebrow="Power quality"
      title="Harmonics & line stability"
      right={
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: 'var(--cockpit-ink-muted)' }}
        >
          IEEE 519 reference
        </span>
      }
    >
      <div className="grid gap-3 md:grid-cols-4">
        <DigitalReadout
          label="THD-i"
          value={pq.thdPct}
          unit="%"
          decimals={1}
          status={thdState}
          caption={thdState === 'ok' ? '≤ 5 % nominal' : thdState === 'warn' ? '> 5 % — review filtering' : '> 8 % — install harmonic filter'}
        />
        <DigitalReadout
          label="Frequency"
          value={pq.freqHz}
          unit="Hz"
          decimals={2}
          status={freqState}
          caption={`Δ ${freqDev.toFixed(2)} Hz from ${nominalHz} Hz`}
        />
        <DigitalReadout
          label="Voltage Δ"
          value={pq.voltageDeviationPct}
          unit="%"
          decimals={1}
          status={vState}
          caption="vs. nominal line voltage"
        />
        <DigitalReadout
          label="Phase imbalance"
          value={pq.phaseImbalancePct}
          unit="%"
          decimals={1}
          status={balanceState}
          caption="Across L1 / L2 / L3"
        />
      </div>
      <div className="mt-3">
        <Mini3PhaseTrace pf={pq.pf} thdPct={pq.thdPct} />
      </div>
      <p className="mt-2 text-[11px]" style={{ color: 'var(--cockpit-ink-unit)' }}>
        Synthetic estimate from sizing inputs. Real measurements require an installed power-quality analyser.
      </p>
    </CockpitPanel>
  );
}

/** Compact stylised 3-phase oscilloscope trace (purely decorative + indicative). */
function Mini3PhaseTrace({ pf, thdPct }: { pf: number; thdPct: number }) {
  const W = 600;
  const H = 70;
  const N = 120;
  const distortion = Math.min(0.35, thdPct / 30);
  const phaseShift = Math.acos(Math.max(0.5, Math.min(1, pf)));
  const series = (offset: number) =>
    Array.from({ length: N }, (_, i) => {
      const x = (i / (N - 1)) * W;
      const t = (i / (N - 1)) * Math.PI * 4 + offset;
      // primary 50 Hz + 5th harmonic injection scaled by THD
      const y = Math.sin(t + phaseShift) + distortion * Math.sin(5 * t);
      return { x, y };
    });
  const toPath = (pts: Array<{ x: number; y: number }>) => {
    const mid = H / 2;
    const amp = H * 0.35;
    return pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${(mid - p.y * amp).toFixed(1)}`)
      .join(' ');
  };
  const phases = [
    { c: 'var(--lamp-info)',  off: 0 },
    { c: 'var(--cockpit-trace-active)', off: (2 * Math.PI) / 3 },
    { c: 'var(--lamp-warn)',  off: (4 * Math.PI) / 3 },
  ];
  return (
    <div
      className="relative overflow-hidden rounded-md border"
      style={{ borderColor: 'var(--cockpit-rail)', background: 'rgba(0,0,0,0.25)' }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-[70px] w-full">
        <defs>
          <pattern id="cockpit-grid" width="20" height="14" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 14" fill="none" stroke="var(--cockpit-grid)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#cockpit-grid)" />
        <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="var(--cockpit-rail)" strokeDasharray="2 4" />
        {phases.map((p) => (
          <path
            key={p.off}
            d={toPath(series(p.off))}
            fill="none"
            stroke={p.c}
            strokeWidth={1.4}
            opacity={0.85}
            style={{ filter: `drop-shadow(0 0 2px ${p.c})` }}
          />
        ))}
      </svg>
      <div
        className="absolute right-2 top-1.5 text-[9px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: 'var(--cockpit-ink-unit)' }}
      >
        L1 · L2 · L3
      </div>
    </div>
  );
}
