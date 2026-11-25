/**
 * Regression tests from the independent safety review of 40195d6f (2026-11-25,
 * ORACLE-INDEPENDENT-SAFETY-REVIEW.md + scratch/oracle-review.test.ts). Each of
 * the reviewer's reproductions is kept with its inputs, but asserts the REQUIRED
 * behaviour. TEST limit values only.
 */
import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  NO_CRANK, LOW_OIL_PRESSURE, OVERHEATING, KNOCK_SEIZURE, NO_VOLTAGE,
  FREQUENCY_HUNTING, OVERSPEED, CHARGING, EXHAUST_SMOKE, FAMILIES,
} from '@/lib/generator-oracle/diagnostics/families';
import { diagnose, parseDecimal, UNCLASSIFIED_PROTECTIVE, SAFEGUARD_LABEL } from '@/lib/generator-oracle/diagnostics/engine';
import { answersFromRaw, type RawAnswers } from '@/lib/generator-oracle/diagnostics/session';
import { diagnosisRecord, recordToCardUpdate, sessionRecord } from '@/lib/generator-oracle/diagnostics/jobCardRecord';
import { publishedLimitFor } from '@/lib/generator-oracle/diagnostics/oemReferences';
import { SCREEN_BUCKET, SCREEN_QUESTIONS, isScreenKey } from '@/lib/generator-oracle/diagnostics/safetyScreen';
import { openJobCard, jobCardReport, type Asset } from '@/lib/generator-oracle/service/maintenance';
import { jobCardToPdf } from '@/lib/generator-oracle/service/jobCardPdf';
import type { Condition, DiagnosisResult, FaultFamily, NumberQuestion } from '@/lib/generator-oracle/diagnostics/types';

const run = (f: FaultFamily, raw: Record<string, string>) => diagnose(f, answersFromRaw(f, raw));
/** What the screen and the job card show as steps: actions of the top three causes with a score above 0. */
const shownSteps = (r: DiagnosisResult) => r.ranked.slice(0, 3).filter((c) => c.score > 0).flatMap((c) => c.actions);
const allActions = (r: DiagnosisResult) => r.ranked.flatMap((c) => c.actions);
const asset: Asset = { id: 'A1', make: 'X', model: 'Y', engine: 'E', controller: 'C', serial: 'S', ratedKva: 100 };
const card = (findings: string, rec: ReturnType<typeof diagnosisRecord>) =>
  ({ ...openJobCard({ id: 'JC1', assetId: 'A1', opened: '2026-11-25', reportedFault: 'TEST', technician: 'T' }), ...recordToCardUpdate({ findings, readings: [] }, rec) }) as ReturnType<typeof openJobCard>;

// Steps that need the engine running, cranking or live circuits (never shown under a STOP).
const RUNNING_STEP = /\b(re-?start|start (the|it|using)|run the|running|on load|under load|apply load|load bank|live\b|energi[sz]e|while cranking|cranking|crank (it|the)|cut-out test|flash the field|reduce (the )?load|temperature drop|mechanical (test )?gauge|consumption|speed\/governor checks|stage motor|in service|supervised run)/i;
// CAUTION wording that implies continued running (never shown after a STOP).
const KEEP_RUNNING = /reduce the load|re-?measure|watch the battery|governor checks|shed sensitive loads|before further diagnosis|measure live|duty cycle|returns? to (normal duty|service)|if it rises/i;

function assertStopFirstAndSafe(f: FaultFamily, r: DiagnosisResult, where: string) {
  expect(r.stopActive, where).toBe(true);
  expect(r.stops[0].level, where).toBe('STOP');
  const firstCaution = r.stops.findIndex((s) => s.level === 'CAUTION');
  if (firstCaution >= 0) expect(r.stops.slice(firstCaution).every((s) => s.level === 'CAUTION'), where).toBe(true);
  for (const s of r.stops.filter((x) => x.level === 'CAUTION')) expect(s.message, `${where}: caution after STOP`).not.toMatch(KEEP_RUNNING);
  for (const a of allActions(r)) expect(a, `${where}: action under STOP`).not.toMatch(RUNNING_STEP);
  for (const c of r.ranked) for (const rc of f.causes.find((x) => x.id === c.id)!.runningChecks ?? []) expect(c.actions, where).not.toContain(rc);
  if (r.nextQuestion) expect(r.nextQuestion.needsRunning, `${where}: next ${r.nextQuestion.id}`).toBeFalsy();
}

