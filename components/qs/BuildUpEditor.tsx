'use client';

/**
 * Rate build-up editor for one BOQ item (2026-11-25). The user types each
 * material, labour and plant line with its price, source and date, or picks
 * a line from a rates file they loaded (citation and date come from the file).
 * Every figure shown is the engine's (lib/qs/rateBuildUp via lib/qs/boq), the
 * same numbers the Excel and PDF exports print.
 */
import { useState } from 'react';
import {
  emptyResource, resourceFromRates, RESOURCE_LABELS, RatesFileError, TIER_SHORT,
  type BuildUpDraft, type BuildUpResult, type PriceTier, type RatesFile, type ResourceDraft, type ResourceKind,
} from '@/lib/qs/rateBuildUp';

const input = 'rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white';
const fmt = (x: number | null) => (x === null ? '—' : x.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

export default function BuildUpEditor({ item, unit, draft, result, rates, onChange }: {
  item: string; unit: string; draft: BuildUpDraft; result: BuildUpResult | undefined; rates: RatesFile | null;
  onChange: (d: BuildUpDraft) => void;
}) {
  const [pick, setPick] = useState('');
  const [err, setErr] = useState('');
  const up = (i: number, r: ResourceDraft) => onChange({ ...draft, resources: draft.resources.map((x, j) => (j === i ? r : x)) });
  const add = (r: ResourceDraft) => onChange({ ...draft, resources: [...draft.resources, r] });
  const fromRates = () => {
    if (!rates || !pick) return;
    try { add(resourceFromRates(rates, pick)); setErr(''); setPick(''); } catch (e) { setErr(e instanceof RatesFileError ? e.message : String(e)); }
  };
  const name = (i: number, f: string) => `${item} build-up line ${i + 1} ${f}`;
  return (
    <div className="space-y-2 rounded border border-sky-700/60 p-2 text-xs">
      <div className="font-semibold">Rate build-up for {item}, per {unit}</div>
      <p className="text-slate-400">Material = quantity per {unit} × price × (1 + waste %); labour and plant = hours per {unit} × rate per hour. Net + overheads &amp; profit = unit rate. A line with no price leaves the rate as “rate required”.</p>
      <div className="overflow-x-auto"><table className="w-full min-w-[56rem]">
        <caption className="sr-only">{`Rate build-up lines for ${item}`}</caption>
        <thead><tr className="text-left text-slate-400">{['Kind', 'Description', 'Unit', `Qty per ${unit}`, 'Price (KES)', 'Waste %', 'Price source', 'Price date', 'Price status', 'Amount'].map((h) => <th key={h} scope="col">{h}</th>)}<th scope="col"><span className="sr-only">Remove</span></th></tr></thead>
        <tbody>
          {draft.resources.map((r, i) => {
            const line = result?.lines[i];
            return (
              <tr key={i} className="border-t border-slate-800">
                <td><select aria-label={name(i, 'kind')} value={r.kind} onChange={(e) => up(i, { ...r, kind: e.target.value as ResourceKind | '' })} className={input}>
                  <option value="">choose…</option>
                  {(Object.keys(RESOURCE_LABELS) as ResourceKind[]).map((k) => <option key={k} value={k}>{RESOURCE_LABELS[k]}</option>)}
                </select></td>
                {(['description', 'unit', 'quantity', 'price', 'waste', 'source', 'date'] as const).map((k) => (
                  <td key={k}><input aria-label={name(i, k)} value={r[k]} disabled={k === 'waste' && r.kind !== 'material' && r.kind !== ''} placeholder={k === 'date' ? 'YYYY-MM-DD' : k === 'waste' ? '0' : ''}
                    onChange={(e) => up(i, { ...r, [k]: e.target.value })} className={`${input} w-full disabled:opacity-40`} inputMode={k === 'quantity' || k === 'price' || k === 'waste' ? 'decimal' : undefined} /></td>
                ))}
                <td><select aria-label={name(i, 'price status')} value={r.tier} onChange={(e) => up(i, { ...r, tier: e.target.value as PriceTier | '' })} className={`${input} ${r.tier === 'indicative' ? 'border-amber-500' : r.tier === 'verified' ? 'border-emerald-500' : ''}`}>
                  <option value="">choose…</option>
                  <option value="verified">Verified (company rate / supplier quotation)</option>
                  <option value="indicative">Indicative (public source, budget only)</option>
                </select></td>
                <td className="text-right">{line ? (line.amount === null ? <span className="text-amber-300">price required</span> : fmt(line.amount)) : ''}</td>
                <td><button type="button" aria-label={name(i, 'remove')} onClick={() => onChange({ ...draft, resources: draft.resources.filter((_, j) => j !== i) })} className="px-1 text-red-300">×</button></td>
              </tr>
            );
          })}
        </tbody>
      </table></div>
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(RESOURCE_LABELS) as ResourceKind[]).map((k) => <button key={k} type="button" onClick={() => add(emptyResource(k))} className="rounded bg-slate-700 px-2 py-0.5">Add {RESOURCE_LABELS[k].toLowerCase()}</button>)}
        {rates && (
          <>
            <select aria-label={`${item} rates file entry`} value={pick} onChange={(e) => setPick(e.target.value)} className={`${input} max-w-xs`}>
              <option value="">from rates file…</option>
              {rates.records.map((e) => <option key={e.code} value={e.code}>{e.code} · {e.description} ({e.specification}) · {e.value === null ? 'no value: quotation required' : `${e.value} KES/${e.unit}`} · {e.status}</option>)}
            </select>
            <button type="button" onClick={fromRates} disabled={!pick} className="rounded bg-sky-800 px-2 py-0.5 disabled:opacity-40">Add from rates file</button>
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <label>Overheads &amp; profit % <input aria-label={`${item} build-up overheads and profit %`} value={draft.ohp} onChange={(e) => onChange({ ...draft, ohp: e.target.value })} className={`${input} w-16`} inputMode="decimal" /></label>
        <label>basis <input aria-label={`${item} build-up overheads and profit basis`} value={draft.ohpSource} onChange={(e) => onChange({ ...draft, ohpSource: e.target.value })} placeholder="e.g. company policy 2026" className={`${input} w-48`} /></label>
        <label>Location <input aria-label={`${item} build-up location`} value={draft.location} onChange={(e) => onChange({ ...draft, location: e.target.value })} placeholder="e.g. Nairobi" className={`${input} w-32`} /></label>
      </div>
      <p className="text-red-300" role="alert">{err}</p>
      {result && (
        result.rate === null
          ? <p className="text-amber-300">Rate required: {[...result.errors, ...result.missing].join('; ') || 'complete the build-up'}.</p>
          : <p className={result.tier === 'indicative' ? 'text-amber-300' : 'text-emerald-300'}>Materials {fmt(result.materials)} + labour {fmt(result.labour)} + plant {fmt(result.plant)} = net {fmt(result.net)}; O&amp;P {result.ohpPct} % = {fmt(result.ohp)}; unit rate <strong>KES {fmt(result.rate)}</strong> per {unit}. Price status: <strong>{TIER_SHORT[result.tier!]}</strong>{result.tier === 'indicative' ? ' (preliminary budget only, not a quotation)' : ''}. Prices dated from {result.priceDate}.</p>
      )}
    </div>
  );
}
