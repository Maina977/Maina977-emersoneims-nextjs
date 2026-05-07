'use client';

import * as React from 'react';
import {
  PanelBlock,
  ControllerBlock,
  BatteryBankBlock,
  InverterBlock,
  HybridInverterBlock,
  LoadBlock,
  GridInputBlock,
  CombinerBlock,
  FlowArrow,
  LiveValueLabel,
  WarningBadge,
  SystemBlocksDefs,
  type BlockState,
} from './SystemBlocks';

/**
 * SimpleSolarBoard — customer-friendly, educational "Simple System View".
 *
 * Sits beside the engineering TopologyBoard and reads from the SAME
 * composition state object. Picks the correct visual path automatically:
 *   • Off-grid  : PV → MPPT → Battery → Inverter → Load
 *   • Hybrid    : PV → Hybrid Inverter (with grid leg) → Battery + Load
 *   • Grid-tied : PV → Inverter → Grid → Load
 *
 * State drives all visuals — block colors, flow arrows, live numeric
 * labels (kWp, SoC, runtime, kW, kWh) — so the board redraws when the
 * user changes counts or settings.
 */

export interface SimpleSolarBoardState {
  /** Composition counts. */
  panels: number;
  batteries: number;
  inverters: number;
  /** Optional engineering details. */
  controllerKind: 'MPPT' | 'PWM';
  inverterKind: 'off-grid' | 'hybrid' | 'grid-tied';
  gridConnected: boolean;
  /** Live readings (kW / kWh / % / minutes). */
  solarKwp: number;
  bankKwh: number;
  socPct: number;
  loadKw: number;
  runtimeMin: number;
  /** Verdict flags surfaced as block states / warning ribbon. */
  overload: boolean;
  inverterUndersized: boolean;
  controllerUndersized: boolean;
  batteryMismatch: boolean;
  missingProtections: string[];
}

const W = 760;
const H = 320;