describe('F1 (BLOCKING): no running, cranking or live step under a STOP — all 10 families', () => {
  it.each([
    ['knock: STOP THE SET', KNOCK_SEIZURE, { where: 'top', smoke: 'black' }, /Cylinder cut-out test/],
    ['no-crank: seized + corroded terminals (B12)', NO_CRANK, { barOver: 'locked', terminals: 'corroded' }, /while cranking/],
    ['low oil: knocking + sender + low level', LOW_OIL_PRESSURE, { knock: 'yes', gauge: 'sender', oilLevel: 'low' }, /mechanical gauge|blue smoke/],
    ['no-voltage: insulation STOP + residual none + overload', NO_VOLTAGE, { insulation: '0.5', oemMinInsulation: '1', 'oemMinInsulation.class': 'shutdown', residual: 'none', loadPct: '120' }, /Flash the field|Reduce load; stage motor starts/],
    ['overheating: coolant STOP + radiator blocked + overload', OVERHEATING, { coolantTemp: '105', oemAlarmCoolantTemp: '100', 'oemAlarmCoolantTemp.class': 'shutdown', radiator: 'blocked', loadPct: '120' }, /temperature drop across the core|Reduce load/],
    ['exhaust smoke: milky oil + overload', EXHAUST_SMOKE, { oilCondition: 'milky', colour: 'black', loadPct: '120' }, /Reduce the load to within the rating/],
  ] as const)('%s', (name, f, raw, bad) => {
    const r = run(f as FaultFamily, raw as Record<string, string>);
    expect(shownSteps(r).some((s) => bad.test(s))).toBe(false);
    assertStopFirstAndSafe(f as FaultFamily, r, name);
  });
  it('knock: the running-engine oil-pressure question is not offered under the STOP', () => {
    const r = run(KNOCK_SEIZURE, { where: 'engine', metal: 'not-checked' });
    expect(r.nextQuestion?.id).not.toBe('pressureLow');
    expect(KNOCK_SEIZURE.questions.find((q) => q.id === 'pressureLow')!.needsRunning).toBe(true);
  });
  it('every action of every family is safe with the engine stopped and isolated (actions are shown under a STOP)', () => {
    for (const f of FAMILIES) for (const c of f.causes) for (const a of c.actions) expect(a, `${f.id}.${c.id}`).not.toMatch(RUNNING_STEP);
  });
  it('every running check in every family is conditional on no STOP being active', () => {
    for (const f of FAMILIES) for (const c of f.causes) for (const rc of c.runningChecks ?? []) expect(rc, `${f.id}.${c.id}`).toMatch(/^Only when no STOP is active/);
  });
  it('every STOP rule and every protective limit of all 10 families: STOP first, then nothing running', () => {
    const satisfy = (f: FaultFamily, c: Condition): Record<string, string> => {
      const num = (id: string) => f.questions.find((q) => q.id === id) as NumberQuestion;
      if ('all' in c) return Object.assign({}, ...c.all.map((x) => satisfy(f, x)));
      if ('any' in c) return satisfy(f, c.any[0]);
      if (c.op === 'is') return { [c.q]: Array.isArray(c.value) ? c.value[0] : c.value };
      if (c.op === 'lt' || c.op === 'le') return { [c.q]: String(num(c.q).min) };
      if (c.op === 'gt' || c.op === 'ge') return { [c.q]: String(num(c.q).max) };
      if (!('ref' in c)) return {};
      const q = num(c.q); const ref = num(c.ref);
      if (c.op === 'ltRef' || c.op === 'leRef') return { [c.q]: String(q.min), [c.ref]: String(Math.max(ref.min, q.min + 1)) };
      return { [c.q]: String(q.max), [c.ref]: String(Math.min(ref.max, q.max - 1)) };
    };
    let n = 0;
    for (const f of FAMILIES) {
      for (const sr of f.stopRules.filter((s) => s.level === 'STOP')) {
        const base = satisfy(f, sr.when);
        const variants = [base, ...f.questions.filter((q) => q.kind === 'choice' && base[q.id] === undefined && !isScreenKey(q.id)).flatMap((q) => (q.kind === 'choice' ? q.options : []).map((o) => ({ ...base, [q.id]: o.value })))];
        for (const v of variants) { const r = run(f, v); if (!r.stopActive) continue; assertStopFirstAndSafe(f, r, `${f.id}: ${sr.message.slice(0, 40)}`); n++; }
      }
      for (const l of (f.limits ?? []).filter((x) => x.protective)) {
        const lq = f.questions.find((q) => q.id === l.limit) as NumberQuestion;
        const r = run(f, { [l.limit]: String(lq.max), [l.reading]: String(lq.max) });
        if (r.limits.find((x) => x.id === l.id)!.status !== 'reached') continue;
        assertStopFirstAndSafe(f, r, `${f.id}: ${l.id}`); n++;
      }
    }
    expect(n).toBeGreaterThan(100);
  }, 60000); // hundreds of STOP states: allow time on a loaded machine
});

