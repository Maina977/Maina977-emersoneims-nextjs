'use client';

/**
 * UPS Live Lab — interactive cockpit edition.
 *
 * Purpose: a live, add-and-see UPS engineering console. The user picks a UPS
 * model, drops in loads, and the cockpit shows in real time:
 *   • input power coming in (mains)
 *   • output power being delivered to the connected loads
 *   • UPS conversion losses, headroom, runtime on battery
 *   • alarms (overload / mismatch / low autonomy / no UPS / no loads)
 *   • status lights, blinkers, alarm beeper (browser-safe AlarmController)
 *   • topology-style "what's powering what" board
 *
 * This file deliberately mirrors the cockpit family used in
 * `/hub/simulator` — same primitives (CockpitFrame, CockpitPanel, StatusLight,
 * DigitalReadout, AlarmController) and the same dark instrument palette.
 *
 * The grading and risk language is neutral; no manufacturer is accused of
 * any wrongdoing. Sample/demo numbers are labelled with SampleBadge.
 */

import * as React from 'react';
import Link from 'next/link';
import { Card, SectionHeading, SampleBadge, HubConnectStrip } from '@/components/hub/HubShell';
import { formatValue } from '@/components/charts/dataviz';
import { CockpitFrame, CockpitPanel, CockpitDivider } from '@/components/hub/cockpit/CockpitPanel';
import { StatusLight, LampBar } from '@/components/hub/cockpit/StatusLight';
import { DigitalReadout } from '@/components/hub/cockpit/DigitalReadout';
import { AlarmController, type AlarmSignal } from '@/components/hub/cockpit/AlarmController';
import { UpsTopologyBoard, type UpsTopologyState } from '@/components/hub/cockpit/UpsTopologyBoard';

/* ────────── Catalogue: UPS models ────────── */

type Topology = 'Online double-conversion' | 'Line-interactive' | 'Modular online';

interface UpsModel {
  id: string;
  brand: string;
  name: string;
  ratingKva: number;
  pf: number; // output power factor
  efficiency: number; // online efficiency at 50–75 % load
  topology: Topology;
  batteryWh: number; // internal battery energy at full charge (sample)
  transferMs: number; // 0 for online; 4–10 for line-interactive
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  note: string;
}

const UPS_MODELS: UpsModel[] = [
  { id: 'eaton-9px-6',   brand: 'Eaton',      name: '9PX 6 kVA',            ratingKva: 6,  pf: 0.9,  efficiency: 0.94, topology: 'Online double-conversion', batteryWh: 1_400,  transferMs: 0,  grade: 'A', note: 'Server rack / small data hall standby' },
  { id: 'apc-srt-10',    brand: 'APC',        name: 'Smart-UPS SRT 10 kVA', ratingKva: 10, pf: 0.9,  efficiency: 0.94, topology: 'Online double-conversion', batteryWh: 2_100,  transferMs: 0,  grade: 'A', note: 'Critical IT infrastructure' },
  { id: 'vertiv-apm-20', brand: 'Vertiv',     name: 'Liebert APM 20 kVA',   ratingKva: 20, pf: 0.95, efficiency: 0.96, topology: 'Modular online',           batteryWh: 4_200,  transferMs: 0,  grade: 'A', note: 'Modular DC UPS — N+1 module redundancy' },
  { id: 'riello-mst-15', brand: 'Riello',     name: 'Multi Sentry MST 15',  ratingKva: 15, pf: 0.9,  efficiency: 0.94, topology: 'Online double-conversion', batteryWh: 3_200,  transferMs: 0,  grade: 'B', note: 'Industrial / commercial' },
  { id: 'cyber-ol-3',    brand: 'CyberPower', name: 'OL3000ERT2U 3 kVA',    ratingKva: 3,  pf: 0.9,  efficiency: 0.92, topology: 'Online double-conversion', batteryWh: 720,    transferMs: 0,  grade: 'C', note: 'Workstation / network closet' },
  { id: 'apc-smt-2200',  brand: 'APC',        name: 'Smart-UPS SMT 2200',   ratingKva: 2.2,pf: 0.9,  efficiency: 0.95, topology: 'Line-interactive',         batteryWh: 480,    transferMs: 6,  grade: 'B', note: 'Office IT closet, light-duty' },
  { id: 'eaton-5p-1500', brand: 'Eaton',      name: '5P 1550i',             ratingKva: 1.55,pf: 0.9, efficiency: 0.95, topology: 'Line-interactive',         batteryWh: 320,    transferMs: 4,  grade: 'B', note: 'Single rack / desktop tower' },
  { id: 'oem-li-2',      brand: 'Generic OEM',name: '2 kVA Line-Interactive',ratingKva: 2, pf: 0.7,  efficiency: 0.88, topology: 'Line-interactive',         batteryWh: 240,    transferMs: 8,  grade: 'F', note: 'Light desktop only — verify documentation' },
];

