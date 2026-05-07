'use client';

import * as React from 'react';

/**
 * SystemBlocks — reusable SVG primitives used by the hub's simple-view
 * solar and UPS schematics. Each block accepts (x, y) for placement and a
 * `state` flag (`ok` | `info` | `warn` | `fault` | `off`) that drives its
 * stroke / fill / glow. Blocks are deliberately compact (~80×56 default)
 * so they compose cleanly into a single SVG board.
 *
 * Design principles:
 *   - State-driven: every block reads its visual state from props; no
 *     internal interactivity (clicks live on the parent counter rows).
 *   - Token-derived: colors come from CSS variables defined in
 *     app/styles/tokens.css so the blocks restyle automatically when the
 *     hub palette changes.
 *   - Composable: pair with FlowArrow / LiveValueLabel / WarningBadge to
 *     build the customer-friendly Simple Solar / Simple UPS boards in
 *     a few dozen lines.
 */

export type BlockState = 'ok' | 'info' | 'warn' | 'fault' | 'off';

const STATE_COLORS: Record<BlockState, { stroke: string; fill: string; glow: string; text: string }> = {
  ok:    { stroke: 'var(--lamp-ok, #34c759)',    fill: 'rgba(52, 199, 89, 0.10)',  glow: 'rgba(52, 199, 89, 0.45)',  text: 'var(--lamp-ok, #34c759)' },
  info:  { stroke: 'var(--lamp-info, #4cd2ee)',  fill: 'rgba(76, 210, 238, 0.10)', glow: 'rgba(76, 210, 238, 0.45)', text: 'var(--lamp-info, #4cd2ee)' },
  warn:  { stroke: 'var(--lamp-warn, #ffb547)',  fill: 'rgba(255, 181, 71, 0.10)', glow: 'rgba(255, 181, 71, 0.45)', text: 'var(--lamp-warn, #ffb547)' },
  fault: { stroke: 'var(--lamp-fault, #ff453a)', fill: 'rgba(255, 69, 58, 0.12)',  glow: 'rgba(255, 69, 58, 0.50)',  text: 'var(--lamp-fault, #ff453a)' },
  off:   { stroke: 'rgba(140, 170, 220, 0.32)',  fill: 'rgba(140, 170, 220, 0.04)', glow: 'transparent',              text: 'rgba(140, 170, 220, 0.55)' },
};

interface BaseBlockProps {
  x: number;
  y: number;
  state?: BlockState;
  /** Big label under the block. */
  label: string;
  /** Optional small caption (e.g. "12 × 550 W"). */
  caption?: string;
  /** Optional count badge (top-right of the block). */
  count?: number;
  /** Optional width / height — defaults to 88 × 56. */
  w?: number;
  h?: number;
}

/* ======================================================================
   Generic block frame (all the typed blocks compose this)
   ====================================================================== */

interface BlockFrameProps extends BaseBlockProps {
  children: React.ReactNode;
}

function BlockFrame({ x, y, state = 'off', label, caption, count, w = 88, h = 56, children }: BlockFrameProps) {
  const c = STATE_COLORS[state];
  const cx = x + w / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth={1.5}
        style={state === 'off' ? undefined : { filter: `drop-shadow(0 0 6px ${c.glow})` }}
      />
      {/* Block icon area */}
      <g transform={`translate(${cx}, ${y + h / 2})`} stroke={c.stroke} strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
      {/* Big label below */}
      <text x={cx} y={y + h + 14} fill="var(--cockpit-ink, #e6edf7)" fontSize={11} fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={600} textAnchor="middle">
        {label}
      </text>
      {/* Optional caption */}
      {caption ? (
        <text x={cx} y={y + h + 27} fill="var(--cockpit-ink-unit, #8a9bb8)" fontSize={9} fontFamily="ui-monospace, 'JetBrains Mono', monospace" textAnchor="middle">
          {caption}
        </text>
      ) : null}
      {/* Optional count badge */}
      {typeof count === 'number' && count > 0 ? (
        <g>
          <circle cx={x + w - 8} cy={y + 8} r={9} fill="rgba(0, 0, 0, 0.55)" stroke={c.stroke} strokeWidth={1} />
          <text x={x + w - 8} y={y + 11} fill={c.text} fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700} textAnchor="middle">
            {count > 99 ? '99+' : count}
          </text>
        </g>
      ) : null}
    </g>
  );
}

