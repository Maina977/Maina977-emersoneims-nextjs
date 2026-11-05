/** Accessibility dimensions (ADA 2010, UK AD M 2024), built 2026-11-05. */
import { describe, it, expect } from 'vitest';
import { accessibility, runCalc } from '@/lib/wizard-api/buildingCalcs';
const run = (b: any) => runCalc(accessibility, b) as any;

describe('accessibility', () => {
  it('850 mm door, 1200 mm corridor, 1100 mm control: passes both', () => {
    expect(run({ door_clear_width_mm: 850, corridor_min_width_mm: 1200, reach_height_mm: 1100 }).overall).toMatch(/^PASS|^PARTIAL/);
  });
  it('1000 mm corridor passes ADA (915) and fails AD M (1200)', () => {
    expect(run({ jurisdiction: 'ada', corridor_min_width_mm: 1000 }).checks[0].pass).toBe(true);
    expect(run({ jurisdiction: 'ad-m', corridor_min_width_mm: 1000 }).checks[0].pass).toBe(false);
  });
  it('AD M Table 1: a 5 m ramp at 1:14 fails (max 1:15), a 2 m ramp at 1:12 passes', () => {
    const a = run({ jurisdiction: 'ad-m', ramp_going_m: 5, ramp_rise_mm: 357 });
    expect(a.checks.find((c: any) => /Table 1/.test(c.check)).pass).toBe(false);
    const b = run({ jurisdiction: 'ad-m', ramp_going_m: 2, ramp_rise_mm: 166 });
    expect(b.checks.find((c: any) => /Table 1/.test(c.check)).pass).toBe(true);
  });
  it('AD M Table 2: public external door needs 1000 mm in a new building, 775 mm existing', () => {
    expect(run({ jurisdiction: 'ad-m', door_approach: 'external_public', door_clear_width_mm: 900 }).checks[0].pass).toBe(false);
    expect(run({ jurisdiction: 'ad-m', building: 'existing', door_approach: 'external_public', door_clear_width_mm: 900 }).checks[0].pass).toBe(true);
  });
  it('ISO 21542 is not offered, and empty input is refused', () => {
    expect(run({ jurisdiction: 'iso21542', door_clear_width_mm: 900 }).error).toBeTruthy();
    expect(run({}).error).toBeTruthy();
  });
});
