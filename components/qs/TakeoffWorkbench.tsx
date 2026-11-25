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
 *
 * Saving (lib/qs/project.ts): "Save project" downloads a versioned .json file
 * (the drawing embedded up to 15 MB); "Open project" validates it strictly and
 * re-derives every quantity from the saved points; a draft is autosaved in this
 * browser, keyed by the drawing's SHA-256. No accounts, nothing server-side.
 */
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { quantify, calibrate, TakeoffError, TAKEOFF_ENGINE_VERSION, type Calibration, type Measurement, type MeasureKind, type Pt } from '@/lib/qs/takeoff';
import { BOQ_ENGINE_VERSION, PRELIMINARY_NOTICE, RATE_KIND_LABELS, type RateKind } from '@/lib/qs/boq';
import { TRADES_ENGINE_VERSION } from '@/lib/qs/trades';
import { extractGeometry, SnapIndex, snap, type SnapKind } from '@/lib/qs/snap';
import TradesPanel from './TradesPanel';
import BuildUpEditor from './BuildUpEditor';
import { BUILDUP_ENGINE_VERSION, emptyBuildUp, parseRatesFile, RatesFileError, TIER_SHORT, type RatesFile } from '@/lib/qs/rateBuildUp';
import { MEP_ENGINE_VERSION } from '@/lib/qs/mep';
import { importWithRetry, onBeforeRecoveryReload } from '@/lib/loading/resilientImport';
import { analysePage, sha256Hex, viewportToPdf, pdfToViewport, resolutionLimitM, PDF_SHEET_VERSION, type SheetInfo, type PdfPageLike, type ViewportLike } from '@/lib/qs/pdfSheet';
import {
  extractEmbeddedDrawing, buildProject, bytesToBase64, checkDrawingHash, draftBoq, guardedStorage, hasWork, parseProject, readAutosave, restoreProject, revisionProblem, writeAutosave, autosaveKey,
  ProjectError, EMBED_LIMIT_BYTES, MAX_PROJECT_CHARS, SAVE_NOTICE,
  type AdjustmentDraft, type Difference, type DrawingIdentity, type ItemDraft, type ProjectFile, type RefDim, type RestoredProject, type WorkbenchSnapshot,
} from '@/lib/qs/project';

type Mode = 'calibrate' | MeasureKind | 'hole';
const fmt = (x: number | null, d = 2) => (x === null ? '—' : x.toLocaleString('en-KE', { minimumFractionDigits: d, maximumFractionDigits: d }));
const RENDER_WIDTH_PX = 2400; // render width; zoom changes display only, never stored points
const ENGINES = [TAKEOFF_ENGINE_VERSION, PDF_SHEET_VERSION, BOQ_ENGINE_VERSION, TRADES_ENGINE_VERSION, MEP_ENGINE_VERSION, BUILDUP_ENGINE_VERSION];
const EMPTY_ADJ: AdjustmentDraft = { prelims: '', contingency: '', ohp: '', vat: '', vatFrom: '' };
const when = (iso: string) => new Date(iso).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' });
const isPdf = (f: File) => f.type === 'application/pdf' || /\.pdf$/i.test(f.name);

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PdfDoc = any;

/** File bytes; FileReader where Blob.arrayBuffer is missing (older browsers, test DOMs). */
function readBytes(f: Blob): Promise<Uint8Array<ArrayBuffer>> {
  if (typeof f.arrayBuffer === 'function') return f.arrayBuffer().then((b) => new Uint8Array(b));
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(new Uint8Array(r.result as ArrayBuffer));
    r.onerror = () => reject(r.error ?? new Error('the file could not be read'));
    r.readAsArrayBuffer(f);
  });
}

function download(bytes: BlobPart, type: string, name: string) {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
}

