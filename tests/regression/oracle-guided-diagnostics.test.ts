import { describe, it, expect } from 'vitest';
import { diagnose, evaluate, validateAnswers, DIAGNOSTIC_ENGINE_VERSION } from '@/lib/generator-oracle/diagnostics/engine';
import { FAMILIES, familyFor, LOW_OIL_PRESSURE, OVERHEATING, NO_CRANK, NO_START, KNOCK_SEIZURE, NO_VOLTAGE } from '@/lib/generator-oracle/diagnostics/families';

describe('family definitions are well formed', () => {
  for (const f of FAMILIES) {
    it(`${f.id}: every condition refers to a defined question and option`, () => {
      const qs = new Map(f.questions.map((q) => [q.id, q]));
      const check = (c: any): void => {
        if ('all' in c) return c.all.forEach(check);
        if ('any' in c) return c.any.forEach(check);
        expect(qs.has(c.q), `${f.id}: unknown question ${c.q}`).toBe(true);
        if ('ref' in c) expect(qs.has(c.ref), `${f.id}: unknown ref ${c.ref}`).toBe(true);
        if (c.op === 'is') {
          const q = qs.get(c.q)!;
          expect(q.kind).toBe('choice');
          for (const v of [].concat(c.value)) expect((q as any).options.some((o: any) => o.value === v), `${f.id}.${c.q}: no option ${v}`).toBe(true);
        }
        if (['lt', 'le', 'gt', 'ge', 'ltRef', 'gtRef'].includes(c.op)) expect(qs.get(c.q)!.kind).toBe('number');
      };
      f.stopRules.forEach((s) => check(s.when));
      f.causes.forEach((c) => c.evidence.forEach((e) => check(e.when)));
      expect(new Set(f.questions.map((q) => q.id)).size).toBe(f.questions.length);
      expect(new Set(f.causes.map((c) => c.id)).size).toBe(f.causes.length);
      for (const c of f.causes) { expect(c.actions.length).toBeGreaterThan(0); expect(c.reference.length).toBeGreaterThan(10); }
    });
  }
});

describe('validation refuses impossible readings (never clips)', () => {
  it('negative oil pressure and wrong options are refused', () => {
    const { answers, invalid } = validateAnswers(LOW_OIL_PRESSURE, { oilPressure: -5, oilLevel: 'purple', oemMinOilPressure: 200 });
    expect(answers.oilPressure).toBeUndefined();
    expect(answers.oilLevel).toBeUndefined();
    expect(answers.oemMinOilPressure).toBe(200);
    expect(invalid.map((i) => i.q).sort()).toEqual(['oilLevel', 'oilPressure']);
  });
  it('a psi value typed into a kPa field beyond range is refused, not clipped', () => {
    const r = diagnose(LOW_OIL_PRESSURE, { oilPressure: 5000, oemMinOilPressure: 200 });
    expect(r.invalid[0].reason).toMatch(/outside the possible range/);
    expect(r.stops).toHaveLength(0);
  });
  it('non-numeric text is refused', () => {
    expect(validateAnswers(OVERHEATING, { coolantTemp: 'hot' }).invalid).toHaveLength(1);
  });
  it('numeric strings from a form are accepted', () => {
    expect(validateAnswers(OVERHEATING, { coolantTemp: '95' }).answers.coolantTemp).toBe(95);
  });
});

describe('three-valued conditions', () => {
  it('unknown stays unknown; all/any combine correctly', () => {
    expect(evaluate({ q: 'x', op: 'lt', value: 1 }, {})).toBeNull();
    expect(evaluate({ all: [{ q: 'x', op: 'lt', value: 1 }, { q: 'y', op: 'is', value: 'a' }] }, { y: 'b' })).toBe(false);
    expect(evaluate({ any: [{ q: 'x', op: 'lt', value: 1 }, { q: 'y', op: 'is', value: 'a' }] }, { y: 'a' })).toBe(true);
    expect(evaluate({ q: 'p', op: 'ltRef', ref: 'm' }, { p: 100 })).toBeNull();
    expect(evaluate({ q: 'p', op: 'ltRef', ref: 'm', factor: 0.9 }, { p: 170, m: 200 })).toBe(true);
  });
});