/* ────────── Catalogue: Loads (add-and-see) ────────── */

type LoadKind =
  | 'computer' | 'server' | 'switch' | 'monitor'
  | 'fridge' | 'tv' | 'led-bulb' | 'cooker'
  | 'washing-machine' | 'heater' | 'air-conditioner' | 'pump';

interface LoadType {
  id: LoadKind;
  label: string;
  category: 'IT' | 'Appliance' | 'Motor' | 'Heat' | 'Lighting';
  watts: number;       // continuous draw
  startMult: number;   // surge multiplier (motors)
  pf: number;          // load PF
  upsAdvised: boolean; // is putting this on a UPS sensible?
  emoji: string;
}

const LOAD_TYPES: LoadType[] = [
  { id: 'computer',        label: 'Computer (desktop)', category: 'IT',        watts: 250,   startMult: 1.2, pf: 0.95, upsAdvised: true,  emoji: '🖥️' },
  { id: 'server',          label: 'Rack server',         category: 'IT',        watts: 600,   startMult: 1.3, pf: 0.95, upsAdvised: true,  emoji: '🗄️' },
  { id: 'switch',          label: 'Network switch',      category: 'IT',        watts: 60,    startMult: 1.1, pf: 0.95, upsAdvised: true,  emoji: '🌐' },
  { id: 'monitor',         label: 'Monitor 27"',         category: 'IT',        watts: 45,    startMult: 1.1, pf: 0.95, upsAdvised: true,  emoji: '🖼️' },
  { id: 'fridge',          label: 'Fridge / freezer',    category: 'Appliance', watts: 200,   startMult: 4.0, pf: 0.75, upsAdvised: true,  emoji: '🧊' },
  { id: 'tv',              label: 'TV (LED)',            category: 'Appliance', watts: 110,   startMult: 1.1, pf: 0.9,  upsAdvised: true,  emoji: '📺' },
  { id: 'led-bulb',        label: 'LED bulb',            category: 'Lighting',  watts: 9,     startMult: 1.0, pf: 0.9,  upsAdvised: true,  emoji: '💡' },
  { id: 'cooker',          label: 'Electric cooker',     category: 'Heat',      watts: 2_400, startMult: 1.0, pf: 1.0,  upsAdvised: false, emoji: '🍳' },
  { id: 'washing-machine', label: 'Washing machine',     category: 'Motor',     watts: 800,   startMult: 3.5, pf: 0.7,  upsAdvised: false, emoji: '🧺' },
  { id: 'heater',          label: 'Room heater',         category: 'Heat',      watts: 2_000, startMult: 1.0, pf: 1.0,  upsAdvised: false, emoji: '🔥' },
  { id: 'air-conditioner', label: 'Air conditioner 1.5HP',category: 'Motor',    watts: 1_500, startMult: 4.0, pf: 0.85, upsAdvised: false, emoji: '❄️' },
  { id: 'pump',            label: 'Borehole pump 1HP',   category: 'Motor',     watts: 750,   startMult: 4.0, pf: 0.85, upsAdvised: false, emoji: '⛽' },
];

/* ────────── State + math ────────── */

interface UpsRow { modelId: string; qty: number }
interface LoadRow { kind: LoadKind; qty: number }

