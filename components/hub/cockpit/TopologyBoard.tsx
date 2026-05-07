'use client';

import * as React from 'react';

/**
 * Topology composition controlled by SimulatorClient — counts per component
 * type that drive both the visual schematic AND the underlying sizing model.
 */
export interface TopologyComposition {
  solarPanels: number;     // 0..40, each = ~0.55 kW peak (synthetic default)
  batteries: number;       // 0..8, each = ~5 kWh
  inverters: number;       // 0..4
  ups: number;             // 0..2
  generators: number;      // 0..2
  gridConnected: boolean;  // true = grid feed available
}

export const TOPOLOGY_DEFAULTS: TopologyComposition = {
  solarPanels: 12,
  batteries: 4,
  inverters: 1,
  ups: 1,
  generators: 1,
  gridConnected: true,
};

export const TOPOLOGY_LIMITS: Record<keyof Omit<TopologyComposition, 'gridConnected'>, { min: number; max: number; perUnitLabel: string }> = {
  solarPanels: { min: 0, max: 40, perUnitLabel: '0.55 kW each' },
  batteries:   { min: 0, max: 8,  perUnitLabel: '5 kWh each' },
  inverters:   { min: 0, max: 4,  perUnitLabel: 'parallel string' },
  ups:         { min: 0, max: 2,  perUnitLabel: 'parallel UPS' },
  generators:  { min: 0, max: 2,  perUnitLabel: 'N+1 redundancy' },
};

interface NodeProps {
  x: number;
  y: number;
  label: string;
  count?: number;
  glyph: 'solar' | 'inverter' | 'battery' | 'ups' | 'generator' | 'grid' | 'load' | 'bus';
  state?: 'ok' | 'warn' | 'fault' | 'off' | 'info';
  onAdd?: () => void;
  onRemove?: () => void;
  active?: boolean;
}

const W = 760;
const H = 420;

/**
 * Visual one-line schematic of the simulated power system.
 * Components are SVG-rendered nodes connected via straight orthogonal traces.
 * Adding/removing components updates the composition state via callbacks
 * supplied by the parent simulator.
 */