export function SimpleSolarBoard({ state }: { state: SimpleSolarBoardState }) {
  const {
    panels, batteries, inverters,
    controllerKind, inverterKind, gridConnected,
    solarKwp, bankKwh, socPct, loadKw, runtimeMin,
    overload, inverterUndersized, controllerUndersized, batteryMismatch,
    missingProtections,
  } = state;

  const hasPv = panels > 0;
  const hasBattery = batteries > 0;
  const hasInverter = inverters > 0;
  const hybrid = inverterKind === 'hybrid';
  const gridTied = inverterKind === 'grid-tied';

  // Activity flags — lit when the path is actually carrying power.
  const sunFlow = hasPv;
  const dcFlow = hasPv && hasBattery;
  const acFlow = hasInverter && loadKw > 0;
  const gridFlow = gridConnected && (gridTied || hybrid);

  // State per block.
  const panelState: BlockState = !hasPv ? 'off' : 'info';
  const ctrlState: BlockState = !hasPv ? 'off' : controllerUndersized ? 'warn' : 'ok';
  const battState: BlockState = !hasBattery
    ? 'off'
    : batteryMismatch
    ? 'warn'
    : socPct < 25
    ? 'warn'
    : 'info';
  const invState: BlockState = !hasInverter ? 'fault' : inverterUndersized || overload ? 'warn' : 'ok';
  const loadState: BlockState = overload ? 'fault' : loadKw === 0 ? 'off' : 'ok';
  const gridState: BlockState = !gridConnected ? 'off' : gridFlow ? 'ok' : 'info';

  // Node centers for flow arrows.
  const yPV = 80, yMid = 150, yBatt = 220, yLoad = 80;
  const xPV = 60, xCtrl = 200, xBatt = 200, xInv = 360, xLoad = 540, xGrid = 690;

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
          aria-label="Simple solar one-line diagram"
        >
          <SystemBlocksDefs />

          {/* Banner */}
          <text x={20} y={22} fill="var(--cockpit-ink-unit, #8a9bb8)" fontSize={11} fontFamily="ui-monospace, monospace" style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            Simple system view · {hybrid ? 'Hybrid' : gridTied ? 'Grid-tied' : 'Off-grid'}
          </text>
          <text x={W - 20} y={22} fill="var(--cockpit-ink-unit, #8a9bb8)" fontSize={11} fontFamily="ui-monospace, monospace" textAnchor="end" style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            {hasPv ? `${solarKwp.toFixed(2)} kWp` : 'No PV'}
          </text>

          {/* ──── FLOW ARROWS (drawn first so blocks sit on top) ──── */}
          {/* PV → Controller */}
          <FlowArrow
            from={{ x: xPV + 44, y: yPV + 28 }}
            to={{ x: xCtrl - 44, y: yMid }}
            active={sunFlow}
            label="DC"
          />
          {/* Controller → Battery */}
          <FlowArrow
            from={{ x: xCtrl, y: yMid + 28 }}
            to={{ x: xBatt, y: yBatt - 32 }}
            active={dcFlow}
          />
          {/* Battery / DC bus → Inverter */}
          <FlowArrow
            from={{ x: xCtrl + 44, y: yMid }}
            to={{ x: xInv - 44, y: yMid }}
            active={hasBattery && hasInverter}
            label="DC bus"
          />
          {/* Inverter → Load */}
          <FlowArrow
            from={{ x: xInv + 44, y: yMid }}
            to={{ x: xLoad - 44, y: yLoad + 28 }}
            active={acFlow}
            warn={overload}
            label={`AC · ${loadKw.toFixed(1)} kW`}
          />
          {/* Optional grid leg (hybrid + grid-tied) */}
          {(hybrid || gridTied) && gridConnected ? (
            <FlowArrow
              from={{ x: xGrid - 44, y: yLoad + 28 }}
              to={{ x: xLoad + 44, y: yLoad + 28 }}
              active={gridFlow}
              label="Grid"
            />
          ) : null}

          {/* ──── BLOCKS ──── */}
          <PanelBlock      x={xPV - 44}   y={yPV}        label="Solar panels"   caption={hasPv ? `${panels} × panel` : 'none'} count={panels}      state={panelState} />
          <ControllerBlock x={xCtrl - 44} y={yMid - 28}  label="Charge ctrl"    caption={hasPv ? `${controllerKind} · ${inverterKind === 'grid-tied' ? 'grid' : 'off-grid'}` : 'none'} state={ctrlState} kind={controllerKind} />
          <BatteryBankBlock x={xBatt - 44} y={yBatt - 32} label="Battery bank"  caption={hasBattery ? `${batteries} × cell` : 'no battery'} count={batteries} state={battState} />
          {hybrid ? (
            <HybridInverterBlock x={xInv - 52} y={yMid - 28} label="Hybrid inverter" caption={`${inverters} × parallel`} count={inverters} state={invState} />
          ) : (
            <InverterBlock x={xInv - 44} y={yMid - 28} label="Inverter" caption={hasInverter ? `${inverters} × parallel` : 'missing'} count={inverters} state={invState} />
          )}
          <LoadBlock       x={xLoad - 44} y={yLoad}      label="Load"           caption={loadKw > 0 ? `${loadKw.toFixed(1)} kW` : 'idle'} state={loadState} />
          {(hybrid || gridTied) ? (
            <GridInputBlock x={xGrid - 44} y={yLoad} label="Utility grid" caption={gridConnected ? 'connected' : 'disconnected'} state={gridState} />
          ) : null}

          {/* ──── LIVE LABELS ──── */}
          {hasBattery ? (
            <LiveValueLabel x={xBatt} y={yBatt + 50} value={`SoC ${socPct.toFixed(0)}%`} state={socPct < 25 ? 'warn' : 'info'} />
          ) : null}
          {hasBattery && Number.isFinite(runtimeMin) && runtimeMin > 0 ? (
            <LiveValueLabel x={xBatt} y={yBatt + 64} value={`${runtimeMin.toFixed(0)} min`} state="info" />
          ) : null}
          {hasBattery ? (
            <LiveValueLabel x={xBatt} y={yBatt + 78} value={`${bankKwh.toFixed(1)} kWh`} state="info" />
          ) : null}

          {/* ──── WARNING RIBBON ──── */}
          {(() => {
            const warnings: { text: string; severity: 'warn' | 'fault' | 'info' }[] = [];
            if (overload) warnings.push({ text: 'OVERLOAD', severity: 'fault' });
            if (!hasInverter) warnings.push({ text: 'NO INVERTER', severity: 'fault' });
            if (inverterUndersized && hasInverter) warnings.push({ text: 'INVERTER UNDERSIZED', severity: 'warn' });
            if (controllerUndersized && hasPv) warnings.push({ text: 'CONTROLLER UNDERSIZED', severity: 'warn' });
            if (batteryMismatch && hasBattery) warnings.push({ text: 'BATTERY MISMATCH', severity: 'warn' });
            if (missingProtections.length > 0)
              warnings.push({ text: `MISSING: ${missingProtections[0].toUpperCase()}`, severity: 'warn' });
            return warnings.slice(0, 3).map((w, i) => (
              <WarningBadge key={i} x={120 + i * 180} y={H - 24} text={w.text} severity={w.severity} />
            ));
          })()}
        </svg>

        <div className="absolute right-3 top-3 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--cockpit-ink-unit, #8a9bb8)' }}>
          Synthetic schematic · {hybrid ? 'hybrid' : gridTied ? 'grid-tied' : 'off-grid'}
        </div>
      </div>
    </div>
  );
}
