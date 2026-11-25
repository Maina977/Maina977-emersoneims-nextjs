/**
 * Re-review of 126efdbc, M-2 (2026-11-25): the water-body check uses bundled offline maps
 * (kenyaWater.ts: OpenStreetMap lakes and reservoirs, ODbL; Natural Earth coast, public domain)
 * instead of the Open-Meteo elevation API (paid licence for commercial use; unavailable on every
 * run). Required: points in Lake Victoria, Lake Turkana and the Indian Ocean are refused; land
 * points pass, islands included; the check makes no network call; the real borehole records are
 * not refused.
 */
import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { siteCheck, openWaterAt, inKenya, WATER_CHECK_OK } from '@/external/borehole-ai-engine/src/kenyaLand';
import { KENYA_WATER } from '@/external/borehole-ai-engine/src/kenyaWater';

const ROOT = path.resolve(__dirname, '../..');

describe('M-2: offline water-body check', () => {
  it('refuses Lake Victoria (Winam Gulf and the open lake), Lake Turkana, Lake Naivasha and the Indian Ocean', async () => {
    const fetchSpy = vi.fn(async () => { throw new Error('no network in this check'); });
    (globalThis as any).fetch = fetchSpy;
    for (const [lat, lon, re] of [
      [-0.25, 34.55, /on open water \(Lake Victoria/],
      [-0.35, 34.0, /on open water \(Lake Victoria/],
      [3.5, 36.1, /on open water \(Lake Turkana/],
      [4.2, 36.0, /on open water \(Lake Turkana/],
      [-0.77, 36.35, /on open water \(Lake Naivasha/],
      [-3.22, 40.15, /in the sea \(the Indian Ocean, 2\.\d km off the mapped coastline\)/],
      [-4.08, 39.72, /in the sea \(the Indian Ocean/],
    ] as [number, number, RegExp][]) {
      const r = await siteCheck(lat, lon);
      expect(r.refusal, `${lat},${lon}`).toMatch(re);
    }
    // ODbL: the attribution is part of every refusal and every passed check
    expect((await siteCheck(3.5, 36.1)).refusal).toMatch(/© OpenStreetMap contributors \(ODbL\); coast: Natural Earth/);
    expect(WATER_CHECK_OK).toMatch(/© OpenStreetMap contributors \(ODbL\)/);
    // further offshore the Kenya outline already refuses it
    expect((await siteCheck(-4.5, 40.5)).refusal).toMatch(/outside Kenya/);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('passes land, towns on the shore and islands: Nairobi, Kisumu, Homa Bay, Mombasa Island, Lamu, Malindi, Rusinga, Mfangano, Central Island', async () => {
    for (const [lat, lon] of [[-1.2921, 36.8219], [-0.0917, 34.768], [-0.527, 34.457], [-4.05, 39.665], [-2.2717, 40.902], [-3.2192, 40.1169], [-0.40, 34.17], [-0.46, 34.0], [3.495, 36.04], [-0.717, 36.433], [1.0157, 35.0062]]) {
      expect(await siteCheck(lat, lon), `${lat},${lon}`).toEqual({ refusal: null, waterCheck: 'ok', note: WATER_CHECK_OK });
    }
  });

  it('a pin on the mapped water but within the shoreline margin is not refused: the customer confirms it (Kalokol shoreline borehole)', async () => {
    const r = await siteCheck(3.31944, 35.96444);
    expect(r.refusal).toBeNull();
    expect(r.waterCheck).toBe('near-shore');
    expect(r.note).toMatch(/^Water-body check inconclusive: the pin is within 0\.1 km of the mapped shore of Lake Turkana \(Lake and reservoir maps © OpenStreetMap contributors \(ODbL\)/);
  });

  it('recorded boreholes are not refused: WRA field records 0 of 3,445; registry 2 of 22,820 (both geocoded kilometres into the lake)', () => {
    const wra: any[] = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/wra-boreholes.json'), 'utf8'));
    const reg: any = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/gov-wells-kenya.json'), 'utf8'));
    const iLat = reg.fields.indexOf('lat'), iLon = reg.fields.indexOf('lon');
    const refused = (pts: [number, number][]) => pts.filter(([la, lo]) => inKenya(la, lo)).filter(([la, lo]) => { const w = openWaterAt(la, lo); return !!w && !w.nearShore; });
    expect(refused(wra.map((r) => [r.lat, r.lon]))).toEqual([]);
    const bad = refused(reg.wells.map((r: any[]) => [Number(r[iLat]), Number(r[iLon])]));
    expect(bad.map(([la, lo]) => `${la},${lo}:${openWaterAt(la, lo)!.name}:${openWaterAt(la, lo)!.shoreKm.toFixed(1)}`)).toEqual([
      '-0.12079,34.70233:Lake Victoria:2.5',
      '3.85443,35.93928:Lake Turkana:8.9',
    ]);
  }, 60000);

  it('the dataset carries its sources and licences; Open-Meteo is no longer called by the check', () => {
    const src = fs.readFileSync(path.join(ROOT, 'external/borehole-ai-engine/src/kenyaWater.ts'), 'utf8');
    expect(src).toMatch(/OpenStreetMap contributors, Open Database Licence \(ODbL\) 1\.0/);
    expect(src).toMatch(/Natural Earth 10 m land polygons \(public domain/);
    const names = KENYA_WATER.map((w) => w.name);
    for (const n of ['Lake Victoria', 'Lake Turkana', 'Lake Naivasha', 'Lake Baringo', 'Lake Nakuru', 'Lake Bogoria', 'Lake Elmenteita', 'Lake Magadi', 'Lake Jipe', 'Lake Chala', 'Masinga Reservoir', 'Kiambere Reservoir']) expect(names).toContain(n);
    const land = fs.readFileSync(path.join(ROOT, 'external/borehole-ai-engine/src/kenyaLand.ts'), 'utf8');
    expect(land).not.toMatch(/api\.open-meteo\.com|fetch\(/);
  });
});
