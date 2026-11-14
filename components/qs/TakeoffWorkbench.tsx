'use client';

/**
 * Measured take-off to BOQ (P1-D). Load a drawing image, calibrate the scale
 * with two known dimensions, measure on the drawing, link measurements to BOQ
 * items, price them with dated rates, and export to Excel with formulas.
 * Engines: lib/qs/takeoff.ts, lib/qs/boq.ts, lib/qs/export.ts.
 * PDF sheets: export the sheet to PNG first (direct PDF import pending).
 */
import { useMemo, useRef, useState } from 'react';
import { calibrate, quantify, TakeoffError, TAKEOFF_ENGINE_VERSION, type Calibration, type Measurement, type MeasureKind, type Pt } from '@/lib/qs/takeoff';
import { buildBoq, BOQ_ENGINE_VERSION, type Adjustments, type BoqItem } from '@/lib/qs/boq';

type Mode = 'calibrate' | MeasureKind | 'hole';
const UNIT: Record<MeasureKind, BoqItem['unit']> = { linear: 'm', area: 'm²', volume: 'm³', count: 'No' };
const fmt = (x: number | null, d = 2) => (x === null ? '—' : x.toLocaleString('en-KE', { minimumFractionDigits: d, maximumFractionDigits: d }));

interface ItemDraft { code: string; section: string; description: string; measurementId: string; factor: string; rate: string; source: string; date: string; location: string }

