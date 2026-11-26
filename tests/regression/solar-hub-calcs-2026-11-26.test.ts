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
    // available 400 × 0.918 = 367.2 kVA; peak 160 / 0.85 = 188.24 kVA → kVA margin (367.2 − 188.24)/367.2 = 48.74 %.
    // Review follow-up: the kW limit binds — 367.2 × 0.8 = 293.76 kW; (293.76 − 160)/293.76 = 45.53 %.
    expect(supportMarginPct(400, 8.2, 160, 0.85)).toBeCloseTo(45.53, 2);
    // With the 4 kW charging draw (as the screen now passes): (293.76 − 164)/293.76 = 44.17 %.
    expect(supportMarginPct(400, 8.2, 164, 0.85)).toBeCloseTo(44.17, 2);
    // Reviewer case, PF 1.0: 160 kW on 250 kVA, no derate: kVA 36 %, kW (200 − 160)/200 = 20 % → 20 %.
    expect(supportMarginPct(250, 0, 160, 1)).toBeCloseTo(20, 6);
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
  it('voltage drop (superseded by R3 below): tabulated BS 7671 4D1B mV/A/m for tabulated copper sizes', () => {
    // 48 V, 100 A, 10 m, 35 mm² DC in conduit: 4D1B col 2 = 1.25 mV/A/m → 1.25 × 100 × 10 / 1000 = 1.25 V = 2.60 %
    // (the old rho/A formula at 20 °C gave 0.985 V: resistive only, at 20 °C instead of 70 °C).
    const d = eng.voltageDrop({ systemType: 'dc', currentA: 100, voltageV: 48, oneWayLengthM: 10, csaMm2: 35, ambientTempC: 20 });
    expect(d.dropV).toBeCloseTo(1.25, 3);
    expect(d.dropPct).toBeCloseTo(2.604, 2);
    // 400 V, 50 A, 50 m, 16 mm² three-phase: 4D1B col 6 = 2.4 → 2.4 × 50 × 50 / 1000 = 6.0 V = 1.5 %
    const t = eng.voltageDrop({ systemType: 'ac_three_phase', currentA: 50, voltageV: 400, oneWayLengthM: 50, csaMm2: 16, ambientTempC: 20 });
    expect(t.dropV).toBeCloseTo(6.0, 3);
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

// ═════════════════════════════════════════════════════════════════════════
// Independent review 2026-11-26, residual items R1-R8 (REVIEW-SOLAR-HUB.md)
// ═════════════════════════════════════════════════════════════════════════

describe('R1/R2: UPS Lab rejects deliberately overloaded systems as a FAULT', () => {
  // Eaton 9PX 6 kVA: rated 6 × 0.9 = 5,400 W and 6,000 VA; surge allowance 1.05 × 5,400 = 5,670 W.
  // Vertiv APM 20 kVA: rated 20 × 0.95 = 19,000 W and 20,000 VA; surge allowance 19,950 W.
  // Loads: heater 2,000 W pf 1.0 ×1.0; cooker 2,400 W pf 1.0 ×1.0; LED bulb 9 W pf 0.9 ×1.0; server 600 W pf 0.95 ×1.3.
  type L = { kind: 'heater' | 'cooker' | 'led-bulb' | 'server'; qty: number };
  const eaton = (loads: L[]) => upsLabCompute({ ups: [{ modelId: 'eaton-9px-6', qty: 1 }], loads, mainsPresent: true });
  const vertiv = (loads: L[]) => upsLabCompute({ ups: [{ modelId: 'vertiv-apm-20', qty: 1 }], loads, mainsPresent: true });
  const fault = (r: ReturnType<typeof eaton>) => r.isOverloaded && r.signals.some((x) => x.id === 'overload' && x.severity === 'fault');

  it('101 % of rated W → FAULT (was only the > 85 % warning)', () => {
    // 2 heaters 4,000 W + 162 LEDs 1,458 W = 5,458 W = 101.1 % of 5,400 W.
    // VA = 4,000 + 1,458 / 0.9 = 5,620 VA (93.7 %); surge = 5,458 W (no inrush) < 5,670 W.
    const r = eaton([{ kind: 'heater', qty: 2 }, { kind: 'led-bulb', qty: 162 }]);
    expect(r.loadContinuousW).toBe(5458);
    expect(r.loadVa).toBeCloseTo(5620, 6);
    expect(fault(r)).toBe(true);
    expect(r.overloadReasons).toHaveLength(1);
    expect(r.overloadReasons[0]).toMatch(/^continuous/);
  });
  it('105 % of rated W (just under the surge allowance) → FAULT', () => {
    // heater 2,000 + cooker 2,400 + 141 LEDs 1,269 = 5,669 W = 104.98 %; surge 5,669 ≤ 5,670 (surge rule silent);
    // VA = 4,400 + 1,410 = 5,810 VA (96.8 %). Only the continuous-W limit catches it.
    const r = eaton([{ kind: 'heater', qty: 1 }, { kind: 'cooker', qty: 1 }, { kind: 'led-bulb', qty: 141 }]);
    expect(r.loadContinuousW).toBe(5669);
    expect(fault(r)).toBe(true);
    expect(r.overloadReasons.map((x) => x.split(' ')[0])).toEqual(['continuous']);
  });
  it('150 % of rated W → FAULT on every limit', () => {
    // 4 heaters 8,000 + 11 LEDs 99 = 8,099 W = 150.0 %; VA = 8,000 + 110 = 8,110 VA (135 %); surge 8,099 > 5,670.
    const r = eaton([{ kind: 'heater', qty: 4 }, { kind: 'led-bulb', qty: 11 }]);
    expect(r.loadContinuousW).toBe(8099);
    expect(fault(r)).toBe(true);
    expect(r.overloadReasons.map((x) => x.split(' ')[0])).toEqual(['surge', 'continuous', 'apparent']);
  });
  it('exactly 100 % of rated W and VA is AT the limit and passes; one more bulb faults', () => {
    // 600 LEDs = 5,400 W (100.0 %) and 600 × 10 = 6,000 VA (100.0 %); surge 5,400 ≤ 5,670. Rule: ≤ 100 % passes, > 100 % faults.
    const at = eaton([{ kind: 'led-bulb', qty: 600 }]);
    expect(at.loadContinuousW).toBe(5400);
    expect(at.loadVa).toBeCloseTo(6000, 6);
    expect(at.isOverloaded).toBe(false);
    // 601 LEDs = 5,409 W (100.17 %) and 6,010 VA → FAULT on both.
    const over = eaton([{ kind: 'led-bulb', qty: 601 }]);
    expect(fault(over)).toBe(true);
    expect(over.overloadReasons.map((x) => x.split(' ')[0])).toEqual(['continuous', 'apparent']);
  });
  it('Vertiv APM 20 kVA with 2,216 LEDs: 19,944 W, 22,160 VA (110.8 %) → FAULT', () => {
    // 2,216 × 9 = 19,944 W (> 19,000 W rated: 105.0 %), 19,944 / 0.9 = 22,160 VA = 110.8 % of 20,000 VA;
    // surge 19,944 ≤ 19,950, so the old surge-only check passed it.
    const r = vertiv([{ kind: 'led-bulb', qty: 2216 }]);
    expect(r.loadVa).toBeCloseTo(22160, 6);
    expect(fault(r)).toBe(true);
    expect(r.overloadReasons.some((x) => /^apparent/.test(x))).toBe(true);
  });
  it('inside rated W but over rated VA → still FAULT (VA alone)', () => {
    // 2,100 LEDs = 18,900 W (99.5 % of 19,000 W), 21,000 VA (105 % of 20,000 VA), surge 18,900 < 19,950.
    const r = vertiv([{ kind: 'led-bulb', qty: 2100 }]);
    expect(fault(r)).toBe(true);
    expect(r.overloadReasons.map((x) => x.split(' ')[0])).toEqual(['apparent']);
  });
  it('inside rated W and VA but over the surge allowance → still FAULT (surge alone)', () => {
    // 8 servers = 4,800 W (88.9 %), VA = 4,800 / 0.95 = 5,053 VA (84.2 %);
    // surge = 4,800 + 4,800 × 0.3 = 6,240 W > 5,670 W.
    const r = eaton([{ kind: 'server', qty: 8 }]);
    expect(r.loadStartingW).toBe(6240);
    expect(fault(r)).toBe(true);
    expect(r.overloadReasons.map((x) => x.split(' ')[0])).toEqual(['surge']);
  });
  it('just inside EVERY modelled limit → no fault', () => {
    // Vertiv, 2,000 LEDs = 18,000 W (94.7 %), 20,000 VA (100.0 %, at the limit), surge 18,000 ≤ 19,950.
    const r = vertiv([{ kind: 'led-bulb', qty: 2000 }]);
    expect(r.isOverloaded).toBe(false);
    expect(r.signals.some((x) => x.severity === 'fault')).toBe(false);
    // Eaton, 7 servers = 4,200 W, 4,421 VA, surge 4,200 × 1.3 = 5,460 ≤ 5,670.
    expect(eaton([{ kind: 'server', qty: 7 }]).isOverloaded).toBe(false);
  });
  it('limits the catalogue cannot check (overload curve, ambient, altitude) are said on screen, not assumed', () => {
    const src = read('components/hub/UpsLabClient.tsx');
    expect(src).toContain('{UPS_LIMITS_NOTE}');
    expect(src).toMatch(/NOT checked: the manufacturer’s overload-versus-time curve, ambient-temperature and altitude derating/);
    expect(src).toMatch(/exactly 100 % passes, above faults/);
  });
});

describe('R8: the staggered-start surge assumption is stated, with the simultaneous figure', () => {
  it('7 servers + 2 fridges: staggered 5,860 W; all at once Σ W × startMult = 5,460 + 1,600 = 7,060 W', () => {
    const r = upsLabCompute({ ups: [{ modelId: 'eaton-9px-6', qty: 1 }], loads: [{ kind: 'server', qty: 7 }, { kind: 'fridge', qty: 2 }], mainsPresent: true });
    expect(r.loadStartingW).toBe(5860);
    expect(r.loadSimultaneousStartW).toBe(7060);
    expect(read('components/hub/UpsLabClient.tsx')).toMatch(/assuming load groups start one at a time; all at once:/);
  });
});

describe('R3: voltage drop uses BS 7671 Tables 4D1B / 4D2B (reactance + stranded resistance)', () => {
  it('reviewer case: 95 mm², 200 A, 100 m, three-phase 400 V in conduit = 0.48 mV/A/m → 9.6 V = 2.40 %', () => {
    // 4D1B col 6 (3 or 4 single-core cables, enclosed) z = 0.48: 0.48 × 200 × 100 / 1000 = 9.6 V; 9.6 / 400 = 2.40 %.
    // The old formula: √3 × 200 × 100 × 0.02063 / 95 = 7.52 V = 1.88 %.
    const d = eng.voltageDrop({ systemType: 'ac_three_phase', currentA: 200, voltageV: 400, oneWayLengthM: 100, csaMm2: 95, ambientTempC: 70 });
    expect(d.dropV).toBeCloseTo(9.6, 3);
    expect(d.dropPct).toBeCloseTo(2.4, 3);
    expect(d.basis).toMatch(/4D1B/);
    // Free air (multicore, 4D2B col 4) z = 0.43: 8.6 V = 2.15 %.
    expect(eng.voltageDrop({ systemType: 'ac_three_phase', currentA: 200, voltageV: 400, oneWayLengthM: 100, csaMm2: 95, installMethod: 'free_air' }).dropV).toBeCloseTo(8.6, 3);
  });
  it('single-phase 25 mm², 80 A, 40 m in conduit: 4D1B col 3 z = 1.80 → 5.76 V = 2.50 % of 230 V', () => {
    const d = eng.voltageDrop({ systemType: 'ac_single_phase', currentA: 80, voltageV: 230, oneWayLengthM: 40, csaMm2: 25 });
    expect(d.dropV).toBeCloseTo(5.76, 3);
    expect(d.dropPct).toBeCloseTo(2.504, 2);
  });
  it('cable selection follows the table: 200 A, 100 m, three-phase, 2 % limit → 150 mm² (old formula passed 95 mm²)', () => {
    // 95: 0.48 → 2.40 % > 2; 120: 0.41 × 200 × 100 / 1000 = 8.2 V = 2.05 % > 2; 150: 0.36 → 7.2 V = 1.80 % ≤ 2.
    const r = eng.recommendConductor({ systemType: 'ac_three_phase', currentA: 200, voltageV: 400, oneWayLengthM: 100, installMethod: 'conduit', maxVoltDropPct: 2 });
    expect(r.recommendedCsaMm2).toBe(150);
    expect(r.voltageDropPct).toBeCloseTo(1.8, 3);
    expect(r.assumptions.join(' ')).toMatch(/BS 7671:2018 Table 4D1B/);
  });
  it('aluminium is screened conservatively (copper z × 1.64); untabulated sizes say reactance is NOT included', () => {
    // 16 mm² Al single-phase, 20 A, 10 m: 2.8 × (0.02826/0.01724 = 1.6392) = 4.590 mV/A/m → 0.918 V.
    const al = eng.voltageDrop({ systemType: 'ac_single_phase', currentA: 20, voltageV: 230, oneWayLengthM: 10, csaMm2: 16, conductorMaterial: 'aluminium' });
    expect(al.dropV).toBeCloseTo(0.918, 3);
    // 400 mm² is not in Table 4D1B as carried: resistive fallback, stated.
    const big = eng.voltageDrop({ systemType: 'ac_three_phase', currentA: 100, voltageV: 400, oneWayLengthM: 10, csaMm2: 400, ambientTempC: 70 });
    expect(big.basis).toMatch(/reactance NOT included/);
  });
});

describe('R5: unsourced free-air 500 / 630 mm² ratings are not used', () => {
  it('800 A DC in free air: 400 mm² (715 A, 4D2A col 8) is too small and nothing larger is sourced → no recommendation', () => {
    // Old: 500 mm² "826 A" (no source) was recommended.
    const r = eng.recommendConductor({ systemType: 'dc', currentA: 800, voltageV: 400, oneWayLengthM: 1, installMethod: 'free_air', maxVoltDropPct: 10 });
    expect(r.recommendedCsaMm2).toBeNull();
    // 700 A still gets the sourced 400 mm² (715 A).
    expect(eng.recommendConductor({ systemType: 'dc', currentA: 700, voltageV: 400, oneWayLengthM: 1, installMethod: 'free_air', maxVoltDropPct: 10 }).recommendedCsaMm2).toBe(400);
  });
});

describe('R4: table citations', () => {
  it('PVC two-loaded = B.52.2, three-loaded = B.52.4; B.52.5 (XLPE) is no longer cited', () => {
    const se = read('lib/solar-genius/server/solar-engineering.js');
    const ea = read('lib/solar-genius/server/engineering-approval.js');
    expect(se).toMatch(/Table B\.52\.2 \(PVC, copper, TWO loaded conductors\)/);
    expect(se).toMatch(/Table B\.52\.4 \(PVC, copper, method B1, 30 °C\), THREE loaded/);
    expect(se + ea).not.toMatch(/B\.52\.5/);
    expect(ea).toMatch(/Table B\.52\.2 \(PVC, two loaded conductors/);
  });
});

describe('R6: derating module (not online) rounds every lookup conservatively', () => {
  it('A1 1.5 mm² = 13.5 A (BS 7671 4D1A col 3)', () => {
    expect(approval.cableAmpacityDerated({ csaMm2: 1.5, installationMethod: 'A1', ambientC: 30, insulationType: 'PVC' }).baseAmpacityA).toBe(13.5);
  });
  it('soil 2.2 K·m/W takes the 2.5 row (0.89), not 2.0 (0.94); beyond 3.0 is refused', () => {
    // D 10 mm² PVC, 20 °C ground (1.00): 63 × 0.89 = 56.07 A (old 63 × 0.94 = 59.22 A).
    const r = approval.cableAmpacityDerated({ csaMm2: 10, installationMethod: 'D', ambientC: 20, soilThermalResistivityKMPerW: 2.2, insulationType: 'PVC' });
    expect(r.deratedAmpacityA).toBeCloseTo(56.07, 2);
    expect(() => approval.cableAmpacityDerated({ csaMm2: 10, installationMethod: 'D', ambientC: 20, soilThermalResistivityKMPerW: 3.5, insulationType: 'PVC' })).toThrow(/soil survey/);
  });
  it('buried grouping uses B.52.18 (touching): 2 circuits 0.75, not the in-air 0.80; more than 6 is refused', () => {
    // D 10 mm² PVC, 20 °C ground, soil 1.5 (1.00): 63 × 0.75 = 47.25 A (old 63 × 0.80 = 50.4 A).
    const r = approval.cableAmpacityDerated({ csaMm2: 10, installationMethod: 'D', ambientC: 20, groupedCircuits: 2, soilThermalResistivityKMPerW: 1.5, insulationType: 'PVC' });
    expect(r.deratedAmpacityA).toBeCloseTo(47.25, 2);
    expect(() => approval.cableAmpacityDerated({ csaMm2: 10, installationMethod: 'D', groupedCircuits: 7 })).toThrow(/B\.52\.18/);
    // In air the B.52.17 row is unchanged: C 6 mm², 2 circuits → 46 × 0.80 = 36.8 A.
    expect(approval.cableAmpacityDerated({ csaMm2: 6, installationMethod: 'C', ambientC: 30, groupedCircuits: 2, insulationType: 'PVC' }).deratedAmpacityA).toBeCloseTo(36.8, 2);
  });
});

describe('R7: the generator fuel figure is one labelled assumption', () => {
  it('0.27 L/kWh at 75 % is a named constant, shown on screen as assumed, and reconciled with the 0.35 small-set figure', async () => {
    const { GEN_SFC_L_PER_KWH_AT_75 } = await import('@/components/hub/SimulatorClient');
    const { DIESEL_L_PER_KWH } = await import('@/lib/solar/sizing');
    expect(GEN_SFC_L_PER_KWH_AT_75).toBe(0.27);
    expect(DIESEL_L_PER_KWH).toBe(0.35);
    const src = read('components/hub/SimulatorClient.tsx');
    expect(src).toMatch(/caption=\{`Assumed \$\{GEN_SFC_L_PER_KWH_AT_75\} L\/kWh at 75 %/);
    expect(src).toMatch(/SMALL set at PART load/);
    expect(src).not.toMatch(/kwAt75 \* 0\.27/);
    // 400 kVA: 400 × 0.8 × 0.75 = 240 kW × 0.27 = 64.8 L/h (unchanged arithmetic).
    expect(sizeFuel({ fuelTankL: 500, hoursPerDay: 8 }, 400).lph).toBeCloseTo(64.8, 6);
  });
});