interface Composition {
  ups: UpsRow[];
  loads: LoadRow[];
  mainsPresent: boolean;
}

const DEFAULT_COMPOSITION: Composition = {
  ups: [{ modelId: 'eaton-9px-6', qty: 1 }],
  loads: [
    { kind: 'server', qty: 2 },
    { kind: 'switch', qty: 2 },
    { kind: 'monitor', qty: 2 },
  ],
  mainsPresent: true,
};

interface LiveResult {
  upsCapacityW: number;     // sum of model.kVA × pf × 1000
  upsBatteryWh: number;     // sum of model.batteryWh
  upsAvgEff: number;
  loadContinuousW: number;
  loadStartingW: number;
  loadAdvisedW: number;     // load actually appropriate for UPS
  inputW: number;           // mains input the UPS pulls (load + losses) when mains present
  outputW: number;          // delivered to load
  headroomPct: number;      // (capacity - load) / capacity
  runtimeMin: number;       // battery runtime in minutes
  isOverloaded: boolean;
  isMismatched: boolean;    // motor/heat loads on UPS
  hasNoUps: boolean;
  hasNoLoad: boolean;
  signals: AlarmSignal[];
  topology: Topology[];
}

function compute(c: Composition): LiveResult {
  const ups = c.ups.map((r) => ({ row: r, model: UPS_MODELS.find((m) => m.id === r.modelId)! })).filter((x) => x.model);
  const loads = c.loads.map((r) => ({ row: r, type: LOAD_TYPES.find((t) => t.id === r.kind)! })).filter((x) => x.type);

  const upsCapacityW = ups.reduce((a, x) => a + x.model.ratingKva * 1000 * x.model.pf * x.row.qty, 0);
  const upsBatteryWh = ups.reduce((a, x) => a + x.model.batteryWh * x.row.qty, 0);
  const upsAvgEff = ups.length === 0
    ? 0.94
    : ups.reduce((a, x) => a + x.model.efficiency * x.row.qty, 0) / Math.max(1, ups.reduce((a, x) => a + x.row.qty, 0));

  const loadContinuousW = loads.reduce((a, x) => a + x.type.watts * x.row.qty, 0);
  const loadStartingW = Math.max(
    loadContinuousW,
    loads.reduce((peak, x) => Math.max(peak, x.type.watts * x.row.qty * x.type.startMult), 0),
  );
  const loadAdvisedW = loads
    .filter((x) => x.type.upsAdvised)
    .reduce((a, x) => a + x.type.watts * x.row.qty, 0);

  const isOverloaded = upsCapacityW > 0 && loadStartingW > upsCapacityW * 1.05;
  const hasNoUps = ups.length === 0 || upsCapacityW === 0;
  const hasNoLoad = loads.length === 0 || loadContinuousW === 0;

  const motorOrHeatOnUps = loads.some((x) => !x.type.upsAdvised && x.row.qty > 0);

  const outputW = c.mainsPresent || upsBatteryWh > 0 ? Math.min(loadContinuousW, upsCapacityW || loadContinuousW) : 0;
  const inputW = c.mainsPresent ? outputW / Math.max(0.5, upsAvgEff) : 0;

  const headroomPct = upsCapacityW > 0 ? Math.max(-100, ((upsCapacityW - loadContinuousW) / upsCapacityW) * 100) : 0;

  // Battery runtime — usable energy at avg efficiency, 90 % DoD, sample heuristic.
  const usableWh = upsBatteryWh * 0.9 * upsAvgEff;
  const runtimeMin = loadContinuousW > 0 ? (usableWh / loadContinuousW) * 60 : Infinity;

  const signals: AlarmSignal[] = [];
  if (hasNoUps && !hasNoLoad) signals.push({ id: 'no-ups',   severity: 'fault', label: 'No UPS in the system',          detail: 'Add a UPS to support the connected loads.' });
  if (isOverloaded)            signals.push({ id: 'overload', severity: 'fault', label: 'UPS overload — surge exceeds capacity', detail: `Surge ${formatValue(loadStartingW/1000,{unit:'kW',decimals:2})} > UPS ${formatValue(upsCapacityW/1000,{unit:'kW',decimals:2})}.` });
  if (!isOverloaded && upsCapacityW > 0 && loadContinuousW > upsCapacityW * 0.85) signals.push({ id: 'high-load', severity: 'warn', label: 'Continuous load > 85 % UPS capacity', detail: 'Reduces battery life and runtime margin.' });
  if (motorOrHeatOnUps)        signals.push({ id: 'mismatch', severity: 'warn',  label: 'Motor / heating load on UPS',   detail: 'Motors and resistive heaters are not advised on UPS — move to mains/genset and keep UPS for IT/critical only.' });
  if (!hasNoUps && upsBatteryWh > 0 && loadContinuousW > 0 && runtimeMin < 5) signals.push({ id: 'short-runtime', severity: 'warn', label: 'Battery runtime < 5 min', detail: 'Increase UPS rating, add EBM modules or extend battery autonomy.' });
  if (!c.mainsPresent && upsBatteryWh === 0) signals.push({ id: 'no-power', severity: 'fault', label: 'Mains down and no battery available', detail: 'Output is zero — the system cannot support the load.' });

  const topology = Array.from(new Set(ups.map((x) => x.model.topology)));
  return {
    upsCapacityW, upsBatteryWh, upsAvgEff,
    loadContinuousW, loadStartingW, loadAdvisedW,
    inputW, outputW, headroomPct, runtimeMin,
    isOverloaded, isMismatched: motorOrHeatOnUps, hasNoUps, hasNoLoad,
    signals, topology,
  };
}

