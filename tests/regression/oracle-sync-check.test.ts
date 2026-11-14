import { describe, it, expect } from 'vitest';
import { syncCheck } from '@/lib/generator-oracle/calc/electrical';

const base = { incomingV: 415, busV: 410, incomingHz: 50.1, busHz: 50.0, phaseAngleDeg: 8 };

describe('synchronising check', () => {
  it('within IEEE 1547-2003 0–500 kVA limits: Δf 0.1 Hz, ΔV 1.22 %, Δφ 8° → permit; slip period 10 s', () => {
    const r = syncCheck({ ...base, limits: { preset: 'ieee1547-2003-0-500kVA' } });
    if (!r.ok) throw new Error(r.errors.join());
    expect(r.value).toMatchObject({ dfHz: 0.1, dvPct: 1.22, dphiDeg: 8, permitClose: true, slipPeriodS: 10 });
    expect(r.reference).toMatch(/IEEE 1547-2003/);
  });
  it('same readings fail the >500–1500 kVA band on nothing, but 18° fails it (limit 15°)', () => {
    const r = syncCheck({ ...base, phaseAngleDeg: 18, limits: { preset: 'ieee1547-2003-500-1500kVA' } });
    if (!r.ok) throw new Error();
    expect(r.value.withinPhase).toBe(false);
    expect(r.value.permitClose).toBe(false);
    expect(r.warnings.join(' ')).toMatch(/Do NOT close/);
  });
  it('incoming slower than the bus → reverse-power warning', () => {
    const r = syncCheck({ ...base, incomingHz: 49.95, limits: { preset: 'ieee1547-2003-0-500kVA' } });
    if (!r.ok) throw new Error();
    expect(r.warnings.join(' ')).toMatch(/reverse power/);
  });
  it('user limits need their source; none are assumed', () => {
    const r = syncCheck({ ...base, limits: { maxDfHz: 0.067, maxDvPct: 5, maxDphiDeg: 10, source: '' } });
    expect(r.ok).toBe(false);
    const s = syncCheck({ ...base, limits: { maxDfHz: 0.067, maxDvPct: 5, maxDphiDeg: 10, source: 'Controller manual §7.3' } });
    if (!s.ok) throw new Error();
    expect(s.value.withinFrequency).toBe(false); // 0.1 Hz > 0.067 Hz
    expect(s.reference).toMatch(/Controller manual/);
  });
  it('impossible readings refused', () => {
    expect(syncCheck({ ...base, busHz: 0, limits: { preset: 'ieee1547-2003-0-500kVA' } }).ok).toBe(false);
    expect(syncCheck({ ...base, phaseAngleDeg: 270, limits: { preset: 'ieee1547-2003-0-500kVA' } }).ok).toBe(false);
  });
});
