'use client';

/**
 * Trades panel (P1, 2026-11-20): turns take-off measurements into trade
 * quantities with lib/qs/trades and appends them to the workbench BOQ.
 *
 * Every parameter is entered as value + source; nothing is pre-filled. The
 * form → engine mapping is in lib/qs/tradeForms.ts (pure, unit-tested); the
 * engine's refusal message is shown verbatim.
 */
import { useState, type ReactNode } from 'react';
import type { Measurement, MeasureKind, Quantity } from '@/lib/qs/takeoff';
import type { BoqItem } from '@/lib/qs/boq';
import { TradeError, TRADES_ENGINE_VERSION, type TradeLine } from '@/lib/qs/trades';
import {
  calculateTrade, emptyForm, emptyOpening, emptyRoom, measurementOptions, tradeBoqItems, TRADE_LABELS,
  emptyPointRow, emptyCircuitRun, emptyEnumeratedRow, emptyFixtureRow, emptyPipeRun, emptyWorksRow,
  type OpeningForm, type ParamForm, type TradeForm, type TradeKind, type ElectricalForm, type PlumbingForm, type WorksForm,
} from '@/lib/qs/tradeForms';
import { FIXTURE_LABELS, MEP_ENGINE_VERSION, MEP_NOT_MEASURED, POINT_LABELS, SERVICE_LABELS } from '@/lib/qs/mep';
import { WORKS_CATALOGUES, WORKS_ENGINE_VERSION } from '@/lib/qs/works';

const input = 'rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white';

function ParamField({ label, unit, value, onChange }: { label: string; unit: string; value: ParamForm; onChange: (v: ParamForm) => void }) {
  return (
    // Narrow screens (390 px): label + value on one row, source below; minmax(0, …) lets inputs shrink instead of overflowing.
    <div className="grid grid-cols-[minmax(0,1fr)_5rem] items-center gap-2 text-xs sm:grid-cols-[10rem_5rem_minmax(0,1fr)]">
      <span>{label} ({unit})</span>
      <input aria-label={`${label} value (${unit})`} value={value.value} onChange={(e) => onChange({ ...value, value: e.target.value })} className={`${input} min-w-0`} inputMode="decimal" />
      <input aria-label={`${label} source`} value={value.source} onChange={(e) => onChange({ ...value, source: e.target.value })} placeholder="source, e.g. Section A-A, drawing A-201 rev C" className={`${input} col-span-2 min-w-0 sm:col-span-1`} />
    </div>
  );
}

function MeasurementPick({ label, kind, value, onChange, quantities, labels, optional }: {
  label: string; kind: MeasureKind; value: string; onChange: (id: string) => void;
  quantities: Map<string, Quantity>; labels: Map<string, string>; optional?: boolean;
}) {
  const opts = measurementOptions(quantities, kind);
  return (
    <label className="flex flex-wrap items-center gap-2 text-xs">
      <span className="w-40">{label} ({kind})</span>
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={`${input} min-w-0 max-w-full`}>
        <option value="">{optional ? 'none' : opts.length ? 'choose…' : `no ${kind} measurement yet`}</option>
        {opts.map((q) => <option key={q.id} value={q.id}>{q.id} {labels.get(q.id) ?? ''} · {q.net} {q.unit}</option>)}
      </select>
    </label>
  );
}

