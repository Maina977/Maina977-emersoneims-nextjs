import { describe, it, expect } from 'vitest';
import { validateSurvey, validatePumpingTest, validateLabAnalysis, type SurveyEntry, type PumpingTestEntry, type LabEntry } from '@/external/borehole-ai-engine/src/fieldEvidence';
import { evidenceGate, evidenceChecklist, siteEvidenceFrom } from '@/external/borehole-ai-engine/src/evidenceGate';
import { calibrateWithFieldData } from '@/external/borehole-ai-engine/src/fieldCalibrationEngine';
import { buildFieldPumpTestAnalysis } from '@/external/borehole-ai-engine/src/pumpTestAnalyzer';
import { labSourceLabel } from '@/external/borehole-ai-engine/src/verdict';
import type { FieldValidationData } from '@/external/borehole-ai-engine/src/types';

// Management priority 6 (2026-11-22): guided field-evidence entry that sets the
// existing evidence fields only, with its source, and never invents a value.
// All values below are TEST values.
const NOW = new Date('2026-11-22T12:00:00Z');

const survey = (over: Partial<SurveyEntry> = {}): SurveyEntry => ({
  source: 'TEST Geophysics Ltd', date: '2026-10-01', method: 'Schlumberger array, IPI2Win inversion', reference: 'TEST-VES-01',
  surveyType: 'VES', aquiferTopM: 42, aquiferBottomM: 66, ...over,
});
const constantRate = (over: Partial<PumpingTestEntry> = {}): PumpingTestEntry => ({
  source: 'TEST Drillers', date: '2026-11-10', method: 'constant-rate test', reference: 'TEST-PT-07',
  testType: 'constant-rate', durationHrs: 24, rateM3h: 3.2, staticLevelM: 18, dynamicLevelM: 41.5, recoveryLevelM: 19.2, recoveryHrs: 12, ...over,
});
const stepTest = (over: Partial<PumpingTestEntry> = {}): PumpingTestEntry => ({
  source: 'TEST Drillers', date: '2026-11-09', method: 'step-drawdown, 4 steps', reference: 'TEST-SD-02',
  testType: 'step-drawdown', staticLevelM: 18,
  steps: [{ rateM3h: 1, dynamicLevelM: 22, durationMin: 100 }, { rateM3h: 2, dynamicLevelM: 27, durationMin: 100 }, { rateM3h: 3, dynamicLevelM: 34, durationMin: 100 }],
  ...over,
});
const lab = (over: Partial<LabEntry> = {}): LabEntry => ({
  source: 'TEST Water Lab', date: '2026-11-11', method: 'APHA 23rd edition', reference: 'TEST-LAB-99',
  accreditation: 'KENAS ISO/IEC 17025 (TEST)', samplePoint: 'Borehole head after 24 h pumping', values: { pH: 7.4, tds: 640, fluoride: 0.8 }, ...over,
});

const ok = <T,>(r: { ok: boolean; errors: string[]; value?: T }) => { expect(r.errors).toEqual([]); expect(r.ok).toBe(true); return (r as { value: T }).value; };

