/**
 * Calculator audit 2026-11-26 — Solar Genius Pro + Solar & UPS Hub.
 * Every expected value below is worked by hand in the comment beside it,
 * from the reference named, and compared with the engine output.
 */
import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { evaluate as safetyEvaluate, M3H_PER_CFM, type SafetyInput } from '@/components/hub/SafetyClient';
import { compute as upsLabCompute } from '@/components/hub/UpsLabClient';
import { sizeUps, controllerUndersized, bankRuntimeMin, supportMarginPct, sizeGenerator, generatorOverloaded, sizeFuel, DEFAULTS } from '@/components/hub/SimulatorClient';
import { PV_GEN } from '@/components/hub/SolarUpsClient';
import { upsRuntimeMinutes, surgeWatts } from '@/lib/hub/upsMath';
import { findOptimalSystem } from '@/components/solar/SolarEquipmentDatabase';
import { GRID_CO2_KG_PER_KWH } from '@/lib/solar/sizing';

const require = createRequire(import.meta.url);
const eng = require('../../lib/solar-genius/server/solar-engineering.js');
const approval = require('../../lib/solar-genius/server/engineering-approval.js');

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8');

describe('Hub Safety: battery-room ventilation is compared in CFM, not m³/h (SAFETY)', () => {
  const base: SafetyInput = { chemistry: 'agm', bankKwh: 10, roomVolumeM3: 18, ambientC: 30, hasBms: true, hasSmokeAlarm: true, clearanceMm: 300, hasFireSeparation: true };
  it('1 CFM = 1.699 m³/h (0.3048³ m³ × 60)', () => {
    expect(0.3048 ** 3 * 60).toBeCloseTo(M3H_PER_CFM, 3);
  });
  it('AGM 10 kWh in 18 m³: 18 × 4 ACH = 72 m³/h = 42.4 CFM < 60 CFM needed → danger', () => {
    // required = max(50, 10 × 6) = 60 CFM; room = 72 / 1.699 = 42.38 CFM.
    // Before the fix 72 (m³/h) was compared as CFM and passed.
    const r = safetyEvaluate(base);
    const vent = r.risks.find((x) => x.title === 'Insufficient hydrogen ventilation');
    expect(vent?.severity).toBe('danger');
    expect(vent?.detail).toMatch(/42\.4/);
  });
  it('AGM 10 kWh in 30 m³: 120 m³/h = 70.6 CFM ≥ 60 → no ventilation risk', () => {
    const r = safetyEvaluate({ ...base, roomVolumeM3: 30 });
    expect(r.risks.find((x) => x.title === 'Insufficient hydrogen ventilation')).toBeUndefined();
  });
});

describe('UPS runtime and surge (shared by UPS Live Lab and Solar & UPS)', () => {
  it('runtime = Wh × DoD × η ÷ W × 60', () => {
    // 1,400 Wh × 0.9 × 0.952 ÷ 3,690 W × 60 = 1,199.5 / 3,690 × 60 = 19.50 min
    expect(upsRuntimeMinutes(1400, 3690, 0.952)).toBeCloseTo(19.5, 1);
    // 2,100 Wh × 0.9 × 0.94 ÷ 1,000 W × 60 = 106.6 min
    expect(upsRuntimeMinutes(2100, 1000, 0.94)).toBeCloseTo(106.6, 1);
    expect(upsRuntimeMinutes(1400, 0, 0.95)).toBe(Infinity);
    expect(upsRuntimeMinutes(0, 500, 0.95)).toBe(0);
  });
  it('surge = everything running + the largest group’s extra inrush', () => {
    // 7 × 600 W servers (×1.3) + 2 × 200 W fridges (×4): running 4,600 W;
    // extra = max(4,200 × 0.3 = 1,260; 400 × 3 = 1,200) = 1,260 → 5,860 W.
    expect(surgeWatts([{ watts: 600, qty: 7, startMult: 1.3 }, { watts: 200, qty: 2, startMult: 4 }])).toBe(5860);
  });
  it('UPS Lab flags the overload the old max(running, one group) rule missed (SAFETY)', () => {
    // Eaton 9PX 6 kVA × pf 0.9 = 5,400 W; overload threshold 1.05 × 5,400 = 5,670 W.
    // Old surge = max(4,600, 5,460, 1,600) = 5,460 < 5,670 → not flagged. New 5,860 > 5,670.
    const r = upsLabCompute({ ups: [{ modelId: 'eaton-9px-6', qty: 1 }], loads: [{ kind: 'server', qty: 7 }, { kind: 'fridge', qty: 2 }], mainsPresent: true });
    expect(r.loadStartingW).toBe(5860);
    expect(r.isOverloaded).toBe(true);
  });
  it('UPS Lab default: surge 1,770 W, runtime 50.4 min, pf shown is the pf (0.90), not the efficiency', () => {
    // 2 servers 1,200 + 2 switches 120 + 2 monitors 90 = 1,410 W; extra = 1,200 × 0.3 = 360 → 1,770 W.
    // runtime = 1,400 × 0.9 × 0.94 ÷ 1,410 × 60 = 50.4 min.
    const r = upsLabCompute({ ups: [{ modelId: 'eaton-9px-6', qty: 1 }], loads: [{ kind: 'server', qty: 2 }, { kind: 'switch', qty: 2 }, { kind: 'monitor', qty: 2 }], mainsPresent: true });
    expect(r.loadStartingW).toBe(1770);
    expect(r.runtimeMin).toBeCloseTo(50.4, 1);
    expect(r.upsAvgPf).toBeCloseTo(0.9, 6);
    expect(read('components/hub/UpsLabClient.tsx')).toContain('pf ${result.upsAvgPf.toFixed(2)}');
  });
});

