import React, { useEffect, useMemo, useRef, useState } from 'react';
import { simulateHourly, type HourlyResult } from '@/lib/solar/design/hourly';
import { simulateHybrid, type HybridResult } from '@/lib/solar/design/hybrid';
import type { Proposal } from '@/lib/solar/design/proposal';
import type { Check } from '@/lib/solar/design/validate';
import { proposalRevisionHash, APPROVAL_LOCKED_NOTICE } from '@/lib/solar/design/proposalApproval';
import {
  buildHourlyInput, buildHybridInput, formToProposalInput, hybridRequested, lastFullYear, parseLoadCsv,
  EMPTY_BOM_ROW, LOSSES_SOURCE, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_PRODUCTION,
  type BomRow, type ProposalForm, type WeatherOk,
} from '@/lib/solar/design/proposalForm';
import {
  clearDraft, loadDraft, projectFileName, readProject, saveDraft, serializeProject,
  MAX_PROJECT_BYTES, SAVED_HERE_ONLY_NOTE, SIGN_OFFS_NOT_RESTORED, type SavedProduction, type SavedProject,
} from '@/lib/solar/design/proposalSave';

/**
 * Proposal (P1, 2026-11-20). Design-to-proposal workflow: datasheets with
 * provenance → array design → hourly simulation on fetched weather → optional
 * hybrid balance → priced bill of materials → sourced finance inputs → the
 * proposal from /api/solar/proposal (engine: lib/solar/design/proposal.ts),
 * with Excel and PDF downloads. Every field starts empty; nothing is assumed.
 * There are no approval inputs: approval needs an authenticated, authorised
 * reviewer (lib/solar/design/proposalApproval.ts), which does not exist yet,
 * so every proposal is DRAFT. The revision hash of the inputs is shown.
 * Saved projects (2026-11-21, lib/solar/design/proposalSave.ts): the draft is
 * autosaved in this browser and can be saved to / opened from a .json file.
 * Saved data never restores a datasheet sign-off or an approval; everything
 * is recomputed after a restore or import.
 */

type FieldKind = 'text' | 'date' | 'check' | 'yesno';
type Field = [key: string, label: string, unit: string, kind?: FieldKind];
type Group = { id: string; title: string; note?: string; items: Field[] };

const prov = (p: string): Field[] => [
  [`${p}.manufacturer`, 'Manufacturer', ''], [`${p}.datasheetUrl`, 'Datasheet URL (https)', ''], [`${p}.datasheetRevision`, 'Datasheet revision', ''],
  [`${p}.datasheetDate`, 'Datasheet date', '', 'date'], [`${p}.enteredBy`, 'Entered by', ''], [`${p}.enteredOn`, 'Entered on', '', 'date'],
];
const verification = (p: string): Field[] => [[`${p}.verified`, 'Verified against the datasheet by a second person', '', 'check'], [`${p}.verifiedBy`, 'Verified by', ''], [`${p}.verifiedOn`, 'Verified on', '', 'date']];

