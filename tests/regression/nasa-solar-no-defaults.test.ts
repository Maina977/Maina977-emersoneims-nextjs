import { describe, it, expect, vi, afterEach } from 'vitest';

// 2026-11-14: /api/nasa/solar answered 5.0 kWh/m²/day and 25 °C when NASA POWER
// returned no valid days (all -999 fill values). Missing data is now null.

afterEach(() => { vi.unstubAllGlobals(); });

async function call(param: Record<string, Record<string, number>>) {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ properties: { parameter: param } }))));
  vi.resetModules();
  const { GET } = await import('@/app/api/nasa/solar/[lat]/[lon]/route');
  const { NextRequest } = await import('next/server');
  const r = await GET(new NextRequest('http://x/api/nasa/solar/-1.29/36.82'), { params: Promise.resolve({ lat: '-1.29', lon: '36.82' }) } as never);
  return r.json();
}

describe('/api/nasa/solar', () => {
  it('only fill values → INSUFFICIENT EVIDENCE with null irradiance and temperature (no 5.0 / 25 stand-ins)', async () => {
    const j = await call({ ALLSKY_SFC_SW_DWN: { '20260101': -999, '20260102': -999 }, T2M: { '20260101': -999 } });
    expect(j.status).toBe('INSUFFICIENT EVIDENCE');
    expect(j.summary.averageDailyGHI).toBeNull();
    expect(j.summary.peakSunHours).toBeNull();
    expect(j.summary.averageTemperature).toBeNull();
  });
  it('real values: mean of valid days only', async () => {
    const j = await call({ ALLSKY_SFC_SW_DWN: { a: 5.2, b: 5.8, c: -999 }, T2M: { a: 19, b: 21 } });
    expect(j.status).toBe('OK');
    expect(j.summary.averageDailyGHI).toBe(5.5);
    expect(j.summary.daysWithIrradiance).toBe(2);
    expect(j.summary.averageTemperature).toBe(20);
  });
});
