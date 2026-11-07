/**
 * Re-audit 7 Nov 2026, item 10: form submission, email routing and WhatsApp
 * fallback, tested end to end through the real /api/contact handler with
 * every outbound channel stubbed, so nothing is emailed, texted or stored.
 *
 * Why not POST to a running server: with no SMTP/Resend keys the route falls
 * back to formsubmit.co, which would send a real email to the sales inbox.
 */
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const sendMail = vi.fn(async () => ({ messageId: 'test' }));
vi.mock('nodemailer', () => ({ default: { createTransport: () => ({ sendMail }) }, createTransport: () => ({ sendMail }) }));
vi.mock('@/lib/db', () => ({ getPostgresPool: async () => null }));

const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: 'true' }), { status: 200 }));

type Post = (req: import('next/server').NextRequest) => Promise<Response>;
let POST: Post;
let NextRequest: typeof import('next/server').NextRequest;
let ip = 0;

beforeAll(async () => {
  vi.stubEnv('SMTP_HOST', 'smtp.invalid');
  vi.stubEnv('SMTP_USER', 'leads@invalid');
  vi.stubEnv('SMTP_PASSWORD', 'not-a-secret');
  vi.stubGlobal('fetch', fetchMock);
  ({ NextRequest } = await import('next/server'));
  ({ POST } = (await import('@/app/api/contact/route')) as unknown as { POST: Post });
});

beforeEach(() => {
  sendMail.mockClear();
  fetchMock.mockClear();
});

function req(body: Record<string, unknown>) {
  ip += 1; // a fresh client IP per request keeps the per-IP rate limiter out of the way
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `203.0.113.${ip}` },
    body: JSON.stringify(body),
  });
}

const TEST = { name: 'Test Buyer', email: 'test.buyer@example.com', phone: '+254700000000' };
const recipients = () => (sendMail.mock.calls as unknown as Array<[{ to: string }]>).map((c) => c[0].to).join(', ');

describe('/api/contact', () => {
  it('routes a generator enquiry to info@ and generators@, not solar@', async () => {
    const res = await POST(req({ ...TEST, service: 'generators', source: 'generator_quote', message: 'Quote for a 200 kVA silent set please.' }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(recipients()).toMatch(/info@emersoneims\.com/);
    expect(recipients()).toMatch(/generators@emersoneims\.com/);
    expect(recipients()).not.toMatch(/solar@/);
  });

  it('routes a solar enquiry to info@ and solar@', async () => {
    await POST(req({ ...TEST, service: 'solar', source: 'solar_quote', message: 'Quote for a 10 kW hybrid system.' }));
    expect(recipients()).toMatch(/info@emersoneims\.com/);
    expect(recipients()).toMatch(/solar@emersoneims\.com/);
    expect(recipients()).not.toMatch(/generators@/);
  });

  it('returns a WhatsApp fallback to the company number carrying the message', async () => {
    const json = await (await POST(req({ ...TEST, service: 'general', message: 'Borehole pump not delivering water.' }))).json();
    expect(json.whatsappFallback).toMatch(/^https:\/\/wa\.me\/254768860665\?text=/);
    expect(decodeURIComponent(json.whatsappFallback)).toContain('Borehole pump not delivering water.');
  });

  it('accepts a honeypot submission silently and notifies nobody', async () => {
    const json = await (await POST(req({ ...TEST, message: 'spam', company_website: 'http://spam.example' }))).json();
    expect(json.success).toBe(true);
    expect(sendMail).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a missing field and a bad email address without notifying anyone', async () => {
    expect((await POST(req({ name: 'A', email: 'a@example.com' }))).status).toBe(400);
    expect((await POST(req({ ...TEST, email: 'not-an-email', message: 'x' }))).status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('never reaches the network: every outbound call went to the stub', async () => {
    await POST(req({ ...TEST, service: 'generators', message: 'Service visit for a Perkins set.' }));
    for (const call of fetchMock.mock.calls as unknown as Array<[string]>) {
      expect(String(call[0])).toMatch(/^https:\/\/(formsubmit\.co|api\.resend\.com|api\.africastalking\.com|graph\.facebook\.com|api\.callmebot\.com)/);
    }
  });
});

describe('WhatsApp links', () => {
  it('every hard-coded wa.me number on the site is one of the two company numbers', () => {
    const root = join(__dirname, '..', '..');
    const found = new Set<string>();
    const walk = (d: string) => {
      for (const n of readdirSync(d)) {
        if (n === 'node_modules' || n.startsWith('.')) continue;
        const p = join(d, n);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.(tsx?|jsx?)$/.test(n)) for (const m of readFileSync(p, 'utf8').matchAll(/wa\.me\/(\d{9,15})/g)) found.add(m[1]);
      }
    };
    for (const d of ['app', 'components', 'lib']) walk(join(root, d));
    expect([...found].sort()).toEqual(['254768860665', '254782914717']);
  });
});
