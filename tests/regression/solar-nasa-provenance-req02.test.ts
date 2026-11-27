/**
 * REQ-02 (P1-B §2 Resource): the NASA POWER retrieval date and API version
 * are recorded in the weather source, and so in the production and proposal
 * outputs built from it. Synthetic POWER-shaped bodies only (not NASA data).
 */
import { describe, it, expect } from 'vitest';
import { parsePowerHourly, fetchPowerHourly, powerApiVersion } from '@/lib/solar/design/nasaPowerHourly';
import { simulateHourly } from '@/lib/solar/design/hourly';
import { PVWATTS_DEFAULT_LOSSES } from '@/lib/solar/design/production';

function body(year: number, header?: unknown) {
  const ghi: Record<string, number> = {}, t2m: Record<string, number> = {};
  for (let ms = Date.UTC(year, 0, 1); ms < Date.UTC(year + 1, 0, 1); ms += 3600000) {
    const d = new Date(ms), h = d.getUTCHours();
    const k = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}${String(h).padStart(2, '0')}`;
    ghi[k] = h >= 3 && h <= 15 ? Math.round(900 * Math.sin(((h - 3 + 0.5) / 13) * Math.PI)) : 0;
    t2m[k] = 20;
  }
  return { ...(header ? { header } : {}), properties: { parameter: { ALLSKY_SFC_SW_DWN: ghi, T2M: t2m } } };
}
const HEADER = { title: 'NASA/POWER Hourly (TEST)', api: { version: 'v2.5.22', name: 'POWER Hourly API' }, sources: ['merra2', 'ceres'] };

describe('REQ-02: NASA POWER retrieval date and API version are recorded', () => {
  it('reads the API name, version and sources from the response header', () => {
    expect(powerApiVersion({ header: HEADER })).toBe('POWER Hourly API v2.5.22 (sources: merra2, ceres)');
    expect(powerApiVersion({})).toBeNull();
  });
  it('the source names the retrieval time and API version; both are also separate fields', () => {
    const w = parsePowerHourly(body(2025, HEADER), 2025, '2026-11-27T08:15:00.000Z');
    expect(w.status).toBe('OK');
    if (w.status !== 'OK') return;
    expect(w.retrievedAt).toBe('2026-11-27T08:15:00.000Z');
    expect(w.apiVersion).toBe('POWER Hourly API v2.5.22 (sources: merra2, ceres)');
    expect(w.source).toContain('2025 (retrieved 2026-11-27T08:15:00.000Z; API POWER Hourly API v2.5.22');
  });
  it('a response with no header says so; nothing is invented', () => {
    const w = parsePowerHourly(body(2025), 2025);
    if (w.status !== 'OK') throw new Error('expected OK');
    expect(w.apiVersion).toBeNull();
    expect(w.source).toContain('retrieved at an unrecorded time; API version not stated in the response');
  });
  it('fetchPowerHourly stamps the time it fetched', async () => {
    const before = Date.now();
    const w = await fetchPowerHourly(-1.29, 36.82, 2025, (async () => new Response(JSON.stringify(body(2025, HEADER)), { status: 200 })) as unknown as typeof fetch);
    if (w.status !== 'OK') throw new Error('expected OK');
    const t = Date.parse(w.retrievedAt!);
    expect(t).toBeGreaterThanOrEqual(before - 1000);
    expect(t).toBeLessThanOrEqual(Date.now() + 1000);
  });
  it('the provenance reaches the production result the proposal quotes', () => {
    const w = parsePowerHourly(body(2025, HEADER), 2025, '2026-11-27T08:15:00.000Z');
    if (w.status !== 'OK') throw new Error('expected OK');
    const r = simulateHourly({
      site: { latDeg: -1.29, lonDeg: 36.82, tiltDeg: 10, azimuthDeg: 0 }, start: w.start, ghiWm2: w.ghiWm2, tempC: w.tempC, weatherSource: w.source,
      array: { dcKw: 10, gammaPmaxPct: -0.35, noctC: 45 }, inverter: { acKw: 10, nominalEfficiency: 0.96 }, losses: PVWATTS_DEFAULT_LOSSES, lossesSource: 'TEST',
    } as Parameters<typeof simulateHourly>[0]);
    expect(r.assumptions.join(' ')).toContain('retrieved 2026-11-27T08:15:00.000Z; API POWER Hourly API v2.5.22');
  });
});
