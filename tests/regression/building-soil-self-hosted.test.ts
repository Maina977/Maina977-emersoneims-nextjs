import { describe, it, expect, vi, afterEach } from 'vitest';
import { soilAt } from '@/lib/aquascan-soil/kenyaSoil';

// P1 2026-11-14: Building soil reads the self-hosted SoilGrids 2.0 1 km Kenya
// extract first (no network; ISRIC's REST service is paused), then REST, then
// INSUFFICIENT EVIDENCE. The depth (0-30 cm) is stated, never passed off as 30-60 cm.

afterEach(() => { vi.unstubAllGlobals(); });

async function soil(lat: number, lon: number) {
  vi.resetModules();
  const { POST } = await import('@/app/api/building/soil/route');
  const { NextRequest } = await import('next/server');
  const r = await POST(new NextRequest('http://x/api/building/soil', { method: 'POST', body: JSON.stringify({ latitude: lat, longitude: lon }) }));
  return { status: r.status, j: await r.json() };
}

describe('building soil from the self-hosted extract', () => {
  it('Kenyan point: answered offline from the extract, values equal soilAt, depth stated as 0-30 cm', async () => {
    const net = vi.fn(async () => new Response('', { status: 503 }));
    vi.stubGlobal('fetch', net);
    const [lat, lon] = [1.0157, 35.0062]; // Kitale: fully mapped cell (OK)
    const ref = soilAt(lat, lon).mean0to30;
    const { status, j } = await soil(lat, lon);
    expect(status).toBe(200);
    expect(net).not.toHaveBeenCalled();
    expect(j.data.source).toMatch(/self-hosted 1 km Kenya extract/);
    expect(j.data.depths).toMatch(/^0-30 cm/);
    const sum = (ref.clay as number) + (ref.sand as number) + (ref.silt as number);
    const k = Math.abs(sum - 100) > 5 ? 100 / sum : 1; // the route normalises texture only when it is off by > 5 %
    expect(j.data.properties.clay).toBeCloseTo((ref.clay as number) * k, 1);
    expect(j.data.bearingCapacity).toBeNull();
    expect(j.data.waterTable).toBeNull();
  });
  it('masked cell (e.g. water/urban) with REST down → INSUFFICIENT EVIDENCE, with the reason', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 503 })));
    const { status, j } = await soil(-2.126172, 41.508316);
    expect(status).toBe(503);
    expect(j.error).toMatch(/No soil mapped in this cell/);
  });
  it('outside Kenya with REST down → INSUFFICIENT EVIDENCE', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 503 })));
    const { status, j } = await soil(9.0, 7.5);
    expect(status).toBe(503);
    expect(j.error).toMatch(/INSUFFICIENT EVIDENCE/);
  });
});
