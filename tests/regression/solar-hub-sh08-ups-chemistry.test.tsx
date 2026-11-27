/**
 * Register SOLAR-UPS-HUB SH-08 (review advisory on H5): the simulator's UPS
 * battery took the main bank's chemistry DoD. It now has its own chemistry.
 *
 * Hand-worked: critical 25 kW, 15 min → 25,000 W × 0.25 h = 6,250 Wh at the load.
 *   UPS battery LFP (90 % usable):  6,250 ÷ (0.9 × 0.9) = 7,716 Wh
 *   UPS battery AGM (50 % usable):  6,250 ÷ (0.9 × 0.5) = 13,889 Wh
 * with the MAIN bank LFP in both cases.
 *
 * The full simulator is not rendered here: its Chart.js canvas cannot run in
 * jsdom (getContext is not implemented), so the screen wiring is checked in
 * the source, as the other Hub tests do.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { sizeUps, DEFAULTS } from '@/components/hub/SimulatorClient';

const src = fs.readFileSync(path.join(process.cwd(), 'components/hub/SimulatorClient.tsx'), 'utf8');

describe('SH-08: the UPS battery has its own chemistry', () => {
  it('LFP main bank with an AGM UPS battery sizes the UPS battery on AGM (13,889 Wh, not 7,716 Wh)', () => {
    const base = { criticalLoadKw: 25, powerFactor: 0.85, upsAutonomyMin: 15, batteryChemistry: 'LFP' as const };
    expect(sizeUps({ ...base, upsBatteryChemistry: 'LFP' }).wh).toBeCloseTo(7716, 0);
    expect(sizeUps({ ...base, upsBatteryChemistry: 'AGM' }).wh).toBeCloseTo(13889, 0);
    // An AGM main bank with an LFP UPS battery: the UPS battery is sized on LFP.
    expect(sizeUps({ ...base, batteryChemistry: 'AGM', upsBatteryChemistry: 'LFP' }).wh).toBeCloseTo(7716, 0);
    // Without the field (older callers) the main chemistry is used, as before.
    expect(sizeUps(base).wh).toBeCloseTo(7716, 0);
    expect(DEFAULTS.upsBatteryChemistry).toBe('LFP');
  });
  it('the screen offers the UPS battery chemistry, passes it to sizeUps, and names it in the caption', () => {
    expect(src).toMatch(/label="UPS battery chemistry"\s+value=\{inputs\.upsBatteryChemistry\}/);
    expect(src).toMatch(/onChange=\{set\('upsBatteryChemistry'\)\}/);
    expect(src).toMatch(/const ups = sizeUps\(effectiveInputs\);/); // effectiveInputs spreads inputs, so upsBatteryChemistry reaches sizeUps
    expect(src).toMatch(/caption=\{`\$\{inputs\.upsBatteryChemistry\}: \$\{Math\.round\(CHEM_DOD\[inputs\.upsBatteryChemistry\] \* 100\)\} % usable/);
  });
});

describe('REQ review advisory: the chemistry DoD table is labelled assumed practice (no cited source)', () => {
  it('code and screen say "assumed practice"', () => {
    expect(src).toMatch(/ASSUMED PRACTICE, not a cited source/);
    expect(src).toMatch(/label="Usable DoD \(assumed practice; use the datasheet\)"/);
    expect(src).toMatch(/% usable \(assumed practice\), /);
  });
});
