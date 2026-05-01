/**
 * Reusable, dependency-free widget primitives for service pages.
 * Pure SVG + Tailwind. Client component (interactive knob/dial).
 *
 * NEVER fabricate data — every numeric value passed in MUST be sourced from
 * an authoritative reference cited in the parent widget definition.
 */
'use client';

import { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface KnobZone {
  from: number;
  to: number;
  color: string; // tailwind class fragment e.g. "amber-500"
  label: string;
}

export interface KnobProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  initial: number;
  step?: number;
  zones: KnobZone[];
  description?: string;
  source?: string;
}

export interface BarDatum {
  label: string;
  value: number;
  limit?: number;
  unit: string;
  status?: 'pass' | 'warn' | 'fail';
  note?: string;
}

export interface BarChartProps {
  title: string;
  data: BarDatum[];
  source: string;
}

export interface LinePoint {
  x: number | string;
  y: number;
}

export interface LineChartProps {
  title: string;
  xLabel: string;
  yLabel: string;
  unit: string;
  series: { name: string; color: string; points: LinePoint[] }[];
  source: string;
}

export interface SpecRow {
  label: string;
  value: string;
  note?: string;
}

export interface SpecTableProps {
  title: string;
  rows: SpecRow[];
  source: string;
}

export interface DiagramHotspot {
  x: number; // %
  y: number; // %
  label: string;
  detail: string;
}

export interface DiagramProps {
  title: string;
  svg: React.ReactNode;
  hotspots: DiagramHotspot[];
  source: string;
}

/* ------------------------------------------------------------------ */
/*  Knob — interactive radial dial with zoned safety bands             */
/* ------------------------------------------------------------------ */