const GROUPS: Group[] = [
  { id: 'client', title: 'Client and site', items: [['ref', 'Proposal reference', ''], ['c.name', 'Client name', ''], ['c.address', 'Site address', ''], ['c.lat', 'Latitude', '°'], ['c.lon', 'Longitude', '°']] },
  { id: 'module', title: 'Module (datasheet)', items: [...prov('m'), ['m.model', 'Model', ''], ['m.pmaxW', 'Pmax', 'W'], ['m.vocV', 'Voc', 'V'], ['m.iscA', 'Isc', 'A'], ['m.vmpV', 'Vmp', 'V'], ['m.impA', 'Imp', 'A'], ['m.betaVocPct', 'β Voc', '%/°C'], ['m.betaVmpPct', 'β Vmp', '%/°C'], ['m.alphaIscPct', 'α Isc', '%/°C'], ['m.gammaPmaxPct', 'γ Pmax', '%/°C'], ['m.noctC', 'NOCT', '°C'], ['m.maxSystemV', 'Max system voltage', 'V'], ['m.maxSeriesFuseA', 'Max series fuse', 'A'], ...verification('m')] },
  { id: 'inverter', title: 'Inverter (datasheet)', items: [...prov('i'), ['i.model', 'Model', ''], ['i.acKw', 'AC power', 'kW'], ['i.nominalEfficiency', 'Nominal efficiency (0–1)', ''], ['i.maxDcV', 'Max DC voltage', 'V'], ['i.mpptMinV', 'MPPT min', 'V'], ['i.mpptMaxV', 'MPPT max', 'V'], ['i.mpptCount', 'MPPTs', 'No'], ['i.maxInputA', 'Max input current per MPPT', 'A'], ['i.maxIscA', 'Max Isc per MPPT', 'A'], ['i.batteryMaxDischargeKw', 'Battery discharge power (optional)', 'kW'], ['i.batteryMaxChargeKw', 'Battery charge power (optional)', 'kW'], ['i.generatorCompatibility', 'Generator compatibility statement (optional)', ''], ...verification('i')] },
  { id: 'battery', title: 'Battery (optional, datasheet)', note: 'Leave empty for a system without a battery.', items: [...prov('b'), ['b.model', 'Model', ''], ['b.nominalKwh', 'Nominal energy per unit', 'kWh'], ['b.usableDoD', 'Usable DoD (0–1)', ''], ['b.dischargeEfficiency', 'Discharge efficiency (0–1)', ''], ['b.maxDischargeC', 'Max discharge', 'C'], ['b.maxChargeC', 'Max charge', 'C'], ['b.units', 'Units', 'No'], ['b.requiredUsableAcKwh', 'Energy needed from the battery per cycle', 'kWh'], ...verification('b')] },
  { id: 'design', title: 'Array design', items: [['d.modulesPerString', 'Modules per string', 'No'], ['d.stringsPerMppt', 'Strings on each MPPT (e.g. 1,1)', ''], ['d.inverterCount', 'Inverter count', 'No'], ['d.tilt', 'Tilt', '°'], ['d.azimuth', 'Azimuth (0 = N, 180 = S)', '°'], ['d.albedo', 'Ground albedo (optional; blank = 0.2)', '']] },
  { id: 'temps', title: 'Site temperatures', items: [['t.recordLowC', 'Site record low', '°C'], ['t.maxAmbientC', 'Max ambient while generating', '°C'], ['t.source', 'Source of these temperatures', '']] },
  { id: 'cable', title: 'Cable run (optional)', note: 'Values from IEC 60364-5-52 for the installation method. Leave empty to skip.', items: [['k.name', 'Name', ''], ['k.lengthM', 'One-way length', 'm'], ['k.csaMm2', 'Cross-section', 'mm²'], ['k.designCurrentA', 'Design current', 'A'], ['k.systemV', 'System voltage', 'V'], ['k.tabulatedAmpacityA', 'Tabulated ampacity It', 'A'], ['k.ambientFactor', 'Ambient factor Ca', ''], ['k.groupingFactor', 'Grouping factor Cg', ''], ['k.maxDropPct', 'Max voltage drop', '%']] },
];
const HYBRID_GROUPS: Group[] = [
  { id: 'hb', title: 'Hybrid battery (optional)', items: [['hb.usableKwh', 'Usable energy', 'kWh'], ['hb.maxChargeKw', 'Max charge power', 'kW'], ['hb.maxDischargeKw', 'Max discharge power', 'kW'], ['hb.roundTripEfficiency', 'Round-trip efficiency (0.5–1)', ''], ['hb.minSocFrac', 'Minimum SOC (0–1)', ''], ['hb.initialSocFrac', 'Initial SOC (0–1)', ''], ['hb.source', 'Source (datasheet)', '']] },
  { id: 'hg', title: 'Grid (optional)', items: [['hg.exportAllowed', 'Export allowed', '', 'yesno'], ['hg.importLimitKw', 'Import limit (optional)', 'kW'], ['hg.exportLimitKw', 'Export limit (optional)', 'kW'], ['hg.source', 'Source (utility agreement, outage record)', '']] },
  { id: 'hgen', title: 'Generator (optional)', items: [['hgen.ratedKw', 'Rated power', 'kW'], ['hgen.minLoadFrac', 'Minimum load (0–1)', ''], ['hgen.fuelA', 'Fuel coefficient a', 'L/h per kW rated'], ['hgen.fuelB', 'Fuel coefficient b', 'L/kWh'], ['hgen.fuelCurveSource', 'Fuel curve source (datasheet)', '']] },
];
const sourcedRow = (k: string, label: string, unit: string): Field[] => [[`f.${k}`, label, unit], [`f.${k}Source`, `Source of ${label.toLowerCase()}`, '']];
const FINANCE: Group = { id: 'finance', title: 'Finance (each value with its source)', note: 'Use the customer\'s own bill or tariff schedule and the module warranty. Nothing is filled in for you.', items: [
  ...sourcedRow('tariff', 'Tariff', 'KES/kWh'), ...sourcedRow('exportTariff', 'Export tariff (optional; only with an export agreement)', 'KES/kWh'),
  ...sourcedRow('escalation', 'Tariff escalation', '%/yr'), ...sourcedRow('discount', 'Discount rate', '%'), ...sourcedRow('degradation', 'Degradation', '%/yr'),
  ...sourcedRow('om', 'O&M', 'KES/yr'), ...sourcedRow('selfConsumed', 'Self-consumed fraction (0–1; used when there is no hybrid balance)', ''),
  ['f.lifetime', 'Lifetime', 'years'],
] };

const colour: Record<Check['verdict'], string> = { PASS: '#22c55e', WARN: '#f59e0b', REFUSE: '#ef4444' };
const statusColour: Record<Proposal['status'], string> = { REFUSED: '#ef4444', DRAFT: '#f59e0b', 'FOR ISSUE': '#22c55e' };
const box: React.CSSProperties = { background: 'rgba(15,23,42,0.7)', border: '1px solid #334155', borderRadius: 12, padding: 16 };
const inputStyle: React.CSSProperties = { display: 'block', width: '100%', marginTop: 4, padding: '6px 8px', borderRadius: 6, border: '1px solid #475569', background: '#0f172a', color: '#fff' };
const btn: React.CSSProperties = { padding: '6px 12px', borderRadius: 8, border: '1px solid #475569', background: '#1e293b', color: '#e2e8f0', cursor: 'pointer' };
const primary: React.CSSProperties = { ...btn, background: '#b45309', border: '1px solid #f59e0b', color: '#fff', fontWeight: 600 };
const th: React.CSSProperties = { textAlign: 'left', padding: '4px 6px', borderBottom: '1px solid #334155', color: '#94a3b8', fontWeight: 600 };
const td: React.CSSProperties = { padding: '4px 6px', borderBottom: '1px solid #1e293b', verticalAlign: 'top' };
const kes = (x: number | null | undefined) => (x === null || x === undefined ? 'rate required' : `KES ${Math.round(x).toLocaleString('en-KE')}`);

