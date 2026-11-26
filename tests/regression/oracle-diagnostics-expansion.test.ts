import { describe, it, expect } from 'vitest';
import { diagnose, evaluate, validateAnswers } from '@/lib/generator-oracle/diagnostics/engine';
import { FAMILIES, familyFor, FREQUENCY_HUNTING, OVERSPEED, CHARGING, EXHAUST_SMOKE, LOW_OIL_PRESSURE, NO_VOLTAGE } from '@/lib/generator-oracle/diagnostics/families';
import { diagnosisRecord, recordToCardUpdate } from '@/lib/generator-oracle/diagnostics/jobCardRecord';
import { answersFromRaw, cleanSession } from '@/lib/generator-oracle/diagnostics/session';
import { reduce, emptyState, type ServiceAction, type ServiceState } from '@/lib/generator-oracle/service/store';
import { jobCardReport } from '@/lib/generator-oracle/service/maintenance';
import type { Answers, Condition, FaultFamily, NumberQuestion } from '@/lib/generator-oracle/diagnostics/types';

// All numeric OEM figures below are TEST values typed by the "technician" in the
// test, never real OEM data. Worked examples are SYNTHETIC: hand-derived from the
// rule definitions (scores: strongly +3, supports +1, contradicts −1).

const NEW = [FREQUENCY_HUNTING, OVERSPEED, CHARGING, EXHAUST_SMOKE];

/** Answers that make a condition true (first branch of an `any`); null if the ranges cannot. */
function satisfy(f: FaultFamily, c: Condition): Answers | null {
  const num = (id: string) => f.questions.find((q) => q.id === id) as NumberQuestion;
  if ('all' in c) {
    const parts = c.all.map((x) => satisfy(f, x));
    if (parts.includes(null)) return null;
    return Object.assign({}, ...parts);
  }
  if ('any' in c) return satisfy(f, c.any[0]);
  switch (c.op) {
    case 'is': return { [c.q]: Array.isArray(c.value) ? c.value[0] : c.value };
    case 'lt': case 'le': return { [c.q]: num(c.q).min };
    case 'gt': case 'ge': return { [c.q]: num(c.q).max };
    case 'leRef':
    case 'ltRef': { const q = num(c.q); const r = num(c.ref); return { [c.q]: q.min, [c.ref]: Math.max(r.min, q.min + 1) }; }
    case 'geRef':
    case 'gtRef': { const q = num(c.q); const r = num(c.ref); return { [c.q]: q.max, [c.ref]: Math.min(r.max, q.max - 1) }; }
  }
}

