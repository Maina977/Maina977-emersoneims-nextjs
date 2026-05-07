'use client';

import * as React from 'react';

/**
 * UpsTopologyBoard — live SVG one-line schematic for a UPS system.
 *
 * Mirrors the cockpit family used in TopologyBoard but is purpose-built for
 * UPS topology: mains → input switch → rectifier → DC bus + battery →
 * inverter → static bypass → output bus → loads. The board is fully
 * driven by the parent UpsLabClient (number of UPS units, total capacity,
 * current load, mains state, battery autonomy, alarms) and updates the
 * traces and lamps as those inputs change.
 *
 * The diagram is synthetic — it renders a representative architecture and
 * is labelled as such with the cockpit "synthetic" badge. The math behind
 * inputW/outputW/runtime is owned by UpsLabClient and passed in via props.
 */

export interface UpsTopologyState {
  /** Mains breaker / utility input present and live. */
  mainsPresent: boolean;
  /** UPS units selected on the lab (>=1 means UPS path is in service). */
  upsCount: number;
  /** UPS aggregated capacity in kW (kVA × pf). */
  upsCapacityKw: number;
  /** Continuous load demand in kW. */
  loadKw: number;
  /** Real input power drawn from mains in kW. 0 = on battery. */
  inputKw: number;
  /** Real output power delivered to load in kW. */
  outputKw: number;
  /** Battery stored energy in kWh (whole cluster). */
  batteryKwh: number;
  /** Estimated runtime at present load in minutes (Infinity allowed). */
  runtimeMin: number;
  /** Surge / overload condition. */
  overloaded: boolean;
  /** Continuous load > 85 % of capacity. */
  highLoad: boolean;
  /** Predominant topology in the cluster (informational). */
  topologyLabel?: string;
}

const W = 880;
const H = 360;