/* ======================================================================
   Typed engineering blocks
   ====================================================================== */

/** Solar PV array — sun + module grid icon. */
export function PanelBlock(p: BaseBlockProps) {
  return (
    <BlockFrame {...p}>
      {/* sun rays */}
      <circle r={6} cx={-14} cy={-4} fill="rgba(255, 181, 71, 0.85)" stroke="rgba(255, 181, 71, 0.85)" />
      <line x1={-14} y1={-13} x2={-14} y2={-15} />
      <line x1={-14} y1={5} x2={-14} y2={7} />
      <line x1={-23} y1={-4} x2={-25} y2={-4} />
      <line x1={-5} y1={-4} x2={-3} y2={-4} />
      {/* panel grid */}
      <rect x={2} y={-12} width={22} height={20} />
      <line x1={2} y1={-2} x2={24} y2={-2} />
      <line x1={13} y1={-12} x2={13} y2={8} />
    </BlockFrame>
  );
}

/** MPPT / PWM charge controller — chip + arrow icon. */
export function ControllerBlock(p: BaseBlockProps & { kind?: 'MPPT' | 'PWM' }) {
  return (
    <BlockFrame {...p}>
      <rect x={-12} y={-9} width={24} height={18} />
      <text y={4} fill={STATE_COLORS[p.state ?? 'off'].stroke} fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={700} textAnchor="middle" stroke="none">
        {p.kind ?? 'MPPT'}
      </text>
    </BlockFrame>
  );
}

/** Single battery — minimalist battery icon with terminals. */
export function BatteryBlock(p: BaseBlockProps) {
  return (
    <BlockFrame {...p}>
      <rect x={-14} y={-10} width={26} height={18} rx={2} />
      <rect x={12} y={-5} width={3} height={8} fill={STATE_COLORS[p.state ?? 'off'].stroke} />
      {/* fill bars */}
      <rect x={-11} y={-7} width={5} height={12} fill={STATE_COLORS[p.state ?? 'off'].stroke} stroke="none" />
      <rect x={-4} y={-7} width={5} height={12} fill={STATE_COLORS[p.state ?? 'off'].stroke} fillOpacity={0.6} stroke="none" />
      <rect x={3} y={-7} width={5} height={12} fill={STATE_COLORS[p.state ?? 'off'].stroke} fillOpacity={0.3} stroke="none" />
    </BlockFrame>
  );
}

/** Battery bank — stacked batteries to convey multiple cells. */
export function BatteryBankBlock(p: BaseBlockProps) {
  return (
    <BlockFrame {...p} h={64}>
      <rect x={-14} y={-15} width={26} height={11} rx={2} />
      <rect x={12} y={-13} width={3} height={5} fill={STATE_COLORS[p.state ?? 'off'].stroke} />
      <rect x={-14} y={-2} width={26} height={11} rx={2} />
      <rect x={12} y={0} width={3} height={5} fill={STATE_COLORS[p.state ?? 'off'].stroke} />
      <rect x={-14} y={11} width={26} height={11} rx={2} />
      <rect x={12} y={13} width={3} height={5} fill={STATE_COLORS[p.state ?? 'off'].stroke} />
    </BlockFrame>
  );
}

/** Inverter — DC↔AC sine icon. */
export function InverterBlock(p: BaseBlockProps) {
  return (
    <BlockFrame {...p}>
      <rect x={-14} y={-10} width={28} height={20} />
      <text x={-7} y={-2} fill={STATE_COLORS[p.state ?? 'off'].stroke} fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={700} textAnchor="middle" stroke="none">DC</text>
      <path d="M -2 4 q 2 -8 4 0 t 4 0" fill="none" />
      <text x={9} y={-2} fill={STATE_COLORS[p.state ?? 'off'].stroke} fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={700} textAnchor="middle" stroke="none">AC</text>
    </BlockFrame>
  );
}

