import { describe, it, expect } from 'vitest';
import { syncCheck, IEEE1547_2003_REFERENCE, type SyncLimits } from '@/lib/generator-oracle/calc/electrical';

// Safety review 2026-11-14: no built-in limits are applied; IEEE 1547 is DER/utility
// interconnection, not isolated-bus generator paralleling.
const verified: SyncLimits = { maxDfHz: 0.1, maxDvPct: 5, maxDphiDeg: 10, source: 'Controller manual §7.3 (test)', verifiedFor: 'Site X, controller Y, settings file Z (test)', verifiedBy: 'Engineer A (test)' };
const base = {
  application: 'island-bus' as const, incomingV: 415, busV: 410, incomingHz: 50.05, busHz: 50.0, phaseAngleDeg: 5,
  busLive: true, phaseSequence: 'same' as const, syncRelayInService: 'yes' as const, protectionInService: 'yes' as const, breakerReady: 'yes' as const,
  limits: verified,
};
const run = (p: Partial<Parameters<typeof syncCheck>[0]>) => { const r = syncCheck({ ...base, ...p }); if (!r.ok) throw new Error(r.errors.join()); return r; };

describe('synchronising check: only verified limits can give a within-limits result', () => {
  it('verified limits, all conditions confirmed, readings inside → WITHIN VERIFIED LIMITS (never "permit close")', () => {
    const r = run({});
    expect(r.value.verdict).toBe('WITHIN VERIFIED LIMITS');
    expect(r.value.reasons.join(' ')).toMatch(/relay \/ controller makes the close decision/);
    expect(r.value).toMatchObject({ dfHz: 0.05, dvPct: 1.22, dphiDeg: 5, slipPeriodS: 20 });
  });
  it('no limits entered → LIMITS NOT VERIFIED, even with perfect readings', () => {
    expect(run({ limits: null, incomingHz: 50, phaseAngleDeg: 0, incomingV: 410 }).value.verdict).toBe('LIMITS NOT VERIFIED');
  });
  it.each([
    [{ ...verified, source: '' }, /no source document/],
    [{ ...verified, verifiedFor: '' }, /not tied to this installation/],
    [{ ...verified, verifiedBy: ' ' }, /named, competent person/],
  ])('limits missing provenance → LIMITS NOT VERIFIED (%#)', (limits, why) => {
    const r = run({ limits });
    expect(r.value.verdict).toBe('LIMITS NOT VERIFIED');
    expect(r.value.reasons.join(' ')).toMatch(why);
  });
  it('IEEE 1547-2003 values are reference only: entering them without provenance still does not pass', () => {
    const b = IEEE1547_2003_REFERENCE[0];
    const r = run({ limits: { maxDfHz: b.maxDfHz, maxDvPct: b.maxDvPct, maxDphiDeg: b.maxDphiDeg, source: '', verifiedFor: '', verifiedBy: '' } });
    expect(r.value.verdict).toBe('LIMITS NOT VERIFIED');
    expect(r.assumptions.join(' ')).toMatch(/not limits for paralleling generators on an isolated bus/);
  });
  it.each([
    [{ phaseSequence: 'not-checked' as const }, /Phase sequence not checked/],
    [{ syncRelayInService: 'unknown' as const }, /Synchronising relay in service: not confirmed/],
    [{ protectionInService: 'unknown' as const }, /Protection in service: not confirmed/],
    [{ breakerReady: 'unknown' as const }, /Breaker ready: not confirmed/],
  ])('unconfirmed condition → LIMITS NOT VERIFIED (%#)', (p, why) => {
    const r = run(p);
    expect(r.value.verdict).toBe('LIMITS NOT VERIFIED');
    expect(r.value.reasons.join(' ')).toMatch(why);
  });
});

describe('synchronising check: DO NOT CLOSE always wins', () => {
  it.each([
    [{ phaseSequence: 'reversed' as const }, /Phase sequence reversed/],
    [{ syncRelayInService: 'no' as const }, /out of service/],
    [{ protectionInService: 'no' as const }, /protection/],
    [{ breakerReady: 'no' as const }, /Breaker not ready/],
    [{ phaseAngleDeg: 12 }, /Δφ\| 12° exceeds the limit 10°/],
    [{ incomingHz: 50.2 }, /Δf\| 0.2 Hz exceeds/],
    [{ incomingV: 440 }, /ΔV\| 7.32 % exceeds/],
    [{ phaseAngleDeg: 45, limits: null }, /grossly outside/],
    [{ incomingHz: 52, limits: null }, /grossly outside/],
  ])('%o → DO NOT CLOSE', (p, why) => {
    const r = run(p);
    expect(r.value.verdict).toBe('DO NOT CLOSE');
    expect(r.value.reasons.join(' ')).toMatch(why);
  });
  it('a block reason wins over unverified limits (unsafe is reported, not just "unverified")', () => {
    expect(run({ limits: null, phaseSequence: 'reversed' }).value.verdict).toBe('DO NOT CLOSE');
  });
  it('limits wider than any synchronising window are refused as input', () => {
    expect(syncCheck({ ...base, limits: { ...verified, maxDphiDeg: 60 } }).ok).toBe(false);
  });
  it('negative phase angle uses magnitude', () => {
    expect(run({ phaseAngleDeg: -12 }).value.verdict).toBe('DO NOT CLOSE');
  });
});

describe('synchronising check: other cases', () => {
  it('dead bus is not a synchronising case', () => {
    const r = run({ busLive: false, busV: 0 });
    expect(r.value.verdict).toBe('DEAD BUS: NOT A SYNCHRONISING CASE');
    expect(r.warnings.join(' ')).toMatch(/dead-bus closing/);
  });
  it('incoming slower than the bus → reverse-power warning (with any verdict)', () => {
    expect(run({ incomingHz: 49.97 }).warnings.join(' ')).toMatch(/reverse power/);
  });
  it('application must be stated; impossible readings refused', () => {
    expect(syncCheck({ ...base, application: 'x' as never }).ok).toBe(false);
    expect(syncCheck({ ...base, incomingHz: 0 }).ok).toBe(false);
    expect(syncCheck({ ...base, phaseAngleDeg: 270 }).ok).toBe(false);
  });
});