export default function TakeoffWorkbench() {
  const [img, setImg] = useState<{ url: string; w: number; h: number; name: string } | null>(null);
  const [mode, setMode] = useState<Mode>('calibrate');
  const [pts, setPts] = useState<Pt[]>([]);
  const [refs, setRefs] = useState<Array<{ a: Pt; b: Pt; knownM: number }>>([]);
  const [refLen, setRefLen] = useState('');
  const [stated, setStated] = useState({ ratio: '', dpi: '' });
  const [cal, setCal] = useState<Calibration | null>(null);
  const [calErr, setCalErr] = useState('');
  const [ms, setMs] = useState<Measurement[]>([]);
  const [label, setLabel] = useState('');
  const [depth, setDepth] = useState('');
  const [err, setErr] = useState('');
  const [items, setItems] = useState<ItemDraft[]>([]);
  const [adj, setAdj] = useState({ prelims: '', contingency: '', ohp: '', vat: '', vatFrom: '' });
  const svgRef = useRef<SVGSVGElement>(null);

  const load = (f: File) => {
    const url = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => { setImg({ url, w: im.naturalWidth, h: im.naturalHeight, name: f.name }); setRefs([]); setCal(null); setMs([]); setPts([]); };
    im.src = url;
  };

  const click = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !img) return;
    const r = svgRef.current.getBoundingClientRect();
    const p = { x: ((e.clientX - r.left) / r.width) * img.w, y: ((e.clientY - r.top) / r.height) * img.h };
    if (mode === 'calibrate') { setPts((x) => (x.length >= 2 ? [p] : [...x, p])); return; }
    if (!cal) { setErr('Calibrate the sheet first'); return; }
    setPts((x) => [...x, p]);
  };

  const addRef = () => {
    const k = Number(refLen);
    if (pts.length !== 2 || !(k > 0)) { setCalErr('Click the two ends of a known dimension and enter its length in metres'); return; }
    const next = [...refs, { a: pts[0], b: pts[1], knownM: k }];
    setRefs(next); setPts([]); setRefLen(''); setCalErr('');
    if (next.length >= 2) {
      try {
        setCal(calibrate(img?.name ?? 'sheet', next, stated.ratio && stated.dpi ? { ratio: Number(stated.ratio), unit: 'px', dpi: Number(stated.dpi) } : undefined));
        setMode('linear');
      } catch (e) { setCalErr((e as Error).message); setRefs([]); setCal(null); }
    }
  };

  const finish = () => {
    if (!cal) return;
    setErr('');
    if (mode === 'hole') {
      const last = ms[ms.length - 1];
      if (!last || (last.kind !== 'area' && last.kind !== 'volume')) { setErr('Measure an area first, then add its openings'); return; }
      const m = { ...last, holes: [...(last.holes ?? []), pts] };
      try { quantify(m); setMs([...ms.slice(0, -1), m]); setPts([]); } catch (e) { setErr((e as Error).message); }
      return;
    }
    if (mode === 'calibrate') return;
    const m: Measurement = { id: `M${ms.length + 1}`, kind: mode, sheetId: cal.sheetId, label: label || `${mode} ${ms.length + 1}`, points: pts, depthM: mode === 'volume' ? Number(depth) : undefined, metresPerUnit: cal.metresPerUnit, user: 'this browser', at: new Date().toISOString(), revision: 'A' };
    try { quantify(m); setMs([...ms, m]); setPts([]); setLabel(''); } catch (e) { setErr(e instanceof TakeoffError ? e.message : String(e)); }
  };

  const quantities = useMemo(() => new Map(ms.map((m) => [m.id, quantify(m)])), [ms]);

  const boq = useMemo(() => {
    if (!items.length) return null;
    const boqItems: BoqItem[] = items.map((d) => {
      const q = quantities.get(d.measurementId);
      return {
        code: d.code, section: d.section || 'General', trade: '', description: d.description, unit: q ? UNIT[q.kind] : 'item',
        links: [{ measurementId: d.measurementId, factor: Number(d.factor || '1') }],
        rate: d.rate.trim() === '' ? null : { value: Number(d.rate), currency: 'KES', source: d.source, date: d.date, location: d.location, kind: 'rate-library' },
      };
    });
    const a: Adjustments = { preliminaries: { kind: 'percent', pct: Number(adj.prelims || 'NaN') }, contingencyPct: Number(adj.contingency || 'NaN'), overheadsProfitPct: Number(adj.ohp || 'NaN'), vat: { pct: Number(adj.vat || 'NaN'), effectiveFrom: adj.vatFrom } };
    return { boq: buildBoq(boqItems, quantities, a, 'A'), adj: a };
  }, [items, quantities, adj]);

  const exportXlsx = async () => {
    if (!boq) return;
    const { boqToXlsx } = await import('@/lib/qs/export');
    try {
      const buf = await boqToXlsx(boq.boq, boq.adj, img?.name ?? 'Project');
      const url = URL.createObjectURL(new Blob([new Uint8Array(buf)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const a = document.createElement('a'); a.href = url; a.download = 'boq-rev-A.xlsx'; a.click(); URL.revokeObjectURL(url);
    } catch (e) { setErr((e as Error).message); }
  };

  const input = 'rounded bg-slate-900 border border-slate-700 px-2 py-1 text-sm text-white';
  const modes: Array<[Mode, string]> = [['calibrate', 'Calibrate'], ['linear', 'Length'], ['area', 'Area'], ['hole', 'Opening (deduct)'], ['volume', 'Volume'], ['count', 'Count']];

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 text-slate-200">
      <h1 className="text-2xl font-bold">Measured take-off and BOQ</h1>
      <p className="text-sm text-slate-400">Every quantity is measured on your drawing. Nothing is generated from a description. Calibrate each sheet with two known dimensions, one in each direction. They must agree within 1 %.</p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">Drawing (PNG/JPG): <input type="file" accept="image/png,image/jpeg" onChange={(e) => e.target.files?.[0] && load(e.target.files[0])} className="text-sm" /></label>
        <label className="text-xs">Stated scale 1:<input value={stated.ratio} onChange={(e) => setStated({ ...stated, ratio: e.target.value })} className={`${input} w-16 ml-1`} /></label>
        <label className="text-xs">Image DPI <input value={stated.dpi} onChange={(e) => setStated({ ...stated, dpi: e.target.value })} className={`${input} w-16 ml-1`} /></label>
      </div>
      {img && (
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Measurement tools">
              {modes.map(([m, l]) => (
                <button key={m} type="button" onClick={() => { setMode(m); setPts([]); }} disabled={m !== 'calibrate' && !cal}
                  className={`rounded px-3 py-1 text-xs border ${mode === m ? 'border-amber-400 bg-amber-500/20' : 'border-slate-600'} disabled:opacity-40`}>{l}</button>
              ))}
              {mode !== 'calibrate' && <button type="button" onClick={finish} className="rounded bg-amber-600 px-3 py-1 text-xs text-white">Finish ({pts.length} pts)</button>}
              {pts.length > 0 && <button type="button" onClick={() => setPts(pts.slice(0, -1))} className="rounded border border-slate-600 px-3 py-1 text-xs">Undo point</button>}
            </div>
            <div className="overflow-auto rounded border border-slate-700 bg-white">
              <svg ref={svgRef} viewBox={`0 0 ${img.w} ${img.h}`} className="w-full cursor-crosshair" onClick={click}>
                <image href={img.url} width={img.w} height={img.h} />
                {ms.map((m) => (
                  <g key={m.id}>
                    {m.kind === 'count' ? m.points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={img.w / 200} fill="#2563eb" />)
                      : m.kind === 'linear' ? <polyline points={m.points.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#2563eb" strokeWidth={img.w / 500} />
                        : <polygon points={m.points.map((p) => `${p.x},${p.y}`).join(' ')} fill="rgba(37,99,235,0.15)" stroke="#2563eb" strokeWidth={img.w / 500} />}
                    {(m.holes ?? []).map((h, i) => <polygon key={i} points={h.map((p) => `${p.x},${p.y}`).join(' ')} fill="rgba(239,68,68,0.25)" stroke="#dc2626" strokeWidth={img.w / 600} />)}
                  </g>
                ))}
                {pts.length > 0 && <polyline points={pts.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#f59e0b" strokeWidth={img.w / 400} />}
                {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={img.w / 250} fill="#f59e0b" />)}
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded border border-slate-700 p-3 space-y-2">
              <div className="text-sm font-semibold">Scale</div>
              {cal ? (
                <p className="text-xs text-emerald-300">Calibrated: {(cal.metresPerUnit * 1000).toFixed(4)} mm per pixel; reference agreement {cal.mismatchPct} %.{cal.statedScale ? ` Stated scale difference ${cal.statedScale.differencePct} %.` : ''}</p>
              ) : (
                <>
                  <p className="text-xs text-slate-400">Reference {refs.length + 1} of 2: click both ends of a dimension written on the drawing, then enter its length.</p>
                  <div className="flex gap-2"><input value={refLen} onChange={(e) => setRefLen(e.target.value)} placeholder="length (m)" aria-label="Known length in metres" className={`${input} w-28`} /><button type="button" onClick={addRef} className="rounded bg-slate-700 px-3 text-xs">Add reference</button></div>
                </>
              )}
              {cal?.statedScale?.warning && <p className="text-xs text-amber-300">{cal.statedScale.warning}</p>}
              {calErr && <p className="text-xs text-red-300">{calErr}</p>}
            </div>
            {cal && mode !== 'calibrate' && mode !== 'hole' && (
              <div className="rounded border border-slate-700 p-3 space-y-2">
                <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (e.g. Ground floor slab)" aria-label="Measurement label" className={`${input} w-full`} />
                {mode === 'volume' && <input value={depth} onChange={(e) => setDepth(e.target.value)} placeholder="Depth / thickness (m)" aria-label="Depth in metres" className={`${input} w-full`} />}
              </div>
            )}
            {err && <p className="text-xs text-red-300" role="alert">{err}</p>}
            <div className="rounded border border-slate-700 p-3">
              <div className="text-sm font-semibold mb-1">Measurements</div>
              {ms.length === 0 ? <p className="text-xs text-slate-500">None yet.</p> : (
                <table className="w-full text-xs"><tbody>
                  {ms.map((m) => { const q = quantities.get(m.id)!; return (
                    <tr key={m.id} className="border-t border-slate-800"><td className="py-1">{m.id}</td><td>{m.label}</td><td className="text-right">{fmt(q.net, 3)} {q.unit}</td><td className="text-right text-slate-500">{q.deductions ? `−${fmt(q.deductions, 3)}` : ''}</td></tr>
                  ); })}
                </tbody></table>
              )}
            </div>
          </div>
        </div>
      )}

      {ms.length > 0 && (
        <div className="rounded border border-slate-700 p-3 space-y-3">
          <div className="flex items-center justify-between"><div className="text-sm font-semibold">Bill of quantities</div>
            <button type="button" onClick={() => setItems([...items, { code: `${items.length + 1}`, section: '', description: '', measurementId: ms[0].id, factor: '1', rate: '', source: '', date: '', location: '' }])} className="rounded bg-slate-700 px-3 py-1 text-xs">Add item</button></div>
          <div className="overflow-x-auto"><table className="w-full text-xs">
            <thead><tr className="text-left text-slate-400"><th>Code</th><th>Section</th><th>Description</th><th>Measurement</th><th>× factor</th><th>Rate (KES)</th><th>Rate source</th><th>Rate date</th><th>Location</th><th className="text-right">Qty</th><th className="text-right">Amount</th></tr></thead>
            <tbody>
              {items.map((d, i) => {
                const line = boq?.boq.lines[i];
                const up = (k: keyof ItemDraft, v: string) => setItems(items.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
                return (
                  <tr key={i} className="border-t border-slate-800">
                    {(['code', 'section', 'description'] as const).map((k) => <td key={k}><input aria-label={k} value={d[k]} onChange={(e) => up(k, e.target.value)} className={`${input} w-full`} /></td>)}
                    <td><select aria-label="measurement" value={d.measurementId} onChange={(e) => up('measurementId', e.target.value)} className={input}>{ms.map((m) => <option key={m.id} value={m.id}>{m.id} {m.label}</option>)}</select></td>
                    {(['factor', 'rate', 'source', 'date', 'location'] as const).map((k) => <td key={k}><input aria-label={k} value={d[k]} placeholder={k === 'date' ? 'YYYY-MM-DD' : ''} onChange={(e) => up(k, e.target.value)} className={`${input} w-full`} /></td>)}
                    <td className="text-right">{line ? `${fmt(line.quantity, 3)} ${line.unit}` : ''}</td>
                    <td className="text-right">{line ? (line.amount === null ? <span className="text-amber-300">rate required</span> : fmt(line.amount)) : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table></div>
          <div className="flex flex-wrap gap-3 text-xs">
            {([['prelims', 'Preliminaries %'], ['contingency', 'Contingency %'], ['ohp', 'Overheads & profit %'], ['vat', 'VAT %'], ['vatFrom', 'VAT rate effective from']] as const).map(([k, l]) => (
              <label key={k}>{l} <input value={adj[k]} onChange={(e) => setAdj({ ...adj, [k]: e.target.value })} placeholder={k === 'vatFrom' ? 'YYYY-MM-DD' : ''} className={`${input} w-28 ml-1`} /></label>
            ))}
          </div>
          {boq && (
            <div className="text-sm space-y-1">
              {boq.boq.errors.map((e) => <p key={e} className="text-xs text-red-300">{e}</p>)}
              {boq.boq.grandTotal === null ? (
                <p className="text-amber-300">No total yet: {boq.boq.unpricedItems.length ? `${boq.boq.unpricedItems.length} item(s) need a dated rate` : 'complete the adjustments'}. Priced items so far: KES {fmt(boq.boq.pricedSubtotal)} (not a bill total).</p>
              ) : (
                <table className="text-sm"><tbody>
                  {([['Measured works', boq.boq.measuredWorks], ['Preliminaries', boq.boq.preliminaries], ['Contingency', boq.boq.contingency], ['Overheads & profit', boq.boq.overheadsProfit], ['Subtotal before VAT', boq.boq.subtotalBeforeVat], ['VAT', boq.boq.vat], ['TOTAL', boq.boq.grandTotal]] as Array<[string, number | null]>).map(([l, v]) => (
                    <tr key={l} className={l === 'TOTAL' ? 'font-bold' : ''}><td className="pr-6">{l}</td><td className="text-right">KES {fmt(v)}</td></tr>
                  ))}
                </tbody></table>
              )}
              <button type="button" onClick={exportXlsx} disabled={boq.boq.grandTotal === null} className="rounded bg-emerald-700 px-3 py-1 text-xs text-white disabled:opacity-40">Export Excel (with formulas)</button>
            </div>
          )}
        </div>
      )}
      <p className="text-[11px] text-slate-500">{TAKEOFF_ENGINE_VERSION} · {BOQ_ENGINE_VERSION}. Reinforcement and formwork are not measured here. They come from the bar schedules and the formwork scheme. Rates come only from your dated rate library or supplier quotes.</p>
    </div>
  );
}
