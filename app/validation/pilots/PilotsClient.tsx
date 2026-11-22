'use client';

/**
 * Pilot comparison cards. Files are read with the File API and compared in
 * this tab only: no upload, no fetch, no storage beyond memory. Closing or
 * reloading the tab discards everything.
 */
import { useCallback, useRef, useState } from 'react';
import { CARDS, CARD_ORDER, PilotFileError, checkFileMeta, runPilot, QS_ITEM_TOL_PCT, QS_TOTAL_TOL_PCT, SOLAR_MONTH_REASON_PCT, type CardId, type PilotResult } from '@/lib/validation/pilots/cards';
import { BOREHOLES_TEMPLATE, QS_TEMPLATE, SOLAR_TEMPLATE, downloadBlob } from '@/lib/validation/pilots/templates';
import { sha256Hex, type PilotFileInfo } from '@/lib/validation/pilots/report';

export const PRIVACY_NOTICE = 'Client records stay on this computer; nothing is uploaded.';

interface Loaded { file: PilotFileInfo; text: string }
interface CardState { loaded?: Loaded; result?: PilotResult; error?: string; busy?: boolean }

async function readFile(f: File): Promise<ArrayBuffer> {
  if (typeof f.arrayBuffer === 'function') return f.arrayBuffer();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as ArrayBuffer);
    r.onerror = () => reject(r.error);
    r.readAsArrayBuffer(f);
  });
}

const csvType = 'text/csv;charset=utf-8';

const TEMPLATES: Record<CardId, Array<{ label: string; name: string; make: () => Promise<string> }>> = {
  oracle: [
    { label: 'Download blank alarm review pack', name: 'oracle-alarm-review-pack.csv', make: async () => (await import('@/lib/validation/pilots/oracleTemplates')).oracleAlarmPackCsv() },
    { label: 'Download blank guided-diagnostics sheet', name: 'oracle-guided-diagnostics-review-sheet-pilot.csv', make: async () => (await import('@/lib/validation/pilots/oracleTemplates')).oracleGuidedSheetCsv() },
  ],
  solar: [{ label: 'Download blank template', name: 'real-system-comparison-template.csv', make: async () => SOLAR_TEMPLATE }],
  boreholes: [{ label: 'Download blank template', name: 'boreholes-template.csv', make: async () => BOREHOLES_TEMPLATE }],
  qs: [{ label: 'Download blank template', name: 'drawing-boq-comparison-template.csv', make: async () => QS_TEMPLATE }],
};

const toneClass = { ok: 'text-emerald-300', warn: 'text-amber-300', fail: 'text-red-300' } as const;