describe('validation: invalid entries are refused with clear messages', () => {
  it('survey: source fields, depth range, future date', () => {
    const r = validateSurvey(survey({ source: ' ', reference: '', method: '', date: '2027-01-01', aquiferTopM: 60, aquiferBottomM: 40 }), NOW);
    expect(r.ok).toBe(false);
    expect(r.errors).toEqual(expect.arrayContaining([
      'Survey contractor is required.', 'Survey method is required.', 'Report or reference number is required.',
      'Survey date 2027-01-01 is in the future.', 'Aquifer bottom must be deeper than the aquifer top.',
    ]));
    expect(validateSurvey(survey({ aquiferTopM: null }), NOW).errors).toContain('Interpreted aquifer depth (top) is required.');
    expect(validateSurvey(survey({ aquiferTopM: 0 }), NOW).errors).toContain('Aquifer top must be deeper than 0 m.');
    expect(validateSurvey(survey({ date: '2026-02-30' }), NOW).errors).toContain('Survey date is not a valid date (YYYY-MM-DD).');
    expect(validateSurvey(survey({ resistivityOhmM: -3 }), NOW).errors).toContain('Resistivity, if entered, must be greater than 0 Ω·m.');
  });
  it('constant-rate test: levels, rate, duration, recovery', () => {
    const r = validatePumpingTest(constantRate({ staticLevelM: -1, rateM3h: 0, durationHrs: 0 }), NOW);
    expect(r.errors).toEqual(expect.arrayContaining([
      'Static water level must be 0 m or deeper (metres below ground).',
      'Pumping rate must be greater than 0 m³/h.', 'Test duration must be greater than 0 hours.',
    ]));
    expect(validatePumpingTest(constantRate({ dynamicLevelM: 18 }), NOW).errors).toContain('Dynamic water level must be deeper than the static water level.');
    expect(validatePumpingTest(constantRate({ dynamicLevelM: 10 }), NOW).errors).toContain('Dynamic water level must be deeper than the static water level.');
    expect(validatePumpingTest(constantRate({ recoveryLevelM: null }), NOW).errors).toContain('Recovery: the water level at the end of recovery is required.');
    expect(validatePumpingTest(constantRate({ recoveryLevelM: 50 }), NOW).errors).toContain('Recovery water level cannot be deeper than the dynamic water level.');
    expect(validatePumpingTest(constantRate({ rateM3h: null }), NOW).errors).toContain('Pumping rate (m³/h) is required.');
    expect(validatePumpingTest(constantRate({ date: '2026-11-23' }), NOW).errors).toContain('Test date 2026-11-23 is in the future.');
    expect(validatePumpingTest(constantRate({ source: '' }), NOW).errors).toContain('Test contractor is required.');
  });
  it('step-drawdown test: at least 3 rising steps, each deeper than static', () => {
    expect(validatePumpingTest(stepTest({ steps: [{ rateM3h: 1, dynamicLevelM: 22, durationMin: 60 }] }), NOW).errors).toContain('A step-drawdown test needs at least 3 steps.');
    const bad = validatePumpingTest(stepTest({ steps: [{ rateM3h: 2, dynamicLevelM: 17, durationMin: 60 }, { rateM3h: 1, dynamicLevelM: 25, durationMin: 0 }, { rateM3h: 3, dynamicLevelM: 30, durationMin: 60 }] }), NOW);
    expect(bad.errors).toEqual(expect.arrayContaining([
      'Step 1: dynamic water level must be deeper than the static water level.',
      'Step 2: duration must be greater than 0 minutes.', 'Step 2: the pumping rate must be higher than step 1\'s.',
    ]));
  });
  it('laboratory: name, accreditation, sample point, at least one parameter, ranges', () => {
    const r = validateLabAnalysis(lab({ source: '', accreditation: '', samplePoint: '', values: {} }), NOW);
    expect(r.errors).toEqual(expect.arrayContaining([
      'Laboratory name is required.', 'Laboratory accreditation is required (as on the certificate, e.g. KENAS ISO/IEC 17025).',
      'Sample point is required (e.g. borehole head after 24 h pumping).', 'Enter at least one parameter the laboratory reported.',
    ]));
    expect(validateLabAnalysis(lab({ values: { pH: 15 } }), NOW).errors).toContain('pH (pH units) must be between 0 and 14.');
    expect(validateLabAnalysis(lab({ values: { tds: -1 } }), NOW).errors).toContain('TDS (mg/L) must be 0 or more.');
  });
});

describe('valid entries set only the existing evidence fields, with no defaults', () => {
  it('survey -> ertSurvey with the entered range and its source', () => {
    const v = ok(validateSurvey(survey({ reportFile: { name: 'TEST.pdf', sha256: 'a'.repeat(64) } }), NOW));
    expect(Object.keys(v)).toEqual(['ertSurvey']);
    expect(v.ertSurvey).toMatchObject({ aquiferDepthM: 42, aquiferThicknessM: 24, contractor: 'TEST Geophysics Ltd', surveyDate: '2026-10-01' });
    expect(v.ertSurvey).not.toHaveProperty('resistivityOhmM');
    expect(v.ertSurvey!.provenance).toMatchObject({ reference: 'TEST-VES-01', reportFile: { name: 'TEST.pdf', sha256: 'a'.repeat(64) } });
  });
  it('constant-rate test -> pumpTest: the tested rate, drawdown and recovery from the entered levels', () => {
    const v = ok(validatePumpingTest(constantRate(), NOW));
    expect(Object.keys(v)).toEqual(['pumpTest']);
    expect(v.pumpTest).toMatchObject({ sustainableYieldM3Hr: 3.2, drawdownM: 23.5, recoveryPercent: 95, testDurationHrs: 24, staticWaterLevelM: 18 });
    expect(v.pumpTest).not.toHaveProperty('transmissivityM2Day');
    expect(v.pumpTest).not.toHaveProperty('storativity');
  });
  it('step test -> stepDrawdownTest with drawdowns from the entered levels', () => {
    const v = ok(validatePumpingTest(stepTest(), NOW));
    expect(Object.keys(v)).toEqual(['stepDrawdownTest']);
    expect(v.stepDrawdownTest!.steps.map((s) => s.drawdown_m)).toEqual([4, 9, 16]);
  });
  it('lab -> labWaterAnalysis with only the reported parameters; values keep the "Measured:" label', () => {
    const v = ok(validateLabAnalysis(lab(), NOW));
    const l = v.labWaterAnalysis as unknown as Record<string, unknown>;
    expect(l).toMatchObject({ labName: 'TEST Water Lab', sampleDate: '2026-11-11', pH: 7.4, tds: 640, fluoride: 0.8 });
    expect(l).not.toHaveProperty('coliform');
    expect(l).not.toHaveProperty('nitrate');
    expect(labSourceLabel(l)).toBe('Measured: laboratory test (TEST Water Lab, sampled 2026-11-11)');
  });
});

