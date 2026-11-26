// @vitest-environment jsdom
/**
 * Management NO-GO findings on 60afcd15 (2026-11-26), corrected by mechanism:
 *  1. CRITICAL imported job cards: an imported file is never proof that a STOP was resolved.
 *  2. F10 units: every pressure and temperature has an explicit unit; psi/bar/°F converted.
 *  3. F11 charging over-voltage: protective limit; battery observations are STOPs.
 *  4. Cross-device: safety status is held on this device only (notice everywhere).
 * TEST values only.
 */
import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react';
import GuidedDiagnosisPanel from '@/components/generator-oracle/panels/GuidedDiagnosisPanel';
import ServiceManagementPanel from '@/components/generator-oracle/panels/ServiceManagementPanel';
import { CHARGING, LOW_OIL_PRESSURE, OVERHEATING } from '@/lib/generator-oracle/diagnostics/families';
import { diagnose, SAFEGUARD_LABEL, UNCLASSIFIED_PROTECTIVE } from '@/lib/generator-oracle/diagnostics/engine';
import { diagnosisRecord, REFUSED_UNIT_ALL, REFUSED_UNIT_SOME } from '@/lib/generator-oracle/diagnostics/jobCardRecord';
import { convertUnits, PSI_TO_KPA } from '@/lib/generator-oracle/diagnostics/units';
import {
  DEVICE_ONLY_NOTICE, IMPORTED_NOTICE, READINGS_NOT_TAKEN_STOP, SIGNED_OFF_ELSEWHERE, SIGNOFF, cardContentHash, jobCardReport, signOffSummary,
  type Asset, type GuidedSafetyAdd, type JobCard,
} from '@/lib/generator-oracle/service/maintenance';
import { jobCardToPdf } from '@/lib/generator-oracle/service/jobCardPdf';
import { apply, deserialise, emptyState, importState, loadState, serialise, STORE_KEY, type ServiceAction, type ServiceState } from '@/lib/generator-oracle/service/store';

type Pdfjs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
let pdfjs: Pdfjs;
beforeAll(async () => {
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
});
const pdfText = async (card: JobCard, asset: Asset) => {
  const doc = await pdfjs.getDocument({ data: jobCardToPdf(card, asset).slice() }).promise;
  let t = '';
  for (let p = 1; p <= doc.numPages; p++) t += (await (await doc.getPage(p)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ') + ' ';
  return t.replace(/\s+/g, ' ');
};
afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks(); });

const T0 = '2026-11-26T08:00:00.000Z';
const T1 = '2026-11-26T09:00:00.000Z';
const T2 = '2026-11-26T10:00:00.000Z';
const go = (s: ServiceState, a: ServiceAction) => { const r = apply(s, a); if (r.error) throw new Error(r.error); return r.state; };
const STOP = { key: 'knock-seizure|STOP THE SET: TEST', from: 'Knocking, bearing noise or seizure', since: T0, message: 'STOP THE SET: TEST' };
const latchedAdd: GuidedSafetyAdd = { stops: [STOP], clearances: [], hold: null };
const base = () => go(go(emptyState(), { type: 'saveAsset', asset: { make: 'TEST', model: 'T', engine: 'E', controller: 'C', serial: 'S', ratedKva: 100 } } as ServiceAction),
  { type: 'openCard', card: { id: 'JC-1', assetId: 'A-1', opened: '2026-11-26', reportedFault: 'TEST', technician: 'TECH-A' } } as ServiceAction);
const complete = (s: ServiceState, findings = 'TEST inspected') => {
  const a = apply(s, { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: 'TECH-A', at: T2 } as ServiceAction);
  if (a.error) return a.error;
  const b = apply(a.state, { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: T2, update: { findings, tasks: ['TEST'], engineHoursAtJob: 10, readings: [{ name: 'TEST', value: 1, unit: 'V' }] } } as ServiceAction);
  return b.error;
};
/** A card with a latched STOP and a clearance of it, made on "another device", exported. */
const exported = () => {
  let s = go(base(), { type: 'recordGuidedSafety', cardId: 'JC-1', at: T0, safety: latchedAdd } as ServiceAction);
  s = go(s, { type: 'recordGuidedSafety', cardId: 'JC-1', at: T1, safety: { stops: [], clearances: [{ ...STOP, clearedAt: T1, by: 'OTHER', reason: 'TEST cleared elsewhere' }], hold: null } } as ServiceAction);
  expect(complete(s)).toBeNull(); // on the device where it was cleared, the card could complete
  return JSON.parse(serialise(s));
};
const reimport = (j: unknown) => { const r = importState(JSON.stringify(j), T1); if (!r.ok) throw new Error(r.error); return r.state; };