describe('stop rules always fire', () => {
  it('oil pressure below an OEM minimum classified as shutdown → STOP, whatever else is answered', () => {
    const r = diagnose(LOW_OIL_PRESSURE, { oilPressure: 150, oemMinOilPressure: 200, 'oemMinOilPressure.class': 'shutdown', mechanicalAgrees: 'yes', oilLevel: 'ok' });
    expect(r.stops.some((s) => s.level === 'STOP' && /reached the OEM minimum \(shutdown value\)/.test(s.message))).toBe(true);
  });
  it('the same reading against an UNCLASSIFIED minimum → STOP, treated as a shutdown limit (protective parameter, correction 2026-11-25)', () => {
    const r = diagnose(LOW_OIL_PRESSURE, { oilPressure: 150, oemMinOilPressure: 200, mechanicalAgrees: 'yes', oilLevel: 'ok' });
    expect(r.stops[0].level).toBe('STOP');
    expect(r.stops[0].message).toMatch(/^STOP — LIMIT REACHED, NOT CLASSIFIED: Treated as a shutdown limit because it has not been classified; confirm against the OEM manual\. STOP the engine/);
    expect(r.stopActive).toBe(true);
    expect(r.nextQuestion?.id).toBe('oemMinOilPressure'); // its classification is still asked next
  });
  it('the same reading against a minimum classified WARNING → CAUTION only (never escalated)', () => {
    const r = diagnose(LOW_OIL_PRESSURE, { oilPressure: 150, oemMinOilPressure: 200, 'oemMinOilPressure.class': 'warning', mechanicalAgrees: 'yes', oilLevel: 'ok' });
    expect(r.stopActive).toBe(false);
    expect(r.stops.find((s) => /OEM warning \(pre-alarm\) value/.test(s.message))!.level).toBe('CAUTION');
  });
  it('oil pressure above the minimum → no pressure STOP', () => {
    const r = diagnose(LOW_OIL_PRESSURE, { oilPressure: 250, oemMinOilPressure: 200, oilLevel: 'ok' });
    expect(r.stops.filter((s) => s.level === 'STOP')).toHaveLength(0);
  });
  it('no OEM minimum entered → no invented limit, and the OEM limit is asked first', () => {
    const r = diagnose(LOW_OIL_PRESSURE, { oilPressure: 50 });
    expect(r.stops).toHaveLength(0);
    expect(r.nextQuestion?.id).toBe('oemMinOilPressure');
  });
  it('knocking always stops the set', () => {
    for (const where of ['engine', 'top', 'generator-end', 'unsure']) expect(diagnose(KNOCK_SEIZURE, { where }).stops[0].level).toBe('STOP');
  });
  it('coolant above the OEM alarm → STOP; seized engine → STOP; low insulation → STOP', () => {
    expect(diagnose(OVERHEATING, { coolantTemp: 108, oemAlarmCoolantTemp: 103, 'oemAlarmCoolantTemp.class': 'shutdown' }).stops.some((s) => s.level === 'STOP')).toBe(true);
    expect(diagnose(NO_CRANK, { barOver: 'locked' }).stops.some((s) => s.level === 'STOP')).toBe(true);
    expect(diagnose(NO_VOLTAGE, { insulation: 0.4, oemMinInsulation: 1, 'oemMinInsulation.class': 'shutdown' }).stops.some((s) => s.level === 'STOP')).toBe(true);
  });
  it('a fresh session asks the safety question first', () => {
    expect(diagnose(KNOCK_SEIZURE, {}).nextQuestion?.id).toBe('where');
    expect(diagnose(OVERHEATING, {}).nextQuestion?.id).toBe('coolantTemp');
  });
});

