import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { loadKenyaPoints, pointsNear, _resetKenyaPoints, type Row } from '@/lib/osm/kenyaPoints';

// Tiny TEST index (not OSM data): two wells and a school near Kitale, one pump far away.
function fixture(rows: Row[], corrupt = false) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kp-'));
  const gz = zlib.gzipSync(Buffer.from(JSON.stringify(rows)));
  fs.writeFileSync(path.join(dir, 'points.json.gz'), corrupt ? Buffer.concat([gz, Buffer.from('x')]) : gz);
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ dataset: 'test', sourceMd5: 'x', sourceLastModified: 'TEST', builtOn: '2026-11-20', points: rows.length, outputSha256: crypto.createHash('sha256').update(gz).digest('hex'), attribution: '© OpenStreetMap contributors', licence: 'ODbL' }));
  return dir;
}
const rows: Row[] = [
  [1.0200, 35.0062, 'water_well', 'Test well A', { depth: '60' }],
  [1.0157, 35.0150, 'hand_pump', null, null],
  [1.0160, 35.0070, 'school', 'Test school', null],
  [-1.2900, 36.8200, 'powered_pump', null, null],
];
beforeEach(() => _resetKenyaPoints());

describe('offline Kenya point index', () => {
  it('finds water points within the radius, nearest first, with tagged values only', () => {
    const idx = loadKenyaPoints(fixture(rows));
    const r = pointsNear(1.0157, 35.0062, 2000, ['water_well', 'borehole', 'hand_pump', 'powered_pump'], idx)!;
    expect(r.found.map((f) => f.kind)).toEqual(['water_well', 'hand_pump']); // 0.0043° lat ≈ 478 m; 0.0088° lon ≈ 979 m
    expect(r.found[0].distanceM).toBeLessThanOrEqual(r.found[1].distanceM);
    expect(r.found.find((f) => f.kind === 'water_well')!.extra).toEqual({ depth: '60' });
    expect(r.found.some((f) => f.kind === 'school')).toBe(false); // kind filter
  });
  it('nothing mapped nearby → empty list (NO MATCH FOUND), not null', () => {
    const idx = loadKenyaPoints(fixture(rows));
    expect(pointsNear(3.5, 39.0, 1000, ['water_well'], idx)!.found).toEqual([]);
  });
  it('outside Kenya or missing/corrupt index → null (caller falls back to Overpass)', () => {
    const idx = loadKenyaPoints(fixture(rows));
    expect(pointsNear(51.5, -0.1, 1000, ['water_well'], idx)).toBeNull();
    _resetKenyaPoints();
    expect(loadKenyaPoints(fixture(rows, true))).toBeNull();
    _resetKenyaPoints();
    expect(loadKenyaPoints(path.join(os.tmpdir(), 'no-such-dir-kp'))).toBeNull();
  });
});