/* ────────── Live-tick: gentle ±2 % shimmer on the readouts so the cockpit
   "feels" alive without changing the underlying engineering math. The tick
   pauses while the tab is hidden (saves CPU/battery on mobile and on
   low-end devices) and is disabled entirely for users who prefer reduced
   motion. ────────── */

function useShimmer() {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return; // honour OS-level motion preference, no shimmer

    let id: number | null = null;
    const start = () => {
      if (id != null) return;
      id = window.setInterval(() => setT((x) => x + 1), 1500);
    };
    const stop = () => {
      if (id != null) { window.clearInterval(id); id = null; }
    };
    const onVis = () => { document.hidden ? stop() : start(); };

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVis);
    return () => { stop(); document.removeEventListener('visibilitychange', onVis); };
  }, []);
  // Pseudo-noise in [-0.02, +0.02]
  return ((Math.sin(t * 0.7) + Math.sin(t * 1.3)) * 0.01);
}

/* ────────── UI ────────── */

export default function UpsLabClient() {
  const [comp, setComp] = React.useState<Composition>(DEFAULT_COMPOSITION);
  const result = React.useMemo(() => compute(comp), [comp]);
  const noise = useShimmer();
  const live = (w: number) => w * (1 + noise);

  function setUpsQty(modelId: string, qty: number) {
    setComp((c) => {
      const exists = c.ups.find((r) => r.modelId === modelId);
      if (qty <= 0) return { ...c, ups: c.ups.filter((r) => r.modelId !== modelId) };
      if (exists) return { ...c, ups: c.ups.map((r) => (r.modelId === modelId ? { ...r, qty } : r)) };
      return { ...c, ups: [...c.ups, { modelId, qty }] };
    });
  }

  function setLoadQty(kind: LoadKind, qty: number) {
    setComp((c) => {
      const exists = c.loads.find((r) => r.kind === kind);
      if (qty <= 0) return { ...c, loads: c.loads.filter((r) => r.kind !== kind) };
      if (exists) return { ...c, loads: c.loads.map((r) => (r.kind === kind ? { ...r, qty } : r)) };
      return { ...c, loads: [...c.loads, { kind, qty }] };
    });
  }

  const overallLamp: 'ok' | 'warn' | 'fault' =
    result.signals.some((s) => s.severity === 'fault') ? 'fault'
    : result.signals.length > 0 ? 'warn' : 'ok';

  return (
    <div className="space-y-6">
      {/* ───── Live cockpit ───── */}
      <CockpitFrame className="p-4 md:p-5">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--cockpit-ink-muted)' }}>
              UPS Live Cockpit · sample dataset
            </div>
            <h2 className="mt-0.5 text-lg font-semibold tracking-tight" style={{ color: 'var(--cockpit-ink)' }}>
              Mains → UPS → Connected loads
            </h2>
          </div>
          <LampBar
            items={[
              { state: comp.mainsPresent ? 'info' : 'off', label: 'Mains' },
              { state: result.hasNoUps ? 'off' : 'ok', label: 'UPS' },
              { state: result.hasNoLoad ? 'off' : 'ok', label: 'Load' },
              { state: overallLamp, label: 'System' },
            ]}
          />
        </div>

        {/* Instrument cluster: input / through / output */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <DigitalReadout
            label="Input from mains"
            value={live(result.inputW) / 1000}
            unit="kW"
            decimals={2}
            status={comp.mainsPresent ? 'info' : 'fault'}
            caption={comp.mainsPresent ? 'Live · drawing from utility' : 'Mains down · running on battery'}
            size="lg"
          />
          <DigitalReadout
            label="UPS capacity"
            value={result.upsCapacityW / 1000}
            unit="kW"
            decimals={2}
            status={result.hasNoUps ? 'fault' : 'ok'}
            caption={`Σ rating · pf ${(result.upsAvgEff*100/100).toFixed(2)} eff ${(result.upsAvgEff*100).toFixed(0)} %`}
            size="lg"
          />
          <DigitalReadout
            label="Load demand"
            value={live(result.loadContinuousW) / 1000}
            unit="kW"
            decimals={2}
            status={result.isOverloaded ? 'fault' : (result.headroomPct < 15 ? 'warn' : 'ok')}
            caption={`Surge ${(result.loadStartingW/1000).toFixed(2)} kW`}
            size="lg"
          />
          <DigitalReadout
            label="Output to loads"
            value={live(result.outputW) / 1000}
            unit="kW"
            decimals={2}
            status={result.outputW === 0 ? 'fault' : 'ok'}
            caption={`Headroom ${result.headroomPct.toFixed(0)} % · runtime ${Number.isFinite(result.runtimeMin) ? result.runtimeMin.toFixed(1) + ' min' : '—'}`}
            size="lg"
          />
        </div>

        <CockpitDivider />

        {/* Live one-line schematic — dynamic SVG that reflects mains/battery,
            UPS count, capacity, load, and overload state in real time. */}
        <CockpitPanel eyebrow="System schematic" title="Live one-line diagram" right={<SampleBadge />}>
          <UpsTopologyBoard state={toUpsTopologyState(comp, result)} />
          <p className="mt-2 text-[11px]" style={{ color: 'var(--cockpit-ink-muted)' }}>
            Mains, rectifier, DC bus, battery branch, inverter, static bypass and output bus update as you add UPS units, change loads, or drop the mains.
            Annotations show live kW on the input/output traces and remaining battery runtime when running on battery.
          </p>
        </CockpitPanel>

        <CockpitDivider />

        {/* Power-flow board */}
        <PowerFlowBoard comp={comp} result={result} />

        <CockpitDivider />

        {/* Alarms + status lights */}
        <div className="grid gap-3 md:grid-cols-[1.1fr_1fr]">
          <CockpitPanel eyebrow="Annunciator" title="Live alarms" right={<SampleBadge />}>
            <AlarmController signals={result.signals} />
            <ul className="mt-3 space-y-1.5">
              {result.signals.length === 0 && (
                <li className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--cockpit-ink-muted)' }}>
                  <StatusLight state="ok" label="All systems nominal" />
                </li>
              )}
              {result.signals.map((s) => (
                <li key={s.id} className="rounded-md border px-3 py-2" style={{ borderColor: 'var(--cockpit-rail)' }}>
                  <div className="flex items-center gap-2">
                    <StatusLight state={s.severity === 'fault' ? 'fault' : 'warn'} label={s.label} pulse />
                  </div>
                  {s.detail ? <div className="mt-1 text-[11px]" style={{ color: 'var(--cockpit-ink-muted)' }}>{s.detail}</div> : null}
                </li>
              ))}
            </ul>
          </CockpitPanel>

          <CockpitPanel eyebrow="Mode" title="Source of supply">
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setComp((c) => ({ ...c, mainsPresent: !c.mainsPresent }))}
                className="flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-sm transition-all"
                style={{
                  borderColor: comp.mainsPresent ? 'var(--lamp-info)' : 'var(--cockpit-rail)',
                  background: comp.mainsPresent ? 'rgba(76,210,238,0.08)' : 'var(--cockpit-panel-raised)',
                  color: 'var(--cockpit-ink)',
                }}
              >
                <span className="flex items-center gap-2">
                  <StatusLight state={comp.mainsPresent ? 'info' : 'off'} label={comp.mainsPresent ? 'Mains live' : 'Mains down — simulate'} />
                </span>
                <span className="text-[11px]" style={{ color: 'var(--cockpit-ink-muted)' }}>{comp.mainsPresent ? 'click to drop' : 'click to restore'}</span>
              </button>
              <div className="rounded-md border p-2 text-[11px]" style={{ borderColor: 'var(--cockpit-rail)', color: 'var(--cockpit-ink-muted)' }}>
                Drop the mains to see how runtime, alarms and output respond. The UPS keeps delivering output from its battery for as long as autonomy allows.
              </div>
              <div className="grid grid-cols-2 gap-2">
                <DigitalReadout label="Battery autonomy" value={result.upsBatteryWh / 1000} unit="kWh" decimals={2} status="info" />
                <DigitalReadout
                  label="Runtime @ load"
                  value={Number.isFinite(result.runtimeMin) ? result.runtimeMin : null}
                  unit="min"
                  decimals={1}
                  status={result.runtimeMin < 5 ? 'warn' : 'ok'}
                />
              </div>
              <div className="rounded-md border px-2 py-1.5 text-[11px]" style={{ borderColor: 'var(--cockpit-rail)', color: 'var(--cockpit-ink-muted)' }}>
                Topology in cluster: {result.topology.length === 0 ? '—' : result.topology.join(' · ')}
              </div>
            </div>
          </CockpitPanel>
        </div>
      </CockpitFrame>

      {/* ───── Composition workspace ───── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card tone="panel">
          <div className="mb-3 flex items-center justify-between">
            <SectionHeading eyebrow="Step 1" title="Pick UPS units" caption="Add and stack UPS models. Capacity, efficiency and battery autonomy update on the cockpit live." />
            <SampleBadge />
          </div>
          <UpsPicker comp={comp} onSet={setUpsQty} />
        </Card>

        <Card tone="panel">
          <div className="mb-3 flex items-center justify-between">
            <SectionHeading eyebrow="Step 2" title="Add loads" caption="Tap to add. The cockpit shows continuous draw, surge, headroom and any mismatch (e.g. cooker on UPS)." />
            <SampleBadge />
          </div>
          <LoadPicker comp={comp} onSet={setLoadQty} />
        </Card>
      </div>

      {/* ───── Connected workflow ───── */}
      <Card tone="panel">
        <SectionHeading eyebrow="Use this with" title="Connected workflow" />
        <p className="text-sm text-ink-secondary">
          Take the UPS configuration into the{' '}
          <Link href="/hub/simulator" className="text-ink-link">Smart Sizing Simulator</Link> for a full system view, audit pricing through{' '}
          <Link href="/hub/quote-audit" className="text-ink-link">Quotation Audit</Link>, walk the install in{' '}
          <Link href="/hub/installation" className="text-ink-link">Installation Visualizer</Link>, and validate with{' '}
          <Link href="/hub/diagnostics" className="text-ink-link">Diagnostics</Link>,{' '}
          <Link href="/hub/maintenance" className="text-ink-link">Maintenance Planner</Link> and{' '}
          <Link href="/hub/power-quality" className="text-ink-link">Power Quality</Link>. Cross-check models in{' '}
          <Link href="/hub/product-intelligence" className="text-ink-link">Product Intelligence</Link>.
        </p>
      </Card>

      <HubConnectStrip active="/hub/ups-lab" />
    </div>
  );
}