function Card({ id, anonymise }: { id: CardId; anonymise: boolean }) {
  const def = CARDS[id];
  const [st, setSt] = useState<CardState>({});
  const input = useRef<HTMLInputElement>(null);

  const compare = useCallback((loaded: Loaded, anon: boolean): CardState => {
    try { return { loaded, result: runPilot(id, loaded.text, { anonymise: anon }) }; }
    catch (e) { return { loaded: undefined, error: e instanceof PilotFileError ? e.message : `The file could not be compared: ${(e as Error).message}` }; }
  }, [id]);

  // Re-run when the anonymise option changes, from the text held in memory.
  const [lastAnon, setLastAnon] = useState(anonymise);
  if (lastAnon !== anonymise) {
    setLastAnon(anonymise);
    if (st.loaded) setSt(compare(st.loaded, anonymise));
  }

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setSt({ busy: true });
    try {
      checkFileMeta(f.name, f.size);
      const buf = await readFile(f);
      const sha256 = await sha256Hex(buf);
      let text: string;
      try { text = new TextDecoder('utf-8', { fatal: true }).decode(buf); }
      catch { throw new PilotFileError('The file is not UTF-8 text. In Excel use File > Save As > "CSV UTF-8 (Comma delimited)".'); }
      setSt(compare({ file: { name: f.name, bytes: f.size, sha256 }, text }, anonymise));
    } catch (e) {
      setSt({ error: e instanceof PilotFileError ? e.message : `The file could not be read: ${(e as Error).message}` });
    } finally {
      if (input.current) input.current.value = '';
    }
  };

  const download = async (kind: 'pdf' | 'json') => {
    if (!st.result || !st.loaded) return;
    const rep = await import('@/lib/validation/pilots/report');
    const report = rep.buildReport(st.result, st.loaded.file);
    const stem = rep.reportFileStem(report);
    if (kind === 'json') downloadBlob(`${stem}.json`, rep.reportJson(report), 'application/json');
    else downloadBlob(`${stem}.pdf`, rep.reportPdf(report) as BlobPart, 'application/pdf');
  };

  const r = st.result;
  return (
    <section className="rounded-lg border border-slate-700 bg-slate-900/60 p-5" aria-labelledby={`card-${id}`} data-card={id}>
      <h2 id={`card-${id}`} className="text-lg font-semibold text-white">{def.title}</h2>
      <p className="mt-1 text-xs text-slate-400">Engine: {def.engine}</p>
      <h3 className="mt-4 text-sm font-semibold text-slate-200">Records needed</h3>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-300">{def.records.map((x) => <li key={x}>{x}</li>)}</ul>

      <div className="mt-4 flex flex-wrap gap-2">
        {TEMPLATES[id].map((t) => (
          <button key={t.name} type="button" className="rounded border border-slate-500 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-800"
            onClick={async () => downloadBlob(t.name, await t.make(), csvType)}>{t.label}</button>
        ))}
        <label className="cursor-pointer rounded bg-amber-500 px-3 py-1.5 text-sm font-semibold text-slate-950 hover:bg-amber-400">
          Load filled file (CSV)
          <input ref={input} type="file" accept=".csv,text/csv" className="sr-only" aria-label={`Load filled file for ${def.title}`}
            onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
      </div>
      <p className="mt-2 text-xs text-emerald-300">{PRIVACY_NOTICE}</p>

      {st.busy && <p className="mt-3 text-sm text-slate-300">Reading the file...</p>}
      {st.error && <p role="alert" className="mt-3 rounded border border-red-700 bg-red-950/50 p-3 text-sm text-red-200">File refused: {st.error}</p>}

      {r && st.loaded && (
        <div className="mt-4 space-y-4" data-testid={`result-${id}`}>
          <p className="text-sm text-slate-300">
            File SHA-256 <code className="break-all text-xs">{st.loaded.file.sha256}</code>
            {r.anonymised ? ' (client names anonymised in the results and report)' : ''}
          </p>
          <p className="text-base font-semibold text-white">Status: {r.status}</p>
          <table className="w-full text-left text-sm">
            <tbody>{r.summary.map(([k, v]) => <tr key={k} className="border-t border-slate-800"><th className="py-1 pr-3 font-normal text-slate-400">{k}</th><td className="py-1 text-slate-100">{v}</td></tr>)}</tbody>
          </table>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Acceptance tolerances and rules used</h3>
            <ul className="mt-1 list-disc pl-5 text-sm text-slate-300">{r.tolerances.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div className="overflow-x-auto">
            <h3 className="text-sm font-semibold text-slate-200">Rows compared ({r.rows.length})</h3>
            <table className="mt-1 w-full min-w-[36rem] text-left text-xs">
              <thead><tr className="text-slate-400"><th className="py-1 pr-2">Row</th><th className="py-1 pr-2">Verdict</th><th className="py-1">Evidence</th></tr></thead>
              <tbody>{r.rows.map((x, i) => <tr key={`${x.ref}-${i}`} className="border-t border-slate-800 align-top"><td className="py-1 pr-2 text-slate-200">{x.ref}</td><td className={`py-1 pr-2 ${toneClass[x.tone]}`}>{x.verdict}</td><td className="py-1 text-slate-300">{x.evidence}</td></tr>)}</tbody>
            </table>
            {!r.rows.length && <p className="text-xs text-slate-400">No row has a usable result yet.</p>}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Excluded or invalid rows ({r.excluded.length}); never filled in</h3>
            <ul className="mt-1 list-disc pl-5 text-xs text-red-200">{r.excluded.map((x, i) => <li key={`${x.ref}-${i}`}><span className="text-slate-200">{x.ref || 'file'}</span>: {x.reason}</li>)}</ul>
          </div>
          {r.notes.length > 0 && <ul className="list-disc pl-5 text-xs text-slate-400">{r.notes.map((n) => <li key={n}>{n}</li>)}</ul>}
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded border border-slate-500 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-800" onClick={() => download('pdf')}>Download report (PDF)</button>
            <button type="button" className="rounded border border-slate-500 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-800" onClick={() => download('json')}>Download report (JSON)</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default function PilotsClient() {
  const [anonymise, setAnonymise] = useState(true);
  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 py-24 text-slate-100">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">Preview only. Not available on the public site.</p>
      <h1 className="mt-2 text-2xl font-bold text-white">Pilot comparison: one real project per application</h1>
      <p className="mt-3 text-sm text-slate-300">
        Use company project records only with the client&apos;s permission. Each card compares one filled file against the tested engine and
        produces a report stamped &quot;PILOT COMPARISON — for reviewer assessment, not a certification&quot;, with a blank reviewer section
        for wet signature. The tool never marks anything verified.
      </p>
      <p className="mt-2 text-sm font-semibold text-emerald-300">{PRIVACY_NOTICE} Files are read in this browser tab and discarded when it closes.</p>
      <p className="mt-2 text-xs text-slate-400">
        Tolerances used: Building +/-{QS_ITEM_TOL_PCT} % per item and +/-{QS_TOTAL_TOL_PCT} % on the total; Solar months more than {SOLAR_MONTH_REASON_PCT} % off need a stated reason;
        Oracle verdicts count only with manual, edition, page and reviewer; AquaScan records pass the import checks listed on the card.
      </p>
      <label className="mt-4 flex items-center gap-2 text-sm text-slate-200">
        <input type="checkbox" checked={anonymise} onChange={(e) => setAnonymise(e.target.checked)} />
        Anonymise client names in the report
      </label>
      <div className="mt-6 grid gap-6">{CARD_ORDER.map((id) => <Card key={id} id={id} anonymise={anonymise} />)}</div>
    </main>
  );
}
