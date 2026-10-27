/**
 * AquaScan — every Kenyan county resolves to a hydrogeological province,
 * whatever spelling the geocoder returns (2026-10-27: "Nairobi City" missed,
 * so Nairobi's depth swung 117 m / 150 m between runs).
 */
import { describe, it, expect } from 'vitest';
import { getKenyaHydroPrior } from '../../external/borehole-ai-engine/src/kenyaHydroPriors';
import { getKenyaCountyFromCoords } from '../../external/borehole-ai-engine/src/boreholeDatabase';
import baseline from '../../public/data/kenya-baseline.json';

const units = (baseline as { units: Array<{ name: string; level: string; lat: number; lon: number }> }).units
  .filter((u) => u.level === 'county');

describe('Kenya county → province', () => {
  it('all 47 counties are in the baseline', () => {
    expect(units.length).toBe(47);
  });

  for (const u of units) {
    it(`${u.name} resolves`, () => {
      expect(getKenyaHydroPrior(u.name, 'KE'), u.name).not.toBeNull();
      expect(getKenyaHydroPrior(`${u.name} County`, 'KE'), `${u.name} County`).not.toBeNull();
    });
  }

  it('geocoder spellings resolve the same way', () => {
    for (const s of ['Nairobi City', 'Nairobi City County', 'nairobi', 'Garissa County']) {
      expect(getKenyaHydroPrior(s, 'KE'), s).not.toBeNull();
    }
    expect(getKenyaHydroPrior('Nairobi City', 'KE')!.province).toBe('VOLCANIC');
    expect(getKenyaHydroPrior('Garissa', 'KE')!.province).toBe('SEDIMENT_NE');
  });

  it('without a geocoded county, coordinates still give a province', () => {
    for (const [lat, lon] of [[-1.2921, 36.8219], [-0.4532, 39.6461], [-4.0435, 39.6682]]) {
      const c = getKenyaCountyFromCoords(lat, lon);
      expect(c, `${lat},${lon}`).not.toBeNull();
      expect(getKenyaHydroPrior(c!, 'KE'), c!).not.toBeNull();
    }
  });
});
