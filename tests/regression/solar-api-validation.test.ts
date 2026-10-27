/**
 * SolarGenius API — bad input is a 400 naming the problem, never a 200 with
 * nulls/negatives or a bare 500 (2026-10-25 audit round 5).
 */
import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { dispatch } = require('../../lib/solar-genius/dispatch.js');
const elite = require('../../lib/solar-genius/server/engineering-elite.js');

const call = (family: string, path: string[], body: unknown = {}, query: Record<string, string> = {}) =>
  dispatch(family, path, 'POST', body, query);

describe('bad input → 400', () => {
  const cases: Array<[string, string[], unknown]> = [
    ['solar', ['ocpd-sizing'], {}],
    ['solar', ['losses'], { soilingPct: 'abc' }],
    ['solar', ['losses'], { soiling: -2 }],
    ['solar', ['soiling'], { daysSinceClean: -3 }],
    ['solar', ['soiling'], { climate: 'lunar' }],
    ['solar', ['poa'], {}],
    ['finance', ['npv'], { cashFlows: [] }],
    ['finance', ['npv'], { cashFlows: ['a', 'b'] }],
    ['finance', ['irr'], { cashFlows: [5] }],
    ['finance', ['loan'], { principal: -1000, annualRate: 0.1, years: 5 }],
    ['sustain', ['carbon-footprint'], { annualKwh: -5 }],
    ['sustain', ['solar-offset'], { annualPvKwh: 1000, country: 'ZZ' }],
    ['eng', ['battery-sizing'], {}],
    ['eng', ['net-metering-ke'], {}],
    ['eng', ['priced-boq'], {}],
    ['solar', ['inverter-match'], { pvKwStc: 6, inverterAcKw: 5, dcAcRatioMin: 1.4, dcAcRatioMax: 1.1 }],
    ['solar', ['string-config'], { panelVocStc: 49.5, panelVmppStc: 41.5, panelIscStc: 13.9, inverterMaxDcV: 500, inverterMpptMinV: 120, inverterMaxInputA: 15, siteTempMinC: 60, siteTempMaxC: 20 }],
    ['solar', ['voltage-drop'], { systemType: 'dc', currentA: 10, voltageV: 48, oneWayLengthM: 20, conductorMaterial: 'gold' }],
    ['solar', ['auto-design'], {}],
    ['solar', ['sld'], {}],
  ];
  for (const [fam, path, body] of cases) {
    it(`${fam}/${path.join('/')} ${JSON.stringify(body).slice(0, 60)}`, async () => {
      const r = await call(fam, path, body);
      expect(r.status).toBe(400);
      expect(typeof r.body.error).toBe('string');
      expect(r.body.error).not.toMatch(/failed on our side/);
    });
  }
});

describe('valid input still works', () => {
  it('losses with known items', async () => {
    const r = await call('solar', ['losses'], { soiling: 3 });
    expect(r.status).toBe(200);
    expect(r.body.data.totalLossPct).toBeGreaterThan(0);
  });
  it('ocpd sizing', async () => {
    const r = await call('solar', ['ocpd-sizing'], { panelIscStc: 13.9, stringsInParallel: 3, inverterAcKw: 5, acVoltageV: 230 });
    expect(r.status).toBe(200);
    expect(r.body.data.stringFuse.required).toBe(true);
  });
  it('string-config names the current limit when that is what fails', async () => {
    const r = await call('solar', ['string-config'], { panelVocStc: 49.5, panelVmppStc: 41.5, panelIscStc: 13.9, inverterMaxDcV: 500, inverterMpptMinV: 120, inverterMpptMaxV: 450, inverterMaxInputA: 15 });
    expect(r.status).toBe(200);
    expect(r.body.data.feasible).toBe(false);
    expect(r.body.data.verdict).toMatch(/15 A input limit/);
  });
  it('aluminium conductor does not claim an ampacity check', async () => {
    const r = await call('solar', ['voltage-drop'], { systemType: 'ac_single_phase', currentA: 40, voltageV: 240, oneWayLengthM: 20, conductorMaterial: 'aluminium' });
    expect(r.status).toBe(200);
    expect(r.body.data.verdict).toMatch(/NOT checked/);
  });
});

describe('Kenya grid-connection checklist', () => {
  it('cites no invented form, clause or fee', () => {
    const s = JSON.stringify(elite.epraGridCodePack({}));
    for (const banned of ['ECP-1', '§4', '§6', 'Form numbers verified', '30-day', 'interconnectFeeKes']) {
      expect(s.includes(banned), banned).toBe(false);
    }
    expect(s).toContain('Energy Act 2019');
  });
});
