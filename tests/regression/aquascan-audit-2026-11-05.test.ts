/**
 * AquaScan re-audit 2026-11-05: storage steps, chemistry that may decide a
 * verdict, and the source count.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

vi.mock('../../external/borehole-ai-engine/src/localData', () => ({
  loadLocalJson: async (p: string) => JSON.parse(readFileSync(join(process.cwd(), 'public', p), 'utf8')),
}));

import { fetchGRACETWSData, detectStep } from '../../external/borehole-ai-engine/src/advancedHydroEngine';
import { screeningValues } from '../../external/borehole-ai-engine/src/reportGenerator';

describe('GRACE storage: a one-off jump is a step, not a trend', () => {
  it('detects a flat-jump-flat record and leaves a steady slope alone', () => {
    const months = Array.from({ length: 120 }, (_, i) => `${2010 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`);
    const wiggle = (i: number) => Math.sin(i) * 0.5;
    const step = months.map((_, i) => (i < 60 ? 0 : 13) + wiggle(i));
    const ramp = months.map((_, i) => i * 0.1 + wiggle(i));
    expect(detectStep(months, step)?.jump_cm).toBeGreaterThan(10);
    expect(detectStep(months, ramp)).toBeNull();
  });
  it('at real Kenyan sites the result is recorded, with a trend', async () => {
    const out: string[] = [];
    for (const [n, la, lo] of [['Nairobi', -1.29, 36.82], ['Kitale', 1.0, 35.0], ['Garissa', -0.45, 39.65], ['Lodwar', 3.12, 35.6]] as const) {
      const g: any = await fetchGRACETWSData(la, lo);
      expect(Number.isFinite(g?.groundwater?.trend_cm_per_year)).toBe(true);
      out.push(`${n}: ${g.groundwater.trend_cm_per_year} ± ${g.groundwater.trendStdErr_cm_per_year}, step ${JSON.stringify(g.groundwater.step ?? null)}`);
    }
    try { writeFileSync(join(process.cwd(), 'scripts/verify/out/grace-steps.txt'), out.join('\n')); } catch { /* diagnosis only */ }
  }, 30000);
});

describe('chemistry that may decide a water-quality finding', () => {
  it('modelled arsenic, iron and TDS never decide; measured TDS and nitrate do', () => {
    const modelled = { fluoride: 0.8, arsenic: 0.034, iron: 0.48, tds: 1400, nitrate: 60 };
    expect(screeningValues(modelled)).toEqual({ fluoride: 0.8, tds: null, nitrate: null });
    const measured = { ...modelled, measuredNearby: { ec: { n: 99 }, nitrate: { n: 8 } } };
    expect(screeningValues(measured)).toEqual({ fluoride: 0.8, tds: 1400, nitrate: 60 });
  });
});