describe('1. CRITICAL: an imported file is never proof that a STOP was resolved', () => {
  it('an imported card (clearance from the other device) is IMPORTED — UNVERIFIED and does not complete; the imported clearance does not resolve the STOP', () => {
    const s = reimport(exported());
    const card = s.jobCards[0];
    expect(card.imported).toBeDefined();
    expect(complete(s)).toMatch(/IMPORTED — UNVERIFIED card/);
    expect(complete(s)).toMatch(/still latched with no recorded clearance/);
    const txt = jobCardReport(card, s.assets[0]);
    expect(txt).toContain(IMPORTED_NOTICE);
    expect(txt).toMatch(/SAFETY — IMPORTED CARD \(UNVERIFIED on this device\)/);
  });
  it('tamper: guidedSafety removed from the file → still blocked (a fresh assessment on this device is required)', () => {
    const j = exported(); delete j.jobCards[0].guidedSafety;
    const s = reimport(j);
    expect(complete(s)).toMatch(/fresh Guided Diagnosis record added on this device/);
    expect(complete(s)).toMatch(/fresh in-person reassessment/);
  });
  it('tamper: forged reassessment and forged resolved hold → not proof; forged clearance → not proof', () => {
    const j = exported();
    j.jobCards[0].guidedSafety.holds = [{ since: T0, text: 'x', why: 'y', resolvedAt: T1 }];
    j.jobCards[0].guidedSafety.reassessments = [{ at: T1, by: 'FORGED', reason: 'FORGED reassessment text', confirmed: true }];
    j.jobCards[0].guidedSafety.clearances.push({ ...STOP, clearedAt: T2, by: 'FORGED', reason: 'FORGED clearance' });
    const s = reimport(j);
    expect(complete(s)).toMatch(/SAFETY HOLD|still latched|IMPORTED/);
    expect(complete(s, `TEST ${READINGS_NOT_TAKEN_STOP}`)).toMatch(/fresh in-person reassessment/);
  });
  it('tamper: an edited sign-off hash (recomputed) is shown as signed off on another device — UNVERIFIED here', () => {
    let s = go(base(), { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: 'TECH-A', at: T0 } as ServiceAction);
    s = go(s, { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: T0, update: { findings: 'TEST', tasks: ['TEST'], engineHoursAtJob: 1, readings: [{ name: 'TEST', value: 1, unit: 'V' }] } } as ServiceAction);
    s = go(s, { type: 'transition', cardId: 'JC-1', to: SIGNOFF, by: 'SUPERVISOR', at: T1 } as ServiceAction);
    const j = JSON.parse(serialise(s));
    // Edit the content and recompute the hash, as anyone can.
    const c = j.jobCards[0]; c.findings = 'EDITED'; const h = cardContentHash(c, c.signOffTypedName, c.signOffRecordedOn); c.signOffHash = h; c.log[c.log.length - 1].hash = h;
    const imp = reimport(j);
    const sum = signOffSummary(imp.jobCards[0]).join('\n');
    expect(sum).toContain(SIGNED_OFF_ELSEWHERE);
    expect(sum).not.toMatch(/Card content matches the hash recorded at sign-off/);
  });
  it('fresh assessment on this device: phrase + fresh reassessment completes; a clean fresh record + reassessment completes when nothing was latched', () => {
    const s = reimport(exported());
    const withPhrase = go(s, { type: 'recordHoldReassessment', cardId: 'JC-1', at: T2, by: 'TECH-B', reason: 'Inspected in person on site', confirmed: true } as ServiceAction);
    expect(complete(withPhrase)).toMatch(/still latched/);
    expect(complete(withPhrase, `TEST ${READINGS_NOT_TAKEN_STOP}`)).toBeNull();
    // A card with no STOPs from another device: a clean fresh record + reassessment.
    const j = JSON.parse(serialise(base()));
    let t = reimport(j);
    expect(complete(t)).toMatch(/IMPORTED/);
    t = go(t, { type: 'recordGuidedSafety', cardId: 'JC-1', at: T2, safety: { stops: [], clearances: [], hold: null } } as ServiceAction);
    expect(complete(t)).toMatch(/fresh in-person reassessment/);
    t = go(t, { type: 'recordHoldReassessment', cardId: 'JC-1', at: T2, by: 'TECH-B', reason: 'Inspected in person on site', confirmed: true } as ServiceAction);
    expect(complete(t)).toBeNull();
  });
  it('this device\'s own saved data is not marked imported; a file always is', () => {
    const s = go(base(), { type: 'recordGuidedSafety', cardId: 'JC-1', at: T0, safety: latchedAdd } as ServiceAction);
    localStorage.setItem(STORE_KEY, serialise(s));
    expect(loadState(localStorage).state.jobCards[0].imported).toBeUndefined();
    const r = deserialise(serialise(reimport(JSON.parse(serialise(s)))));
    expect(r.ok && r.state.jobCards[0].imported).toBeTruthy(); // kept across reloads
  });
});

