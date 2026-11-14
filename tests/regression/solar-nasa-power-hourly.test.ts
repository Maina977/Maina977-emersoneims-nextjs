import { describe, it, expect } from 'vitest';
import { parsePowerHourly, fetchPowerHourly, hourlyUrl } from '@/lib/solar/design/nasaPowerHourly';
import { simulateHourly } from '@/lib/solar/design/hourly';
import { PVWATTS_DEFAULT_LOSSES } from '@/lib/solar/design/production';

// A synthetic POWER-shaped body (keys YYYYMMDDHH). Not real NASA data.
function body(year: number, holeAt?: string) {
  const ghi: Record<string, number> = {}, t2m: Record<string, number> = {};
  for (let ms = Date.UTC(year, 0, 1); ms < Date.UTC(year + 1, 0, 1); ms += 3600000) {
    const d = new Date(ms), h = d.getUTCHours();
    const k = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}${String(h).padStart(2, '0')}`;
    // Nairobi-ish: daylight 03–15 UTC
    ghi[k] = h >= 3 && h <= 15 ? Math.round(900 * Math.sin(((h - 3 + 0.5) / 13) * Math.PI)) : 0;
    t2m[k] = 18 + 6 * Math.sin(((h - 6) / 24) * 2 * Math.PI);
  }
  if (holeAt) ghi[holeAt] = -999;
  return { properties: { parameter: { ALLSKY_SFC_SW_DWN: ghi, T2M: t2m } } };
}

describe('NASA POWER hourly → hourly PV engine', () => {
  it('a full year parses to 8760 ordered hours and runs through simulateHourly', () => {
    const w = parsePowerHourly(body(2025), 2025);
    expect(w.status).toBe('OK');
    if (w.status !== 'OK') return;
    expect(w.hours).toBe(8760);
    expect(w.start).toBe('2025-01-01T00:30:00.000Z');
    const r = simulateHourly({
      site: { latDeg: -1.29, lonDeg: 36.82, tiltDeg: 10, azimuthDeg: 0 }, start: w.start, ghiWm2: w.ghiWm2, tempC: w.tempC, weatherSource: w.source,
      array: { dcKw: 10, gammaPmaxPct: -0.35, noctC: 45 }, inverter: { acKw: 10, nominalEfficiency: 0.96 }, losses: PVWATTS_DEFAULT_LOSSES, lossesSource: 'PVWatts v5 defaults',
    });
    expect(r.hourlyAcKwh).toHaveLength(8760);
    expect(r.annualKwh).toBeGreaterThan(10000);
    expect(r.assumptions[0]).toMatch(/NASA POWER hourly/);
  });
  it('one missing hour → INSUFFICIENT EVIDENCE with the count (never filled)', () => {
    const w = parsePowerHourly(body(2025, '2025061012'), 2025);
    expect(w).toMatchObject({ status: 'INSUFFICIENT EVIDENCE', missingHours: 1 });
  });
  it('upstream failure → SERVICE UNAVAILABLE; current or future year refused', async () => {
    expect((await fetchPowerHourly(-1.29, 36.82, 2025, (async () => new Response('', { status: 500 })) as unknown as typeof fetch)).status).toBe('SERVICE UNAVAILABLE');
    expect((await fetchPowerHourly(-1.29, 36.82, new Date().getUTCFullYear(), fetch)).status).toBe('INSUFFICIENT EVIDENCE');
  });
  it('requests UTC, community RE, 4-decimal coordinates', () => {
    const u = hourlyUrl(-1.292066, 36.821946, 2025);
    expect(u).toMatch(/time-standard=UTC/);
    expect(u).toMatch(/community=RE/);
    expect(u).toMatch(/latitude=-1\.2921/);
  });
});