describe('Hub Smart Sizing simulator', () => {
  it('UPS is sized on the Critical (0 ms) load the user enters (SAFETY)', () => {
    // 25 kW ÷ 0.85 ÷ 0.8 = 36.76 kVA; battery 25,000 W × 0.25 h ÷ (0.9 × 0.9 LFP) = 7,716 Wh.
    const u = sizeUps({ criticalLoadKw: 25, powerFactor: 0.85, upsAutonomyMin: 15, batteryChemistry: 'LFP' });
    expect(u.kva).toBeCloseTo(36.76, 2);
    expect(u.wh).toBeCloseTo(7716, 0);
    // Doubling the critical load doubles both (it did nothing before).
    const u2 = sizeUps({ criticalLoadKw: 50, powerFactor: 0.85, upsAutonomyMin: 15, batteryChemistry: 'LFP' });
    expect(u2.kva).toBeCloseTo(2 * u.kva, 6);
    // AGM, 50 % usable: 6,250 Wh ÷ (0.9 × 0.5) = 13,889 Wh.
    expect(sizeUps({ criticalLoadKw: 25, powerFactor: 0.85, upsAutonomyMin: 15, batteryChemistry: 'AGM' }).wh).toBeCloseTo(13889, 0);
  });
  it('MPPT controller current = array W ÷ 48 V (no ÷1.25)', () => {
    // 12 × 550 W = 6,600 W ÷ 48 V = 137.5 A; flagged below 0.9 × 137.5 = 123.75 A.
    expect(controllerUndersized(6.6, 110, 'MPPT')).toBe(true); // old rule: 137.5/1.25 × 0.9 = 99 A → passed
    expect(controllerUndersized(6.6, 130, 'MPPT')).toBe(false);
  });
  it('battery runtime counts only the charge above the chemistry cut-off, through the inverter', () => {
    // 20 kWh, SoC 78 %, LFP DoD 0.9 → usable (0.78 − 0.10) × 20 × 0.9 = 12.24 kWh ÷ 96 kW × 60 = 7.65 min
    expect(bankRuntimeMin(20, 78, 0.9, 96)).toBeCloseTo(7.65, 2);
    // AGM DoD 0.5 → (0.78 − 0.5) × 20 × 0.9 = 5.04 kWh → 3.15 min (old: 9.75 min for both)
    expect(bankRuntimeMin(20, 78, 0.5, 96)).toBeCloseTo(3.15, 2);
    expect(bankRuntimeMin(0, 78, 0.9, 96)).toBe(0);
  });
  it('support margin is taken on the site-derated generator rating', () => {
    // Defaults: derate = (1,700 − 1,000)/300 × 3 + (28 − 25)/5 × 2 = 7 + 1.2 = 8.2 %.
    const g = sizeGenerator({ ...DEFAULTS, batteryBankKwh: 20 });
    expect(g.derate).toBeCloseTo(8.2, 6);
    expect(g.ratedKva).toBe(400);
    // available 400 × 0.918 = 367.2 kVA; peak 160 / 0.85 = 188.24 kVA → (367.2 − 188.24)/367.2 = 48.74 %
    expect(supportMarginPct(400, 8.2, 160, 0.85)).toBeCloseTo(48.74, 2);
  });
});

