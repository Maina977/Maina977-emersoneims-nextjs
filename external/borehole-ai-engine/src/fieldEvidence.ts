/**
 * Guided field-evidence entry (2026-11-22, management priority 6): "Improve
 * field-survey, pumping-test and laboratory-data entry without inventing
 * measurements."
 *
 * Each entry is validated and, only if valid, turned into the EXISTING
 * FieldValidationData fields (ertSurvey, pumpTest, stepDrawdownTest,
 * labWaterAnalysis). Nothing here opens the evidence gate by itself: the gate
 * (evidenceGate.ts, siteEvidenceFrom) reads those fields with its unchanged
 * conditions. No value is defaulted: a field the user did not enter is left
 * out, and an entry missing a required measurement or its source is refused.
 */
import type { EvidenceProvenance, FieldValidationData } from './types';

export interface SourceEntry {
  /** Contractor (survey, test) or laboratory name. */
  source: string;
  /** YYYY-MM-DD: survey date, test date or sample date. */
  date: string;
  /** Method or standard, e.g. "Schlumberger VES", "constant-rate test, KS ISO 14686", "APHA 23rd ed." */
  method: string;
  /** Report or certificate number. */
  reference: string;
}

export interface SurveyEntry extends SourceEntry {
  surveyType: 'VES' | 'ERT';
  aquiferTopM: number | null;
  aquiferBottomM: number | null;
  /** Interpreted aquifer resistivity, optional (only if the report gives it). */
  resistivityOhmM?: number | null;
  /** Optional report file: name and SHA-256 computed in the browser; the file is not uploaded. */
  reportFile?: { name: string; sha256: string } | null;
}

export interface StepEntry { rateM3h: number | null; dynamicLevelM: number | null; durationMin: number | null }

export interface PumpingTestEntry extends SourceEntry {
  testType: 'constant-rate' | 'step-drawdown';
  staticLevelM: number | null;
  /** constant-rate */
  durationHrs?: number | null;
  rateM3h?: number | null;
  dynamicLevelM?: number | null;
  recoveryLevelM?: number | null;
  recoveryHrs?: number | null;
  /** Reported by the test analysis, optional. */
  transmissivityM2Day?: number | null;
  storativity?: number | null;
  /** step-drawdown */
  steps?: StepEntry[];
}

export const LAB_PARAMETERS = [
  { key: 'pH', label: 'pH', unit: 'pH units', max: 14 },
  { key: 'tds', label: 'TDS', unit: 'mg/L' },
  { key: 'electricalConductivity', label: 'EC', unit: 'µS/cm' },
  { key: 'fluoride', label: 'Fluoride', unit: 'mg/L' },
  { key: 'nitrate', label: 'Nitrate', unit: 'mg/L' },
  { key: 'iron', label: 'Iron', unit: 'mg/L' },
  { key: 'manganese', label: 'Manganese', unit: 'mg/L' },
  { key: 'arsenic', label: 'Arsenic', unit: 'mg/L' },
  { key: 'coliform', label: 'Coliform', unit: 'CFU/100 mL' },
  { key: 'turbidity', label: 'Turbidity', unit: 'NTU' },
  { key: 'hardness', label: 'Hardness', unit: 'mg/L CaCO3' },
  { key: 'calcium', label: 'Calcium', unit: 'mg/L' },
  { key: 'magnesium', label: 'Magnesium', unit: 'mg/L' },
  { key: 'sodium', label: 'Sodium', unit: 'mg/L' },
  { key: 'potassium', label: 'Potassium', unit: 'mg/L' },
  { key: 'alkalinity', label: 'Alkalinity', unit: 'mg/L CaCO3' },
  { key: 'bicarbonate', label: 'Bicarbonate', unit: 'mg/L' },
  { key: 'chloride', label: 'Chloride', unit: 'mg/L' },
  { key: 'sulfate', label: 'Sulfate', unit: 'mg/L' },
  { key: 'dissolvedOxygen', label: 'Dissolved O₂', unit: 'mg/L' },
  { key: 'temperature', label: 'Temperature', unit: '°C', min: -5, max: 100 },
] as const;
export type LabParameterKey = typeof LAB_PARAMETERS[number]['key'];

export interface LabEntry extends SourceEntry {
  accreditation: string;
  samplePoint: string;
  values: Partial<Record<LabParameterKey, number | null>>;
  h2s?: boolean | null;
}

export type EntryResult<T> = { ok: true; value: T; errors: [] } | { ok: false; errors: string[] };

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const todayISO = (now: Date) => now.toISOString().slice(0, 10);
const finite = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);

function checkSource(e: SourceEntry, what: { source: string; date: string; method: string }, now: Date, errors: string[]): void {
  if (!e.source?.trim()) errors.push(`${what.source} is required.`);
  if (!e.method?.trim()) errors.push(`${what.method} is required.`);
  if (!e.reference?.trim()) errors.push('Report or reference number is required.');
  const d = String(e.date ?? '').trim();
  const m = ISO_DATE.exec(d);
  if (!d) errors.push(`${what.date} is required.`);
  else if (!m || Number.isNaN(Date.parse(`${d}T00:00:00Z`)) || new Date(`${d}T00:00:00Z`).toISOString().slice(0, 10) !== d) errors.push(`${what.date} is not a valid date (YYYY-MM-DD).`);
  else if (d > todayISO(now)) errors.push(`${what.date} ${d} is in the future.`);
}

