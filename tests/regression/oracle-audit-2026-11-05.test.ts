/**
 * Generator Oracle search, self-audit 2026-11-05.
 */
import { describe, it, expect } from 'vitest';
import { searchIndex, diagnoseFromSymptoms } from '@/lib/generator-oracle/server/faultIndex';

const titles = (q: string, n = 4) => searchIndex({ query: q, pageSize: n }).results.map((r) => r.title);

describe('Oracle search 2026-11-05', () => {
  it('"no voltage output" never lists an over-voltage alarm near the top', () => {
    expect(titles('no voltage output').some((t) => /over\s?-?volt/i.test(t))).toBe(false);
  });
  it('a shutdown after running a while leads with heat/fuel/oil/load, not overspeed', () => {
    for (const q of ['generator shuts down after 10 minutes', 'shuts down after running for a while']) {
      const top = titles(q, 3);
      expect(top.length).toBeGreaterThan(0);
      expect(top.some((t) => /overspeed|over voltage|overvoltage|fail to start/i.test(t))).toBe(false);
      expect(/coolant|temperature|fuel|oil|overload|current/i.test(top[0])).toBe(true);
    }
    const d = diagnoseFromSymptoms({ symptoms: ['shuts down after 10 minutes'], topN: 3 });
    expect(d.ranked.length).toBeGreaterThan(0);
    expect(/overspeed/i.test(d.ranked[0].title)).toBe(false);
  });
  it('smoke or burning from the alternator or panel carries a safety notice', () => {
    for (const q of ['smoke from alternator', 'burning smell from panel', 'alternator winding smoking']) {
      expect(searchIndex({ query: q }).notice || '').toMatch(/^SAFETY FIRST: ELECTRICAL BURNING/);
    }
    expect(searchIndex({ query: 'black smoke' }).notice || '').not.toMatch(/ELECTRICAL BURNING/);
  });
  it('loss of excitation is found', () => {
    expect(titles('alternator no excitation')[0]).toMatch(/excitation/i);
  });
  it('a brand and an unknown number explains what to type', () => {
    const r = searchIndex({ query: 'DSE 200' });
    expect(r.total).toBe(0);
    expect(r.notice || '').toMatch(/alarm NAME/);
  });
  it('exact alarm names and J1939 codes are unchanged', () => {
    expect(titles('low oil pressure shutdown')[0]).toMatch(/low oil pressure shutdown/i);
    expect(searchIndex({ query: 'SPN 110 FMI 0' }).results[0].code).toBe('SPN110-FMI0');
    expect(titles('fail to stop')[0]).toMatch(/fail to stop/i);
  });
});

import { lookupFaultCode, withSafety } from '@/lib/generator-oracle/server/faultIndex';
import { getAllFaultCodes } from '@/lib/generator-oracle/controllerFaultCodes';
import { analyzeParameter } from '@/components/generator-oracle/TechnicianInputDiagnostics';

describe('Oracle re-audit 2026-11-05 (second round)', () => {
  it('a healthy 60 Hz set reads no Critical once 60 Hz is chosen', () => {
    const r = [
      analyzeParameter('rpm', 1800, '24', '60-120'), analyzeParameter('frequency', 60, '24', '60-120'),
      analyzeParameter('voltageL1N', 120, '24', '60-120'), analyzeParameter('voltageL1L2', 208, '24', '60-120'),
      analyzeParameter('voltageL1N', 277, '24', '60-277'), analyzeParameter('voltageL1L2', 480, '24', '60-277'),
    ];
    expect(r.every((x) => x && x.status === 'normal')).toBe(true);
    expect(analyzeParameter('frequency', 60, '24', '50-230')!.status).toBe('critical');
  });
  it('impossible voltage, frequency and current readings are refused', () => {
    expect(analyzeParameter('voltageL1N', 9999)).toBeNull();
    expect(analyzeParameter('frequency', 500)).toBeNull();
    expect(analyzeParameter('currentL1', -1)).toBeNull();
  });
  it('engine speed has real causes, not "System fault / Sensor failure"', () => {
    const r = analyzeParameter('rpm', 1400)!;
    expect(r.possibleCauses.join(' ')).not.toMatch(/System fault/);
  });
  it('a ground fault gets isolation and insulation-test steps, not menu steps', () => {
    const all = getAllFaultCodes().map(withSafety);
    const gf = all.filter((c) => /\b(ground|earth)\s*fault\b/i.test(c.title));
    expect(gf.length).toBeGreaterThan(0);
    for (const c of gf) {
      const steps = (c.diagnosticSteps || []).map((s) => s.action);
      expect(steps[0]).toMatch(/Isolate/);
      expect(steps.some((s) => /^Navigate to/i.test(s))).toBe(false);
    }
    // Far fewer alarms now share one step list verbatim.
    const lists = new Map<string, number>();
    for (const c of all) { const k = c.brand + '|' + JSON.stringify((c.diagnosticSteps || []).map((s) => s.action)); lists.set(k, (lists.get(k) || 0) + 1); }
    const worst = Math.max(...lists.values());
    expect(worst).toBeLessThan(20);
  });
  it('coolant leak carries the hot-coolant notice; crankcase is not "crank"', () => {
    expect(searchIndex({ query: 'coolant leak' }).notice || '').toMatch(/HOT COOLANT/);
    const d = diagnoseFromSymptoms({ symptoms: ['crankcase pressure high'] });
    expect(JSON.stringify(d.safety || [])).not.toMatch(/can crank or start/);
  });
  it('SPN 101 FMI 0 names blow-by and the breather, not generic over-range', () => {
    const r = searchIndex({ query: 'SPN 101 FMI 0' }).results.find((x) => x.brand === 'J1939 engine codes')!;
    const full = lookupFaultCode(r.code, r.brand).exactMatches[0] as any;
    expect(JSON.stringify(full)).toMatch(/blow-by/i);
  });
});