/** Hybrid inverter — adds a grid arrow to InverterBlock. */
export function HybridInverterBlock(p: BaseBlockProps) {
  return (
    <BlockFrame {...p} w={104}>
      <rect x={-22} y={-10} width={44} height={20} />
      <text x={-13} y={-2} fill={STATE_COLORS[p.state ?? 'off'].stroke} fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={700} textAnchor="middle" stroke="none">DC</text>
      <path d="M -6 4 q 2 -8 4 0 t 4 0" fill="none" />
      <text x={11} y={-2} fill={STATE_COLORS[p.state ?? 'off'].stroke} fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={700} textAnchor="middle" stroke="none">AC</text>
      {/* grid leg */}
      <line x1={-18} y1={-10} x2={-18} y2={-15} />
      <line x1={-22} y1={-15} x2={-14} y2={-15} />
    </BlockFrame>
  );
}

/** UPS — front-panel cabinet icon (online double-conversion, etc.). */
export function UPSBlock(p: BaseBlockProps) {
  return (
    <BlockFrame {...p}>
      <rect x={-14} y={-12} width={28} height={24} />
      <circle cx={-7} cy={-4} r={2} fill={STATE_COLORS[p.state ?? 'off'].stroke} />
      <circle cx={0}  cy={-4} r={2} fill={STATE_COLORS[p.state ?? 'off'].stroke} />
      <circle cx={7}  cy={-4} r={2} fill={STATE_COLORS[p.state ?? 'off'].stroke} />
      <text y={9} fill={STATE_COLORS[p.state ?? 'off'].stroke} fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={700} textAnchor="middle" stroke="none">UPS</text>
    </BlockFrame>
  );
}

/** Rectifier — AC→DC arrow. */
export function RectifierBlock(p: BaseBlockProps) {
  return (
    <BlockFrame {...p}>
      <rect x={-14} y={-10} width={28} height={20} />
      <path d="M -2 4 q 2 -8 4 0 t 4 0" fill="none" />
      <line x1={-2} y1={-8} x2={6} y2={-8} markerEnd="url(#arrow-flow)" />
      <text x={-7} y={-2} fill={STATE_COLORS[p.state ?? 'off'].stroke} fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={700} textAnchor="middle" stroke="none">AC</text>
      <text x={9}  y={-2} fill={STATE_COLORS[p.state ?? 'off'].stroke} fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={700} textAnchor="middle" stroke="none">DC</text>
    </BlockFrame>
  );
}

/** Charger (PSU style). */
export function ChargerBlock(p: BaseBlockProps) {
  return (
    <BlockFrame {...p}>
      <rect x={-14} y={-10} width={28} height={20} />
      <polygon points="-4,-3 4,-3 0,5" fill={STATE_COLORS[p.state ?? 'off'].stroke} stroke="none" />
    </BlockFrame>
  );
}

/** Static / maintenance bypass — labelled diamond. */
export function BypassBlock(p: BaseBlockProps & { kind?: 'static' | 'maintenance' }) {
  return (
    <BlockFrame {...p} w={88}>
      <polygon points="-12,0 0,-9 12,0 0,9" />
      <text y={2} fill={STATE_COLORS[p.state ?? 'off'].stroke} fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={700} textAnchor="middle" stroke="none">
        {p.kind === 'maintenance' ? 'MBP' : 'BYP'}
      </text>
    </BlockFrame>
  );
}