function provenance(e: SourceEntry, extra: Partial<EvidenceProvenance> = {}): EvidenceProvenance {
  return { source: e.source.trim(), date: e.date.trim(), method: e.method.trim(), reference: e.reference.trim(), ...extra };
}

/** VES/ERT survey → ertSurvey (depth evidence). */
export function validateSurvey(e: SurveyEntry, now = new Date()): EntryResult<Pick<FieldValidationData, 'ertSurvey'>> {
  const errors: string[] = [];
  checkSource(e, { source: 'Survey contractor', date: 'Survey date', method: 'Survey method' }, now, errors);
  if (e.surveyType !== 'VES' && e.surveyType !== 'ERT') errors.push('Survey type must be VES or ERT.');
  const top = e.aquiferTopM, bottom = e.aquiferBottomM;
  if (!finite(top)) errors.push('Interpreted aquifer depth (top) is required.');
  else if (!(top > 0)) errors.push('Aquifer top must be deeper than 0 m.');
  else if (top > 1500) errors.push('Aquifer top deeper than 1,500 m is outside the range of a borehole survey.');
  if (!finite(bottom)) errors.push('Interpreted aquifer depth (bottom) is required.');
  else if (finite(top) && !(bottom > top)) errors.push('Aquifer bottom must be deeper than the aquifer top.');
  else if (bottom > 1500) errors.push('Aquifer bottom deeper than 1,500 m is outside the range of a borehole survey.');
  if (e.resistivityOhmM != null && !(finite(e.resistivityOhmM) && e.resistivityOhmM > 0)) errors.push('Resistivity, if entered, must be greater than 0 Ω·m.');
  if (e.reportFile && !(/^[0-9a-f]{64}$/.test(e.reportFile.sha256) && e.reportFile.name)) errors.push('Report file hash is not a SHA-256.');
  if (errors.length) return { ok: false, errors };
  return {
    ok: true, errors: [],
    value: {
      ertSurvey: {
        aquiferDepthM: top as number,
        aquiferThicknessM: Math.round(((bottom as number) - (top as number)) * 100) / 100,
        ...(finite(e.resistivityOhmM) ? { resistivityOhmM: e.resistivityOhmM } : {}),
        surveyDate: e.date.trim(),
        contractor: e.source.trim(),
        method: e.surveyType,
        provenance: provenance(e, e.reportFile ? { reportFile: { name: e.reportFile.name, sha256: e.reportFile.sha256 } } : {}),
      },
    },
  };
}

