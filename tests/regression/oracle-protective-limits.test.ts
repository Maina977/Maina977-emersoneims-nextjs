import { describe, it, expect } from 'vitest';
import { diagnose, UNCLASSIFIED_PROTECTIVE, SAFEGUARD_LABEL } from '@/lib/generator-oracle/diagnostics/engine';
import { LOW_OIL_PRESSURE, OVERHEATING, OVERSPEED } from '@/lib/generator-oracle/diagnostics/families';
import { diagnosisRecord, recordToCardUpdate } from '@/lib/generator-oracle/diagnostics/jobCardRecord';
import { publishedLimitFor, questionReferenceNote } from '@/lib/generator-oracle/diagnostics/oemReferences';
import { reduce, emptyState, type ServiceAction } from '@/lib/generator-oracle/service/store';
import { jobCardReport, jobCardReportParts } from '@/lib/generator-oracle/service/maintenance';
import type { Answers, DiagnosisResult, FaultFamily } from '@/lib/generator-oracle/diagnostics/types';

// Management-confirmed behaviour (2026-11-25) for protective limits. TEST limit values and sources only.
const SRC = 'TEST-MAN-9 rev 2, p. 9';
const CASES: Array<{ name: string; f: FaultFamily; id: string; reading: string; limit: string; L: number; at: number; beyond: number; inside: number }> = [
  { name: 'low oil pressure (min)', f: LOW_OIL_PRESSURE, id: 'oil-pressure-min', reading: 'oilPressure', limit: 'oemMinOilPressure', L: 200, at: 200, beyond: 190, inside: 210 },
  { name: 'high coolant temperature (max)', f: OVERHEATING, id: 'coolant-temp-max', reading: 'coolantTemp', limit: 'oemAlarmCoolantTemp', L: 103, at: 103, beyond: 108, inside: 100 },
  { name: 'overspeed (max)', f: OVERSPEED, id: 'overspeed-trip', reading: 'peakRpm', limit: 'oemTripRpm', L: 1700, at: 1700, beyond: 1800, inside: 1600 },
  { name: 'high oil temperature (max)', f: LOW_OIL_PRESSURE, id: 'oil-temp-max', reading: 'oilTemp', limit: 'oemMaxOilTemp', L: 120, at: 120, beyond: 125, inside: 110 },
];

/** After any STOP: no question and no check that needs the engine running. */
function noRunningAfterStop(f: FaultFamily, r: DiagnosisResult) {
  expect(r.stopActive).toBe(true);
  expect(r.stops[0].level).toBe('STOP');
  if (r.nextQuestion) expect(r.nextQuestion.needsRunning, `${f.id}: ${r.nextQuestion.id}`).toBeFalsy();
  for (const c of r.ranked) {
    for (const rc of f.causes.find((x) => x.id === c.id)!.runningChecks ?? []) expect(c.actions).not.toContain(rc);
    for (const a of c.actions) expect(a).not.toMatch(/re-?start|start the|run the|running|on load|under load|load bank|crank the/i);
  }
}

for (const c of CASES) {
  describe(`protective limit: ${c.name}`, () => {
    const run = (reading: number, extra: Answers = {}) => diagnose(c.f, { [c.reading]: reading, [c.limit]: c.L, ...extra });
    const status = (r: DiagnosisResult) => r.limits.find((l) => l.id === c.id)!;

    for (const pos of ['at', 'beyond'] as const) {
      it(`verified SHUTDOWN, reading ${pos} the limit → STOP citing the source; nothing running after it`, () => {
        const r = run(c[pos], { [`${c.limit}.class`]: 'shutdown', [`${c.limit}.source`]: SRC });
        expect(status(r)).toMatchObject({ status: 'reached', level: 'STOP', classification: 'shutdown', source: SRC });
        const m = r.stops.find((s) => s.message === status(r).alert)!;
        expect(m.level).toBe('STOP');
        expect(m.message).toContain(`source: ${SRC}`);
        expect(m.label).toBeUndefined();
        noRunningAfterStop(c.f, r);
      });
      it(`verified WARNING, reading ${pos} the limit → CAUTION, no STOP from the limit`, () => {
        const r = run(c[pos], { [`${c.limit}.class`]: 'warning', [`${c.limit}.source`]: SRC });
        expect(status(r)).toMatchObject({ status: 'reached', level: 'CAUTION' });
        expect(r.stopActive).toBe(false);
        expect(r.stops.find((s) => s.message === status(r).alert)!.message).toContain(`source: ${SRC}`);
      });
      it(`UNKNOWN classification, reading ${pos} the limit → conservative STOP, exact wording and safeguard label`, () => {
        for (const extra of [{}, { [`${c.limit}.class`]: 'not-stated' }]) {
          const r = run(c[pos], extra);
          const first = r.stops[0];
          expect(first.level).toBe('STOP');
          expect(first.message).toBe('STOP — Protective threshold classification not verified. Do not continue operating until the applicable manufacturer limits have been confirmed by a qualified technician.');
          expect(first.label).toBe('This is a conservative software safeguard, not a manufacturer instruction.');
          // Never states or implies a manufacturer shutdown at the unverified value.
          expect(`${first.message} ${first.label} ${status(r).text}`).not.toMatch(/\(shutdown value\)|manufacturer requires|OEM requires|the manual says/i);
          noRunningAfterStop(c.f, r);
          if (!Object.keys(extra).length) expect(r.nextQuestion?.id).toBe(c.limit); // unanswered: the classification is asked next
        }
      });
    }
    it('inside the limit → no limit alarm', () => {
      const r = run(c.inside, { [`${c.limit}.class`]: 'shutdown' });
      expect(status(r)).toMatchObject({ status: 'inside', level: null });
    });
    it('no limit entered → NOT VERIFIED, no number', () => {
      const r = diagnose(c.f, { [c.reading]: c.beyond });
      const s = status(r);
      expect(s).toMatchObject({ status: 'not-verified', level: null });
      expect(s.text).toMatch(/NOT VERIFIED/);
      expect(s.text).not.toMatch(/\d/);
    });
  });
}