describe('Solar & UPS page: sample figures agree with each other', () => {
  it('the PV curve sums to the 540 kWh card and never exceeds the 120 kWp array', () => {
    expect(PV_GEN.reduce((a, b) => a + b, 0)).toBe(540);
    expect(Math.max(...PV_GEN)).toBeLessThanOrEqual(120);
    // PR = 540 ÷ (120 kWp × PSH) = 0.81 → PSH = 5.56 kWh/m²/day, a Kenyan-range value.
    expect(540 / (120 * 0.81)).toBeCloseTo(5.56, 2);
  });
  it('CO₂ uses the repo’s sourced Kenya grid factor, not an unsourced 0.45', () => {
    const src = read('components/hub/SolarUpsClient.tsx');
    expect(src).not.toMatch(/co2KgPerKwh = 0\.45|grid factor 0\.45/);
    expect(src).toContain('GRID_CO2_KG_PER_KWH');
    // 540 kWh × 0.213 = 115 kg = 0.12 t (0.45 gave 0.24 t).
    expect((540 * GRID_CO2_KG_PER_KWH) / 1000).toBeCloseTo(0.115, 3);
  });
});

describe('Cable sizing: IEC 60364-5-52 B.52.5 / BS 7671 Table 4D1A col 5 (SAFETY)', () => {
  const three = (currentA: number) => eng.recommendConductor({ systemType: 'ac_three_phase', currentA, voltageV: 400, oneWayLengthM: 10, installMethod: 'conduit' });
  it('265 A three-phase in conduit needs 185 mm² (150 mm² is rated 262 A)', () => {
    // Old table rated 150 mm² at 272 A and returned 150.
    const r = three(265);
    expect(r.recommendedCsaMm2).toBe(185);
    expect(r.ampacityA).toBe(296);
  });
  it('300 A three-phase in conduit needs 240 mm² (185 mm² is rated 296 A)', () => {
    // ΔV = √3 × 300 × 10 × 0.02063 ÷ 240 = 0.45 V (0.11 %), so ampacity governs.
    const r = three(300);
    expect(r.recommendedCsaMm2).toBe(240);
    expect(r.ampacityA).toBe(346);
  });
  it('two-loaded-conductor values (4D1A col 4) unchanged: 300 A single-phase in conduit → 150 mm² (300 A)', () => {
    const r = eng.recommendConductor({ systemType: 'ac_single_phase', currentA: 300, voltageV: 230, oneWayLengthM: 1, installMethod: 'conduit', maxVoltDropPct: 10 });
    expect(r.recommendedCsaMm2).toBe(150);
  });
});

describe('Cable ampacity derating (engineering-approval, not yet online) — conservative table lookups', () => {
  it('32 °C air takes the 35 °C factor (0.94), not 30 °C (1.00)', () => {
    // PVC B1 16 mm²: 76 A × 0.94 = 71.44 A
    const r = approval.cableAmpacityDerated({ csaMm2: 16, installationMethod: 'B1', ambientC: 32, insulationType: 'PVC' });
    expect(r.deratedAmpacityA).toBeCloseTo(71.44, 2);
  });
  it('10 grouped circuits take the 12-circuit factor 0.45, not the 9-circuit 0.50', () => {
    // XLPE factors, C 6 mm²: 46 A × 1.00 × 0.45 = 20.7 A
    const r = approval.cableAmpacityDerated({ csaMm2: 6, installationMethod: 'C', ambientC: 30, groupedCircuits: 10, insulationType: 'XLPE' });
    expect(r.deratedAmpacityA).toBeCloseTo(20.7, 2);
    expect(() => approval.cableAmpacityDerated({ csaMm2: 6, installationMethod: 'C', groupedCircuits: 21 })).toThrow(/20 grouped circuits/);
  });
  it('buried (method D) uses the 20 °C ground table: PVC at 30 °C = 0.89', () => {
    // 10 mm² D: 63 A × 0.89 (B.52.15) × 1.00 (soil 1.5 K·m/W) = 56.07 A; old 63 A.
    const r = approval.cableAmpacityDerated({ csaMm2: 10, installationMethod: 'D', ambientC: 30, soilThermalResistivityKMPerW: 1.5, insulationType: 'PVC' });
    expect(r.deratedAmpacityA).toBeCloseTo(56.07, 2);
    expect(r.methodologyNote).toMatch(/TWO loaded conductors/);
  });
});

