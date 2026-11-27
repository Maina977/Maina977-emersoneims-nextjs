/**
 * Register R-39 (P1-D §6): acoustics had reverberation only; sound
 * insulation was missing. EN 12354-1:2000 Annex B mass law, single leaf.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as c from '@/lib/wizard-api/buildingCalcs';

type Out = { mass_kg_m2: number; Rw_dB: number; overall?: string; not_checked: string[]; method: string; error?: string };
const run = (b: Record<string, unknown>) => c.runCalc(c.soundInsulation, b) as Out;

describe('R-39 airborne sound insulation (mass law)', () => {
  it('hand-worked 1: 200 mm block at 2,000 kg/m³ + 2 × 13 mm plaster at 1,300 → m′ = 400 + 33.8 = 433.8 kg/m²; Rw = 37.5 lg 433.8 − 42 = 56.9 dB', () => {
    const o = run({ layers: [{ thickness_m: 0.2, density_kg_m3: 2000 }, { thickness_m: 0.013, density_kg_m3: 1300 }, { thickness_m: 0.013, density_kg_m3: 1300 }] });
    // lg 433.8 = 2.63729; 37.5 × 2.63729 = 98.898; − 42 = 56.898 → 56.9.
    expect([o.mass_kg_m2, o.Rw_dB]).toEqual([433.8, 56.9]);
    expect(o.method).toMatch(/EN 12354-1:2000 Annex B/);
    expect(o.not_checked[0]).toMatch(/flanking/);
  });
  it('hand-worked 2: 150 mm concrete at 2,400 → 360 kg/m²; Rw = 37.5 × 2.5563 − 42 = 53.9 dB; against a 55 dB target → FAIL', () => {
    const o = run({ layers: [{ thickness_m: 0.15, density_kg_m3: 2400 }], target_Rw_dB: 55 });
    expect([o.mass_kg_m2, o.Rw_dB]).toEqual([360, 53.9]);
    expect(o.overall).toMatch(/^FAIL/);
  });
  it('outside the law (m′ < 150 kg/m², e.g. 100 mm block at 1,200 = 120) is refused, not estimated; the Physics form exists', () => {
    const o = run({ layers: [{ thickness_m: 0.1, density_kg_m3: 1200 }] });
    expect(o.error).toMatch(/valid from 150 kg\/m²/);
    const html = readFileSync(join(__dirname, '..', '..', 'public', 'eims-building-suite-v20261105.html'), 'utf8');
    expect(html).toContain("ep:'/api/arch/acoustics/airborne'");
  });
});
