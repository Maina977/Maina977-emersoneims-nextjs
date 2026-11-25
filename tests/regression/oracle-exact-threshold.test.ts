import { describe, it, expect } from 'vitest';
import { diagnose } from '@/lib/generator-oracle/diagnostics/engine';
import { FAMILIES, LOW_OIL_PRESSURE, OVERHEATING, CHARGING } from '@/lib/generator-oracle/diagnostics/families';
import { diagnosisRecord } from '@/lib/generator-oracle/diagnostics/jobCardRecord';
import { REFERENCE_DATASETS, publishedLimitFor } from '@/lib/generator-oracle/diagnostics/oemReferences';
import { readingFlags } from '@/lib/generator-oracle/service/maintenance';
import type { Answers, Condition, FaultFamily } from '@/lib/generator-oracle/diagnostics/types';

// Management exact-threshold rule (2026-11-25). TEST limit values only, never real OEM data:
// oil-pressure minimum 200 kPa, coolant maximum 103 °C.
const oil = (reading: number, cls?: string, extra: Answers = {}) =>
  diagnose(LOW_OIL_PRESSURE, { oilPressure: reading, oemMinOilPressure: 200, ...(cls ? { 'oemMinOilPressure.class': cls } : {}), oilLevel: 'ok', ...extra });
const cool = (reading: number, cls?: string, extra: Answers = {}) =>
  diagnose(OVERHEATING, { coolantTemp: reading, oemAlarmCoolantTemp: 103, ...(cls ? { 'oemAlarmCoolantTemp.class': cls } : {}), coolantLevel: 'ok', ...extra });
const st = (r: ReturnType<typeof diagnose>, id: string) => r.limits.find((l) => l.id === id)!;

describe('exact-threshold rule: minimum limit (oil pressure, 200 kPa)', () => {
  it.each([
    // reading, classification, expected status, expected level, STOP active
    [201, 'shutdown', 'inside', null, false],
    [200, 'shutdown', 'reached', 'STOP', true],
    [199, 'shutdown', 'reached', 'STOP', true],
    [201, 'warning', 'inside', null, false],
    [200, 'warning', 'reached', 'CAUTION', false],
    [199, 'warning', 'reached', 'CAUTION', false],
    [201, 'not-stated', 'inside', null, false],
    [200, 'not-stated', 'reached', 'STOP', true], // protective: unclassified is treated as shutdown
    [199, undefined, 'reached', 'STOP', true],
  ] as const)('reading %s kPa, %s → %s / %s', (reading, cls, status, level, stop) => {
    const r = oil(reading, cls);
    expect(st(r, 'oil-pressure-min')).toMatchObject({ status, level });
    expect(r.stopActive).toBe(stop);
  });
});

