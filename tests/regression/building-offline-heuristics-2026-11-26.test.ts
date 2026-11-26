/**
 * Latent defects in the offline wizard modes (Reports, Costing) and the
 * opening-deduction boundary, 2026-11-26 (AUDIT-BUILDING.md §4).
 *
 * 1. Opening deduction: the trades deducted an opening equal to the threshold
 *    while ruleQuantity() did not. One convention now, the NRM2 / SMM7 wording
 *    "voids not exceeding 0.50 m² are not deducted": an opening of the
 *    threshold area or less (each) is not deducted, a larger one is.
 * 2. The wizard's report and Costing screens no longer derive schedules,
 *    electrical demand, drainage/septic sizes or reinforcement from floor area
 *    and bedroom count, and no input is silently defaulted.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { masonry, plaster, type Param, type Opening } from '@/lib/qs/trades';
import { ruleQuantity, type Quantity } from '@/lib/qs/takeoff';

const p = (value: number, source = 'TEST drawing A-201'): Param => ({ value, source });
const lin = (id: string, net: number): Quantity => ({ id, kind: 'linear', unit: 'm', gross: net, deductions: 0, net, holes: [] });
const op = (mark: string, w: number, h: number): Opening => ({ mark, type: 'window', widthM: p(w), heightM: p(h), count: 1 });

describe('one opening-deduction convention: openings ≤ the threshold are not deducted', () => {
  const openings = [op('W1', 1.0, 0.5), op('W2', 1.0, 0.6)]; // 0.50 m² and 0.60 m²
  it('masonry, threshold 0.5 m²: the 0.50 m² opening is not deducted, the 0.60 m² one is', () => {
    // gross 10 × 3 = 30 m²; deduct 0.60 only → 29.40 m² (before the fix 0.50 was deducted too: 28.90 m²).
    const out = masonry({ code: 'W', description: 'TEST', wallLength: lin('M1', 10), heightM: p(3), thicknessM: p(0.2), openings, minDeductedOpeningM2: p(0.5, 'TEST rule: NRM2 voids ≤ 0.50 m²') });
    expect(out[0].quantity).toBe(29.4);
    expect(out[0].inputs.join(' ')).toMatch(/not deducted \(≤ 0\.5 m² each/);
  });
  it('plaster one face, threshold 0.5 m²: same 29.40 m²; threshold 0: both deducted, 28.90 m²', () => {
    const base = { code: 'P', description: 'TEST', wallLength: lin('M1', 10), heightM: p(3), faces: 1 as const, openings };
    expect(plaster({ ...base, minDeductedOpeningM2: p(0.5, 'TEST rule') })[0].quantity).toBe(29.4);
    expect(plaster({ ...base, minDeductedOpeningM2: p(0, 'TEST rule: deduct all') })[0].quantity).toBe(28.9);
  });
  it('ruleQuantity agrees: a 0.50 m² void is added back at threshold 0.5, a 0.60 m² void is not', () => {
    // geometric net 30 − 0.5 − 0.6 = 28.9; rule adds back 0.5 → 29.4, the same as the trades.
    const q: Quantity = { id: 'A1', kind: 'area', unit: 'm²', gross: 30, deductions: 1.1, net: 28.9, holes: [{ areaM2: 0.5 }, { areaM2: 0.6 }] };
    const r = ruleQuantity(q, { name: 'TEST NRM2', edition: 'TEST', voidNotDeductedUpToM2: 0.5 });
    expect([r.ruleQuantity, r.voidsNotDeducted]).toEqual([29.4, 1]);
  });
  it('a product that misses the threshold by a binary hair is treated as the threshold (0.7 × 0.7 = 0.49 m² at 0.49)', () => {
    // 0.7 × 0.7 = 0.48999999999999994 in floating point; rounded to 3 dp it is 0.49 → not deducted at threshold 0.49.
    const out = masonry({ code: 'W', description: 'TEST', wallLength: lin('M1', 10), heightM: p(3), thicknessM: p(0.2), openings: [op('W3', 0.7, 0.7)], minDeductedOpeningM2: p(0.49, 'TEST rule') });
    expect(out[0].quantity).toBe(30);
  });
});

describe('wizard report and Costing screens: no design figures from a description, no silent defaults', () => {
  const html = readFileSync(join(__dirname, '..', '..', 'public', 'eims-building-suite-v20261105.html'), 'utf8');
  const fn = (name: string, end: string) => { const a = html.indexOf(`function ${name}(`), b = html.indexOf(end, a); expect(a).toBeGreaterThan(-1); return html.slice(a, b); };

  it('the heuristics are gone: diversity 0.65, W/m² loads, water heaters, septic sizing, reinforcement, invented rules', () => {
    for (const s of ['const diversity = 0.65', 'const lightingW', 'Math.ceil(beds/3)', 'septicVol_m3', 'soakArea_m2', 'BS 8233 ·', '4ØT16 main', '3ØT25 bottom', 'T12 @ 150 both ways', 'KQS 2025 min unit footprint', 'rule (BS 8004 §7)', 'Suggested arrangement: 3 Ø 25', "||'Nairobi, Kenya'", ": 'Nairobi, Kenya');", 'const beds = p.bedrooms || 4', 'const A = p.area || 220'])
      expect(html.includes(s), s).toBe(false);
  });

  it('no silent defaults for area, storeys, units or bedrooms', () => {
    // A fallback to a value (|| 220, || 4, || 1). `|| 0` is kept where it only feeds a "> 0 required" check.
    expect(html).not.toMatch(/getElementById\('(cr|rp)-(area|beds|stories|units)'\)\s*\?\.value *\|\| *[1-9]/);
    for (const k of ['area', 'stories', 'units', 'beds']) expect(html).toContain(`id="cr-${k}" value=""`);
    const get = new Function('document', 'crCountry', 'crCurrency', `${fn('crGetParams', '\nfunction ')}; return crGetParams();`);
    const blank = get({ getElementById: () => ({ value: '' }) }, 'Kenya', 'KES');
    expect([blank.area, blank.stories, blank.units, blank.bedrooms].every(Number.isNaN)).toBe(true);
  });

  it('repPreflight names every missing input and accepts a complete set (hand cases)', () => {
    const pre = new Function(`${fn('repPreflight', '\n/* What the report')}; return repPreflight;`)();
    expect(pre({ location: '', area: NaN, stories: NaN, units: NaN, bedrooms: NaN })).toEqual(['the location', 'the floor area (m²)', 'the number of storeys', 'the number of units', 'the bedrooms per unit']);
    expect(pre({ location: 'TEST Kikuyu', area: 220, stories: 2, units: 1, bedrooms: 4 })).toEqual([]);
    expect(pre({ location: 'TEST', area: 0, stories: 1.5, units: 1, bedrooms: 0 })).toEqual(['the floor area (m²)', 'the number of storeys', 'the bedrooms per unit']);
  });

  it('sections 14-16 print the reasons instead, with management’s electrical sentence', () => {
    const start = html.indexOf('const REP_NOT_FROM_DESCRIPTION = {');
    const R = new Function(`${html.slice(start, html.indexOf('};', start) + 2)}; return REP_NOT_FROM_DESCRIPTION;`)();
    expect(R.electrical).toBe('Electrical layouts, socket specifications, circuit protection and lighting loads require a project-specific design reviewed by a qualified electrical professional.');
    expect(R.reinforcement).toMatch(/registered engineer/);
    expect(R.drainage).toMatch(/percolation test/);
    for (const s of ["h += sec('14. Architectural Schedules', na(REP_NOT_FROM_DESCRIPTION.schedules)", "h += sec('15. MEP Detailed Design', na(REP_NOT_FROM_DESCRIPTION.electrical) + na(REP_NOT_FROM_DESCRIPTION.drainage)", "h += sec('16. Reinforcement Drawings Register (R.C. Details)', na(REP_NOT_FROM_DESCRIPTION.reinforcement)"])
      expect(html).toContain(s);
  });
});
