import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { et0Fao56 } from '@/lib/data-sources/fao56';
import { fetchLocationforecast, toWeatherResponse, truncate4, daylightHours, _clearMetCache, MET_USER_AGENT, type MetForecast } from '@/lib/data-sources/metNorway';
import { precipStatsFromPower, fetchNasaPowerDailyMet } from '@/lib/data-sources/nasaPower';

describe('FAO-56 Penman-Monteith (FAO Irrigation and Drainage Paper 56, Example 18)', () => {
  // Brussels, 6 July: lat 50°48'N, 100 m, Tmax 21.5, Tmin 12.3, ea 1.409 kPa, u2 2.078 m/s, Rs 22.07 MJ/m²/day.
  const r = et0Fao56({ tMaxC: 21.5, tMinC: 12.3, eaKPa: 1.409, u2: 2.078, rsMJ: 22.07, elevationM: 100, latDeg: 50.8, dayOfYear: 187 });
  it('intermediate values match the worked example', () => {
    expect(r.parts.delta).toBeCloseTo(0.122, 3);
    expect(r.parts.gamma).toBeCloseTo(0.0666, 4);
    expect(r.parts.es).toBeCloseTo(1.997, 2);
    expect(r.parts.Ra).toBeCloseTo(41.09, 1);
    expect(r.parts.Rso).toBeCloseTo(30.90, 1);
    expect(r.parts.Rns).toBeCloseTo(17.0, 1);
    expect(r.parts.Rnl).toBeCloseTo(3.71, 1);
    expect(r.parts.Rn).toBeCloseTo(13.28, 1);
  });
  it('ET0 = 3.9 mm/day', () => expect(r.et0).toBeCloseTo(3.9, 1));
  it('dew-point input gives the same ea (FAO-56 eq. 14)', () => {
    const d = et0Fao56({ tMaxC: 21.5, tMinC: 12.3, tDewC: 11.92, u2: 2.078, rsMJ: 22.07, elevationM: 100, latDeg: 50.8, dayOfYear: 187 });
    expect(d.parts.ea).toBeCloseTo(1.40, 2);
  });
  it('invalid inputs are refused, not clipped', () => {
    expect(() => et0Fao56({ tMaxC: 10, tMinC: 20, eaKPa: 1, u2: 2, rsMJ: 20, elevationM: 0, latDeg: 0, dayOfYear: 10 })).toThrow(/Tmax/);
    expect(() => et0Fao56({ tMaxC: 30, tMinC: 20, u2: 2, rsMJ: 20, elevationM: 0, latDeg: 0, dayOfYear: 10 })).toThrow(/vapour pressure/);
    expect(() => et0Fao56({ tMaxC: 30, tMinC: 20, eaKPa: 1, u2: 2, rsMJ: 60, elevationM: 0, latDeg: 0, dayOfYear: 10 })).toThrow(/Rs/);
  });
});

// A small Locationforecast-shaped answer (structure from the MET API; values are test inputs).
const forecast = (): MetForecast => {
  const ts: MetForecast['properties']['timeseries'] = [];
  const t0 = Date.parse('2026-11-14T09:00:00Z');
  for (let h = 0; h < 6; h++) ts.push({ time: new Date(t0 + h * 3600e3).toISOString().replace('.000', ''), data: { instant: { details: { air_temperature: 20 + h, relative_humidity: 60, cloud_area_fraction: 40, wind_speed: 3 + h / 10, wind_from_direction: 90 } }, next_1_hours: { summary: { symbol_code: 'partlycloudy_day' }, details: { precipitation_amount: 0.5 } }, next_6_hours: { details: { precipitation_amount: 9 } } } });
  for (let k = 0; k < 4; k++) ts.push({ time: new Date(t0 + (6 + k * 6) * 3600e3).toISOString().replace('.000', ''), data: { instant: { details: { air_temperature: 18, cloud_area_fraction: 80, wind_speed: 2 } }, next_6_hours: { details: { precipitation_amount: 2 } } } });
  return { properties: { meta: { updated_at: '2026-11-14T08:30:00Z' }, timeseries: ts } };
};

