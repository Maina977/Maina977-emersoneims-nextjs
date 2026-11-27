/**
 * Register R-31 (P1-D §6): a column check (there was none; padFooting only
 * took a column size). EN 1992-1-1:2004 axial resistance, slenderness and
 * steel limits; bending and second-order effects are reported as not checked.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NextRequest } from 'next/server';
import * as c from '@/lib/wizard-api/buildingCalcs';
import { dispatch } from '@/lib/wizard-api/dispatcher';

type Out = Record<string, unknown> & { checks: Array<{ check: string; pass: boolean }>; overall: string; not_checked: string[] };
const run = (b: Record<string, unknown>) => c.runCalc(c.rcColumn, b) as Out;

describe('R-31 RC column (axial)', () => {
  it('hand-worked 1: 400 × 400, 4T20 = 1,257 mm², C30, B500, N_Ed 600 kN, l0 2.4 m — short, N_Rd = 3,201.4 kN', () => {
    // fcd = 0.85 × 30 / 1.5 = 17.0 MPa; σs = min(434.8, 0.002 × 200,000 = 400) = 400 MPa.
    // N_Rd = 17.0 × (160,000 − 1,257) + 400 × 1,257 = 2,698,631 + 502,800 = 3,201,431 N = 3,201.4 kN.
    // i = 400/√12 = 115.47 mm; λ = 2,400/115.47 = 20.8; n = 600,000/(160,000 × 17) = 0.221; λlim = 10.78/√0.221 = 22.95 → 23.0.
    // As,min = max(0.1 × 600,000/434.78 = 138, 0.002 × 160,000 = 320) = 320; As,max = 6,400.
    const o = run({ b_mm: 400, h_mm: 400, As_mm2: 1257, fck_MPa: 30, fyk_MPa: 500, NEd_kN: 600, l0_m: 2.4 });
    expect([o.N_Rd_kN, o.sigma_s_MPa, o.lambda, o.lambda_lim, o.As_min_mm2, o.As_max_mm2]).toEqual([3201.4, 400, 20.8, 23, 320, 6400]);
    expect(o.checks.every((x) => x.pass)).toBe(true);
    expect(o.overall).toMatch(/^PARTIAL/); // bending from e0 is not checked
    expect(o.not_checked[0]).toMatch(/minimum eccentricity/);
  });
  it('hand-worked 2: 300 × 300, 4T16 = 804 mm², C30, N_Ed 1,500 kN, l0 3.0 m — capacity OK but SLENDER (λ 34.6 > λlim 10.9)', () => {
    // N_Rd = 17.0 × (90,000 − 804) + 400 × 804 = 1,516,332 + 321,600 = 1,837,932 N = 1,837.9 kN.
    // λ = 3,000/86.60 = 34.6; n = 1,500,000/(90,000 × 17) = 0.980; λlim = 10.78/0.990 = 10.9.
    const o = run({ b_mm: 300, h_mm: 300, As_mm2: 804, fck_MPa: 30, fyk_MPa: 500, NEd_kN: 1500, l0_m: 3.0 });
    expect([o.N_Rd_kN, o.lambda, o.lambda_lim]).toEqual([1837.9, 34.6, 10.9]);
    expect(o.overall).toMatch(/^FAIL: 1 of 4 checks fails \(Short column/);
    expect(o.not_checked.join(' ')).toMatch(/second-order effects of a slender column/);
  });
  it('too little steel fails As,min; missing inputs are named; the route and the Engineering+ form exist', async () => {
    const o = run({ b_mm: 400, h_mm: 400, As_mm2: 300, fck_MPa: 30, fyk_MPa: 500, NEd_kN: 600, l0_m: 2.4 });
    expect(o.checks.find((x) => /As,min/.test(x.check))!.pass).toBe(false);
    expect((c.rcColumn({ b_mm: 400 }) as { missing: string[] }).missing).toEqual(['h_mm', 'As_mm2', 'fck_MPa', 'fyk_MPa', 'NEd_kN', 'l0_m']);
    const res = await dispatch(new NextRequest('http://localhost/api/rc/column/axial', { method: 'POST', body: JSON.stringify({ b_mm: 400, h_mm: 400, As_mm2: 1257, fck_MPa: 30, fyk_MPa: 500, NEd_kN: 600, l0_m: 2.4 }), headers: { 'content-type': 'application/json' } }), ['column', 'axial'], 'rc');
    expect((await res.json()).data.N_Rd_kN).toBe(3201.4);
    const html = readFileSync(join(__dirname, '..', '..', 'public', 'eims-building-suite-v20261105.html'), 'utf8');
    expect(html).toContain("ep:'/api/rc/column/axial'");
  });
});