describe('F2 (BLOCKING): no CAUTION that implies continued running after a STOP', () => {
  it.each([
    ['low oil: pressure STOP + oil-temp warning', LOW_OIL_PRESSURE, { oilPressure: '100', oemMinOilPressure: '150', 'oemMinOilPressure.class': 'shutdown', oilTemp: '130', oemMaxOilTemp: '130', 'oemMaxOilTemp.class': 'warning' }],
    ['overheating: combustion gas + coolant warning (addendum example)', OVERHEATING, { gasBubbles: 'yes', coolantTemp: '100', oemAlarmCoolantTemp: '100', 'oemAlarmCoolantTemp.class': 'warning' }],
    ['no-voltage: insulation STOP + frequency warning', NO_VOLTAGE, { insulation: '0.5', oemMinInsulation: '1', 'oemMinInsulation.class': 'shutdown', frequency: '45', oemMinFrequency: '48', 'oemMinFrequency.class': 'warning' }],
    ['exhaust smoke: milky + overload', EXHAUST_SMOKE, { oilCondition: 'milky', loadPct: '120' }],
    ['hunting: linkage STOP + swing warning', FREQUENCY_HUNTING, { linkage: 'disconnected', freqSwing: '2', oemMaxSwing: '1', 'oemMaxSwing.class': 'warning' }],
    ['low oil: knock + near tolerance', LOW_OIL_PRESSURE, { knock: 'yes', oilPressure: '155', oemMinOilPressure: '150', 'oemMinOilPressure.class': 'shutdown', 'oilPressure.tol': '10' }],
    ['charging: hot battery + charge-max warning (B9)', CHARGING, { batteryCondition: 'hot-swollen', systemVoltage: '24', runVoltage: '30', oemChargeMin: '26', oemChargeMax: '29', 'oemChargeMax.class': 'warning' }],
    ['low oil: knock + low level + metal + oil-temp warning (B8)', LOW_OIL_PRESSURE, { knock: 'yes', oilLevel: 'low', oilCondition: 'metal', oilTemp: '125', oemMaxOilTemp: '125', 'oemMaxOilTemp.class': 'warning' }],
  ] as const)('%s', (name, f, raw) => {
    const r = run(f as FaultFamily, raw as Record<string, string>);
    assertStopFirstAndSafe(f as FaultFamily, r, name);
    expect(r.stops.some((s) => s.level === 'CAUTION' && /^Also recorded for the investigation/.test(s.message)) || !r.limits.some((l) => l.level === 'CAUTION')).toBe(true);
  });
});

