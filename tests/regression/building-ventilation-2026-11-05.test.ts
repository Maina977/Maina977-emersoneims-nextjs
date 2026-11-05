/** Ventilation (ASHRAE 62.1 VRP), built 2026-11-05: hand checks. */
import { describe, it, expect } from 'vitest';
import { ventilation, runCalc } from '@/lib/wizard-api/buildingCalcs';

describe('ventilation', () => {
  it('office 200 m²: 10 people at 2.5 L/s + 200 m² at 0.3 L/s·m² = 85 L/s', () => {
    const r: any = runCalc(ventilation, { space_type: 'office', floor_area_m2: 200 });
    expect(r.occupants_used).toBe(10);
    expect(r.Vbz_L_s).toBe(85);
    expect(r.Voz_L_s).toBe(85);
  });
  it('classroom 60 m², 30 pupils, warm-air ceiling supply: (5x30 + 0.6x60) / 0.8 = 232.5 L/s', () => {
    const r: any = runCalc(ventilation, { space_type: 'classroom', floor_area_m2: 60, occupants: 30, air_distribution: 'ceiling_supply_warm_ceiling_return' });
    expect(r.Voz_L_s).toBe(232.5);
  });
  it('checks a supplied airflow and refuses bad input', () => {
    expect((runCalc(ventilation, { space_type: 'office', floor_area_m2: 200, outdoor_air_supplied_L_s: 60 }) as any).overall).toMatch(/^FAIL/);
    expect((runCalc(ventilation, { space_type: 'office', floor_area_m2: 200, outdoor_air_supplied_L_s: 90 }) as any).overall).toMatch(/^PASS/);
    expect((runCalc(ventilation, { space_type: 'cave', floor_area_m2: 10 }) as any).error).toBeTruthy();
    expect((runCalc(ventilation, { space_type: 'office' }) as any).error).toBeTruthy();
  });
});
