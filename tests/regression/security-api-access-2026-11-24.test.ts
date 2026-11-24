/**
 * Security review 2026-11-24: Generator Oracle account routes act only for the
 * signed-in user; team changes stay inside the caller's organisation; the
 * unauthenticated projects API and the legacy SHA-256 sign-in are retired.
 * The real route handlers and the real validateSession run against a fake
 * database pool that records every query. TEST data only.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

interface U { id: number; role: string; organization_id: number | null }
const db = {
  users: new Map<number, U>(),
  sessions: new Map<string, number>(),
  queries: [] as Array<{ sql: string; params: unknown[] }>,
};
const fakePool = {
  async query(sql: string, params: unknown[] = []) {
    db.queries.push({ sql, params });
    if (/FROM oracle_sessions s/.test(sql)) {
      const uid = db.sessions.get(String(params[0]));
      const u = uid ? db.users.get(uid) : undefined;
      if (!u) return { rows: [], rowCount: 0 };
      return { rows: [{ ...u, email: `u${u.id}@test.example`, name: `TEST ${u.id}`, phone: null, license_key: null, is_active: true, created_at: new Date(), last_login: null, avatar_url: null, expires_at: new Date(Date.now() + 3600e3) }], rowCount: 1 };
    }
    if (/FROM oracle_users WHERE id = ANY/.test(sql)) {
      const ids = (params[0] as number[]).map(Number);
      return { rows: ids.map((i) => db.users.get(i)).filter(Boolean), rowCount: 0 };
    }
    if (/UPDATE oracle_users SET (role|is_active)/.test(sql)) {
      const u = db.users.get(Number(params[0]));
      const org = /SET role/.test(sql) ? params[2] : params[1];
      const hit = !!u && u.organization_id === org;
      if (hit && /SET role/.test(sql)) u!.role = String(params[1]);
      return { rows: hit ? [{ id: u!.id }] : [], rowCount: hit ? 1 : 0 };
    }
    return { rows: [], rowCount: 0 };
  },
};
vi.mock('@/lib/db', () => ({ getPostgresPool: async () => fakePool }));

const req = (url: string, init: { method?: string; body?: unknown; session?: string } = {}) =>
  new NextRequest(`https://site.test${url}`, {
    method: init.method ?? 'GET',
    headers: { 'content-type': 'application/json', ...(init.session ? { cookie: `oracle_session=${init.session}` } : {}) },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

beforeEach(() => {
  db.users.clear(); db.sessions.clear(); db.queries.length = 0;
  db.users.set(1, { id: 1, role: 'viewer', organization_id: 10 });
  db.users.set(2, { id: 2, role: 'viewer', organization_id: 10 });
  db.users.set(3, { id: 3, role: 'manager', organization_id: 10 });
  db.users.set(4, { id: 4, role: 'admin', organization_id: 10 });
  db.users.set(5, { id: 5, role: 'viewer', organization_id: 20 }); // another organisation
  db.users.set(6, { id: 6, role: 'admin', organization_id: 20 });
  db.sessions.set('tok-1', 1); db.sessions.set('tok-3', 3); db.sessions.set('tok-4', 4); db.sessions.set('tok-6', 6);
});

describe('Oracle subscription: only the signed-in user, never a userId from the URL', () => {
  it('public plan list still works without signing in', async () => {
    const { GET } = await import('@/app/api/generator-oracle/subscription/route');
    const r = await GET(req('/api/generator-oracle/subscription?action=plans'));
    expect(r.status).toBe(200);
    expect((await r.json()).plans).toBeDefined();
  });
  it('payment history: 401 without a session, 403 for another user, own history for the signed-in user', async () => {
    const { GET } = await import('@/app/api/generator-oracle/subscription/route');
    expect((await GET(req('/api/generator-oracle/subscription?action=payments&userId=2'))).status).toBe(401);
    expect((await GET(req('/api/generator-oracle/subscription?action=payments&userId=2', { session: 'tok-1' }))).status).toBe(403);
    const before = db.queries.length;
    const own = await GET(req('/api/generator-oracle/subscription?action=payments&userId=1', { session: 'tok-1' }));
    expect(own.status).toBe(200);
    const payQ = db.queries.slice(before).find((q) => /oracle_payments/.test(q.sql));
    expect(payQ?.params[0]).toBe(1);
    // No query ever ran for user 2's payments.
    expect(db.queries.some((q) => /oracle_payments/.test(q.sql) && q.params[0] === 2)).toBe(false);
  });
  it('cancel / increment / activate: 401 without a session, 403 for another user', async () => {
    const { POST } = await import('@/app/api/generator-oracle/subscription/route');
    for (const action of ['cancel', 'increment-usage', 'activate-free']) {
      expect((await POST(req('/api/generator-oracle/subscription', { method: 'POST', body: { action, userId: 2, type: 'diagnosis' } }))).status).toBe(401);
      expect((await POST(req('/api/generator-oracle/subscription', { method: 'POST', body: { action, userId: 2, type: 'diagnosis' }, session: 'tok-1' }))).status).toBe(403);
    }
  });
});

describe('M-Pesa prompts and push subscriptions: only for the signed-in user', () => {
  it('pay: 401 without a session, 403 for another user (no prompt can be sent to an arbitrary phone)', async () => {
    const { POST } = await import('@/app/api/generator-oracle/payments/mpesa/route');
    const body = { action: 'pay', userId: 2, planId: 'pro', phoneNumber: '0712345678' };
    expect((await POST(req('/api/generator-oracle/payments/mpesa', { method: 'POST', body }))).status).toBe(401);
    expect((await POST(req('/api/generator-oracle/payments/mpesa', { method: 'POST', body, session: 'tok-1' }))).status).toBe(403);
  });
  it('subscribe: linking a device to a user needs that user signed in; anonymous devices still allowed', async () => {
    const { POST } = await import('@/app/api/generator-oracle/notifications/subscribe/route');
    const sub = { endpoint: 'https://push.test/e1', keys: { p256dh: 'TEST', auth: 'TEST' } };
    expect((await POST(req('/api/generator-oracle/notifications/subscribe', { method: 'POST', body: { subscription: sub, userId: 2 } }))).status).toBe(401);
    expect((await POST(req('/api/generator-oracle/notifications/subscribe', { method: 'POST', body: { subscription: sub, userId: 2 }, session: 'tok-1' }))).status).toBe(403);
    await POST(req('/api/generator-oracle/notifications/subscribe', { method: 'POST', body: { subscription: sub } }));
    const ins = db.queries.find((q) => /INSERT INTO oracle_push_subscriptions/.test(q.sql));
    expect(ins?.params[3]).toBeNull();
  });
});

describe('Oracle team changes stay inside the caller organisation', () => {
  it('deactivate: cross-organisation refused; managers cannot deactivate admins; same-organisation works', async () => {
    const { POST } = await import('@/app/api/generator-oracle/team/deactivate/route');
    const call = (session: string, userId: number) => POST(req('/api/generator-oracle/team/deactivate', { method: 'POST', body: { userId }, session }));
    expect((await call('tok-4', 5)).status).toBe(500); // admin of org 10 → user of org 20: refused
    expect(db.queries.some((q) => /DELETE FROM oracle_sessions/.test(q.sql) && q.params[0] === 5)).toBe(false);
    expect((await call('tok-3', 4)).status).toBe(500); // manager → admin: refused
    expect((await call('tok-4', 2)).status).toBe(200); // admin → same-organisation viewer
  });
  it('update-role: cross-organisation refused; managers cannot change admins or create admins', async () => {
    const { POST } = await import('@/app/api/generator-oracle/team/update-role/route');
    const call = (session: string, userId: number, role: string) => POST(req('/api/generator-oracle/team/update-role', { method: 'POST', body: { userId, role }, session }));
    expect((await call('tok-6', 2, 'viewer')).status).not.toBe(200); // org 20 admin → org 10 user
    expect(db.users.get(2)!.role).toBe('viewer');
    expect((await call('tok-3', 4, 'viewer')).status).not.toBe(200); // manager demoting an admin
    expect(db.users.get(4)!.role).toBe('admin');
    expect((await call('tok-3', 2, 'admin')).status).not.toBe(200); // manager creating an admin
    expect((await call('tok-4', 2, 'manager')).status).toBe(200);
    expect(db.users.get(2)!.role).toBe('manager');
  });
});

describe('retired routes answer 410 Gone', () => {
  it('projects API (all methods) and legacy sign-in / sign-up', async () => {
    const p = await import('@/app/api/building/projects/route');
    for (const m of [p.GET, p.POST, p.PUT, p.DELETE]) expect((await m()).status).toBe(410);
    const l = await import('@/app/api/auth/login/route');
    const s = await import('@/app/api/auth/signup/route');
    expect((await l.POST()).status).toBe(410);
    expect((await s.POST()).status).toBe(410);
  });
});
