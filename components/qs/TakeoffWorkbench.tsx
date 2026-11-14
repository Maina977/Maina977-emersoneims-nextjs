'use client';

/**
 * Measured take-off to BOQ (P1-D). Open a drawing (PDF, vector or scanned, or
 * an image), calibrate each sheet with two known dimensions, measure on the
 * drawing, link measurements to BOQ items, price them with dated rates, and
 * export to Excel with formulas.
 *
 * PDF points are stored in PDF user space (lib/qs/pdfSheet.ts), so zoom and
 * displayed rotation never change a measurement, and each one records the
 * file's SHA-256 and page. Engines: lib/qs/takeoff.ts, boq.ts, export.ts.
 */
import { useMemo, useRef, useState } from 'react';
import { calibrate, quantify, TakeoffError, TAKEOFF_ENGINE_VERSION, type Calibration, type Measurement, type MeasureKind, type Pt } from '@/lib/qs/takeoff';
import { buildBoq, BOQ_ENGINE_VERSION, type Adjustments, type BoqItem } from '@/lib/qs/boq';
import { analysePage, sha256Hex, viewportToPdf, pdfToViewport, resolutionLimitM, PDF_SHEET_VERSION, type SheetInfo, type PdfPageLike, type ViewportLike } from '@/lib/qs/pdfSheet';

type Mode = 'calibrate' | MeasureKind | 'hole';
const UNIT: Record<MeasureKind, BoqItem['unit']> = { linear: 'm', area: 'm²', volume: 'm³', count: 'No' };
const fmt = (x: number | null, d = 2) => (x === null ? '—' : x.toLocaleString('en-KE', { minimumFractionDigits: d, maximumFractionDigits: d }));
const RENDER_WIDTH_PX = 2400; // render width; zoom changes display only, never stored points

interface Sheet {
  id: string; // file hash + page, or image name
  label: string;
  kind: 'pdf' | 'image';
  url: string; w: number; h: number;
  toSheet: (x: number, y: number) => Pt;
  toDisplay: (p: Pt) => Pt;
  /** Display pixels per sheet unit (for the resolution limit). */
  pxPerUnit: number;
  info?: SheetInfo;
  statedUnit: 'pt' | 'px';
}
interface ItemDraft { code: string; section: string; description: string; measurementId: string; factor: string; rate: string; source: string; date: string; location: string }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PdfDoc = any;