/* ────────── Topology bridge ────────── */

function toUpsTopologyState(c: Composition, r: LiveResult): UpsTopologyState {
  const upsCount = c.ups.reduce((a, u) => a + u.qty, 0);
  return {
    mainsPresent: c.mainsPresent,
    upsCount,
    upsCapacityKw: r.upsCapacityW / 1000,
    loadKw: r.loadContinuousW / 1000,
    inputKw: r.inputW / 1000,
    outputKw: r.outputW / 1000,
    batteryKwh: r.upsBatteryWh / 1000,
    runtimeMin: r.runtimeMin,
    overloaded: r.isOverloaded,
    highLoad: r.upsCapacityW > 0 && r.loadContinuousW > r.upsCapacityW * 0.85,
    topologyLabel: r.topology[0],
  };
}

/* ────────── Sub-components ────────── */

function PowerFlowBoard({ comp, result }: { comp: Composition; result: LiveResult }) {
  const flowing = comp.mainsPresent ? 'mains' : 'battery';
  const tile = (label: string, sub: string, lamp: 'ok'|'warn'|'fault'|'info'|'off', emphasis = false) => (
    <div
      className="relative flex min-w-0 flex-col items-stretch gap-1.5 rounded-md border px-3 py-2"
      style={{
        borderColor: 'var(--cockpit-rail)',
        background: emphasis ? 'rgba(0,113,227,0.08)' : 'var(--cockpit-panel-raised)',
        boxShadow: emphasis ? 'inset 0 0 0 1px rgba(76,210,238,0.25)' : undefined,
      }}
    >
      <StatusLight state={lamp} label={label} pulse={lamp !== 'off' && lamp !== 'ok'} />
      <div className="text-[10px]" style={{ color: 'var(--cockpit-ink-muted)' }}>{sub}</div>
    </div>
  );
  const arrow = (active: boolean) => (
    <div
      aria-hidden
      className={`hidden h-px flex-1 self-center md:block ${active ? 'cockpit-flow-line' : ''}`}
      style={{
        background: active
          ? 'linear-gradient(90deg, rgba(76,210,238,0.05), rgba(76,210,238,0.85), rgba(76,210,238,0.05))'
          : 'rgba(140,170,220,0.2)',
      }}
    />
  );

  return (
    <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)_24px_minmax(0,1fr)_24px_minmax(0,1fr)]">
      {tile('⚡ Mains input', `${(result.inputW/1000).toFixed(2)} kW`, comp.mainsPresent ? 'info' : 'fault')}
      {arrow(comp.mainsPresent)}
      {tile('🔋 UPS battery', `${(result.upsBatteryWh/1000).toFixed(2)} kWh stored`, result.upsBatteryWh > 0 ? (flowing === 'battery' ? 'info' : 'ok') : 'off')}
      {arrow(!result.hasNoUps)}
      {tile('🔌 UPS output', `${(result.outputW/1000).toFixed(2)} kW · ${result.headroomPct.toFixed(0)} % headroom`, result.isOverloaded ? 'fault' : result.hasNoUps ? 'off' : 'ok', true)}
      {arrow(!result.hasNoLoad && !result.isOverloaded)}
      {tile('🖥️ Connected loads', `${(result.loadContinuousW/1000).toFixed(2)} kW continuous`, result.hasNoLoad ? 'off' : result.isMismatched ? 'warn' : 'ok')}
    </div>
  );
}

