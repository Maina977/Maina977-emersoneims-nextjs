'use client';

/**
 * Generator Oracle engineering calculators (Engineering Apps directive §3).
 * Every result shows its formula, inputs, assumptions, reference and engine
 * version; invalid inputs are rejected with the reason, never guessed.
 * Calculations: lib/generator-oracle/calc/electrical.ts (tested against hand
 * calculations in tests/regression/oracle-calculators.test.ts).
 */
import { useMemo, useState } from 'react';
import {
  powerFromVI, currentFromPower, sizeFromLoadSchedule, voltageDrop, phaseImbalance,
  motorStartDip, fuelAndRuntime, derate, type Calc, type LoadLine, type Phases,
} from '@/lib/generator-oracle/calc/electrical';

type Tool = 'power' | 'current' | 'sizing' | 'vdrop' | 'imbalance' | 'motor' | 'fuel' | 'derate';
const TOOLS: Array<[Tool, string]> = [
  ['power', 'kW / kVA / PF'], ['current', 'Current'], ['sizing', 'Load schedule'], ['vdrop', 'Voltage drop'],
  ['imbalance', 'Phase imbalance'], ['motor', 'Motor start dip'], ['fuel', 'Fuel & runtime'], ['derate', 'Derating'],
];

const num = (s: string): number => (s.trim() === '' ? NaN : Number(s));
const opt = (s: string): number | undefined => (s.trim() === '' ? undefined : Number(s));

function Field({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit?: string }) {
  return (
    <label className="block text-xs text-slate-300">
      <span className="block mb-1">{label}{unit ? <span className="text-slate-500"> ({unit})</span> : null}</span>
      <input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-sm text-white focus:border-cyan-500 outline-none" />
    </label>
  );
}
function Pick<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: Array<[T, string]>; onChange: (v: T) => void }) {
  return (
    <label className="block text-xs text-slate-300">
      <span className="block mb-1">{label}</span>
      <select value={String(value)} onChange={(e) => onChange(options.find(([o]) => String(o) === e.target.value)![0])}
        className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-sm text-white">
        {options.map(([o, l]) => <option key={String(o)} value={String(o)}>{l}</option>)}
      </select>
    </label>
  );
}