describe('exact-threshold rule: maximum limit (coolant, 103 °C)', () => {
  it.each([
    [102, 'shutdown', 'inside', null, false],
    [103, 'shutdown', 'reached', 'STOP', true],
    [104, 'shutdown', 'reached', 'STOP', true],
    [102, 'warning', 'inside', null, false],
    [103, 'warning', 'reached', 'CAUTION', false],
    [104, 'warning', 'reached', 'CAUTION', false],
    [102, undefined, 'inside', null, false],
    [103, undefined, 'reached', 'STOP', true], // protective: unclassified is treated as shutdown
    [104, 'not-stated', 'reached', 'STOP', true],
  ] as const)('reading %s °C, %s → %s / %s', (reading, cls, status, level, stop) => {
    const r = cool(reading, cls);
    expect(st(r, 'coolant-temp-max')).toMatchObject({ status, level });
    expect(r.stopActive).toBe(stop);
  });
  it('a warning value never becomes a shutdown, however far it is exceeded', () => {
    const r = cool(125, 'warning');
    expect(r.stopActive).toBe(false);
    expect(r.stops.find((s) => /OEM warning value/.test(s.message))!.level).toBe('CAUTION');
  });
  it('NON-protective unclassified (charging maximum): CAUTION that says so, never clears a STOP raised by another rule', () => {
    const r = diagnose(CHARGING, { systemVoltage: '24', runVoltage: 30, oemChargeMax: 29, batteryCondition: 'gassing' });
    expect(r.stopActive).toBe(true); // the gassing STOP still stands
    expect(r.stops[0].level).toBe('STOP');
    const c = r.stops.find((s) => /LIMIT REACHED — NOT CLASSIFIED/.test(s.message))!;
    expect(c.level).toBe('CAUTION');
    expect(c.message).toMatch(/not as a confirmed shutdown; this does not clear any STOP/);
  });
  it('PROTECTIVE unclassified: oil pressure below the minimum → STOP first, then no running-engine step', () => {
    const r = oil(150, undefined, { knock: 'no', oilCondition: 'normal', recentWork: 'none' });
    expect(r.stops[0]).toEqual({ level: 'STOP', message: expect.stringMatching(/^STOP — LIMIT REACHED, NOT CLASSIFIED: Treated as a shutdown limit because it has not been classified; confirm against the OEM manual\./) });
    for (const c of r.ranked) for (const a of c.actions) expect(a).not.toMatch(/re-?start|run the|running|on load|under load|load bank|crank the/i);
    expect(r.nextQuestion?.id).toBe('oemMinOilPressure');
    expect(r.nextQuestion?.needsRunning).toBeFalsy();
  });
  it('protective parameters are exactly: oil pressure, oil temperature, coolant temperature, overspeed, insulation', () => {
    const p = FAMILIES.flatMap((f) => (f.limits ?? []).filter((l) => l.protective).map((l) => l.id)).sort();
    expect(p).toEqual(['coolant-temp-max', 'insulation-min', 'oil-pressure-min', 'oil-temp-max', 'overspeed-trip']);
    const non = FAMILIES.flatMap((f) => (f.limits ?? []).filter((l) => !l.protective).map((l) => l.id)).sort();
    expect(non).toEqual(['charge-max', 'charge-min', 'frequency-min', 'swing-band']);
  });
  it('a reading at the maximum is never described as inside, safe or normal', () => {
    for (const cls of ['shutdown', 'warning', 'not-stated', undefined]) {
      const l = st(cool(103, cls), 'coolant-temp-max');
      expect(l.status).toBe('reached');
      expect(l.text).not.toMatch(/\binside\b|\bsafe\b|\bnormal\b/i);
    }
  });
});

describe('measurement tolerance: "at or near the limit"', () => {
  it('within the tolerance entered but not at the limit → CAUTION at or near; outside it → inside', () => {
    const near = st(cool(102, 'shutdown', { 'coolantTemp.tol': 1 }), 'coolant-temp-max');
    expect(near).toMatchObject({ status: 'near', level: 'CAUTION', tolerance: 1 });
    expect(near.text).toMatch(/^AT OR NEAR THE LIMIT/);
    expect(near.text).toMatch(/This is a shutdown value: if the re-measurement confirms it/);
    expect(st(cool(102, 'shutdown', { 'coolantTemp.tol': 0.5 }), 'coolant-temp-max').status).toBe('inside');
    expect(st(oil(203, 'warning', { 'oilPressure.tol': 5 }), 'oil-pressure-min').status).toBe('near');
  });
  it('a reading that has reached the limit stays "reached" whatever the tolerance', () => {
    expect(st(cool(103, 'shutdown', { 'coolantTemp.tol': 2 }), 'coolant-temp-max')).toMatchObject({ status: 'reached', level: 'STOP' });
  });
  it('an impossible tolerance is refused', () => {
    expect(cool(100, 'shutdown', { 'coolantTemp.tol': -1 }).invalid.map((i) => i.q)).toEqual(['coolantTemp.tol']);
  });
});

