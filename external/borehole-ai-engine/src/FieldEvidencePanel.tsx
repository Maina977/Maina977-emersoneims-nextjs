/**
 * "Add field evidence" (2026-11-22, management priority 6): guided entry of a
 * geophysical survey, a pumping test and a laboratory water analysis, each
 * with its source. Entries are validated (fieldEvidence.ts) and, only when
 * valid, set the existing field-data keys the evidence gate reads. Nothing is
 * pre-filled or defaulted: an empty box stays empty.
 */
import { useState, type CSSProperties, type ReactNode } from 'react';
import type { FieldValidationData } from './types';
import {
  validateSurvey, validatePumpingTest, validateLabAnalysis, sha256Hex, LAB_PARAMETERS,
  type SurveyEntry, type PumpingTestEntry, type LabEntry, type StepEntry, type LabParameterKey,
} from './fieldEvidence';
import { evidenceChecklist, provenanceText } from './evidenceGate';

type Patch = Partial<FieldValidationData>;
type EvidenceKey = 'ertSurvey' | 'pumpTest' | 'stepDrawdownTest' | 'labWaterAnalysis';

const inp: CSSProperties = { width: '100%', padding: 4, borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' };
const lbl: CSSProperties = { fontSize: 11 };
const grid = (cols: number): CSSProperties => ({ display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(${cols}px,1fr))`, gap: 8 });
const num = (s: string): number | null => { const t = s.trim().replace(',', '.'); if (!t) return null; const v = Number(t); return Number.isFinite(v) ? v : NaN; };

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label style={lbl}>{label}{children}</label>;
}
function Errors({ errors }: { errors: string[] }) {
  if (!errors.length) return null;
  return (
    <div role="alert" style={{ marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ef4444', background: 'rgba(239,68,68,0.08)', fontSize: 11, color: '#ef4444' }}>
      <strong>Not added. Please correct:</strong>
      <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>{errors.map((e) => <li key={e}>{e}</li>)}</ul>
    </div>
  );
}
function Added({ text, onRemove }: { text: string; onRemove: () => void }) {
  return (
    <div style={{ marginTop: 8, padding: 8, borderRadius: 6, background: 'rgba(16,185,129,0.08)', fontSize: 11, color: 'var(--accent-green)', display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
      <span>{'✅'} Added: {text}</span>
      <button type="button" className="btn btn-secondary" style={{ fontSize: 10, padding: '2px 8px' }} onClick={onRemove}>Remove</button>
    </div>
  );
}
function SourceFields({ s, set, names }: { s: { source: string; date: string; method: string; reference: string }; set: (k: 'source' | 'date' | 'method' | 'reference', v: string) => void; names: { source: string; date: string; method: string; methodHint: string } }) {
  return (
    <>
      <Field label={`${names.source} *`}><input type="text" style={inp} value={s.source} onChange={(e) => set('source', e.target.value)} /></Field>
      <Field label={`${names.date} *`}><input type="date" style={inp} value={s.date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => set('date', e.target.value)} /></Field>
      <Field label={`${names.method} *`}><input type="text" style={inp} placeholder={names.methodHint} value={s.method} onChange={(e) => set('method', e.target.value)} /></Field>
      <Field label="Report / reference no. *"><input type="text" style={inp} value={s.reference} onChange={(e) => set('reference', e.target.value)} /></Field>
    </>
  );
}

const blankSource = { source: '', date: '', method: '', reference: '' };

export function FieldEvidencePanel({ fieldData, onApply, onRemove }: {
  fieldData: Partial<FieldValidationData>;
  onApply: (patch: Patch) => void;
  onRemove: (keys: EvidenceKey[]) => void;
}) {
  // ── Geophysical survey ──
  const [sv, setSv] = useState({ ...blankSource, surveyType: 'VES' as 'VES' | 'ERT', top: '', bottom: '', rho: '' });
  const [svFile, setSvFile] = useState<{ name: string; sha256: string } | null>(null);
  const [svErr, setSvErr] = useState<string[]>([]);
  // ── Pumping test ──
  const [pt, setPt] = useState({ ...blankSource, testType: 'constant-rate' as 'constant-rate' | 'step-drawdown', swl: '', dur: '', rate: '', dwl: '', rec: '', recH: '', T: '', S: '' });
  const [steps, setSteps] = useState<{ rate: string; dwl: string; min: string }[]>([{ rate: '', dwl: '', min: '' }, { rate: '', dwl: '', min: '' }, { rate: '', dwl: '', min: '' }]);
  const [ptErr, setPtErr] = useState<string[]>([]);
  // ── Laboratory ──
  const [lb, setLb] = useState({ ...blankSource, accreditation: '', samplePoint: '', h2s: '' });
  const [lbVals, setLbVals] = useState<Record<string, string>>({});
  const [lbErr, setLbErr] = useState<string[]>([]);

  const checklist = evidenceChecklist(fieldData as FieldValidationData);

  const addSurvey = () => {
    const entry: SurveyEntry = { ...sv, surveyType: sv.surveyType, aquiferTopM: num(sv.top), aquiferBottomM: num(sv.bottom), resistivityOhmM: num(sv.rho), reportFile: svFile };
    const r = validateSurvey(entry);
    if (!r.ok) { setSvErr(r.errors); return; }
    setSvErr([]); onApply(r.value);
  };
  const addPumpTest = () => {
    const entry: PumpingTestEntry = {
      ...pt, testType: pt.testType, staticLevelM: num(pt.swl), transmissivityM2Day: num(pt.T), storativity: num(pt.S),
      ...(pt.testType === 'constant-rate'
        ? { durationHrs: num(pt.dur), rateM3h: num(pt.rate), dynamicLevelM: num(pt.dwl), recoveryLevelM: num(pt.rec), recoveryHrs: num(pt.recH) }
        : { steps: steps.map<StepEntry>((s) => ({ rateM3h: num(s.rate), dynamicLevelM: num(s.dwl), durationMin: num(s.min) })) }),
    };
    const r = validatePumpingTest(entry);
    if (!r.ok) { setPtErr(r.errors); return; }
    setPtErr([]);
    // One pumping test at a time: the other test type is cleared.
    onRemove(pt.testType === 'constant-rate' ? ['stepDrawdownTest'] : ['pumpTest']);
    onApply(r.value);
  };
  const addLab = () => {
    const values: LabEntry['values'] = {};
    for (const p of LAB_PARAMETERS) { const v = num(lbVals[p.key] ?? ''); if (v !== null) values[p.key as LabParameterKey] = v; }
    const entry: LabEntry = { ...lb, values, h2s: lb.h2s === '' ? null : lb.h2s === 'yes' };
    const r = validateLabAnalysis(entry);
    if (!r.ok) { setLbErr(r.errors); return; }
    setLbErr([]); onApply(r.value);
  };
  const onFile = async (f: File | undefined) => {
    if (!f) { setSvFile(null); return; }
    try { setSvFile({ name: f.name, sha256: await sha256Hex(await f.arrayBuffer()) }); }
    catch { setSvFile(null); setSvErr(['The report file could not be read; it is optional, so you can add the survey without it.']); }
  };

  const ert = fieldData.ertSurvey, ptd = fieldData.pumpTest, sdt = fieldData.stepDrawdownTest, lab = fieldData.labWaterAnalysis;

  return (
    <fieldset style={{ border: '2px solid #10b981', borderRadius: 8, padding: 12, background: 'rgba(16,185,129,0.04)' }}>
      <legend style={{ fontSize: 13, fontWeight: 800, color: '#10b981' }}>Add field evidence</legend>
      <p style={{ fontSize: 11, margin: '0 0 8px', color: 'var(--text-secondary)' }}>
        Enter results exactly as they appear in the contractor&apos;s or laboratory&apos;s report. Fields marked * are required. Nothing is filled in for you:
        AquaScan shows a drilling depth only with a survey, a yield only with a pumping test, and a project cost only with both.
      </p>

      {/* What evidence is still needed */}
      <div style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>What evidence is still needed for:</div>
        {checklist.map((c) => (
          <div key={c.figure} style={{ fontSize: 11, marginBottom: 4, color: c.ok ? '#10b981' : 'var(--text-secondary)' }}>
            <strong>{c.ok ? '✅' : '⬜'} {c.figure}</strong>
            {c.ok && c.basis ? <span>: {c.basis}</span> : null}
            {!c.ok && c.needs.length ? <ul style={{ margin: '2px 0 0 18px', padding: 0 }}>{c.needs.map((n) => <li key={n}>{n}</li>)}</ul> : null}
            {c.ok && c.figure === 'Project cost' ? <div style={{ marginLeft: 18 }}>{c.needs[c.needs.length - 1]}</div> : null}
          </div>
        ))}
      </div>

      {/* 1. Geophysical survey */}
      <fieldset style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 10, marginBottom: 10 }}>
        <legend style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>1. Geophysical survey (VES / ERT): gives the drilling depth</legend>
        <div style={grid(150)}>
          <Field label="Survey type *"><select style={inp} value={sv.surveyType} onChange={(e) => setSv({ ...sv, surveyType: e.target.value as 'VES' | 'ERT' })}><option value="VES">VES (vertical electrical sounding)</option><option value="ERT">ERT (resistivity imaging)</option></select></Field>
          <SourceFields s={sv} set={(k, v) => setSv({ ...sv, [k]: v })} names={{ source: 'Survey contractor', date: 'Survey date', method: 'Method', methodHint: 'e.g. Schlumberger array, IPI2Win' }} />
          <Field label="Interpreted aquifer top (m) *"><input type="number" min="0" step="0.1" style={inp} value={sv.top} onChange={(e) => setSv({ ...sv, top: e.target.value })} /></Field>
          <Field label="Interpreted aquifer bottom (m) *"><input type="number" min="0" step="0.1" style={inp} value={sv.bottom} onChange={(e) => setSv({ ...sv, bottom: e.target.value })} /></Field>
          <Field label="Aquifer resistivity (Ω·m, if in report)"><input type="number" min="0" step="0.1" style={inp} value={sv.rho} onChange={(e) => setSv({ ...sv, rho: e.target.value })} /></Field>
          <Field label="Survey report file (optional, stays on this device)"><input type="file" accept=".pdf,.doc,.docx,.jpg,.png,.dat,.txt" style={{ width: '100%', fontSize: 10 }} onChange={(e) => { void onFile(e.target.files?.[0]); }} /></Field>
        </div>
        {svFile && <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4, wordBreak: 'break-all' }}>File not uploaded; only its name and fingerprint are kept: {svFile.name}, SHA-256 {svFile.sha256}</div>}
        <button type="button" className="btn btn-primary" style={{ fontSize: 11, padding: '5px 14px', marginTop: 8 }} onClick={addSurvey}>Add survey</button>
        <Errors errors={svErr} />
        {ert && <Added text={`${ert.method ?? 'ERT/VES'} survey ${provenanceText(ert.provenance, { source: ert.contractor, date: ert.surveyDate })}: aquifer ${ert.aquiferDepthM}-${ert.aquiferDepthM + ert.aquiferThicknessM} m`} onRemove={() => onRemove(['ertSurvey'])} />}
      </fieldset>

      {/* 2. Pumping test */}
      <fieldset style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 10, marginBottom: 10 }}>
        <legend style={{ fontSize: 12, fontWeight: 700, color: '#06b6d4' }}>2. Pumping test: gives the yield</legend>
        <div style={grid(150)}>
          <Field label="Test type *"><select style={inp} value={pt.testType} onChange={(e) => setPt({ ...pt, testType: e.target.value as 'constant-rate' | 'step-drawdown' })}><option value="constant-rate">Constant-rate test</option><option value="step-drawdown">Step-drawdown test</option></select></Field>
          <SourceFields s={pt} set={(k, v) => setPt({ ...pt, [k]: v })} names={{ source: 'Test contractor', date: 'Test date', method: 'Method / standard', methodHint: 'e.g. WRA test-pumping guideline' }} />
          <Field label="Static water level (m below ground) *"><input type="number" min="0" step="0.01" style={inp} value={pt.swl} onChange={(e) => setPt({ ...pt, swl: e.target.value })} /></Field>
          {pt.testType === 'constant-rate' && <>
            <Field label="Duration (hours) *"><input type="number" min="0" step="0.5" style={inp} value={pt.dur} onChange={(e) => setPt({ ...pt, dur: e.target.value })} /></Field>
            <Field label="Pumping rate (m³/h) *"><input type="number" min="0" step="0.01" style={inp} value={pt.rate} onChange={(e) => setPt({ ...pt, rate: e.target.value })} /></Field>
            <Field label="Dynamic water level at end (m) *"><input type="number" min="0" step="0.01" style={inp} value={pt.dwl} onChange={(e) => setPt({ ...pt, dwl: e.target.value })} /></Field>
            <Field label="Water level at end of recovery (m) *"><input type="number" min="0" step="0.01" style={inp} value={pt.rec} onChange={(e) => setPt({ ...pt, rec: e.target.value })} /></Field>
            <Field label="Recovery duration (hours) *"><input type="number" min="0" step="0.5" style={inp} value={pt.recH} onChange={(e) => setPt({ ...pt, recH: e.target.value })} /></Field>
          </>}
          <Field label="Transmissivity (m²/day, if in report)"><input type="number" min="0" step="0.1" style={inp} value={pt.T} onChange={(e) => setPt({ ...pt, T: e.target.value })} /></Field>
          <Field label="Storativity (if in report)"><input type="number" min="0" step="0.0001" style={inp} value={pt.S} onChange={(e) => setPt({ ...pt, S: e.target.value })} /></Field>
        </div>
        {pt.testType === 'step-drawdown' && (
          <div style={{ marginTop: 8 }}>
            <div style={{ ...grid(110), fontSize: 10, fontWeight: 700 }}><span>Step rate (m³/h) *</span><span>Dynamic level at end of step (m) *</span><span>Step duration (min) *</span></div>
            {steps.map((s, i) => (
              <div key={i} style={{ ...grid(110), marginTop: 4 }}>
                <input aria-label={`Step ${i + 1} rate`} type="number" min="0" step="0.01" style={inp} value={s.rate} onChange={(e) => setSteps(steps.map((x, j) => j === i ? { ...x, rate: e.target.value } : x))} />
                <input aria-label={`Step ${i + 1} dynamic level`} type="number" min="0" step="0.01" style={inp} value={s.dwl} onChange={(e) => setSteps(steps.map((x, j) => j === i ? { ...x, dwl: e.target.value } : x))} />
                <input aria-label={`Step ${i + 1} duration`} type="number" min="0" step="1" style={inp} value={s.min} onChange={(e) => setSteps(steps.map((x, j) => j === i ? { ...x, min: e.target.value } : x))} />
              </div>
            ))}
            <button type="button" className="btn btn-secondary" style={{ fontSize: 10, padding: '2px 10px', marginTop: 4 }} onClick={() => setSteps([...steps, { rate: '', dwl: '', min: '' }])}>Add a step</button>
          </div>
        )}
        <p style={{ fontSize: 10, color: 'var(--text-secondary)', margin: '6px 0 0' }}>The yield shown is the rate you tested (or, for a step test, the highest step rate), with this test&apos;s reference. Drawdown and recovery are worked out from the levels you enter.</p>
        <button type="button" className="btn btn-primary" style={{ fontSize: 11, padding: '5px 14px', marginTop: 8 }} onClick={addPumpTest}>Add pumping test</button>
        <Errors errors={ptErr} />
        {ptd && <Added text={`constant-rate test ${provenanceText(ptd.provenance, { date: ptd.testDate })}: ${ptd.sustainableYieldM3Hr} m³/h for ${ptd.testDurationHrs} h, drawdown ${ptd.drawdownM} m, recovery ${ptd.recoveryPercent}%`} onRemove={() => onRemove(['pumpTest'])} />}
        {sdt && <Added text={`step-drawdown test ${provenanceText(sdt.provenance, { date: sdt.testDate })}: ${sdt.steps.length} steps up to ${Math.max(...sdt.steps.map((s) => s.pumpingRate_m3hr))} m³/h`} onRemove={() => onRemove(['stepDrawdownTest'])} />}
      </fieldset>

      {/* 3. Laboratory */}
      <fieldset style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
        <legend style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>3. Laboratory water analysis</legend>
        <div style={grid(150)}>
          <SourceFields s={lb} set={(k, v) => setLb({ ...lb, [k]: v })} names={{ source: 'Laboratory name', date: 'Sample date', method: 'Method / standard', methodHint: 'e.g. APHA 23rd ed., KS EAS 12' }} />
          <Field label="Accreditation (as on certificate) *"><input type="text" style={inp} placeholder="e.g. KENAS ISO/IEC 17025" value={lb.accreditation} onChange={(e) => setLb({ ...lb, accreditation: e.target.value })} /></Field>
          <Field label="Sample point *"><input type="text" style={inp} placeholder="e.g. borehole head after 24 h pumping" value={lb.samplePoint} onChange={(e) => setLb({ ...lb, samplePoint: e.target.value })} /></Field>
        </div>
        <div style={{ fontSize: 10, margin: '8px 0 4px', color: 'var(--text-secondary)' }}>Parameters the laboratory reported (leave untested ones empty; an empty box is &quot;not tested&quot;, never 0):</div>
        <div style={grid(120)}>
          {LAB_PARAMETERS.map((p) => (
            <Field key={p.key} label={`${p.label} (${p.unit})`}><input type="number" step="any" style={inp} value={lbVals[p.key] ?? ''} onChange={(e) => setLbVals({ ...lbVals, [p.key]: e.target.value })} /></Field>
          ))}
          <Field label="H₂S detected"><select style={inp} value={lb.h2s} onChange={(e) => setLb({ ...lb, h2s: e.target.value })}><option value="">Not tested</option><option value="no">No</option><option value="yes">Yes</option></select></Field>
        </div>
        <button type="button" className="btn btn-primary" style={{ fontSize: 11, padding: '5px 14px', marginTop: 8 }} onClick={addLab}>Add laboratory analysis</button>
        <Errors errors={lbErr} />
        {lab && <Added text={`Measured: laboratory test (${lab.labName}, sampled ${lab.sampleDate}) ${provenanceText(lab.provenance)}`} onRemove={() => onRemove(['labWaterAnalysis'])} />}
      </fieldset>
    </fieldset>
  );
}

export default FieldEvidencePanel;