/** Utility / mains feed — pole + lines icon. */
export function GridInputBlock(p: BaseBlockProps) {
  return (
    <BlockFrame {...p}>
      <line x1={0} y1={-14} x2={0} y2={10} />
      <line x1={-10} y1={-9} x2={10} y2={-9} />
      <line x1={-7}  y1={-4} x2={7}  y2={-4} />
      <line x1={-4}  y1={1}  x2={4}  y2={1} />
    </BlockFrame>
  );
}

/** PV combiner box — wire-converging icon. */
export function CombinerBlock(p: BaseBlockProps) {
  return (
    <BlockFrame {...p}>
      <rect x={-14} y={-10} width={28} height={20} />
      <line x1={-10} y1={-6} x2={2} y2={0} />
      <line x1={-10} y1={0}  x2={2} y2={0} />
      <line x1={-10} y1={6}  x2={2} y2={0} />
      <line x1={2} y1={0} x2={12} y2={0} />
    </BlockFrame>
  );
}

/** DC / AC isolator switch. */
export function IsolatorBlock(p: BaseBlockProps & { kind?: 'DC' | 'AC' }) {
  return (
    <BlockFrame {...p}>
      <rect x={-14} y={-10} width={28} height={20} />
      <line x1={-8} y1={0} x2={5} y2={-7} />
      <circle cx={-8} cy={0} r={2} fill={STATE_COLORS[p.state ?? 'off'].stroke} />
      <circle cx={8}  cy={0} r={2} fill={STATE_COLORS[p.state ?? 'off'].stroke} />
      <text y={11} fill={STATE_COLORS[p.state ?? 'off'].stroke} fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={700} textAnchor="middle" stroke="none">
        {p.kind ?? 'DC'}
      </text>
    </BlockFrame>
  );
}

/** Circuit breaker. */
export function BreakerBlock(p: BaseBlockProps & { kind?: 'DC' | 'AC' }) {
  return (
    <BlockFrame {...p}>
      <rect x={-14} y={-10} width={28} height={20} />
      <line x1={-8} y1={4} x2={-8} y2={-4} />
      <circle cx={-8} cy={4} r={2} fill={STATE_COLORS[p.state ?? 'off'].stroke} />
      <line x1={-8} y1={-4} x2={6} y2={-4} />
      <circle cx={8} cy={-4} r={2} fill={STATE_COLORS[p.state ?? 'off'].stroke} />
      <text y={11} fill={STATE_COLORS[p.state ?? 'off'].stroke} fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={700} textAnchor="middle" stroke="none">
        {p.kind ?? 'AC'}
      </text>
    </BlockFrame>
  );
}

/** Distribution board / consumer unit. */
export function DistributionBoardBlock(p: BaseBlockProps) {
  return (
    <BlockFrame {...p} w={104}>
      <rect x={-22} y={-12} width={44} height={24} />
      <line x1={-15} y1={-7} x2={-15} y2={7} />
      <line x1={-7}  y1={-7} x2={-7}  y2={7} />
      <line x1={1}   y1={-7} x2={1}   y2={7} />
      <line x1={9}   y1={-7} x2={9}   y2={7} />
      <line x1={17}  y1={-7} x2={17}  y2={7} />
    </BlockFrame>
  );
}

/** Load — light bulb / generic load icon. */
export function LoadBlock(p: BaseBlockProps & { kind?: 'critical' | 'noncritical' | 'generic' }) {
  const c = STATE_COLORS[p.state ?? 'off'].stroke;
  return (
    <BlockFrame {...p}>
      <circle cx={0} cy={-2} r={8} />
      <line x1={-3} y1={6} x2={3} y2={6} />
      <line x1={-2} y1={9} x2={2} y2={9} />
      {p.kind === 'critical' ? (
        <text x={0} y={1} fill={c} fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={700} textAnchor="middle" stroke="none">!</text>
      ) : null}
    </BlockFrame>
  );
}

/* ======================================================================
   Connectors
   ====================================================================== */

/**
 * Animated flow arrow / wire between two points. When `active` is true the
 * stroke pulses a flow direction so the user can see "what is currently
 * powering what" without reading numbers. Respects prefers-reduced-motion.
 */
