'use client';

/**
 * Service & Job Cards (P1, 2026-11-20). Thin UI over
 * lib/generator-oracle/service/store (state, save/load) and
 * lib/generator-oracle/service/maintenance (all rules). No intervals are built
 * in or suggested: every plan task is typed in from the OEM manual, with its
 * document, edition and page. Engine messages are shown unchanged.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { jobCardReport, nextStatuses, type Asset, type JobCard, type JobStatus } from '@/lib/generator-oracle/service/maintenance';
import {
  apply, dueFor, deserialise, emptyState, isEditable, loadState, saveState, serialise,
  type CardUpdate, type ServiceAction, type ServiceState,
} from '@/lib/generator-oracle/service/store';

const inp = 'w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-sm text-white focus:border-amber-500 outline-none';
const lbl = 'block text-xs text-slate-300';
const box = 'rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-3';
const btn = 'rounded-md bg-amber-600 hover:bg-amber-500 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50';
const btn2 = 'rounded-md border border-slate-600 hover:border-slate-400 px-3 py-1.5 text-sm text-slate-200';
const h3 = 'text-lg font-semibold text-amber-300';

/** '' → NaN so the store refuses it; otherwise Number(). */
const num = (v: string) => (v.trim() === '' ? NaN : Number(v));
const optNum = (v: string) => (v.trim() === '' ? undefined : Number(v));
const pad = (n: number) => String(n).padStart(2, '0');
const localNow = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const today = () => localNow().slice(0, 10);

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className={lbl}><span className="block mb-1">{label}</span>{children}</label>;
}
function ErrorLine({ error }: { error: string | null }) {
  return error ? <p role="alert" className="rounded-md border border-red-500/60 bg-red-950/50 px-3 py-2 text-sm text-red-100">{error}</p> : null;
}