function Fieldset({ g, f, set }: { g: Group; f: ProposalForm; set: (k: string, v: string) => void }) {
  return (
    <fieldset style={box}>
      <legend style={{ fontWeight: 600, color: '#fbbf24', padding: '0 4px' }}>{g.title}</legend>
      {g.note ? <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 8px' }}>{g.note}</p> : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
        {g.items.map(([k, l, u, kind = 'text']) => kind === 'check' ? (
          <label key={k} style={{ fontSize: 12, color: '#cbd5e1', display: 'flex', gap: 6, alignItems: 'center', gridColumn: '1 / -1' }}>
            <input type="checkbox" checked={f[k] === 'yes'} onChange={(e) => set(k, e.target.checked ? 'yes' : '')} /> {l}
          </label>
        ) : (
          <label key={k} style={{ fontSize: 12, color: '#cbd5e1' }}>
            {l}{u ? <span style={{ color: '#64748b' }}> ({u})</span> : null}
            {kind === 'yesno' ? (
              <select value={f[k] ?? ''} onChange={(e) => set(k, e.target.value)} style={inputStyle}>
                <option value="">—</option><option value="yes">yes</option><option value="no">no</option>
              </select>
            ) : (
              <input type={kind === 'date' ? 'date' : 'text'} value={f[k] ?? ''} onChange={(e) => set(k, e.target.value)} inputMode={u ? 'decimal' : undefined} style={inputStyle} />
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** File text; FileReader where Blob.text() is missing (older Safari). */
function readText(file: File): Promise<string> {
  if (typeof file.text === 'function') return file.text();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ''));
    r.onerror = () => reject(r.error ?? new Error('read failed'));
    r.readAsText(file);
  });
}

async function postProposal(input: unknown, format: 'json' | 'xlsx' | 'pdf'): Promise<Response> {
  return fetch('/api/solar/proposal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input, format }) });
}
async function errorOf(r: Response): Promise<string> {
  const ct = r.headers.get('content-type') || '';
  if (ct.includes('application/json')) { const j = await r.json().catch(() => null); if (j?.error) return j.error; }
  return `HTTP ${r.status}`;
}

export default function ProposalPage() {
  const [f, setF] = useState<ProposalForm>({});
  const [bom, setBom] = useState<BomRow[]>([{ ...EMPTY_BOM_ROW }]);
  const [example, setExample] = useState(false);
  const [weather, setWeather] = useState<WeatherOk | null>(null);
  const [weatherMsg, setWeatherMsg] = useState('');
  const [busy, setBusy] = useState('');
  const [load, setLoad] = useState<number[] | null>(null);
  const [loadMsg, setLoadMsg] = useState('');
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [builtFor, setBuiltFor] = useState('');
  const [serverError, setServerError] = useState('');
  const set = (k: string, v: string) => setF((x) => ({ ...x, [k]: v }));
  const setRow = (i: number, k: keyof BomRow, v: string) => setBom((rows) => rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  const year = lastFullYear();

  const production = useMemo((): { result: HourlyResult | null; error: string } => {
    if (!weather) return { result: example ? WORKED_EXAMPLE_PRODUCTION : null, error: '' };
    const h = buildHourlyInput(f, weather);
    if (!h.input) return { result: null, error: h.errors.join('; ') };
    try { return { result: simulateHourly(h.input), error: '' }; } catch (e) { return { result: null, error: (e as Error).message }; }
  }, [f, weather, example]);

  const hybrid = useMemo((): { result: HybridResult | null; error: string } => {
    if (!hybridRequested(f) && !load) return { result: null, error: '' };
    const h = buildHybridInput(f, production.result?.hourlyAcKwh ?? [], load);
    if (!h.input) return { result: null, error: h.errors.join('; ') };
    try { return { result: simulateHybrid(h.input), error: '' }; } catch (e) { return { result: null, error: (e as Error).message }; }
  }, [f, load, production.result]);

  const mapped = useMemo(() => formToProposalInput(f, bom, production.result, hybrid.result), [f, bom, production.result, hybrid.result]);
  const inputKey = mapped.input ? JSON.stringify(mapped.input) : '';
  const revision = useMemo(() => (mapped.input ? proposalRevisionHash(mapped.input) : ''), [mapped.input]);
  const stale = proposal !== null && builtFor !== inputKey;

  // ---------------------------------------------------------------- saved project
  const [hydrated, setHydrated] = useState(false);
  const [autosavePaused, setAutosavePaused] = useState(false);
  const [restored, setRestored] = useState<{ savedAt: string; production: SavedProduction; stripped: string[] } | null>(null);
  const [storageMsg, setStorageMsg] = useState('');
  const [draftError, setDraftError] = useState('');
  const [lastSaved, setLastSaved] = useState('');
  const [opened, setOpened] = useState<{ name: string; savedAt: string; fileRevision: string | null; production: SavedProduction; stripped: string[] } | null>(null);
  const [openError, setOpenError] = useState('');
  const openInput = useRef<HTMLInputElement>(null);
  const savedProduction: SavedProduction = weather ? { kind: 'weather', label: weather.source } : example ? { kind: 'test-example', label: WORKED_EXAMPLE_PRODUCTION.assumptions[0] } : { kind: 'none', label: '' };
  const current: SavedProject = { form: f, bom, production: savedProduction };

  /** Put a restored or imported project on the page. Nothing computed is taken from it. */
  const applyProject = (p: SavedProject) => {
    setF(p.form); setBom(p.bom.length ? p.bom : [{ ...EMPTY_BOM_ROW }]); setExample(p.production.kind === 'test-example');
    setWeather(null); setWeatherMsg(''); setLoad(null); setLoadMsg(''); setProposal(null); setBuiltFor(''); setServerError('');
  };

  useEffect(() => {
    const r = loadDraft();
    if (r.status === 'restored') { applyProject(r.project); setRestored({ savedAt: r.savedAt, production: r.project.production, stripped: r.stripped }); }
    else if (r.status === 'blocked') setStorageMsg(r.message);
    else if (r.status === 'rejected') { setDraftError(r.message); if (r.reason === 'newer') setAutosavePaused(true); }
    setHydrated(true);
    // Runs once, on mount.
  }, []);

  const draftJson = JSON.stringify(current);
  useEffect(() => {
    if (!hydrated || autosavePaused) return;
    const t = setTimeout(() => {
      const r = saveDraft(JSON.parse(draftJson) as SavedProject, revision || null);
      if (r.ok) { setStorageMsg(''); setLastSaved(r.removed ? '' : r.savedAt); } else setStorageMsg(r.message);
    }, 400);
    return () => clearTimeout(t);
  }, [draftJson, revision, hydrated, autosavePaused]);

  const discardDraft = () => {
    if (typeof window !== 'undefined' && !window.confirm('Clear the draft saved in this browser and empty the form? Save a project file first if you want to keep it.')) return;
    const r = clearDraft();
    setStorageMsg(r.ok ? '' : r.message);
    setRestored(null); setDraftError(''); setAutosavePaused(false); setLastSaved(''); setOpened(null); setOpenError('');
    applyProject({ form: {}, bom: [{ ...EMPTY_BOM_ROW }], production: { kind: 'none', label: '' } });
  };

  const saveFile = () => {
    try {
      const url = URL.createObjectURL(new Blob([serializeProject(current, revision || null)], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = projectFileName(f.ref ?? ''); document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) { setOpenError(`The project file could not be prepared: ${(e as Error).message}`); }
  };

  const openFile = async (file: File | undefined) => {
    if (openInput.current) openInput.current.value = '';
    if (!file) return;
    setOpenError('');
    if (file.size > MAX_PROJECT_BYTES) { setOpenError(`Project file not opened: ${file.name} is larger than ${MAX_PROJECT_BYTES.toLocaleString('en-KE')} bytes, far more than a proposal project.`); return; }
    let text: string;
    try { text = await readText(file); } catch (e) { setOpenError(`Project file not opened: ${file.name} could not be read (${(e as Error).message}).`); return; }
    const r = readProject(text, 'file');
    if (!r.ok) { setOpenError(r.message.replace('Project file not opened', `Project file not opened (${file.name})`)); return; }
    applyProject(r.project); setRestored(null); setDraftError(''); setAutosavePaused(false);
    setOpened({ name: file.name, savedAt: r.savedAt, fileRevision: r.fileRevisionHash, production: r.project.production, stripped: r.stripped });
  };
  const when = (iso: string) => new Date(iso).toLocaleString('en-KE');

  const fetchWeather = async () => {
    const lat = Number(f['c.lat']), lon = Number(f['c.lon']);
    if (!(f['c.lat'] ?? '').trim() || !(f['c.lon'] ?? '').trim() || !Number.isFinite(lat) || !Number.isFinite(lon)) { setWeatherMsg('Enter the site latitude and longitude first.'); return; }
    setBusy('weather'); setWeatherMsg('');
    try {
      const r = await fetch(`/api/solar/hourly-weather?lat=${lat}&lon=${lon}&year=${year}`);
      const ct = r.headers.get('content-type') || '';
      if (!ct.includes('application/json')) { setWeatherMsg(`SERVICE UNAVAILABLE: HTTP ${r.status}`); return; }
      const j = await r.json();
      if (j?.status === 'OK') setWeather(j as WeatherOk);
      else { setWeather(null); setWeatherMsg(j?.error ?? (j?.reason ? `${j.status}: ${j.reason}` : `HTTP ${r.status}`)); }
    } catch (e) { setWeatherMsg(`SERVICE UNAVAILABLE: ${(e as Error).message}`); }
    finally { setBusy(''); }
  };

  const onLoadFile = async (file: File | undefined) => {
    if (!file) return;
    let text: string;
    try { text = await readText(file); } catch (e) { setLoad(null); setLoadMsg(`${file.name} could not be read (${(e as Error).message}).`); return; }
    const p = parseLoadCsv(text, weather?.hours);
    if (p.values) { setLoad(p.values); setLoadMsg(`${file.name}: ${p.values.length} hourly values, ${Math.round(p.values.reduce((a, b) => a + b, 0)).toLocaleString('en-KE')} kWh in total.`); }
    else { setLoad(null); setLoadMsg(p.error); }
  };

  const build = async () => {
    if (!mapped.input) return;
    setBusy('json'); setServerError('');
    try {
      const r = await postProposal(mapped.input, 'json');
      if (!r.ok) { setProposal(null); setServerError(await errorOf(r)); return; }
      setProposal(await r.json()); setBuiltFor(inputKey);
    } catch (e) { setServerError((e as Error).message); }
    finally { setBusy(''); }
  };

  const download = async (format: 'xlsx' | 'pdf') => {
    if (!mapped.input) return;
    setBusy(format); setServerError('');
    try {
      const r = await postProposal(mapped.input, format);
      if (!r.ok) { setServerError(await errorOf(r)); return; }
      const name = /filename="([^"]+)"/.exec(r.headers.get('content-disposition') || '')?.[1] ?? `solar-proposal.${format}`;
      const url = URL.createObjectURL(await r.blob());
      const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) { setServerError((e as Error).message); }
    finally { setBusy(''); }
  };

  const loadExample = () => { setF(WORKED_EXAMPLE_FORM); setBom(WORKED_EXAMPLE_BOM.map((r) => ({ ...r }))); setExample(true); setWeather(null); setWeatherMsg(''); setLoad(null); setLoadMsg(''); setProposal(null); setServerError(''); setRestored(null); setOpened(null); };
  const clear = () => { setF({}); setBom([{ ...EMPTY_BOM_ROW }]); setExample(false); setWeather(null); setWeatherMsg(''); setLoad(null); setLoadMsg(''); setProposal(null); setServerError(''); setRestored(null); setOpened(null); };

  const p = production.result;
  const h = hybrid.result;

  return (
    <div style={{ padding: 16, color: '#e2e8f0', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Proposal</h1>
      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
        From datasheets to a technical and commercial proposal: design checks, hourly production on a past weather year, optional hybrid balance, priced bill of materials and the customer&apos;s own tariff. Any REFUSE blocks the proposal; an unpriced item leaves it without a total; approval needs an authenticated, authorised reviewer, which is not available yet, so every proposal is DRAFT.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <button type="button" onClick={loadExample} style={btn}>Load worked example (test values, not a recommendation)</button>
        <button type="button" onClick={clear} style={{ ...btn, background: 'transparent', color: '#94a3b8' }}>Clear</button>
        <a href="#/design-check" style={{ fontSize: 13, color: '#fbbf24', alignSelf: 'center' }}>← Design Check</a>
      </div>
      {example ? (
        <div role="note" style={{ ...box, borderColor: '#f59e0b', color: '#fde68a', fontSize: 13, marginBottom: 12 }}>
          TEST VALUES: the worked example uses the module, inverter, prices, tariff and production figures from the regression test. They are not a product recommendation, a real price or a real tariff. The production figures are test values, not a simulation, until you fetch the hourly weather.
        </div>
      ) : null}

      <section style={{ ...box, marginBottom: 12 }} aria-label="Saved project">
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fbbf24', margin: '0 0 8px' }}>Saved project</h2>
        <p role="note" style={{ fontSize: 12, color: '#fde68a', margin: '0 0 8px' }}>{SAVED_HERE_ONLY_NOTE}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="button" onClick={saveFile} style={btn}>Save project file (.json)</button>
          <button type="button" onClick={() => openInput.current?.click()} style={btn}>Open project file</button>
          <input ref={openInput} type="file" accept=".json,application/json" aria-label="Open project file (.json)" hidden onChange={(e) => openFile(e.target.files?.[0])} />
          <button type="button" onClick={discardDraft} style={{ ...btn, background: 'transparent', color: '#94a3b8' }}>Clear draft</button>
        </div>
        <p style={{ fontSize: 12, color: '#94a3b8', margin: '8px 0 0' }}>
          The form and the bill of materials are saved in this browser as you type{lastSaved ? ` (last saved ${when(lastSaved)})` : ''}. The project file also holds the production source and the revision. Hourly weather, the load file and the built proposal are not saved: they are recomputed. {SIGN_OFFS_NOT_RESTORED}
        </p>
        {restored ? (
          <div role="status" style={{ fontSize: 13, color: '#cbd5e1', marginTop: 8 }}>
            Restored your draft from this browser (saved {when(restored.savedAt)}).
            {restored.production.kind === 'weather' ? ` Production was from ${restored.production.label}; the hourly weather is not stored, so fetch it again to recompute production and the revision.` : ''}
            {restored.stripped.length ? ` Not restored: ${restored.stripped.join(', ')}.` : ''}
          </div>
        ) : null}
        {opened ? (
          <div role="status" style={{ fontSize: 13, color: '#cbd5e1', marginTop: 8, wordBreak: 'break-word' }}>
            Opened {opened.name} (saved {when(opened.savedAt)}). The proposal is DRAFT.
            {opened.production.kind === 'weather' ? ` Production was from ${opened.production.label}; fetch the hourly weather again to recompute it.` : ''}
            {opened.stripped.length ? ` Ignored from the file: ${opened.stripped.join(', ')}.` : ''}
            <div style={{ fontSize: 12, marginTop: 4, wordBreak: 'break-all' }}>
              Revision recomputed from the opened inputs: {revision ? <code>{revision}</code> : 'available once the inputs are complete'}
              {opened.fileRevision ? <> · the file stated <code>{opened.fileRevision}</code> ({revision === opened.fileRevision ? 'matches' : revision ? 'differs: the recomputed one applies' : 'not yet comparable'})</> : ' · the file stated no revision'}
            </div>
          </div>
        ) : null}
        {storageMsg ? <p role="alert" style={{ color: '#fca5a5', fontSize: 13, margin: '8px 0 0' }}>{storageMsg}</p> : null}
        {draftError ? <p role="alert" style={{ color: '#fca5a5', fontSize: 13, margin: '8px 0 0' }}>{draftError}{autosavePaused ? ' Autosave is paused so that draft is not overwritten; use Clear draft to start again.' : ''}</p> : null}
        {openError ? <p role="alert" style={{ color: '#fca5a5', fontSize: 13, margin: '8px 0 0' }}>{openError}</p> : null}
      </section>

      <div style={{ display: 'grid', gap: 12 }}>
        {GROUPS.map((g) => <Fieldset key={g.id} g={g} f={f} set={set} />)}

        <section style={box} aria-label="Weather and production">
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fbbf24', margin: '0 0 8px' }}>Weather and production</h2>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 8px' }}>Hourly irradiance and temperature for {year} at the site coordinates, then an hourly simulation with losses: {LOSSES_SOURCE} (14.08 %).</p>
          <button type="button" onClick={fetchWeather} disabled={busy === 'weather'} style={btn}>{busy === 'weather' ? 'Fetching…' : 'Fetch hourly weather'}</button>
          {weatherMsg ? <p style={{ color: '#fca5a5', fontSize: 13, marginTop: 8 }}>{weatherMsg}</p> : null}
          {weather ? <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 8 }}>Weather: {weather.source} ({weather.hours} hours).{weather.notes?.length ? ` ${weather.notes.join(' ')}` : ''}</p> : null}
          {production.error ? <p style={{ color: '#fbbf24', fontSize: 13 }}>Production: {production.error}</p> : null}
          {p ? (
            <div style={{ marginTop: 8, fontSize: 13 }}>
              <div style={{ fontWeight: 700 }}>{weather ? 'Simulated' : 'TEST values (not a simulation)'}: {p.annualKwh.toLocaleString('en-KE')} kWh/year · specific yield {p.specificYieldKwhPerKwp} kWh/kWp · clipped {p.clippedKwh} kWh · PR {p.performanceRatio}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{p.assumptions[0]} {p.engineVersion}</div>
            </div>
          ) : null}
        </section>

        <section style={box} aria-label="Hybrid balance">
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fbbf24', margin: '0 0 8px' }}>Hybrid balance (optional)</h2>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 8px' }}>Upload an hourly load: one kWh value per hour, one per line (a header line and a timestamp column are allowed), the same number of hours as the weather year. Gaps are not filled.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
            <label style={{ fontSize: 12, color: '#cbd5e1' }}>Hourly load file (CSV)
              <input type="file" accept=".csv,.txt,text/csv,text/plain" onChange={(e) => onLoadFile(e.target.files?.[0])} style={{ ...inputStyle, padding: 4 }} />
            </label>
            <label style={{ fontSize: 12, color: '#cbd5e1' }}>Load source (required)
              <input value={f['h.loadSource'] ?? ''} onChange={(e) => set('h.loadSource', e.target.value)} style={inputStyle} />
            </label>
          </div>
          {loadMsg ? <p style={{ fontSize: 12, color: load ? '#cbd5e1' : '#fca5a5' }}>{loadMsg}</p> : null}
          <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>{HYBRID_GROUPS.map((g) => <Fieldset key={g.id} g={g} f={f} set={set} />)}</div>
          {hybrid.error ? <p style={{ color: '#fbbf24', fontSize: 13 }}>Hybrid: {hybrid.error}</p> : null}
          {h ? (
            <div style={{ marginTop: 8, fontSize: 13 }}>
              <div style={{ fontWeight: 700 }}>Renewable fraction {(h.renewableFraction * 100).toFixed(1)} % · unserved {h.totals.unservedKwh} kWh in {h.unservedHours} h</div>
              <table style={{ fontSize: 12, borderCollapse: 'collapse', marginTop: 4 }}><tbody>
                {([['Load', h.totals.loadKwh], ['PV', h.totals.pvKwh], ['PV to load', h.totals.pvToLoadKwh], ['PV to battery', h.totals.pvToBatteryKwh], ['Battery to load', h.totals.batteryToLoadKwh], ['Grid import', h.totals.gridImportKwh], ['Grid export', h.totals.gridExportKwh], ['Generator', h.totals.generatorKwh], ['Generator fuel (L)', h.totals.generatorFuelL], ['Generator hours', h.totals.generatorHours], ['Curtailed', h.totals.curtailedKwh]] as Array<[string, number]>).map(([k, v]) => (
                  <tr key={k}><td style={td}>{k}</td><td style={{ ...td, textAlign: 'right' }}>{v.toLocaleString('en-KE')}{/fuel|hours/i.test(k) ? '' : ' kWh'}</td></tr>
                ))}
              </tbody></table>
              <ul style={{ fontSize: 11, color: '#94a3b8', paddingLeft: 16 }}>{h.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
            </div>
          ) : null}
        </section>

        <section style={box} aria-label="Bill of materials">
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fbbf24', margin: '0 0 8px' }}>Bill of materials</h2>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 8px' }}>Leave a rate empty if it is not yet quoted: the item shows as &quot;rate required&quot; and the proposal has no total. A rate needs its source and date.</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ fontSize: 12, borderCollapse: 'collapse', width: '100%', minWidth: 760 }}>
              <thead><tr>{['Item', 'Model', 'Qty', 'Unit', 'Rate (KES)', 'Rate source', 'Rate date', ''].map((x) => <th key={x} style={th}>{x}</th>)}</tr></thead>
              <tbody>
                {bom.map((r, i) => (
                  <tr key={i}>
                    {(['item', 'model', 'quantity', 'unit', 'rate', 'rateSource', 'rateDate'] as Array<keyof BomRow>).map((k) => (
                      <td key={k} style={td}><input aria-label={`${k} row ${i + 1}`} type={k === 'rateDate' ? 'date' : 'text'} value={r[k]} placeholder={k === 'rate' ? 'rate required' : ''} onChange={(e) => setRow(i, k, e.target.value)} style={{ ...inputStyle, marginTop: 0 }} /></td>
                    ))}
                    <td style={td}><button type="button" onClick={() => setBom((rows) => rows.filter((_, j) => j !== i))} style={{ ...btn, padding: '4px 8px' }} aria-label={`Remove row ${i + 1}`}>×</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => setBom((rows) => [...rows, { ...EMPTY_BOM_ROW }])} style={{ ...btn, marginTop: 8 }}>Add row</button>
        </section>

        <Fieldset g={FINANCE} f={f} set={set} />
        <section style={{ ...box, borderColor: '#f59e0b' }} aria-label="Engineer approval">
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fbbf24', margin: '0 0 8px' }}>Engineer approval</h2>
          <p role="note" style={{ fontSize: 13, color: '#fde68a', margin: 0 }}>{APPROVAL_LOCKED_NOTICE}</p>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0' }}>An approval will be locked to this revision of the inputs; any later edit returns the proposal to DRAFT.</p>
          <p style={{ fontSize: 12, color: '#cbd5e1', margin: '6px 0 0', wordBreak: 'break-all' }}>Revision (SHA-256 of the inputs): {revision ? <code>{revision}</code> : 'available once the inputs are complete'}</p>
        </section>

        <section style={box} aria-live="polite" aria-label="Proposal">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <button type="button" onClick={build} disabled={!mapped.input || busy !== ''} style={{ ...primary, opacity: mapped.input ? 1 : 0.5 }}>{busy === 'json' ? 'Building…' : 'Build proposal'}</button>
            <button type="button" onClick={() => download('xlsx')} disabled={!mapped.input || busy !== ''} style={{ ...btn, opacity: mapped.input ? 1 : 0.5 }}>{busy === 'xlsx' ? 'Preparing…' : 'Download Excel'}</button>
            <button type="button" onClick={() => download('pdf')} disabled={!mapped.input || busy !== ''} style={{ ...btn, opacity: mapped.input ? 1 : 0.5 }}>{busy === 'pdf' ? 'Preparing…' : 'Download PDF'}</button>
          </div>
          {mapped.errors.length ? (
            <div style={{ fontSize: 12, color: '#fca5a5' }}>Before a proposal can be built:<ul style={{ paddingLeft: 16, margin: '4px 0' }}>{mapped.errors.map((e) => <li key={e}>{e}</li>)}</ul></div>
          ) : null}
          {mapped.warnings.length ? <ul style={{ fontSize: 12, color: '#fbbf24', paddingLeft: 16 }}>{mapped.warnings.map((w) => <li key={w}>{w}</li>)}</ul> : null}
          {serverError ? <p style={{ color: '#fca5a5', fontSize: 13 }}>Refused: {serverError}</p> : null}
          {proposal ? <ProposalView p={proposal} stale={stale} /> : null}
        </section>
      </div>
    </div>
  );
}

function ProposalView({ p, stale }: { p: Proposal; stale: boolean }) {
  const h2: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: '#fbbf24', margin: '16px 0 6px' };
  // FOR ISSUE is shown only with a verified approval.
  const shown: Proposal['status'] = p.status === 'FOR ISSUE' && !p.approval ? 'DRAFT' : p.status;
  return (
    <div>
      {stale ? <p style={{ fontSize: 12, color: '#fbbf24' }}>The inputs have changed since this proposal was built. Build it again before using it.</p> : null}
      <div style={{ border: `2px solid ${statusColour[shown]}`, borderRadius: 10, padding: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: statusColour[shown] }}>{shown === 'FOR ISSUE' ? 'FOR ISSUE' : `${shown}: NOT FOR ISSUE`} · {p.reference}</div>
        <div style={{ fontSize: 12, color: '#cbd5e1' }}>{p.client.name} · {p.client.siteAddress} ({p.client.lat}, {p.client.lon}) · {p.system.dcKwp} kWp DC / {p.system.acKw} kW AC · {p.system.modules} modules in {p.system.strings} strings{p.system.batteryKwh !== null ? ` · battery ${p.system.batteryKwh} kWh nominal` : ''}</div>
        <div style={{ fontSize: 12, color: '#cbd5e1', wordBreak: 'break-all' }}>Revision (SHA-256 of the inputs): <code>{p.revisionHash}</code></div>
        <div style={{ fontSize: 12, color: '#fde68a' }}>{p.approval ? `Approved by ${p.approval.reviewerName} (${p.approval.registration}) on ${p.approval.approvedAt} for this revision` : APPROVAL_LOCKED_NOTICE}</div>
        {p.statusReasons.length ? <ul style={{ fontSize: 12, paddingLeft: 16, margin: '6px 0 0' }}>{p.statusReasons.map((r) => <li key={r}>{r}</li>)}</ul> : null}
      </div>

      <h3 style={h2}>Design checks</h3>
      <div style={{ overflowX: 'auto' }}><table style={{ fontSize: 12, borderCollapse: 'collapse', width: '100%' }}>
        <thead><tr>{['Check', 'Verdict', 'Value', 'Limit', 'Margin', 'Reference'].map((x) => <th key={x} style={th}>{x}</th>)}</tr></thead>
        <tbody>{p.checks.map((c) => (
          <tr key={c.id}><td style={td}>{c.title}{c.note ? <div style={{ color: '#fbbf24' }}>{c.note}</div> : null}</td><td style={{ ...td, color: colour[c.verdict], fontWeight: 700 }}>{c.verdict}</td><td style={td}>{c.value} {c.unit}</td><td style={td}>{c.limit} {c.unit}</td><td style={td}>{c.marginPct} %</td><td style={{ ...td, color: '#94a3b8' }}>{c.formula} · {c.reference}</td></tr>
        ))}</tbody>
      </table></div>

      <h3 style={h2}>Schedule</h3>
      <table style={{ fontSize: 12, borderCollapse: 'collapse', width: '100%' }}>
        <thead><tr>{['Item', 'Model', 'Qty', 'Unit', 'Datasheet'].map((x) => <th key={x} style={th}>{x}</th>)}</tr></thead>
        <tbody>{p.schedule.map((s, i) => (
          <tr key={i}><td style={td}>{s.item}</td><td style={td}>{s.model}</td><td style={td}>{s.quantity}</td><td style={td}>{s.unit}</td><td style={{ ...td, color: '#94a3b8' }}>{s.datasheet ?? ''}{s.verified === undefined ? '' : s.verified ? ' (verified)' : ' (NOT verified)'}</td></tr>
        ))}</tbody>
      </table>

      <h3 style={h2}>Costing</h3>
      <div style={{ overflowX: 'auto' }}><table style={{ fontSize: 12, borderCollapse: 'collapse', width: '100%' }}>
        <thead><tr>{['Item', 'Model', 'Qty', 'Rate', 'Source / date', 'Amount'].map((x) => <th key={x} style={th}>{x}</th>)}</tr></thead>
        <tbody>
          {p.costing.lines.map((l, i) => (
            <tr key={i}><td style={td}>{l.item}</td><td style={td}>{l.model}</td><td style={td}>{l.quantity} {l.unit}</td><td style={td}>{l.rate ? kes(l.rate.valueKes) : 'rate required'}</td><td style={{ ...td, color: '#94a3b8' }}>{l.rate ? `${l.rate.source}, ${l.rate.date}` : ''}</td><td style={{ ...td, textAlign: 'right' }}>{kes(l.amountKes)}</td></tr>
          ))}
          <tr><td style={{ ...td, fontWeight: 700 }} colSpan={5}>Capital cost</td><td style={{ ...td, textAlign: 'right', fontWeight: 700 }}>{p.costing.capexKes === null ? `no total: rate required for ${p.costing.unpriced.join(', ')}` : kes(p.costing.capexKes)}</td></tr>
        </tbody>
      </table></div>

      <h3 style={h2}>Energy</h3>
      <div style={{ fontSize: 12 }}>
        Year 1: {p.energy.year1Kwh.toLocaleString('en-KE')} kWh · used on site {p.energy.usefulYear1Kwh === null ? 'unknown' : `${p.energy.usefulYear1Kwh.toLocaleString('en-KE')} kWh`} · exported {p.energy.exportYear1Kwh.toLocaleString('en-KE')} kWh · clipped {p.energy.clippedKwh} kWh · specific yield {p.energy.specificYield} kWh/kWp · PR {p.energy.performanceRatio}
        <div style={{ color: '#94a3b8' }}>{p.energy.source}</div>
      </div>

      <h3 style={h2}>Finance</h3>
      {p.finance ? (
        <>
          <div style={{ fontSize: 12 }}>NPV {kes(p.finance.npvKes)} · IRR {p.finance.irrPct === null ? 'no unique IRR' : `${p.finance.irrPct} %`} · simple payback {p.finance.simplePaybackYears === null ? 'not within the lifetime' : `${p.finance.simplePaybackYears} years`} · LCOE KES {p.finance.lcoeKesPerKwh}/kWh</div>
          <div style={{ overflowX: 'auto', maxHeight: 320, overflowY: 'auto' }}><table style={{ fontSize: 12, borderCollapse: 'collapse', width: '100%', marginTop: 6 }}>
            <thead><tr>{['Year', 'Energy (kWh)', 'Savings (KES)', 'O&M (KES)', 'Net (KES)', 'Cumulative (KES)'].map((x) => <th key={x} style={th}>{x}</th>)}</tr></thead>
            <tbody>{p.finance.cashflows.map((c) => (
              <tr key={c.year}>{[c.year, c.energyKwh, c.savingsKes, c.omKes, c.netKes, c.cumulativeKes].map((v, i) => <td key={i} style={{ ...td, textAlign: 'right', color: i === 5 && v < 0 ? '#fca5a5' : undefined }}>{v.toLocaleString('en-KE')}</td>)}</tr>
            ))}</tbody>
          </table></div>
        </>
      ) : <p style={{ fontSize: 12, color: '#94a3b8' }}>No financial result: it needs every item priced and a known self-consumption (see the reasons above).</p>}

      <h3 style={h2}>Disclosures</h3>
      <ul style={{ fontSize: 12, color: '#cbd5e1', paddingLeft: 16 }}>{p.disclosures.map((d) => <li key={d}>{d}</li>)}</ul>
      <div style={{ fontSize: 11, color: '#64748b' }}>{p.versions.join(' · ')}</div>
    </div>
  );
}
