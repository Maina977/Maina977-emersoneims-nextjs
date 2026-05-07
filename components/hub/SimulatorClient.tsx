'use client';

import * as React from 'react';
import { SampleBadge, HubConnectStrip } from '@/components/hub/HubShell';
import { Gauge, LockedChart, formatValue } from '@/components/charts/dataviz';
import {
  CockpitFrame,
  CockpitPanel,
  CockpitDivider,
} from '@/components/hub/cockpit/CockpitPanel';
import { StatusLight, LampBar } from '@/components/hub/cockpit/StatusLight';
import { DigitalReadout, SegmentBar } from '@/components/hub/cockpit/DigitalReadout';
import { AlarmController, type AlarmSignal } from '@/components/hub/cockpit/AlarmController';
import { HarmonicsPanel, type PowerQuality } from '@/components/hub/cockpit/HarmonicsPanel';
import {
  TopologyBoard,
  TOPOLOGY_DEFAULTS,
  type TopologyComposition,
} from '@/components/hub/cockpit/TopologyBoard';
import { SimpleSolarBoard } from '@/components/hub/cockpit/SimpleSolarBoard';

/**
 * Smart Sizing Simulator — cockpit edition.
 *
 * Sizing model (deratePercent / sizeGenerator / sizeFuel / sizeUps) is
 * preserved verbatim from the previous implementation. Composition counts
 * (panels, batteries, inverters, ups, generators, grid) are layered on top
 * and feed back into the model so the schematic and instruments stay
 * coherent with the user's selections.
 *
 * NOTE: derating, load factor, and PQ heuristics are conservative defaults;
 * replace with the company's authoritative sizing tables before relying on
 * the output. SampleBadge is rendered everywhere synthetic estimates are
 * surfaced.
 */

type ViewMode = 'simple' | 'engineering';
type ControllerKind = 'MPPT' | 'PWM';
type InverterKind = 'off-grid' | 'hybrid' | 'grid-tied';
type BatteryChemistry = 'LFP' | 'NMC' | 'AGM' | 'Flooded';
type PanelArrangement = 'series' | 'parallel' | 'mixed';

interface Inputs {
  baseLoadKw: number;
  peakLoadKw: number;
  startingKva: number;
  altitudeM: number;
  ambientC: number;
  powerFactor: number;
  hoursPerDay: number;
  redundancy: 'N' | 'N+1';
  fuelTankL: number;
  upsAutonomyMin: number;
  supportMarginPct: number;
  priorityLoadKw: number;
  nonPriorityLoadKw: number;
  criticalLoadKw: number;
  nonCriticalLoadKw: number;
  batteryBankKwh: number;
  chargeCRate: number;
  /* ── new engineering inputs ── */
  panelWattage: number;
  panelArrangement: PanelArrangement;
  controllerKind: ControllerKind;
  controllerRatingA: number;
  inverterKind: InverterKind;
  batteryChemistry: BatteryChemistry;
  /* protection toggles (true = present) */
  hasDcBreaker: boolean;
  hasAcBreaker: boolean;
  hasIsolator: boolean;
  hasCombiner: boolean;
}

const DEFAULTS: Inputs = {
  baseLoadKw: 80,
  peakLoadKw: 160,
  startingKva: 90,
  altitudeM: 1700,
  ambientC: 28,
  powerFactor: 0.85,
  hoursPerDay: 8,
  redundancy: 'N+1',
  fuelTankL: 500,
  upsAutonomyMin: 15,
  supportMarginPct: 15,
  priorityLoadKw: 60,
  nonPriorityLoadKw: 100,
  criticalLoadKw: 25,
  nonCriticalLoadKw: 35,
  batteryBankKwh: 30,
  chargeCRate: 0.2,
  panelWattage: 550,
  panelArrangement: 'mixed',
  controllerKind: 'MPPT',
  controllerRatingA: 80,
  inverterKind: 'hybrid',
  batteryChemistry: 'LFP',
  hasDcBreaker: true,
  hasAcBreaker: true,
  hasIsolator: true,
  hasCombiner: true,
};

