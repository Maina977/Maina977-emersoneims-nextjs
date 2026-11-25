'use client';

/**
 * Guided fault-finding (P1-A). Deterministic: lib/generator-oracle/diagnostics.
 * Stop rules are shown first and cannot be hidden; readings outside the
 * physical range are refused with the reason; machine limits come from the
 * OEM manual entered by the technician, never from defaults.
 */
import { useEffect, useMemo, useState } from 'react';
import { diagnose } from '@/lib/generator-oracle/diagnostics/engine';
import { FAMILIES, familyFor } from '@/lib/generator-oracle/diagnostics/families';
import type { Answers, Question } from '@/lib/generator-oracle/diagnostics/types';

/** Browser storage key for answers, latched STOPs and the clearance record. */
export const GD_STORE = 'eims-oracle-guided-diagnosis-v1';
/** Shown with every clearance and in the record (management acceptance condition). */
export const CLEARANCE_NOT_RESTART = 'Recording a clearance only removes this software STOP. It is NOT authorisation to restart the generator or return it to service: follow the applicable OEM procedure and have a qualified technician verify the set first. Clearances recorded here are UNVERIFIED: the person is not authenticated.';

type StoredLatched = { key: string; message: string; from: string; since: string };
type StoredClearance = StoredLatched & { clearedAt: string; by: string; reason: string };
const isStr = (v: unknown): v is string => typeof v === 'string' && v.length > 0;
const validLatched = (x: unknown): x is StoredLatched => !!x && typeof x === 'object' && isStr((x as StoredLatched).key) && isStr((x as StoredLatched).message) && isStr((x as StoredLatched).from) && isStr((x as StoredLatched).since);
const validClearance = (x: unknown): x is StoredClearance => validLatched(x) && isStr((x as StoredClearance).clearedAt) && isStr((x as StoredClearance).by) && typeof (x as StoredClearance).reason === 'string';
/** Reads the stored safety state. Any malformed part makes the whole record unreadable (never "cleared"). */
export function readStore(): { unreadable: boolean; raw?: Record<string, Record<string, string>>; latched: StoredLatched[]; cleared: StoredClearance[] } {
  let text: string | null = null;
  try { text = localStorage.getItem(GD_STORE); } catch { return { unreadable: true, latched: [], cleared: [] }; }
  if (text === null) return { unreadable: false, latched: [], cleared: [] };
  try {
    const s = JSON.parse(text);
    // Every part must have the exact shape the panel writes (independent review L3d/L3f: a
    // clearance without clearedAt, or a non-text answer, crashed the panel and hid the STOP).
    const rawOk = s && s.raw && typeof s.raw === 'object' && !Array.isArray(s.raw)
      && Object.values(s.raw).every((fam) => fam && typeof fam === 'object' && !Array.isArray(fam) && Object.values(fam as object).every((v) => typeof v === 'string'));
    const ok = s && typeof s === 'object' && (s.v === 1 || s.v === 2) && rawOk
      && Array.isArray(s.latched) && s.latched.every(validLatched)
      && Array.isArray(s.cleared) && s.cleared.every((c: unknown) => validClearance({ reason: '', ...(c as object) }));
    if (!ok) return { unreadable: true, latched: [], cleared: [] };
    return { unreadable: false, raw: s.raw, latched: s.latched, cleared: s.cleared.map((c: StoredClearance) => ({ ...c, reason: c.reason ?? '' })) };
  } catch { return { unreadable: true, latched: [], cleared: [] }; }
}
const sameStop = (a: StoredLatched, b: StoredLatched) => a.key === b.key && a.since === b.since;
/** Union of latched STOPs, minus only those with a recorded clearance for that exact STOP. */
export function mergeLatched(a: StoredLatched[], b: StoredLatched[], cleared: StoredClearance[]): StoredLatched[] {
  const out: StoredLatched[] = [];
  for (const l of [...a, ...b]) if (!out.some((x) => x.key === l.key) && !cleared.some((c) => sameStop(c, l))) out.push(l);
  return out;
}
export function mergeCleared(a: StoredClearance[], b: StoredClearance[]): StoredClearance[] {
  const out = [...a];
  for (const c of b) if (!out.some((x) => sameStop(x, c) && x.clearedAt === c.clearedAt)) out.push(c);
  return out;
}
const UNREADABLE_STOP = (): StoredLatched => ({ key: 'storage|unreadable', from: 'stored safety record', since: new Date().toISOString(), message: 'The stored safety record in this browser could not be read or was altered, so earlier STOPs cannot be confirmed as cleared. Treat the set as stopped until a qualified technician has checked it.' });

