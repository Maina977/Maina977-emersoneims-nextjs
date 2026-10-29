// AquaScan: the open datasets that replaced the six retired endpoints answer
// with the right values at known Kenyan sites (2026-10-29).
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

vi.mock('@/external/borehole-ai-engine/src/localData', () => ({
  loadLocalJson: async (p: string) => JSON.parse(readFileSync(join(process.cwd(), 'public', p), 'utf8')),
}));
// The engine imports './localData' relatively; mock that specifier too.
vi.mock('../../external/borehole-ai-engine/src/localData', () => ({
  loadLocalJson: async (p: string) => JSON.parse(readFileSync(join(process.cwd(), 'public', p), 'utf8')),
}));

import { bgsGroundwaterMaps, measuredGroundwaterNear } from '../../external/borehole-ai-engine/src/openGroundwaterData';

describe('BGS / MacDonald Africa groundwater maps (Kenya cut)', () => {
  it('gives the published classes at Nairobi and Wajir', async () => {
    const n = await bgsGroundwaterMaps(-1.29, 36.82);
    expect(n?.depthToGroundwater).toBe('25-50 m');
    expect(n?.productivity).toBe('1-5 L/s');
    expect(n?.productivityRange_m3h).toEqual([3.6, 18]);
    const w = await bgsGroundwaterMaps(1.75, 40.06);
    expect(w?.depthToGroundwater).toBe('50-100 m');
  });
  it('uses the nearest mapped cell on the coast and says how far', async () => {
    const m = await bgsGroundwaterMaps(-4.04, 39.67);
    expect(m?.productivity).not.toBeNull();
    expect(m!.cellOffset_km).toBeLessThanOrEqual(20);
  });
  it('answers null outside the Kenya grid', async () => {
    expect(await bgsGroundwaterMaps(-20, 20)).toBeNull();
  });
});

describe('measured groundwater near the site', () => {
  it('finds measured salinity near Lodwar (Turkana)', async () => {
    const m = await measuredGroundwaterNear(3.12, 35.6, 25);
    expect(m).not.toBeNull();
    expect(m!.boreholes).toBeGreaterThan(10);
    expect(m!.ec!.n).toBeGreaterThan(5);
    expect(m!.ec!.median).toBeGreaterThan(100);
    expect(m!.sources.length).toBeGreaterThan(0);
  });
  it('includes the Kisumu 2014 survey inside Kisumu, with the borehole fluoride', async () => {
    const m = await measuredGroundwaterNear(-0.1, 34.76, 25);
    expect(m!.areaSurveys).toHaveLength(1);
    expect(m!.areaSurveys[0].boreholes.fluoride_mgL).toEqual([5.5, 9.9]);
  });
  it('answers null where no measurement lies within the radius', async () => {
    expect(await measuredGroundwaterNear(-1.29, 36.82, 10)).toBeNull();
  });
});