describe('MET Norway: terms of service in code', () => {
  beforeEach(() => _clearMetCache());
  it('coordinates truncated to 4 decimals; identifying User-Agent sent', async () => {
    expect(truncate4(-1.29219876)).toBe(-1.2921);
    const spy = vi.fn(async () => new Response(JSON.stringify(forecast()), { status: 200, headers: { expires: new Date(Date.now() + 600e3).toUTCString(), 'last-modified': 'Sat, 14 Nov 2026 08:30:00 GMT' } }));
    await fetchLocationforecast(-1.29219876, 36.82191234, spy as never);
    const [url, init] = spy.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=-1.2921&lon=36.8219');
    expect((init.headers as Record<string, string>)['User-Agent']).toBe(MET_USER_AGENT);
    expect(MET_USER_AGENT).toMatch(/^EmersonEIMS.*https:\/\/www\.emersoneims\.com$/);
  });
  it('no repeat request before Expires; then If-Modified-Since with the stored Last-Modified; 304 reuses data', async () => {
    const now = Date.now();
    const first = vi.fn(async () => new Response(JSON.stringify(forecast()), { status: 200, headers: { expires: new Date(now + 600e3).toUTCString(), 'last-modified': 'Sat, 14 Nov 2026 08:30:00 GMT' } }));
    await fetchLocationforecast(1, 37, first as never, now);
    const again = vi.fn();
    expect((await fetchLocationforecast(1, 37, again as never, now + 60e3)).fromCache).toBe(true);
    expect(again).not.toHaveBeenCalled();
    const reval = vi.fn(async () => new Response(null, { status: 304, headers: { expires: new Date(now + 1800e3).toUTCString() } }));
    const r = await fetchLocationforecast(1, 37, reval as never, now + 700e3);
    expect(((reval.mock.calls[0] as unknown as [string, RequestInit])[1].headers as Record<string, string>)['If-Modified-Since']).toBe('Sat, 14 Nov 2026 08:30:00 GMT');
    expect(r.fromCache).toBe(true);
  });
  it('an error answer is an error (never filled)', async () => {
    await expect(fetchLocationforecast(2, 38, (async () => new Response('', { status: 503 })) as never)).rejects.toThrow(/503/);
  });
});

describe('MET Norway → site weather response', () => {
  const r = toWeatherResponse(forecast(), -1.29, 36.82);
  it('current values mapped; values MET does not give are null, not invented', () => {
    expect(r.current).toMatchObject({ temperature: 20, humidity: 60, cloudCover: 40, windSpeed: 3, feelsLike: null, weatherCode: null, symbolCode: 'partlycloudy_day' });
    expect(r.forecast[0].shortwaveRadiation).toBeNull();
  });
  it('rain is not double-counted: 6 hourly steps × 0.5 mm, then 6-hour steps × 2 mm', () => {
    const total = r.forecast.reduce((s, d) => s + d.precipitation, 0);
    expect(total).toBeCloseTo(6 * 0.5 + 4 * 2, 6);
  });
  it('attribution carried for display', () => expect(r.source).toMatch(/MET Norway/));
  it('daylight at the equator ≈ 12.1 h (geometry, −0.833° horizon)', () => expect(daylightHours(0, '2026-03-20')).toBeCloseTo(12.1, 1));
});

describe('NASA POWER', () => {
  it('precipitation statistics; -999 dropped; < 1 year → none', () => {
    const series: Record<string, number> = {};
    for (let d = 0; d < 730; d++) series[`d${d}`] = d === 5 ? 80 : d === 6 ? -999 : 2;
    const s = precipStatsFromPower(series)!;
    expect(s.days).toBe(729);
    expect(s.maxDaily).toBe(80);
    expect(s.annual).toBe(Math.round((728 * 2 + 80) / (729 / 365.25)));
    expect(s.note).toMatch(/lower bounds/);
    expect(precipStatsFromPower({ a: 1 })).toBeNull();
  });
  it('daily met parsing drops any day with a missing value', async () => {
    const body = { geometry: { coordinates: [36.8, -1.3, 1661] }, properties: { parameter: {
      T2M_MAX: { 20261101: 25, 20261102: 26 }, T2M_MIN: { 20261101: 12, 20261102: 13 }, T2MDEW: { 20261101: 10, 20261102: -999 },
      WS2M: { 20261101: 2, 20261102: 2 }, ALLSKY_SFC_SW_DWN: { 20261101: 22, 20261102: 21 }, PRECTOTCORR: { 20261101: 0, 20261102: 3 } } } };
    const r = await fetchNasaPowerDailyMet(-1.3, 36.8, new Date('2026-11-01'), new Date('2026-11-02'), (async () => new Response(JSON.stringify(body))) as never);
    expect(r!.days.map((d) => d.date)).toEqual(['2026-11-01']);
    expect(r!.elevationM).toBe(1661);
  });
});

