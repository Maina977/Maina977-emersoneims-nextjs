/** Egress (IBC 2021 Ch. 10), built 2026-11-05: hand checks. */
import { describe, it, expect } from 'vitest';
import { egress, runCalc } from '@/lib/wizard-api/buildingCalcs';

describe('egress', () => {
  it('business 1500 m²: 108 occupants, 2 exits, widths from 0.3 / 0.2 in per occupant', () => {
    const r: any = runCalc(egress, { occupancy_type: 'business', floor_area_m2: 1500, sprinklered: false, voice_notification: false });
    expect(r.occupant_load).toBe(Math.ceil(1500 / (150 * 0.09290304))); // 108
    expect(r.exits_required).toBe(2);
    expect(r.required_stair_width_mm).toBe(Math.max(1118, Math.ceil(108 * 0.3 * 25.4)));
    expect(r.required_other_egress_width_mm).toBe(Math.max(813, Math.ceil(108 * 0.2 * 25.4)));
  });
  it('concentrated assembly 1000 m² needs 4 exits; reduced factors only with sprinklers AND voice', () => {
    const r: any = runCalc(egress, { occupancy_type: 'assembly_concentrated', floor_area_m2: 1000, sprinklered: true, voice_notification: false });
    expect(r.occupant_load).toBe(Math.ceil(1000 / (7 * 0.09290304))); // 1538
    expect(r.exits_required).toBe(4);
    expect(r.width_factor_other_in_per_occupant).toBe(0.2);
    const r2: any = runCalc(egress, { occupancy_type: 'assembly_concentrated', floor_area_m2: 1000, sprinklered: true, voice_notification: true });
    expect(r2.width_factor_other_in_per_occupant).toBe(0.15);
  });
  it('checks provided exits and widths; otherwise says what was not checked', () => {
    const r: any = runCalc(egress, { occupancy_type: 'business', floor_area_m2: 1500, exits_provided: 1, total_exit_door_width_mm: 900 });
    expect(r.all_checks_pass).toBe(false);
    expect(r.overall).toMatch(/^FAIL/);
    const r2: any = runCalc(egress, { occupancy_type: 'business', floor_area_m2: 1500 });
    expect(r2.overall ?? '').not.toMatch(/^PASS/);
  });
  it('refuses bad input', () => {
    expect((runCalc(egress, { occupancy_type: 'spaceship', floor_area_m2: 10 }) as any).error).toBeTruthy();
    expect((runCalc(egress, { occupancy_type: 'business' }) as any).error).toBeTruthy();
  });
});

describe('egress, second round', () => {
  it('two exits need at least 813 mm each: 900 mm total fails', () => {
    const r: any = runCalc(egress, { occupancy_type: 'business', floor_area_m2: 200, exits_provided: 2, total_exit_door_width_mm: 900 });
    expect(r.overall).toMatch(/^FAIL/);
  });
  it('without stair width the verdict is not a bare PASS', () => {
    const r: any = runCalc(egress, { occupancy_type: 'business', floor_area_m2: 1500, exits_provided: 2, total_exit_door_width_mm: 2000 });
    expect(r.overall).toMatch(/^PARTIAL/);
  });
  it('impossible exits and widths are refused', () => {
    expect((runCalc(egress, { occupancy_type: 'business', floor_area_m2: 200, exits_provided: 1.5 }) as any).error).toBeTruthy();
    expect((runCalc(egress, { occupancy_type: 'business', floor_area_m2: 200, total_exit_door_width_mm: -5 }) as any).error).toBeTruthy();
  });
});
