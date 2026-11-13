/**
 * Generator Oracle, Engineering Apps directive §3 "Critical": suspected oil
 * starvation, bearing failure, seizure or dangerous conditions must give
 * stop-operation guidance, not continued running.
 *
 * 2026-11-13 probe before the fix: "engine seized", "crankshaft seized after
 * overhaul" and "engine knocking after overhaul" got no answer at all; "metal
 * particles in oil" and "bearing noise" no stop line; overheating only a
 * radiator-cap warning; oil/coolant mixing and reverse power nothing specific.
 */
import { describe, it, expect } from 'vitest';
import { answerOracle } from '@/lib/generator-oracle/server/answer';

const safety = (q: string) => {
  const a = answerOracle(q);
  return { a, s: a.text.split('\n\n').filter((p) => p.startsWith('⚠️')).join(' ') };
};

describe('stop-operation guidance', () => {
  it.each([
    'engine seized',
    'crankshaft seized after overhaul',
    'engine knocking after overhaul',
    'metal particles in oil',
    'bearing noise from engine',
    'big end knocking',
  ])('"%s" tells the technician to stop the engine and not restart', (q) => {
    const { a, s } = safety(q);
    expect(a.found).toBe(true);
    expect(s).toMatch(/STOP THE ENGINE/);
    expect(s).toMatch(/Do not restart/);
  });

  it('a newly overhauled engine gets the post-overhaul checks', () => {
    expect(safety('blue smoke after rebuild').s).toMatch(/NEWLY OVERHAULED ENGINE[^]*stop at once/);
    expect(safety('crankshaft seized after overhaul').s).toMatch(/Prime the lubrication system/);
  });

  it('overheating says take the load off and stop, and never add cold coolant', () => {
    for (const q of ['engine overheating', 'high coolant temperature shutdown']) {
      const { s } = safety(q);
      expect(s).toMatch(/take the load off and stop the engine/);
      expect(s).toMatch(/Never pour cold water or coolant into a hot engine/);
    }
  });

  it('oil and coolant mixing says stop', () => {
    expect(safety('oil in coolant').s).toMatch(/OIL AND COOLANT MIXING: stop the engine/);
    expect(safety('white smoke and coolant loss').s).toMatch(/head gasket/);
  });

  it('reverse power says do not reclose until the cause is found', () => {
    expect(safety('reverse power trip').s).toMatch(/Do not reset and reclose the breaker/);
  });

  it('an alternator bearing gets the alternator warning, not the engine oil-starvation one', () => {
    const { s } = safety('alternator bearing noise');
    expect(s).toMatch(/alternator bearing/);
    expect(s).not.toMatch(/STOP THE ENGINE: knocking/);
  });

  it('low oil pressure still stops the engine (unchanged)', () => {
    expect(safety('oil pressure dropping while running').s).toMatch(/Stop the engine: running with low oil pressure/);
  });

  it('everyday faults get no false alarm', () => {
    expect(safety('black smoke under load').s).not.toMatch(/STOP THE ENGINE|OVERHEATING|REVERSE POWER/);
    expect(safety('battery flat').s).not.toMatch(/STOP THE ENGINE/);
  });
});