describe('Solar Bible sizing (/solar): fallback sun and battery autonomy', () => {
  it('without NASA data, Lodwar is sized on the table irradiance (8.2 kWh/m²/day), not 9.2 h of sunshine', () => {
    // 9.2 was refused by sizeSolar (> 9), so no system came back at all.
    const res = findOptimalSystem(10, 2000, 24, 'Lodwar', 'standard', false);
    expect(res.length).toBeGreaterThan(0);
    // Daily production = kWp × 8.2 × 0.78 (PR): the ratio of production to listed kWp
    // is within the listed/design wattage difference (≤ 5 %) of 6.40.
    const r = res[0];
    expect(r.systemSpecs.dailyProduction / (r.systemSpecs.totalWattage / 1000)).toBeGreaterThan(6.4 * 0.95);
    expect(r.systemSpecs.dailyProduction / (r.systemSpecs.totalWattage / 1000)).toBeLessThan(6.4 * 1.05);
  });
  it('autonomy = listed kWh × 0.9 DoD × 0.9 discharge-path efficiency ÷ daily use', () => {
    const res = findOptimalSystem(15, 2500, 8, 'Nairobi', 'standard', true);
    for (const r of res) expect(r.systemSpecs.autonomyDays).toBeCloseTo((r.systemSpecs.totalBatteryKwh * 0.81) / 15, 6);
  });
});

describe('Verified CORRECT (no change): hand-worked checks of the core engines', () => {
  it('energy = kWp × PSH × 365 × PR; battery = usable ÷ (DoD × η) — Nairobi hybrid 450 kWh/month, PSH 5.5', async () => {
    const { sizeSolar } = await import('@/lib/solar/sizing');
    // daily 450/30 = 15 kWh; kWp = 15 ÷ (5.5 × 0.78) = 3.497 → 7 × 550 W = 3.85 kWp;
    // energy 3.85 × 5.5 × 365 × 0.78 = 6,028.5 → 6,029 kWh/yr; battery 7.5 kWh ÷ (0.9 × 0.9) = 9.26 → 9.3 kWh.
    const r = sizeSolar({ monthlyKwh: 450, pshAnnual: 5.5, systemType: 'hybrid', nightUsePct: 50 });
    expect(r.panels).toBe(7);
    expect(r.pvKwp).toBe(3.85);
    expect(r.annualEnergyKwh).toBe(6029);
    expect(r.batteryKwh).toBe(9.3);
  });
  it('off-grid sized on the worst month with 10 % battery loss — 600 kWh/month, PSH 5.5 / 4.5, 1 day', async () => {
    const { sizeSolar } = await import('@/lib/solar/sizing');
    // daily 20; kWp = 20 ÷ (4.5 × 0.78 × 0.9) = 6.33 → 12 panels = 6.6 kWp; battery 20 ÷ 0.81 = 24.69 → 24.7 kWh.
    const r = sizeSolar({ monthlyKwh: 600, pshAnnual: 5.5, pshWorstMonth: 4.5, systemType: 'off-grid', autonomyDays: 1 });
    expect(r.pvKwp).toBe(6.6);
    expect(r.batteryKwh).toBe(24.7);
  });
  it('voltage drop: DC 2 × I × L × ρ ÷ A; three-phase √3 × I × L × ρ ÷ A', () => {
    // 48 V, 100 A, 10 m, 35 mm², 20 °C: 2 × 100 × 10 × 0.01724 ÷ 35 = 0.985 V = 2.05 %
    const d = eng.voltageDrop({ systemType: 'dc', currentA: 100, voltageV: 48, oneWayLengthM: 10, csaMm2: 35, ambientTempC: 20 });
    expect(d.dropV).toBeCloseTo(0.985, 3);
    expect(d.dropPct).toBeCloseTo(2.052, 2);
    // 400 V, 50 A, 50 m, 16 mm², 20 °C: 1.732 × 50 × 50 × 0.01724 ÷ 16 = 4.666 V = 1.17 %
    const t = eng.voltageDrop({ systemType: 'ac_three_phase', currentA: 50, voltageV: 400, oneWayLengthM: 50, csaMm2: 16, ambientTempC: 20 });
    expect(t.dropV).toBeCloseTo(4.666, 2);
  });
  it('AC breaker = next standard ≥ 1.25 × I; 50 kW at 400 V three-phase → 72.2 A × 1.25 = 90.2 → 100 A', () => {
    const o = eng.ocpdSizing({ panelIscStc: 13.9, stringsInParallel: 3, inverterAcKw: 50, acVoltageV: 400, phases: 3 });
    expect(o.acBreaker.continuousCurrentA).toBeCloseTo(72.17, 2);
    expect(o.acBreaker.recommendedStdA).toBe(100);
    // string fuse ≥ 1.56 × 13.9 = 21.7 A → 25 A gPV
    expect(o.stringFuse.recommendedStdA).toBe(25);
  });
});

