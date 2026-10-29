// AquaScan: real GRACE / GRACE-FO data (G3P groundwater, GFZ GravIS total
// storage) at Kenyan sites, from the shipped Kenya cut (2026-10-29).
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

vi.mock('../../external/borehole-ai-engine/src/localData', () => ({
  loadLocalJson: async (p: string) => JSON.parse(readFileSync(join(process.cwd(), 'public', p), 'utf8')),
}));

import { fetchGRACETWSData } from '../../external/borehole-ai-engine/src/advancedHydroEngine';

const grace = JSON.parse(readFileSync(join(process.cwd(), 'public/data/kenya-grace.json'), 'utf8'));

describe('shipped GRACE data', () => {
  it('has unique, ordered months and current GRACE-FO data', () => {
    for (const k of ['gwsa', 'tws'] as const) {
      const m: string[] = grace[k].months;
      expect(new Set(m).size).toBe(m.length);
      expect([...m].sort()).toEqual(m);
    }
    expect(grace.tws.months.at(-1) >= '2026-01').toBe(true);
    expect(grace.gwsa.months[0]).toBe('2002-04');
  });
});

describe('GRACE at Kenyan sites', () => {
  for (const [name, lat, lon] of [['Nairobi', -1.29, 36.82], ['Kisumu', -0.1, 34.76], ['Lodwar', 3.12, 35.6], ['Garissa', -0.45, 39.65], ['Mombasa', -4.04, 39.67]] as const) {
    it(`${name}: real satellite gravity with trends and standard errors`, async () => {
      const g = await fetchGRACETWSData(lat, lon);
      expect(g?.isSatelliteGravity).toBe(true);
      expect(g?.groundwater?.months).toBeGreaterThan(150);
      expect(g?.totalStorage?.months).toBeGreaterThan(180);
      expect(g!.groundwater!.monthlyUncertainty_cm).toBeGreaterThan(0);
      expect(Math.abs(g!.groundwater!.trend_cm_per_year)).toBeLessThan(5);
      if (name === 'Mombasa') expect(g!.dataSource).toMatch(/nearest land cell/);
      if (name === 'Kisumu') expect(g!.dataSource).toMatch(/Lake Victoria/);
      expect(g!.groundwater!.trendStdErr_cm_per_year).toBeGreaterThan(0);
    });
  }
});