const PILL: Record<string, string> = {
  OVERDUE: 'border-red-500 bg-red-500/20 text-red-200',
  'DUE SOON': 'border-amber-500 bg-amber-500/20 text-amber-200',
  'DUE (NO HISTORY)': 'border-amber-500 bg-amber-500/20 text-amber-200',
  OK: 'border-emerald-500 bg-emerald-500/20 text-emerald-200',
};
const STATUS_PILL: Record<JobStatus, string> = {
  OPEN: 'border-slate-500 text-slate-200', 'IN PROGRESS': 'border-cyan-500 text-cyan-200', 'AWAITING PARTS': 'border-amber-500 text-amber-200',
  COMPLETED: 'border-blue-500 text-blue-200', 'SIGNED OFF': 'border-emerald-500 text-emerald-200',
};
const Pill = ({ text, cls }: { text: string; cls: string }) => <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${cls}`}>{text}</span>;

type Dispatch = (a: ServiceAction) => boolean;

// ---------------------------------------------------------------- assets
const blankAsset = { id: '', make: '', model: '', engine: '', controller: '', serial: '', ratedKva: '' };
function AssetForm({ editing, dispatch, onDone }: { editing: Asset | null; dispatch: Dispatch; onDone: () => void }) {
  const [f, setF] = useState(blankAsset);
  useEffect(() => { setF(editing ? { ...editing, ratedKva: String(editing.ratedKva) } : blankAsset); }, [editing]);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const save = () => { if (dispatch({ type: 'saveAsset', asset: { ...f, id: f.id || undefined, ratedKva: num(f.ratedKva) } })) { setF(blankAsset); onDone(); } };
  return (
    <div className="space-y-2">
      <div className="text-sm text-slate-200">{editing ? `Edit asset ${editing.id}` : 'Add an asset'}</div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Field label="Make *"><input className={inp} value={f.make} onChange={set('make')} /></Field>
        <Field label="Model *"><input className={inp} value={f.model} onChange={set('model')} /></Field>
        <Field label="Serial number *"><input className={inp} value={f.serial} onChange={set('serial')} /></Field>
        <Field label="Engine"><input className={inp} value={f.engine} onChange={set('engine')} /></Field>
        <Field label="Controller"><input className={inp} value={f.controller} onChange={set('controller')} /></Field>
        <Field label="Rated kVA * (rating plate)"><input className={inp} inputMode="decimal" value={f.ratedKva} onChange={set('ratedKva')} /></Field>
      </div>
      <div className="flex gap-2">
        <button type="button" className={btn} onClick={save}>{editing ? 'Save asset' : 'Add asset'}</button>
        {editing && <button type="button" className={btn2} onClick={onDone}>Cancel</button>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- plan
const blankTask = { task: '', intervalHours: '', intervalMonths: '', document: '', edition: '', page: '' };
function PlanSection({ state, asset, dispatch }: { state: ServiceState; asset: Asset; dispatch: Dispatch }) {
  const [f, setF] = useState(blankTask);
  const plan = state.plans[asset.id] ?? [];
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const add = () => {
    if (dispatch({ type: 'addTask', assetId: asset.id, task: { task: f.task, intervalHours: optNum(f.intervalHours), intervalMonths: optNum(f.intervalMonths), source: { document: f.document, edition: f.edition, page: f.page } } })) setF(blankTask);
  };
  return (
    <div className={box}>
      <h3 className={h3}>Maintenance plan — {asset.make} {asset.model} ({asset.serial})</h3>
      <p className="text-xs text-slate-400">Type each task and its interval from the OEM manual for this machine. Nothing is pre-filled: the manual document, edition and page are required, and at least one interval (hours and/or months, whichever comes first).</p>
      {plan.length === 0 ? <p className="text-xs text-slate-500">No plan tasks yet.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-300">
            <thead><tr className="text-left text-slate-500"><th className="py-1 pr-2">ID</th><th className="pr-2">Task</th><th className="pr-2">Every</th><th className="pr-2">Manual</th><th /></tr></thead>
            <tbody>
              {plan.map((t) => (
                <tr key={t.id} className="border-t border-slate-800">
                  <td className="py-1 pr-2">{t.id}</td><td className="pr-2 text-white">{t.task}</td>
                  <td className="pr-2 whitespace-nowrap">{[t.intervalHours ? `${t.intervalHours} h` : null, t.intervalMonths ? `${t.intervalMonths} months` : null].filter(Boolean).join(' or ')}</td>
                  <td className="pr-2">{t.source.document}, {t.source.edition}, p. {t.source.page}</td>
                  <td><button type="button" className="text-slate-400 underline" onClick={() => window.confirm(`Remove plan task ${t.id}?`) && dispatch({ type: 'removeTask', assetId: asset.id, taskId: t.id })}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="sm:col-span-3"><Field label="Task *"><input className={inp} value={f.task} onChange={set('task')} /></Field></div>
        <Field label="Interval, engine hours"><input className={inp} inputMode="decimal" value={f.intervalHours} onChange={set('intervalHours')} /></Field>
        <Field label="Interval, months"><input className={inp} inputMode="decimal" value={f.intervalMonths} onChange={set('intervalMonths')} /></Field>
        <div />
        <Field label="Manual document *"><input className={inp} value={f.document} onChange={set('document')} /></Field>
        <Field label="Edition *"><input className={inp} value={f.edition} onChange={set('edition')} /></Field>
        <Field label="Page *"><input className={inp} value={f.page} onChange={set('page')} /></Field>
      </div>
      <button type="button" className={btn} onClick={add}>Add task to plan</button>
    </div>
  );
}

// ---------------------------------------------------------------- due list
function DueSection({ state, asset }: { state: ServiceState; asset: Asset }) {
  const [date, setDate] = useState(today());
  const [hours, setHours] = useState('');
  const [soonH, setSoonH] = useState('0');
  const [soonD, setSoonD] = useState('0');
  const result = useMemo(() => {
    if (hours.trim() === '') return null;
    return dueFor(state, asset.id, { date, engineHours: num(hours) }, { hours: num(soonH) || 0, days: num(soonD) || 0 });
  }, [state, asset.id, date, hours, soonH, soonD]);
  const hist = state.history[asset.id] ?? [];
  return (
    <div className={box}>
      <h3 className={h3}>Due list — {asset.make} {asset.model} ({asset.serial})</h3>
      <div className="grid gap-2 sm:grid-cols-4">
        <Field label="Today's date"><input type="date" className={inp} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Hour-meter reading now (h)"><input className={inp} inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} /></Field>
        <Field label="Due-soon window, hours (your workshop)"><input className={inp} inputMode="decimal" value={soonH} onChange={(e) => setSoonH(e.target.value)} /></Field>
        <Field label="Due-soon window, days (your workshop)"><input className={inp} inputMode="decimal" value={soonD} onChange={(e) => setSoonD(e.target.value)} /></Field>
      </div>
      {!result ? <p className="text-xs text-slate-400">Enter the hour-meter reading to see what is due.</p> : result.error ? <ErrorLine error={result.error} /> : result.items.length === 0 ? (
        <p className="text-xs text-slate-400">This asset has no plan tasks yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-300">
            <thead><tr className="text-left text-slate-500"><th className="py-1 pr-2">Status</th><th className="pr-2">Task</th><th className="pr-2">Last done</th><th className="pr-2">Next due (h)</th><th className="pr-2">Next due (date)</th><th>Manual</th></tr></thead>
            <tbody>
              {result.items.map((d) => (
                <tr key={d.taskId} className="border-t border-slate-800 align-top">
                  <td className="py-1 pr-2"><Pill text={d.status} cls={PILL[d.status]} /></td>
                  <td className="pr-2"><span className="text-white">{d.task}</span><span className="block text-slate-500">{d.reason}</span></td>
                  <td className="pr-2 whitespace-nowrap">{d.lastDone ? `${d.lastDone.date}, ${d.lastDone.engineHours} h` : '—'}</td>
                  <td className="pr-2">{d.nextDueHours ?? '—'}</td>
                  <td className="pr-2 whitespace-nowrap">{d.nextDueDate ?? '—'}</td>
                  <td>{d.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <details>
        <summary className="cursor-pointer text-xs text-slate-300">Service history ({hist.length})</summary>
        <ul className="mt-2 text-xs text-slate-400 space-y-1">
          {hist.map((r) => <li key={r.jobCardId}>{r.date} · {r.engineHours} h · {r.taskIds.join(', ')} · job card {r.jobCardId} · {r.technician}</li>)}
        </ul>
      </details>
    </div>
  );
}

// ---------------------------------------------------------------- job cards
function OpenCardForm({ asset, dispatch }: { asset: Asset; dispatch: Dispatch }) {
  const blank = { reportedFault: '', faultCodes: '', technician: '', opened: today() };
  const [f, setF] = useState(blank);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const open = () => { if (dispatch({ type: 'openCard', card: { assetId: asset.id, opened: f.opened, reportedFault: f.reportedFault, faultCodes: f.faultCodes.split(','), technician: f.technician } })) setF(blank); };
  return (
    <div className="space-y-2">
      <div className="text-sm text-slate-200">Open a job card for {asset.make} {asset.model} ({asset.serial})</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="sm:col-span-2"><Field label="Reported fault *"><input className={inp} value={f.reportedFault} onChange={set('reportedFault')} /></Field></div>
        <Field label="Fault codes (comma separated)"><input className={inp} value={f.faultCodes} onChange={set('faultCodes')} /></Field>
        <Field label="Technician *"><input className={inp} value={f.technician} onChange={set('technician')} /></Field>
        <Field label="Date opened *"><input type="date" className={inp} value={f.opened} onChange={set('opened')} /></Field>
      </div>
      <button type="button" className={btn} onClick={open}>Open job card</button>
    </div>
  );
}

type PartRow = { partNo: string; description: string; qty: string; document: string; edition: string; page: string };
type ReadingRow = { name: string; value: string; unit: string; min: string; max: string; limitSource: string };
interface Draft { tasks: string; parts: PartRow[]; labourHours: string; engineHoursAtJob: string; readings: ReadingRow[]; findings: string }
const toDraft = (c: JobCard): Draft => ({
  tasks: c.tasks.join('\n'), labourHours: String(c.labourHours), engineHoursAtJob: c.engineHoursAtJob === null ? '' : String(c.engineHoursAtJob), findings: c.findings,
  parts: c.parts.map((p) => ({ partNo: p.partNo, description: p.description, qty: String(p.qty), document: p.compatibility?.document ?? '', edition: p.compatibility?.edition ?? '', page: p.compatibility?.page ?? '' })),
  readings: c.readings.map((r) => ({ name: r.name, value: String(r.value), unit: r.unit, min: r.min === undefined ? '' : String(r.min), max: r.max === undefined ? '' : String(r.max), limitSource: r.limitSource ?? '' })),
});
const fromDraft = (d: Draft): CardUpdate => ({
  tasks: d.tasks.split('\n'), findings: d.findings, labourHours: num(d.labourHours),
  engineHoursAtJob: d.engineHoursAtJob.trim() === '' ? null : num(d.engineHoursAtJob),
  parts: d.parts.map((p) => ({ partNo: p.partNo, description: p.description, qty: num(p.qty), compatibility: { document: p.document, edition: p.edition, page: p.page } })),
  readings: d.readings.map((r) => ({ name: r.name, value: num(r.value), unit: r.unit, min: optNum(r.min), max: optNum(r.max), limitSource: r.limitSource })),
});

function CardDetail({ state, card, asset, dispatch }: { state: ServiceState; card: JobCard; asset: Asset; dispatch: Dispatch }) {
  const editable = isEditable(card);
  const [d, setD] = useState<Draft>(() => toDraft(card));
  const [who, setWho] = useState('');
  const [when, setWhen] = useState(localNow());
  const [note, setNote] = useState('');
  const plan = state.plans[card.assetId] ?? [];
  const recorded = (state.history[card.assetId] ?? []).some((r) => r.jobCardId === card.id);
  const [ticked, setTicked] = useState<string[]>([]);
  const report = jobCardReport(card, asset);
  const setPart = (i: number, k: keyof PartRow, v: string) => setD({ ...d, parts: d.parts.map((p, j) => (j === i ? { ...p, [k]: v } : p)) });
  const setReading = (i: number, k: keyof ReadingRow, v: string) => setD({ ...d, readings: d.readings.map((p, j) => (j === i ? { ...p, [k]: v } : p)) });
  const go = (to: JobStatus) => {
    if (dispatch({ type: 'transition', cardId: card.id, to, by: who, at: when, note, update: editable ? fromDraft(d) : undefined })) { setNote(''); }
  };

  return (
    <div className={box}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className={h3}>Job card {card.id}</h3>
        <Pill text={card.status} cls={STATUS_PILL[card.status]} />
      </div>
      <p className="text-xs text-slate-400">{asset.make} {asset.model} ({asset.serial}) · opened {card.opened} by {card.technician} · reported: {card.reportedFault}{card.faultCodes.length ? ` · codes ${card.faultCodes.join(', ')}` : ''}</p>

      {editable ? (
        <div className="space-y-3">
          <Field label="Work done (one task per line)"><textarea rows={3} className={inp} value={d.tasks} onChange={(e) => setD({ ...d, tasks: e.target.value })} /></Field>
          <div className="space-y-2">
            <div className="text-xs text-slate-300">Parts — leave the parts-book reference empty if not checked (shown as compatibility unverified; sign-off is blocked until cited)</div>
            {d.parts.map((p, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-7 items-end rounded-lg border border-slate-800 p-2">
                <Field label="Part no."><input className={inp} value={p.partNo} onChange={(e) => setPart(i, 'partNo', e.target.value)} /></Field>
                <div className="sm:col-span-2"><Field label="Description"><input className={inp} value={p.description} onChange={(e) => setPart(i, 'description', e.target.value)} /></Field></div>
                <Field label="Qty"><input className={inp} inputMode="decimal" value={p.qty} onChange={(e) => setPart(i, 'qty', e.target.value)} /></Field>
                <Field label="Parts book"><input className={inp} value={p.document} onChange={(e) => setPart(i, 'document', e.target.value)} /></Field>
                <Field label="Edition"><input className={inp} value={p.edition} onChange={(e) => setPart(i, 'edition', e.target.value)} /></Field>
                <div className="flex gap-1 items-end">
                  <Field label="Page"><input className={inp} value={p.page} onChange={(e) => setPart(i, 'page', e.target.value)} /></Field>
                  <button type="button" aria-label="Remove part" className="text-slate-400 px-1 pb-1.5" onClick={() => setD({ ...d, parts: d.parts.filter((_, j) => j !== i) })}>✕</button>
                </div>
              </div>
            ))}
            <button type="button" className={btn2} onClick={() => setD({ ...d, parts: [...d.parts, { partNo: '', description: '', qty: '1', document: '', edition: '', page: '' }] })}>+ Add part</button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Labour hours"><input className={inp} inputMode="decimal" value={d.labourHours} onChange={(e) => setD({ ...d, labourHours: e.target.value })} /></Field>
            <Field label="Engine hours at job"><input className={inp} inputMode="decimal" value={d.engineHoursAtJob} onChange={(e) => setD({ ...d, engineHoursAtJob: e.target.value })} /></Field>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-slate-300">Test-run readings — limits are optional; if you give one, say where it comes from (rating plate, manual page, settings sheet)</div>
            {d.readings.map((r, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-7 items-end rounded-lg border border-slate-800 p-2">
                <div className="sm:col-span-2"><Field label="Reading"><input className={inp} value={r.name} onChange={(e) => setReading(i, 'name', e.target.value)} /></Field></div>
                <Field label="Value"><input className={inp} inputMode="decimal" value={r.value} onChange={(e) => setReading(i, 'value', e.target.value)} /></Field>
                <Field label="Unit"><input className={inp} value={r.unit} onChange={(e) => setReading(i, 'unit', e.target.value)} /></Field>
                <Field label="Min"><input className={inp} inputMode="decimal" value={r.min} onChange={(e) => setReading(i, 'min', e.target.value)} /></Field>
                <Field label="Max"><input className={inp} inputMode="decimal" value={r.max} onChange={(e) => setReading(i, 'max', e.target.value)} /></Field>
                <div className="flex gap-1 items-end">
                  <Field label="Limit source"><input className={inp} value={r.limitSource} onChange={(e) => setReading(i, 'limitSource', e.target.value)} /></Field>
                  <button type="button" aria-label="Remove reading" className="text-slate-400 px-1 pb-1.5" onClick={() => setD({ ...d, readings: d.readings.filter((_, j) => j !== i) })}>✕</button>
                </div>
              </div>
            ))}
            <button type="button" className={btn2} onClick={() => setD({ ...d, readings: [...d.readings, { name: '', value: '', unit: '', min: '', max: '', limitSource: '' }] })}>+ Add reading</button>
          </div>
          <Field label="Findings"><textarea rows={3} className={inp} value={d.findings} onChange={(e) => setD({ ...d, findings: e.target.value })} /></Field>
          <button type="button" className={btn2} onClick={() => dispatch({ type: 'updateCard', cardId: card.id, update: fromDraft(d) })}>Save changes</button>
        </div>
      ) : card.status === 'COMPLETED' ? (
        <p className="text-xs text-slate-400">Completed cards are locked. To change anything, move the card back to IN PROGRESS.</p>
      ) : null}

      {nextStatuses(card.status).length > 0 && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 space-y-2">
          <div className="text-xs text-amber-300">Next step{editable ? ' (the details above are saved with it)' : ''}</div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Field label={nextStatuses(card.status).includes('SIGNED OFF') ? 'Who (supervisor, for sign-off) *' : 'Who *'}><input className={inp} value={who} onChange={(e) => setWho(e.target.value)} /></Field>
            <Field label="When *"><input type="datetime-local" className={inp} value={when} onChange={(e) => setWhen(e.target.value)} /></Field>
            <Field label="Note"><input className={inp} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
          </div>
          <div className="flex flex-wrap gap-2">
            {nextStatuses(card.status).map((s) => <button key={s} type="button" className={btn} onClick={() => go(s)}>→ {s}</button>)}
          </div>
        </div>
      )}

      {card.status === 'SIGNED OFF' && (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-3 space-y-2">
          {recorded ? <p className="text-xs text-emerald-300">Recorded in this asset&apos;s service history; the due list includes it.</p> : plan.length === 0 ? (
            <p className="text-xs text-slate-400">This asset has no plan tasks, so there is nothing to record against.</p>
          ) : (
            <>
              <div className="text-xs text-emerald-300">Which plan tasks did this job cover?</div>
              {plan.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-xs text-slate-200">
                  <input type="checkbox" checked={ticked.includes(t.id)} onChange={(e) => setTicked(e.target.checked ? [...ticked, t.id] : ticked.filter((x) => x !== t.id))} />
                  {t.id} · {t.task}
                </label>
              ))}
              <button type="button" className={btn} onClick={() => dispatch({ type: 'recordService', cardId: card.id, planTaskIds: ticked })}>Record as service history</button>
            </>
          )}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-slate-300">Job card report</div>
          <button type="button" className={btn2} onClick={() => download(`job-card-${card.id}.txt`, report, 'text/plain;charset=utf-8')}>Download .txt</button>
        </div>
        <pre className="whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-300">{report}</pre>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- main
export default function ServiceManagementPanel() {
  const [state, setState] = useState<ServiceState>(emptyState);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [assetId, setAssetId] = useState('');
  const [editing, setEditing] = useState<Asset | null>(null);
  const [view, setView] = useState<'assets' | 'due' | 'cards'>('assets');
  const [cardId, setCardId] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let store: Storage | null = null;
    try { store = window.localStorage; } catch { store = null; }
    const r = loadState(store);
    setState(r.state); setStorageError(r.error); setLoaded(true);
    if (r.state.assets[0]) setAssetId(r.state.assets[0].id);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    let store: Storage | null = null;
    try { store = window.localStorage; } catch { store = null; }
    const e = saveState(store, state);
    if (e) setStorageError(e);
  }, [state, loaded]);

  const dispatch: Dispatch = (a) => {
    const r = apply(state, a);
    setError(r.error); setNotice(null);
    if (r.error) return false;
    setState(r.state);
    if (a.type === 'saveAsset' && !a.asset.id) setAssetId(r.state.assets[r.state.assets.length - 1].id);
    if (a.type === 'openCard') setCardId(r.state.jobCards[r.state.jobCards.length - 1].id);
    return true;
  };

  const asset = state.assets.find((a) => a.id === assetId) ?? null;
  const cards = state.jobCards.filter((c) => c.assetId === assetId);
  const card = cards.find((c) => c.id === cardId) ?? null;

  const importFile = async (file: File) => {
    let text = '';
    try { text = await file.text(); } catch { setError('Could not read that file'); return; }
    const r = deserialise(text);
    if (!r.ok) { setError(r.error); setNotice(null); return; }
    if (!window.confirm('Replace everything saved in this browser with the imported file?')) return;
    setState(r.state); setError(null); setCardId(''); setEditing(null);
    setAssetId(r.state.assets[0]?.id ?? '');
    setNotice(`Imported ${r.state.assets.length} assets and ${r.state.jobCards.length} job cards.`);
  };

  return (
    <div className="space-y-4">
      <div className={box}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className={h3}>Service &amp; Job Cards</h3>
            <p className="text-xs text-slate-400">Asset register, maintenance plans from the OEM manual, what is due, and workshop job cards with sign-off.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btn2} onClick={() => download(`oracle-service-${today()}.json`, serialise(state), 'application/json')}>Export JSON</button>
            <button type="button" className={btn2} onClick={() => fileRef.current?.click()}>Import JSON</button>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" aria-label="Import JSON file"
              onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void importFile(f); }} />
          </div>
        </div>
        <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">Saved in this browser only — accounts and shared storage are not available yet. Use Export JSON to keep a copy.</p>
        {storageError && <p className="text-xs text-red-300">{storageError}</p>}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
          <div className="flex-1"><Field label="Asset">
            <select className={inp} value={assetId} onChange={(e) => { setAssetId(e.target.value); setCardId(''); setEditing(null); }}>
              <option value="">{state.assets.length ? 'Choose an asset' : 'No assets yet — add one below'}</option>
              {state.assets.map((a) => <option key={a.id} value={a.id}>{a.id} · {a.make} {a.model} · {a.serial} · {a.ratedKva} kVA</option>)}
            </select>
          </Field></div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Service section">
            {([['assets', 'Assets & plan'], ['due', 'Due list'], ['cards', 'Job cards']] as const).map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => setView(id)}
                className={`rounded-full px-3 py-1 text-xs border ${view === id ? 'border-amber-400 bg-amber-500/20 text-amber-200' : 'border-slate-700 text-slate-300 hover:border-slate-500'}`}>{label}</button>
            ))}
          </div>
        </div>
        <ErrorLine error={error} />
        {notice && <p className="text-xs text-emerald-300">{notice}</p>}
      </div>

      {view === 'assets' && (
        <>
          <div className={box}>
            <h3 className={h3}>Asset register</h3>
            {state.assets.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-slate-300">
                  <thead><tr className="text-left text-slate-500"><th className="py-1 pr-2">ID</th><th className="pr-2">Make / model</th><th className="pr-2">Engine</th><th className="pr-2">Controller</th><th className="pr-2">Serial</th><th className="pr-2">kVA</th><th /></tr></thead>
                  <tbody>
                    {state.assets.map((a) => (
                      <tr key={a.id} className={`border-t border-slate-800 ${a.id === assetId ? 'bg-amber-500/5' : ''}`}>
                        <td className="py-1 pr-2">{a.id}</td><td className="pr-2 text-white">{a.make} {a.model}</td><td className="pr-2">{a.engine || '—'}</td><td className="pr-2">{a.controller || '—'}</td><td className="pr-2">{a.serial}</td><td className="pr-2">{a.ratedKva}</td>
                        <td className="whitespace-nowrap space-x-2">
                          <button type="button" className="text-amber-300 underline" onClick={() => { setAssetId(a.id); setEditing(a); }}>Edit</button>
                          <button type="button" className="text-slate-400 underline" onClick={() => window.confirm(`Remove asset ${a.id} and its plan and history?`) && dispatch({ type: 'removeAsset', assetId: a.id })}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <AssetForm editing={editing} dispatch={dispatch} onDone={() => setEditing(null)} />
          </div>
          {asset && <PlanSection state={state} asset={asset} dispatch={dispatch} />}
        </>
      )}

      {view === 'due' && (asset ? <DueSection state={state} asset={asset} /> : <p className="text-xs text-slate-400">Choose or add an asset first.</p>)}

      {view === 'cards' && (asset ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className={box}>
            <h3 className={h3}>Job cards</h3>
            {cards.length === 0 ? <p className="text-xs text-slate-500">No job cards for this asset.</p> : (
              <ul className="space-y-1">
                {[...cards].reverse().map((c) => (
                  <li key={c.id}>
                    <button type="button" onClick={() => setCardId(c.id)}
                      className={`w-full text-left rounded-lg border px-3 py-2 text-xs ${c.id === cardId ? 'border-amber-400 bg-amber-500/10' : 'border-slate-700 hover:border-slate-500'}`}>
                      <div className="flex justify-between gap-2"><span className="text-white">{c.id} · {c.opened}</span><Pill text={c.status} cls={STATUS_PILL[c.status]} /></div>
                      <div className="text-slate-400 truncate">{c.reportedFault}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <OpenCardForm asset={asset} dispatch={dispatch} />
          </div>
          {card ? <CardDetail key={`${card.id}-${card.status}-${card.log.length}`} state={state} card={card} asset={asset} dispatch={dispatch} /> : <p className="text-xs text-slate-400">Choose a job card or open a new one.</p>}
        </div>
      ) : <p className="text-xs text-slate-400">Choose or add an asset first.</p>)}
    </div>
  );
}
