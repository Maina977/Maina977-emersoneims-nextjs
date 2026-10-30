/**
 * SolarGenius round-6 audit (2026-10-30): one engine for every tool, the
 * proposal's figures computed on the server, safe cable sizes, honest notes.
 */
import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
import { sizeSolar, gridSaving } from '@/lib/solar/sizing';
import { findOptimalSystem } from '@/components/solar/SolarEquipmentDatabase';
import SolarCalculatorEngine, { sizeConductor } from '@/components/solar-modules/crc/core/calculator/SolarCalculatorEngine';

const require = createRequire(import.meta.url);
const { dispatch } = require('../../lib/solar-genius/dispatch.js');

describe('proposal: payback, IRR and NPV are computed on the server', () => {
  it('ignores a forged payback and IRR', async () => {
    const body = { design: { systemKw: 3.3, panelCount: 6 }, financial: { capexKes: 696000, year1SavingsKes: 123000, paybackYears: 0.4, irrPct: 250 } };
    const r = await dispatch('reports', ['proposal'], 'POST', body, {});
    expect(r.status).toBe(200);
    expect(body.financial.paybackYears).toBeGreaterThan(5);
    expect(body.financial.irrPct).toBeLessThan(30);
    expect((body.financial as any).cashFlowTable.length).toBe(26);
  });
  it('without a year-1 saving it builds the proposal with no payback, discarding any sent', async () => {
    const body = { design: { systemKw: 5 }, financial: { capexKes: 900000, paybackYears: 0.4, irrPct: 250 } };
    const r = await dispatch('reports', ['proposal'], 'POST', body, {});
    expect(r.status).toBe(200);
    expect((body.financial as any).paybackYears).toBeNull();
    expect((body.financial as any).irrPct).toBeNull();
  });
  it('refuses a capex that does not fit the system size', async () => {
    const r = await dispatch('reports', ['proposal'], 'POST', { design: { systemKw: 3.3 }, financial: { capexKes: 6960, year1SavingsKes: 123000 } }, {});
    expect(r.status).toBe(400);
  });
  it('the trials error states the real minimum', async () => {
    const r = await dispatch('engpro', ['battery-mc'], 'POST', { trials: 1e9 }, {});
    expect(r.status).toBe(400);
    expect(JSON.stringify(r.body)).toMatch(/from 100 to 20000/);
  });
});

describe('core sizing notes', () => {
  it('warns that grid-tied gives no power during KPLC cuts', () => {
    const r = sizeSolar({ monthlyKwh: 450, pshAnnual: 5.8, systemType: 'grid-tied' });
    expect(r.assumptions.join(' ')).toMatch(/NO BACKUP/);
  });
  it('flags a system that cannot pay back within 25 years', () => {
    const r = sizeSolar({ monthlyKwh: 10, pshAnnual: 5.8, systemType: 'hybrid' });
    expect(r.notWorthwhile).toBe(true);
    expect(r.assumptions[0]).toMatch(/NOT WORTHWHILE/);
  });
  it('says when a hybrid with no night use needs no battery', () => {
    const r = sizeSolar({ monthlyKwh: 450, pshAnnual: 5.8, systemType: 'hybrid', nightUsePct: 0 });
    expect(r.batteryKwh).toBe(0);
    expect(r.assumptions.join(' ')).toMatch(/no battery is needed/);
  });
  it('gridSaving is the same rule sizeSolar uses', () => {
    const r = sizeSolar({ monthlyKwh: 450, pshAnnual: 5.82, systemType: 'hybrid', nightUsePct: 20 });
    const g = gridSaving({ type: 'hybrid', annualEnergyKwh: r.annualEnergyKwh, annualConsumptionKwh: 450 / 30 * 365, nightUsePct: 20, batteryKwh: r.batteryKwh });
    expect(Math.round(g.annualSavingKes)).toBe(r.annualSavingKes);
  });
});

describe('appliance calculator engine', () => {
  it('never gives 2.5 mm² for a large current, and refuses beyond the table', () => {
    expect(sizeConductor(153, 3, 48, 1)!.mm2).toBeGreaterThanOrEqual(50);
    expect(sizeConductor(2000, 3, 48, 1)).toBeNull();
  });
  it('a fridge default and a peak from simultaneous loads', () => {
    const e = new SolarCalculatorEngine();
    const load = e.calculateLoadProfile([
      { name: 'Fridge', wattage: 150, dailyHours: 10, quantity: 1, priority: 'essential' },
      { name: 'Kettle', wattage: 2000, dailyHours: 0.25, quantity: 1, priority: 'optional' },
    ]);
    expect(load.totalDailyEnergy).toBeCloseTo(2.0, 2);
    expect(load.peakLoad).toBeCloseTo(2.075, 3); // 2.0 + half of 0.15
    expect(() => e.calculateLoadProfile([{ name: 'x', wattage: -5, dailyHours: 1, quantity: 1, priority: 'optional' }])).toThrow();
  });
});

describe('Solar Bible engine uses the shared calculator', () => {
  it('same cost and payback as sizeSolar, tier-1 panels, LiFePO4 48 V, hybrid inverter', () => {
    const res = findOptimalSystem(15, 2500, 8, 'Nairobi', 'standard', true);
    expect(res.length).toBeGreaterThan(0);
    for (const r of res) {
      expect(r.panels[0].panel.tier).toBe(1);
      expect(r.batteries[0].battery.type).toBe('LiFePO4');
      expect(r.batteries[0].battery.voltage).toBeGreaterThanOrEqual(48);
      expect(r.inverter.type).toBe('Hybrid');
      expect(r.roi.paybackYears).toBeGreaterThan(3);
    }
    const prices = new Set(res.map((r) => r.totalCost));
    expect(prices.size).toBe(1); // one price list
  });
  it('never pairs an on-grid inverter with batteries', () => {
    const res = findOptimalSystem(150, 20000, 8, 'Nairobi', 'premium', true);
    for (const r of res) expect(r.inverter.type).not.toBe('On-Grid');
  });
  it('grid-tied without backup: grid-tie inverter, no battery', () => {
    const res = findOptimalSystem(15, 2500, 0, 'Nairobi', 'standard', true);
    for (const r of res) { expect(['On-Grid', 'String']).toContain(r.inverter.type); expect(r.batteries.length).toBe(0); }
  });
});