describe('F3 (BLOCKING): the most serious condition decides across families; shared safety screen', () => {
  it('every family asks the shared safety screen first', () => {
    for (const f of FAMILIES) {
      expect(f.questions.slice(0, SCREEN_QUESTIONS.length).map((q) => q.id)).toEqual(SCREEN_QUESTIONS.map((q) => q.id));
      expect(diagnose(f, {}).nextQuestion?.id).toBe('screen.alarm');
    }
  });
  it('a "yes" on any screen question is a STOP in every family', () => {
    for (const q of SCREEN_QUESTIONS) {
      const v = q.id === 'screen.alarm' ? 'shutdown' : 'yes';
      for (const f of FAMILIES) assertStopFirstAndSafe(f, run(f, { [q.id]: v }), `${f.id} ${q.id}`);
    }
  });
  it('management example (B11): warning-level coolant on Overheating + knocking with metal on Knock → STOP on the Overheating tab and its job-card record', () => {
    const session: RawAnswers = {
      overheating: { coolantTemp: '100', oemAlarmCoolantTemp: '100', 'oemAlarmCoolantTemp.class': 'warning', loadPct: '110', coolantLevel: 'low' },
      'knock-seizure': { where: 'engine', metal: 'yes' },
    };
    const rec = sessionRecord(OVERHEATING, session);
    assertStopFirstAndSafe(OVERHEATING, rec.result, 'overheating with knock elsewhere');
    expect(rec.result.stops.some((s) => s.origin === 'other-family' && /Knocking, bearing noise or seizure/.test(s.from ?? ''))).toBe(true);
    expect(rec.lines[0]).toMatch(/^STOP: /);
    expect(rec.findings).not.toMatch(/Reduce the load and check the airflow/);
  });
  it('the same facts entered on the shared screen give the STOP without visiting the Knock tab', () => {
    const session: RawAnswers = { [SCREEN_BUCKET]: { 'screen.knock': 'yes', 'screen.metal': 'yes' }, overheating: { coolantTemp: '100', oemAlarmCoolantTemp: '100', 'oemAlarmCoolantTemp.class': 'warning' } };
    assertStopFirstAndSafe(OVERHEATING, sessionRecord(OVERHEATING, session).result, 'screen');
  });
  it('coolant low with the temperature at the limit (warning) → STOP, no running next check', () => {
    const r = run(OVERHEATING, { coolantTemp: '100', oemAlarmCoolantTemp: '100', 'oemAlarmCoolantTemp.class': 'warning', coolantLevel: 'low' });
    assertStopFirstAndSafe(OVERHEATING, r, 'coolant low at limit');
    expect(r.nextQuestion?.id).not.toBe('gasBubbles');
  });
  it('an overspeed event recorded on Frequency hunting carries to the No-voltage tab', () => {
    const session: RawAnswers = { 'frequency-hunting': { overspeedTrip: 'yes' }, 'no-voltage': { residual: 'none' } };
    const nv = sessionRecord(NO_VOLTAGE, session);
    assertStopFirstAndSafe(NO_VOLTAGE, nv.result, 'no-voltage');
    // Review R7: the exact wording is kept; where it was raised is a separate field and line.
    expect(nv.result.stops[0].message).not.toMatch(/raised in/);
    expect(nv.result.stops[0].from).toMatch(/^Frequency unstable/);
  });
});

describe('F8 (BLOCKING): coolant loss + sweet exhaust smell → STOP whatever the smoke colour', () => {
  it('B13: coolantLoss=losing, smell=sweet, lightLoad=yes', () => {
    const r = run(EXHAUST_SMOKE, { coolantLoss: 'losing', smell: 'sweet', lightLoad: 'yes' });
    assertStopFirstAndSafe(EXHAUST_SMOKE, r, 'F8');
    expect(allActions(r).some((a) => /supervised run at higher load/.test(a))).toBe(false);
  });
  it('a leading "do not run" cause withholds running checks even without a STOP', () => {
    const r = run(EXHAUST_SMOKE, { coolantLoss: 'losing', lightLoad: 'yes' });
    expect(r.stopActive).toBe(false);
    expect(r.ranked.slice(0, 3).some((c) => c.id === 'coolant' && c.score > 0)).toBe(true);
    expect(r.runningWithheld).toBe(true);
    expect(allActions(r).some((a) => /supervised run/.test(a))).toBe(false);
  });
});

describe('F4: within the tolerance of a verified SHUTDOWN limit → STOP', () => {
  it.each([
    [LOW_OIL_PRESSURE, { oilPressure: '151', oemMinOilPressure: '150', 'oemMinOilPressure.class': 'shutdown', 'oilPressure.tol': '10' }],
    [OVERHEATING, { coolantTemp: '99', oemAlarmCoolantTemp: '100', 'oemAlarmCoolantTemp.class': 'shutdown', 'coolantTemp.tol': '2' }],
    [OVERSPEED, { peakRpm: '1949', oemTripRpm: '1950', 'oemTripRpm.class': 'shutdown', 'peakRpm.tol': '50' }],
    [LOW_OIL_PRESSURE, { oilPressure: '152', oemMinOilPressure: '150', 'oilPressure.tol': '5' }], // unclassified protective
  ] as const)('%#', (f, raw) => {
    const r = run(f as FaultFamily, raw as Record<string, string>);
    expect(r.limits.find((l) => l.status === 'near')!.level).toBe('STOP');
    assertStopFirstAndSafe(f as FaultFamily, r, 'F4');
  });
});