export function Knob({
  label,
  unit,
  min,
  max,
  initial,
  step = 1,
  zones,
  description,
  source,
}: KnobProps) {
  const [val, setVal] = useState(initial);
  const range = max - min;
  // 270° sweep, starting at 135° (bottom-left) ending at 405° (bottom-right)
  const startAngle = 135;
  const sweep = 270;
  const angle = startAngle + ((val - min) / range) * sweep;
  const cx = 110;
  const cy = 110;
  const r = 80;
  const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const px = cx + r * Math.cos(rad(angle));
  const py = cy + r * Math.sin(rad(angle));

  // Zone arcs
  const arcs = zones.map((z, i) => {
    const a1 = startAngle + ((z.from - min) / range) * sweep;
    const a2 = startAngle + ((z.to - min) / range) * sweep;
    const large = a2 - a1 > 180 ? 1 : 0;
    const x1 = cx + r * Math.cos(rad(a1));
    const y1 = cy + r * Math.sin(rad(a1));
    const x2 = cx + r * Math.cos(rad(a2));
    const y2 = cy + r * Math.sin(rad(a2));
    const stroke =
      z.color === 'emerald-500'
        ? '#10b981'
        : z.color === 'amber-500'
        ? '#f59e0b'
        : z.color === 'red-500'
        ? '#ef4444'
        : z.color === 'cyan-500'
        ? '#06b6d4'
        : '#64748b';
    return (
      <path
        key={i}
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
        stroke={stroke}
        strokeWidth={14}
        fill="none"
        strokeLinecap="round"
        opacity={0.7}
      />
    );
  });

  const currentZone = zones.find((z) => val >= z.from && val <= z.to);

  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h4 className="text-white font-bold text-base">{label}</h4>
        {currentZone && (
          <span
            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border ${
              currentZone.color === 'emerald-500'
                ? 'border-emerald-500/60 text-emerald-300 bg-emerald-500/10'
                : currentZone.color === 'amber-500'
                ? 'border-amber-500/60 text-amber-300 bg-amber-500/10'
                : currentZone.color === 'red-500'
                ? 'border-red-500/60 text-red-300 bg-red-500/10'
                : 'border-cyan-500/60 text-cyan-300 bg-cyan-500/10'
            }`}
          >
            {currentZone.label}
          </span>
        )}
      </div>
      <div className="flex items-center justify-center">
        <svg viewBox="0 0 220 220" className="w-full max-w-[220px]" role="img" aria-label={`${label} dial`}>
          {/* track */}
          <path
            d={`M ${cx + r * Math.cos(rad(startAngle))} ${cy + r * Math.sin(rad(startAngle))} A ${r} ${r} 0 1 1 ${cx + r * Math.cos(rad(startAngle + sweep))} ${cy + r * Math.sin(rad(startAngle + sweep))}`}
            stroke="#1e293b"
            strokeWidth={14}
            fill="none"
            strokeLinecap="round"
          />
          {arcs}
          {/* needle */}
          <line x1={cx} y1={cy} x2={px} y2={py} stroke="#f8fafc" strokeWidth={3} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={8} fill="#0f172a" stroke="#f8fafc" strokeWidth={2} />
          {/* readout */}
          <text x={cx} y={cy + 40} textAnchor="middle" fill="#f1f5f9" fontSize={28} fontWeight={700}>
            {val.toLocaleString()}
          </text>
          <text x={cx} y={cy + 58} textAnchor="middle" fill="#94a3b8" fontSize={11} fontWeight={600}>
            {unit}
          </text>
        </svg>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-full mt-3 accent-cyan-500"
        aria-label={`${label} slider`}
      />
      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
      {description && <p className="text-slate-400 text-xs mt-3 leading-relaxed">{description}</p>}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {zones.map((z, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                z.color === 'emerald-500'
                  ? 'bg-emerald-500'
                  : z.color === 'amber-500'
                  ? 'bg-amber-500'
                  : z.color === 'red-500'
                  ? 'bg-red-500'
                  : 'bg-cyan-500'
              }`}
            />
            <span className="font-semibold">{z.from}–{z.to} {unit}</span>
            <span className="text-slate-400">{z.label}</span>
          </div>
        ))}
      </div>
      {source && (
        <p className="text-[10px] text-slate-500 mt-3 italic">Source: {source}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  BarChart — values vs limits, colour-coded pass/warn/fail           */
/* ------------------------------------------------------------------ */

export function BarChart({ title, data, source }: BarChartProps) {
  const max = Math.max(...data.map((d) => Math.max(d.value, d.limit ?? 0))) * 1.15 || 1;
  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5">
      <h4 className="text-white font-bold text-base mb-4">{title}</h4>
      <div className="space-y-3">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          const limitPct = d.limit !== undefined ? (d.limit / max) * 100 : null;
          const color =
            d.status === 'pass'
              ? 'bg-emerald-500'
              : d.status === 'warn'
              ? 'bg-amber-500'
              : d.status === 'fail'
              ? 'bg-red-500'
              : 'bg-cyan-500';
          return (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-200 font-semibold">{d.label}</span>
                <span className="text-slate-300 font-mono">
                  {d.value} {d.unit}
                  {d.limit !== undefined && (
                    <span className="text-slate-500"> / limit {d.limit} {d.unit}</span>
                  )}
                </span>
              </div>
              <div className="relative h-5 bg-slate-800 rounded overflow-hidden">
                <div
                  className={`h-full ${color} transition-all`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
                {limitPct !== null && (
                  <div
                    className="absolute top-0 h-full w-0.5 bg-white/80"
                    style={{ left: `${Math.min(limitPct, 100)}%` }}
                    title={`Regulatory limit ${d.limit} ${d.unit}`}
                  />
                )}
              </div>
              {d.note && <p className="text-[11px] text-slate-400 mt-1">{d.note}</p>}
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-slate-500 mt-4 italic">Source: {source}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LineChart — multi-series with axes                                 */
/* ------------------------------------------------------------------ */

export function LineChart({ title, xLabel, yLabel, unit, series, source }: LineChartProps) {
  const allY = series.flatMap((s) => s.points.map((p) => p.y));
  const allX = series[0]?.points.map((p, i) => (typeof p.x === 'number' ? p.x : i)) ?? [];
  const minY = Math.min(...allY, 0);
  const maxY = Math.max(...allY) * 1.1 || 1;
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const W = 560;
  const H = 240;
  const padL = 50;
  const padB = 40;
  const padT = 20;
  const padR = 20;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const sx = (x: number) => padL + ((x - minX) / Math.max(maxX - minX, 1)) * innerW;
  const sy = (y: number) => padT + innerH - ((y - minY) / Math.max(maxY - minY, 1)) * innerH;

  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5">
      <h4 className="text-white font-bold text-base mb-3">{title}</h4>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[420px]" role="img" aria-label={title}>
          {/* grid + axes */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
            const y = padT + innerH * (1 - t);
            const v = (minY + (maxY - minY) * t).toFixed(0);
            return (
              <g key={i}>
                <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                <text x={padL - 8} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize={10}>
                  {v}
                </text>
              </g>
            );
          })}
          {series[0]?.points.map((p, i) => {
            const x = sx(typeof p.x === 'number' ? p.x : i);
            return (
              <text
                key={i}
                x={x}
                y={H - padB + 16}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize={10}
              >
                {p.x}
              </text>
            );
          })}
          <text x={W / 2} y={H - 4} textAnchor="middle" fill="#cbd5e1" fontSize={11} fontWeight={600}>
            {xLabel}
          </text>
          <text
            x={12}
            y={H / 2}
            transform={`rotate(-90 12 ${H / 2})`}
            textAnchor="middle"
            fill="#cbd5e1"
            fontSize={11}
            fontWeight={600}
          >
            {yLabel} ({unit})
          </text>
          {/* series */}
          {series.map((s, si) => {
            const d = s.points
              .map((p, i) => {
                const x = sx(typeof p.x === 'number' ? p.x : i);
                const y = sy(p.y);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ');
            return (
              <g key={si}>
                <path d={d} stroke={s.color} strokeWidth={2.5} fill="none" />
                {s.points.map((p, i) => (
                  <circle
                    key={i}
                    cx={sx(typeof p.x === 'number' ? p.x : i)}
                    cy={sy(p.y)}
                    r={3}
                    fill={s.color}
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap gap-3 mt-2">
        {series.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <span className="w-3 h-1 rounded" style={{ background: s.color }} />
            <span>{s.name}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-500 mt-3 italic">Source: {source}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SpecTable                                                          */
/* ------------------------------------------------------------------ */

export function SpecTable({ title, rows, source }: SpecTableProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5">
      <h4 className="text-white font-bold text-base mb-3">{title}</h4>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-slate-800 last:border-0">
              <td className="py-2 text-slate-400 align-top w-1/2">{r.label}</td>
              <td className="py-2 text-slate-100 font-mono font-semibold align-top">
                {r.value}
                {r.note && <span className="block text-[11px] text-slate-500 font-sans font-normal mt-0.5">{r.note}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-slate-500 mt-3 italic">Source: {source}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Diagram — SVG with hover hotspots                                  */
/* ------------------------------------------------------------------ */

export function Diagram({ title, svg, hotspots, source }: DiagramProps) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5">
      <h4 className="text-white font-bold text-base mb-3">{title}</h4>
      <div className="relative">
        <div className="rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
          {svg}
        </div>
        {hotspots.map((h, i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(active === i ? null : i)}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-cyan-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-lg hover:scale-110 transition-transform"
            aria-label={h.label}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {hotspots.map((h, i) => (
          <div
            key={i}
            className={`p-2.5 rounded-lg border text-xs transition-all ${
              active === i
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-slate-700 bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-5 h-5 rounded-full bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="font-semibold text-slate-100">{h.label}</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed pl-7">{h.detail}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-500 mt-3 italic">Source: {source}</p>
    </div>
  );
}