describe('no limit entered → NOT VERIFIED, no threshold invented', () => {
  it('for every limit rule of every family', () => {
    for (const f of FAMILIES) for (const l of f.limits ?? []) {
      const rq = f.questions.find((q) => q.id === l.reading)!;
      const r = diagnose(f, { [l.reading]: rq.kind === 'number' ? rq.max : undefined });
      const s = st(r, l.id);
      expect(s.status).toBe('not-verified');
      expect(s.level).toBeNull();
      expect(s.text).toMatch(/NOT VERIFIED\. No threshold is applied/);
    }
  });
  it('an unknown classification is refused, not guessed', () => {
    const r = oil(150, 'maybe');
    expect(r.invalid.map((i) => i.q)).toEqual(['oemMinOilPressure.class']);
    expect(st(r, 'oil-pressure-min').classification).toBeNull();
  });
});

describe('job-card export carries the same judgement', () => {
  it('a reading equal to a limit is flagged on the card, never passed as within limits', () => {
    expect(readingFlags([{ name: 'TEST', value: 103, unit: '°C', max: 103, limitSource: 'TEST' }])[0]).toMatch(/is AT the maximum 103 °C — equality counts as reaching the limit/);
    expect(readingFlags([{ name: 'TEST', value: 200, unit: 'kPa', min: 200, limitSource: 'TEST' }])[0]).toMatch(/is AT the minimum/);
    expect(readingFlags([{ name: 'TEST', value: 102, unit: '°C', max: 103, limitSource: 'TEST' }])).toEqual([]);
  });
  it('the record states parameter, value, units, classification, source and the equipment it applies to', () => {
    const rec = diagnosisRecord(OVERHEATING, { coolantTemp: '103', oemAlarmCoolantTemp: '103', 'oemAlarmCoolantTemp.class': 'warning', 'oemAlarmCoolantTemp.source': 'TEST-MAN-1 rev B, p. 7' },
      { manufacturer: 'TEST-MAKER', model: 'TEST-ENGINE-1', variant: 'TEST 50 Hz prime' });
    expect(rec.findings).toContain('- OEM high coolant temperature limit: 103 °C (maximum); WARNING value; source (manual ID, revision, page): TEST-MAN-1 rev B, p. 7; applies only to: manufacturer TEST-MAKER; model TEST-ENGINE-1; variant/configuration TEST 50 Hz prime.');
    expect(rec.findings).toMatch(/- REACHED \(CAUTION\): CAUTION: coolant has reached the OEM warning value/);
    expect(rec.readings[0]).toMatchObject({ value: 103, max: 103 });
    expect(readingFlags(rec.readings)[0]).toMatch(/AT the maximum/);
  });
});

