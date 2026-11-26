/**
 * Real-project test 2026-11-26, defect D4 (management decision B): the drilling
 * rate read the rock classification (basalt -> hard-rock KSh 10,500/m) but the
 * contingency tested the SOIL type, which was "unknown", so a hard-rock hole got
 * the 15% soft-ground contingency. Production bf2c7500 has the same two tests
 * (reportShared.ts: drillingCostKES(..., primaryRockType) vs isHardRock on soilType).
 * Now both read ONE classification (costModel.rockClassForCost); no classified
 * rock type -> the conservative 25%. TEST values only.
 */
import { describe, it, expect } from 'vitest';
import { computeCanonicalEconomics } from '@/external/borehole-ai-engine/src/reportShared';
import { rockClassForCost, drillingCostKES, EIMS_RATES_KES } from '@/external/borehole-ai-engine/src/costModel';

const base = (rock: string | undefined, soil?: string) => ({
  recommendedDepth: 120, estimatedYield: 2,
  site: { latitude: -1.2921, longitude: 36.8219 },
  soil: soil ? { type: soil, realSoilGrids: true } : { type: 'unknown', realSoilGrids: false },
  rockClassification: rock === undefined ? undefined : { primaryRockType: rock },
  waterQuality: { isPotable: true, treatmentRequired: [] },
}) as any;

describe('D4: one rock classification for the drilling rate and the contingency', () => {
  it('rockClassForCost: hard, soft, unknown', () => {
    expect(rockClassForCost('Basalt (Tertiary volcanics)')).toBe('hard');
    expect(rockClassForCost('granite gneiss')).toBe('hard');
    expect(rockClassForCost('alluvial sand and gravel')).toBe('soft');
    expect(rockClassForCost('sandstone (Merti beds)')).toBe('soft');
    expect(rockClassForCost(undefined)).toBe('unknown');
    expect(rockClassForCost('')).toBe('unknown');
    expect(rockClassForCost('Unknown')).toBe('unknown');
  });

  it('the field case: basalt with soil "unknown" -> hard-rock drilling rate AND the 25% contingency (was 15%)', () => {
    const eco = computeCanonicalEconomics(base('basalt'));
    expect(drillingCostKES(120, 'basalt')).toBe(120 * EIMS_RATES_KES.drillHardRockPerM);
    expect(eco.isHardRock).toBe(true);
    expect(eco.contingencyRate).toBe(0.25);
  });

  it('soft ground (sediments) -> soft drilling bands and 15%, whatever the soil says', () => {
    for (const soil of [undefined, 'rocky', 'clay']) {
      const eco = computeCanonicalEconomics(base('alluvial sand and gravel', soil));
      expect(eco.isHardRock).toBe(false);
      expect(eco.rockTypeUnknown).toBe(false);
      expect(eco.contingencyRate).toBe(0.15);
    }
  });

  it('a "rocky" or granite SOIL no longer makes a soft-rock hole "hard rock" (the old soil test)', () => {
    const eco = computeCanonicalEconomics(base('sandstone', 'rocky'));
    expect(eco.contingencyRate).toBe(0.15);
    expect(eco.drillingCost).toBe(Math.round(drillingCostKES(120, 'sandstone') / 129));
  });

  it('no classified rock type -> the conservative (higher) 25% contingency, not labelled hard rock', () => {
    const eco = computeCanonicalEconomics(base(undefined));
    expect(eco.rockTypeUnknown).toBe(true);
    expect(eco.isHardRock).toBe(false);
    expect(eco.contingencyRate).toBe(0.25);
  });

  it('a hard-rock drilling rate always carries the hard-rock contingency (every hard-rock word)', () => {
    for (const rock of ['phonolite', 'trachyte', 'tuff', 'rhyolite', 'andesite', 'nephelinite', 'granite', 'gneiss', 'schist', 'quartzite', 'migmatite', 'basement complex', 'crystalline', 'dolerite', 'lava']) {
      const eco = computeCanonicalEconomics(base(rock));
      const hardRate = drillingCostKES(120, rock) === 120 * EIMS_RATES_KES.drillHardRockPerM;
      expect(hardRate, rock).toBe(true);
      expect(eco.contingencyRate, rock).toBe(0.25);
    }
  });
});