export function UpsTopologyBoard({ state }: { state: UpsTopologyState }) {
  const {
    mainsPresent, upsCount, upsCapacityKw, loadKw, inputKw, outputKw,
    batteryKwh, runtimeMin, overloaded, highLoad, topologyLabel,
  } = state;

  const onBattery = !mainsPresent && batteryKwh > 0 && upsCount > 0;
  const upsLive = upsCount > 0 && (mainsPresent || onBattery);
  const dcBusActive = upsLive;
  const inverterActive = upsLive && outputKw > 0;
  const rectifierActive = upsLive && mainsPresent;
  const staticBypassEngaged = upsCount > 0 && overloaded; // representative: bypass on overload
  const outputActive = inverterActive || (mainsPresent && upsCount === 0);
  const loadActive = outputKw > 0 && loadKw > 0;
  const noUps = upsCount === 0;
  const noLoad = loadKw === 0;

  const inputArrow = mainsPresent && inputKw > 0;
  const dcArrow = (rectifierActive || onBattery) && inverterActive;
  const outputArrow = outputActive && loadActive;

  return (
    <div className="space-y-3">
      <div
        className="relative overflow-hidden rounded-lg border"
        style={{
          borderColor: 'var(--cockpit-rail, rgba(140,170,220,0.25))',
          background:
            'radial-gradient(120% 100% at 50% 0%, rgba(60,90,160,0.10) 0%, transparent 50%), var(--cockpit-bg, #0c1426)',
        }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="block h-auto w-full"
          role="img"
          aria-label="UPS one-line schematic"
        >
          <defs>
            <pattern id="ups-topo-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--cockpit-grid, rgba(140,170,220,0.10))" strokeWidth="1" />
            </pattern>
            <style>{`
              @keyframes ups-flow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -24; } }
              .ups-flow-active { animation: ups-flow 1.4s linear infinite; }
              @media (prefers-reduced-motion: reduce) { .ups-flow-active { animation: none; } }
            `}</style>
          </defs>
          <rect width={W} height={H} fill="url(#ups-topo-grid)" />

          {/* Bus lines */}
          {/* AC input bus */}
          <UpsTrace path={`M 200 100 L 260 100`} active={inputArrow} flow={inputArrow} />
          {/* AC bypass bus (around the rectifier+inverter) */}
          <UpsTrace path={`M 200 100 L 200 220 L 700 220 L 700 270`} active={staticBypassEngaged} flow={staticBypassEngaged} dashed />
          {/* Input switch → rectifier */}
          <UpsTrace path={`M 320 100 L 380 100`} active={rectifierActive} flow={rectifierActive} />
          {/* Rectifier → DC bus */}
          <UpsTrace path={`M 440 100 L 500 100 L 500 170`} active={rectifierActive} flow={rectifierActive} />
          {/* Battery → DC bus */}
          <UpsTrace path={`M 200 240 L 280 240 L 280 170 L 500 170`} active={onBattery || (rectifierActive && batteryKwh > 0)} flow={onBattery} />
          {/* DC bus → Inverter */}
          <UpsTrace path={`M 500 170 L 580 170`} active={dcBusActive && inverterActive} flow={dcArrow} label="DC bus" labelX={540} labelY={160} />
          {/* Inverter → Output bus */}
          <UpsTrace path={`M 640 170 L 700 170 L 700 270`} active={inverterActive} flow={inverterActive && outputArrow} />
          {/* Output bus → Load */}
          <UpsTrace path={`M 700 270 L 800 270`} active={outputArrow} flow={outputArrow} label="AC output" labelX={750} labelY={258} />

          {/* Nodes */}
          <UpsNode x={130} y={70}  glyph="grid"      label="Mains"         caption={mainsPresent ? `${inputKw.toFixed(2)} kW` : 'down'}     state={mainsPresent ? 'info' : 'fault'} />
          <UpsNode x={260} y={70}  glyph="breaker"   label="Input switch"  caption={mainsPresent ? 'closed' : 'open'}                       state={mainsPresent ? 'ok' : 'off'} />
          <UpsNode x={380} y={70}  glyph="rectifier" label="Rectifier"     caption={rectifierActive ? 'AC→DC' : 'idle'}                     state={rectifierActive ? 'ok' : 'off'} />
          <UpsNode x={130} y={210} glyph="battery"   label="Battery bank"  caption={`${batteryKwh.toFixed(1)} kWh`}                          state={batteryKwh > 0 ? (onBattery ? 'info' : 'ok') : 'off'} />
          <UpsNode x={460} y={140} glyph="bus"       label="DC bus"        caption={dcBusActive ? 'energised' : 'inactive'}                  state={dcBusActive ? 'info' : 'off'} small />
          <UpsNode x={580} y={140} glyph="inverter"  label={`Inverter ×${upsCount}`} caption={inverterActive ? 'DC→AC' : 'idle'}             state={noUps ? 'fault' : inverterActive ? 'ok' : 'off'} />
          <UpsNode x={660} y={240} glyph="bypass"    label="Static bypass" caption={staticBypassEngaged ? 'engaged' : 'standby'}             state={staticBypassEngaged ? 'warn' : 'off'} small />
          <UpsNode x={800} y={240} glyph="load"      label="Critical load" caption={`${loadKw.toFixed(2)} kW`}                                state={overloaded ? 'fault' : highLoad ? 'warn' : noLoad ? 'off' : 'ok'} />

          {/* Header banner */}
          <text x={20} y={24} fill="var(--cockpit-ink-unit, #8a9bb8)" fontSize="11" fontFamily="ui-monospace, monospace" style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            UPS one-line · {topologyLabel ?? 'Online double-conversion'}
          </text>
          <text x={W - 20} y={24} fill="var(--cockpit-ink-unit, #8a9bb8)" fontSize="11" fontFamily="ui-monospace, monospace" textAnchor="end" style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            {onBattery ? 'On battery' : mainsPresent ? 'On mains' : 'No supply'}
          </text>

          {/* Live annotations on traces */}
          {inputArrow && (
            <text x={230} y={92} fill="var(--lamp-info, #4cd2ee)" fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="middle">
              {inputKw.toFixed(2)} kW
            </text>
          )}
          {outputArrow && (
            <text x={750} y={262} fill="var(--lamp-ok, #34c759)" fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="middle">
              {outputKw.toFixed(2)} kW
            </text>
          )}
          {(onBattery || (rectifierActive && batteryKwh > 0)) && (
            <text x={290} y={196} fill="var(--lamp-info, #4cd2ee)" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle">
              {Number.isFinite(runtimeMin) ? `${runtimeMin.toFixed(0)} min` : '—'}
            </text>
          )}

          {/* Capacity headroom band */}
          <text x={W - 20} y={H - 14} fill="var(--cockpit-ink-unit, #8a9bb8)" fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="end" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Capacity {upsCapacityKw.toFixed(1)} kW · load {loadKw.toFixed(1)} kW
          </text>
        </svg>

        <div
          className="absolute right-3 top-3 text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: 'var(--cockpit-ink-unit, #8a9bb8)' }}
        >
          Synthetic schematic
        </div>
      </div>
    </div>
  );
}

/* ────────── primitives ────────── */

function UpsTrace({ path, active, flow, dashed, label, labelX, labelY }: {
  path: string;
  active?: boolean;
  flow?: boolean;
  dashed?: boolean;
  label?: string;
  labelX?: number;
  labelY?: number;
}) {
  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={active ? 'var(--cockpit-trace-active, #4cd2ee)' : 'var(--cockpit-trace, rgba(140,170,220,0.4))'}
        strokeOpacity={active ? 0.95 : 0.35}
        strokeWidth={active ? 2 : 1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? '6 4' : flow ? '8 4' : undefined}
        className={flow ? 'ups-flow-active' : undefined}
        style={active ? { filter: 'drop-shadow(0 0 3px var(--cockpit-trace-active, #4cd2ee))' } : undefined}
      />
      {label != null && labelX != null && labelY != null ? (
        <text
          x={labelX}
          y={labelY}
          fill="var(--cockpit-ink-unit, #8a9bb8)"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
          textAnchor="middle"
          style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

interface UpsNodeProps {
  x: number;
  y: number;
  label: string;
  caption?: string;
  glyph: 'grid' | 'breaker' | 'rectifier' | 'battery' | 'bus' | 'inverter' | 'bypass' | 'load';
  state?: 'ok' | 'warn' | 'fault' | 'off' | 'info';
  small?: boolean;
}

function UpsNode({ x, y, label, caption, glyph, state = 'ok', small }: UpsNodeProps) {
  const lampColor =
    state === 'ok' ? 'var(--lamp-ok, #34c759)' :
    state === 'warn' ? 'var(--lamp-warn, #ffd60a)' :
    state === 'fault' ? 'var(--lamp-fault, #ff453a)' :
    state === 'info' ? 'var(--lamp-info, #4cd2ee)' :
    'var(--lamp-off, #4a5d7d)';
  const w = small ? 80 : 100;
  const h = small ? 50 : 60;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect
        x={0} y={0} width={w} height={h} rx={6}
        fill="var(--cockpit-panel-raised, rgba(20,30,52,0.85))"
        stroke={state === 'off' ? 'var(--cockpit-edge, rgba(140,170,220,0.25))' : 'var(--cockpit-trace-active, #4cd2ee)'}
        strokeWidth={state === 'off' ? 1 : 1.4}
        style={state !== 'off' && state !== 'ok' ? { filter: `drop-shadow(0 0 4px ${lampColor})` } : undefined}
      />
      <g transform="translate(8,8)">
        <UpsNodeGlyph glyph={glyph} />
      </g>
      <circle cx={w - 8} cy={8} r={3.5} fill={lampColor}
        style={state !== 'off' ? { filter: `drop-shadow(0 0 3px ${lampColor})` } : undefined} />
      <text x={32} y={20} fontSize="9" fill="var(--cockpit-ink, #d0d8e8)"
        fontFamily="Inter, system-ui, sans-serif" fontWeight={600}
        style={{ letterSpacing: '0.06em' }}>
        {label}
      </text>
      {caption != null ? (
        <text x={32} y={small ? 34 : 36} fontSize="10" fill="var(--cockpit-ink-unit, #8a9bb8)"
          fontFamily="ui-monospace, monospace">
          {caption}
        </text>
      ) : null}
      <text x={32} y={h - 6} fontSize="8" fill="var(--cockpit-ink-unit, #8a9bb8)"
        fontFamily="ui-monospace, monospace"
        style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        {state}
      </text>
    </g>
  );
}

function UpsNodeGlyph({ glyph }: { glyph: UpsNodeProps['glyph'] }) {
  const stroke = 'var(--cockpit-trace-active, #4cd2ee)';
  switch (glyph) {
    case 'grid':
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.4}>
          <path d="M 10 1 L 4 8 L 16 8 Z" />
          <path d="M 10 8 L 6 16 M 10 8 L 14 16" />
        </g>
      );
    case 'breaker':
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.4}>
          <line x1={2} y1={10} x2={8} y2={10} />
          <line x1={8} y1={10} x2={14} y2={4} />
          <line x1={14} y1={10} x2={18} y2={10} />
          <circle cx={8} cy={10} r={1.2} fill={stroke} />
          <circle cx={14} cy={10} r={1.2} fill={stroke} />
        </g>
      );
    case 'rectifier':
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.4}>
          <rect x={0} y={2} width={20} height={14} rx={2} />
          <text x={10} y={13} fontSize="8" textAnchor="middle" fill={stroke} fontFamily="ui-monospace, monospace">~/=</text>
        </g>
      );
    case 'battery':
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.4}>
          <rect x={1} y={4} width={16} height={10} rx={1} />
          <rect x={17} y={7} width={2} height={4} fill={stroke} />
          <line x1={5} y1={7} x2={5} y2={11} />
          <line x1={9} y1={7} x2={9} y2={11} />
          <line x1={13} y1={7} x2={13} y2={11} />
        </g>
      );
    case 'bus':
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.6}>
          <line x1={0} y1={9} x2={20} y2={9} />
          <circle cx={4} cy={9} r={1.4} fill={stroke} />
          <circle cx={16} cy={9} r={1.4} fill={stroke} />
        </g>
      );
    case 'inverter':
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.4}>
          <rect x={0} y={2} width={20} height={14} rx={2} />
          <text x={10} y={13} fontSize="8" textAnchor="middle" fill={stroke} fontFamily="ui-monospace, monospace">=/~</text>
        </g>
      );
    case 'bypass':
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.4}>
          <path d="M 1 14 Q 10 -2 19 14" />
          <line x1={1} y1={14} x2={19} y2={14} />
        </g>
      );
    case 'load':
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.4}>
          <rect x={2} y={4} width={16} height={10} rx={1} />
          <line x1={5} y1={7} x2={15} y2={7} />
          <line x1={5} y1={11} x2={15} y2={11} />
        </g>
      );
    default:
      return null;
  }
}