/** Pumping test → pumpTest (constant-rate) or stepDrawdownTest (yield evidence). */
export function validatePumpingTest(e: PumpingTestEntry, now = new Date()): EntryResult<Pick<FieldValidationData, 'pumpTest' | 'stepDrawdownTest'>> {
  const errors: string[] = [];
  checkSource(e, { source: 'Test contractor', date: 'Test date', method: 'Test method or standard' }, now, errors);
  const swl = e.staticLevelM;
  if (!finite(swl)) errors.push('Static water level is required.');
  else if (swl < 0) errors.push('Static water level must be 0 m or deeper (metres below ground).');
  if (e.transmissivityM2Day != null && !(finite(e.transmissivityM2Day) && e.transmissivityM2Day > 0)) errors.push('Transmissivity, if entered, must be greater than 0.');
  if (e.storativity != null && !(finite(e.storativity) && e.storativity > 0 && e.storativity < 1)) errors.push('Storativity, if entered, must be between 0 and 1.');

  if (e.testType === 'constant-rate') {
    const { durationHrs: dur, rateM3h: q, dynamicLevelM: dwl, recoveryLevelM: rec, recoveryHrs: recH } = e;
    if (!finite(dur)) errors.push('Test duration (hours) is required.');
    else if (!(dur > 0)) errors.push('Test duration must be greater than 0 hours.');
    else if (dur > 2000) errors.push('Test duration over 2,000 hours is not a pumping test.');
    if (!finite(q)) errors.push('Pumping rate (m³/h) is required.');
    else if (!(q > 0)) errors.push('Pumping rate must be greater than 0 m³/h.');
    if (!finite(dwl)) errors.push('Dynamic (pumping) water level is required.');
    else if (dwl < 0) errors.push('Dynamic water level must be 0 m or deeper.');
    else if (finite(swl) && !(dwl > swl)) errors.push('Dynamic water level must be deeper than the static water level.');
    if (!finite(rec)) errors.push('Recovery: the water level at the end of recovery is required.');
    else if (rec < 0) errors.push('Recovery water level must be 0 m or deeper.');
    else if (finite(dwl) && rec > dwl) errors.push('Recovery water level cannot be deeper than the dynamic water level.');
    if (!finite(recH)) errors.push('Recovery duration (hours) is required.');
    else if (!(recH > 0)) errors.push('Recovery duration must be greater than 0 hours.');
    if (errors.length) return { ok: false, errors };
    const drawdown = (dwl as number) - (swl as number);
    const recovered = Math.min(100, Math.max(0, (((dwl as number) - (rec as number)) / drawdown) * 100));
    return {
      ok: true, errors: [],
      value: {
        pumpTest: {
          testType: 'constant-rate',
          sustainableYieldM3Hr: q as number,
          drawdownM: Math.round(drawdown * 100) / 100,
          recoveryPercent: Math.round(recovered),
          testDurationHrs: dur as number,
          testDate: e.date.trim(),
          staticWaterLevelM: swl as number,
          dynamicWaterLevelM: dwl as number,
          recoveryWaterLevelM: rec as number,
          recoveryDurationHrs: recH as number,
          ...(finite(e.transmissivityM2Day) ? { transmissivityM2Day: e.transmissivityM2Day } : {}),
          ...(finite(e.storativity) ? { storativity: e.storativity } : {}),
          provenance: provenance(e),
        },
      },
    };
  }

  if (e.testType === 'step-drawdown') {
    const steps = (e.steps ?? []).filter((s) => s && (s.rateM3h != null || s.dynamicLevelM != null || s.durationMin != null));
    if (steps.length < 3) errors.push('A step-drawdown test needs at least 3 steps.');
    steps.forEach((s, i) => {
      const n = i + 1;
      if (!(finite(s.rateM3h) && s.rateM3h > 0)) errors.push(`Step ${n}: pumping rate must be greater than 0 m³/h.`);
      if (!(finite(s.durationMin) && s.durationMin > 0)) errors.push(`Step ${n}: duration must be greater than 0 minutes.`);
      if (!finite(s.dynamicLevelM)) errors.push(`Step ${n}: dynamic water level is required.`);
      else if (s.dynamicLevelM < 0) errors.push(`Step ${n}: dynamic water level must be 0 m or deeper.`);
      else if (finite(swl) && !(s.dynamicLevelM > swl)) errors.push(`Step ${n}: dynamic water level must be deeper than the static water level.`);
      if (i > 0 && finite(s.rateM3h) && finite(steps[i - 1].rateM3h) && !(s.rateM3h > (steps[i - 1].rateM3h as number))) errors.push(`Step ${n}: the pumping rate must be higher than step ${i}'s.`);
    });
    if (errors.length) return { ok: false, errors };
    return {
      ok: true, errors: [],
      value: {
        stepDrawdownTest: {
          steps: steps.map((s) => ({
            pumpingRate_m3hr: s.rateM3h as number,
            drawdown_m: Math.round(((s.dynamicLevelM as number) - (swl as number)) * 100) / 100,
            duration_min: s.durationMin as number,
          })),
          staticWaterLevel_m: swl as number,
          testDate: e.date.trim(),
          provenance: provenance(e),
        },
      },
    };
  }

  errors.push('Test type must be constant-rate or step-drawdown.');
  return { ok: false, errors };
}

/** Laboratory analysis → labWaterAnalysis; only the parameters the laboratory reported. */
export function validateLabAnalysis(e: LabEntry, now = new Date()): EntryResult<Pick<FieldValidationData, 'labWaterAnalysis'>> {
  const errors: string[] = [];
  checkSource(e, { source: 'Laboratory name', date: 'Sample date', method: 'Analysis method or standard' }, now, errors);
  if (!e.accreditation?.trim()) errors.push('Laboratory accreditation is required (as on the certificate, e.g. KENAS ISO/IEC 17025).');
  if (!e.samplePoint?.trim()) errors.push('Sample point is required (e.g. borehole head after 24 h pumping).');
  const values: Record<string, number> = {};
  for (const p of LAB_PARAMETERS) {
    const v = e.values?.[p.key];
    if (v == null) continue;
    const min = 'min' in p ? p.min : 0;
    const max = 'max' in p ? p.max : Infinity;
    if (!finite(v) || v < min || v > max) errors.push(`${p.label} (${p.unit}) must be ${max === Infinity ? `${min} or more` : `between ${min} and ${max}`}.`);
    else values[p.key] = v;
  }
  if (!Object.keys(values).length && e.h2s == null) errors.push('Enter at least one parameter the laboratory reported.');
  if (errors.length) return { ok: false, errors };
  return {
    ok: true, errors: [],
    value: {
      // Only the reported parameters: an untested parameter stays absent, never 0.
      labWaterAnalysis: {
        labName: e.source.trim(),
        sampleDate: e.date.trim(),
        accreditation: e.accreditation.trim(),
        samplePoint: e.samplePoint.trim(),
        ...values,
        ...(e.h2s != null ? { h2s: e.h2s } : {}),
        provenance: provenance(e, { accreditation: e.accreditation.trim(), samplePoint: e.samplePoint.trim() }),
      } as unknown as NonNullable<FieldValidationData['labWaterAnalysis']>,
    },
  };
}

/** SHA-256 of a file in the browser (Web Crypto); the file never leaves the device. */
export async function sha256Hex(data: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
