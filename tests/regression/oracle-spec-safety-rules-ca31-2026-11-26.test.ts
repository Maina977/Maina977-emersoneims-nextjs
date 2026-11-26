/**
 * CA-31 (2026-11-26): the P1-A section 5 safety rules that were never built (register GO-30, GO-32,
 * GO-33 / V84-V86), and the section 4 quarantine (V87): a cause that cites only general practice is
 * never ranked first over a supported cause with a published source, and is marked UNVERIFIED.
 * No limit is invented: the three rules are observations or protection indications on the
 * cross-family safety screen, so they apply in every family, exactly like the existing screen STOPs.
 */
import { describe, it, expect } from 'vitest';
import { FAMILIES, NO_CRANK } from '@/lib/generator-oracle/diagnostics/families';
import { diagnose, isGeneralPracticeOnly, NO_VERIFIED_LEAD, UNVERIFIED_CAUSE_LABEL } from '@/lib/generator-oracle/diagnostics/engine';
import { SCREEN_QUESTIONS, SCREEN_RULES } from '@/lib/generator-oracle/diagnostics/safetyScreen';
import { diagnosisRecord } from '@/lib/generator-oracle/diagnostics/jobCardRecord';

const screenNo = Object.fromEntries(SCREEN_QUESTIONS.map((q) => [q.id, 'no']));
const RULES: Array<[string, RegExp]> = [
  ['screen.crankcase', /^STOP THE SET: high crankcase pressure — crankcase explosion risk\. Do not restart; do not open the crankcase or remove inspection covers while the engine is hot/],
  ['screen.reversePower', /^STOP: a reverse-power trip\. Do not reclose the generator breaker until the cause has been found/],
  ['screen.earthFault', /^STOP and isolate: an earth fault is indicated\. Treat the frame and all exposed metalwork as live until tested/],
];

describe('P1-A section 5: crankcase pressure, reverse power, earth fault', () => {
  it('each is a screen question with no numeric limit (an observation or a protection indication)', () => {
    for (const [id] of RULES) {
      const q = SCREEN_QUESTIONS.find((x) => x.id === id)!;
      expect(q.kind).toBe('choice');
      expect(q.options.map((o) => o.value)).toEqual(['no', 'yes', 'not-checked']);
      expect(q.text).not.toMatch(/\d/);
    }
  });

  for (const f of FAMILIES) {
    for (const [id, msg] of RULES) {
      it(`${f.id}: "${id}" = yes is a STOP, shown first; running withheld; no running-only next check`, () => {
        const r = diagnose(f, { ...screenNo, [id]: 'yes' });
        expect(r.stopActive).toBe(true);
        expect(r.runningWithheld).toBe(true);
        expect(r.stops[0]).toMatchObject({ level: 'STOP', origin: 'screen' });
        expect(r.stops[0].message).toMatch(msg);
        if (r.nextQuestion && 'needsRunning' in r.nextQuestion) expect(r.nextQuestion.needsRunning).not.toBe(true);
        for (const c of r.ranked) expect(c.withheld.length === 0 || !c.actions.some((a) => c.withheld.includes(a))).toBe(true);
      });
    }
  }

  it('no other evidence suppresses them (same as the existing screen STOPs), and "no" raises nothing', () => {
    for (const [id, msg] of RULES) {
      const r = diagnose(NO_CRANK, { ...screenNo, [id]: 'yes', restVoltage: 12.8, systemVoltage: '12' });
      expect(r.stops.some((s) => s.level === 'STOP' && msg.test(s.message))).toBe(true);
      expect(diagnose(NO_CRANK, screenNo).stops.some((s) => msg.test(s.message))).toBe(false);
    }
  });

  it('"Not checked" is acknowledged: safety not confirmed (the existing screen CAUTION)', () => {
    const r = diagnose(NO_CRANK, { ...screenNo, 'screen.earthFault': 'not-checked' });
    expect(r.stops.some((s) => s.level === 'CAUTION' && /safety is NOT confirmed/.test(s.message))).toBe(true);
  });

  it('the wording never tells the technician to keep running', () => {
    for (const s of SCREEN_RULES.slice(-5)) expect(s.message).not.toMatch(/\b(keep|continue) (running|operating)\b/i);
  });
});

describe('P1-A section 4 quarantine: general practice is UNVERIFIED and never outranks a supported sourced cause', () => {
  it('the classifier: the two general-practice references are unverified; a published source is not', () => {
    expect(isGeneralPracticeOnly('General diesel generator service practice (EmersonEIMS); confirm limits and procedure in the OEM service manual for this engine.')).toBe(true);
    expect(isGeneralPracticeOnly('General alternator service practice (EmersonEIMS); confirm limits and procedure in the alternator and AVR manuals.')).toBe(true);
    const sourced = FAMILIES.flatMap((f) => f.causes).filter((c) => !isGeneralPracticeOnly(c.reference));
    expect(sourced.length).toBeGreaterThanOrEqual(2);
  });

  it('every ranked cause carries the flag; across many answer sets an unverified cause is never above a supported sourced one', () => {
    let checked = 0;
    for (const f of FAMILIES) {
      const variants: Array<Record<string, string | number>> = [screenNo];
      for (const q of f.questions) if (q.kind === 'choice' && !q.id.startsWith('screen.')) for (const o of q.options) variants.push({ ...screenNo, [q.id]: o.value });
      for (const v of variants) {
        const r = diagnose(f, v);
        r.ranked.forEach((c) => expect(c.unverified).toBe(isGeneralPracticeOnly(c.reference)));
        const firstSourced = r.ranked.findIndex((c) => !c.unverified && c.score > 0);
        if (firstSourced >= 0) { expect(firstSourced).toBe(0); checked++; }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('NO_CRANK: the battery cause (BCI source) is listed first when supported, even when a general-practice cause has more evidence', () => {
    // starter clicks (+1 battery, and supports starter/cable causes); a cable fault seen strongly
    const base = { ...screenNo, systemVoltage: '12', starterSound: 'click' };
    const r = diagnose(NO_CRANK, base);
    const bat = r.ranked.find((c) => c.id === 'battery')!;
    expect(bat.unverified).toBe(false);
    if (bat.score > 0) expect(r.ranked[0].id).toBe('battery');
    // the evidence order alone would put a higher-scored general-practice cause first
    const higher = r.ranked.filter((c) => c.unverified && c.score > bat.score);
    for (const h of higher) expect(r.ranked.indexOf(h)).toBeGreaterThan(r.ranked.indexOf(bat));
  });

  it('when no sourced cause is supported, the job-card record says so and labels each general-practice cause', () => {
    const fam = FAMILIES.find((f) => f.id === 'knock-seizure')!;
    const r = diagnose(fam, { ...screenNo, metal: 'yes' });
    expect(r.ranked[0].unverified).toBe(true);
    const rec = diagnosisRecord(fam, { ...screenNo, metal: 'yes' });
    const text = JSON.stringify(rec);
    expect(text).toContain(NO_VERIFIED_LEAD);
    expect(text).toContain(`[${UNVERIFIED_CAUSE_LABEL}]`);
  });
});