export default function TakeoffWorkbench() {
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [pdf, setPdf] = useState<{ doc: PdfDoc; name: string; sha: string; pages: number } | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [viewRot, setViewRot] = useState(0);
  const [busy, setBusy] = useState('');
  const [mode, setMode] = useState<Mode>('calibrate');
  const [pts, setPts] = useState<Pt[]>([]); // sheet units
  const [refs, setRefs] = useState<Record<string, Array<{ a: Pt; b: Pt; knownM: number }>>>({});
  const [refLen, setRefLen] = useState('');
  const [stated, setStated] = useState({ ratio: '', dpi: '' });
  const [cals, setCals] = useState<Record<string, Calibration>>({});
  const [calErr, setCalErr] = useState('');
  const [ms, setMs] = useState<Measurement[]>([]);
  const [label, setLabel] = useState('');
  const [depth, setDepth] = useState('');
  const [err, setErr] = useState('');
  const [items, setItems] = useState<ItemDraft[]>([]);
  const [adj, setAdj] = useState({ prelims: '', contingency: '', ohp: '', vat: '', vatFrom: '' });
  const svgRef = useRef<SVGSVGElement>(null);
  const cal = sheet ? cals[sheet.id] ?? null : null;
  const sheetRefs = sheet ? refs[sheet.id] ?? [] : [];

  async function renderPdfPage(p: { doc: PdfDoc; name: string; sha: string; pages: number }, n: number, rot: number) {
    setBusy(`Rendering page ${n}…`);
    try {
      const pdfjs = await import('pdfjs-dist');
      const page = await p.doc.getPage(n);
      const base = page.getViewport({ scale: 1, rotation: (page.rotate + rot) % 360 });
      const scale = RENDER_WIDTH_PX / base.width;
      const vp: ViewportLike = page.getViewport({ scale, rotation: (page.rotate + rot) % 360 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(vp.width); canvas.height = Math.round(vp.height);
      await page.render({ canvas, viewport: vp }).promise;
      const info = await analysePage(pdfjs, page as unknown as PdfPageLike, { name: p.name, sha256: p.sha, pageCount: p.pages });
      setSheet({
        id: `${p.sha.slice(0, 16)}#p${n}`, label: `${p.name}, page ${n} of ${p.pages}`, kind: 'pdf', url: canvas.toDataURL('image/png'), w: canvas.width, h: canvas.height,
        toSheet: (x, y) => viewportToPdf(vp, x, y), toDisplay: (q) => pdfToViewport(vp, q), pxPerUnit: scale, info, statedUnit: 'pt',
      });
      setPts([]);
    } catch (e) { setErr(`Could not render the page: ${(e as Error).message}`); }
    setBusy('');
  }

  const load = async (f: File) => {
    setErr(''); setCalErr(''); setPts([]);
    if (f.type === 'application/pdf' || /\.pdf$/i.test(f.name)) {
      setBusy('Opening PDF…');
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
        const bytes = new Uint8Array(await f.arrayBuffer());
        const sha = await sha256Hex(bytes);
        const doc = await pdfjs.getDocument({ data: bytes }).promise;
        const p = { doc, name: f.name, sha, pages: doc.numPages };
        setPdf(p); setPageNo(1); setViewRot(0);
        await renderPdfPage(p, 1, 0);
      } catch (e) { setErr(`Could not open the PDF: ${(e as Error).message}`); setBusy(''); }
      return;
    }
    const url = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => {
      setPdf(null);
      setSheet({ id: `img:${f.name}:${f.size}`, label: f.name, kind: 'image', url, w: im.naturalWidth, h: im.naturalHeight, toSheet: (x, y) => ({ x, y }), toDisplay: (q) => q, pxPerUnit: 1, statedUnit: 'px' });
    };
    im.src = url;
  };

  const click = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !sheet) return;
    const r = svgRef.current.getBoundingClientRect();
    const p = sheet.toSheet(((e.clientX - r.left) / r.width) * sheet.w, ((e.clientY - r.top) / r.height) * sheet.h);
    if (mode === 'calibrate') { setPts((x) => (x.length >= 2 ? [p] : [...x, p])); return; }
    if (!cal) { setErr('Calibrate this sheet first'); return; }
    setPts((x) => [...x, p]);
  };

  const addRef = () => {
    if (!sheet) return;
    const k = Number(refLen);
    if (pts.length !== 2 || !(k > 0)) { setCalErr('Click the two ends of a known dimension and enter its length in metres'); return; }
    const next = [...sheetRefs, { a: pts[0], b: pts[1], knownM: k }];
    setPts([]); setRefLen(''); setCalErr('');
    setRefs({ ...refs, [sheet.id]: next });
    if (next.length >= 2) {
      try {
        const st = stated.ratio ? (sheet.statedUnit === 'pt' ? { ratio: Number(stated.ratio), unit: 'pt' as const } : stated.dpi ? { ratio: Number(stated.ratio), unit: 'px' as const, dpi: Number(stated.dpi) } : undefined) : undefined;
        setCals({ ...cals, [sheet.id]: calibrate(sheet.id, next, st) });
        setMode('linear');
      } catch (e) { setCalErr((e as Error).message); setRefs({ ...refs, [sheet.id]: [] }); }
    }
  };

  const finish = () => {
    if (!cal || !sheet) return;
    setErr('');
    if (mode === 'hole') {
      const idx = ms.map((m) => m.sheetId).lastIndexOf(sheet.id);
      const last = ms[idx];
      if (!last || (last.kind !== 'area' && last.kind !== 'volume')) { setErr('Measure an area on this sheet first, then add its openings'); return; }
      const m = { ...last, holes: [...(last.holes ?? []), pts] };
      try { quantify(m); setMs(ms.map((x, i) => (i === idx ? m : x))); setPts([]); } catch (e) { setErr((e as Error).message); }
      return;
    }
    if (mode === 'calibrate') return;
    const m: Measurement = { id: `M${ms.length + 1}`, kind: mode, sheetId: sheet.id, label: label || `${mode} ${ms.length + 1}`, points: pts, depthM: mode === 'volume' ? Number(depth) : undefined, metresPerUnit: cal.metresPerUnit, user: 'this browser', at: new Date().toISOString(), revision: 'A' };
    try { quantify(m); setMs([...ms, m]); setPts([]); setLabel(''); } catch (e) { setErr(e instanceof TakeoffError ? e.message : String(e)); }
  };

  const quantities = useMemo(() => new Map(ms.map((m) => [m.id, quantify(m)])), [ms]);
  // Click precision is one pixel of the drawing as DISPLAYED (the rendered image is scaled to the panel width).
  const shownScale = sheet && svgRef.current?.clientWidth ? svgRef.current.clientWidth / sheet.w : 1;
  const limitMm = sheet && cal ? (sheet.info ? resolutionLimitM(sheet.info, cal.metresPerUnit, sheet.pxPerUnit * shownScale) : cal.metresPerUnit / shownScale) * 1000 : null;

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
      const buf = await boqToXlsx(boq.boq, boq.adj, pdf?.name ?? sheet?.label ?? 'Project');
      const url = URL.createObjectURL(new Blob([new Uint8Array(buf)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const a = document.createElement('a'); a.href = url; a.download = 'boq-rev-A.xlsx'; a.click(); URL.revokeObjectURL(url);
    } catch (e) { setErr((e as Error).message); }
  };

  const input = 'rounded bg-slate-900 border border-slate-700 px-2 py-1 text-sm text-white';
  const modes: Array<[Mode, string]> = [['calibrate', 'Calibrate'], ['linear', 'Length'], ['area', 'Area'], ['hole', 'Opening (deduct)'], ['volume', 'Volume'], ['count', 'Count']];
  const sw = sheet ? sheet.w / 500 : 1;
  const D = (p: Pt) => sheet!.toDisplay(p);
  const poly = (ps: Pt[]) => ps.map((p) => { const d = D(p); return `${d.x},${d.y}`; }).join(' ');

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 text-slate-200">
      <h1 className="text-2xl font-bold">Measured take-off and BOQ</h1>
      <p className="text-sm text-slate-400">Every quantity is measured on your drawing. Nothing is generated from a description. Calibrate each sheet with two known dimensions, one in each direction. They must agree within 1 %.</p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">Drawing (PDF, PNG or JPG): <input type="file" accept="application/pdf,image/png,image/jpeg" onChange={(e) => e.target.files?.[0] && load(e.target.files[0])} className="text-sm" /></label>
        <label className="text-xs">Stated scale 1:<input value={stated.ratio} onChange={(e) => setStated({ ...stated, ratio: e.target.value })} className={`${input} w-16 ml-1`} /></label>
        {sheet?.kind === 'image' && <label className="text-xs">Image DPI <input value={stated.dpi} onChange={(e) => setStated({ ...stated, dpi: e.target.value })} className={`${input} w-16 ml-1`} /></label>}
        {pdf && (
          <>
            <label className="text-xs">Page <select value={pageNo} onChange={(e) => { const n = Number(e.target.value); setPageNo(n); renderPdfPage(pdf, n, viewRot); }} className={input}>{Array.from({ length: pdf.pages }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select> of {pdf.pages}</label>
            <button type="button" onClick={() => { const r = (viewRot + 90) % 360; setViewRot(r); renderPdfPage(pdf, pageNo, r); }} className="rounded border border-slate-600 px-2 py-1 text-xs">Rotate view 90°</button>
          </>
        )}
        {busy && <span className="text-xs text-amber-300">{busy}</span>}
      </div>
      {sheet?.info && (
        <div className="rounded border border-slate-700 p-2 text-xs text-slate-300">
          <strong>{sheet.label}</strong> · sheet {sheet.info.widthMm} × {sheet.info.heightMm} mm · {sheet.info.kind === 'vector' ? 'vector drawing' : sheet.info.kind === 'raster' ? `scanned at ${sheet.info.rasterDpi} dpi` : sheet.info.kind}
          {' '}· file SHA-256 {sheet.info.sha256.slice(0, 12)}…{sheet.info.notes.map((n) => <div key={n} className="text-amber-300">{n}</div>)}
        </div>
      )}
      {sheet && (
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
              <svg ref={svgRef} viewBox={`0 0 ${sheet.w} ${sheet.h}`} className="w-full cursor-crosshair" onClick={click}>
                <image href={sheet.url} width={sheet.w} height={sheet.h} />
                {ms.filter((m) => m.sheetId === sheet.id).map((m) => (
                  <g key={m.id}>
                    {m.kind === 'count' ? m.points.map((p, i) => { const d = D(p); return <circle key={i} cx={d.x} cy={d.y} r={sw * 2.5} fill="#2563eb" />; })
                      : m.kind === 'linear' ? <polyline points={poly(m.points)} fill="none" stroke="#2563eb" strokeWidth={sw} />
                        : <polygon points={poly(m.points)} fill="rgba(37,99,235,0.15)" stroke="#2563eb" strokeWidth={sw} />}
                    {(m.holes ?? []).map((h, i) => <polygon key={i} points={poly(h)} fill="rgba(239,68,68,0.25)" stroke="#dc2626" strokeWidth={sw * 0.8} />)}
                  </g>
                ))}
                {sheetRefs.map((r, i) => <polyline key={i} points={poly([r.a, r.b])} stroke="#16a34a" strokeWidth={sw * 1.5} fill="none" />)}
                {pts.length > 0 && <polyline points={poly(pts)} fill="none" stroke="#f59e0b" strokeWidth={sw * 1.2} />}
                {pts.map((p, i) => { const d = D(p); return <circle key={i} cx={d.x} cy={d.y} r={sw * 2} fill="#f59e0b" />; })}
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded border border-slate-700 p-3 space-y-2">
              <div className="text-sm font-semibold">Scale (this sheet)</div>
              {cal ? (
                <>
                  <p className="text-xs text-emerald-300">Calibrated: {(cal.metresPerUnit * 1000).toFixed(4)} mm per {sheet.kind === 'pdf' ? 'PDF point' : 'pixel'}; reference agreement {cal.mismatchPct} %.{cal.statedScale ? ` Stated scale difference ${cal.statedScale.differencePct} %.` : ''}</p>
                  {limitMm !== null && <p className="text-xs text-slate-400">Resolution limit on site: about {limitMm.toFixed(1)} mm per point placed{sheet.info?.kind === 'raster' ? ' (scan pixel size)' : ' (zoom)'}.</p>}
                </>
              ) : (
                <>
                  <p className="text-xs text-slate-400">Reference {sheetRefs.length + 1} of 2: click both ends of a dimension written on the drawing, then enter its length.</p>
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
              <div className="text-sm font-semibold mb-1">Measurements (all sheets)</div>
              {ms.length === 0 ? <p className="text-xs text-slate-500">None yet.</p> : (
                <table className="w-full text-xs"><tbody>
                  {ms.map((m) => { const q = quantities.get(m.id)!; return (
                    <tr key={m.id} className="border-t border-slate-800" title={`sheet ${m.sheetId}, ${m.at}`}><td className="py-1">{m.id}</td><td>{m.label}</td><td className="text-slate-500">{m.sheetId.split('#')[1] ?? ''}</td><td className="text-right">{fmt(q.net, 3)} {q.unit}</td><td className="text-right text-slate-500">{q.deductions ? `−${fmt(q.deductions, 3)}` : ''}</td></tr>
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
      <p className="text-[11px] text-slate-500">{TAKEOFF_ENGINE_VERSION} · {PDF_SHEET_VERSION} · {BOQ_ENGINE_VERSION}. Reinforcement and formwork are not measured here. They come from the bar schedules and the formwork scheme. Rates come only from your dated rate library or supplier quotes.</p>
    </div>
  );
}
