// ═══════════════════════════════════════════════════════════════════════════════
// EngineeringDeepDive — reusable, SEO-first technical content primitives
//
// These are intentionally SERVER components (no 'use client'). They render to
// static HTML so the full text, formulas, tables and chart labels appear in the
// initial server response that crawlers read — the opposite of the WebGL/
// animation sections which only resolve after hydration. Use them to append
// long-form, reference-grade engineering content to any page.
//
// Composition pattern:
//   <DeepDiveSection eyebrow="…" title="…" intro="…" accent="amber" sources={[…]}>
//     <DeepDiveBlock heading="…">…paragraphs…</DeepDiveBlock>
//     <FormulaBlock … />
//     <SpecTable … />
//     <DataChart … />
//   </DeepDiveSection>
// ═══════════════════════════════════════════════════════════════════════════════

import type { ReactNode } from 'react';

// ── Accent presets ───────────────────────────────────────────────────────────
// Tailwind's JIT needs literal class strings, so each accent is a fixed map.
type Accent = 'amber' | 'emerald' | 'cyan' | 'violet' | 'rose' | 'sky';

interface AccentTokens {
  text: string;
  textSoft: string;
  border: string;
  ring: string;
  gradient: string; // text gradient for headings
  chip: string;
  stroke: string; // hex for SVG charts
  fill: string; // rgba for SVG fills
  grid: string; // hex for chart gridlines
}

const ACCENTS: Record<Accent, AccentTokens> = {
  amber: {
    text: 'text-amber-400', textSoft: 'text-amber-300/80', border: 'border-amber-500/30',
    ring: 'ring-amber-500/20', gradient: 'from-amber-400 via-orange-400 to-amber-400',
    chip: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    stroke: '#fbbf24', fill: 'rgba(251,191,36,0.15)', grid: '#3f3f46',
  },
  emerald: {
    text: 'text-emerald-400', textSoft: 'text-emerald-300/80', border: 'border-emerald-500/30',
    ring: 'ring-emerald-500/20', gradient: 'from-emerald-400 via-green-400 to-emerald-400',
    chip: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    stroke: '#34d399', fill: 'rgba(52,211,153,0.15)', grid: '#3f3f46',
  },
  cyan: {
    text: 'text-cyan-400', textSoft: 'text-cyan-300/80', border: 'border-cyan-500/30',
    ring: 'ring-cyan-500/20', gradient: 'from-cyan-400 via-sky-400 to-cyan-400',
    chip: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    stroke: '#22d3ee', fill: 'rgba(34,211,238,0.15)', grid: '#3f3f46',
  },
  violet: {
    text: 'text-violet-400', textSoft: 'text-violet-300/80', border: 'border-violet-500/30',
    ring: 'ring-violet-500/20', gradient: 'from-violet-400 via-purple-400 to-violet-400',
    chip: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
    stroke: '#a78bfa', fill: 'rgba(167,139,250,0.15)', grid: '#3f3f46',
  },
  rose: {
    text: 'text-rose-400', textSoft: 'text-rose-300/80', border: 'border-rose-500/30',
    ring: 'ring-rose-500/20', gradient: 'from-rose-400 via-pink-400 to-rose-400',
    chip: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    stroke: '#fb7185', fill: 'rgba(251,113,133,0.15)', grid: '#3f3f46',
  },
  sky: {
    text: 'text-sky-400', textSoft: 'text-sky-300/80', border: 'border-sky-500/30',
    ring: 'ring-sky-500/20', gradient: 'from-sky-400 via-blue-400 to-sky-400',
    chip: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    stroke: '#38bdf8', fill: 'rgba(56,189,248,0.15)', grid: '#3f3f46',
  },
};

function accentOf(a: Accent = 'amber') { return ACCENTS[a] ?? ACCENTS.amber; }

// ── Section wrapper ───────────────────────────────────────────────────────────
export interface DeepDiveSectionProps {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  accent?: Accent;
  /** Plain-text reference list shown at the foot — signals editorial rigour. */
  sources?: string[];
  id?: string;
  children: ReactNode;
}