// An action shown after a STOP must not tell anyone to run, start, crank, load or work live.
const RUNNING = /\b(re-?start|start (the|it)|run (the|it)|running|on load|under load|apply load|load bank|live\b|energi[sz]e|crank(ing)? (it|the))/i;
// Nothing anywhere may say to carry on running (negated forms are allowed).
const CARRY_ON = /(?<!(do not|don't|never|not) )\b(keep|continue|carry on)( to)? (running|run)\b|\brun on\b(?! can| risks)/i;

describe('expansion families: definitions', () => {
  it('ten families; the four new ones are present, review pending, with mandatory safety and references', () => {
    expect(FAMILIES.map((f) => f.id)).toEqual(['no-crank', 'no-start', 'low-oil-pressure', 'overheating', 'knock-seizure', 'no-voltage', 'frequency-hunting', 'overspeed', 'charging', 'exhaust-smoke']);
    for (const f of NEW) {
      expect(f.review).toBe('technician review pending');
      expect(f.mandatorySafety!.length).toBeGreaterThanOrEqual(2);
      expect(f.mandatorySafety!.join(' ')).toMatch(/STOP the engine|lock(ed)? off|isolat/i);
      expect(f.references!.length).toBeGreaterThan(0);
    }
  });
  it('every OEM figure is a question, marked "per OEM manual — NOT VERIFIED", with no default', () => {
    for (const f of NEW) {
      const refs = new Set<string>();
      const walk = (c: Condition): void => { if ('all' in c) return c.all.forEach(walk); if ('any' in c) return c.any.forEach(walk); if ('ref' in c) refs.add(c.ref); };
      f.stopRules.forEach((s) => walk(s.when)); f.causes.forEach((c) => c.evidence.forEach((e) => walk(e.when)));
      for (const id of refs) {
        const q = f.questions.find((x) => x.id === id)!;
        if (/rated|Rated/.test(q.text)) continue; // rating-plate value, not an OEM limit
        expect(q.help, `${f.id}.${id}`).toMatch(/per OEM manual — NOT VERIFIED/i);
      }
    }
  });
  it('cross-checks refer to defined questions', () => {
    for (const f of FAMILIES) for (const x of f.crossChecks ?? []) {
      for (const id of x.refuse) expect(f.questions.some((q) => q.id === id)).toBe(true);
      expect(satisfy(f, x.when)).not.toBeNull();
    }
  });
  it('references cite standards by title and state they were not verified against a held copy', () => {
    const all = NEW.flatMap((f) => f.references!);
    expect(all.join(' ')).toMatch(/ISO 8528-5/);
    expect(all.join(' ')).toMatch(/ISO 3046-4/);
    expect(all.join(' ')).toMatch(/IEEE Std 450/);
    for (const r of all.filter((x) => /^(ISO|IEEE|NFPA)/.test(x))) expect(r).toMatch(/NOT VERIFIED/);
  });
});

describe('SAFETY: nothing hazardous after a STOP, in any workflow (all ten families)', () => {
  for (const f of FAMILIES) {
    f.stopRules.forEach((rule, i) => {
      if (rule.level !== 'STOP') return;
      it(`${f.id} stop-${i + 1}: STOP fires, comes first, and no running/live check or question follows`, () => {
        const base = satisfy(f, rule.when)!;
        expect(base, 'stop rule cannot be satisfied inside the question ranges').not.toBeNull();
        expect(evaluate(rule.when, validateAnswers(f, base).answers)).toBe(true);
        // The STOP answers alone, then with every option of every other choice question.
        const variants: Answers[] = [base];
        for (const q of f.questions) if (q.kind === 'choice' && base[q.id] === undefined) for (const o of q.options) variants.push({ ...base, [q.id]: o.value });
        for (const a of variants) {
          // A variant whose extra answer makes the STOP inputs implausible (refused by a cross-check) is not this case.
          if (evaluate(rule.when, validateAnswers(f, a).answers) !== true) continue;
          const r = diagnose(f, a);
          expect(r.stopActive).toBe(true);
          expect(r.stops[0].level).toBe('STOP');
          const firstCaution = r.stops.findIndex((s) => s.level === 'CAUTION');
          if (firstCaution >= 0) expect(r.stops.slice(firstCaution).every((s) => s.level === 'CAUTION')).toBe(true);
          for (const c of r.ranked) {
            const cause = f.causes.find((x) => x.id === c.id)!;
            for (const rc of cause.runningChecks ?? []) expect(c.actions).not.toContain(rc);
            expect(c.withheld).toEqual(cause.runningChecks ?? []);
            for (const act of c.actions) expect(act, `${f.id}.${c.id}`).not.toMatch(RUNNING);
          }
          if (r.nextQuestion) expect(r.nextQuestion.needsRunning, `${f.id}: next question ${r.nextQuestion.id} needs running`).toBeFalsy();
          const record = diagnosisRecord(f, Object.fromEntries(Object.entries(a).map(([k, v]) => [k, String(v)])));
          const firstCause = record.lines.indexOf('Likely causes, most supported first:');
          expect(record.lines.findIndex((l) => l.startsWith('STOP'))).toBeLessThan(firstCause);
          for (const rc of f.causes.flatMap((x) => x.runningChecks ?? [])) expect(record.findings).not.toContain(rc);
        }
      });
    });
  }
  for (const f of FAMILIES) {
    for (const l of f.limits ?? []) {
      it(`${f.id} limit ${l.id} (shutdown, reached at equality): STOP first, nothing running or live follows`, () => {
        const lq = f.questions.find((q) => q.id === l.limit) as NumberQuestion;
        const rq = f.questions.find((q) => q.id === l.reading) as NumberQuestion;
        // A limit value valid for both questions; the reading equals it (equality counts as reaching).
        const L = Math.max(lq.min, rq.min) + (Math.min(lq.max, rq.max) - Math.max(lq.min, rq.min)) / 2;
        const base: Answers = { [l.limit]: L, [l.reading]: L, ...(l.protective ? {} : { [`${l.limit}.class`]: 'shutdown' }) }; // protective: unclassified must STOP too
        if (f.id === 'charging') base.systemVoltage = L > 18 ? '24' : '12';
        const variants: Answers[] = [base];
        for (const q of f.questions) if (q.kind === 'choice' && base[q.id] === undefined) for (const o of q.options) variants.push({ ...base, [q.id]: o.value });
        let checked = 0;
        for (const a of variants) {
          const r = diagnose(f, a);
          const st = r.limits.find((x) => x.id === l.id)!;
          if (st.status !== 'reached') continue; // refused by a cross-check in this variant
          checked++;
          expect(st.level).toBe('STOP');
          expect(r.stopActive).toBe(true);
          expect(r.stops[0].level).toBe('STOP');
          for (const c of r.ranked) {
            for (const act of c.actions) expect(act, `${f.id}.${c.id}`).not.toMatch(RUNNING);
            expect(c.withheld).toEqual(f.causes.find((x) => x.id === c.id)!.runningChecks ?? []);
          }
          if (r.nextQuestion) expect(r.nextQuestion.needsRunning).toBeFalsy();
        }
        expect(checked).toBeGreaterThan(0);
      });
    }
  }
  it('every running check is written as conditional on no STOP being active', () => {
    for (const f of FAMILIES) for (const c of f.causes) for (const rc of c.runningChecks ?? []) expect(rc).toMatch(/^Only when no STOP is active/);
  });
  it('no text anywhere tells the technician to keep running (only negated forms)', () => {
    for (const f of FAMILIES) {
      const texts = [...(f.mandatorySafety ?? []), ...f.stopRules.map((s) => s.message), ...(f.limits ?? []).flatMap((l) => [l.shutdown, l.warning]), ...f.causes.flatMap((c) => [...c.actions, ...(c.runningChecks ?? [])])];
      for (const t of texts) expect(t, f.id).not.toMatch(CARRY_ON);
    }
  });
  it('actions shown without a STOP still never ask for running work (that is only in runningChecks)', () => {
    for (const f of NEW) for (const c of f.causes) for (const a of c.actions) expect(a, `${f.id}.${c.id}`).not.toMatch(RUNNING);
  });
  it('the mandatory safety shows in a fresh session, before any question is answered', () => {
    for (const f of NEW) {
      const r = diagnose(f, {});
      expect(r.stops.map((s) => s.message)).toEqual(f.mandatorySafety);
      expect(r.stopActive).toBe(false);
    }
  });
  it('running checks are offered only when no STOP is active', () => {
    const ok = diagnose(EXHAUST_SMOKE, { lightLoad: 'yes', colour: 'blue' });
    expect(ok.stopActive).toBe(false);
    expect(ok.ranked.find((c) => c.id === 'wet-stacking')!.actions.some((a) => /load bank/.test(a))).toBe(true);
    const stopped = diagnose(EXHAUST_SMOKE, { lightLoad: 'yes', colour: 'blue', turboOil: 'oil' });
    expect(stopped.stopActive).toBe(true);
    expect(stopped.ranked.find((c) => c.id === 'wet-stacking')!.actions.some((a) => /load bank/.test(a))).toBe(false);
  });
  it('existing families: a STOP no longer leads to a running measurement as the next check', () => {
    // Low oil level STOP: the next check is not "oil pressure measured" (needs the engine running).
    const r = diagnose(LOW_OIL_PRESSURE, { oilLevel: 'low' });
    expect(r.stopActive).toBe(true);
    expect(r.nextQuestion?.needsRunning).toBeFalsy();
    const v = diagnose(NO_VOLTAGE, { insulation: 0.4, oemMinInsulation: 1 });
    expect(v.nextQuestion?.id).not.toBe('frequency');
    expect(v.nextQuestion?.needsRunning).toBeFalsy();
  });
});

describe('no invented limits', () => {
  it('without the OEM figure, the comparison rules stay silent', () => {
    expect(diagnose(CHARGING, { runVoltage: 32 }).stopActive).toBe(false);
    expect(diagnose(FREQUENCY_HUNTING, { freqSwing: 5 }).stops.map((s) => s.message).some((m) => /outside the band/.test(m))).toBe(false);
    const o = diagnose(OVERSPEED, { peakRpm: 2500 });
    expect(o.ranked.find((c) => c.id === 'governor-response')!.score).toBe(0);
  });
  it('the OEM figure decides: the same reading is a STOP at or above a shutdown max entered, not below it', () => {
    const sd = { 'oemChargeMax.class': 'shutdown' };
    expect(diagnose(CHARGING, { runVoltage: 29.5, oemChargeMin: 27, oemChargeMax: 29, ...sd }).stopActive).toBe(true); // TEST figures
    expect(diagnose(CHARGING, { runVoltage: 29.5, oemChargeMin: 27, oemChargeMax: 30, ...sd }).stopActive).toBe(false);
  });
});

describe('invalid inputs are refused, never clipped or guessed', () => {
  it('out-of-range readings and unknown options', () => {
    const { invalid } = validateAnswers(OVERSPEED, { peakRpm: -1, tripSource: 'magic', oemTripRpm: 99999 });
    expect(invalid.map((i) => i.q).sort()).toEqual(['oemTripRpm', 'peakRpm', 'tripSource']);
  });
  it('a charging band with max below min is refused as a pair', () => {
    const r = diagnose(CHARGING, { oemChargeMin: 28, oemChargeMax: 27, runVoltage: 27.5 });
    expect(r.invalid.map((i) => i.q).sort()).toEqual(['oemChargeMax', 'oemChargeMin']);
    expect(r.stopActive).toBe(false);
    expect(r.ranked.find((c) => c.id === 'alt-under')!.score).toBe(0);
  });
  it('a 24 V band typed for a 12 V system (and the reverse) is refused', () => {
    expect(validateAnswers(CHARGING, { systemVoltage: '12', oemChargeMin: 27, oemChargeMax: 29 }).invalid.map((i) => i.q).sort()).toEqual(['oemChargeMax', 'oemChargeMin']);
    expect(validateAnswers(CHARGING, { systemVoltage: '24', oemChargeMin: 13.5, oemChargeMax: 14.5 }).invalid).toHaveLength(2);
    expect(validateAnswers(CHARGING, { systemVoltage: '12', oemChargeMin: 13.5, oemChargeMax: 14.5 }).invalid).toHaveLength(0);
  });
  it('text in a number field is refused', () => {
    expect(diagnose(FREQUENCY_HUNTING, answersFromRaw(FREQUENCY_HUNTING, { freqSwing: 'lots' })).invalid).toHaveLength(1);
  });
});

describe('worked examples (SYNTHETIC, hand-derived)', () => {
  const view = (f: FaultFamily, a: Answers) => {
    const r = diagnose(f, a);
    return { ranked: r.ranked.map((c) => [c.id, c.score]), excluded: r.excluded.map((e) => e.id).sort(), stops: r.stops.map((s) => s.level), stopActive: r.stopActive, r };
  };
  it('W1 hunting: 1.2 Hz swing vs 0.5 Hz band, no load, sticking linkage → linkage first; swing caution', () => {
    const v = view(FREQUENCY_HUNTING, { overspeedTrip: 'no', linkage: 'sticking', parallel: 'single', freqSwing: 1.2, oemMaxSwing: 0.5, whenObserved: 'no-load', governorType: 'electronic', fuelSupply: 'ok', speedSensor: 'ok', gainChanged: 'no', loadType: 'none', voltageHunts: 'no' });
    expect(v.ranked).toEqual([['linkage', 4], ['gain', 0], ['fuel', -1]]);
    expect(v.excluded).toEqual(['avr', 'load', 'parallel', 'sensor', 'within-band']);
    expect(v.stops).toEqual(['CAUTION', 'CAUTION', 'CAUTION']); // 2 mandatory + swing outside band
    expect(v.stopActive).toBe(false);
  });
  it('W2 overspeed on load rejection: logged 1720 rpm vs 1700 rpm trip (TEST), 1500 rpm rated → governor response first; STOP', () => {
    const v = view(OVERSPEED, { tripSource: 'controller', runaway: 'no', oilIntake: 'none', linkage: 'ok', whenTripped: 'load-rejection', peakRpm: 1720, oemTripRpm: 1700, ratedRpm: 1500, speedSensor: 'ok', settingsChanged: 'no' });
    expect(v.ranked).toEqual([['governor-response', 4], ['sensor-false', -1], ['settings', -1], ['start-fuel', -1]]);
    expect(v.excluded).toEqual(['linkage', 'oil-fuel']);
    expect(v.stops).toEqual(['STOP', 'STOP', 'CAUTION', 'CAUTION']); // + peak 1720 ≥ trip 1700: protective, not classified → treated as shutdown
    expect(v.r.limits[0]).toMatchObject({ status: 'reached', level: 'STOP', classification: null });
    expect(v.stopActive).toBe(true);
    expect(v.r.nextQuestion?.id).toBe('oemTripRpm'); // the reached trip setting has no classification yet: asked next
  });
  it('W3 charging: 24 V, 24.6 V running vs 27.0–29.0 V band (TEST), alarm on → alternator/regulator undercharge first', () => {
    const v = view(CHARGING, { batteryCondition: 'normal', belt: 'ok', systemVoltage: '24', source: 'alternator', runVoltage: 24.6, oemChargeMin: 27, oemChargeMax: 29, restVoltage: 24.2, chargeAlarm: 'yes', excitation: 'ok', terminals: 'clean' });
    expect(v.ranked).toEqual([['alt-under', 4], ['battery', 0], ['connections', -1], ['charger-supply', -1], ['charger', -1]]);
    expect(v.excluded).toEqual(['alt-over', 'belt', 'excitation']);
    expect(v.stops).toEqual(['CAUTION', 'CAUTION', 'CAUTION']); // + 24.6 ≤ lowest 27, not classified
    expect(v.r.limits.map((l) => [l.id, l.status])).toEqual([['charge-max', 'inside'], ['charge-min', 'reached']]);
    expect(v.r.ranked[0].actions.some((a) => a.startsWith('Only when no STOP is active'))).toBe(true);
  });
  it('W4 smoke: black at full load, 115 % load, air filter clean → overload first; overload caution, no STOP', () => {
    const v = view(EXHAUST_SMOKE, { colour: 'black', when: 'full-load', loadPct: 115, airFilter: 'ok', injectors: 'not-tested', coolantLoss: 'none', oilCondition: 'normal', turboOil: 'none', smell: 'normal' });
    expect(v.ranked).toEqual([['overload', 3], ['injectors', 1], ['wet-stacking', 0], ['water-fuel', 0], ['wear', -1], ['cold-unburnt', -1]]);
    expect(v.excluded).toEqual(['air', 'coolant', 'turbo-seal']);
    expect(v.stops).toEqual(['CAUTION', 'CAUTION', 'CAUTION']);
    expect(v.r.stops[2].message).toMatch(/above 100 % of the rating/);
  });
  it('W5 smoke, safety-critical: white smoke with coolant loss → STOP first, coolant cause leads, no running check', () => {
    const v = view(EXHAUST_SMOKE, { colour: 'white', coolantLoss: 'losing', smell: 'sweet', lightLoad: 'yes', oilCondition: 'normal', turboOil: 'none' });
    expect(v.stops[0]).toBe('STOP');
    expect(v.r.stops[0].message).toMatch(/Do not run or crank/);
    expect(v.ranked[0]).toEqual(['coolant', 7]); // 3 + 3 + 1
    expect(v.r.ranked.find((c) => c.id === 'wet-stacking')!.withheld).toHaveLength(1);
  });
  it('W6 missing evidence: no answers → no cause scores above 0 and the first safety question is asked', () => {
    for (const f of NEW) {
      const r = diagnose(f, {});
      expect(r.ranked.every((c) => c.score === 0)).toBe(true);
      expect(r.nextQuestion?.id).toBe(f.questions.find((q) => f.stopRules.some((s) => JSON.stringify(s.when).includes(`"q":"${q.id}"`)))!.id);
    }
  });
});

describe('routing', () => {
  it.each([
    ['frequency is unstable at no load', 'frequency-hunting'],
    ['engine surging, governor hunting', 'frequency-hunting'],
    ['tripped on overspeed when the breaker opened', 'overspeed'],
    ['engine runaway', 'overspeed'],
    ['battery not charging, charge fail alarm', 'charging'],
    ['battery boiling and swollen', 'charging'],
    ['black smoke at full load', 'exhaust-smoke'],
    ['white smoke, cranks but will not start', 'no-start'],
    ['coolant boiling over', 'overheating'],
    ['voltage hunting', 'no-voltage'],
  ])('%s → %s', (t, id) => expect(familyFor(t)?.id).toBe(id));
});

describe('job card integration: the card carries exactly the guided result', () => {
  const raw = { batteryCondition: 'normal', belt: 'ok', systemVoltage: '24', source: 'alternator', runVoltage: '24.6', oemChargeMin: '27', oemChargeMax: '29', restVoltage: '24.2', chargeAlarm: 'yes', excitation: 'ok', terminals: 'clean' };
  it('the record lists the same ranked causes, stops and exclusions as diagnose()', () => {
    const rec = diagnosisRecord(CHARGING, raw);
    const r = diagnose(CHARGING, answersFromRaw(CHARGING, raw));
    expect(rec.result).toEqual(r);
    const causeLines = rec.lines.filter((l) => /^\d+\. /.test(l)).map((l) => l.replace(/^\d+\. /, '').replace(/ \(evidence.*$/, ''));
    expect(causeLines).toEqual(r.ranked.map((c) => c.title));
    for (const s of r.stops) expect(rec.findings).toContain(`${s.level}: ${s.message}`);
    expect(rec.findings).toContain('technician review pending');
    expect(rec.findings).toMatch(/OEM figures entered \(not verified by EmersonEIMS\)/);
  });
  it('readings: measured values only; both charging limits from the limit rules are attached with classification and source', () => {
    const rec = diagnosisRecord(CHARGING, { ...raw, 'oemChargeMax.class': 'shutdown', 'oemChargeMax.source': 'TEST-MANUAL rev A p. 12' });
    expect(rec.readings.map((x) => x.name)).toEqual([CHARGING.questions.find((q) => q.id === 'runVoltage')!.text, CHARGING.questions.find((q) => q.id === 'restVoltage')!.text]);
    const run = rec.readings[0];
    expect(run).toMatchObject({ value: 24.6, unit: 'V', min: 27, max: 29 });
    expect(run.limitSource).toMatch(/Highest regulated charging voltage — SHUTDOWN value, source: TEST-MANUAL rev A p\. 12/);
    expect(run.limitSource).toMatch(/Lowest regulated charging voltage — classification NOT STATED \(treated as CAUTION\), source: NOT GIVEN/);
    expect(run.limitSource).toMatch(/NOT VERIFIED; equality counts as reaching it/);
  });
  it('recorded on a job card through the store, it survives into the report (.txt and PDF share it)', () => {
    let s: ServiceState = emptyState();
    const acts: ServiceAction[] = [
      { type: 'saveAsset', asset: { make: 'TEST', model: 'T-1', engine: 'TEST-ENG', controller: 'TEST-CTRL', serial: 'S-1', ratedKva: 100 } },
      { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-25', reportedFault: 'TEST battery flat', technician: 'TECH-A' } },
    ];
    s = acts.reduce(reduce, s);
    const rec = diagnosisRecord(CHARGING, raw);
    s = reduce(s, { type: 'updateCard', cardId: 'JC-1', update: recordToCardUpdate(s.jobCards[0], rec) });
    const card = s.jobCards[0];
    expect(card.findings).toBe(rec.findings);
    expect(card.readings).toHaveLength(2);
    const report = jobCardReport(card, s.assets[0]);
    for (const l of rec.lines) expect(report).toContain(`  ${l}`);
    // appending a second diagnosis keeps the first
    const rec2 = diagnosisRecord(OVERSPEED, { tripSource: 'controller' });
    const s2 = reduce(s, { type: 'updateCard', cardId: 'JC-1', update: recordToCardUpdate(card, rec2) });
    // A record with a STOP goes FIRST in the findings (safety review F6); the earlier record is kept after it.
    expect(s2.jobCards[0].findings.startsWith(rec2.findings)).toBe(true);
    expect(s2.jobCards[0].findings.endsWith(rec.findings)).toBe(true);
    expect(s2.jobCards[0].findings.split('\n')[0]).toMatch(/^STOP: STOP: overspeed shutdown/);
  });
  it('the session reader drops unknown families, unknown questions and non-strings', () => {
    const clean = cleanSession(FAMILIES, { answers: { charging: { runVoltage: '24', bogus: 'x', belt: 3 }, nope: { a: 'b' } } });
    expect(clean).toEqual({ charging: { runVoltage: '24' } });
    expect(cleanSession(FAMILIES, 'junk')).toEqual({});
  });
});