export function FlowArrow({
  from,
  to,
  active = false,
  warn = false,
  label,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  active?: boolean;
  warn?: boolean;
  label?: string;
}) {
  const stroke = warn
    ? 'var(--lamp-warn, #ffb547)'
    : active
    ? 'var(--cockpit-trace-active, #4cd2ee)'
    : 'var(--cockpit-trace, rgba(140,170,220,0.4))';

  // L-shaped routing if rows differ; straight if aligned
  const aligned = Math.abs(from.y - to.y) < 6;
  const path = aligned
    ? `M ${from.x} ${from.y} L ${to.x} ${to.y}`
    : `M ${from.x} ${from.y} L ${(from.x + to.x) / 2} ${from.y} L ${(from.x + to.x) / 2} ${to.y} L ${to.x} ${to.y}`;

  const labelX = (from.x + to.x) / 2;
  const labelY = aligned ? from.y - 6 : (from.y + to.y) / 2 - 6;

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeOpacity={active ? 0.95 : 0.45}
        strokeWidth={active ? 2 : 1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={active ? '8 4' : undefined}
        className={active ? 'sb-flow-active' : undefined}
        style={active ? { filter: `drop-shadow(0 0 3px ${stroke})` } : undefined}
      />
      {label ? (
        <text
          x={labelX}
          y={labelY}
          fill="var(--cockpit-ink-unit, #8a9bb8)"
          fontSize={9}
          fontFamily="ui-monospace, 'JetBrains Mono', monospace"
          textAnchor="middle"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

/**
 * Live numeric label with units — used to overlay engineering values on
 * the diagram (kW, V, A, kWh, % SoC, runtime). Colored by state.
 */
export function LiveValueLabel({
  x,
  y,
  value,
  unit,
  state = 'info',
  decimals = 1,
}: {
  x: number;
  y: number;
  value: number | string;
  unit?: string;
  state?: BlockState;
  decimals?: number;
}) {
  const display =
    typeof value === 'number'
      ? Number.isFinite(value)
        ? value.toFixed(decimals)
        : '—'
      : value;
  return (
    <g>
      <text x={x} y={y} fill={STATE_COLORS[state].text} fontSize={10} fontFamily="ui-monospace, 'JetBrains Mono', monospace" fontWeight={700} textAnchor="middle">
        {display}
        {unit ? <tspan dx={2} fill="var(--cockpit-ink-unit, #8a9bb8)" fontWeight={500}>{unit}</tspan> : null}
      </text>
    </g>
  );
}

/**
 * Inline warning / advisory pill anchored on the diagram. Use sparingly:
 * if a block needs more context, paint that block in `warn` / `fault`
 * state and surface the human-readable reason in the parent's alarm strip.
 */
export function WarningBadge({
  x,
  y,
  text,
  severity = 'warn',
}: {
  x: number;
  y: number;
  text: string;
  severity?: 'warn' | 'fault' | 'info';
}) {
  const color = severity === 'fault' ? STATE_COLORS.fault : severity === 'info' ? STATE_COLORS.info : STATE_COLORS.warn;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-text.length * 3 - 8} y={-9} width={text.length * 6 + 16} height={18} rx={9} fill={color.fill} stroke={color.stroke} strokeWidth={1} />
      <text x={0} y={3} fill={color.text} fontSize={9} fontFamily="ui-sans-serif, system-ui" fontWeight={700} textAnchor="middle">
        {text}
      </text>
    </g>
  );
}

/* ======================================================================
   Shared SVG defs (arrow markers + flow keyframes) used by both boards
   ====================================================================== */

export function SystemBlocksDefs() {
  return (
    <defs>
      <marker id="arrow-flow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--cockpit-trace-active, #4cd2ee)" />
      </marker>
      <style>{`
        @keyframes sb-flow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -24; } }
        .sb-flow-active { animation: sb-flow 1.4s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .sb-flow-active { animation: none; } }
      `}</style>
    </defs>
  );
}
