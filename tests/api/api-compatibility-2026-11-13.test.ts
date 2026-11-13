/**
 * Management decision 2026-11-13, items 2 and 8: API compatibility for every
 * public API changed on the P0 branch, through the real route handlers.
 */
import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as solarCalculate } from '@/app/api/solar/calculate/route';
import { GET as reportGet, POST as reportPost } from '@/app/api/building/comprehensive-report/route';
import { POST as qsPost, GET as qsGet } from '@/app/api/qs/[...path]/route';

const json = (url: string, body: unknown) => new NextRequest(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const qs = (path: string[], body: unknown) => qsPost(json(`http://localhost/api/qs/${path.join('/')}`, body), { params: Promise.resolve({ path }) });

describe('/api/solar/calculate: existing callers keep every engineering field', () => {
  it('a legacy request (no new fields) still answers 200 with the sizing', async () => {
    const res = await solarCalculate(json('http://localhost/api/solar/calculate', { consumption: 450, location: 'nairobi', systemType: 'hybrid' }));
    expect(res.status).toBe(200);
    const j = await res.json();
    for (const k of ['pvKwp', 'panels', 'panelWatt', 'inverterKw', 'batteryKwh', 'annualEnergyKwh', 'systemKw', 'annualProduction', 'peakSunHours', 'assumptions', 'sunHours']) {
      expect(j, k).toHaveProperty(k);
    }
    expect(j.pvKwp).toBeGreaterThan(0);
    // Price fields are present but null (consumers handle null: CalculatorPage, SolarCalculatorEngine, Analytics, Report).
    expect(j).toHaveProperty('cost', null);
    expect(j).toHaveProperty('totalCost', null);
  });
  it('validation is unchanged: bad input is still a 400', async () => {
    expect((await solarCalculate(json('http://localhost/api/solar/calculate', { consumption: -5 }))).status).toBe(400);
    expect((await solarCalculate(json('http://localhost/api/solar/calculate', { consumption: 450, tariff: 999 }))).status).toBe(400);
    expect((await solarCalculate(json('http://localhost/api/solar/calculate', { consumption: 450, batteryDod: 2 }))).status).toBe(400);
  });
});

describe('/api/building/comprehensive-report: withdrawn with an explanation', () => {
  it('GET and POST answer 501, success:false, a message a person can act on', async () => {
    for (const res of [await reportGet(), await reportPost()]) {
      expect(res.status).toBe(501);
      const j = await res.json();
      expect(j).toMatchObject({ success: false, ok: false, error: 'not_available' });
      expect(j.message).toMatch(/not available[^]*measured drawings[^]*0768 860 665/);
    }
  });
});

describe('/api/qs/takeoff/slab: protected-testing endpoint', () => {
  it('directive benchmark through the route: 12 × 8 × 0.15 m = 14.40 m³, with units in the field names', async () => {
    const res = await qs(['takeoff', 'slab'], { length_m: 12, width_m: 8, thickness_m: 0.15 });
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.success).toBe(true);
    expect(j.data.net_volume_m3).toBe(14.4);
    expect(j.data.gross_area_m2).toBe(96);
  });
  it('openings and deductions', async () => {
    const j = await (await qs(['takeoff', 'slab'], { length_m: 12, width_m: 8, thickness_m: 0.15, openings: [{ length_m: 2, width_m: 1.5 }, { length_m: 0.6, width_m: 0.6, count: 2 }] })).json();
    expect(j.data.deductions_m3).toBe(0.558);
    expect(j.data.net_volume_m3).toBe(13.842);
  });
  it.each([
    [{ length_m: -12, width_m: 8, thickness_m: 0.15 }, /greater than 0/],
    [{ length_m: 12, width_m: 8, thickness_m: -0.15 }, /greater than 0/],
    [{ length_m: 12, width_m: 8, thickness_m: 150 }, /thickness_m/],
    [{ length_m: 12, width_m: 8 }, /thickness_m/],
    [{ length_m: 12, width_m: 8, thickness_m: 0.15, openings: [{ length_m: -1, width_m: 1 }] }, /greater than 0/],
    [{ length_m: 12, width_m: 8, thickness_m: 0.15, openings: 'all of it' }, /openings/],
    [{ length_m: 'constructor', width_m: 8, thickness_m: 0.15 }, /length_m/],
  ])('refuses %j with a 400 naming the problem', async (body, msg) => {
    const res = await qs(['takeoff', 'slab'], body);
    expect(res.status).toBe(400);
    expect(JSON.stringify(await res.json())).toMatch(msg);
  });
  it('the other QS endpoints are unchanged (501 not available)', async () => {
    const res = await qs(['boq'], {});
    expect(res.status).toBe(501);
    const g = await qsGet(new NextRequest('http://localhost/api/qs/rates'), { params: Promise.resolve({ path: ['rates'] }) });
    expect(g.status).toBe(501);
  });
});