describe('routes without an Open-Meteo licence', () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.resetModules(); });
  it('weather route serves MET Norway with attribution', async () => {
    vi.stubEnv('OPEN_METEO_API_KEY', '');
    const spy = vi.fn(async () => new Response(JSON.stringify(forecast()), { status: 200, headers: { expires: new Date(Date.now() + 600e3).toUTCString() } }));
    vi.stubGlobal('fetch', spy);
    const { GET } = await import('@/app/api/weather/[lat]/[lon]/route');
    const { NextRequest } = await import('next/server');
    const r = await GET(new NextRequest('http://x/api/weather/-1.2921/36.8219'), { params: Promise.resolve({ lat: '-1.2921', lon: '36.8219' }) });
    expect(r.status).toBe(200);
    const j = await r.json();
    expect(j.source).toMatch(/MET Norway/);
    expect(String((spy.mock.calls[0] as unknown[])[0])).toMatch(/^https:\/\/api\.met\.no\//);
  });
  it('building flood: no rainfall data → INSUFFICIENT EVIDENCE (no 900 mm / 80 mm stand-ins)', async () => {
    vi.stubEnv('OPEN_METEO_API_KEY', '');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 503 })));
    const { POST } = await import('@/app/api/building/flood/route');
    const { NextRequest } = await import('next/server');
    const r = await POST(new NextRequest('http://x/api/building/flood', { method: 'POST', body: JSON.stringify({ latitude: -1.29, longitude: 36.82 }) }));
    expect(r.status).toBe(503);
    expect((await r.json()).error).toMatch(/INSUFFICIENT EVIDENCE/);
  });
  it('GLDAS route: NASA POWER + FAO-56 only; soil moisture null, nothing invented', async () => {
    vi.stubEnv('OPEN_METEO_API_KEY', '');
    const days: Record<string, Record<string, number>> = { T2M_MAX: {}, T2M_MIN: {}, T2MDEW: {}, WS2M: {}, ALLSKY_SFC_SW_DWN: {}, PRECTOTCORR: {} };
    for (let d = 1; d <= 20; d++) { const k = `202610${String(d).padStart(2, '0')}`; days.T2M_MAX[k] = 26; days.T2M_MIN[k] = 13; days.T2MDEW[k] = 11; days.WS2M[k] = 2; days.ALLSKY_SFC_SW_DWN[k] = 22; days.PRECTOTCORR[k] = 1.5; }
    vi.stubGlobal('fetch', vi.fn(async (u: string) => (String(u).includes('power.larc') ? new Response(JSON.stringify({ geometry: { coordinates: [36.8, -1.3, 1661] }, properties: { parameter: days } })) : new Response('', { status: 451 }))));
    const { POST } = await import('@/app/api/borehole/nasa-gldas/route');
    const { NextRequest } = await import('next/server');
    const r = await POST(new NextRequest('http://x/api/borehole/nasa-gldas', { method: 'POST', body: JSON.stringify({ latitude: -1.3, longitude: 36.8 }) }));
    const j = await r.json();
    expect(j.data.soilMoisture).toBeNull();
    expect(j.data.groundwater).toBeNull();
    expect(j.data.precipitation).toBe(1.5);
    expect(j.data.evapotranspiration).toBeGreaterThan(2);
    expect(j.data.evapotranspiration).toBeLessThan(6);
    expect(j.data.source).toMatch(/NASA POWER/);
    expect(JSON.stringify(j)).not.toMatch(/Regional Model Estimate/);
  });
});