export default function TakeoffWorkbench() {
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [pdf, setPdf] = useState<{ doc: PdfDoc; name: string; sha: string; pages: number } | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [viewRot, setViewRot] = useState(0);
  const [busy, setBusy] = useState('');
  const [mode, setMode] = useState<Mode>('calibrate');
  const [pts, setPts] = useState<Pt[]>([]); // sheet units
  const [refs, setRefs] = useState<Record<string, RefDim[]>>({});
  const [refLen, setRefLen] = useState('');
  const [stated, setStated] = useState({ ratio: '', dpi: '' });
  const [cals, setCals] = useState<Record<string, Calibration>>({});
  const [calErr, setCalErr] = useState('');
  const [ms, setMs] = useState<Measurement[]>([]);
  const [label, setLabel] = useState('');
  const [depth, setDepth] = useState('');
  const [err, setErr] = useState('');
  const [items, setItems] = useState<ItemDraft[]>([]);
  const [adj, setAdj] = useState<AdjustmentDraft>(EMPTY_ADJ);
  const [revision, setRevision] = useState('A');
  const [revInput, setRevInput] = useState('A');
  const [revErr, setRevErr] = useState('');
  // Saving: the drawing's identity (and its bytes, for embedding), project messages, autosave state.
  const [drawing, setDrawing] = useState<DrawingIdentity | null>(null);
  const drawingFile = useRef<File | null>(null);
  const [projectMsg, setProjectMsg] = useState('');
  const [projectErr, setProjectErr] = useState('');
  const [differences, setDifferences] = useState<Difference[]>([]);
  const [pendingProject, setPendingProject] = useState<{ project: ProjectFile; restored: RestoredProject } | null>(null);
  const [draftOffer, setDraftOffer] = useState<ProjectFile | null>(null);
  const [autosaveErr, setAutosaveErr] = useState('');
  const [autosavedAt, setAutosavedAt] = useState('');
  // A rates file the user loaded (their own cited, dated price list); its entries are copied into build-up lines with citation and date.
  const [rates, setRates] = useState<RatesFile | null>(null);
  const [ratesMsg, setRatesMsg] = useState('');
  const [openBuildUp, setOpenBuildUp] = useState<number | null>(null);
  const store = useMemo(() => guardedStorage(), []);
  const svgRef = useRef<SVGSVGElement>(null);
  // View: zoom and pan change only the displayed window (viewBox), never stored points.
  const [vb, setVb] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [snapOn, setSnapOn] = useState(true);
  const [ptSnaps, setPtSnaps] = useState<SnapKind[]>([]);
  const [hover, setHover] = useState<{ p: Pt; kind: SnapKind } | null>(null);
  const snapIndex = useRef<SnapIndex | null>(null);
  const drag = useRef<{ x: number; y: number; vb: { x: number; y: number; w: number; h: number }; moved: boolean } | null>(null);
  const cal = sheet ? cals[sheet.id] ?? null : null;
  const sheetRefs = sheet ? refs[sheet.id] ?? [] : [];

  async function renderPdfPage(p: { doc: PdfDoc; name: string; sha: string; pages: number }, n: number, rot: number) {
    setBusy(`Rendering page ${n}…`);
    try {
      const pdfjs = await importWithRetry(() => import('pdfjs-dist'));
      const page = await p.doc.getPage(n);
      const base = page.getViewport({ scale: 1, rotation: (page.rotate + rot) % 360 });
      const scale = RENDER_WIDTH_PX / base.width;
      const vp: ViewportLike = page.getViewport({ scale, rotation: (page.rotate + rot) % 360 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(vp.width); canvas.height = Math.round(vp.height);
      await page.render({ canvas, viewport: vp }).promise;
      const info = await analysePage(pdfjs, page as unknown as PdfPageLike, { name: p.name, sha256: p.sha, pageCount: p.pages });
      const geo = extractGeometry(pdfjs.OPS, await page.getOperatorList(), page.userUnit ?? 1);
      snapIndex.current = geo.segments.length ? new SnapIndex(geo.segments) : null;
      setVb({ x: 0, y: 0, w: canvas.width, h: canvas.height });
      setSheet({
        id: `${p.sha.slice(0, 16)}#p${n}`, label: `${p.name}, page ${n} of ${p.pages}`, kind: 'pdf', url: canvas.toDataURL('image/png'), w: canvas.width, h: canvas.height,
        toSheet: (x, y) => viewportToPdf(vp, x, y), toDisplay: (q) => pdfToViewport(vp, q), pxPerUnit: scale, info, statedUnit: 'pt',
      });
      setPts([]);
    } catch (e) { setErr(`Could not render the page: ${(e as Error).message}`); }
    setBusy('');
  }

  const snapshot = (): WorkbenchSnapshot | null => (drawing ? { drawing, page: pageNo, stated, refs, cals, measurements: ms, items, adj, revision } : null);

  /** Writes the draft now; reports full/blocked storage instead of failing. */
  const autosaveNow = (s: WorkbenchSnapshot | null = snapshot()) => {
    if (!s || !hasWork(s)) return;
    const r = writeAutosave(store, s, new Date().toISOString(), ENGINES);
    if (r.ok) { setAutosaveErr(''); setAutosavedAt(new Date().toISOString()); } else setAutosaveErr(r.message);
  };
  // Autosave shortly after each change; paused while a restore offer is open, so the draft is not overwritten before the user decides.
  useEffect(() => {
    if (!drawing || draftOffer || pendingProject) return;
    const t = setTimeout(() => autosaveNow(), 600);
    return () => clearTimeout(t);
  }, [drawing, draftOffer, pendingProject, refs, cals, ms, items, adj, revision, stated, pageNo]);
  // A recovery "Reload page" (lib/loading) writes the draft at once instead of losing the last 600 ms.
  const flushRef = useRef<() => void>(() => {});
  flushRef.current = () => { if (drawing && !draftOffer && !pendingProject) autosaveNow(); };
  useEffect(() => onBeforeRecoveryReload(() => flushRef.current()), []);

  const applyRestored = (r: RestoredProject, sheetId: string | null) => {
    setRefs(r.refs); setCals(r.cals); setMs(r.measurements); setItems(r.items); setAdj(r.adj);
    setRevision(r.revision); setRevInput(r.revision); setRevErr(''); setStated(r.stated);
    setDifferences(r.differences); setOpenBuildUp(null);
    setMode(sheetId && r.cals[sheetId] ? 'linear' : 'calibrate'); setPts([]); setPtSnaps([]);
  };

  /** Opens a drawing. With `restore`, the workbench is replaced by the restored project; otherwise a matching autosaved draft is offered. */
  const load = async (f: File, restore?: RestoredProject) => {
    setErr(''); setCalErr(''); setPts([]); setPtSnaps([]); setProjectErr(''); setDraftOffer(null);
    if (!restore) { setProjectMsg(''); setDifferences([]); }
    setBusy('Reading the drawing…');
    let bytes: Uint8Array, sha: string;
    try { bytes = await readBytes(f); sha = await sha256Hex(bytes); }
    catch (e) { setErr(`Could not read the drawing: ${(e as Error).message}`); setBusy(''); return; }
    const id: DrawingIdentity = { name: f.name, size: f.size, sha256: sha, type: f.type || (isPdf(f) ? 'application/pdf' : '') };
    // A project is one drawing: work on the previous drawing stays in its own autosave.
    if (drawing && hasWork({ refs, measurements: ms, items })) {
      autosaveNow();
      if (drawing.sha256 !== sha && !restore) setProjectMsg(`Work on ${drawing.name} is kept in this browser's autosave: load that drawing again to restore it.`);
    }
    setRefs({}); setCals({}); setMs([]); setItems([]); setAdj(EMPTY_ADJ); setRevision('A'); setRevInput('A'); setRevErr(''); setMode('calibrate');
    drawingFile.current = f; setDrawing(id);
    let sheetId: string | null = null;
    if (isPdf(f)) {
      setBusy('Opening PDF…');
      try {
        const pdfjs = await importWithRetry(() => import('pdfjs-dist'));
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
        const doc = await pdfjs.getDocument({ data: bytes }).promise;
        const p = { doc, name: f.name, sha, pages: doc.numPages };
        const n = restore && restore.page <= doc.numPages ? restore.page : 1;
        setPdf(p); setPageNo(n); setViewRot(0);
        await renderPdfPage(p, n, 0);
        sheetId = `${sha.slice(0, 16)}#p${n}`;
      } catch (e) { setErr(`Could not open the PDF: ${(e as Error).message}`); setBusy(''); return; }
    } else {
      const url = URL.createObjectURL(f);
      const ok = await new Promise<boolean>((resolve) => {
        const im = new Image();
        im.onload = () => {
          setPdf(null); setPageNo(1);
          snapIndex.current = null; // images carry no vector geometry
          setVb({ x: 0, y: 0, w: im.naturalWidth, h: im.naturalHeight });
          setSheet({ id: `img:${f.name}:${f.size}`, label: f.name, kind: 'image', url, w: im.naturalWidth, h: im.naturalHeight, toSheet: (x, y) => ({ x, y }), toDisplay: (q) => q, pxPerUnit: 1, statedUnit: 'px' });
          resolve(true);
        };
        im.onerror = () => resolve(false);
        im.src = url;
      });
      setBusy('');
      if (!ok) { setErr('Could not open the image: the file is not a readable PNG or JPG'); return; }
      sheetId = `img:${f.name}:${f.size}`;
    }
    if (restore) { applyRestored(restore, sheetId); return; }
    const d = readAutosave(store, id);
    if (!d.ok) { setAutosaveErr(d.message); return; }
    if (!d.value) return;
    if ('error' in d.value) { setProjectErr(`The autosaved work for this drawing could not be used and was left unchanged: ${d.value.error}`); return; }
    const dp = d.value.project;
    if (dp.measurements.length || dp.items.length || dp.sheets.some((s) => s.references.length)) setDraftOffer(dp);
  };

  const restoreDraft = async () => {
    if (!draftOffer) return;
    try {
      const r = restoreProject(draftOffer);
      if (pdf && r.page !== pageNo && r.page <= pdf.pages) { setPageNo(r.page); await renderPdfPage(pdf, r.page, viewRot); }
      const sid = pdf ? `${pdf.sha.slice(0, 16)}#p${r.page <= pdf.pages ? r.page : pageNo}` : sheet?.id ?? null;
      applyRestored(r, sid);
      setProjectMsg(`Unsaved work from ${when(draftOffer.savedAt)} restored. Quantities were recomputed from the saved points.`);
      setDraftOffer(null);
    } catch (e) { setProjectErr(e instanceof ProjectError ? e.message : `Could not restore the draft: ${(e as Error).message}`); }
  };
  const discardDraft = () => {
    if (!drawing) return;
    const r = store.remove(autosaveKey(drawing.sha256));
    if (!r.ok) setAutosaveErr(r.message);
    setDraftOffer(null); setProjectMsg('The autosaved draft for this drawing was discarded.');
  };

  const saveProject = async () => {
    const s = snapshot();
    if (!s || !drawingFile.current) return;
    setProjectErr('');
    try {
      const embed = s.drawing.size <= EMBED_LIMIT_BYTES;
      const embeddedBase64 = embed ? bytesToBase64(await readBytes(drawingFile.current)) : undefined;
      const p = buildProject(s, { savedAt: new Date().toISOString(), embeddedBase64, engines: ENGINES });
      const base = s.drawing.name.replace(/\.[^.]+$/, '').replace(/[^A-Za-z0-9._-]+/g, '-').slice(0, 60) || 'takeoff';
      download(JSON.stringify(p), 'application/json', `${base}-rev-${s.revision}-takeoff-project.json`);
      setProjectMsg(embed
        ? 'Project saved, with the drawing inside the file.'
        : `Project saved without the drawing (${(s.drawing.size / 1048576).toFixed(1)} MB is over the 15 MB limit). Keep the drawing file: opening the project asks for it and checks its SHA-256.`);
      autosaveNow(s);
    } catch (e) { setProjectErr(`Could not save the project: ${(e as Error).message}`); }
  };

  const openProject = async (f: File) => {
    setProjectErr(''); setProjectMsg(''); setPendingProject(null);
    // Refuse before reading (re-audit LOW 3, 2026-11-21); parseProject applies the same limit to the text.
    if (f.size > MAX_PROJECT_CHARS) { setProjectErr(`This file is larger than a project file can be (${Math.round(MAX_PROJECT_CHARS / 1024 / 1024)} MB); nothing was opened.`); return; }
    try {
      const p = parseProject(new TextDecoder().decode(await readBytes(f)));
      const r = restoreProject(p); // everything is recomputed before the workbench is touched
      const bytes = await extractEmbeddedDrawing(p);
      if (bytes) {
        await load(new File([new Uint8Array(bytes)], p.drawing.name, { type: p.drawing.type }), r);
        setProjectMsg(`Project from ${when(p.savedAt)} opened. Every quantity was recomputed from the saved points and calibration.`);
      } else {
        setPendingProject({ project: p, restored: r });
      }
    } catch (e) { setProjectErr(e instanceof ProjectError ? e.message : `Could not open the project: ${(e as Error).message}`); }
  };
  const provideDrawing = async (f: File) => {
    if (!pendingProject) return;
    setProjectErr('');
    const { project: p, restored } = pendingProject;
    try {
      const bytes = await readBytes(f);
      checkDrawingHash(p.drawing, await sha256Hex(bytes));
      setPendingProject(null);
      await load(new File([bytes], p.drawing.name, { type: p.drawing.type || f.type }), restored);
      setProjectMsg(`Project from ${when(p.savedAt)} opened with ${f.name} (SHA-256 verified). Every quantity was recomputed from the saved points and calibration.`);
    } catch (e) { setProjectErr(e instanceof ProjectError ? e.message : `Could not read the drawing: ${(e as Error).message}`); }
  };

  const SNAP_PX = 10; // snap radius in screen pixels
  /** Screen position → sheet point, snapped to drawing geometry when enabled. */
  const locate = (clientX: number, clientY: number): { p: Pt; kind: SnapKind } | null => {
    if (!svgRef.current || !sheet || !vb) return null;
    const r = svgRef.current.getBoundingClientRect();
    const raw = sheet.toSheet(vb.x + ((clientX - r.left) / r.width) * vb.w, vb.y + ((clientY - r.top) / r.height) * vb.h);
    if (!snapOn || !snapIndex.current) return { p: raw, kind: 'none' };
    const tol = (SNAP_PX * vb.w) / r.width / sheet.pxPerUnit; // screen px → display units → PDF points
    const s = snap(raw, snapIndex.current, tol);
    return { p: s.point, kind: s.kind };
  };
  const click = (e: React.MouseEvent<SVGSVGElement>) => {
    if (drag.current?.moved) { drag.current = null; return; } // end of a pan, not a click
    drag.current = null;
    const hit = locate(e.clientX, e.clientY);
    if (!hit) return;
    if (mode === 'calibrate') { setPts((x) => (x.length >= 2 ? [hit.p] : [...x, hit.p])); return; }
    if (!cal) { setErr('Calibrate this sheet first'); return; }
    // A new point means the user is measuring again: a message about an earlier, refused measurement is stale (2026-11-25).
    setErr('');
    setPts((x) => [...x, hit.p]);
    setPtSnaps((x) => [...x, hit.kind]);
  };
  const zoom = (factor: number, cx?: number, cy?: number) => {
    if (!vb || !sheet) return;
    const w = Math.min(sheet.w, Math.max(sheet.w / 64, vb.w * factor));
    const h = (w * sheet.h) / sheet.w;
    const fx = cx ?? vb.x + vb.w / 2, fy = cy ?? vb.y + vb.h / 2; // keep this point fixed
    const x = Math.min(Math.max(0, fx - ((fx - vb.x) * w) / vb.w), sheet.w - w);
    const y = Math.min(Math.max(0, fy - ((fy - vb.y) * h) / vb.h), sheet.h - h);
    setVb({ x, y, w, h });
  };
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!vb) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoom(e.deltaY < 0 ? 1 / 1.25 : 1.25, vb.x + ((e.clientX - r.left) / r.width) * vb.w, vb.y + ((e.clientY - r.top) / r.height) * vb.h);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  });
  const onDown = (e: React.MouseEvent<SVGSVGElement>) => { if (vb) drag.current = { x: e.clientX, y: e.clientY, vb, moved: false }; };
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (d && e.buttons && svgRef.current && sheet) {
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
      if (d.moved) {
        const r = svgRef.current.getBoundingClientRect();
        const x = Math.min(Math.max(0, d.vb.x - (dx * d.vb.w) / r.width), sheet.w - d.vb.w);
        const y = Math.min(Math.max(0, d.vb.y - (dy * d.vb.h) / r.height), sheet.h - d.vb.h);
        setVb({ ...d.vb, x, y });
        return;
      }
    }
    const hit = locate(e.clientX, e.clientY);
    setHover(hit && hit.kind !== 'none' ? hit : null);
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
      try { quantify(m); setMs(ms.map((x, i) => (i === idx ? m : x))); setPts([]); setPtSnaps([]); } catch (e) { setErr((e as Error).message); }
      return;
    }
    if (mode === 'calibrate') return;
    const used = new Set(ms.map((x) => x.id));
    let n = ms.length + 1;
    while (used.has(`M${n}`)) n++;
    const m: Measurement = { id: `M${n}`, kind: mode, sheetId: sheet.id, label: label || `${mode} ${n}`, points: pts, depthM: mode === 'volume' ? Number(depth) : undefined, metresPerUnit: cal.metresPerUnit, user: 'this browser', at: new Date().toISOString(), revision, snaps: ptSnaps.slice(0, pts.length) };
    try { quantify(m); setMs([...ms, m]); setPts([]); setPtSnaps([]); setLabel(''); } catch (e) { setErr(e instanceof TakeoffError ? e.message : String(e)); }
  };

  const quantities = useMemo(() => new Map(ms.map((m) => [m.id, quantify(m)])), [ms]);
  // Click precision is one pixel of the drawing as DISPLAYED (the rendered image is scaled to the panel width).
  const shownScale = sheet && vb && svgRef.current?.clientWidth ? svgRef.current.clientWidth / vb.w : 1;
  const limitMm = sheet && cal ? (sheet.info ? resolutionLimitM(sheet.info, cal.metresPerUnit, sheet.pxPerUnit * shownScale) : cal.metresPerUnit / shownScale) * 1000 : null;

  const boq = useMemo(() => draftBoq(items, quantities, adj, revision), [items, quantities, adj, revision]);

  const exportPdf = async () => {
    if (!boq) return;
    try {
      // Inside the try: a failed download now shows a message instead of nothing (2026-11-21).
      const { boqToPdf } = await importWithRetry(() => import('@/lib/qs/pdfReport'));
      const drawings = [...new Set(ms.map((m) => m.sheetId))].map((id) => `${pdf?.name ?? sheet?.label ?? 'drawing'} ${id}`);
      const bytes = boqToPdf(boq.boq, { project: pdf?.name ?? sheet?.label ?? 'Project', preparedBy: 'Building Suite Pro (draft for QS review)', date: new Date().toISOString().slice(0, 10), drawings });
      download(new Uint8Array(bytes), 'application/pdf', `boq-rev-${revision}-draft.pdf`);
    } catch (e) { setErr((e as Error).message); }
  };

  const exportXlsx = async () => {
    if (!boq) return;
    try {
      const { boqToXlsx } = await importWithRetry(() => import('@/lib/qs/export'));
      const buf = await boqToXlsx(boq.boq, boq.adj, pdf?.name ?? sheet?.label ?? 'Project');
      download(new Uint8Array(buf), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', `boq-rev-${revision}-draft.xlsx`);
    } catch (e) { setErr((e as Error).message); }
  };

  const input = 'rounded bg-slate-900 border border-slate-700 px-2 py-1 text-sm text-white';
  const fileInput = 'block max-w-full text-xs file:mr-2 file:rounded file:border-0 file:bg-slate-700 file:px-2 file:py-1 file:text-white';
  const modes: Array<[Mode, string]> = [['calibrate', 'Calibrate'], ['linear', 'Length'], ['area', 'Area'], ['hole', 'Opening (deduct)'], ['volume', 'Volume'], ['count', 'Count']];
  const sw = sheet && vb ? vb.w / 500 : 1; // strokes keep a constant on-screen width while zooming
  const zoomPct = sheet && vb ? Math.round((sheet.w / vb.w) * 100) : 100;
  const D = (p: Pt) => sheet!.toDisplay(p);
  const poly = (ps: Pt[]) => ps.map((p) => { const d = D(p); return `${d.x},${d.y}`; }).join(' ');

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 text-slate-200">
      <h1 className="text-2xl font-bold">Measured take-off and BOQ</h1>
      <p className="text-sm text-slate-400">Every quantity is measured on your drawing. Nothing is generated from a description. Calibrate each sheet with two known dimensions, one in each direction. They must agree within 1 %.</p>
      {/* What is kept, and where: an autosaved draft in this browser, and a project file the user downloads. No accounts, no server storage. */}
      <p role="note" className="rounded border border-amber-500/60 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{SAVE_NOTICE}</p>

      <section aria-labelledby="qs-project-heading" className="rounded border border-slate-700 p-3 space-y-2">
        <h2 id="qs-project-heading" className="text-sm font-semibold">Project</h2>
        <div className="flex flex-wrap items-end gap-3">
          <button type="button" onClick={saveProject} disabled={!drawing || !sheet} className="rounded bg-emerald-700 px-3 py-1 text-xs text-white disabled:opacity-40">Save project (.json)</button>
          <label className="min-w-0 max-w-full text-xs">Open project (.json)
            <input type="file" accept="application/json,.json" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) openProject(f); }} className={fileInput} />
          </label>
          <label className="text-xs">Revision
            <input value={revInput} onChange={(e) => { const v = e.target.value; setRevInput(v); const p = revisionProblem(v); setRevErr(p ?? ''); if (!p) setRevision(v); }} aria-describedby="qs-rev-err" className={`${input} ml-1 w-20`} />
          </label>
        </div>
        <p id="qs-rev-err" className="text-xs text-red-300" role="alert">{revErr ? `${revErr}. Revision ${revision} is still used.` : ''}</p>
        {pendingProject && (
          <div className="break-words rounded border border-amber-500/60 p-2 text-xs space-y-1">
            <p>This project does not contain its drawing. Select <strong>{pendingProject.project.drawing.name}</strong> ({pendingProject.project.drawing.size.toLocaleString('en-KE')} bytes, SHA-256 {pendingProject.project.drawing.sha256.slice(0, 12)}…). A different file is refused.</p>
            <div className="flex flex-wrap items-end gap-2">
              <label className="min-w-0 max-w-full">Drawing for the opened project
                <input type="file" accept="application/pdf,image/png,image/jpeg" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) provideDrawing(f); }} className={fileInput} />
              </label>
              <button type="button" onClick={() => setPendingProject(null)} className="rounded border border-slate-600 px-2 py-1">Cancel opening</button>
            </div>
          </div>
        )}
        {draftOffer && (
          <div role="group" aria-labelledby="qs-draft-q" className="flex flex-wrap items-center gap-2 rounded border border-sky-500/60 p-2 text-xs">
            <span id="qs-draft-q">Restore unsaved work from {when(draftOffer.savedAt)}?</span>
            <button type="button" onClick={restoreDraft} className="rounded bg-sky-700 px-2 py-1 text-white">Restore</button>
            <button type="button" onClick={discardDraft} className="rounded border border-slate-600 px-2 py-1">Discard draft</button>
          </div>
        )}
        <p className="break-words text-xs text-red-300" role="alert">{projectErr}</p>
        <p className="text-xs text-red-300" role="alert">{autosaveErr}</p>
        <p className="text-xs text-emerald-300" role="status">{projectMsg}{projectMsg && autosavedAt ? ' ' : ''}{autosavedAt && !autosaveErr ? `Autosaved in this browser at ${when(autosavedAt)}.` : ''}</p>
        {differences.length > 0 && (
          <div role="alert" className="break-words rounded border border-red-500/60 p-2 text-xs text-red-200">
            <p>The numbers stored in the file differ from the ones recomputed from its points and calibration. The recomputed values are used:</p>
            <ul className="list-disc pl-5">
              {differences.map((d) => <li key={d.what}>{d.what}: stored {fmt(d.stored, 3)}, recomputed {fmt(d.recomputed, 3)}</li>)}
            </ul>
          </div>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <label className="min-w-0 max-w-full text-sm">Drawing (PDF, PNG or JPG): <input type="file" accept="application/pdf,image/png,image/jpeg" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) load(f); }} className="max-w-full text-sm" /></label>
        <label className="text-xs">Stated scale 1:<input value={stated.ratio} onChange={(e) => setStated({ ...stated, ratio: e.target.value })} className={`${input} w-16 ml-1`} /></label>
        {sheet?.kind === 'image' && <label className="text-xs">Image DPI <input value={stated.dpi} onChange={(e) => setStated({ ...stated, dpi: e.target.value })} className={`${input} w-16 ml-1`} /></label>}
        {pdf && (
          <>
            <label className="text-xs">Page <select value={pageNo} onChange={(e) => { const n = Number(e.target.value); setPageNo(n); renderPdfPage(pdf, n, viewRot); }} className={input}>{Array.from({ length: pdf.pages }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select> of {pdf.pages}</label>
            <button type="button" onClick={() => { const r = (viewRot + 90) % 360; setViewRot(r); renderPdfPage(pdf, pageNo, r); }} className="rounded border border-slate-600 px-2 py-1 text-xs">Rotate view 90°</button>
          </>
        )}
        {busy && <span className="text-xs text-amber-300" role="status">{busy}</span>}
      </div>
      {sheet?.info && (
        <div className="break-words rounded border border-slate-700 p-2 text-xs text-slate-300">
          <strong>{sheet.label}</strong> · sheet {sheet.info.widthMm} × {sheet.info.heightMm} mm · {sheet.info.kind === 'vector' ? 'vector drawing' : sheet.info.kind === 'raster' ? `scanned at ${sheet.info.rasterDpi} dpi` : sheet.info.kind}
          {' '}· file SHA-256 {sheet.info.sha256.slice(0, 12)}…{sheet.info.notes.map((n) => <div key={n} className="text-amber-300">{n}</div>)}
        </div>
      )}
      {sheet && (
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Measurement tools">
              {modes.map(([m, l]) => (
                <button key={m} type="button" onClick={() => { setMode(m); setPts([]); setPtSnaps([]); setErr(''); }} disabled={m !== 'calibrate' && !cal}
                  className={`rounded px-3 py-1 text-xs border ${mode === m ? 'border-amber-400 bg-amber-500/20' : 'border-slate-600'} disabled:opacity-40`}>{l}</button>
              ))}
              {mode !== 'calibrate' && <button type="button" onClick={finish} className="rounded bg-amber-600 px-3 py-1 text-xs text-white">Finish ({pts.length} pts)</button>}
              {pts.length > 0 && <button type="button" onClick={() => { setPts(pts.slice(0, -1)); setPtSnaps(ptSnaps.slice(0, -1)); }} className="rounded border border-slate-600 px-3 py-1 text-xs">Undo point</button>}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs" role="toolbar" aria-label="View">
              <button type="button" onClick={() => zoom(1 / 1.5)} className="rounded border border-slate-600 px-2 py-1">Zoom in</button>
              <button type="button" onClick={() => zoom(1.5)} className="rounded border border-slate-600 px-2 py-1">Zoom out</button>
              <button type="button" onClick={() => setVb({ x: 0, y: 0, w: sheet.w, h: sheet.h })} className="rounded border border-slate-600 px-2 py-1">Fit</button>
              <span className="text-slate-400" aria-live="polite">Zoom {zoomPct} %</span>
              {snapIndex.current && (
                <label className="ml-2"><input type="checkbox" checked={snapOn} onChange={(e) => setSnapOn(e.target.checked)} /> Snap to drawing lines</label>
              )}
              <span className="text-slate-500">Wheel to zoom, drag to pan.</span>
            </div>
            <div className="overflow-hidden rounded border border-slate-700 bg-white">
              <svg ref={svgRef} viewBox={vb ? `${vb.x} ${vb.y} ${vb.w} ${vb.h}` : `0 0 ${sheet.w} ${sheet.h}`} className="w-full cursor-crosshair select-none" onClick={click} onMouseDown={onDown} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
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
                {hover && (() => { const d = D(hover.p); const s = sw * 4; return (
                  <g data-snap={hover.kind} pointerEvents="none">
                    {hover.kind === 'endpoint' ? <rect x={d.x - s} y={d.y - s} width={2 * s} height={2 * s} fill="none" stroke="#16a34a" strokeWidth={sw} />
                      : hover.kind === 'intersection' ? <path d={`M${d.x - s} ${d.y - s}L${d.x + s} ${d.y + s}M${d.x - s} ${d.y + s}L${d.x + s} ${d.y - s}`} stroke="#16a34a" strokeWidth={sw} />
                        : <circle cx={d.x} cy={d.y} r={s} fill="none" stroke="#16a34a" strokeWidth={sw} />}
                  </g>
                ); })()}
              </svg>
            </div>
          </div>
          <div className="min-w-0 space-y-3">
            <div className="rounded border border-slate-700 p-3 space-y-2">
              <div className="text-sm font-semibold">Scale (this sheet)</div>
              {cal ? (
                <>
                  <p className="text-xs text-emerald-300">Calibrated: {(cal.metresPerUnit * 1000).toFixed(4)} mm per {sheet.kind === 'pdf' ? 'PDF point' : 'pixel'}; reference agreement {cal.mismatchPct} %.{cal.statedScale ? ` Stated scale difference ${cal.statedScale.differencePct} %.` : ''}</p>
                  {limitMm !== null && <p className="text-xs text-slate-400">Resolution limit on site: about {limitMm.toFixed(1)} mm per free click at this zoom{sheet.info?.kind === 'raster' ? ' (or the scan pixel size, if larger)' : ''}.{snapIndex.current && snapOn ? ' Points snapped to drawing lines are exact to the drawing.' : ''}</p>}
                </>
              ) : (
                <>
                  <p className="text-xs text-slate-400">Reference {sheetRefs.length + 1} of 2: click both ends of a dimension written on the drawing, then enter its length.</p>
                  <div className="flex gap-2"><input value={refLen} onChange={(e) => setRefLen(e.target.value)} placeholder="length (m)" aria-label="Known length in metres" className={`${input} w-28`} /><button type="button" onClick={addRef} className="rounded bg-slate-700 px-3 text-xs">Add reference</button></div>
                </>
              )}
              {cal?.statedScale?.warning && <p className="text-xs text-amber-300">{cal.statedScale.warning}</p>}
              <p className="text-xs text-red-300" role="alert">{calErr}</p>
            </div>
            {cal && mode !== 'calibrate' && mode !== 'hole' && (
              <div className="rounded border border-slate-700 p-3 space-y-2">
                <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (e.g. Ground floor slab)" aria-label="Measurement label" className={`${input} w-full`} />
                {mode === 'volume' && <input value={depth} onChange={(e) => setDepth(e.target.value)} placeholder="Depth / thickness (m)" aria-label="Depth in metres" className={`${input} w-full`} />}
              </div>
            )}
            <p className="text-xs text-red-300" role="alert">{err}</p>
            <div className="rounded border border-slate-700 p-3">
              <div className="text-sm font-semibold mb-1">Measurements (all sheets)</div>
              {ms.length === 0 ? <p className="text-xs text-slate-500">None yet.</p> : (
                <div className="relative overflow-x-auto" role="region" aria-label="Measurements table, scrolls sideways" tabIndex={0}><table className="w-full text-xs">
                  <thead><tr className="text-left text-slate-400"><th scope="col">Id</th><th scope="col">Label</th><th scope="col">Page</th><th scope="col" className="text-right">Net</th><th scope="col" className="text-right">Deducted</th></tr></thead>
                  <tbody>
                  {ms.map((m) => { const q = quantities.get(m.id)!; return (
                    <tr key={m.id} className="border-t border-slate-800" title={`sheet ${m.sheetId}, ${m.at}`}><td className="py-1">{m.id}</td><td>{m.label}</td><td className="text-slate-500">{m.sheetId.split('#')[1] ?? ''}</td><td className="text-right">{fmt(q.net, 3)} {q.unit}</td><td className="text-right text-slate-500">{q.deductions ? `−${fmt(q.deductions, 3)}` : ''}</td></tr>
                  ); })}
                </tbody></table></div>
              )}
            </div>
          </div>
        </div>
      )}

      {sheet && (
        <TradesPanel quantities={quantities} measurements={ms} existingCodes={items.map((d) => d.code)}
          onAdd={(added, form) => setItems((cur) => [...cur, ...added.map((b): ItemDraft => ({
            code: b.code, section: b.section, description: b.description, measurementId: '', factor: '', rate: '', rateKind: '', source: '', date: '', location: '',
            trade: { name: b.trade, unit: b.unit, scheduled: b.scheduledQuantity!, lineCode: b.code, form },
          }))])} />
      )}

      {(ms.length > 0 || items.length > 0) && (
        <div className="rounded border border-slate-700 p-3 space-y-3">
          <div className="flex items-center justify-between"><div className="text-sm font-semibold">Bill of quantities</div>
            <button type="button" disabled={!ms.length} onClick={() => setItems([...items, { code: `${items.length + 1}`, section: '', description: '', measurementId: ms[0].id, factor: '1', rate: '', rateKind: '', source: '', date: '', location: '' }])} className="rounded bg-slate-700 px-3 py-1 text-xs disabled:opacity-40">Add item</button></div>
          <div className="flex flex-wrap items-end gap-3 text-xs">
            <label className="min-w-0 max-w-full">Rates file for build-ups (.json, your own cited and dated price list)
              <input type="file" accept="application/json,.json" onChange={async (e) => {
                const f = e.target.files?.[0]; e.target.value = '';
                if (!f) return;
                try { const r = parseRatesFile(new TextDecoder().decode(await readBytes(f))); setRates(r); setRatesMsg(`Loaded ${r.records.length} records from ${f.name}: ${r.dataset}. Each record keeps its own status, source and date.`); }
                catch (err) { setRates(null); setRatesMsg(err instanceof RatesFileError ? `Rates file refused: ${err.message}` : `Rates file could not be read: ${(err as Error).message}`); }
              }} className={fileInput} />
            </label>
            <button type="button" onClick={async () => {
              try {
                const mod = await import('@/data/building/rates/ppra-mprg-2026-06.json');
                const r = parseRatesFile(JSON.stringify(mod.default ?? mod)); setRates(r);
                setRatesMsg(`Loaded ${r.records.length} records (INDICATIVE market rates, preliminary budgets only — not EmersonEIMS selling prices): ${r.dataset}.`);
              } catch (err) { setRatesMsg(`Indicative dataset could not be loaded: ${(err as Error).message}`); }
            }} className="rounded bg-amber-800 px-2 py-1 text-white">Use indicative rates (PPRA June 2026)</button>
            <span role="status" className="text-slate-300">{ratesMsg || 'No rates loaded. Without a sourced price an item stays “rate required” (quotation required).'}</span>
          </div>
          {/* relative: keeps the position:absolute sr-only cells of nested tables (build-up editor) inside this scroll box, so the page never scrolls sideways (2026-11-25). */}
          <div className="relative overflow-x-auto" role="region" aria-label="Bill of quantities table, scrolls sideways" tabIndex={0}><table className="w-full min-w-[62rem] text-xs">
            <caption className="sr-only">Bill of quantities items</caption>
            <thead><tr className="text-left text-slate-400">{['Code', 'Section', 'Description', 'Measurement', '× factor', 'Rate (KES)', 'Rate from', 'Rate source', 'Rate date', 'Location', 'Build-up'].map((h) => <th key={h} scope="col">{h}</th>)}<th scope="col" className="text-right">Qty</th><th scope="col" className="text-right">Amount</th></tr></thead>
            <tbody>
              {items.map((d, i) => {
                const line = boq?.boq.lines[i];
                const up = (k: keyof ItemDraft, v: string) => setItems(items.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
                const setItem = (next: ItemDraft) => setItems(items.map((x, j) => (j === i ? next : x)));
                const name = (field: string) => `Item ${i + 1} ${field}`;
                // A build-up replaces the single rate: switching it on clears the single-rate fields (never both).
                const toggleBuildUp = () => {
                  if (d.buildUp) { if (openBuildUp === i) setOpenBuildUp(null); else setOpenBuildUp(i); return; }
                  setItem({ ...d, rate: '', rateKind: '', rateTier: '', source: '', date: '', location: '', buildUp: emptyBuildUp() }); setOpenBuildUp(i);
                };
                const removeBuildUp = () => { const { buildUp: _drop, ...rest } = d; void _drop; setItem(rest); setOpenBuildUp(null); };
                if (d.buildUp) return (
                  <Fragment key={i}>
                    <tr className="border-t border-slate-800">
                      {(['code', 'section', 'description'] as const).map((k) => <td key={k}><input aria-label={name(k)} value={d[k]} onChange={(e) => up(k, e.target.value)} className={`${input} w-full`} /></td>)}
                      {d.trade ? (
                        <td colSpan={2} className="max-w-xs truncate text-slate-400" title={d.trade.scheduled.source}>{d.trade.name}: {d.trade.scheduled.source}</td>
                      ) : (
                        <>
                          <td><select aria-label={name('measurement')} value={d.measurementId} onChange={(e) => up('measurementId', e.target.value)} className={input}>{ms.map((m) => <option key={m.id} value={m.id}>{m.id} {m.label}</option>)}</select></td>
                          <td><input aria-label={name('factor')} value={d.factor} onChange={(e) => up('factor', e.target.value)} className={`${input} w-full`} /></td>
                        </>
                      )}
                      <td className="text-right">{line?.rate != null ? fmt(line.rate) : <span className="text-amber-300">rate required</span>}</td>
                      <td colSpan={4} className={line?.tier === 'indicative' ? 'text-amber-300' : line?.tier === 'verified' ? 'text-emerald-300' : 'text-slate-400'}>Rate build-up{line?.buildUp?.priceDate ? `, prices from ${line.buildUp.priceDate}` : ''} · {line ? TIER_SHORT[line.tier] : ''}</td>
                      <td className="whitespace-nowrap">
                        <button type="button" aria-label={name('edit build-up')} aria-expanded={openBuildUp === i} onClick={toggleBuildUp} className="rounded bg-sky-800 px-2 py-0.5">{openBuildUp === i ? 'Hide' : 'Edit'}</button>
                        <button type="button" aria-label={name('remove build-up')} onClick={removeBuildUp} className="ml-1 px-1 text-red-300">×</button>
                      </td>
                      <td className="text-right">{line ? `${fmt(line.quantity, 3)} ${line.unit}` : ''}</td>
                      <td className="text-right">{line ? (line.amount === null ? <span className="text-amber-300">rate required</span> : fmt(line.amount)) : ''}</td>
                    </tr>
                    {openBuildUp === i && (
                      <tr><td colSpan={13}>
                        <BuildUpEditor item={`Item ${i + 1} (${d.code})`} unit={line?.unit ?? d.trade?.unit ?? ''} draft={d.buildUp} result={line?.buildUp} rates={rates} onChange={(b) => setItem({ ...d, buildUp: b })} />
                      </td></tr>
                    )}
                  </Fragment>
                );
                return (
                  <tr key={i} className="border-t border-slate-800">
                    {(['code', 'section', 'description'] as const).map((k) => <td key={k}><input aria-label={name(k)} value={d[k]} onChange={(e) => up(k, e.target.value)} className={`${input} w-full`} /></td>)}
                    {d.trade ? (
                      <td colSpan={2} className="max-w-xs truncate text-slate-400" title={d.trade.scheduled.source}>{d.trade.name}: {d.trade.scheduled.source}</td>
                    ) : (
                      <>
                        <td><select aria-label={name('measurement')} value={d.measurementId} onChange={(e) => up('measurementId', e.target.value)} className={input}>{ms.map((m) => <option key={m.id} value={m.id}>{m.id} {m.label}</option>)}</select></td>
                        <td><input aria-label={name('factor')} value={d.factor} onChange={(e) => up('factor', e.target.value)} className={`${input} w-full`} /></td>
                      </>
                    )}
                    <td><input aria-label={name('rate (KES)')} value={d.rate} onChange={(e) => up('rate', e.target.value)} className={`${input} w-full`} /></td>
                    <td><select aria-label={name('rate from')} value={d.rateKind} onChange={(e) => up('rateKind', e.target.value)} className={input}>
                      <option value="">choose…</option>
                      {(Object.keys(RATE_KIND_LABELS) as RateKind[]).map((k) => <option key={k} value={k}>{RATE_KIND_LABELS[k]}</option>)}
                    </select>
                    <select aria-label={name('price status')} value={d.rateTier ?? ''} onChange={(e) => up('rateTier', e.target.value)} className={`${input} mt-1 block`}>
                      <option value="">status… (unstated = indicative)</option>
                      <option value="verified">Verified (company rate / supplier quotation)</option>
                      <option value="indicative">Indicative (public source, budget only)</option>
                    </select></td>
                    {([['source', 'rate source'], ['date', 'rate date'], ['location', 'rate location']] as const).map(([k, l]) => <td key={k}><input aria-label={name(l)} value={d[k]} placeholder={k === 'date' ? 'YYYY-MM-DD' : ''} onChange={(e) => up(k, e.target.value)} className={`${input} w-full`} /></td>)}
                    <td><button type="button" aria-label={name('build up the rate')} onClick={toggleBuildUp} className="rounded bg-slate-700 px-2 py-0.5">Build up</button></td>
                    <td className="text-right">{line ? `${fmt(line.quantity, 3)} ${line.unit}` : ''}</td>
                    <td className="text-right">{line ? (line.amount === null ? <span className="text-amber-300">rate required</span> : fmt(line.amount)) : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table></div>
          <div className="flex flex-wrap gap-3 text-xs">
            {/* "Bill-level" O&P: distinct from each rate build-up's own O&P field (one accessible name per control, 2026-11-25). */}
            {([['prelims', 'Preliminaries %'], ['contingency', 'Contingency %'], ['ohp', 'Bill-level overheads & profit %'], ['vat', 'VAT %'], ['vatFrom', 'VAT rate effective from']] as const).map(([k, l]) => (
              <label key={k}>{l} <input aria-label={l} value={adj[k]} onChange={(e) => setAdj({ ...adj, [k]: e.target.value })} placeholder={k === 'vatFrom' ? 'YYYY-MM-DD' : ''} className={`${input} w-28 ml-1`} /></label>
            ))}
          </div>
          {boq && (
            <div className="text-sm space-y-1">
              <div aria-live="polite" className="space-y-1">
                {boq.boq.missing?.length ? <p className="text-xs text-slate-300">Not entered yet (needed for a bill total): {boq.boq.missing.join(', ')}</p> : null}
                {boq.boq.errors.map((e) => <p key={e} className="text-xs text-red-300">{e}</p>)}
              </div>
              {boq.boq.grandTotal === null ? (
                <p className="text-amber-300">No total yet: {boq.boq.unpricedItems.length ? `${boq.boq.unpricedItems.length} item(s) need a dated rate` : 'complete the adjustments'}. Priced items so far: KES {fmt(boq.boq.pricedSubtotal)} (not a bill total).</p>
              ) : (
                <table className="text-sm"><tbody>
                  {([['Measured works', boq.boq.measuredWorks], ['Preliminaries', boq.boq.preliminaries], ['Contingency', boq.boq.contingency], ['Overheads & profit', boq.boq.overheadsProfit], ['Subtotal before VAT', boq.boq.subtotalBeforeVat], ['VAT', boq.boq.vat], ['TOTAL', boq.boq.grandTotal]] as Array<[string, number | null]>).map(([l, v]) => (
                    <tr key={l} className={l === 'TOTAL' ? 'font-bold' : ''}><td className="pr-6">{l}</td><td className="text-right">KES {fmt(v)}</td></tr>
                  ))}
                </tbody></table>
              )}
              <div className="rounded border border-slate-700 p-2 text-xs" aria-label="Price status of the priced items">
                <div className="font-semibold">Price status (measured items, before adjustments)</div>
                <div className="text-emerald-300">Verified EmersonEIMS rates: KES {fmt(boq.boq.priceStatus.verified)} ({boq.boq.priceStatus.verifiedItems.length} item(s))</div>
                <div className="text-amber-300">Indicative market rates — preliminary budget only: KES {fmt(boq.boq.priceStatus.indicative)} ({boq.boq.priceStatus.indicativeItems.length} item(s))</div>
                <div className="text-slate-300">Unpriced — quotation required: {boq.boq.priceStatus.unpricedItems.length} item(s){boq.boq.priceStatus.unpricedItems.length ? ` (${boq.boq.priceStatus.unpricedItems.join(', ')})` : ''}</div>
                {boq.boq.priceStatus.preliminary && <p role="note" className="mt-1 font-semibold text-amber-200">{PRELIMINARY_NOTICE}</p>}
              </div>
              <p className="text-xs text-slate-400">Exports are marked DRAFT, not certified{boq.boq.grandTotal === null ? ', and INCOMPLETE: unpriced items show "rate required" and there is no bill total' : ''}.</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={exportXlsx} className="rounded bg-emerald-700 px-3 py-1 text-xs text-white">Export Excel (with formulas)</button>
                <button type="button" onClick={exportPdf} className="rounded bg-emerald-800 px-3 py-1 text-xs text-white">Export PDF report</button>
              </div>
            </div>
          )}
        </div>
      )}
      <p className="text-[11px] text-slate-500">{TAKEOFF_ENGINE_VERSION} · {PDF_SHEET_VERSION} · {BOQ_ENGINE_VERSION} · {BUILDUP_ENGINE_VERSION}. Reinforcement and formwork are not measured here. They come from the bar schedules and the formwork scheme. Rates come only from your dated rate library, supplier quotes, or build-ups of sourced, dated prices.</p>
    </div>
  );
}
