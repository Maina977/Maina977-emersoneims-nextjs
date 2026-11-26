/**
 * CA-31 (2026-11-26): the P1-A section 5 safety rules that were never built (register GO-30, GO-32,
 * GO-33 / V84-V86), and the section 4 quarantine (V87): a cause that cites only general practice is
 * never ranked first over a supported cause with a published source, and is marked UNVERIFIED.
 * No limit is invented: the three rules are observations or protection indications on the
 * cross-family safety screen, so they apply in every family, exactly like the existing screen STOPs.
 */
import { describe, it, expect } from 'vitest';
import { FAMILIES, NO_CRANK } from '@/lib/generator-oracle/diagnostics/families';
import { diagnose, isGeneralPracticeOnly, isUnverifiedReference, NO_VERIFIED_LEAD, UNVERIFIED_CAUSE_LABEL } from '@/lib/generator-oracle/diagnostics/engine';
import { REF_ISO_8528_5 } from '@/lib/generator-oracle/diagnostics/familiesExpansion';
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
  it('the classifier (management rule 2026-11-27): general practice, NOT VERIFIED and title-only references are all unverified', () => {
    expect(isGeneralPracticeOnly('General diesel generator service practice (EmersonEIMS); confirm limits and procedure in the OEM service manual for this engine.')).toBe(true);
    expect(isUnverifiedReference('General alternator service practice (EmersonEIMS); confirm limits and procedure in the alternator and AVR manuals.')).toBe(true);
    // the ISO 8528-5 cause: a standard cited by title, "clauses and values NOT VERIFIED"
    expect(REF_ISO_8528_5).toMatch(/NOT VERIFIED/);
    expect(isUnverifiedReference(REF_ISO_8528_5)).toBe(true);
    // title only, no clause/page or edition (the BCI load-test guide)
    expect(isUnverifiedReference('Battery Council International load-test guide: about 12.4 V at rest ≈ 75 % charge.')).toBe(true);
    // clause or page without an edition, or an edition without a clause or page: still unverified
    expect(isUnverifiedReference('Perkins 1100 Series Operation and Maintenance Manual, p. 54')).toBe(true);
    expect(isUnverifiedReference('Perkins 1100 Series Operation and Maintenance Manual, edition 2019')).toBe(true);
    // a specific page and edition, not marked unverified: a verified published source
    expect(isUnverifiedReference('Perkins 1100 Series Operation and Maintenance Manual SEBU8311, edition 2019, p. 54')).toBe(false);
    expect(isUnverifiedReference('Perkins 1100 Series Operation and Maintenance Manual SEBU8311, edition 2019, p. 54 (NOT VERIFIED against a held copy)')).toBe(true);
  });

  it('every ranked cause carries the flag; a supported verified cause would always be listed first', () => {
    for (const f of FAMILIES) {
      const variants: Array<Record<string, string | number>> = [screenNo];
      for (const q of f.questions) if (q.kind === 'choice' && !q.id.startsWith('screen.')) for (const o of q.options) variants.push({ ...screenNo, [q.id]: o.value });
      for (const v of variants) {
        const r = diagnose(f, v);
        r.ranked.forEach((c) => expect(c.unverified).toBe(isUnverifiedReference(c.reference)));
        const firstVerified = r.ranked.findIndex((c) => !c.unverified && c.score > 0);
        if (firstVerified >= 0) expect(firstVerified).toBe(0);
      }
    }
  });

  it('today no cause has a verified clause/page/edition source, so none is presented as confirmed: the ISO 8528-5 and BCI causes are UNVERIFIED', () => {
    const all = FAMILIES.flatMap((f) => f.causes);
    expect(all.filter((c) => !isUnverifiedReference(c.reference))).toEqual([]);
    const iso = all.find((c) => c.reference === REF_ISO_8528_5)!;
    expect(iso).toBeTruthy();
    const nc = diagnose(NO_CRANK, { ...screenNo, systemVoltage: '12', starterSound: 'click' });
    expect(nc.ranked.find((c) => c.id === 'battery')!.unverified).toBe(true);
    expect(nc.ranked[0].unverified).toBe(true);
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