export function TopologyBoard({
  composition,
  onChange,
  flow,
  liveAnnotations,
}: {
  composition: TopologyComposition;
  onChange: (next: TopologyComposition) => void;
  /** Live operational flags driven by sizing logic (for visual state). */
  flow: {
    sourceMode: 'grid' | 'generator' | 'battery';
    overload: boolean;
    lowBattery: boolean;
    solarActive: boolean;
  };
  /**
   * Optional live numeric annotations rendered on the schematic. When the
   * parent simulator passes live operating numbers (kW, A, V, % SoC) the
   * traces and nodes display them in real time so the board behaves as a
   * working engineering schematic, not just a topology illustration.
   */
  liveAnnotations?: {
    /** kW currently flowing on the AC bus to the load. */
    loadKw?: number;
    /** A on the main feeder (line current). */
    lineA?: number;
    /** V on the main feeder. */
    lineV?: number;
    /** Battery state of charge in %. */
    socPct?: number;
    /** Battery → load runtime in minutes (when on battery / inverter). */
    runtimeMin?: number;
    /** Solar peak generation in kW for the array. */
    solarKw?: number;
  };
}) {
  const inc = (k: keyof Omit<TopologyComposition, 'gridConnected'>) => () => {
    const lim = TOPOLOGY_LIMITS[k];
    onChange({ ...composition, [k]: Math.min(lim.max, composition[k] + 1) });
  };
  const dec = (k: keyof Omit<TopologyComposition, 'gridConnected'>) => () => {
    const lim = TOPOLOGY_LIMITS[k];
    onChange({ ...composition, [k]: Math.max(lim.min, composition[k] - 1) });
  };
  const toggleGrid = () => onChange({ ...composition, gridConnected: !composition.gridConnected });

  // Trace activity flags
  const gridActive = composition.gridConnected && flow.sourceMode === 'grid';
  const genActive = composition.generators > 0 && flow.sourceMode === 'generator';
  const batteryActive = composition.batteries > 0 && (flow.sourceMode === 'battery' || flow.lowBattery);
  const solarActive = composition.solarPanels > 0 && flow.solarActive;
  const upsActive = composition.ups > 0;

  return (
    <div className="space-y-3">
      <div
        className="relative overflow-hidden rounded-lg border"
        style={{
          borderColor: 'var(--cockpit-rail)',
          background:
            'radial-gradient(120% 100% at 50% 0%, rgba(60,90,160,0.10) 0%, transparent 50%), var(--cockpit-bg)',
        }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="block h-auto w-full"
          role="img"
          aria-label="System topology schematic"
        >
          <defs>
            <pattern id="topo-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--cockpit-grid)" strokeWidth="1" />
            </pattern>
            <linearGradient id="bus-gradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="var(--cockpit-trace)" stopOpacity="0.2" />
              <stop offset="50%" stopColor="var(--cockpit-trace-active)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--cockpit-trace)" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill="url(#topo-grid)" />

          {/* Main DC bus + AC bus */}
          <Trace path={`M 200 130 L 540 130`} active={solarActive || batteryActive} label="DC bus" labelX={370} labelY={120} />
          <Trace path={`M 200 290 L 600 290`} active={gridActive || genActive || upsActive} label="AC bus" labelX={400} labelY={280} />

          {/* Solar → DC bus */}
          <Trace path={`M 90 90 L 200 90 L 200 130`} active={solarActive} />
          {/* Battery → DC bus */}
          <Trace path={`M 90 170 L 200 170 L 200 130`} active={batteryActive} />
          {/* DC bus → Inverter */}
          <Trace path={`M 380 130 L 380 220`} active={solarActive || batteryActive} />
          {/* Inverter → AC bus */}
          <Trace path={`M 380 260 L 380 290`} active={solarActive || batteryActive} />
          {/* Grid → AC bus */}
          <Trace path={`M 90 250 L 200 250 L 200 290`} active={gridActive} />
          {/* Generator → AC bus */}
          <Trace path={`M 90 330 L 200 330 L 200 290`} active={genActive} />
          {/* AC bus → UPS → Load */}
          <Trace path={`M 540 290 L 540 360 L 600 360`} active={upsActive || gridActive || genActive} />
          {/* UPS direct DC tap (battery → UPS bypass) */}
          <Trace path={`M 90 170 L 130 170 L 130 360 L 540 360`} active={batteryActive && upsActive} dashed />

          {/* Nodes */}
          <Node x={45} y={70}  glyph="solar"     label="Solar array"  count={composition.solarPanels} active={solarActive} state={solarActive ? 'info' : 'off'} />
          <Node x={45} y={150} glyph="battery"   label="Battery bank" count={composition.batteries}   active={batteryActive} state={flow.lowBattery ? 'warn' : batteryActive ? 'info' : 'off'} />
          <Node x={45} y={230} glyph="grid"      label="Utility grid" active={gridActive} state={composition.gridConnected ? (gridActive ? 'ok' : 'info') : 'off'} />
          <Node x={45} y={310} glyph="generator" label="Generator"    count={composition.generators}  active={genActive} state={genActive ? 'ok' : composition.generators > 0 ? 'info' : 'off'} />
          <Node x={335} y={220} glyph="inverter" label="Inverter"     count={composition.inverters}   active={solarActive || batteryActive} state={composition.inverters === 0 ? 'fault' : 'ok'} />
          <Node x={495} y={320} glyph="ups"      label="UPS"          count={composition.ups}         active={upsActive} state={composition.ups === 0 ? 'warn' : 'ok'} />
          <Node x={655} y={320} glyph="load"     label="Critical load" active state={flow.overload ? 'fault' : 'ok'} />

          {/* Live numeric annotations (only render when parent supplies values) */}
          {liveAnnotations?.solarKw != null && composition.solarPanels > 0 ? (
            <text x={150} y={82} fill="var(--lamp-info)" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle">
              {liveAnnotations.solarKw.toFixed(1)} kWp
            </text>
          ) : null}
          {liveAnnotations?.socPct != null && composition.batteries > 0 ? (
            <text x={150} y={162} fill={liveAnnotations.socPct < 30 ? 'var(--lamp-warn)' : 'var(--lamp-info)'} fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle">
              SoC {liveAnnotations.socPct.toFixed(0)}%
            </text>
          ) : null}
          {liveAnnotations?.runtimeMin != null && composition.batteries > 0 && liveAnnotations.runtimeMin > 0 ? (
            <text x={150} y={196} fill="var(--cockpit-ink-unit)" fontSize="8" fontFamily="ui-monospace, monospace" textAnchor="middle">
              {Number.isFinite(liveAnnotations.runtimeMin) ? `${liveAnnotations.runtimeMin.toFixed(0)} min` : '∞'}
            </text>
          ) : null}
          {liveAnnotations?.lineV != null && liveAnnotations?.lineA != null ? (
            <text x={500} y={278} fill="var(--lamp-info)" fontSize="9" fontFamily="ui-monospace, monospace" textAnchor="middle">
              {liveAnnotations.lineV.toFixed(0)} V · {liveAnnotations.lineA.toFixed(0)} A
            </text>
          ) : null}
          {liveAnnotations?.loadKw != null ? (
            <text x={700} y={355} fill={flow.overload ? 'var(--lamp-fault)' : 'var(--lamp-ok)'} fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="middle">
              {liveAnnotations.loadKw.toFixed(1)} kW
            </text>
          ) : null}
        </svg>

        {/* Source-mode banner */}
        <div
          className="absolute left-3 top-3 flex items-center gap-2 rounded-sm border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{
            borderColor: 'var(--cockpit-edge)',
            background: 'rgba(0,0,0,0.35)',
            color: 'var(--cockpit-ink)',
          }}
        >
          <span style={{ color: 'var(--cockpit-ink-muted)' }}>Source</span>
          <span>
            {flow.sourceMode === 'grid' ? 'Grid' : flow.sourceMode === 'generator' ? 'Generator' : 'Battery / Inverter'}
          </span>
        </div>
        <div
          className="absolute right-3 top-3 text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: 'var(--cockpit-ink-unit)' }}
        >
          One-line schematic · synthetic
        </div>
      </div>

      {/* Composition controls — addable / removable components */}
      <div className="grid gap-2 md:grid-cols-3">
        <CompControl
          label="Solar panels" icon="solar"
          value={composition.solarPanels}
          onAdd={inc('solarPanels')} onRemove={dec('solarPanels')}
          per={TOPOLOGY_LIMITS.solarPanels.perUnitLabel}
        />
        <CompControl
          label="Battery modules" icon="battery"
          value={composition.batteries}
          onAdd={inc('batteries')} onRemove={dec('batteries')}
          per={TOPOLOGY_LIMITS.batteries.perUnitLabel}
        />
        <CompControl
          label="Inverters" icon="inverter"
          value={composition.inverters}
          onAdd={inc('inverters')} onRemove={dec('inverters')}
          per={TOPOLOGY_LIMITS.inverters.perUnitLabel}
        />
        <CompControl
          label="UPS units" icon="ups"
          value={composition.ups}
          onAdd={inc('ups')} onRemove={dec('ups')}
          per={TOPOLOGY_LIMITS.ups.perUnitLabel}
        />
        <CompControl
          label="Generators" icon="generator"
          value={composition.generators}
          onAdd={inc('generators')} onRemove={dec('generators')}
          per={TOPOLOGY_LIMITS.generators.perUnitLabel}
        />
        <CompControl
          label="Utility grid" icon="grid"
          value={composition.gridConnected ? 1 : 0}
          onToggle={toggleGrid}
          toggleLabel={composition.gridConnected ? 'Connected' : 'Islanded'}
        />
      </div>
    </div>
  );
}

