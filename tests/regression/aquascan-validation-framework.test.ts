import { describe, it, expect } from 'vitest';
import { checkRecords, distanceM, spatialSplit, verifyManifest, blockId, type BoreholeRecord } from '@/lib/aquascan-validation/records';
import { errorStats, coverage, brier, auc, calibration, median, runValidation, type Prediction } from '@/lib/aquascan-validation/metrics';

// SYNTHETIC test fixtures only: they exercise the framework and are not borehole data.
const base: BoreholeRecord = {
  id: 'S-001', lat: -1.29, lon: 36.82, positionSource: 'gps', drilledOn: '2024-03-01', county: 'Nairobi', setting: 'volcanic',
  drilledDepthM: 200, testedYieldM3h: 5, outcome: 'productive', productiveThresholdM3h: 1, sourceDocument: 'synthetic', verification: 'verified', licence: 'synthetic',
};
const rec = (p: Partial<BoreholeRecord>): BoreholeRecord => ({ ...base, ...p });

describe('record checks', () => {
  it('a clean record is accepted with no issues', () => {
    const r = checkRecords([base]);
    expect(r.accepted).toHaveLength(1);
    expect(r.issues).toHaveLength(0);
  });
  it.each([
    [{ lat: 36.82, lon: -1.29 }, /outside Kenya/],
    [{ drilledDepthM: 2000 }, /not plausible/],
    [{ testedYieldM3h: 1200 }, /m³\/day or L\/s/],
    [{ staticWaterLevelM: 250 }, /deeper than the borehole/],
    [{ waterStrikesM: [50, 260] }, /water strike/],
    [{ outcome: 'dry', testedYieldM3h: 3 }, /dry/],
    [{ outcome: 'productive', testedYieldM3h: 0.5 }, /below its own threshold/],
    [{ licence: '' }, /Licence/],
    [{ drilledOn: 'last year' }, /date/],
  ] as Array<[Partial<BoreholeRecord>, RegExp]>)('rejects %o', (patch, msg) => {
    const r = checkRecords([rec(patch)]);
    expect(r.accepted).toHaveLength(0);
    expect(r.issues.map((i) => i.message).join(' ')).toMatch(msg);
  });
  it('flags without rejecting: address position, unverified, no pump test', () => {
    const r = checkRecords([rec({ positionSource: 'address', verification: 'unverified', testedYieldM3h: null })]);
    expect(r.accepted).toHaveLength(1);
    expect(r.issues.filter((i) => i.level === 'flag')).toHaveLength(3);
  });
  it('duplicate: 30 m apart, same depth and date → second rejected', () => {
    const r = checkRecords([base, rec({ id: 'S-002', lat: -1.29027 })]);
    expect(r.accepted.map((x) => x.id)).toEqual(['S-001']);
    expect(r.issues[0].message).toMatch(/Duplicate of S-001/);
  });
  it('not a duplicate when the date differs', () => {
    expect(checkRecords([base, rec({ id: 'S-002', lat: -1.29027, drilledOn: '2025-01-01' })]).accepted).toHaveLength(2);
  });
  it('haversine: 1° of latitude ≈ 111.195 km', () => {
    expect(distanceM({ lat: 0, lon: 37 }, { lat: 1, lon: 37 }) / 1000).toBeCloseTo(111.195, 2);
  });
});

describe('frozen spatial split', () => {
  const many = Array.from({ length: 200 }, (_, i) => rec({ id: `S-${String(i).padStart(3, '0')}`, lat: -4 + (i % 20) * 0.4, lon: 34.5 + Math.floor(i / 20) * 0.6, drilledOn: `2020-01-${String((i % 28) + 1).padStart(2, '0')}` }));
  it('deterministic: same seed → same split', () => {
    const a = spatialSplit(many, { seed: 'v1', testFraction: 0.3, frozenOn: '2026-11-14' });
    const b = spatialSplit(many, { seed: 'v1', testFraction: 0.3, frozenOn: '2026-11-14' });
    expect(a).toEqual(b);
    expect(a.testIds.length).toBeGreaterThan(20);
    expect(a.trainIds.length).toBeGreaterThan(80);
  });
  it('no 10 km block appears in both parts (no spatial leakage)', () => {
    const neighbours = many.flatMap((r) => [r, rec({ ...r, id: `${r.id}-n`, lat: r.lat + 0.005 })]);
    const m = spatialSplit(neighbours, { seed: 'v1', testFraction: 0.3, frozenOn: '2026-11-14' });
    const byId = new Map(neighbours.map((r) => [r.id, r]));
    const testBlocks = new Set(m.testIds.map((id) => { const r = byId.get(id)!; return blockId(r.lat, r.lon); }));
    for (const id of m.trainIds) { const r = byId.get(id)!; expect(testBlocks.has(blockId(r.lat, r.lon))).toBe(false); }
  });
  it('a tampered manifest is detected', () => {
    const m = spatialSplit(many, { seed: 'v1', testFraction: 0.3, frozenOn: '2026-11-14' });
    expect(verifyManifest(m)).toBe(true);
    const moved = { ...m, testIds: m.testIds.slice(1), trainIds: [...m.trainIds, m.testIds[0]] };
    expect(verifyManifest(moved)).toBe(false);
    expect(() => runValidation(many, moved, [])).toThrow(/fingerprint/);
  });
});

