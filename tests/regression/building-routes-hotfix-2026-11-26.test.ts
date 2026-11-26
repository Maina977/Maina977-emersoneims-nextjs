/**
 * Building API hotfix, 2026-11-26 (from the Building Suite Pro audit, c610206a).
 *
 * 1. /api/building/floor-plan no longer returns a BOQ, a cost, foundation
 *    reinforcement or an electrical main-switch size derived from a text
 *    description (they were invented: reinforcement from the floor count,
 *    main switch without the AC/heater/kitchen circuits, double-counted
 *    blocks+bricks and concrete+cement, uncited fixed prices). The layout stays.
 * 2. /api/building/quotations is retired (410), like /api/building/projects.
 * lib/building/** may only be imported by the three building routes
 * (eslint.config.mjs), so the floor-plan fix is checked through the route.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { NextRequest } from 'next/server';

describe('floor-plan API: no quantities, cost, foundation or electrical sizing from a description', () => {
  beforeAll(() => { vi.stubGlobal('fetch', () => Promise.reject(new Error('TEST: no network'))); });

  it('POST (full and json) carries none of them, and keeps the layout', async () => {
    const { POST } = await import('@/app/api/building/floor-plan/route');
    for (const outputFormat of ['full', 'json']) {
      const res = await POST(new NextRequest('http://localhost/api/building/floor-plan', { method: 'POST', body: JSON.stringify({ description: 'TEST three bedroom bungalow', outputFormat }), headers: { 'content-type': 'application/json' } }));
      const j = await res.json();
      const text = JSON.stringify(j);
      expect(j.success).toBe(true);
      expect(text).not.toMatch(/"(concrete|cement|steel)":\d/);
      expect(text).not.toMatch(/"estimatedCost":\d/);
      expect(text).not.toMatch(/Y1[26]@/);
      expect(text).not.toMatch(/"mainPanel"/);
      const plan = outputFormat === 'json' ? j.data : j.data.plan;
      expect([plan.boqSummary, plan.estimatedCost, plan.foundation, plan.electrical]).toEqual([null, null, null, null]);
      expect(plan.floorPlans.length).toBeGreaterThan(0);
      expect(Object.keys(plan.notAvailable)).toEqual(['boq', 'estimatedCost', 'foundation', 'electrical']);
      if (outputFormat === 'full') {
        expect(Object.keys(j.data.svgs).length).toBeGreaterThan(0);
        expect([j.data.boq, j.data.electrical, j.data.foundation, j.data.summary.estimatedCost]).toEqual([null, null, null, null]);
      }
    }
  });

  it('svg output is unchanged (layout only)', async () => {
    const { POST } = await import('@/app/api/building/floor-plan/route');
    const res = await POST(new NextRequest('http://localhost/api/building/floor-plan', { method: 'POST', body: JSON.stringify({ description: 'TEST three bedroom bungalow', outputFormat: 'svg' }), headers: { 'content-type': 'application/json' } }));
    const j = await res.json();
    expect(Object.values(j.data.svgs)[0]).toMatch(/^<svg|<svg/);
  });

  it('GET no longer advertises BOQ calculation or cost estimation', async () => {
    const { GET } = await import('@/app/api/building/floor-plan/route');
    const caps: string[] = (await (await GET()).json()).data.capabilities;
    expect(caps).not.toContain('BOQ calculation');
    expect(caps).not.toContain('Cost estimation');
    expect(caps).toContain('SVG floor plan rendering');
  });
});

describe('quotations API is retired: every method answers 410 Gone', () => {
  it('GET, POST, PUT, PATCH and DELETE', async () => {
    const q = await import('@/app/api/building/quotations/route');
    for (const m of [q.GET, q.POST, q.PUT, q.PATCH, q.DELETE]) {
      const res = await m();
      expect(res.status).toBe(410);
      expect(res.headers.get('cache-control')).toBe('no-store');
      expect(await res.json()).toEqual({ success: false, error: 'This quotations API has been retired for security reasons.' });
    }
  });
});

describe('review 2026-11-26 R1c: no per-room electrical points, ratings or watts from a description', () => {
  beforeAll(() => { vi.stubGlobal('fetch', () => Promise.reject(new Error('TEST: no network'))); });
  it('R1c (reviewer case): no ampere rating is given to any outlet; rooms[].electrical is null', async () => {
    const { POST } = await import('@/app/api/building/floor-plan/route');
    const res = await POST(new NextRequest('http://localhost/api/building/floor-plan', { method: 'POST', body: JSON.stringify({ description: 'TEST family house with garden and a large kitchen', outputFormat: 'json' }), headers: { 'content-type': 'application/json' } }));
    const j = await res.json();
    const ratings: Record<string, number> = {};
    let rooms = 0;
    for (const f of j.data.floorPlans) for (const r of f.rooms) {
      rooms++;
      expect(r.electrical).toBeNull();
      for (const o of r.electrical?.outlets ?? []) if (/\d+\s*A$/i.test(String(o.type))) ratings[`${r.type}:${o.type}`] = (ratings[`${r.type}:${o.type}`] ?? 0) + 1;
    }
    expect(rooms).toBeGreaterThan(0);
    expect(Object.keys(ratings), 'outlet ampere ratings returned').toEqual([]);
    expect(JSON.stringify(j.data)).not.toMatch(/"(15A|30A|13A)"|"watts":\d/);
    expect(j.data.notAvailable.electrical).toMatch(/qualified person/);
  });
  it('the SVG draws no socket or light symbols (they were drawn in bathrooms)', async () => {
    const { POST } = await import('@/app/api/building/floor-plan/route');
    const res = await POST(new NextRequest('http://localhost/api/building/floor-plan', { method: 'POST', body: JSON.stringify({ description: 'TEST family house with garden', outputFormat: 'svg' }), headers: { 'content-type': 'application/json' } }));
    const svgs = Object.values((await res.json()).data.svgs as Record<string, string>);
    expect(svgs.length).toBeGreaterThan(0);
    for (const s of svgs) { expect(s).not.toMatch(/fill="#f59e0b"/); expect(s).not.toMatch(/stroke="#fbbf24"/); }
  });
  it('GET no longer advertises electrical layout generation', async () => {
    const { GET } = await import('@/app/api/building/floor-plan/route');
    expect((await (await GET()).json()).data.capabilities).not.toContain('Electrical layout generation');
  });
});

describe('model-3d: the foundation box is illustrative, not a depth chosen from the floor count', () => {
  beforeAll(() => { vi.stubGlobal('fetch', () => Promise.reject(new Error('TEST: no network'))); });
  it('same 0.3 m concept plinth for 1 and 3 floors (was 1.0 m and 1.5 m), labelled illustrative', async () => {
    const { POST } = await import('@/app/api/building/model-3d/route');
    const depth: Record<number, number> = {};
    for (const floors of [1, 3]) {
      const res = await POST(new NextRequest('http://localhost/api/building/model-3d', { method: 'POST', body: JSON.stringify({ description: 'TEST family house with garden', floors }), headers: { 'content-type': 'application/json' } }));
      const j = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const f = j.data.model.meshes.find((m: any) => m.id === 'foundation');
      expect(f.name).toMatch(/illustrative only/);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ys = f.vertices.map((v: any) => v.y + f.position.y);
      depth[floors] = Math.round((Math.max(...ys) - Math.min(...ys)) * 1000) / 1000;
      expect(JSON.stringify(j)).not.toMatch(/Y1[26]@|mainPanel|MCB|boqSummary|estimatedCost|reinforcement/);
    }
    expect(depth).toEqual({ 1: 0.3, 3: 0.3 });
  });
});

describe('suppliers API is retired: every method answers 410 Gone', () => {
  it('GET, POST, PUT, PATCH and DELETE', async () => {
    const s = await import('@/app/api/building/suppliers/route');
    for (const m of [s.GET, s.POST, s.PUT, s.PATCH, s.DELETE]) {
      const res = await m();
      expect(res.status).toBe(410);
      expect(await res.json()).toEqual({ success: false, error: 'This suppliers API has been retired for security reasons.' });
    }
  });
});

describe('quotations PATCH generate-pdf action is retired too', () => {
  it('PATCH with {action: "generate-pdf"} answers 410 (the handler ignores the request)', async () => {
    const q = await import('@/app/api/building/quotations/route');
    const patch = q.PATCH as unknown as (r: NextRequest) => Promise<Response>;
    const res = await patch(new NextRequest('http://localhost/api/building/quotations', { method: 'PATCH', body: JSON.stringify({ id: 'TEST', action: 'generate-pdf' }), headers: { 'content-type': 'application/json' } }));
    expect(res.status).toBe(410);
  });
});