/* ──────────────────────────── primitives ──────────────────────────── */

function Trace({ path, active, dashed, label, labelX, labelY }: {
  path: string;
  active?: boolean;
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
        stroke={active ? 'var(--cockpit-trace-active)' : 'var(--cockpit-trace)'}
        strokeOpacity={active ? 0.95 : 0.35}
        strokeWidth={active ? 2 : 1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? '4 4' : undefined}
        style={active ? { filter: 'drop-shadow(0 0 3px var(--cockpit-trace-active))' } : undefined}
      />
      {label != null && labelX != null && labelY != null ? (
        <text
          x={labelX}
          y={labelY}
          fill="var(--cockpit-ink-unit)"
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

function Node({ x, y, label, count, glyph, state = 'ok', active }: NodeProps) {
  const lampColor =
    state === 'ok' ? 'var(--lamp-ok)' :
    state === 'warn' ? 'var(--lamp-warn)' :
    state === 'fault' ? 'var(--lamp-fault)' :
    state === 'info' ? 'var(--lamp-info)' :
    'var(--lamp-off)';
  return (
    <g transform={`translate(${x},${y})`}>
      <rect
        x={0} y={0} width={90} height={56} rx={6}
        fill="var(--cockpit-panel-raised)"
        stroke={active ? 'var(--cockpit-trace-active)' : 'var(--cockpit-edge)'}
        strokeWidth={active ? 1.5 : 1}
        style={active ? { filter: 'drop-shadow(0 0 4px var(--cockpit-trace-active))' } : undefined}
      />
      {/* glyph */}
      <g transform="translate(8,8)">
        <NodeGlyph glyph={glyph} />
      </g>
      {/* lamp */}
      <circle cx={82} cy={8} r={3.5} fill={lampColor}
        style={state !== 'off' ? { filter: `drop-shadow(0 0 3px ${lampColor})` } : undefined} />
      {/* label */}
      <text x={32} y={20} fontSize="9" fill="var(--cockpit-ink)"
        fontFamily="Inter, system-ui, sans-serif" fontWeight={600}
        style={{ letterSpacing: '0.06em' }}>
        {label}
      </text>
      {count != null ? (
        <text x={32} y={34} fontSize="14" fill="var(--cockpit-ink)"
          fontFamily="ui-monospace, monospace" fontWeight={600}>
          ×{count}
        </text>
      ) : null}
      <text x={32} y={48} fontSize="8" fill="var(--cockpit-ink-unit)"
        fontFamily="ui-monospace, monospace"
        style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        {state}
      </text>
    </g>
  );
}

function NodeGlyph({ glyph }: { glyph: NodeProps['glyph'] }) {
  const stroke = 'var(--cockpit-trace-active)';
  switch (glyph) {
    case 'solar':
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.4}>
          <rect x={0} y={2} width={20} height={14} rx={1} />
          <line x1={6} y1={2} x2={6} y2={16} />
          <line x1={13} y1={2} x2={13} y2={16} />
          <line x1={0} y1={9} x2={20} y2={9} />
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
    case 'inverter':
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.4}>
          <rect x={0} y={2} width={20} height={14} rx={2} />
          <text x={10} y={13} fontSize="9" textAnchor="middle" fill={stroke} fontFamily="ui-monospace, monospace">~</text>
        </g>
      );
    case 'ups':
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.4}>
          <rect x={0} y={2} width={20} height={14} rx={2} />
          <path d="M 6 6 L 10 12 L 14 6" />
        </g>
      );
    case 'generator':
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.4}>
          <circle cx={10} cy={9} r={7} />
          <text x={10} y={12} fontSize="7" textAnchor="middle" fill={stroke} fontFamily="ui-monospace, monospace" fontWeight={600}>G</text>
        </g>
      );
    case 'grid':
      return (
        <g fill="none" stroke={stroke} strokeWidth={1.4}>
          <path d="M 10 1 L 4 8 L 16 8 Z" />
          <path d="M 10 8 L 6 16 M 10 8 L 14 16" />
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

function CompControl({
  label, icon, value, per, onAdd, onRemove, onToggle, toggleLabel,
}: {
  label: string;
  icon: NodeProps['glyph'];
  value: number;
  per?: string;
  onAdd?: () => void;
  onRemove?: () => void;
  onToggle?: () => void;
  toggleLabel?: string;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-md border px-3 py-2"
      style={{ borderColor: 'var(--cockpit-rail)', background: 'var(--cockpit-panel-raised)' }}
    >
      <svg width={24} height={24} viewBox="0 0 20 20">
        <NodeGlyph glyph={icon} />
      </svg>
      <div className="min-w-0 flex-1">
        <div
          className="text-[10px] font-semibold uppercase leading-none tracking-[0.16em]"
          style={{ color: 'var(--cockpit-ink-muted)' }}
        >
          {label}
        </div>
        <div
          className="mt-0.5 text-[11px]"
          style={{ color: 'var(--cockpit-ink-unit)', fontFamily: 'ui-monospace, monospace' }}
        >
          {onToggle ? toggleLabel : `${value} unit${value === 1 ? '' : 's'}${per ? ` · ${per}` : ''}`}
        </div>
      </div>
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          className="rounded-sm border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
          style={{
            borderColor: 'var(--cockpit-edge)',
            color: value ? 'var(--lamp-info)' : 'var(--cockpit-ink-muted)',
            background: 'transparent',
          }}
        >
          {value ? 'On' : 'Off'}
        </button>
      ) : (
        <div className="flex items-center gap-1">
          <SquareBtn onClick={onRemove} ariaLabel={`Remove ${label}`}>−</SquareBtn>
          <span
            className="min-w-[1.5rem] text-center text-sm font-semibold tabular-nums"
            style={{ color: 'var(--cockpit-ink)', fontFamily: 'ui-monospace, monospace' }}
          >
            {value}
          </span>
          <SquareBtn onClick={onAdd} ariaLabel={`Add ${label}`}>+</SquareBtn>
        </div>
      )}
    </div>
  );
}

function SquareBtn({ children, onClick, ariaLabel }: { children: React.ReactNode; onClick?: () => void; ariaLabel: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="grid h-6 w-6 place-items-center rounded-sm border text-sm font-semibold transition-colors"
      style={{
        borderColor: 'var(--cockpit-edge)',
        color: 'var(--cockpit-ink)',
        background: 'transparent',
      }}
    >
      {children}
    </button>
  );
}
