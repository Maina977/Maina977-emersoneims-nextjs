'use client';

/**
 * Guided fault-finding (P1-A). Deterministic: lib/generator-oracle/diagnostics.
 * Stop rules are shown first and cannot be hidden; readings outside the
 * physical range are refused with the reason; machine limits come from the
 * OEM manual entered by the technician, never from defaults. Every OEM limit
 * asks whether it is a warning or a shutdown value and where it comes from;
 * equality with a limit counts as reaching it.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { FAMILIES, familyFor } from '@/lib/generator-oracle/diagnostics/families';
import { diagnosisRecord, refQuestions } from '@/lib/generator-oracle/diagnostics/jobCardRecord';
import { knownModels, publishedLimitFor, questionReferenceNote, referencesFor, type Equipment } from '@/lib/generator-oracle/diagnostics/oemReferences';
import { classKey, limitReadings, sourceKey, tolKey } from '@/lib/generator-oracle/diagnostics/engine';
import { loadGuidedEquipment, loadGuidedSession, mergedRaw, saveGuidedSession, type RawAnswers } from '@/lib/generator-oracle/diagnostics/session';
import { SCREEN_BUCKET, SCREEN_QUESTIONS, isScreenKey } from '@/lib/generator-oracle/diagnostics/safetyScreen';
import { publishedEntryOf } from '@/lib/generator-oracle/diagnostics/oemReferences';
import { LIMIT_CLASS_OPTIONS, type Question } from '@/lib/generator-oracle/diagnostics/types';

const getStore = (): Storage | null => { try { return window.localStorage; } catch { return null; } };
const field = 'w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-sm text-white focus:border-amber-500 outline-none';

interface QProps {
  q: Question; values: Record<string, string>; set: (k: string, v: string) => void; scope: string;
  stopActive: boolean; note?: string; tolerance: boolean; protective: boolean;
  published: { value: number; classification: 'shutdown' | 'warning'; source: string } | null;
}

function QuestionInput({ q, values, set, scope, stopActive, note, tolerance, protective, published }: QProps) {
  const id = `gd-${scope}-${q.id.replace(/\./g, '-')}`;
  const value = values[q.id] ?? '';
  const limit = q.kind === 'number' ? q.oemLimit : undefined;
  return (
    <div className="block text-xs text-slate-300">
      <label htmlFor={id} className="block mb-1">
        {q.text}
        {q.kind === 'number' ? <span className="text-slate-500"> ({q.unit})</span> : null}
      </label>
      {q.kind === 'number' ? (
        <input id={id} inputMode="decimal" value={value} onChange={(e) => set(q.id, e.target.value)} className={field} />
      ) : (
        <select id={id} value={value} onChange={(e) => set(q.id, e.target.value)} className={field}>
          <option value="">Not answered</option>
          {q.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}
      {q.help ? <span className="block mt-1 text-slate-500">{q.help}</span> : null}
      {note ? <span className="block mt-1 text-cyan-300">{note}</span> : null}
      {q.needsRunning && stopActive ? <span className="block mt-1 text-red-300">Needs the engine running: do not run it to answer this while a STOP is active. Enter only what was seen before the stop.</span> : null}
      {limit ? (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className="block">Is this a warning or a shutdown value?
            <select aria-label={`Classification: ${limit.parameter}`} value={values[classKey(q.id)] ?? ''} onChange={(e) => set(classKey(q.id), e.target.value)} className={`mt-1 ${field}`}>
              <option value="">Not answered (treated as not stated)</option>
              {LIMIT_CLASS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label className="block">Source: manual ID, revision, page
            <input aria-label={`Source: ${limit.parameter}`} value={values[sourceKey(q.id)] ?? ''} onChange={(e) => set(sourceKey(q.id), e.target.value)} className={`mt-1 ${field}`} />
          </label>
          {value && (!values[classKey(q.id)] || values[classKey(q.id)] === 'not-stated') ? (
            <span className="sm:col-span-2 text-amber-300">{protective
              ? 'Classification not stated: this is a protective limit, so reaching it gives a conservative software STOP (not a manufacturer instruction) until a qualified technician confirms the manufacturer limits.'
              : 'Classification not stated: reaching this value is shown as CAUTION, not as a confirmed shutdown, and does not clear any STOP.'}</span>
          ) : null}
          {published ? (
            <button type="button" className="sm:col-span-2 rounded-md border border-cyan-600 px-2 py-1 text-left text-cyan-200"
              onClick={() => { set(q.id, String(published.value)); set(classKey(q.id), published.classification); set(sourceKey(q.id), published.source); }}>
              Use published value for the selected model: {published.value} {q.kind === 'number' ? q.unit : ''} ({published.classification}) — check the variant matches this set
            </button>
          ) : null}
        </div>
      ) : null}
      {tolerance && q.kind === 'number' ? (
        <label className="block mt-2">Measurement tolerance ± ({q.unit}; from the instrument or sensor data, optional)
          <input aria-label={`Tolerance: ${q.text}`} inputMode="decimal" value={values[tolKey(q.id)] ?? ''} onChange={(e) => set(tolKey(q.id), e.target.value)} className={`mt-1 ${field}`} />
        </label>
      ) : null}
    </div>
  );
}

const LIMIT_LABEL = { 'not-verified': 'NOT VERIFIED', inside: 'INSIDE LIMIT', near: 'AT OR NEAR THE LIMIT', reached: 'LIMIT REACHED' } as const;

export default function GuidedDiagnosisPanel() {
  const [familyId, setFamilyId] = useState(FAMILIES[0].id);
  const [symptom, setSymptom] = useState('');
  const [raw, setRaw] = useState<RawAnswers>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const dirty = useRef(false);
  const family = FAMILIES.find((f) => f.id === familyId)!;
  // This family's answers with the shared safety screen merged in (the screen is answered once for all families).
  const values = mergedRaw(raw, familyId);

  // The answers are kept in browser storage so a job card can record the same diagnosis.
  const [equipment, setEquipment] = useState<Equipment>({});
  useEffect(() => { setRaw(loadGuidedSession(getStore(), FAMILIES)); setEquipment(loadGuidedEquipment(getStore())); }, []);
  useEffect(() => { if (dirty.current) setSaveError(saveGuidedSession(getStore(), raw, equipment)); }, [raw, equipment]);
  const set = (q: string, v: string) => {
    dirty.current = true;
    const bucket = isScreenKey(q) ? SCREEN_BUCKET : familyId;
    setRaw((r) => ({ ...r, [bucket]: { ...(r[bucket] ?? {}), [q]: v } }));
  };
  const setEq = (k: keyof Equipment, v: string) => {
    dirty.current = true;
    setEquipment((e) => ({ ...e, [k]: v || undefined }));
    // Safety review F7: a published model-specific limit is cleared as soon as the equipment changes.
    setRaw((r) => {
      const next: RawAnswers = {};
      for (const [fid, ans] of Object.entries(r)) {
        const a = { ...ans };
        for (const key of Object.keys(a)) {
          if (!key.endsWith('.source') || !publishedEntryOf(a[key])) continue;
          const lim = key.slice(0, -'.source'.length);
          delete a[key]; delete a[lim]; delete a[`${lim}.class`];
        }
        next[fid] = a;
      }
      return next;
    });
  };
  const oemQs = useMemo(() => refQuestions(family), [family]);
  const readingsWithTol = useMemo(() => limitReadings(family), [family]);
  const familyRefs = referencesFor(equipment, family.id);

  // Same function as the job-card record and the .txt download, so all three agree.
  const record = useMemo(() => diagnosisRecord(family, values, equipment, raw), [family, values, equipment, raw]);
  const result = record.result;

  const qProps = (q: Question, scope: string): QProps => ({
    q, values, set, scope, stopActive: result.stopActive, tolerance: readingsWithTol.has(q.id),
    protective: (family.limits ?? []).some((l) => l.limit === q.id && l.protective),
    note: oemQs.has(q.id) ? questionReferenceNote(equipment, family.id, q.id) : undefined,
    published: oemQs.has(q.id) ? publishedLimitFor(equipment, family.id, q.id) : null,
  });
  const download = () => {
    const url = URL.createObjectURL(new Blob([`${record.findings}\n`], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url; a.download = `guided-diagnosis-${family.id}.txt`; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const route = () => { const f = familyFor(symptom); if (f) setFamilyId(f.id); };
  const routed = symptom.trim() ? familyFor(symptom) : null;
  const next = result.nextQuestion;

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
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block text-xs text-slate-300">Engine model (for published references; optional)
            <select value={equipment.engine ?? ''} onChange={(e) => setEq('engine', e.target.value)} className={`mt-1 ${field}`}>
              <option value="">Not listed / not selected</option>
              {knownModels('engine').map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <label className="block text-xs text-slate-300">Controller model (for published references; optional)
            <select value={equipment.controller ?? ''} onChange={(e) => setEq('controller', e.target.value)} className={`mt-1 ${field}`}>
              <option value="">Not listed / not selected</option>
              {knownModels('controller').map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {([['manufacturer', 'Manufacturer (as on the plate)'], ['model', 'Model (as on the plate)'], ['variant', 'Variant / configuration']] as const).map(([k, label]) => (
            <label key={k} className="block text-xs text-slate-300">{label}
              <input value={equipment[k] ?? ''} onChange={(e) => setEq(k, e.target.value)} className={`mt-1 ${field}`} />
            </label>
          ))}
        </div>
        <p className="text-[11px] text-slate-500">Published figures are shown only for the exact model selected. They are never entered for you: type and confirm every limit for the set in front of you, or press “Use published value” for that exact model. Any other model: per OEM manual — NOT VERIFIED. Every limit you enter is recorded as applying only to the manufacturer, model and variant typed here.</p>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Fault family">
          {FAMILIES.map((f) => (
            <button key={f.id} type="button" role="tab" aria-selected={f.id === familyId} onClick={() => setFamilyId(f.id)}
              className={`rounded-full px-3 py-1 text-xs border ${f.id === familyId ? 'border-amber-400 bg-amber-500/20 text-amber-200' : 'border-slate-700 text-slate-300 hover:border-slate-500'}`}>
              {f.title}
            </button>
          ))}
        </div>
      </div>

      <div data-testid="safety-screen" className="rounded-xl border border-red-700/60 bg-red-950/20 p-4 space-y-2">
        <div className="text-sm font-semibold text-red-200">Safety screen — answered once, applies to every fault family</div>
        <p className="text-xs text-slate-400">Any “Yes” is a STOP on every tab and on every job card made from this session.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SCREEN_QUESTIONS.map((q) => <QuestionInput key={q.id} {...qProps(q, 'screen')} />)}
        </div>
        <button type="button" onClick={() => { dirty.current = true; setRaw((r) => ({ ...r, [SCREEN_BUCKET]: {} })); }} className="text-xs text-slate-400 underline">Clear safety screen</button>
      </div>

      {result.stops.length > 0 && (
        <div role="alert" data-testid="safety-messages" className="space-y-2">
          {result.stops.map((s, i) => (
            <div key={i} className={`rounded-lg border p-3 text-sm ${s.level === 'STOP' ? 'border-red-500 bg-red-950/60 text-red-100' : 'border-amber-500/60 bg-amber-950/40 text-amber-100'}`}>
              <strong>{s.level}</strong> · {s.message}
              {s.label ? <p className="mt-1 text-xs italic opacity-90">{s.label}</p> : null}
              {s.from ? <p className="mt-1 text-xs opacity-80">Raised in the “{s.from}” diagnosis of this session.</p> : null}
            </div>
          ))}
        </div>
      )}

      {result.limits.length > 0 && (
        <div data-testid="limit-status" className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-slate-200">Limit checks (equality counts as reaching the limit)</div>
          <ul className="space-y-1">
            {result.limits.map((l) => (
              <li key={l.id} className={l.level === 'STOP' ? 'text-red-200' : l.level === 'CAUTION' ? 'text-amber-200' : 'text-slate-300'}>
                <strong>{LIMIT_LABEL[l.status]}{l.status === 'reached' && l.level ? ` (${l.level})` : ''}</strong> · {l.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
          {next ? (
            <div data-testid="next-check" className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
              <div className="text-xs text-amber-300 mb-2">Next check</div>
              <QuestionInput {...qProps(next, 'next')} />
            </div>
          ) : <p data-testid="next-check" className="text-xs text-slate-400">{result.stopActive ? 'No further check is offered while a STOP is active, other than the stopped-and-isolated checks listed.' : 'All questions answered.'}</p>}
          {result.runningWithheld ? <p className="text-xs text-red-300">Checks that need the engine running are withheld{result.stopActive ? ' while a STOP is active' : ' because a leading cause says do not run'}.</p> : null}
          {result.invalid.map((i) => <p key={i.q} className="text-xs text-red-300">Refused: {i.reason}</p>)}
          <details>
            <summary className="cursor-pointer text-xs text-slate-300">All questions ({result.answered}/{family.questions.length} answered, safety screen included)</summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {family.questions.filter((q) => !isScreenKey(q.id)).map((q) => <QuestionInput key={q.id} {...qProps(q, 'all')} />)}
            </div>
          </details>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => { dirty.current = true; setRaw((r) => ({ ...r, [familyId]: {} })); }} className="text-xs text-slate-400 underline">Clear answers</button>
            <button type="button" onClick={download} className="text-xs text-amber-300 underline">Download this diagnosis (.txt)</button>
          </div>
          <p className="text-[11px] text-slate-500">To record it on a job card: Service &amp; Job Cards → Job cards → open the card → “Record a guided diagnosis”. The card gets exactly this result.</p>
          {saveError ? <p className="text-xs text-amber-300">{saveError}</p> : null}
        </div>

        <div data-testid="ranked-causes" className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
          <div className="text-xs text-slate-400">Likely causes, most supported first</div>
          <ol className="space-y-2">
            {result.ranked.map((c, i) => (
              <li key={c.id} className="rounded-lg border border-slate-700 p-3">
                <div className="flex justify-between gap-2 text-sm text-white"><span>{i + 1}. {c.title}</span><span className="text-slate-500 text-xs">evidence {c.score >= 0 ? '+' : ''}{c.score}</span></div>
                {c.for.length > 0 && <ul className="mt-1 text-xs text-emerald-300">{c.for.map((f) => <li key={f}>+ {f}</li>)}</ul>}
                {c.against.length > 0 && <ul className="mt-1 text-xs text-slate-400">{c.against.map((f) => <li key={f}>− {f}</li>)}</ul>}
                {i < 3 && c.score > 0 && (
                  <ul className="mt-2 list-disc pl-4 text-xs text-slate-200">{c.actions.map((a) => <li key={a}>{a}</li>)}</ul>
                )}
                {i < 3 && c.score > 0 && c.withheld.length > 0 && (
                  <p className="mt-1 text-xs text-red-300">Withheld while a STOP is active: {c.withheld.length} check(s) that need the engine running.</p>
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
      {familyRefs.length > 0 && (
        <div data-testid="published-references" className="rounded-xl border border-cyan-700/60 bg-cyan-950/30 p-3 text-xs text-cyan-100 space-y-1">
          <div className="font-semibold">Published references for the selected equipment (context only; used as a limit only when you press “Use published value”)</div>
          <ul className="list-disc pl-4 space-y-1">{familyRefs.map((r) => <li key={r.entry.id}>{r.text}</li>)}</ul>
        </div>
      )}
      {family.references?.length ? (
        <ul className="text-[11px] text-slate-500 list-disc pl-4">{family.references.map((r) => <li key={r}>{r}</li>)}</ul>
      ) : null}
      <p className="text-[11px] text-slate-500">{result.disclaimer} Content status: {result.review}. {result.engineVersion}.</p>
    </div>
  );
}