function OpeningsTable({ rows, onChange }: { rows: OpeningForm[]; onChange: (rows: OpeningForm[]) => void }) {
  const up = (i: number, o: OpeningForm) => onChange(rows.map((x, j) => (j === i ? o : x)));
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs"><span className="font-semibold">Openings</span>
        <button type="button" onClick={() => onChange([...rows, emptyOpening()])} className="rounded bg-slate-700 px-2 py-0.5">Add opening</button></div>
      {rows.length === 0 ? <p className="text-xs text-slate-500">None.</p> : (
        // relative: the sr-only "Remove" header is position:absolute and must stay inside this scroll box (page overflow at 390 px, 2026-11-25).
        <div className="relative overflow-x-auto" role="region" aria-label="Openings table, scrolls sideways" tabIndex={0}><table className="w-full min-w-[40rem] text-xs">
          <thead><tr className="text-left text-slate-400">{['Mark', 'Type', 'Width (m)', 'Width source', 'Height (m)', 'Height source', 'Count'].map((h) => <th key={h} scope="col">{h}</th>)}<th scope="col"><span className="sr-only">Remove</span></th></tr></thead>
          <tbody>
            {rows.map((o, i) => (
              <tr key={i}>
                <td><input aria-label={`opening ${i + 1} mark`} value={o.mark} onChange={(e) => up(i, { ...o, mark: e.target.value })} className={`${input} w-16`} /></td>
                <td><select aria-label={`opening ${i + 1} type`} value={o.type} onChange={(e) => up(i, { ...o, type: e.target.value as OpeningForm['type'] })} className={input}><option value="door">door</option><option value="window">window</option><option value="other">other</option></select></td>
                <td><input aria-label={`opening ${i + 1} width`} value={o.width.value} onChange={(e) => up(i, { ...o, width: { ...o.width, value: e.target.value } })} className={`${input} w-16`} inputMode="decimal" /></td>
                <td><input aria-label={`opening ${i + 1} width source`} value={o.width.source} onChange={(e) => up(i, { ...o, width: { ...o.width, source: e.target.value } })} placeholder="e.g. door schedule A-501" className={`${input} w-full`} /></td>
                <td><input aria-label={`opening ${i + 1} height`} value={o.height.value} onChange={(e) => up(i, { ...o, height: { ...o.height, value: e.target.value } })} className={`${input} w-16`} inputMode="decimal" /></td>
                <td><input aria-label={`opening ${i + 1} height source`} value={o.height.source} onChange={(e) => up(i, { ...o, height: { ...o.height, source: e.target.value } })} placeholder="e.g. door schedule A-501" className={`${input} w-full`} /></td>
                <td><input aria-label={`opening ${i + 1} count`} value={o.count} onChange={(e) => up(i, { ...o, count: e.target.value })} className={`${input} w-12`} inputMode="numeric" /></td>
                <td><button type="button" aria-label={`remove opening ${i + 1}`} onClick={() => onChange(rows.filter((_, j) => j !== i))} className="px-1 text-red-300">×</button></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
    </div>
  );
}

type PickProps = { quantities: Map<string, Quantity>; labels: Map<string, string> };

/** A list of rows with Add / Remove; each row is rendered by `row`. */
function RowList<T>({ title, rows, add, onChange, row }: { title: string; rows: T[]; add: () => T; onChange: (rows: T[]) => void; row: (r: T, i: number, up: (r: T) => void) => ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs"><span className="font-semibold">{title}</span>
        <button type="button" onClick={() => onChange([...rows, add()])} className="rounded bg-slate-700 px-2 py-0.5">Add {title.toLowerCase().replace(/s$/, '')}</button></div>
      {rows.length === 0 ? <p className="text-xs text-slate-500">None.</p> : rows.map((r, i) => (
        <div key={i} className="space-y-1 rounded border border-slate-800 p-2">
          {row(r, i, (next) => onChange(rows.map((x, j) => (j === i ? next : x))))}
          <button type="button" aria-label={`remove ${title.toLowerCase()} row ${i + 1}`} onClick={() => onChange(rows.filter((_, j) => j !== i))} className="text-xs text-red-300">Remove</button>
        </div>
      ))}
    </div>
  );
}
function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="flex flex-wrap items-center gap-2 text-xs"><span className="w-40">{label}</span>
      <input aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${input} min-w-0 flex-1`} /></label>
  );
}
function ChoiceField({ label, value, options, onChange }: { label: string; value: string; options: Record<string, string>; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-wrap items-center gap-2 text-xs"><span className="w-40">{label}</span>
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={input}>
        <option value="">choose…</option>
        {Object.entries(options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select></label>
  );
}

function ElectricalFields({ f, edit, pick }: { f: ElectricalForm; edit: (f: ElectricalForm) => void; pick: PickProps }) {
  return (
    <>
      <RowList title="Points" rows={f.points} add={emptyPointRow} onChange={(points) => edit({ ...f, points })} row={(r, i, up) => (
        <>
          <ChoiceField label={`Point row ${i + 1} type`} value={r.kind} options={POINT_LABELS} onChange={(v) => up({ ...r, kind: v as typeof r.kind })} />
          <TextField label={`Point row ${i + 1} description`} value={r.label} onChange={(v) => up({ ...r, label: v })} placeholder="e.g. 13 A twin switched socket outlet" />
          <MeasurementPick label={`Point row ${i + 1} count`} kind="count" value={r.countId} onChange={(id) => up({ ...r, countId: id })} {...pick} />
        </>
      )} />
      <RowList title="Circuit runs" rows={f.runs} add={emptyCircuitRun} onChange={(runs) => edit({ ...f, runs })} row={(r, i, up) => (
        <>
          <TextField label={`Run ${i + 1} description`} value={r.label} onChange={(v) => up({ ...r, label: v })} placeholder="e.g. Lighting circuit L1" />
          <MeasurementPick label={`Run ${i + 1} run length`} kind="linear" value={r.runId} onChange={(id) => up({ ...r, runId: id })} {...pick} />
          <MeasurementPick label={`Run ${i + 1} points served (optional)`} kind="count" value={r.pointsId} onChange={(id) => up({ ...r, pointsId: id })} optional {...pick} />
          <ParamField label={`Run ${i + 1} drop per point`} unit="m" value={r.drop} onChange={(v) => up({ ...r, drop: v })} />
          <ParamField label={`Run ${i + 1} allowance (optional)`} unit="%" value={r.allowance} onChange={(v) => up({ ...r, allowance: v })} />
          <ParamField label={`Run ${i + 1} conductors per run`} unit="No" value={r.conductors} onChange={(v) => up({ ...r, conductors: v })} />
          <TextField label={`Run ${i + 1} cable specification`} value={r.cableSpec} onChange={(v) => up({ ...r, cableSpec: v })} placeholder="e.g. 1.5 mm² PVC single-core" />
          <TextField label={`Run ${i + 1} conduit (blank = none)`} value={r.conduitSpec} onChange={(v) => up({ ...r, conduitSpec: v })} placeholder="e.g. 20 mm PVC conduit" />
        </>
      )} />
      <RowList title="Enumerated items" rows={f.enumerated} add={emptyEnumeratedRow} onChange={(enumerated) => edit({ ...f, enumerated })} row={(r, i, up) => (
        <>
          <TextField label={`Enumerated item ${i + 1} description`} value={r.label} onChange={(v) => up({ ...r, label: v })} placeholder="e.g. 12-way distribution board; 20 A MCB" />
          <ParamField label={`Enumerated item ${i + 1} count`} unit="No" value={r.count} onChange={(v) => up({ ...r, count: v })} />
        </>
      )} />
    </>
  );
}

function PlumbingFields({ f, edit, pick }: { f: PlumbingForm; edit: (f: PlumbingForm) => void; pick: PickProps }) {
  return (
    <>
      <RowList title="Fixtures" rows={f.fixtures} add={emptyFixtureRow} onChange={(fixtures) => edit({ ...f, fixtures })} row={(r, i, up) => (
        <>
          <ChoiceField label={`Fixture row ${i + 1} type`} value={r.kind} options={FIXTURE_LABELS} onChange={(v) => up({ ...r, kind: v as typeof r.kind })} />
          <TextField label={`Fixture row ${i + 1} description`} value={r.label} onChange={(v) => up({ ...r, label: v })} placeholder="e.g. close-coupled WC, white" />
          <MeasurementPick label={`Fixture row ${i + 1} count`} kind="count" value={r.countId} onChange={(id) => up({ ...r, countId: id })} {...pick} />
        </>
      )} />
      <RowList title="Pipe runs" rows={f.pipes} add={emptyPipeRun} onChange={(pipes) => edit({ ...f, pipes })} row={(r, i, up) => (
        <>
          <TextField label={`Pipe run ${i + 1} description`} value={r.label} onChange={(v) => up({ ...r, label: v })} placeholder="e.g. cold water to kitchen" />
          <ChoiceField label={`Pipe run ${i + 1} service`} value={r.service} options={SERVICE_LABELS} onChange={(v) => up({ ...r, service: v as typeof r.service })} />
          <TextField label={`Pipe run ${i + 1} material`} value={r.material} onChange={(v) => up({ ...r, material: v })} placeholder="e.g. PPR PN20; uPVC" />
          <ParamField label={`Pipe run ${i + 1} nominal diameter`} unit="mm" value={r.diameter} onChange={(v) => up({ ...r, diameter: v })} />
          <MeasurementPick label={`Pipe run ${i + 1} run length`} kind="linear" value={r.runId} onChange={(id) => up({ ...r, runId: id })} {...pick} />
          <MeasurementPick label={`Pipe run ${i + 1} fixtures served (optional)`} kind="count" value={r.pointsId} onChange={(id) => up({ ...r, pointsId: id })} optional {...pick} />
          <ParamField label={`Pipe run ${i + 1} rise per fixture`} unit="m" value={r.drop} onChange={(v) => up({ ...r, drop: v })} />
          <ParamField label={`Pipe run ${i + 1} allowance (optional)`} unit="%" value={r.allowance} onChange={(v) => up({ ...r, allowance: v })} />
          <ParamField label={`Pipe run ${i + 1} fittings per metre (optional)`} unit="No/m" value={r.fittings} onChange={(v) => up({ ...r, fittings: v })} />
        </>
      )} />
    </>
  );
}

/** Measured-item trades (lib/qs/works): item type from the trade's catalogue, its measurement and dimensions. */
function WorksFields({ f, edit, pick }: { f: WorksForm; edit: (f: WorksForm) => void; pick: PickProps }) {
  const cat = WORKS_CATALOGUES[f.trade];
  const options = Object.fromEntries(Object.entries(cat.items).map(([k, c]) => [k, `${c.label} (${c.unit})`]));
  return (
    <>
      <ParamField label="Voids not deducted up to (each, ≤; needed when an area has openings)" unit="m²" value={f.voidRule} onChange={(v) => edit({ ...f, voidRule: v })} />
      <RowList title="Items" rows={f.works} add={emptyWorksRow} onChange={(works) => edit({ ...f, works })} row={(r, i, up) => {
        const c = Object.prototype.hasOwnProperty.call(cat.items, r.item) ? cat.items[r.item] : undefined;
        return (
          <>
            <ChoiceField label={`Item ${i + 1} type`} value={r.item} options={options} onChange={(v) => up({ ...r, item: v, measurementId: '' })} />
            <TextField label={`Item ${i + 1} description`} value={r.spec} onChange={(v) => up({ ...r, spec: v })} placeholder={c?.specHint ?? 'choose the item type first'} />
            {c && <MeasurementPick label={`Item ${i + 1} measurement`} kind={c.takes} value={r.measurementId} onChange={(id) => up({ ...r, measurementId: id })} {...pick} />}
            {c?.dims[0] && <ParamField label={`Item ${i + 1} ${c.dims[0].label}`} unit={c.dims[0].unit} value={r.d1} onChange={(v) => up({ ...r, d1: v })} />}
            {c?.dims[1] && <ParamField label={`Item ${i + 1} ${c.dims[1].label}`} unit={c.dims[1].unit} value={r.d2} onChange={(v) => up({ ...r, d2: v })} />}
            {c?.dims[2] && <ParamField label={`Item ${i + 1} ${c.dims[2].label}`} unit={c.dims[2].unit} value={r.d3} onChange={(v) => up({ ...r, d3: v })} />}
          </>
        );
      }} />
      <div className="rounded border border-amber-500/40 p-2 text-[11px] text-amber-200 space-y-1">
        <p>Measure each item on the drawing (area, length or count tool), then pick it here. A row with no measurement is refused, not guessed. One measurement feeds one item only.</p>
        {cat.note && <p>{cat.note}</p>}
        <p>Not measured here (price separately or add as your own items): {cat.notMeasured.join('; ')}.</p>
      </div>
    </>
  );
}

export default function TradesPanel({ quantities, measurements, existingCodes, onAdd }: {
  quantities: Map<string, Quantity>; measurements: Measurement[]; existingCodes: string[];
  /** `form` is a copy of the form the items were calculated from: a saved project recomputes the quantities from it. */
  onAdd: (items: BoqItem[], form: TradeForm) => void;
}) {
  const [trade, setTrade] = useState<TradeKind>('masonry');
  const [form, setForm] = useState<TradeForm>(() => emptyForm('masonry'));
  const [section, setSection] = useState(TRADE_LABELS.masonry);
  const [lines, setLines] = useState<TradeLine[] | null>(null);
  const [error, setError] = useState('');
  const [added, setAdded] = useState('');
  const labels = new Map(measurements.map((m) => [m.id, m.label]));
  const pickProps = { quantities, labels };

  // Any edit invalidates the last calculation, so a stale result is never added.
  const edit = (next: TradeForm) => { setForm(next); setLines(null); setError(''); setAdded(''); };
  const choose = (t: TradeKind) => { setTrade(t); setForm(emptyForm(t)); setSection(TRADE_LABELS[t]); setLines(null); setError(''); setAdded(''); };

  const calculate = () => {
    setAdded('');
    try { setLines(calculateTrade(form, quantities)); setError(''); }
    catch (e) { setLines(null); setError(e instanceof TradeError ? e.message : `Unexpected error: ${(e as Error).message}`); }
  };
  const add = () => {
    if (!lines) return;
    try {
      const items = tradeBoqItems(lines, section, existingCodes);
      onAdd(items, JSON.parse(JSON.stringify(form)) as TradeForm); setError(''); setAdded(`${items.length} item(s) added to the BOQ under "${section.trim()}". Enter a dated rate for each.`); setLines(null);
    } catch (e) { setError(e instanceof TradeError ? e.message : `Unexpected error: ${(e as Error).message}`); }
  };

  const f = form;
  return (
    <div className="rounded border border-slate-700 p-3 space-y-3">
      <div className="text-sm font-semibold">Trades: quantities from the take-off</div>
      <p className="text-xs text-slate-400">Pick a trade, the measurement(s) it uses, and enter each parameter with its source (drawing, section, schedule or specification). Nothing is assumed.</p>
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <label>Trade <select aria-label="Trade" value={trade} onChange={(e) => choose(e.target.value as TradeKind)} className={input}>
          {(Object.keys(TRADE_LABELS) as TradeKind[]).map((k) => <option key={k} value={k}>{TRADE_LABELS[k]}</option>)}
        </select></label>
        <label>{f.trade === 'openings' ? 'Code prefix' : 'Item code'} <input aria-label="Trade item code" value={f.code} onChange={(e) => edit({ ...f, code: e.target.value })} placeholder={f.trade === 'openings' ? 'e.g. DW' : 'e.g. M1'} className={`${input} w-20`} /></label>
        {'description' in f && <label className="flex-1">Description <input aria-label="Trade description" value={f.description} onChange={(e) => edit({ ...f, description: e.target.value } as TradeForm)} placeholder="e.g. External walls, ground floor" className={`${input} w-full max-w-md`} /></label>}
      </div>

      <div className="space-y-2">
        {f.trade === 'masonry' && (
          <>
            <MeasurementPick label="Wall length" kind="linear" value={f.wallLengthId} onChange={(id) => edit({ ...f, wallLengthId: id })} {...pickProps} />
            <ParamField label="Wall height" unit="m" value={f.height} onChange={(v) => edit({ ...f, height: v })} />
            <ParamField label="Wall thickness" unit="m" value={f.thickness} onChange={(v) => edit({ ...f, thickness: v })} />
            <ParamField label="Openings not deducted up to (each, ≤)" unit="m²" value={f.minDeducted} onChange={(v) => edit({ ...f, minDeducted: v })} />
            <OpeningsTable rows={f.openings} onChange={(rows) => edit({ ...f, openings: rows })} />
            <label className="block text-xs"><input type="checkbox" checked={f.block.enabled} onChange={(e) => edit({ ...f, block: { ...f.block, enabled: e.target.checked } })} /> Count blocks</label>
            {f.block.enabled && (
              <div className="space-y-2 pl-4">
                <ParamField label="Block length" unit="m" value={f.block.length} onChange={(v) => edit({ ...f, block: { ...f.block, length: v } })} />
                <ParamField label="Block height" unit="m" value={f.block.height} onChange={(v) => edit({ ...f, block: { ...f.block, height: v } })} />
                <ParamField label="Joint" unit="m" value={f.block.joint} onChange={(v) => edit({ ...f, block: { ...f.block, joint: v } })} />
                <ParamField label="Wastage (optional)" unit="%" value={f.block.wastage} onChange={(v) => edit({ ...f, block: { ...f.block, wastage: v } })} />
              </div>
            )}
          </>
        )}
        {f.trade === 'plaster' && (
          <>
            <MeasurementPick label="Wall length" kind="linear" value={f.wallLengthId} onChange={(id) => edit({ ...f, wallLengthId: id })} {...pickProps} />
            <ParamField label="Plaster height" unit="m" value={f.height} onChange={(v) => edit({ ...f, height: v })} />
            <label className="flex flex-wrap items-center gap-2 text-xs"><span className="w-40">Faces</span>
              <select aria-label="Faces" value={f.faces} onChange={(e) => edit({ ...f, faces: e.target.value as '' | '1' | '2' })} className={input}><option value="">choose…</option><option value="1">one face</option><option value="2">both faces</option></select></label>
            <ParamField label="Openings not deducted up to (each, ≤)" unit="m²" value={f.minDeducted} onChange={(v) => edit({ ...f, minDeducted: v })} />
            <OpeningsTable rows={f.openings} onChange={(rows) => edit({ ...f, openings: rows })} />
            <label className="block text-xs"><input type="checkbox" checked={f.reveal.enabled} onChange={(e) => edit({ ...f, reveal: { ...f.reveal, enabled: e.target.checked } })} /> Plaster reveals</label>
            {f.reveal.enabled && <div className="pl-4"><ParamField label="Reveal depth" unit="m" value={f.reveal.depth} onChange={(v) => edit({ ...f, reveal: { ...f.reveal, depth: v } })} /></div>}
          </>
        )}
        {f.trade === 'roofing' && (
          <>
            <MeasurementPick label="Roof plan area" kind="area" value={f.planAreaId} onChange={(id) => edit({ ...f, planAreaId: id })} {...pickProps} />
            <ParamField label="Roof pitch" unit="°" value={f.pitch} onChange={(v) => edit({ ...f, pitch: v })} />
            <MeasurementPick label="Ridge (optional)" kind="linear" value={f.ridgeId} onChange={(id) => edit({ ...f, ridgeId: id })} optional {...pickProps} />
            <label className="block text-xs"><input type="checkbox" checked={f.sheet.enabled} onChange={(e) => edit({ ...f, sheet: { ...f.sheet, enabled: e.target.checked } })} /> Count roofing sheets</label>
            {f.sheet.enabled && (
              <div className="space-y-2 pl-4">
                <ParamField label="Effective cover width" unit="m" value={f.sheet.coverWidth} onChange={(v) => edit({ ...f, sheet: { ...f.sheet, coverWidth: v } })} />
                <ParamField label="Sheet length" unit="m" value={f.sheet.length} onChange={(v) => edit({ ...f, sheet: { ...f.sheet, length: v } })} />
                <ParamField label="End lap" unit="m" value={f.sheet.endLap} onChange={(v) => edit({ ...f, sheet: { ...f.sheet, endLap: v } })} />
                <ParamField label="Wastage (optional)" unit="%" value={f.sheet.wastage} onChange={(v) => edit({ ...f, sheet: { ...f.sheet, wastage: v } })} />
              </div>
            )}
          </>
        )}
        {f.trade === 'rooms' && (
          <>
            <div className="flex gap-4 text-xs">
              <label><input type="checkbox" checked={f.ceiling} onChange={(e) => edit({ ...f, ceiling: e.target.checked })} /> Ceiling finish</label>
              <label><input type="checkbox" checked={f.skirting} onChange={(e) => edit({ ...f, skirting: e.target.checked })} /> Skirting</label>
              <button type="button" onClick={() => edit({ ...f, rooms: [...f.rooms, emptyRoom()] })} className="rounded bg-slate-700 px-2 py-0.5">Add room</button>
            </div>
            {f.rooms.map((r, i) => {
              const upRoom = (next: typeof r) => edit({ ...f, rooms: f.rooms.map((x, j) => (j === i ? next : x)) });
              return (
                <div key={i} className="space-y-2 rounded border border-slate-800 p-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="w-40">Room {i + 1} name</span>
                    <input aria-label={`room ${i + 1} name`} value={r.name} onChange={(e) => upRoom({ ...r, name: e.target.value })} className={`${input} min-w-0`} />
                    <button type="button" aria-label={`remove room ${i + 1}`} onClick={() => edit({ ...f, rooms: f.rooms.filter((_, j) => j !== i) })} className="px-1 text-red-300">×</button>
                  </div>
                  <MeasurementPick label="Floor area" kind="area" value={r.areaId} onChange={(id) => upRoom({ ...r, areaId: id })} {...pickProps} />
                  <MeasurementPick label="Perimeter" kind="linear" value={r.perimeterId} onChange={(id) => upRoom({ ...r, perimeterId: id })} {...pickProps} />
                  {f.skirting && (
                    <div className="space-y-1 pl-4">
                      {r.doorWidths.map((d, j) => (
                        <div key={j} className="flex items-center gap-1">
                          <div className="min-w-0 flex-1"><ParamField label={`Door ${j + 1} width`} unit="m" value={d} onChange={(v) => upRoom({ ...r, doorWidths: r.doorWidths.map((x, k) => (k === j ? v : x)) })} /></div>
                          <button type="button" aria-label={`remove door ${j + 1}`} onClick={() => upRoom({ ...r, doorWidths: r.doorWidths.filter((_, k) => k !== j) })} className="px-1 text-xs text-red-300">×</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => upRoom({ ...r, doorWidths: [...r.doorWidths, { value: '', source: '' }] })} className="rounded bg-slate-700 px-2 py-0.5 text-xs">Add door width (deducted from skirting)</button>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
        {f.trade === 'strip' && (
          <>
            <MeasurementPick label="Trench length" kind="linear" value={f.trenchLengthId} onChange={(id) => edit({ ...f, trenchLengthId: id })} {...pickProps} />
            <ParamField label="Trench width" unit="m" value={f.width} onChange={(v) => edit({ ...f, width: v })} />
            <ParamField label="Trench depth" unit="m" value={f.depth} onChange={(v) => edit({ ...f, depth: v })} />
            <ParamField label="Concrete thickness" unit="m" value={f.concrete} onChange={(v) => edit({ ...f, concrete: v })} />
            <label className="block text-xs"><input type="checkbox" checked={f.wall.enabled} onChange={(e) => edit({ ...f, wall: { ...f.wall, enabled: e.target.checked } })} /> Wall below ground (gives backfill)</label>
            {f.wall.enabled && (
              <div className="space-y-2 pl-4">
                <ParamField label="Wall thickness" unit="m" value={f.wall.thickness} onChange={(v) => edit({ ...f, wall: { ...f.wall, thickness: v } })} />
                <ParamField label="Wall height below ground" unit="m" value={f.wall.height} onChange={(v) => edit({ ...f, wall: { ...f.wall, height: v } })} />
              </div>
            )}
          </>
        )}
        {f.trade === 'openings' && <OpeningsTable rows={f.openings} onChange={(rows) => edit({ ...f, openings: rows })} />}
        {f.trade === 'electrical' && <ElectricalFields f={f} edit={edit} pick={pickProps} />}
        {f.trade === 'plumbing' && <PlumbingFields f={f} edit={edit} pick={pickProps} />}
        {'works' in f && <WorksFields f={f} edit={edit} pick={pickProps} />}
        {(f.trade === 'electrical' || f.trade === 'plumbing') && (
          <div className="rounded border border-amber-500/40 p-2 text-[11px] text-amber-200 space-y-1">
            <p>Count points and fixtures on the drawing with the Count tool, and measure runs with the Length tool (along the run as drawn). Drops, rises, conductors and allowances are entered with their source. A row with no measurement or no sourced count is refused, not guessed.</p>
            {f.trade === 'electrical' && <p>Double counting: if your point rate already includes the wiring back to the board (common in East African BOQs), do not also price the cable and conduit runs.</p>}
            <p>Not measured here (price separately or add as your own items): {MEP_NOT_MEASURED.join('; ')}.</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button type="button" onClick={calculate} className="rounded bg-amber-600 px-3 py-1 text-white">Calculate</button>
        <label>BOQ section <input aria-label="BOQ section for trade items" value={section} onChange={(e) => { setSection(e.target.value); setAdded(''); }} className={`${input} w-40`} /></label>
        <button type="button" onClick={add} disabled={!lines} className="rounded bg-emerald-700 px-3 py-1 text-white disabled:opacity-40">Add to BOQ</button>
      </div>
      {/* Always in the DOM, so screen readers announce the message when it changes. */}
      <p className="text-xs text-red-300" role="alert">{error}</p>
      <p className="text-xs text-emerald-300" role="status">{added}</p>
      {lines && (
        <div className="relative overflow-x-auto" role="region" aria-label="Calculated trade quantities table, scrolls sideways" tabIndex={0}><table className="w-full min-w-[40rem] text-xs">
          <caption className="sr-only">Calculated trade quantities</caption>
          <thead><tr className="text-left text-slate-400"><th scope="col">Code</th><th scope="col">Description</th><th scope="col" className="text-right">Quantity</th><th scope="col">Unit</th><th scope="col">Formula</th><th scope="col">Inputs</th></tr></thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.code} className="border-t border-slate-800 align-top">
                <td className="py-1 pr-2">{l.code}</td><td className="pr-2">{l.description}</td>
                <td className="pr-2 text-right">{l.quantity.toLocaleString('en-KE', { maximumFractionDigits: 3 })}</td><td className="pr-2">{l.unit}</td>
                <td className="pr-2 text-slate-300">{l.formula}</td>
                <td className="text-slate-400"><ul>{l.inputs.map((x) => <li key={x}>{x}</li>)}</ul></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
      <p className="text-[11px] text-slate-500">{TRADES_ENGINE_VERSION} · {MEP_ENGINE_VERSION} · {WORKS_ENGINE_VERSION}</p>
    </div>
  );
}