describe('metrics (hand calculations)', () => {
  it('errors 2, −2, 1 → bias 0.333, MAE 1.667, RMSE 1.732', () => {
    const s = errorStats([[10, 8], [6, 8], [9, 8]]);
    expect(s).toMatchObject({ n: 3, bias: 0.333, mae: 1.667, rmse: 1.732, maeCi95: null });
  });
  it('bootstrap CI is reproducible and brackets the MAE', () => {
    const pairs = Array.from({ length: 40 }, (_, i): [number, number] => [100 + ((i * 37) % 23) - 11, 100]);
    const a = errorStats(pairs), b = errorStats(pairs);
    expect(a.maeCi95).toEqual(b.maeCi95);
    expect(a.maeCi95![0]).toBeLessThanOrEqual(a.mae);
    expect(a.maeCi95![1]).toBeGreaterThanOrEqual(a.mae);
  });
  it('coverage: 2 of 3 inside', () => expect(coverage([{ low: 1, high: 3, obs: 2 }, { low: 1, high: 3, obs: 3 }, { low: 1, high: 3, obs: 4 }]).rate).toBe(0.667));
  it('Brier: ((0.9 − 1)² + 0.2²) / 2 = 0.025', () => expect(brier([{ p: 0.9, y: 1 }, { p: 0.2, y: 0 }])).toBe(0.025));
  it('AUC with a tie: 3.5 / 4 = 0.875', () => expect(auc([{ p: 0.9, y: 1 }, { p: 0.6, y: 1 }, { p: 0.6, y: 0 }, { p: 0.2, y: 0 }])).toBe(0.875));
  it('AUC undefined without both classes', () => expect(auc([{ p: 0.9, y: 1 }])).toBeNaN());
  it('calibration bands count every row once', () => {
    const rows = [0, 0.1, 0.25, 0.5, 0.79, 0.8, 1].map((p) => ({ p, y: 1 as const }));
    expect(calibration(rows).reduce((a, b) => a + b.n, 0)).toBe(7);
  });
  it('median of even and odd lists', () => { expect(median([3, 1, 2])).toBe(2); expect(median([4, 1, 3, 2])).toBe(2.5); });
});

describe('full validation run', () => {
  const recs = Array.from({ length: 120 }, (_, i) => rec({
    id: `S-${String(i).padStart(3, '0')}`, lat: -3.5 + (i % 12) * 0.6, lon: 34.6 + Math.floor(i / 12) * 0.65,
    county: `C${i % 4}`, setting: (['basement', 'volcanic', 'sedimentary', 'alluvial'] as const)[i % 4],
    drilledDepthM: 80 + (i % 4) * 40 + (i % 7), testedYieldM3h: i % 5 === 0 ? 0 : 1 + (i % 6), outcome: i % 5 === 0 ? 'dry' : 'productive', drilledOn: '2022-06-01',
  }));
  const m = spatialSplit(recs, { seed: 'v1', testFraction: 0.35, frozenOn: '2026-11-14' });
  // A useless model that always predicts 150 m and 3 m³/h, score 50.
  const flat: Prediction[] = recs.map((r) => ({ id: r.id, depthM: 150, depthLowM: 120, depthHighM: 180, yieldM3h: 3, yieldLowM3h: 1, yieldHighM3h: 5, successScore: 50, modelVersion: 'flat-test' }));
  it('a constant model does not beat the setting-median baseline, and the report says so', () => {
    const rep = runValidation(recs, m, flat);
    expect(rep.overall.sufficient).toBe(true);
    expect(rep.overall.beatsBaselines.depth).toBe(false);
    expect(rep.verdicts.join(' ')).toMatch(/does NOT beat/);
    expect(rep.verdicts.join(' ')).toMatch(/Hydrogeologist review/);
  });
  it('an informed model (true depth ± 2 m) beats the baselines', () => {
    const good: Prediction[] = recs.map((r, i) => ({ ...flat[i], depthM: r.drilledDepthM + ((i % 3) - 1) * 2, modelVersion: 'good-test' }));
    expect(runValidation(recs, m, good).overall.beatsBaselines.depth).toBe(true);
  });
  it('training records never enter the metrics; missing predictions are listed', () => {
    const rep = runValidation(recs, m, flat.slice(0, 60));
    expect(rep.overall.n).toBe(m.testIds.filter((id) => flat.slice(0, 60).some((p) => p.id === id)).length);
    expect(rep.missingPredictions.length).toBe(m.testIds.length - rep.overall.n);
  });
  it('small settings are reported as insufficient, never as accuracy', () => {
    const few = recs.slice(0, 30);
    const mf = spatialSplit(few, { seed: 'v1', testFraction: 0.35, frozenOn: '2026-11-14' });
    const rep = runValidation(few, mf, flat);
    expect(Object.values(rep.bySetting).every((v) => v === 'insufficient (fewer than 10 records)')).toBe(true);
  });
  it('the same frozen inputs reproduce the same report', () => {
    expect(JSON.stringify(runValidation(recs, m, flat))).toBe(JSON.stringify(runValidation(recs, m, flat)));
  });
});
