/**
 * Management decision 2026-11-13, item 3: no preview or test activity may
 * email real customers, the sales inbox or external contacts. Live delivery
 * runs only when VERCEL_ENV is 'production' (lib/env/liveDelivery.ts).
 * Every transport is stubbed here, so a failure of this test sends nothing.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const sendMail = vi.fn(async () => ({ messageId: 'test' }));
vi.mock('nodemailer', () => ({ default: { createTransport: () => ({ sendMail }) }, createTransport: () => ({ sendMail }) }));
// Only the INSERT returns a row, so the duplicate check sees no earlier enquiry.
const poolQuery = vi.fn(async (sql: string) => (/insert/i.test(String(sql)) ? { rows: [{ id: 1 }] } : { rows: [] }));
vi.mock('@/lib/db', () => ({ getPostgresPool: async () => ({ query: poolQuery }) }));
const fetchMock = vi.fn(async () => new Response('{"success":"true"}', { status: 200 }));

let n = 0;
async function postContact() {
  vi.resetModules();
  const { NextRequest } = await import('next/server');
  const { POST } = await import('@/app/api/contact/route');
  n += 1;
  return POST(new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `198.51.100.${n}` },
    body: JSON.stringify({ name: 'Preview Tester', email: 'tester@example.com', phone: '+254700000000', service: 'generators', message: 'Preview test enquiry about a 100 kVA generator.' }),
  }));
}

describe('form delivery outside production', () => {
  beforeEach(() => {
    sendMail.mockClear(); fetchMock.mockClear(); poolQuery.mockClear();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('SMTP_HOST', 'smtp.invalid'); vi.stubEnv('SMTP_USER', 'x@invalid'); vi.stubEnv('SMTP_PASSWORD', 'not-a-secret');
    vi.stubEnv('RESEND_API_KEY', 'not-a-key'); vi.stubEnv('LEAD_WEBHOOK_URL', 'https://example.invalid/hook');
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it.each([['preview'], ['development'], [undefined]])('VERCEL_ENV=%s: clearly marked mock; nothing emailed, fetched or stored', async (envName) => {
    if (envName === undefined) vi.stubEnv('VERCEL_ENV', ''); else vi.stubEnv('VERCEL_ENV', envName);
    const res = await postContact();
    const json = await res.json();
    expect(json).toMatchObject({ success: true, mock: true, delivered: false });
    expect(json.message).toMatch(/nothing was sent and nothing was stored/);
    expect(sendMail).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled(); // no FormSubmit, Resend, webhook, SMS or WhatsApp call
    expect(poolQuery).not.toHaveBeenCalled(); // no lead written
  });

  it('production still delivers (through the stubbed transports)', async () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    const res = await postContact();
    const json = await res.json();
    expect(json.mock).toBeUndefined();
    expect(sendMail.mock.calls.length + fetchMock.mock.calls.length).toBeGreaterThan(0);
  });

  it('the order-email service refuses outside production', async () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.resetModules();
    const { sendEmail } = await import('@/lib/email/emailService');
    const r = await sendEmail({ to: 'customer@example.com', template: 'order_confirmation', data: { orderNumber: 'T1' } });
    expect(r.success).toBe(false);
    expect(r.error).toMatch(/test environment/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('the notification routes refuse outside production', async () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.resetModules();
    const { NextRequest } = await import('next/server');
    for (const path of ['@/app/api/notifications/route', '@/app/api/notifications/new-lead/route']) {
      const { POST } = await import(path);
      const res = await POST(new NextRequest('http://localhost/x', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }));
      expect((await res.json()).mock).toBe(true);
    }
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });
});