function QuestionInput({ q, value, onChange }: { q: Question; value: string; onChange: (v: string) => void }) {
  const id = `gd-${q.id}`;
  return (
    <div className="block text-xs text-slate-300">
      <label htmlFor={id} className="block mb-1">
        {q.text}
        {q.kind === 'number' ? <span className="text-slate-500"> ({q.unit})</span> : null}
      </label>
      {q.kind === 'number' ? (
        <input id={id} inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-sm text-white focus:border-amber-500 outline-none" />
      ) : (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-sm text-white">
          <option value="">Not answered</option>
          {q.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}
      {q.help ? <span className="block mt-1 text-slate-500">{q.help}</span> : null}
    </div>
  );
}

export default function GuidedDiagnosisPanel() {
  const [familyId, setFamilyId] = useState(FAMILIES[0].id);
  const [symptom, setSymptom] = useState('');
  const [raw, setRaw] = useState<Record<string, Record<string, string>>>({});
  const family = FAMILIES.find((f) => f.id === familyId)!;
  const values = raw[familyId] ?? {};

  const toAnswers = (fam: typeof family, vals: Record<string, string>): Answers => {
    const a: Answers = {};
    for (const q of fam.questions) {
      const v = vals[q.id];
      if (v === undefined || v.trim() === '') continue;
      a[q.id] = q.kind === 'number' ? Number(v) : v;
    }
    return a;
  };
  const result = useMemo(() => diagnose(family, toAnswers(family, values)), [family, values]);
  // STOPs raised on OTHER fault-family tabs apply to the same machine (2026-11-25 safety
  // hotfix, review R2/F3): they are shown here too and hold every tab.
  const otherStops = useMemo(() => FAMILIES.filter((f) => f.id !== familyId).flatMap((f) =>
    diagnose(f, toAnswers(f, raw[f.id] ?? {})).stops.filter((s) => s.level === 'STOP').map((s) => ({ ...s, from: f.title }))), [raw, familyId]);

  // STOP LATCH (2026-11-25 safety hotfix, management directive on STOP persistence): a STOP,
  // once shown, stays active across tab changes, reloads, changed or cleared answers and
  // less severe faults. It is cleared only by an explicit, recorded clearance, accepted only
  // when the entered answers no longer show the condition. Answers, latched STOPs and the
  // clearance record are kept in this browser (localStorage); if storage is unavailable the
  // panel says so.
  // Management acceptance conditions (2026-11-25): a browser-recorded clearance is UNVERIFIED
  // (the technician is not authenticated) and is never authorisation to restart; unreadable or
  // corrupted stored safety state is treated as a STOP, never as "cleared"; several open
  // windows are merged so a STOP is never dropped by another window's write.
  type Latched = { key: string; message: string; from: string; since: string };
  type Clearance = { key: string; message: string; from: string; since: string; clearedAt: string; by: string; reason: string };
  const [latched, setLatched] = useState<Latched[]>([]);
  const [cleared, setCleared] = useState<Clearance[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [clearBy, setClearBy] = useState<Record<string, string>>({});
  const [clearWhy, setClearWhy] = useState<Record<string, string>>({});
  const [clearConfirm, setClearConfirm] = useState<Record<string, boolean>>({});
  const [clearErr, setClearErr] = useState<Record<string, string>>({});
  useEffect(() => {
    const read = () => {
      const s = readStore();
      if (s.unreadable) {
        // Never restore a supposedly cleared diagnosis from a record that cannot be read.
        setLatched((l) => mergeLatched(l, [UNREADABLE_STOP()], []));
        return;
      }
      if (s.raw) setRaw((r) => ({ ...s.raw, ...r }));
      setCleared((c) => mergeCleared(c, s.cleared));
      setLatched((l) => mergeLatched(l, s.latched, s.cleared));
    };
    try { localStorage.getItem(GD_STORE); } catch { setStorageOk(false); setLoaded(true); return; }
    read();
    const onStorage = (e: StorageEvent) => { if (e.key === GD_STORE) read(); };
    addEventListener('storage', onStorage);
    setLoaded(true);
    return () => removeEventListener('storage', onStorage);
  }, []);
  // Every STOP computed on any tab is latched.
  const liveStops = useMemo(() => FAMILIES.flatMap((f) =>
    diagnose(f, toAnswers(f, raw[f.id] ?? {})).stops.filter((s) => s.level === 'STOP').map((s) => ({ key: `${f.id}|${s.message}`, message: s.message, from: f.title }))), [raw]);
  useEffect(() => {
    if (!loaded) return;
    const add = liveStops.filter((s) => !latched.some((l) => l.key === s.key));
    if (add.length) setLatched((l) => [...l, ...add.map((s) => ({ ...s, since: new Date().toISOString() }))]);
  }, [liveStops, loaded, latched]);
  useEffect(() => {
    if (!loaded) return;
    try {
      // Merge with what another window may have stored: a STOP is never dropped by a write.
      const s = readStore();
      const mergedCleared = mergeCleared(cleared, s.unreadable ? [] : s.cleared);
      const mergedLatched = mergeLatched(latched, s.unreadable ? [] : s.latched, mergedCleared);
      localStorage.setItem(GD_STORE, JSON.stringify({ v: 2, raw, latched: mergedLatched, cleared: mergedCleared }));
    } catch { setStorageOk(false); }
  }, [raw, latched, cleared, loaded]);
  const recordClearance = (l: Latched) => {
    if (liveStops.some((s) => s.key === l.key)) { setClearErr((e) => ({ ...e, [l.key]: 'Not cleared: the answers entered still show this condition. Complete the required checks and update the answers first.' })); return; }
    const by = (clearBy[l.key] ?? '').trim();
    if (!by) { setClearErr((e) => ({ ...e, [l.key]: 'Not cleared: enter the name or initials of the qualified technician recording the clearance.' })); return; }
    const reason = (clearWhy[l.key] ?? '').trim();
    if (reason.length < 10) { setClearErr((e) => ({ ...e, [l.key]: 'Not cleared: state what was found and what was done (at least 10 characters).' })); return; }
    if (!clearConfirm[l.key]) { setClearErr((e) => ({ ...e, [l.key]: 'Not cleared: confirm that the required checks were completed.' })); return; }
    setCleared((c) => [...c, { ...l, clearedAt: new Date().toISOString(), by: by.slice(0, 60), reason: reason.slice(0, 500) }]);
    setLatched((ls) => ls.filter((x) => x.key !== l.key));
    setClearErr((e) => ({ ...e, [l.key]: '' }));
  };

  const set = (q: string, v: string) => setRaw((r) => ({ ...r, [familyId]: { ...(r[familyId] ?? {}), [q]: v } }));
  const route = () => { const f = familyFor(symptom); if (f) setFamilyId(f.id); };
  const routed = symptom.trim() ? familyFor(symptom) : null;
  const next = result.nextQuestion;
  // Safety hotfix (2026-11-25, independent review F1): while a STOP applies, no further
  // check or action is suggested. Several suggested checks need the engine running,
  // cranking or live circuits (e.g. a cylinder cut-out test under "STOP THE SET"), which
  // contradicts the STOP. Causes stay listed for information only.
  // Active = any STOP computed now (on any tab) or any latched STOP not yet cleared by record.
  const stopActive = result.stops.some((s) => s.level === 'STOP') || otherStops.length > 0 || latched.length > 0;
  // Latched STOPs whose condition is no longer computed are still shown (they are not cleared).
  const latchedOnly = latched.filter((l) => !liveStops.some((s) => s.key === l.key));
  const STOP_HOLD = 'Further checks are withheld while a STOP applies. Make the set safe first: engine stopped, isolated and locked off. A qualified technician decides the next step once the hazard is controlled.';

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
        <h3 className="text-lg font-semibold text-amber-300">Guided Diagnosis</h3>
        <p className="text-xs text-slate-400">Answer what you have measured or seen. The list re-ranks after each answer and suggests the next check. Safety stops always show first.</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input aria-label="Describe the symptom" placeholder="Describe the symptom, e.g. cranks but will not start" value={symptom}
            onChange={(e) => setSymptom(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && route()}
            className="flex-1 rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-sm text-white" />
          <button type="button" onClick={route} className="rounded-md bg-amber-600 hover:bg-amber-500 px-3 py-1.5 text-sm font-medium text-white">Find fault family</button>
        </div>
        {symptom.trim() && !routed ? <p className="text-xs text-slate-400">No matching fault family; choose one below.</p> : null}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Fault family">
          {FAMILIES.map((f) => (
            <button key={f.id} type="button" role="tab" aria-selected={f.id === familyId} onClick={() => setFamilyId(f.id)}
              className={`rounded-full px-3 py-1 text-xs border ${f.id === familyId ? 'border-amber-400 bg-amber-500/20 text-amber-200' : 'border-slate-700 text-slate-300 hover:border-slate-500'}`}>
              {f.title}
            </button>
          ))}
        </div>
      </div>

      {!storageOk && !stopActive ? (
        <p data-testid="gd-storage-blocked" role="status" className="rounded-lg border border-amber-500/60 bg-amber-950/40 p-3 text-xs text-amber-100">
          This browser does not allow the safety record to be saved: a STOP shown here cannot be kept after a reload. Record any STOP on the job card.
        </p>
      ) : null}
      {(result.stops.length > 0 || otherStops.length > 0 || latched.length > 0) && (
        <div role="alert" className="space-y-2">
          {latchedOnly.map((l) => (
            <div key={`l${l.key}`} data-testid="gd-latched-stop" className="rounded-lg border p-3 text-sm border-red-500 bg-red-950/60 text-red-100">
              <strong>STOP (still active until a clearance is recorded)</strong> · (from the {l.from} tab, since {l.since.slice(0, 16).replace('T', ' ')} UTC) {l.message}
            </div>
          ))}
          {otherStops.map((s, i) => (
            <div key={`o${i}`} className="rounded-lg border p-3 text-sm border-red-500 bg-red-950/60 text-red-100">
              <strong>STOP</strong> · (from the {s.from} tab) {s.message}
            </div>
          ))}
          {result.stops.map((s, i) => (
            <div key={i} className={`rounded-lg border p-3 text-sm ${s.level === 'STOP' ? 'border-red-500 bg-red-950/60 text-red-100' : 'border-amber-500/60 bg-amber-950/40 text-amber-100'}`}>
              <strong>{s.level}</strong> · {s.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
          {stopActive ? (
            <div data-testid="gd-stop-hold" className="rounded-lg border border-red-500 bg-red-950/60 p-3 text-xs text-red-100 space-y-3">
              <p>{STOP_HOLD}</p>
              {!storageOk ? <p data-testid="gd-storage-warning">This browser cannot keep the STOP after a reload: record it on the job card.</p> : null}
              {latched.map((l) => (
                <div key={`c${l.key}`} className="rounded-md border border-red-400/50 p-2 space-y-1" data-testid="gd-clearance">
                  <p className="font-semibold">Record STOP clearance: {l.from}</p>
                  <p data-testid="gd-not-restart">{CLEARANCE_NOT_RESTART}</p>
                  <label className="block">Name or initials of the qualified technician
                    <input value={clearBy[l.key] ?? ''} onChange={(e) => setClearBy((b) => ({ ...b, [l.key]: e.target.value }))}
                      className="mt-1 w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-white" />
                  </label>
                  <label className="block">Clearance reason: what was found and what was done
                    <textarea value={clearWhy[l.key] ?? ''} onChange={(e) => setClearWhy((b) => ({ ...b, [l.key]: e.target.value }))} rows={2}
                      className="mt-1 w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-white" />
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" checked={!!clearConfirm[l.key]} onChange={(e) => setClearConfirm((c) => ({ ...c, [l.key]: e.target.checked }))} />
                    <span>The required checks for this STOP were completed. I understand this does not authorise restarting the generator.</span>
                  </label>
                  <button type="button" onClick={() => recordClearance(l)} className="rounded bg-red-700 px-2 py-1 text-white">Record STOP clearance</button>
                  {clearErr[l.key] ? <p role="status" className="text-red-200">{clearErr[l.key]}</p> : null}
                </div>
              ))}
            </div>
          ) : next ? (
            <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
              <div className="text-xs text-amber-300 mb-2">Next check</div>
              <QuestionInput q={next} value={values[next.id] ?? ''} onChange={(v) => set(next.id, v)} />
            </div>
          ) : <p className="text-xs text-slate-400">All questions answered.</p>}
          {result.invalid.map((i) => <p key={i.q} className="text-xs text-red-300">Refused: {i.reason}</p>)}
          <details>
            <summary className="cursor-pointer text-xs text-slate-300">All questions ({result.answered}/{family.questions.length} answered){stopActive ? ': only to correct an answer already entered' : ''}</summary>
            {stopActive ? <p data-testid="gd-stop-questions-warning" className="mt-2 text-xs text-red-200">A STOP applies: do not take any reading that needs the engine running, cranking or live circuits.</p> : null}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {family.questions.map((q) => <QuestionInput key={q.id} q={q} value={values[q.id] ?? ''} onChange={(v) => set(q.id, v)} />)}
            </div>
          </details>
          <button type="button" onClick={() => setRaw((r) => ({ ...r, [familyId]: {} }))} className="text-xs text-slate-400 underline">Clear answers</button>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
          <div className="text-xs text-slate-400">Likely causes, most supported first{stopActive ? ' (for information only: no checks are suggested while a STOP applies)' : ''}</div>
          <ol className="space-y-2">
            {result.ranked.map((c, i) => (
              <li key={c.id} className="rounded-lg border border-slate-700 p-3">
                <div className="flex justify-between gap-2 text-sm text-white"><span>{i + 1}. {c.title}</span><span className="text-slate-500 text-xs">evidence {c.score >= 0 ? '+' : ''}{c.score}</span></div>
                {c.for.length > 0 && <ul className="mt-1 text-xs text-emerald-300">{c.for.map((f) => <li key={f}>+ {f}</li>)}</ul>}
                {c.against.length > 0 && <ul className="mt-1 text-xs text-slate-400">{c.against.map((f) => <li key={f}>− {f}</li>)}</ul>}
                {!stopActive && i < 3 && c.score > 0 && (
                  <ul className="mt-2 list-disc pl-4 text-xs text-slate-200">{c.actions.map((a) => <li key={a}>{a}</li>)}</ul>
                )}
                <p className="mt-1 text-[11px] text-slate-500">{c.reference}</p>
              </li>
            ))}
          </ol>
          {result.excluded.length > 0 && (
            <details>
              <summary className="cursor-pointer text-xs text-slate-400">Ruled out ({result.excluded.length})</summary>
              <ul className="mt-2 text-xs text-slate-400">{result.excluded.map((e) => <li key={e.id}>{e.title}: {e.because}</li>)}</ul>
            </details>
          )}
        </div>
      </div>
      {cleared.length > 0 && (
        <details data-testid="gd-clearance-record" className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-xs text-slate-300">
          <summary className="cursor-pointer">STOP clearance record ({cleared.length}), UNVERIFIED, kept in this browser only</summary>
          <p className="mt-2 text-amber-200">{CLEARANCE_NOT_RESTART}</p>
          <ul className="mt-2 space-y-1">{cleared.map((c, i) => <li key={i}>UNVERIFIED · {c.clearedAt.slice(0, 16).replace('T', ' ')} UTC · recorded by {c.by} (not authenticated) · fault: {c.from}: {c.message} · reason: {c.reason || '(not recorded)'}</li>)}</ul>
        </details>
      )}
      <p className="text-[11px] text-slate-500">{result.disclaimer} Content status: {result.review}. {result.engineVersion}.</p>
    </div>
  );
}