/* ────────── sizing model (transparent + conservative) ────────── */

function deratePercent(altitudeM: number, ambientC: number) {
  const altDerate = Math.max(0, (altitudeM - 1000) / 300) * 3;
  const tempDerate = Math.max(0, (ambientC - 25) / 5) * 2;
  return Math.min(35, altDerate + tempDerate);
}

function sizeGenerator(i: Inputs) {
  const derate = deratePercent(i.altitudeM, i.ambientC);
  const chargeDrawKw = i.batteryBankKwh * Math.max(0, Math.min(0.5, i.chargeCRate));
  const effectivePeakKw = (i.peakLoadKw + chargeDrawKw) * (1 + i.supportMarginPct / 100);
  const peakKva = effectivePeakKw / Math.max(0.6, Math.min(1, i.powerFactor));
  const startingKva = i.startingKva;
  const requiredKva = Math.max(peakKva * 1.25, startingKva * 1.6);
  const ratedKva = requiredKva / (1 - derate / 100);
  const standards = [40, 60, 80, 100, 125, 150, 200, 250, 300, 400, 500, 625, 800, 1000];
  const rated = standards.find((s) => s >= ratedKva) ?? Math.ceil(ratedKva / 50) * 50;
  return { derate, peakKva, requiredKva, ratedKva: rated, chargeDrawKw, effectivePeakKw };
}

function sizeFuel(i: Inputs, ratedKva: number) {
  const kwAt75 = ratedKva * 0.8 * 0.75;
  const lph = kwAt75 * 0.27;
  const runtimeH = i.fuelTankL / Math.max(lph, 0.1);
  return { lph, runtimeH };
}

function sizeUps(i: Inputs) {
  const kva = (i.baseLoadKw * 0.4) / Math.max(0.7, Math.min(1, i.powerFactor));
  const loadW = kva * 1000 * 0.7;
  const wh = (loadW * (i.upsAutonomyMin / 60)) / 0.9;
  return { kva, wh };
}

/* ────────── composition synthesis (panels/batteries → kW/kWh) ────────── */

const KWH_PER_BATTERY = 5;
/** Default panel wattage when the user hasn't set one yet (in kW). */
const DEFAULT_KW_PER_PANEL = 0.55;

function syntheticBankKwh(c: TopologyComposition) {
  return c.batteries * KWH_PER_BATTERY;
}
function syntheticSolarKwPeak(c: TopologyComposition, panelWattageW = DEFAULT_KW_PER_PANEL * 1000) {
  return (c.solarPanels * panelWattageW) / 1000;
}

/* ────────── battery chemistry → usable depth-of-discharge ────────── */

const CHEM_DOD: Record<BatteryChemistry, number> = {
  LFP:     0.9,
  NMC:     0.85,
  AGM:     0.5,
  Flooded: 0.4,
};

/* ────────── controller adequacy heuristic ────────── */
/**
 * Rough-cut: required charge current ≈ array peak / 48 V system bus.
 * If user-rated controller (A) < required by > 10 %, we flag undersized.
 * MPPT can harvest ~25 % more than PWM at the same array, so PWM users
 * with a high-V array hit the warn threshold sooner.
 */
function controllerUndersized(arrayKw: number, ratingA: number, kind: ControllerKind): boolean {
  if (arrayKw <= 0 || ratingA <= 0) return false;
  const sysV = 48;
  const requiredA = (arrayKw * 1000) / sysV / (kind === 'MPPT' ? 1.25 : 1.0);
  return ratingA < requiredA * 0.9;
}

/* ────────── component ────────── */