describe('verified warning threshold, but another symptom requires stopping', () => {
  it('coolant at a WARNING maximum + combustion gas in the coolant → STOP from the symptom rule', () => {
    const r = diagnose(OVERHEATING, { coolantTemp: 104, oemAlarmCoolantTemp: 103, 'oemAlarmCoolantTemp.class': 'warning', gasBubbles: 'yes' });
    expect(r.stops[0]).toMatchObject({ level: 'STOP', message: expect.stringMatching(/combustion gas in the coolant/) });
    expect(r.limits.find((l) => l.id === 'coolant-temp-max')).toMatchObject({ level: 'CAUTION', classification: 'warning' });
    noRunningAfterStop(OVERHEATING, r);
  });
});

describe('model-specific configuration: the Perkins 1104D NK coolant maximum', () => {
  it('applies only to the model(s) its manual covers; another model → NOT VERIFIED unless entered', () => {
    expect(publishedLimitFor({ engine: '1104D (Mech) Industrial Engine NK', manufacturer: 'Perkins', model: '1104D (Mech) Industrial Engine NK' }, 'overheating', 'oemAlarmCoolantTemp')).toMatchObject({ value: 110, classification: 'shutdown' });
    for (const eq of [{ engine: '1106D Industrial Engine' }, { engine: 'Perkins 1104D' }, {}]) {
      expect(publishedLimitFor(eq, 'overheating', 'oemAlarmCoolantTemp')).toBeNull();
      expect(questionReferenceNote(eq, 'overheating', 'oemAlarmCoolantTemp')).toMatch(/^per OEM manual — NOT VERIFIED/);
    }
    // Not entered → nothing judged, whatever model is selected.
    expect(diagnosisRecord(OVERHEATING, { coolantTemp: '115' }, { engine: '1104D (Mech) Industrial Engine NK' }).result.limits[0].status).toBe('not-verified');
    // Entered by the technician for another model → judged on that entry, labelled as entered.
    const other = diagnosisRecord(OVERHEATING, { coolantTemp: '115', oemAlarmCoolantTemp: '110' }, { engine: '1106D Industrial Engine' });
    expect(other.result.stops[0].message).toBe(UNCLASSIFIED_PROTECTIVE);
  });
});

describe('same wording on screen, job-card findings, .txt and PDF content', () => {
  it('the STOP and its separate safeguard line reach the card report', () => {
    const rec = diagnosisRecord(LOW_OIL_PRESSURE, { oilPressure: '150', oemMinOilPressure: '200', oilLevel: 'ok' });
    const i = rec.lines.indexOf(`STOP: ${UNCLASSIFIED_PROTECTIVE}`);
    expect(i).toBeGreaterThanOrEqual(0);
    expect(rec.lines[i + 1]).toBe(SAFEGUARD_LABEL); // its own line
    const acts: ServiceAction[] = [
      { type: 'saveAsset', asset: { make: 'TEST', model: 'T-1', engine: 'TEST-ENG', controller: 'TEST-CTRL', serial: 'S-1', ratedKva: 100 } },
      { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-25', reportedFault: 'TEST low oil pressure', technician: 'TECH-A' } },
    ];
    let s = acts.reduce(reduce, emptyState());
    s = reduce(s, { type: 'updateCard', cardId: 'JC-1', update: recordToCardUpdate(s.jobCards[0], rec) });
    const txt = jobCardReport(s.jobCards[0], s.assets[0]);
    expect(txt).toContain(`  STOP: ${UNCLASSIFIED_PROTECTIVE}\n  ${SAFEGUARD_LABEL}`);
    // The PDF is written from the same report parts (jobCardPdf.ts), one PDF line per report line.
    const lines = jobCardReportParts(s.jobCards[0], s.assets[0]).sections.find((x) => x.heading === 'FINDINGS')!.lines;
    expect(lines).toContain(`  STOP: ${UNCLASSIFIED_PROTECTIVE}`);
    expect(lines).toContain(`  ${SAFEGUARD_LABEL}`);
  });
});