function UpsPicker({ comp, onSet }: { comp: Composition; onSet: (id: string, qty: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="grid gap-2">
        {UPS_MODELS.map((m) => {
          const row = comp.ups.find((r) => r.modelId === m.id);
          const qty = row?.qty ?? 0;
          const active = qty > 0;
          return (
            <div
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-2.5 transition-all"
              style={{
                borderColor: active ? 'var(--color-brand-blue)' : 'var(--color-border-subtle)',
                background: active ? 'rgba(0,113,227,0.04)' : 'var(--color-surface-base)',
              }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                  <span>{m.brand}</span>
                  <span className="text-ink-secondary">·</span>
                  <span>{m.name}</span>
                  <GradeChip g={m.grade} />
                </div>
                <div className="text-[11px] text-ink-muted">
                  {m.ratingKva} kVA · pf {m.pf} · {m.topology} · battery {(m.batteryWh/1000).toFixed(2)} kWh · transfer {m.transferMs} ms
                </div>
                <div className="text-[11px] text-ink-secondary">{m.note}</div>
              </div>
              <Stepper qty={qty} onChange={(v) => onSet(m.id, v)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoadPicker({ comp, onSet }: { comp: Composition; onSet: (kind: LoadKind, qty: number) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {LOAD_TYPES.map((l) => {
        const row = comp.loads.find((r) => r.kind === l.id);
        const qty = row?.qty ?? 0;
        const active = qty > 0;
        return (
          <div
            key={l.id}
            className="flex items-center justify-between gap-2 rounded-md border p-2.5 transition-all"
            style={{
              borderColor: active ? 'var(--color-brand-blue)' : 'var(--color-border-subtle)',
              background: active ? 'rgba(0,113,227,0.04)' : 'var(--color-surface-base)',
            }}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <span aria-hidden className="text-base">{l.emoji}</span>
                <span>{l.label}</span>
                {!l.upsAdvised && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">⚠ not advised on UPS</span>}
              </div>
              <div className="text-[11px] text-ink-muted">
                {l.watts} W · pf {l.pf} · surge ×{l.startMult.toFixed(1)} · {l.category}
              </div>
            </div>
            <Stepper qty={qty} onChange={(v) => onSet(l.id, v)} />
          </div>
        );
      })}
    </div>
  );
}

function Stepper({ qty, onChange }: { qty: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, qty - 1))}
        disabled={qty <= 0}
        aria-label="Remove one"
        className="grid h-8 w-8 place-items-center rounded-md border text-base font-bold transition-all hover:bg-surface-sunken/60 disabled:opacity-40"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >−</button>
      <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">{qty}</span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label="Add one"
        className="grid h-8 w-8 place-items-center rounded-md border text-base font-bold text-white transition-all"
        style={{
          background: 'linear-gradient(135deg,#0071e3 0%,#003a73 100%)',
          borderColor: 'transparent',
          boxShadow: '0 6px 14px -8px rgba(0,113,227,0.65)',
        }}
      >+</button>
    </div>
  );
}

function GradeChip({ g }: { g: UpsModel['grade'] }) {
  const palette: Record<UpsModel['grade'], { bg: string; fg: string; border: string }> = {
    A: { bg: 'rgba(34,197,94,0.14)',  fg: '#0e7c3a', border: 'rgba(34,197,94,0.45)' },
    B: { bg: 'rgba(59,130,246,0.14)', fg: '#1d4ed8', border: 'rgba(59,130,246,0.45)' },
    C: { bg: 'rgba(14,165,233,0.14)', fg: '#0c6e91', border: 'rgba(14,165,233,0.45)' },
    D: { bg: 'rgba(234,179,8,0.16)',  fg: '#92660a', border: 'rgba(234,179,8,0.50)' },
    E: { bg: 'rgba(249,115,22,0.16)', fg: '#9a4112', border: 'rgba(249,115,22,0.50)' },
    F: { bg: 'rgba(239,68,68,0.16)',  fg: '#991b1b', border: 'rgba(239,68,68,0.50)' },
    G: { bg: 'rgba(120,113,108,0.18)',fg: '#3f3f46', border: 'rgba(120,113,108,0.50)' },
  };
  const p = palette[g];
  return (
    <span
      className="rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider"
      style={{ background: p.bg, color: p.fg, border: `1px solid ${p.border}` }}
      title={`Internal suitability grade ${g}`}
    >{g}</span>
  );
}
