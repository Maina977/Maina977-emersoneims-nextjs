/**
 * Lead stages and the admin sign-in (master brief §10, audit §7).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LEAD_STAGES, parseLeadUpdate, buildLeadUpdateSql, isLeadStage } from '@/lib/leads/stages';

const KEY = 'test-admin-key-0123456789abcdef';

describe('lead stages', () => {
  it('has the brief stages, all fitting the VARCHAR(20) column', () => {
    expect(LEAD_STAGES.map((s) => s.id)).toEqual(['new', 'contacted', 'qualified', 'site_survey', 'quoting', 'quoted', 'follow_up', 'negotiating', 'won', 'lost', 'duplicate', 'spam']);
    for (const s of LEAD_STAGES) expect(s.id.length).toBeLessThanOrEqual(20);
    expect(isLeadStage('won')).toBe(true);
    expect(isLeadStage('deleted')).toBe(false);
  });

  it('validates updates', () => {
    expect(parseLeadUpdate({ id: 3, status: 'quoted', notes: '  sent by email ' })).toEqual({ ok: true, id: 3, update: { status: 'quoted', notes: 'sent by email' } });
    expect(parseLeadUpdate({ id: 0, status: 'won' }).ok).toBe(false);
    expect(parseLeadUpdate({ id: 3, status: 'drop table' }).ok).toBe(false);
    expect(parseLeadUpdate({ id: 3, estimatedValue: -5 }).ok).toBe(false);
    expect(parseLeadUpdate({ id: 3 }).ok).toBe(false);
    expect(parseLeadUpdate(null).ok).toBe(false);
  });

  it('builds a parameterised UPDATE that never deletes and stamps the dates', () => {
    const q = buildLeadUpdateSql(7, { status: 'won', notes: "o'brien" });
    expect(q.text).toMatch(/^UPDATE leads SET status = \$1, first_contacted_at = COALESCE\(first_contacted_at, NOW\(\)\), last_contacted_at = NOW\(\), converted_at = COALESCE\(converted_at, NOW\(\)\), notes = \$2, updated_at = NOW\(\) WHERE id = \$3 RETURNING id, status$/);
    expect(q.values).toEqual(['won', "o'brien", 7]);
    expect(q.text).not.toMatch(/DELETE|DROP/i);
    expect(buildLeadUpdateSql(7, { status: 'new' }).text).not.toMatch(/contacted_at/);
  });
});

describe('admin sign-in and lead API', () => {
  beforeEach(() => { vi.stubEnv('ADMIN_API_KEY', KEY); vi.resetModules(); });
  afterEach(() => vi.unstubAllEnvs());

  const post = (key: string, ip = '10.0.0.1', origin = 'http://localhost') =>
    new NextRequest('http://localhost/api/admin/session', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip, origin },
      body: JSON.stringify({ key }),
    });

  it('sets a secure session cookie only for the right key', async () => {
    const { POST } = await import('@/app/api/admin/session/route');
    expect((await POST(post('wrong', '10.0.0.2'))).status).toBe(401);
    const ok = await POST(post(KEY, '10.0.0.3'));
    expect(ok.status).toBe(200);
    const cookie = ok.headers.get('set-cookie') || '';
    expect(cookie).toMatch(/admin_session=/);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=strict/i);
    expect(cookie).toMatch(/Max-Age=28800/);
  });

  it('refuses cross-site sign-in and limits attempts to 5 per 10 minutes', async () => {
    const { POST } = await import('@/app/api/admin/session/route');
    expect((await POST(post(KEY, '10.0.0.4', 'https://evil.example'))).status).toBe(403);
    for (let i = 0; i < 5; i++) expect((await POST(post('nope', '10.0.0.9'))).status).toBe(401);
    expect((await POST(post(KEY, '10.0.0.9'))).status).toBe(429);
  });

  it('the lead API is a plain 404 without the key, and PATCH needs a same-site origin', async () => {
    const { GET, PATCH } = await import('@/app/api/admin/leads/route');
    expect((await GET(new NextRequest('http://localhost/api/admin/leads'))).status).toBe(404);
    const cross = new NextRequest('http://localhost/api/admin/leads', {
      method: 'PATCH',
      headers: { cookie: `admin_session=${KEY}`, origin: 'https://evil.example', 'content-type': 'application/json' },
      body: JSON.stringify({ id: 1, status: 'won' }),
    });
    expect((await PATCH(cross)).status).toBe(403);
    const bad = new NextRequest('http://localhost/api/admin/leads', {
      method: 'PATCH',
      headers: { authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ id: 1, status: 'drop' }),
    });
    expect((await PATCH(bad)).status).toBe(400);
  });

  it('middleware lets /admin/login through and keeps /admin/leads gated', () => {
    const mw = readFileSync(join(__dirname, '..', '..', 'middleware.ts'), 'utf8');
    expect(mw).toMatch(/if \(pathname === '\/admin\/login' \|\| pathname === '\/admin\/login\/'\) return false;/);
    expect(mw).toMatch(/pathname === '\/admin' \|\| pathname\.startsWith\('\/admin\/'\)/);
  });
});
