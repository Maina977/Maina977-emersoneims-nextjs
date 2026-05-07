'use client';

import * as React from 'react';
import {
  GridInputBlock,
  RectifierBlock,
  BatteryBankBlock,
  InverterBlock,
  UPSBlock,
  BypassBlock,
  LoadBlock,
  FlowArrow,
  LiveValueLabel,
  WarningBadge,
  SystemBlocksDefs,
  type BlockState,
} from './SystemBlocks';

/**
 * SimpleUpsBoard — customer-friendly UPS one-line. Mirrors SimpleSolarBoard
 * in style and reads from the same kind of composition state already
 * managed by UpsLabClient. Intended path:
 *
 *    Mains → Rectifier → DC bus + Battery → Inverter → Load
 *                                                    ↑
 *                                              Static bypass
 *
 * Visual state (active / warn / fault) and the inline value labels both
 * derive from props, so the board redraws as the user adds/removes UPS
 * units, loads, or simulates a mains-out condition.
 */

export interface SimpleUpsBoardState {
  mainsPresent: boolean;
  upsCount: number;
  upsCapacityKw: number;
  loadKw: number;
  inputKw: number;
  outputKw: number;
  batteryKwh: number;
  runtimeMin: number;
  overloaded: boolean;
  highLoad: boolean;
  topologyLabel?: string;
}

const W = 880;
const H = 320;