describe('F5 / F6: the job card states the STOP first, never "treated as CAUTION" for a protective limit', () => {
  it('unclassified protective limit: card, .txt readings and findings say STOP, and STOP comes before any limit text', () => {
    const rec = diagnosisRecord(LOW_OIL_PRESSURE, { oilPressure: '140', oemMinOilPressure: '150' });
    expect(rec.findings).not.toMatch(/treated as CAUTION/);
    expect(rec.readings[0].limitSource).toMatch(/treated as STOP \(conservative software safeguard\)/);
    const txt = jobCardReport(card('Customer reports alarm.', rec), asset);
    expect(txt).not.toMatch(/treated as CAUTION/);
    const iStop = txt.indexOf('STOP — Protective threshold');
    expect(iStop).toBeGreaterThan(-1);
    expect(iStop).toBeLessThan(txt.indexOf('\nASSET\n'));
    expect(iStop).toBeLessThan(txt.indexOf('treated as STOP'));
    expect(txt.indexOf(SAFEGUARD_LABEL)).toBeLessThan(txt.indexOf('\nASSET\n'));
  });
  it('STOP is the first record line, goes before earlier findings, and leads the .txt and the PDF (highlighted section)', async () => {
    const rec = diagnosisRecord(KNOCK_SEIZURE, { where: 'engine' });
    expect(rec.lines[0]).toMatch(/^STOP: STOP THE SET/);
    const c = card('Ran set on load to find noise - OK.', rec);
    expect(c.findings.indexOf('STOP THE SET')).toBeLessThan(c.findings.indexOf('Ran set on load'));
    const txt = jobCardReport(c, asset);
    for (const h of ['ASSET', 'FAULT', 'WORK DONE', 'PARTS', 'TEST READINGS']) expect(txt.indexOf('STOP THE SET')).toBeLessThan(txt.indexOf(`\n${h}\n`));
    const LIBS = path.resolve('node_modules');
    const pdfjs = await import(pathToFileURL(path.join(LIBS, 'pdfjs-dist/legacy/build/pdf.mjs')).href);
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.join(LIBS, 'pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
    const doc = await pdfjs.getDocument({ data: jobCardToPdf(c, asset).slice() }).promise;
    let text = '';
    for (let p = 1; p <= doc.numPages; p++) text += (await (await doc.getPage(p)).getTextContent()).items.map((i: { str?: string }) => i.str ?? '').join(' ') + ' ';
    const norm = text.replace(/\s+/g, ' ');
    expect(norm.indexOf('SAFETY')).toBeGreaterThan(-1);
    expect(norm.indexOf('STOP THE SET')).toBeLessThan(norm.indexOf('ASSET'));
    expect(norm.indexOf('STOP THE SET')).toBeLessThan(norm.indexOf('TEST READINGS'));
  }, 60000);
  it('the protective STOP wording and its label survive into the PDF', async () => {
    const rec = diagnosisRecord(LOW_OIL_PRESSURE, { oilPressure: '140', oemMinOilPressure: '150' });
    const LIBS = path.resolve('node_modules');
    const pdfjs = await import(pathToFileURL(path.join(LIBS, 'pdfjs-dist/legacy/build/pdf.mjs')).href);
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.join(LIBS, 'pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
    const doc = await pdfjs.getDocument({ data: jobCardToPdf(card('', rec), asset).slice() }).promise;
    let text = '';
    for (let p = 1; p <= doc.numPages; p++) text += (await (await doc.getPage(p)).getTextContent()).items.map((i: { str?: string }) => i.str ?? '').join(' ') + ' ';
    const norm = text.replace(/\s+/g, ' ');
    expect(norm).toContain('Protective threshold classification not verified.');
    expect(norm).toContain('conservative software safeguard, not a manufacturer instruction');
    expect(UNCLASSIFIED_PROTECTIVE).toMatch(/^STOP —/);
  }, 60000);
});

describe('F7: a published model-specific limit is not applied once the model no longer matches', () => {
  it('Use published value for 1104D NK, then the engine selector is cleared: the limit is refused, NOT VERIFIED', () => {
    const pub = publishedLimitFor({ engine: '1104D (Mech) Industrial Engine NK', manufacturer: 'Perkins', model: '1104D (Mech) Industrial Engine NK' }, 'overheating', 'oemAlarmCoolantTemp')!;
    const raw = { oemAlarmCoolantTemp: String(pub.value), 'oemAlarmCoolantTemp.class': pub.classification, 'oemAlarmCoolantTemp.source': pub.source, coolantTemp: '108' };
    const ok = diagnosisRecord(OVERHEATING, raw, { engine: '1104D (Mech) Industrial Engine NK', manufacturer: 'Perkins', model: '1104D (Mech) Industrial Engine NK' });
    expect(ok.result.limits[0].status).toBe('inside'); // still the right model
    for (const eq of [{}, { engine: '1104D (Mech) Industrial Engine NK', manufacturer: 'Cummins', model: '6BTA5.9' }]) {
      const rec = diagnosisRecord(OVERHEATING, raw, eq);
      expect(rec.result.limits[0].status).toBe('not-verified');
      expect(rec.result.invalid[0].reason).toMatch(/applies only to the model it was published for/);
      expect(rec.findings).not.toMatch(/no limit alarm from this reading/);
    }
  });
  it('no published value is offered when the typed plate model is a different engine', () => {
    expect(publishedLimitFor({ engine: '1104D (Mech) Industrial Engine NK', manufacturer: 'Cummins', model: '6BTA5.9' }, 'overheating', 'oemAlarmCoolantTemp')).toBeNull();
    expect(publishedLimitFor({ engine: '1104D (Mech) Industrial Engine NK', manufacturer: 'Perkins', model: '1104D (Mech) Industrial Engine NK' }, 'overheating', 'oemAlarmCoolantTemp')).not.toBeNull();
    // Case, spaces and hyphens only are ignored.
    expect(publishedLimitFor({ engine: '1104D (Mech) Industrial Engine NK', manufacturer: 'PERKINS', model: '1104d (mech) industrial-engine nk' }, 'overheating', 'oemAlarmCoolantTemp')).not.toBeNull();
  });
});

describe('F9: controller alarms and zero readings', () => {
  it('B1: a controller shutdown alarm with a normal gauge → STOP until verified', () => {
    const r = run(LOW_OIL_PRESSURE, { 'screen.alarm': 'shutdown', oilPressure: '300', oemMinOilPressure: '150', 'oemMinOilPressure.class': 'shutdown', gauge: 'mechanical' });
    assertStopFirstAndSafe(LOW_OIL_PRESSURE, r, 'B1');
    expect(r.stops[0].message).toMatch(/even if a gauge reads normal/);
  });
  it('zero oil pressure or zero insulation with no limit entered → safeguard STOP, labelled, no number', () => {
    for (const [f, raw] of [[LOW_OIL_PRESSURE, { oilPressure: '0' }], [NO_VOLTAGE, { insulation: '0' }]] as const) {
      const r = run(f as FaultFamily, raw as Record<string, string>);
      assertStopFirstAndSafe(f as FaultFamily, r, f.id);
      expect(r.stops[0].message).toMatch(/reads zero/);
      expect(r.stops[0].label).toBe('This is a conservative software safeguard, not an OEM limit.');
      expect(r.limits[0].status).toBe('not-verified');
    }
  });
});

describe('F10: units and number input', () => {
  it('every numeric question states its units', () => {
    for (const f of FAMILIES) for (const q of f.questions) if (q.kind === 'number') expect(q.unit.length, `${f.id}.${q.id}`).toBeGreaterThan(0);
  });
  it('hexadecimal, exponents and Infinity are refused; a decimal comma is accepted; "1,500" is refused as ambiguous', () => {
    for (const v of ['0x64', '1e2', 'Infinity', '1 5', '150kPa']) expect(parseDecimal(v).ok, v).toBe(false);
    expect(parseDecimal('1,5')).toEqual({ ok: true, n: 1.5 });
    expect(parseDecimal('150.0')).toEqual({ ok: true, n: 150 });
    const amb = parseDecimal('1,500');
    expect(amb.ok).toBe(false);
    if (!amb.ok) expect(amb.why).toMatch(/ambiguous/);
    const r = run(LOW_OIL_PRESSURE, { oilPressure: '0x64', oemMinOilPressure: '150', 'oemMinOilPressure.class': 'shutdown' });
    expect(r.invalid[0].reason).toMatch(/not a plain decimal number/);
    expect(run(NO_VOLTAGE, { insulation: '0,5', oemMinInsulation: '1,0', 'oemMinInsulation.class': 'shutdown' }).stopActive).toBe(true);
  });
});

describe('F11 (management decision): charging over-voltage stays non-protective', () => {
  it('B10: 35 V on a 24 V system, unclassified → CAUTION, no STOP (recorded as a management decision)', () => {
    const r = run(CHARGING, { systemVoltage: '24', runVoltage: '35', oemChargeMin: '26', oemChargeMax: '29' });
    expect(r.stopActive).toBe(false);
    expect(r.limits.find((l) => l.id === 'charge-max')!.level).toBe('CAUTION');
  });
});