export default function SimulatorClient() {
  const [inputs, setInputs] = React.useState<Inputs>(DEFAULTS);
  const [comp, setComp] = React.useState<TopologyComposition>(TOPOLOGY_DEFAULTS);
  /**
   * View mode: 'simple' = customer-friendly diagram (panels → MPPT →
   * battery → inverter → load); 'engineering' = full topology cockpit
   * with multi-source bus + power-quality. Both views read the SAME state
   * so toggling never produces an inconsistent picture.
   */
  const [viewMode, setViewMode] = React.useState<ViewMode>('engineering');

  const effectiveInputs: Inputs = React.useMemo(
    () => ({
      ...inputs,
      batteryBankKwh: syntheticBankKwh(comp),
      redundancy: comp.generators >= 2 ? 'N+1' : 'N',
    }),
    [inputs, comp],
  );

  const set = <K extends keyof Inputs>(k: K) => (v: Inputs[K]) =>
    setInputs((prev) => ({ ...prev, [k]: v }));

  const gen = sizeGenerator(effectiveInputs);
  const fuel = sizeFuel(effectiveInputs, gen.ratedKva);
  const ups = sizeUps(effectiveInputs);

  /* live operational state — purely indicative */
  const solarKw = syntheticSolarKwPeak(comp, inputs.panelWattage);
  const solarCoveragePct = Math.min(100, (solarKw / Math.max(inputs.peakLoadKw, 1)) * 100);
  /* extra warning flags driven by the new engineering inputs */
  const ctrlUndersized = controllerUndersized(solarKw, inputs.controllerRatingA, inputs.controllerKind);
  const invUndersized = comp.inverters > 0 && inputs.peakLoadKw > comp.inverters * 8 * 1.0;
  const battMismatch = comp.batteries > 0 && (
    (inputs.batteryChemistry === 'AGM' || inputs.batteryChemistry === 'Flooded') &&
    inputs.chargeCRate > 0.2
  );
  const missingProtections: string[] = [];
  if (!inputs.hasDcBreaker && (comp.solarPanels > 0 || comp.batteries > 0)) missingProtections.push('DC breaker');
  if (!inputs.hasAcBreaker && comp.inverters > 0) missingProtections.push('AC breaker');
  if (!inputs.hasIsolator && (comp.solarPanels > 0 || comp.batteries > 0)) missingProtections.push('isolator');
  if (!inputs.hasCombiner && comp.solarPanels >= 6) missingProtections.push('combiner');
  const sourceMode: 'grid' | 'generator' | 'battery' = comp.gridConnected
    ? 'grid'
    : comp.generators > 0
    ? 'generator'
    : 'battery';
  const overload = effectiveInputs.peakLoadKw > gen.ratedKva * 0.9;
  const lowBattery = comp.batteries === 0 || syntheticBankKwh(comp) < ups.wh / 1000;
  const inverterMissing = comp.inverters === 0 && (comp.solarPanels > 0 || comp.batteries > 0);
  const upsMissing = comp.ups === 0 && inputs.criticalLoadKw > 0;

  const liveLoadKw = Math.max(
    inputs.baseLoadKw * 0.9,
    Math.min(inputs.peakLoadKw, inputs.baseLoadKw * 1.2),
  );
  const loadPct = Math.min(100, (liveLoadKw / Math.max(gen.ratedKva * 0.8, 1)) * 100);
  const loadKva = liveLoadKw / Math.max(0.6, Math.min(1, inputs.powerFactor));
  const lineV = 415;
  const lineI = (loadKva * 1000) / (Math.sqrt(3) * lineV);
  const socPct = comp.batteries === 0 ? 0 : Math.max(20, 78 - (lowBattery ? 35 : 0));
  const runtimeMin =
    comp.batteries === 0
      ? 0
      : ((syntheticBankKwh(comp) * (socPct / 100) * 1000) / Math.max(liveLoadKw * 1000, 1)) * 60;
  const supportMargin =
    ((gen.ratedKva - effectiveInputs.peakLoadKw / Math.max(0.6, Math.min(1, inputs.powerFactor))) /
      Math.max(gen.ratedKva, 1)) *
    100;

  const pq: PowerQuality = {
    thdPct: Math.min(
      12,
      2.5 + comp.solarPanels * 0.1 + (comp.inverters === 0 ? 4 : 0) + (overload ? 3 : 0),
    ),
    freqHz: 50 - (overload ? 0.6 : 0) - (sourceMode === 'generator' ? 0.15 : 0),
    voltageDeviationPct:
      (overload ? -7 : sourceMode === 'generator' ? -2 : 0) + (comp.gridConnected ? 0 : -1),
    phaseImbalancePct: 0.8 + (overload ? 2 : 0) + (comp.inverters > 1 ? 0.5 : 0),
    pf: inputs.powerFactor,
  };

  const alarms: AlarmSignal[] = [];
  if (overload)
    alarms.push({
      id: 'overload',
      severity: 'fault',
      label: 'Generator overload',
      detail: `Peak load > 90 % of ${gen.ratedKva} kVA`,
    });
  if (lowBattery && comp.batteries > 0)
    alarms.push({
      id: 'low-batt',
      severity: 'warn',
      label: 'Battery undersized',
      detail: 'Bank capacity below UPS autonomy target',
    });
  if (inverterMissing)
    alarms.push({
      id: 'no-inv',
      severity: 'fault',
      label: 'Inverter missing',
      detail: 'PV / battery present but no inverter selected',
    });
  if (upsMissing)
    alarms.push({
      id: 'no-ups',
      severity: 'warn',
      label: 'No UPS for critical loads',
      detail: `${inputs.criticalLoadKw} kW critical load without 0 ms transfer`,
    });
  if (inputs.criticalLoadKw > inputs.priorityLoadKw)
    alarms.push({
      id: 'crit-mismatch',
      severity: 'warn',
      label: 'Critical exceeds priority',
      detail: 'Reclassify or split UPS feed',
    });
  if (pq.thdPct >= 8)
    alarms.push({
      id: 'thd',
      severity: 'fault',
      label: 'High THD',
      detail: `${pq.thdPct.toFixed(1)} % > IEEE 519 limit`,
    });
  if (Math.abs(pq.freqHz - 50) >= 1)
    alarms.push({
      id: 'freq',
      severity: 'warn',
      label: 'Frequency drift',
      detail: `${pq.freqHz.toFixed(2)} Hz`,
    });

  const verdictState: 'ok' | 'warn' | 'fault' = alarms.some((a) => a.severity === 'fault')
    ? 'fault'
    : alarms.length > 0
    ? 'warn'
    : 'ok';

  const HOURS = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`);
  const profile = HOURS.map((_, h) => {
    const day = h >= 7 && h <= 18 ? 1 : 0.5;
    const peak = h >= 9 && h <= 12 ? 1 : h >= 14 && h <= 17 ? 0.95 : 0.7;
    return Math.round(
      inputs.baseLoadKw * day * peak +
        (inputs.peakLoadKw - inputs.baseLoadKw) * day * peak * 0.3,
    );
  });

  return (
    <CockpitFrame className="overflow-hidden min-h-[calc(100vh-180px)] bg-[color:var(--color-surface-raised)]">
      {/* HEADER: Premium, compact, engineering focus */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-2.5 shadow-sm bg-[color:var(--color-surface-base)]/95 backdrop-blur-md" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg text-[11px] font-bold tracking-tight shadow" style={{ background: 'linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-deep) 100%)', color: 'var(--color-text-inverse)' }} aria-hidden>SU</span>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Live cockpit · {comp.gridConnected ? 'grid-connected' : 'islanded'}</div>
            <div className="text-[13px] font-semibold text-[color:var(--color-text-primary)]">{effectiveInputs.redundancy} redundancy · <SampleBadge /></div>
          </div>
        </div>
        <LampBar items={[
          { state: comp.gridConnected ? 'ok' : 'off', label: 'Grid' },
          { state: comp.generators > 0 ? (sourceMode === 'generator' ? 'ok' : 'info') : 'off', label: 'Gen' },
          { state: comp.solarPanels > 0 ? 'info' : 'off', label: 'Solar' },
          { state: comp.ups > 0 ? 'ok' : 'warn', label: 'UPS' },
          { state: lowBattery ? 'warn' : comp.batteries > 0 ? 'ok' : 'off', label: 'Battery' },
          { state: overload ? 'fault' : 'ok', label: 'Load' },
        ]} />
        <AlarmController signals={alarms} />
      </header>

      {/* MAIN PANEL: Simulator focus, premium grouping */}
      <main className="grid gap-6 px-6 py-6 lg:grid-cols-[1.2fr_0.9fr] xl:grid-cols-[1.2fr_0.7fr]">
        {/* Left: Topology + Inputs + Harmonics */}
        <section className="space-y-6">
          <CockpitPanel
            eyebrow="System schematic"
            title="Live one-line diagram"
            right={
              <div className="flex items-center gap-2">
                <ViewModeToggle value={viewMode} onChange={setViewMode} />
                <SampleBadge />
              </div>
            }
            className="shadow-md rounded-xl bg-[color:var(--color-surface-base)]/95"
          >
            {viewMode === 'simple' ? (
              <SimpleSolarBoard
                state={{
                  panels: comp.solarPanels,
                  batteries: comp.batteries,
                  inverters: comp.inverters,
                  controllerKind: inputs.controllerKind,
                  inverterKind: inputs.inverterKind,
                  gridConnected: comp.gridConnected,
                  solarKwp: solarKw,
                  bankKwh: syntheticBankKwh(comp),
                  socPct,
                  loadKw: liveLoadKw,
                  runtimeMin,
                  overload,
                  inverterUndersized: invUndersized,
                  controllerUndersized: ctrlUndersized,
                  batteryMismatch: battMismatch,
                  missingProtections,
                }}
              />
            ) : (
              <TopologyBoard
                composition={comp}
                onChange={setComp}
                flow={{ sourceMode, overload, lowBattery, solarActive: comp.solarPanels > 0 }}
                liveAnnotations={{
                  loadKw: liveLoadKw,
                  lineA: lineI,
                  lineV: lineV,
                  socPct: socPct,
                  runtimeMin: runtimeMin,
                  solarKw: solarKw,
                }}
              />
            )}
          </CockpitPanel>

          <CockpitPanel variant="raised" eyebrow="Configuration" title="Site, loads, system, redundancy" right={<SampleBadge />} className="shadow rounded-xl bg-[color:var(--color-surface-base)]/95">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
              <FieldGroup title="Site">
                <NumberField label="Altitude" value={inputs.altitudeM} unit="m" step={50} onChange={set('altitudeM')} />
                <NumberField label="Ambient" value={inputs.ambientC} unit="°C" step={1} onChange={set('ambientC')} />
                <NumberField label="Power factor" value={inputs.powerFactor} unit="" step={0.05} min={0.6} max={1} onChange={set('powerFactor')} />
                <NumberField label="Runtime/day" value={inputs.hoursPerDay} unit="h" step={1} onChange={set('hoursPerDay')} />
              </FieldGroup>
              <FieldGroup title="Loads">
                <NumberField label="Base load" value={inputs.baseLoadKw} unit="kW" step={5} onChange={set('baseLoadKw')} />
                <NumberField label="Peak load" value={inputs.peakLoadKw} unit="kW" step={5} onChange={set('peakLoadKw')} />
                <NumberField label="Largest motor" value={inputs.startingKva} unit="kVA" step={5} onChange={set('startingKva')} />
                <NumberField label="Priority" value={inputs.priorityLoadKw} unit="kW" step={5} min={0} onChange={set('priorityLoadKw')} />
                <NumberField label="Non-priority" value={inputs.nonPriorityLoadKw} unit="kW" step={5} min={0} onChange={set('nonPriorityLoadKw')} />
                <NumberField label="Critical (0 ms)" value={inputs.criticalLoadKw} unit="kW" step={1} min={0} onChange={set('criticalLoadKw')} />
                <NumberField label="Non-critical" value={inputs.nonCriticalLoadKw} unit="kW" step={1} min={0} onChange={set('nonCriticalLoadKw')} />
              </FieldGroup>
              <FieldGroup title="System">
                <NumberField label="Support margin" value={inputs.supportMarginPct} unit="%" step={1} min={0} max={50} onChange={set('supportMarginPct')} />
                <NumberField label="Fuel tank" value={inputs.fuelTankL} unit="L" step={50} onChange={set('fuelTankL')} />
                <ReadOnlyField label="Battery bank (composed)" value={syntheticBankKwh(comp)} unit="kWh" />
                <ReadOnlyField label="Solar peak (composed)" value={syntheticSolarKwPeak(comp, inputs.panelWattage)} unit="kW" />
              </FieldGroup>
              <FieldGroup title="UPS / Backup / Redundancy">
                <NumberField label="UPS autonomy" value={inputs.upsAutonomyMin} unit="min" step={5} onChange={set('upsAutonomyMin')} />
                <NumberField label="Charge C-rate" value={inputs.chargeCRate} unit="C" step={0.05} min={0} max={0.5} onChange={set('chargeCRate')} />
                <ReadOnlyField label="Redundancy (composed)" value={effectiveInputs.redundancy} unit="" />
              </FieldGroup>
              <FieldGroup title="PV array">
                <NumberField label="Panel wattage" value={inputs.panelWattage} unit="W" step={5} min={50} max={1000} onChange={set('panelWattage')} />
                <SelectField
                  label="Arrangement"
                  value={inputs.panelArrangement}
                  options={[
                    { value: 'series', label: 'Series' },
                    { value: 'parallel', label: 'Parallel' },
                    { value: 'mixed', label: 'Mixed' },
                  ]}
                  onChange={set('panelArrangement')}
                />
                <ReadOnlyField label="Array peak (live)" value={solarKw} unit="kW" />
              </FieldGroup>
              <FieldGroup title="Charge controller">
                <SelectField
                  label="Type"
                  value={inputs.controllerKind}
                  options={[
                    { value: 'MPPT', label: 'MPPT' },
                    { value: 'PWM', label: 'PWM' },
                  ]}
                  onChange={set('controllerKind')}
                />
                <NumberField label="Controller rating" value={inputs.controllerRatingA} unit="A" step={5} min={5} max={400} onChange={set('controllerRatingA')} />
              </FieldGroup>
              <FieldGroup title="Inverter & battery">
                <SelectField
                  label="Inverter type"
                  value={inputs.inverterKind}
                  options={[
                    { value: 'off-grid', label: 'Off-grid' },
                    { value: 'hybrid', label: 'Hybrid' },
                    { value: 'grid-tied', label: 'Grid-tied' },
                  ]}
                  onChange={set('inverterKind')}
                />
                <SelectField
                  label="Battery chemistry"
                  value={inputs.batteryChemistry}
                  options={[
                    { value: 'LFP', label: 'LFP (LiFePO₄)' },
                    { value: 'NMC', label: 'NMC' },
                    { value: 'AGM', label: 'AGM' },
                    { value: 'Flooded', label: 'Flooded' },
                  ]}
                  onChange={set('batteryChemistry')}
                />
                <ReadOnlyField label="Usable DoD" value={Math.round(CHEM_DOD[inputs.batteryChemistry] * 100)} unit="%" />
              </FieldGroup>
              <FieldGroup title="Protections (present)">
                <CheckboxField label="DC breaker" checked={inputs.hasDcBreaker} onChange={set('hasDcBreaker')} />
                <CheckboxField label="AC breaker" checked={inputs.hasAcBreaker} onChange={set('hasAcBreaker')} />
                <CheckboxField label="Isolator"   checked={inputs.hasIsolator}  onChange={set('hasIsolator')} />
                <CheckboxField label="Combiner box" checked={inputs.hasCombiner} onChange={set('hasCombiner')} />
              </FieldGroup>
            </div>
          </CockpitPanel>

          <CockpitPanel eyebrow="Power quality" title="Harmonics & PQ" right={<SampleBadge />} className="shadow rounded-xl bg-[color:var(--color-surface-base)]/95">
            <HarmonicsPanel pq={pq} />
          </CockpitPanel>
        </section>

        {/* Right: Premium verdict, KPIs, gauges, chart */}
        <section className="space-y-6">
          <CockpitPanel variant="verdict" eyebrow="Sizing verdict" title="Recommendation" right={<SampleBadge />} className="shadow-lg rounded-xl bg-[color:var(--color-surface-base)]/95 border border-[color:var(--color-border-subtle)]">
            <div className="flex flex-col items-center justify-center gap-4 py-2">
              <div className="flex items-end gap-4">
                <span className="font-semibold tabular-nums drop-shadow-lg" style={{ color: '#0a2540', fontFamily: 'ui-monospace, "JetBrains Mono", monospace', fontSize: 'clamp(56px, 8vw, 96px)', lineHeight: 1, letterSpacing: '-0.02em' }}>{formatValue(gen.ratedKva, { decimals: 0 })}</span>
                <span className="font-bold text-2xl" style={{ color: 'var(--color-brand-blue)' }}>kVA</span>
              </div>
              <StatusLight state={verdictState} label={verdictState === 'ok' ? 'Adequate' : verdictState === 'warn' ? 'Caution' : 'Not adequate'} size="md" />
              <ul className="mt-2 space-y-1.5">
                {alarms.slice(0, 4).map((a) => (
                  <li key={a.id} className="flex items-start gap-2 text-[13px]">
                    <StatusLight state={a.severity === 'fault' ? 'fault' : 'warn'} label="" size="sm" />
                    <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{a.label}</span>
                    {a.detail ? <span style={{ color: 'var(--color-text-muted)' }}>— {a.detail}</span> : null}
                  </li>
                ))}
                {alarms.length === 0 && <li className="text-[13px]" style={{ color: 'var(--color-status-ok)' }}>No fault conditions — configuration meets modelled demand.</li>}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <DigitalReadout label="Required (pre-derate)" value={gen.requiredKva} unit="kVA" decimals={0} status="info" />
              <DigitalReadout label="Fuel burn @ 75 %" value={fuel.lph} unit="L/h" decimals={1} status="info" />
              <DigitalReadout label="Tank runtime" value={fuel.runtimeH} unit="h" decimals={1} status={fuel.runtimeH < 12 ? 'warn' : 'ok'} />
              <DigitalReadout label="UPS rating" value={ups.kva} unit="kVA" decimals={1} status="info" />
              <DigitalReadout label="UPS battery" value={ups.wh / 1000} unit="kWh" decimals={2} status="info" />
              <DigitalReadout label="Support margin" value={Math.max(0, supportMargin)} unit="%" decimals={1} status={supportMargin < 10 ? 'fault' : supportMargin < 20 ? 'warn' : 'ok'} />
            </div>
          </CockpitPanel>

          <CockpitPanel eyebrow="Site derate" title="Combined altitude + ambient" right={<SampleBadge />} className="shadow rounded-xl bg-[color:var(--color-surface-base)]/95">
            <div className="flex flex-col items-center gap-2">
              <Gauge label="Derate" value={gen.derate} min={0} max={35} unit="%" decimals={1} thresholds={{ warning: 12, danger: 22, invert: true }} size={120} className="drop-shadow" />
              <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Altitude {formatValue(inputs.altitudeM, { unit: 'm' })} · ambient {formatValue(inputs.ambientC, { unit: '°C' })}.</p>
            </div>
          </CockpitPanel>

          <CockpitPanel eyebrow="24 h forecast" title="Synthetic load profile" right={<SampleBadge />} className="shadow rounded-xl bg-[color:var(--color-surface-base)]/95">
            <div className="rounded-md p-1 bg-[color:var(--color-surface-raised)]">
              <LockedChart type="line" title="Predicted load" caption="Indicative shaping from base/peak inputs" unit="kW" decimals={0} labels={HOURS} series={[{ label: 'Load', data: profile }]} />
            </div>
          </CockpitPanel>
        </section>
      </main>
      <div className="px-6 pb-6">
        <HubConnectStrip active="/hub/simulator" />
      </div>
    </CockpitFrame>
  );
}

/* ──────────────────────────── form primitives ──────────────────────────── */

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <div
        className="mb-2 flex items-center gap-2 border-b pb-1.5"
        style={{ borderColor: 'var(--cockpit-rail)' }}
      >
        <span className="h-[2px] w-3" style={{ background: 'var(--cockpit-accent)' }} />
        <legend
          className="text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: 'var(--cockpit-ink-muted)' }}
        >
          {title}
        </legend>
      </div>
      <div className="space-y-2.5">{children}</div>
    </fieldset>
  );
}

function NumberField({
  label,
  value,
  unit,
  step = 1,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  step?: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span
        className="mb-1 flex items-baseline justify-between text-[11px] font-medium"
        style={{ color: 'var(--cockpit-ink-muted)' }}
      >
        <span>{label}</span>
        <span style={{ color: 'var(--cockpit-ink-unit)' }}>{unit || '—'}</span>
      </span>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n)) onChange(n);
        }}
        className="w-full rounded-md border px-2.5 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-2"
        style={{
          borderColor: 'var(--cockpit-rail)',
          background: 'var(--cockpit-field-bg)',
          color: 'var(--cockpit-ink)',
          fontFamily: 'ui-monospace, monospace',
          // @ts-expect-error custom prop fallback
          '--tw-ring-color': 'var(--cockpit-trace-active)',
        }}
      />
    </label>
  );
}

function ReadOnlyField({
  label,
  value,
  unit,
}: {
  label: string;
  value: number | string;
  unit: string;
}) {
  return (
    <div>
      <div
        className="mb-1 flex items-baseline justify-between text-[11px] font-medium"
        style={{ color: 'var(--cockpit-ink-muted)' }}
      >
        <span>{label}</span>
        <span style={{ color: 'var(--cockpit-ink-unit)' }}>{unit || '—'}</span>
      </div>
      <div
        className="rounded-md border px-2.5 py-1.5 text-sm tabular-nums"
        style={{
          borderColor: 'var(--cockpit-rail)',
          background: 'var(--cockpit-field-bg-readonly)',
          color: 'var(--cockpit-ink)',
          fontFamily: 'ui-monospace, monospace',
        }}
      >
        {typeof value === 'number'
          ? value.toLocaleString('en-US', { maximumFractionDigits: 1 })
          : value}
      </div>
    </div>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <label className="block">
      <span
        className="mb-1 flex items-baseline justify-between text-[11px] font-medium"
        style={{ color: 'var(--cockpit-ink-muted)' }}
      >
        <span>{label}</span>
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-md border px-2.5 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-2"
        style={{
          borderColor: 'var(--cockpit-rail)',
          background: 'var(--cockpit-field-bg)',
          color: 'var(--cockpit-ink)',
          fontFamily: 'ui-monospace, monospace',
          // @ts-expect-error custom prop fallback
          '--tw-ring-color': 'var(--cockpit-trace-active)',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-[12px] font-medium" style={{ color: 'var(--cockpit-ink)' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border"
        style={{ borderColor: 'var(--cockpit-rail)', accentColor: 'var(--cockpit-trace-active, #4cd2ee)' }}
      />
      <span>{label}</span>
    </label>
  );
}

function ViewModeToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Diagram view mode"
      className="inline-flex items-center rounded-md border text-[11px] font-semibold"
      style={{ borderColor: 'var(--color-border-subtle, rgba(140,170,220,0.25))' }}
    >
      {(['simple', 'engineering'] as const).map((m) => {
        const active = value === m;
        return (
          <button
            key={m}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m)}
            className="px-2.5 py-1 uppercase tracking-[0.16em] focus:outline-none"
            style={{
              background: active ? 'var(--cockpit-trace-active, #4cd2ee)' : 'transparent',
              color: active ? '#0b1220' : 'var(--cockpit-ink-muted, #8a9bb8)',
            }}
          >
            {m === 'simple' ? 'Simple' : 'Engineering'}
          </button>
        );
      })}
    </div>
  );
}