export function SimpleUpsBoard({ state }: { state: SimpleUpsBoardState }) {
  const {
    mainsPresent, upsCount, upsCapacityKw, loadKw, inputKw, outputKw,
    batteryKwh, runtimeMin, overloaded, highLoad, topologyLabel,
  } = state;

  const onBattery = !mainsPresent && batteryKwh > 0 && upsCount > 0;
  const upsLive = upsCount > 0 && (mainsPresent || onBattery);
  const inverterActive = upsLive && outputKw > 0;
  const rectifierActive = upsLive && mainsPresent;
  const bypassEngaged = upsCount > 0 && overloaded;
  const noUps = upsCount === 0;
  const noLoad = loadKw === 0;

  const mainsState: BlockState = mainsPresent ? 'info' : 'fault';
  const rectState: BlockState = rectifierActive ? 'ok' : 'off';
  const battState: BlockState = batteryKwh > 0 ? (onBattery ? 'info' : 'ok') : 'off';
  const upsState: BlockState  = noUps ? 'fault' : overloaded ? 'fault' : highLoad ? 'warn' : 'ok';
  const invState: BlockState  = noUps ? 'fault' : inverterActive ? 'ok' : 'off';
  const bypassState: BlockState = bypassEngaged ? 'warn' : 'off';
  const loadState: BlockState = overloaded ? 'fault' : highLoad ? 'warn' : noLoad ? 'off' : 'ok';

  // x positions for a clean horizontal flow
  const yTop = 80, yMid = 160, yBat = 240;
  const xMains = 60, xRect = 200, xUps = 360, xInv = 500, xLoad = 700, xBat = 200, xByp = 530;

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
          aria-label="Simple UPS one-line diagram"
        >
          <SystemBlocksDefs />

          {/* Banner */}
          <text x={20} y={22} fill="var(--cockpit-ink-unit, #8a9bb8)" fontSize={11} fontFamily="ui-monospace, monospace" style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            Simple UPS view · {topologyLabel ?? 'Online double-conversion'}
          </text>
          <text x={W - 20} y={22} fill="var(--cockpit-ink-unit, #8a9bb8)" fontSize={11} fontFamily="ui-monospace, monospace" textAnchor="end" style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            {onBattery ? 'On battery' : mainsPresent ? 'On mains' : 'No supply'}
          </text>

          {/* ─── Flow arrows ─── */}
          {/* Mains → Rectifier */}
          <FlowArrow from={{ x: xMains + 44, y: yTop + 28 }} to={{ x: xRect - 44, y: yMid }} active={mainsPresent && upsLive} label="AC in" />
          {/* Rectifier → UPS */}
          <FlowArrow from={{ x: xRect + 44, y: yMid }} to={{ x: xUps - 44, y: yMid }} active={rectifierActive} label="DC" />
          {/* Battery → UPS DC bus */}
          <FlowArrow from={{ x: xBat + 44, y: yBat - 32 }} to={{ x: xUps - 44, y: yMid }} active={onBattery} />
          {/* UPS → Inverter */}
          <FlowArrow from={{ x: xUps + 44, y: yMid }} to={{ x: xInv - 44, y: yMid }} active={upsLive} />
          {/* Inverter → Load */}
          <FlowArrow from={{ x: xInv + 44, y: yMid }} to={{ x: xLoad - 44, y: yTop + 28 }} active={inverterActive} warn={overloaded} label={`AC · ${outputKw.toFixed(2)} kW`} />
          {/* Static bypass: Mains → Load */}
          <FlowArrow
            from={{ x: xMains + 44, y: yTop + 28 }}
            to={{ x: xLoad - 44, y: yTop + 28 }}
            active={bypassEngaged}
            warn={bypassEngaged}
          />

          {/* ─── Blocks ─── */}
          <GridInputBlock x={xMains - 44} y={yTop} label="Mains" caption={mainsPresent ? `${inputKw.toFixed(2)} kW in` : 'down'} state={mainsState} />
          <RectifierBlock x={xRect - 44} y={yMid - 28} label="Rectifier" caption={rectifierActive ? 'AC → DC' : 'idle'} state={rectState} />
          <UPSBlock x={xUps - 44} y={yMid - 28} label={`UPS ×${upsCount}`} caption={`${upsCapacityKw.toFixed(1)} kW capacity`} count={upsCount} state={upsState} />
          <InverterBlock x={xInv - 44} y={yMid - 28} label="Inverter" caption={inverterActive ? 'DC → AC' : 'idle'} state={invState} />
          <LoadBlock x={xLoad - 44} y={yTop} kind="critical" label="Critical load" caption={loadKw > 0 ? `${loadKw.toFixed(2)} kW` : 'idle'} state={loadState} />
          <BatteryBankBlock x={xBat - 44} y={yBat - 32} label="Battery bank" caption={`${batteryKwh.toFixed(1)} kWh`} state={battState} />
          <BypassBlock x={xByp - 44} y={yTop + 56} label="Static bypass" caption={bypassEngaged ? 'engaged' : 'standby'} state={bypassState} kind="static" />

          {/* ─── Live labels ─── */}
          {batteryKwh > 0 && (onBattery || (mainsPresent && upsCount > 0)) ? (
            <LiveValueLabel
              x={xBat}
              y={yBat + 50}
              value={Number.isFinite(runtimeMin) ? `${runtimeMin.toFixed(0)} min` : '∞'}
              state={runtimeMin < 5 ? 'warn' : 'info'}
            />
          ) : null}

          {/* Capacity headroom */}
          <text x={W - 20} y={H - 14} fill="var(--cockpit-ink-unit, #8a9bb8)" fontSize={10} fontFamily="ui-monospace, monospace" textAnchor="end" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Capacity {upsCapacityKw.toFixed(1)} kW · load {loadKw.toFixed(1)} kW
          </text>

          {/* ─── Warning ribbon ─── */}
          {(() => {
            const warnings: { text: string; severity: 'warn' | 'fault' | 'info' }[] = [];
            if (overloaded) warnings.push({ text: 'UPS OVERLOAD', severity: 'fault' });
            if (noUps && loadKw > 0) warnings.push({ text: 'NO UPS', severity: 'fault' });
            if (highLoad && !overloaded) warnings.push({ text: 'HIGH LOAD > 85%', severity: 'warn' });
            if (batteryKwh === 0 && upsCount > 0) warnings.push({ text: 'NO BATTERY', severity: 'warn' });
            if (Number.isFinite(runtimeMin) && runtimeMin < 5 && batteryKwh > 0) warnings.push({ text: 'AUTONOMY < 5 MIN', severity: 'warn' });
            if (bypassEngaged) warnings.push({ text: 'ON BYPASS', severity: 'warn' });
            return warnings.slice(0, 3).map((w, i) => (
              <WarningBadge key={i} x={140 + i * 200} y={H - 32} text={w.text} severity={w.severity} />
            ));
          })()}
        </svg>

        <div className="absolute right-3 top-3 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--cockpit-ink-unit, #8a9bb8)' }}>
          Synthetic schematic
        </div>
      </div>
    </div>
  );
}