export function DeepDiveSection({ eyebrow, title, intro, accent = 'amber', sources, id, children }: DeepDiveSectionProps) {
  const t = accentOf(accent);
  return (
    <section id={id} className="py-20 bg-gradient-to-b from-black via-slate-950 to-black border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-12">
          {eyebrow && (
            <p className={`text-xs font-semibold tracking-[0.25em] uppercase mb-3 ${t.text}`}>{eyebrow}</p>
          )}
          <h2 className={`text-3xl md:text-4xl font-bold mb-5 bg-gradient-to-r ${t.gradient} bg-clip-text text-transparent`}>
            {title}
          </h2>
          {intro && <p className="text-lg text-white/70 leading-relaxed max-w-3xl">{intro}</p>}
        </header>

        <div className="space-y-12">{children}</div>

        {sources && sources.length > 0 && (
          <footer className="mt-14 pt-6 border-t border-white/10">
            <p className="text-xs font-semibold tracking-wider uppercase text-white/40 mb-2">References &amp; standards</p>
            <ul className="text-sm text-white/45 space-y-1 list-disc pl-5">
              {sources.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </footer>
        )}
      </div>
    </section>
  );
}

// ── Prose block ───────────────────────────────────────────────────────────────
export function DeepDiveBlock({ heading, accent = 'amber', children }: { heading?: string; accent?: Accent; children: ReactNode }) {
  const t = accentOf(accent);
  return (
    <article className="prose-invert max-w-none">
      {heading && <h3 className={`text-xl md:text-2xl font-semibold mb-4 ${t.text}`}>{heading}</h3>}
      <div className="space-y-4 text-white/75 leading-relaxed text-[15px] md:text-base [&_strong]:text-white [&_strong]:font-semibold">
        {children}
      </div>
    </article>
  );
}

// ── Formula block ─────────────────────────────────────────────────────────────
export interface FormulaBlockProps {
  label?: string;
  /** The equation, written for legibility, e.g. "kVA = kW ÷ PF". */
  expression: string;
  /** Variable definitions: [symbol, meaning]. */
  where?: [string, string][];
  /** Optional worked example string. */
  example?: ReactNode;
  accent?: Accent;
}

export function FormulaBlock({ label, expression, where, example, accent = 'amber' }: FormulaBlockProps) {
  const t = accentOf(accent);
  return (
    <div className={`rounded-2xl border ${t.border} bg-white/[0.03] p-6 ring-1 ${t.ring}`}>
      {label && <p className={`text-xs font-semibold tracking-wider uppercase mb-3 ${t.textSoft}`}>{label}</p>}
      <p className="font-mono text-lg md:text-2xl text-white text-center py-3 select-text">{expression}</p>
      {where && where.length > 0 && (
        <dl className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
          {where.map(([sym, def], i) => (
            <div key={i} className="flex gap-2">
              <dt className={`font-mono font-semibold shrink-0 ${t.text}`}>{sym}</dt>
              <dd className="text-white/60">= {def}</dd>
            </div>
          ))}
        </dl>
      )}
      {example && (
        <div className="mt-4 pt-4 border-t border-white/10 text-sm text-white/70">
          <span className={`font-semibold ${t.textSoft}`}>Worked example — </span>{example}
        </div>
      )}
    </div>
  );
}

// ── Spec / data table ─────────────────────────────────────────────────────────
export interface SpecTableProps {
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
  /** Index of a column to emphasise (0-based), optional. */
  highlightCol?: number;
  accent?: Accent;
}

export function SpecTable({ caption, headers, rows, highlightCol, accent = 'amber' }: SpecTableProps) {
  const t = accentOf(accent);
  return (
    <figure className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
      {caption && (
        <figcaption className={`px-5 pt-4 pb-2 text-sm font-semibold ${t.textSoft}`}>{caption}</figcaption>
      )}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            {headers.map((h, i) => (
              <th key={i} className={`text-left font-semibold px-5 py-3 ${i === highlightCol ? t.text : 'text-white/80'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
              {r.map((cell, ci) => (
                <td key={ci} className={`px-5 py-3 align-top ${ci === highlightCol ? `font-semibold ${t.text}` : 'text-white/65'}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

// ── Callout ───────────────────────────────────────────────────────────────────
export function Callout({ title, accent = 'amber', children }: { title?: string; accent?: Accent; children: ReactNode }) {
  const t = accentOf(accent);
  return (
    <aside className={`rounded-xl border-l-4 ${t.border} border-l-current ${t.text} bg-white/[0.03] p-5`}>
      {title && <p className="font-semibold mb-1">{title}</p>}
      <div className="text-white/70 text-sm leading-relaxed [&_strong]:text-white">{children}</div>
    </aside>
  );
}

// ── DataChart — pure-SVG line or bar chart (server-rendered, no JS) ─────────────
export interface ChartPoint { x: number | string; y: number; }
export interface DataChartProps {
  kind: 'line' | 'bar';
  title?: string;
  data: ChartPoint[];
  xLabel?: string;
  yLabel?: string;
  /** Format a y value for the axis/labels. */
  unit?: string;
  accent?: Accent;
}

export function DataChart({ kind, title, data, xLabel, yLabel, unit = '', accent = 'amber' }: DataChartProps) {
  const t = accentOf(accent);
  const W = 720, H = 320;
  const padL = 56, padR = 20, padT = 20, padB = 48;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const ys = data.map(d => d.y);
  const yMax = Math.max(...ys, 0);
  const yMin = Math.min(...ys, 0);
  const yRange = yMax - yMin || 1;
  // round the axis top up to a "nice" number
  const niceMax = yMax <= 0 ? 1 : Math.ceil(yMax / Math.pow(10, Math.floor(Math.log10(yMax)))) * Math.pow(10, Math.floor(Math.log10(yMax)));
  const axisMax = niceMax >= yMax ? niceMax : yMax;

  const xAt = (i: number) => padL + (data.length <= 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
  const yAt = (v: number) => padT + plotH - ((v - Math.min(0, yMin)) / (axisMax - Math.min(0, yMin) || 1)) * plotH;

  const gridLines = 4;

  return (
    <figure className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      {title && <figcaption className={`text-sm font-semibold mb-3 ${t.textSoft}`}>{title}</figcaption>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={title || 'chart'}>
        {/* gridlines + y labels */}
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const val = (axisMax / gridLines) * i;
          const y = yAt(val);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke={t.grid} strokeWidth={1} opacity={0.5} />
              <text x={padL - 8} y={y + 4} textAnchor="end" fontSize={11} fill="#9ca3af">
                {Math.round(val)}{unit}
              </text>
            </g>
          );
        })}

        {/* bars */}
        {kind === 'bar' && data.map((d, i) => {
          const bw = (plotW / data.length) * 0.6;
          const cx = xAt(i);
          const y = yAt(d.y);
          return <rect key={i} x={cx - bw / 2} y={y} width={bw} height={padT + plotH - y} fill={t.stroke} opacity={0.85} rx={3} />;
        })}

        {/* line + area */}
        {kind === 'line' && (
          <>
            <polygon
              points={`${xAt(0)},${padT + plotH} ${data.map((d, i) => `${xAt(i)},${yAt(d.y)}`).join(' ')} ${xAt(data.length - 1)},${padT + plotH}`}
              fill={t.fill}
            />
            <polyline
              points={data.map((d, i) => `${xAt(i)},${yAt(d.y)}`).join(' ')}
              fill="none" stroke={t.stroke} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"
            />
            {data.map((d, i) => <circle key={i} cx={xAt(i)} cy={yAt(d.y)} r={3.5} fill={t.stroke} />)}
          </>
        )}

        {/* x labels */}
        {data.map((d, i) => (
          <text key={i} x={xAt(i)} y={H - padB + 18} textAnchor="middle" fontSize={11} fill="#9ca3af">{d.x}</text>
        ))}

        {/* axis titles */}
        {xLabel && <text x={padL + plotW / 2} y={H - 6} textAnchor="middle" fontSize={12} fill="#cbd5e1">{xLabel}</text>}
        {yLabel && (
          <text x={16} y={padT + plotH / 2} textAnchor="middle" fontSize={12} fill="#cbd5e1" transform={`rotate(-90 16 ${padT + plotH / 2})`}>{yLabel}</text>
        )}
      </svg>
    </figure>
  );
}