describe('entered evidence -> the gate (unchanged conditions)', () => {
  const S = ok(validateSurvey(survey(), NOW));
  const P = ok(validatePumpingTest(constantRate(), NOW));
  const D = ok(validatePumpingTest(stepTest(), NOW));
  const L = ok(validateLabAnalysis(lab(), NOW));
  const gate = (fd: Partial<FieldValidationData> | undefined) => evidenceGate({ siteEvidence: siteEvidenceFrom(fd as FieldValidationData) });

  it('no evidence: no depth, yield or cost', () => {
    expect(gate(undefined)).toMatchObject({ depth: false, yield: false, cost: false });
    expect(gate({})).toMatchObject({ depth: false, yield: false, cost: false });
    expect(gate(L)).toMatchObject({ depth: false, yield: false, cost: false });
  });
  it('a survey only: depth only, cited', () => {
    const g = gate(S);
    expect(g).toMatchObject({ depth: true, yield: false, cost: false });
    expect(g.citations.depth).toBe('VES survey (TEST Geophysics Ltd, 2026-10-01, Schlumberger array, IPI2Win inversion, report TEST-VES-01): interpreted aquifer 42-66 m');
    expect(g.citations.yield).toBeUndefined();
  });
  it('a pump test only: yield only, cited with the test reference', () => {
    const g = gate(P);
    expect(g).toMatchObject({ depth: false, yield: true, cost: false });
    expect(g.citations.yield).toMatch(/^constant-rate pumping test \(TEST Drillers, 2026-11-10, constant-rate test, report TEST-PT-07\): tested rate 3.2 m³\/h for 24 h/);
    expect(gate(D)).toMatchObject({ depth: false, yield: true, cost: false });
    expect(gate(D).citations.yield).toMatch(/highest step rate tested 3 m³\/h.*report TEST-SD-02|report TEST-SD-02.*highest step rate tested 3 m³\/h/);
  });
  it('both: cost allowed', () => {
    expect(gate({ ...S, ...P })).toMatchObject({ depth: true, yield: true, cost: true });
    expect(gate({ ...S, ...D, ...L })).toMatchObject({ depth: true, yield: true, cost: true });
  });
  it('the checklist says what is still needed', () => {
    const none = evidenceChecklist({} as FieldValidationData);
    expect(none.map((x) => [x.figure, x.ok])).toEqual([['Drilling depth', false], ['Yield', false], ['Project cost', false]]);
    expect(none[0].needs[0]).toMatch(/geophysical survey \(VES or ERT\)/);
    const surveyed = evidenceChecklist(S as FieldValidationData);
    expect(surveyed[0]).toMatchObject({ ok: true, needs: [] });
    expect(surveyed[2].needs).toContain('The pumping test (yield).');
    expect(surveyed[2].needs).not.toContain('The geophysical survey (drilling depth).');
  });
});

describe('the yield is the tested rate or the engine analysis of entered data, never invented', () => {
  const desktop = { recommendedDepth: 90, estimatedYield: 7.7, probability: 0.6 } as unknown as Parameters<typeof calibrateWithFieldData>[0];
  it('constant-rate: calibrated yield = tested rate', () => {
    const P = ok(validatePumpingTest(constantRate(), NOW));
    expect(calibrateWithFieldData(desktop, P as FieldValidationData).calibratedYield_m3h).toBe(3.2);
  });
  it('step test only: calibrated yield = highest step rate tested, not the desktop 7.7', () => {
    const D = ok(validatePumpingTest(stepTest(), NOW));
    const c = calibrateWithFieldData(desktop, D as FieldValidationData);
    expect(c.calibratedYield_m3h).toBe(3);
    expect(c.calibrationNotes.join(' ')).toMatch(/highest step rate tested 3 m³\/hr/);
  });
  it('survey only: no transmissivity, storativity or resistivity is made up', () => {
    const S = ok(validateSurvey(survey(), NOW));
    const c = calibrateWithFieldData(desktop, S as FieldValidationData);
    expect(c.calibrationNotes.join(' ')).toMatch(/resistivity: not given in the survey entry/);
    const P = ok(validatePumpingTest(constantRate(), NOW));
    const cp = calibrateWithFieldData(desktop, P as FieldValidationData);
    expect(cp.aquiferParameters).toBeUndefined();
    expect(cp.calibrationNotes.join(' ')).not.toMatch(/Transmissivity: undefined/);
  });
  it('pump-test analysis uses the measured static level', () => {
    const P = ok(validatePumpingTest(constantRate(), NOW));
    const a = buildFieldPumpTestAnalysis(P.pumpTest, 90).analysis!;
    expect(a.assumptions.join(' ')).toMatch(/Static water level 18.00 m, as measured in the test/);
    expect(a.assumptions.join(' ')).not.toMatch(/30% of the modelled depth/);
  });
});