describe('2. F10: explicit units for pressures and temperatures', () => {
  it('conversions: 20 psi = 137.9 kPa, 2 bar = 200 kPa, 212 °F = 100 °C', () => {
    const u = convertUnits(LOW_OIL_PRESSURE, { oilPressure: '20', 'oilPressure.unit': 'psi', oemMinOilPressure: '2', 'oemMinOilPressure.unit': 'bar' });
    expect(Number(u.raw.oilPressure)).toBeCloseTo(20 * PSI_TO_KPA, 6);
    expect(Number(u.raw.oemMinOilPressure)).toBe(200);
    expect(Number(convertUnits(OVERHEATING, { coolantTemp: '212', 'coolantTemp.unit': '°F' }).raw.coolantTemp)).toBeCloseTo(100, 6);
  });
  it('20 psi against a 150 kPa minimum → STOP (137.9 kPa); the record shows the value entered and the converted value', () => {
    const rec = diagnosisRecord(LOW_OIL_PRESSURE, { oilPressure: '20', 'oilPressure.unit': 'psi', oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa', 'oemMinOilPressure.class': 'shutdown' });
    expect(rec.result.stopActive).toBe(true);
    expect(rec.findings).toMatch(/Oil pressure measured: entered 20 psi = 137\.9 kPa/);
    expect(rec.readings[0].name).toMatch(/entered 20 psi/);
  });
  it('no unit → refused, never used, so it cannot avoid a STOP: running checks withheld, no running-only next check', () => {
    const rec = diagnosisRecord(LOW_OIL_PRESSURE, { oilPressure: '20', oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa', oilLevel: 'ok' });
    expect(rec.result.invalid.some((i) => /choose the unit/.test(i.reason))).toBe(true);
    expect(rec.result.runningWithheld).toBe(true);
    // The oil-pressure reading needs the engine running, so it is not offered as the next check while withheld.
    expect(rec.result.nextQuestion?.needsRunning ?? false).toBe(false);
    for (const c of rec.result.ranked) for (const r of LOW_OIL_PRESSURE.causes.find((x) => x.id === c.id)?.runningChecks ?? []) expect(c.actions).not.toContain(r);
    expect(rec.findings).toMatch(/REFUSED: Oil pressure measured: choose the unit/);
  });
  it('unknown unit and implausible values are refused', () => {
    expect(diagnosisRecord(LOW_OIL_PRESSURE, { oilPressure: '20', 'oilPressure.unit': 'mmHg' }).result.invalid[0].reason).toMatch(/not one of kPa, bar, psi/);
    // 300 psi = 2068 kPa, above the physical range of the question.
    expect(diagnosisRecord(LOW_OIL_PRESSURE, { oilPressure: '300', 'oilPressure.unit': 'psi' }).result.invalid.some((i) => i.q === 'oilPressure')).toBe(true);
  });
  it('the panel asks for the unit of every pressure and temperature (no default)', async () => {
    render(<GuidedDiagnosisPanel />);
    await act(async () => {});
    screen.getAllByRole('tab').find((t) => t.textContent === LOW_OIL_PRESSURE.title)!.click();
    await act(async () => {});
    const sel = screen.getAllByLabelText('Unit: Oil pressure measured')[0] as HTMLSelectElement;
    expect(sel.value).toBe('');
    expect([...sel.options].map((o) => o.value)).toEqual(['', 'kPa', 'bar', 'psi']);
  });
});

describe('3. F11: charging over-voltage is protective; battery observations are STOPs', () => {
  const ch = (a: Record<string, string | number>) => diagnose(CHARGING, { systemVoltage: '24', batteryCondition: 'normal', ...a });
  it('equality reaches the limit; unclassified → conservative STOP + label; shutdown → STOP; warning → CAUTION', () => {
    const un = ch({ runVoltage: 29, oemChargeMax: 29 });
    expect(un.stopActive).toBe(true);
    const s = un.stops.find((x) => x.level === 'STOP')!;
    expect(s.message).toBe(UNCLASSIFIED_PROTECTIVE);
    expect(s.label).toBe(SAFEGUARD_LABEL);
    expect(ch({ runVoltage: 29, oemChargeMax: 29, 'oemChargeMax.class': 'shutdown' }).stopActive).toBe(true);
    const w = ch({ runVoltage: 29, oemChargeMax: 29, 'oemChargeMax.class': 'warning' });
    expect(w.stopActive).toBe(false);
    expect(w.limits.find((l) => l.id === 'charge-max')!.level).toBe('CAUTION');
    expect(ch({ runVoltage: 28.9, oemChargeMax: 29 }).stopActive).toBe(false);
  });
  it('no limit entered → NOT VERIFIED, no threshold invented', () => {
    const r = ch({ runVoltage: 35 });
    expect(r.limits.find((l) => l.id === 'charge-max')!.status).toBe('not-verified');
    expect(r.stopActive).toBe(false);
  });
  it('hot or swollen, gassing / rotten-egg smell, boiling electrolyte → STOP with no running check', () => {
    for (const c of ['hot-swollen', 'gassing', 'boiling']) {
      const r = ch({ batteryCondition: c });
      expect(r.stopActive, c).toBe(true);
      for (const k of r.ranked) for (const x of CHARGING.causes.find((y) => y.id === k.id)?.runningChecks ?? []) expect(k.actions, c).not.toContain(x);
      expect(r.nextQuestion?.needsRunning ?? false, c).toBe(false);
    }
    expect(CHARGING.stopRules.find((x) => (x.when as { value?: string }).value === 'boiling')!.message).toMatch(/no running checks/);
  });
  it('over-charging as a leading cause withholds running checks', () => {
    const r = ch({ runVoltage: 30, oemChargeMax: 29, 'oemChargeMax.class': 'warning' });
    expect(r.ranked[0].id).toBe('alt-over');
    expect(r.runningWithheld).toBe(true);
  });
});

describe('4. Cross-device: safety status is held on this device only', () => {
  it('the exact notice on Guided Diagnosis, on the job-card screen, and in the .txt and PDF of every card', async () => {
    expect(DEVICE_ONLY_NOTICE).toBe('Safety status is held on this device only. A clearance recorded on another device is not known here and is not established.');
    render(<GuidedDiagnosisPanel />);
    expect(screen.getByTestId('gd-device-only-notice').textContent).toBe(DEVICE_ONLY_NOTICE);
    cleanup();
    render(<ServiceManagementPanel />);
    await act(async () => {});
    expect(screen.getByTestId('device-only-notice').textContent).toContain(DEVICE_ONLY_NOTICE);
    const s = base();
    expect(jobCardReport(s.jobCards[0], s.assets[0])).toContain(DEVICE_ONLY_NOTICE);
    expect(await pdfText(s.jobCards[0], s.assets[0])).toContain('Safety status is held on this device only');
  }, 60_000);
});

describe('F10-REMAINING: a refused protective value is never safer than a typed one', () => {
  const lop = (raw: Record<string, string>) => diagnosisRecord(LOW_OIL_PRESSURE, raw);
  it('"1" with no unit vs 150 kPa: a STOP in every unit → the ordinary STOP (latched), running checks withheld', () => {
    const r = lop({ oilPressure: '1', oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa' });
    expect(r.result.stopActive).toBe(true);
    const s = r.result.stops[0];
    expect(s.message).toBe(REFUSED_UNIT_ALL);
    expect(s.refusedInput).toBeUndefined(); // latched like any STOP
    expect(s.label).toBe(SAFEGUARD_LABEL);
    expect(r.result.runningWithheld).toBe(true);
    expect(r.findings.split('\n')[0]).toBe(`STOP: ${REFUSED_UNIT_ALL}`);
  });
  it('limit "150" with no unit + 20 psi (137.9 kPa) reaches 150 kPa and 150 psi (150 bar is outside the range) → STOP; "40" with no unit vs 150 kPa: some units → STOP first, not latched', () => {
    const r = lop({ oilPressure: '20', 'oilPressure.unit': 'psi', oemMinOilPressure: '150' });
    expect(r.result.stopActive).toBe(true);
    expect(r.result.stops[0].message).toBe(REFUSED_UNIT_ALL);
    // 40 kPa and 40 psi (275.8 kPa) differ: 40 kPa reaches, 40 psi does not.
    const some = lop({ oilPressure: '40', oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa' }).result;
    expect(some.stopActive).toBe(true);
    expect(some.stops[0].message).toBe(REFUSED_UNIT_SOME);
    expect(some.stops[0].refusedInput).toBe(true);
  });
  it('a refused protective value that reaches nothing still raises the labelled safeguard STOP (not a number, out of range)', () => {
    for (const raw of [{ oilPressure: 'abc', 'oilPressure.unit': 'kPa' }, { oilPressure: '2000', 'oilPressure.unit': 'kPa' }]) {
      const r = lop({ ...raw, oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa' });
      expect(r.result.stops[0].message, JSON.stringify(raw)).toMatch(/^STOP — protective value refused \(Oil pressure measured\)/);
      expect(r.result.runningWithheld).toBe(true);
    }
  });
  it('24 V system with a 12 V band: refused → conservative STOP, running checks withheld (35 V and 28 V alike)', () => {
    for (const v of ['35', '28']) {
      const r = diagnosisRecord(CHARGING, { systemVoltage: '24', runVoltage: v, oemChargeMin: '13', oemChargeMax: '14.4' }).result;
      expect(r.stopActive, v).toBe(true);
      expect(r.stops[0].message).toMatch(/^STOP — protective value refused \(Highest regulated charging voltage/);
      expect(r.runningWithheld).toBe(true);
    }
  });
  it('the job card: a refused value blocks completion with test-run readings; recording again with the unit chosen (inside) clears it', () => {
    const add = (raw: Record<string, string>): GuidedSafetyAdd => {
      const rec = diagnosisRecord(LOW_OIL_PRESSURE, raw);
      const stops = rec.result.stops.filter((s) => s.level === 'STOP').map((s) => ({ key: `low-oil-pressure|${s.message}`, from: LOW_OIL_PRESSURE.title, since: T0, message: s.message, fromRecord: true as const, ...(s.refusedInput ? { refusedInput: true as const } : {}) }));
      return { stops, clearances: [], hold: null, family: 'low-oil-pressure' };
    };
    let s = go(base(), { type: 'recordGuidedSafety', cardId: 'JC-1', at: T0, safety: add({ oilPressure: '200', oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa' }) } as ServiceAction);
    expect(complete(s)).toMatch(/still latched/);
    expect(complete(s, `TEST ${READINGS_NOT_TAKEN_STOP}`)).toBeNull();
    s = go(s, { type: 'recordGuidedSafety', cardId: 'JC-1', at: T1, safety: add({ oilPressure: '200', 'oilPressure.unit': 'kPa', oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa' }) } as ServiceAction);
    expect(complete(s)).toBeNull();
    // A record for another family does not count as the correction.
    let t = go(base(), { type: 'recordGuidedSafety', cardId: 'JC-1', at: T0, safety: add({ oilPressure: '200', oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa' }) } as ServiceAction);
    t = go(t, { type: 'recordGuidedSafety', cardId: 'JC-1', at: T1, safety: { stops: [], clearances: [], hold: null, family: 'charging' } } as ServiceAction);
    expect(complete(t)).toMatch(/still latched/);
  });
  it('the panel: a value typed without its unit shows the STOP first and withholds; choosing the unit (value inside) clears it with nothing latched', async () => {
    render(<GuidedDiagnosisPanel />);
    await act(async () => {});
    screen.getAllByRole('tab').find((x) => x.textContent === LOW_OIL_PRESSURE.title)!.click();
    await act(async () => {});
    const set = (label: string | RegExp, v: string) => act(() => { fireEvent.change(screen.getAllByLabelText(label)[0], { target: { value: v } }); });
    set('Unit: OEM minimum oil pressure at this speed (manual)', 'kPa');
    set(/^OEM minimum oil pressure at this speed/, '150');
    set(/^Oil pressure measured/, '40');
    act(() => { fireEvent.blur(screen.getAllByLabelText(/^Oil pressure measured/)[0]); });
    expect(screen.getByRole('alert').textContent).toMatch(/^STOP · STOP — protective value entered without its unit: in at least one possible unit it reaches the limit/);
    expect(screen.queryByTestId('gd-stop-hold')).not.toBeNull();
    set('Unit: Oil pressure measured', 'psi'); // 40 psi = 275.8 kPa: inside
    expect(screen.queryByTestId('gd-stop-hold')).toBeNull();
    expect(JSON.parse(localStorage.getItem('eims-oracle-guided-diagnosis-v1')!).latched).toEqual([]);
  });
});