describe('ranking follows the evidence', () => {
  it('flat 12 V battery ranks first', () => {
    const r = diagnose(NO_CRANK, { systemVoltage: '12', restVoltage: 11.8, crankVoltage: 8.2, starterSound: 'click', barOver: 'turns' });
    expect(r.ranked[0].id).toBe('battery');
    expect(r.excluded.map((e) => e.id)).toContain('seized');
  });
  it('the same thresholds scale for 24 V systems', () => {
    const r = diagnose(NO_CRANK, { systemVoltage: '24', restVoltage: 23.6, crankVoltage: 16, starterSound: 'slow' });
    expect(r.ranked[0].id).toBe('battery');
    // TEST OEM minimum; the "battery holds" judgement needs the manual figure, none is built in.
    const ok = diagnose(NO_CRANK, { systemVoltage: '24', restVoltage: 25.4, crankVoltage: 22, oemMinCrankVoltage: 20, starterSound: 'click', terminals: 'clean' });
    expect(ok.ranked[0].id).toBe('starter');
  });
  it('no built-in cranking-voltage or "at rated" frequency limit: without the OEM figure the rule does not fire', () => {
    const noOem = diagnose(NO_CRANK, { systemVoltage: '24', restVoltage: 25.4, crankVoltage: 22, starterSound: 'click', terminals: 'clean' });
    expect(noOem.ranked.find((c) => c.id === 'starter')?.score ?? 0).toBe(0);
    const below = diagnose(NO_CRANK, { systemVoltage: '24', restVoltage: 25.4, crankVoltage: 22, oemMinCrankVoltage: 23, starterSound: 'click', terminals: 'clean' });
    expect(below.ranked.find((c) => c.id === 'starter')?.score ?? 0).toBe(0);
    expect(diagnose(NO_VOLTAGE, { ratedFrequency: '50', frequency: 49.9, voltage: 300, ratedVoltage: 400 }).excluded.map((e) => e.id)).not.toContain('speed');
    expect(diagnose(NO_VOLTAGE, { ratedFrequency: '50', frequency: 49.9, oemMinFrequency: 49, voltage: 300, ratedVoltage: 400 }).excluded.map((e) => e.id)).toContain('speed');
  });
  it('mechanical gauge normal → sender fault leads; pump and bearings not first', () => {
    const r = diagnose(LOW_OIL_PRESSURE, { gauge: 'sender', mechanicalAgrees: 'yes', oilLevel: 'ok', oilCondition: 'normal', knock: 'no' });
    expect(r.ranked[0].id).toBe('sender');
    expect(r.excluded.map((e) => e.id)).toContain('level');
  });
  it('metal in the oil → bearings lead and STOP', () => {
    const r = diagnose(LOW_OIL_PRESSURE, { oilCondition: 'metal', knock: 'yes', mechanicalAgrees: 'no' });
    expect(r.ranked[0].id).toBe('bearings');
    expect(r.stops.filter((s) => s.level === 'STOP').length).toBeGreaterThanOrEqual(2);
    expect(r.excluded.map((e) => e.id)).toContain('sender');
  });
  it('no fuel at the filter → fuel starvation leads', () => {
    const r = diagnose(NO_START, { fuelLevel: 'low', fuelAtFilter: 'no', smoke: 'none' });
    expect(r.ranked[0].id).toBe('no-fuel');
  });
  it('cranking below the OEM minimum → crank speed leads; above → excluded', () => {
    expect(diagnose(NO_START, { crankRpm: 90, oemMinCrankRpm: 150 }).ranked[0].id).toBe('crank-speed');
    expect(diagnose(NO_START, { crankRpm: 200, oemMinCrankRpm: 150 }).excluded.map((e) => e.id)).toContain('crank-speed');
  });
  it('broken belt leads overheating', () => {
    const r = diagnose(OVERHEATING, { coolantTemp: 98, oemAlarmCoolantTemp: 103, belt: 'broken', coolantLevel: 'ok', radiator: 'clean' });
    expect(r.ranked[0].id).toBe('belt');
  });
  it('underspeed at 50 Hz → speed cause leads, not the AVR', () => {
    const r = diagnose(NO_VOLTAGE, { ratedFrequency: '50', frequency: 44, oemMinFrequency: 48.5, voltage: 300, ratedVoltage: 400 }); // TEST governor minimum
    expect(r.ranked[0].id).toBe('speed');
  });
  it('voltage within ±5 % excludes the AVR cause', () => {
    const r = diagnose(NO_VOLTAGE, { voltage: 402, ratedVoltage: 400 });
    expect(r.excluded.map((e) => e.id)).toContain('avr');
  });
});

describe('determinism', () => {
  it('the same answers give an identical result (100 runs, every family)', () => {
    for (const f of FAMILIES) {
      const a: Record<string, string | number> = {};
      for (const q of f.questions) a[q.id] = q.kind === 'number' ? (q.min + q.max) / 2 : q.options[0].value;
      const first = JSON.stringify(diagnose(f, a));
      for (let i = 0; i < 100; i++) expect(JSON.stringify(diagnose(f, a))).toBe(first);
    }
  });
  it('the result carries the engine version and review status', () => {
    const r = diagnose(NO_CRANK, {});
    expect(r.engineVersion).toBe(DIAGNOSTIC_ENGINE_VERSION);
    expect(r.review).toBe('technician review pending');
    expect(r.disclaimer).toMatch(/not a manufacturer procedure/);
  });
  it('all questions answered → no next question', () => {
    const a: Record<string, string | number> = {};
    for (const q of OVERHEATING.questions) a[q.id] = q.kind === 'number' ? q.min + 1 : q.options[0].value;
    a['oemAlarmCoolantTemp.class'] = 'warning';
    expect(diagnose(OVERHEATING, a).nextQuestion).toBeNull();
  });
});

describe('routing a description to a family', () => {
  it.each([
    ['engine knocking under load', 'knock-seizure'],
    ['low oil pressure alarm', 'low-oil-pressure'],
    ['set is overheating at full load', 'overheating'],
    ['cranks but will not start', 'no-start'],
    ['starter clicks, will not crank', 'no-crank'],
    ['no output voltage after start', 'no-voltage'],
  ])('%s → %s', (text, id) => expect(familyFor(text)?.id).toBe(id));
  it('unrelated text → no family (no guess)', () => expect(familyFor('please send a quotation')).toBeNull());
});