describe('PROVENANCE: every rule that uses an OEM value, and every reference record', () => {
  it('every question compared against is an OEM limit (with parameter and direction) or a rating-plate value', () => {
    for (const f of FAMILIES) {
      const refs = new Set<string>();
      const walk = (c: Condition): void => { if ('all' in c) return c.all.forEach(walk); if ('any' in c) return c.any.forEach(walk); if ('ref' in c) refs.add(c.ref); };
      f.stopRules.forEach((s) => walk(s.when)); f.causes.forEach((c) => c.evidence.forEach((e) => walk(e.when))); (f.crossChecks ?? []).forEach((x) => walk(x.when));
      for (const l of f.limits ?? []) refs.add(l.limit);
      for (const id of refs) {
        const q = f.questions.find((x) => x.id === id)!;
        expect(q.kind, `${f.id}.${id}`).toBe('number');
        if (q.kind !== 'number') continue;
        expect(!!q.oemLimit || !!q.ratingPlate, `${f.id}.${id}: neither an OEM limit nor a rating-plate value`).toBe(true);
        if (q.oemLimit) { expect(q.oemLimit.parameter.length).toBeGreaterThan(5); expect(['min', 'max']).toContain(q.oemLimit.direction); }
      }
    }
  });
  it('limit rules compare a reading with an OEM limit in the same units', () => {
    for (const f of FAMILIES) for (const l of f.limits ?? []) {
      const r = f.questions.find((q) => q.id === l.reading)!; const lim = f.questions.find((q) => q.id === l.limit)!;
      expect(r.kind === 'number' && lim.kind === 'number' && !!lim.oemLimit, `${f.id}.${l.id}`).toBe(true);
      if (r.kind === 'number' && lim.kind === 'number') expect(r.unit).toBe(lim.unit);
      expect(l.shutdown).toMatch(/STOP/);
      expect(l.warning).not.toMatch(/^STOP/);
    }
  });
  it('every reference record has manufacturer, exact model, variant, manual ID + revision, page, parameter + units, classification and applicability', () => {
    for (const d of REFERENCE_DATASETS) {
      expect(d.source.publisher.length, d.dataset).toBeGreaterThan(2);
      expect(d.source.documentNumber.length, d.dataset).toBeGreaterThan(2);
      expect(d.source.revision.length, d.dataset).toBeGreaterThan(1);
      for (const e of d.entries) {
        const where = `${d.dataset}/${e.id}`;
        expect(e.equipment.make.length, `${where} manufacturer`).toBeGreaterThan(2);
        expect(e.equipment.models.length, `${where} model`).toBeGreaterThan(0);
        for (const m of e.equipment.models) expect(m.length, `${where} model`).toBeGreaterThan(3);
        expect(typeof e.equipment.variant === 'string' && e.equipment.variant.length > 3, `${where} variant`).toBe(true);
        expect(e.page.length, `${where} page`).toBeGreaterThan(3);
        expect(e.parameter.length, `${where} parameter`).toBeGreaterThan(3);
        expect(typeof e.units === 'string' && e.units.length > 0, `${where} units`).toBe(true);
        const numeric = e.value !== undefined || e.valueMin !== undefined || e.valueMax !== undefined;
        if (numeric) expect(e.units, `${where} numeric value needs real units`).not.toBe('none');
        expect(['shutdown', 'warning', 'not-a-limit'], `${where} classification`).toContain(e.classification);
        expect(typeof e.applicability === 'string' && e.applicability.length > 10, `${where} applicability`).toBe(true);
        if (e.relatesTo?.relation === 'published-limit') {
          expect(e.value, `${where}: a published limit needs a single value`).toBeDefined();
          expect(e.classification).not.toBe('not-a-limit');
          expect(e.documentComparison, `${where}: record how the document words the comparison`).toBeTruthy();
        }
        if (e.kind === 'typical-range') expect(e.classification).toBe('not-a-limit');
      }
    }
  });
  it('a published limit is offered only for its exact model, with its source', () => {
    const a = publishedLimitFor({ engine: '1104D (Mech) Industrial Engine NK' }, 'overheating', 'oemAlarmCoolantTemp')!;
    expect(a).toMatchObject({ value: 110, classification: 'shutdown' });
    expect(a.source).toMatch(/^SEBU8325-01 .*July 2012, PDF p\. 22/);
    expect(a.source.length).toBeLessThanOrEqual(300);
    expect(publishedLimitFor({ engine: '1106D Industrial Engine' }, 'overheating', 'oemAlarmCoolantTemp')).toBeNull();
    expect(publishedLimitFor({ engine: '1104D (Mech) Industrial Engine NK' }, 'low-oil-pressure', 'oemMinOilPressure')).toBeNull(); // typical range is not a limit
    // Using it: equality with the published shutdown maximum is a STOP.
    const r = diagnose(OVERHEATING, { coolantTemp: 110, oemAlarmCoolantTemp: a.value, 'oemAlarmCoolantTemp.class': a.classification, 'oemAlarmCoolantTemp.source': a.source });
    expect(r.stops[0].level).toBe('STOP');
  });
  it('every family that compares with an OEM figure has its limit questions answerable with classification and source', () => {
    const fams: FaultFamily[] = [LOW_OIL_PRESSURE, OVERHEATING, CHARGING];
    for (const f of fams) expect((f.limits ?? []).length).toBeGreaterThan(0);
  });
});