describe('Smart Sizing follow-up: generator overload alarm, kW limit, Runtime/day', () => {
  const unity = { ...DEFAULTS, batteryBankKwh: 0, powerFactor: 1, supportMarginPct: 0, altitudeM: 1000, ambientC: 25, peakLoadKw: 160, startingKva: 90 };
  it('the alarm compares kW with kW: site capacity = kVA × 0.8 × (1 − derate)', () => {
    // 200 kVA × 0.8 = 160 kW; 90 % = 144 kW; a 160 kW peak FIRES.
    // (Old rule: 160 kW > 0.9 × 200 "kVA" = 180 → silent, at 100 % of the set's kW rating.)
    expect(generatorOverloaded(160, 200, 0)).toEqual({ siteKw: 160, overloaded: true });
    // 250 kVA × 0.8 = 200 kW; 90 % = 180 kW; 160 kW does not fire.
    expect(generatorOverloaded(160, 250, 0).overloaded).toBe(false);
    // Derate counts: 250 kVA at 20 % derate = 160 kW site; 90 % = 144 → 150 kW FIRES.
    expect(generatorOverloaded(150, 250, 20).overloaded).toBe(true);
  });
  it('no false alarm on the defaults: 164 kW vs 0.9 × 400 × 0.8 × 0.918 = 264.4 kW', () => {
    const g = sizeGenerator({ ...DEFAULTS, batteryBankKwh: 20 });
    // charge draw 20 kWh × 0.2 C = 4 kW
    const r = generatorOverloaded(DEFAULTS.peakLoadKw + g.chargeDrawKw, g.ratedKva, g.derate);
    expect(r.siteKw).toBeCloseTo(293.76, 2);
    expect(r.overloaded).toBe(false);
  });
  it('sizing respects the kW rating: 160 kW at PF 1.0 needs 160 / 0.8 × 1.25 = 250 kVA (was 200), and that set does not alarm', () => {
    const g = sizeGenerator(unity);
    expect(g.requiredKva).toBeCloseTo(250, 6);
    expect(g.ratedKva).toBe(250);
    expect(generatorOverloaded(160, g.ratedKva, g.derate).overloaded).toBe(false);
    // PF 0.8 or below is kVA-limited and unchanged: 160 / 0.7 × 1.25 = 285.7 kVA → 300.
    expect(sizeGenerator({ ...unity, powerFactor: 0.7 }).ratedKva).toBe(300);
  });
  it('Runtime/day drives litres per day and days per tank', () => {
    // 400 kVA × 0.8 × 0.75 = 240 kW × 0.27 L/kWh = 64.8 L/h; 500 L → 7.72 h;
    // 8 h/day → 518.4 L/day and 0.96 days per tank.
    const f = sizeFuel({ fuelTankL: 500, hoursPerDay: 8 }, 400);
    expect(f.lph).toBeCloseTo(64.8, 6);
    expect(f.runtimeH).toBeCloseTo(7.716, 3);
    expect(f.litresPerDay).toBeCloseTo(518.4, 6);
    expect(f.tankDays).toBeCloseTo(0.965, 3);
    // 4 h/day on 100 kVA: 16.2 L/h × 4 = 64.8 L/day; 500 L → 30.86 h → 7.72 days.
    const g = sizeFuel({ fuelTankL: 500, hoursPerDay: 4 }, 100);
    expect(g.litresPerDay).toBeCloseTo(64.8, 6);
    expect(g.tankDays).toBeCloseTo(7.716, 3);
    expect(sizeFuel({ fuelTankL: 500, hoursPerDay: 0 }, 400).tankDays).toBe(Infinity);
  });
  it('the dead wire table is marked do-not-use', () => {
    expect(read('components/solar/SolarBibleEngine.tsx')).toMatch(/DO NOT USE \(audit 2026-11-26\)[\s\S]*PHYSICALLY WRONG/);
  });
});