function Result<T extends Record<string, unknown>>({ calc, labels }: { calc: Calc<T>; labels: Record<string, string> }) {
  if (!calc.ok) {
    return (
      <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200" role="alert">
        <strong>Not calculated:</strong>
        <ul className="list-disc ml-5 mt-1">{calc.errors.map((e) => <li key={e}>{e}</li>)}</ul>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-emerald-500/30 bg-slate-900/60 p-3 text-sm space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Object.entries(labels).map(([k, l]) => {
          const val = calc.value[k];
          const shown = val === null || val === undefined ? '—' : typeof val === 'boolean' ? (val ? 'Within limit' : 'EXCEEDS LIMIT') : String(val);
          return <div key={k} className="rounded bg-slate-800/70 p-2"><div className="text-[11px] text-slate-400">{l}</div><div className={`font-semibold ${val === false ? 'text-red-400' : 'text-white'}`}>{shown}</div></div>;
        })}
      </div>
      {calc.warnings.length > 0 && <div className="text-amber-300 text-xs">{calc.warnings.map((w) => <p key={w}>⚠️ {w}</p>)}</div>}
      <details className="text-xs text-slate-300" open>
        <summary className="cursor-pointer text-slate-400">Formula, inputs, assumptions and reference</summary>
        <p className="mt-1"><span className="text-slate-500">Formula:</span> <code className="text-cyan-300">{calc.formula}</code></p>
        <p><span className="text-slate-500">Inputs:</span> {Object.entries(calc.inputs).map(([k, x]) => `${k} = ${x}`).join('; ')}</p>
        <ul className="list-disc ml-5">{calc.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
        <p><span className="text-slate-500">Reference:</span> {calc.reference}</p>
        <p className="text-slate-500">{calc.engine}. A calculation aid, not a design approval: results must be checked by a competent engineer against the manufacturer&apos;s data.</p>
      </details>
    </div>
  );
}

export default function EngineeringCalculatorsPanel() {
  const [tool, setTool] = useState<Tool>('power');
  const [phases, setPhases] = useState<Phases>(3);
  const [f, setF] = useState<Record<string, string>>({});
  const g = (k: string) => f[k] ?? '';
  const s = (k: string) => (v: string) => setF((p) => ({ ...p, [k]: v }));
  const [loads, setLoads] = useState<Array<Record<keyof LoadLine, string>>>([{ name: '', kW: '', powerFactor: '', quantity: '1', demandFactor: '' }]);
  const [material, setMaterial] = useState<'copper' | 'aluminium'>('copper');
  const [quantity, setQuantity] = useState<'voltage' | 'current'>('voltage');

  const calc = useMemo((): { c: Calc<Record<string, unknown>>; labels: Record<string, string> } => {
    switch (tool) {
      case 'power': return { c: powerFromVI({ phases, voltageV: num(g('v')), currentA: num(g('i')), powerFactor: num(g('pf')) }), labels: { kVA: 'Apparent power (kVA)', kW: 'Real power (kW)', kVAr: 'Reactive power (kVAr)' } };
      case 'current': return { c: currentFromPower({ phases, voltageV: num(g('v')), kVA: opt(g('kva')), kW: opt(g('kw')), powerFactor: opt(g('pf')) }), labels: { currentA: 'Line current (A)', kVA: 'Apparent power (kVA)' } };
      case 'sizing': return { c: sizeFromLoadSchedule({ maxLoading: num(g('maxload')) / 100, loads: loads.map((l) => ({ name: l.name, kW: num(l.kW), powerFactor: num(l.powerFactor), quantity: num(l.quantity), demandFactor: num(l.demandFactor) })) }), labels: { runningKW: 'Running kW', runningKVAr: 'Running kVAr', runningKVA: 'Running kVA', overallPF: 'Overall PF', minimumGeneratorKVA: 'Minimum generator kVA' } };
      case 'vdrop': return { c: voltageDrop({ phases, material, csaMm2: num(g('csa')), lengthM: num(g('len')), currentA: num(g('i')), powerFactor: num(g('pf')), nominalVoltageV: num(g('v')), reactanceMOhmPerM: opt(g('x')), limitPct: opt(g('lim')) }), labels: { dropV: phases === 3 ? 'Drop, line-to-line (V)' : 'Drop (V)', dropPct: 'Drop (%)', withinLimit: 'Against your limit' } };
      case 'imbalance': return { c: phaseImbalance({ quantity, values: [num(g('a')), num(g('b')), num(g('c'))] }), labels: { average: 'Average', maxDeviation: 'Max deviation', imbalancePct: 'Unbalance (%)' } };
      case 'motor': return { c: motorStartDip({ generatorKVA: num(g('gkva')), reactancePU: num(g('xd')), motorStartingKVA: num(g('skva')), allowedDipPct: opt(g('lim')) }), labels: { dipPct: 'Initial dip (%)', withinLimit: 'Against your limit' } };
      case 'fuel': return { c: fuelAndRuntime({ loadPct: num(g('load')), usableFuelL: opt(g('tank')), datasheet: [['l1', 'f1'], ['l2', 'f2'], ['l3', 'f3'], ['l4', 'f4']].filter(([l, q]) => g(l) !== '' || g(q) !== '').map(([l, q]) => ({ loadPct: num(g(l)), litresPerHour: num(g(q)) })) }), labels: { litresPerHour: 'Consumption (L/h)', runtimeHours: 'Runtime (h)' } };
      case 'derate': return { c: derate({ ratedKW: num(g('kw')), siteAltitudeM: num(g('alt')), altitudeThresholdM: num(g('altT')), altitudePctPerStep: num(g('altP')), altitudeStepM: num(g('altS')), siteTempC: num(g('t')), tempThresholdC: num(g('tT')), tempPctPerStep: num(g('tP')), tempStepC: num(g('tS')) }), labels: { availableKW: 'Available (kW)', totalDeratePct: 'Total derate (%)', altitudeDeratePct: 'Altitude (%)', temperatureDeratePct: 'Temperature (%)' } };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, phases, f, loads, material, quantity]);

  const phasePick = <Pick label="Supply" value={phases} options={[[3, 'Three-phase'], [1, 'Single-phase']]} onChange={setPhases} />;
  const touched = Object.values(f).some((x) => x !== '') || loads.some((l) => l.kW !== '');

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3 text-xs text-slate-300">
        Deterministic engineering calculations. Enter values from your measurements and the manufacturer&apos;s datasheets: nothing is assumed for you, and missing or unsafe inputs are refused with the reason.
      </div>
      <div className="flex flex-wrap gap-2" role="tablist">
        {TOOLS.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tool === id} onClick={() => { setTool(id); setF({}); }}
            className={`px-3 py-1.5 rounded-md text-xs border ${tool === id ? 'bg-cyan-600/30 border-cyan-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>{label}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tool === 'power' && (<>{phasePick}<Field label={phases === 3 ? 'Voltage, line-to-line' : 'Voltage'} unit="V" value={g('v')} onChange={s('v')} /><Field label="Current" unit="A" value={g('i')} onChange={s('i')} /><Field label="Power factor" unit="0-1" value={g('pf')} onChange={s('pf')} /></>)}
        {tool === 'current' && (<>{phasePick}<Field label={phases === 3 ? 'Voltage, line-to-line' : 'Voltage'} unit="V" value={g('v')} onChange={s('v')} /><Field label="kVA (or leave blank and give kW)" unit="kVA" value={g('kva')} onChange={s('kva')} /><Field label="kW" unit="kW" value={g('kw')} onChange={s('kw')} /><Field label="Power factor (with kW)" unit="0-1" value={g('pf')} onChange={s('pf')} /></>)}
        {tool === 'vdrop' && (<>{phasePick}<Pick label="Conductor" value={material} options={[['copper', 'Copper'], ['aluminium', 'Aluminium']]} onChange={setMaterial} /><Field label="Cross-section" unit="mm²" value={g('csa')} onChange={s('csa')} /><Field label="Route length, one way" unit="m" value={g('len')} onChange={s('len')} /><Field label="Design current" unit="A" value={g('i')} onChange={s('i')} /><Field label="Power factor" unit="0-1" value={g('pf')} onChange={s('pf')} /><Field label={phases === 3 ? 'Nominal voltage, line-to-line' : 'Nominal voltage'} unit="V" value={g('v')} onChange={s('v')} /><Field label="Cable reactance (blank = 0.08)" unit="mΩ/m" value={g('x')} onChange={s('x')} /><Field label="Allowed drop (optional)" unit="%" value={g('lim')} onChange={s('lim')} /></>)}
        {tool === 'imbalance' && (<><Pick label="Measured" value={quantity} options={[['voltage', 'Voltages'], ['current', 'Currents']]} onChange={setQuantity} /><Field label="Phase 1" unit={quantity === 'voltage' ? 'V' : 'A'} value={g('a')} onChange={s('a')} /><Field label="Phase 2" unit={quantity === 'voltage' ? 'V' : 'A'} value={g('b')} onChange={s('b')} /><Field label="Phase 3" unit={quantity === 'voltage' ? 'V' : 'A'} value={g('c')} onChange={s('c')} /></>)}
        {tool === 'motor' && (<><Field label="Generator rating" unit="kVA" value={g('gkva')} onChange={s('gkva')} /><Field label="Alternator reactance X″d or X′d (datasheet)" unit="per unit" value={g('xd')} onChange={s('xd')} /><Field label="Motor starting kVA" unit="kVA" value={g('skva')} onChange={s('skva')} /><Field label="Allowed dip (optional)" unit="%" value={g('lim')} onChange={s('lim')} /></>)}
        {tool === 'fuel' && (<>{[1, 2, 3, 4].map((n) => (<div key={n} className="col-span-2 grid grid-cols-2 gap-2"><Field label={`Datasheet point ${n}: load`} unit="%" value={g(`l${n}`)} onChange={s(`l${n}`)} /><Field label="consumption" unit="L/h" value={g(`f${n}`)} onChange={s(`f${n}`)} /></div>))}<Field label="Load to evaluate" unit="%" value={g('load')} onChange={s('load')} /><Field label="Usable fuel (optional)" unit="L" value={g('tank')} onChange={s('tank')} /></>)}
        {tool === 'derate' && (<><Field label="Rated output (datasheet)" unit="kW" value={g('kw')} onChange={s('kw')} /><Field label="Site altitude" unit="m" value={g('alt')} onChange={s('alt')} /><Field label="Altitude threshold (datasheet)" unit="m" value={g('altT')} onChange={s('altT')} /><Field label="Altitude derate per step (datasheet)" unit="%" value={g('altP')} onChange={s('altP')} /><Field label="Altitude step (datasheet)" unit="m" value={g('altS')} onChange={s('altS')} /><Field label="Site max temperature" unit="°C" value={g('t')} onChange={s('t')} /><Field label="Temperature threshold (datasheet)" unit="°C" value={g('tT')} onChange={s('tT')} /><Field label="Temperature derate per step (datasheet)" unit="%" value={g('tP')} onChange={s('tP')} /><Field label="Temperature step (datasheet)" unit="°C" value={g('tS')} onChange={s('tS')} /></>)}
        {tool === 'sizing' && (<Field label="Maximum loading of the generator" unit="% of rating" value={g('maxload')} onChange={s('maxload')} />)}
      </div>

      {tool === 'sizing' && (
        <div className="space-y-2">
          {loads.map((l, n) => (
            <div key={n} className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-end">
              {(['name', 'kW', 'powerFactor', 'quantity', 'demandFactor'] as const).map((k) => (
                <Field key={k} label={{ name: 'Load', kW: 'kW each', powerFactor: 'PF', quantity: 'Qty', demandFactor: 'Demand factor (0-1)' }[k]} value={l[k]} onChange={(v) => setLoads((p) => p.map((x, i) => (i === n ? { ...x, [k]: v } : x)))} />
              ))}
              <button onClick={() => setLoads((p) => (p.length > 1 ? p.filter((_, i) => i !== n) : p))} className="text-xs text-slate-400 border border-slate-700 rounded px-2 py-1.5">Remove</button>
            </div>
          ))}
          <button onClick={() => setLoads((p) => [...p, { name: '', kW: '', powerFactor: '', quantity: '1', demandFactor: '' }])} className="text-xs text-cyan-300 border border-cyan-700 rounded px-3 py-1.5">+ Add load</button>
        </div>
      )}

      {touched ? <Result calc={calc.c} labels={calc.labels} /> : <p className="text-xs text-slate-500">Enter the values to calculate.</p>}
    </div>
  );
}
