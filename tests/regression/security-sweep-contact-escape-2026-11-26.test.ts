/**
 * Security sweep 2026-11-26: caller input is HTML-escaped in the staff lead
 * email from /api/contact. Real handler, every channel stubbed (nodemailer
 * mocked, fetch stubbed, no database), so nothing is emailed, texted or
 * stored. Same setup as tests/api/contact-route.test.ts.
 */
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

const sendMail = vi.fn(async (..._a: unknown[]) => ({ messageId: 'test' }));
vi.mock('nodemailer', () => ({ default: { createTransport: () => ({ sendMail }) }, createTransport: () => ({ sendMail }) }));
vi.mock('@/lib/db', () => ({ getPostgresPool: async () => null }));
const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: 'true' }), { status: 200 }));

type Post = (req: import('next/server').NextRequest) => Promise<Response>;
let POST: Post;
let NextRequest: typeof import('next/server').NextRequest;
let ip = 0;

beforeAll(async () => {
  vi.stubEnv('VERCEL_ENV', 'production');
  vi.stubEnv('SMTP_HOST', 'smtp.invalid');
  vi.stubEnv('SMTP_USER', 'leads@invalid');
  vi.stubEnv('SMTP_PASSWORD', 'not-a-secret');
  vi.stubGlobal('fetch', fetchMock);
  ({ NextRequest } = await import('next/server'));
  ({ POST } = (await import('@/app/api/contact/route')) as unknown as { POST: Post });
});
beforeEach(() => { sendMail.mockClear(); fetchMock.mockClear(); });

const req = (body: Record<string, unknown>) => {
  ip += 1;
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `203.0.113.${100 + ip}` },
    body: JSON.stringify(body),
  });
};

describe('/api/contact staff email: caller input is inert text', () => {
  it('markup in name, company, location and message is escaped; the lead still goes out', async () => {
    const res = await POST(req({
      name: 'TEST <img src=x onerror=alert(1)>',
      email: 'test.buyer@example.com',
      phone: '+254700000000',
      company: '<b>ACME</b>',
      location: '"><script>x()</script>',
      service: 'generators',
      message: 'Hello <a href="https://phish.example/invoice">Invoice overdue - click</a>\nsecond line',
    }));
    expect(res.status).toBe(200);
    expect(sendMail).toHaveBeenCalled();
    const htmls = (sendMail.mock.calls as unknown as Array<[{ html?: string }]>).map((c) => c[0].html || '').join('\n');
    expect(htmls).not.toMatch(/<a href="https:\/\/phish/);
    expect(htmls).not.toMatch(/<img src=x/);
    expect(htmls).not.toMatch(/<script>/);
    expect(htmls).not.toMatch(/<b>ACME<\/b>/);
    expect(htmls).toContain('&lt;a href=&quot;https://phish.example/invoice&quot;&gt;');
    expect(htmls).toContain('second line'); // line breaks still rendered
    expect(htmls).toContain('<br>');
  });
  it('an unmapped service value is escaped too', async () => {
    await POST(req({ name: 'TEST Buyer', email: 'test.buyer@example.com', message: 'Need a quote for maintenance please.', service: '<i>odd</i>' }));
    const htmls = (sendMail.mock.calls as unknown as Array<[{ html?: string }]>).map((c) => c[0].html || '').join('\n');
    expect(htmls).not.toMatch(/<i>odd<\/i>/);
  });
});
