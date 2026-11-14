import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import refs from '../../data/aquascan/soil/kenya-soilgrids-2.0-1km-v1/reference-points.json';
import { homolosineSinusoidal, soilAt, loadKenyaSoil, KENYA_SOIL_DATASET } from '@/lib/aquascan-soil/kenyaSoil';
import { GET } from '@/app/api/aquascan/soil/route';

const DIR = path.resolve('data/aquascan/soil', KENYA_SOIL_DATASET);
const manifest = JSON.parse(fs.readFileSync(path.join(DIR, 'manifest.json'), 'utf8'));

describe('Kenya soil dataset', () => {
  it('loads and verifies: manifest checks and every file hash', () => {
    const ds = loadKenyaSoil();
    expect(ds.problems).toEqual([]);
    expect(ds.verified).toBe(true);
    expect(manifest.layers).toHaveLength(18);
  });
  it('was built from verified ISRIC data: full-file SHA-256 matched and the window was identical', () => {
    expect(manifest.equivalenceProof).toEqual({ layer: 'clay_0-5cm_mean', fullFileSha256Verified: true, windowIdentical: true });
    for (const l of manifest.layers) expect(l.source.isricFullFileSha256).toMatch(/^[0-9a-f]{64}$/);
  });
  it('carries the CC BY 4.0 attribution, licence link and changes made', () => {
    expect(manifest.licence.attribution).toMatch(/ISRIC/);
    expect(manifest.licence.url).toMatch(/creativecommons\.org\/licenses\/by\/4\.0/);
    expect(manifest.licence.changesMade).toMatch(/Clipped to Kenya/);
  });
});

describe('projection matches GDAL (independent reference points)', () => {
  it(`all ${refs.length} points within 0.1 m of GDAL, same grid cell`, () => {
    const g = manifest.grid;
    for (const r of refs) {
      const p = homolosineSinusoidal(r.lat, r.lon);
      expect(Math.abs(p.x - r.x)).toBeLessThan(0.1);
      expect(Math.abs(p.y - r.y)).toBeLessThan(0.1);
      expect(Math.floor((p.x - g.origin[0]) / g.pixel[0])).toBe(r.col);
      expect(Math.floor((p.y - g.origin[1]) / g.pixel[1])).toBe(r.row);
    }
  });
});

describe('point lookup', () => {
  it('Karen, Nairobi: values in plausible ranges with units, 0–30 cm means, citation and version', () => {
    const s = soilAt(-1.3197, 36.7073);
    expect(s.status).toBe('OK');
    expect(s.units.clay).toBe('%');
    for (const p of ['clay', 'sand', 'silt']) expect(s.mean0to30[p]!).toBeGreaterThanOrEqual(0);
    const tex = s.mean0to30.clay! + s.mean0to30.sand! + s.mean0to30.silt!;
    expect(tex).toBeGreaterThan(95); expect(tex).toBeLessThan(105); // texture fractions sum to ~100 %
    expect(s.mean0to30.phh2o!).toBeGreaterThan(3.5); expect(s.mean0to30.phh2o!).toBeLessThan(10);
    expect(s.mean0to30.bdod!).toBeGreaterThan(0.5); expect(s.mean0to30.bdod!).toBeLessThan(2.1);
    expect(s.dataset.id).toBe(KENYA_SOIL_DATASET);
    expect(s.citation).toMatch(/CC BY 4\.0/);
    expect(s.note).toMatch(/not a site measurement/);
  });
  it('Nairobi CBD: texture and pH masked (urban) → PARTIAL, missing properties listed, nothing filled in', () => {
    const s = soilAt(-1.2921, 36.8219);
    expect(s.status).toBe('PARTIAL');
    expect(s.missing).toEqual(['clay', 'sand', 'silt', 'phh2o']);
    expect(s.mean0to30.clay).toBeNull();
    expect(s.mean0to30.bdod).not.toBeNull();
  });
  it('Garissa: no mapped soil in this cell → INSUFFICIENT EVIDENCE (matches ISRIC REST, Oct 2026)', () => {
    expect(soilAt(-0.4532, 39.6461).status).toBe('INSUFFICIENT EVIDENCE');
  });
  it('0–30 cm mean is the thickness-weighted mean (5/10/15 cm)', () => {
    const s = soilAt(1.0, 35.0);
    const v = s.values.clay;
    expect(s.mean0to30.clay).toBeCloseTo(Math.round(((v['0-5cm']! * 5 + v['5-15cm']! * 10 + v['15-30cm']! * 15) / 30) * 100) / 100, 9);
  });
  it('deterministic: 1,000 lookups of Kitale give the identical answer', () => {
    const a = JSON.stringify(soilAt(1.0, 35.0));
    for (let i = 0; i < 1000; i++) expect(JSON.stringify(soilAt(1.0, 35.0))).toBe(a);
  });
  it('outside Kenya: INSUFFICIENT EVIDENCE, nothing fetched', () => {
    const s = soilAt(51.5, -0.12);
    expect(s.status).toBe('INSUFFICIENT EVIDENCE');
    expect(s.reason).toMatch(/Outside the Kenya soil dataset/);
  });
  it('Lake Turkana open water: no mapped soil → INSUFFICIENT EVIDENCE', () => {
    const s = soilAt(3.6, 36.1);
    expect(s.status).toBe('INSUFFICIENT EVIDENCE');
  });
  it('a tampered grid file is refused', () => {
    const tmp = fs.mkdtempSync(path.join(process.cwd(), '.tmp-soil-'));
    try {
      fs.cpSync(DIR, path.join(tmp, KENYA_SOIL_DATASET), { recursive: true });
      const f = path.join(tmp, KENYA_SOIL_DATASET, 'clay_0-5cm_mean.i16');
      const b = fs.readFileSync(f); b[1000] ^= 1; fs.writeFileSync(f, b);
      const s = soilAt(-1.2921, 36.8219, tmp);
      expect(s.status).toBe('INSUFFICIENT EVIDENCE');
      expect(s.reason).toMatch(/failed verification/);
    } finally { fs.rmSync(tmp, { recursive: true, force: true }); loadKenyaSoil(); }
  });
});

describe('API route', () => {
  it('GET returns the lookup; bad input is refused', async () => {
    const ok = await GET(new Request('http://x/api/aquascan/soil?lat=-1.2921&lon=36.8219'));
    expect(ok.status).toBe(200);
    expect((await ok.json()).status).toBe('PARTIAL');
    expect((await GET(new Request('http://x/api/aquascan/soil?lat=abc&lon=1'))).status).toBe(400);
    expect((await GET(new Request('http://x/api/aquascan/soil?lat=1'))).status).toBe(400);
  });
});
