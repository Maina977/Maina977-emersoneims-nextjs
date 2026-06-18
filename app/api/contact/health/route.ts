/**
 * LEAD-DELIVERY DIAGNOSTICS
 * =========================
 * Admin-gated endpoint that makes the lead pipeline VISIBLE. Customers reported
 * quotation enquiries never arriving; the cause is almost always a delivery
 * channel that is silently unconfigured (or a tunnel that's down) in production.
 * This route actively PROBES every channel and reports, per channel:
 *   - configured: are the required env vars present?
 *   - ok:         did an active connectivity check succeed (where one is possible)?
 *   - detail:     a short human explanation / next action.
 * It NEVER returns secret values — only booleans and statuses.
 *
 * Auth: pass `?token=…` (or `Authorization: Bearer …`) matching LEAD_DIAG_TOKEN,
 * falling back to ADMIN_API_KEY. With neither configured the route refuses (401),
 * so diagnostics can never leak by misconfiguration.
 *
 * Optional end-to-end test: `?send=1` submits a clearly-marked TEST lead through
 * the real /api/contact pipeline and returns whether it was delivered. Use this
 * to confirm a live lead actually reaches a human channel.
 *
 *   GET /api/contact/health?token=…           → probe configuration + connectivity
 *   GET /api/contact/health?token=…&send=1     → also run a real end-to-end test lead
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPostgresPool } from '@/lib/db';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE: Record<string, string> = { 'Cache-Control': 'no-store, max-age=0' };

// Per-process cooldown between real `?send=1` test-lead submissions.
const TEST_SEND_COOLDOWN_MS = 30_000;
let lastTestSendAt = 0;

function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

/** Constant-time compare — no early exit, equal-length guard. */
function safeEqual(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function authorize(request: NextRequest): boolean {
  const expected = process.env.LEAD_DIAG_TOKEN || process.env.ADMIN_API_KEY || '';
  if (!expected) return false; // never serve diagnostics without a configured secret
  const fromQuery = request.nextUrl.searchParams.get('token') || '';
  const header = request.headers.get('authorization') || '';
  const fromBearer = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  return safeEqual(fromQuery, expected) || safeEqual(fromBearer, expected);
}

type Channel = { configured: boolean; ok: boolean | null; detail: string };

/** Database: reachable? how many leads recently? (proves leads are landing). */
async function probeDb(): Promise<Channel & { leads?: Record<string, number> }> {
  const hasUrl = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);
  if (!hasUrl) {
    return {
      configured: false,
      ok: false,
      detail: 'Set DATABASE_URL (or POSTGRES_URL) in Vercel — without it leads are never stored.',
    };
  }
  try {
    const pool = await getPostgresPool();
    if (!pool) {
      return { configured: true, ok: false, detail: 'DATABASE_URL set but the pool could not connect.' };
    }
    const counts = await pool
      .query(
        `SELECT
           COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') AS d1,
           COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')  AS d7,
           COUNT(*) AS total
         FROM leads`,
      )
      .catch(() => null);
    const leads = counts?.rows?.[0]
      ? {
          last_24h: Number(counts.rows[0].d1) || 0,
          last_7d: Number(counts.rows[0].d7) || 0,
          total: Number(counts.rows[0].total) || 0,
        }
      : { last_24h: 0, last_7d: 0, total: 0 };
    return { configured: true, ok: true, detail: 'Connected. Leads are being persisted.', leads };
  } catch (e) {
    return { configured: true, ok: false, detail: `DB error: ${(e as Error).message}` };
  }
}

/** Own SMTP server (mail.emersoneims.com) — actually logs in to verify creds. */
async function probeSmtp(): Promise<Channel> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) {
    return {
      configured: false,
      ok: false,
      detail: 'Set SMTP_HOST / SMTP_USER / SMTP_PASSWORD to send lead alerts from your own mail server.',
    };
  }
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
    });
    await transporter.verify();
    return { configured: true, ok: true, detail: `SMTP login OK (${host}:${port}).` };
  } catch (e) {
    return { configured: true, ok: false, detail: `SMTP verify FAILED: ${(e as Error).message}` };
  }
}

/** Resend — validates the API key by listing domains (200 = key works). */
async function probeResend(): Promise<Channel> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { configured: false, ok: false, detail: 'RESEND_API_KEY not set (optional channel).' };
  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return { configured: true, ok: true, detail: 'Resend API key valid.' };
    return { configured: true, ok: false, detail: `Resend rejected the key (HTTP ${res.status}).` };
  } catch (e) {
    return { configured: true, ok: false, detail: `Resend check failed: ${(e as Error).message}` };
  }
}

/** ERP PRO quote endpoint — pings the tunnel to confirm it is reachable now. */
async function probeErp(): Promise<Channel> {
  const endpoint = process.env.ERP_QUOTE_ENDPOINT;
  if (!endpoint) {
    return {
      configured: false,
      ok: false,
      detail: 'ERP_QUOTE_ENDPOINT not set — website quote requests are NOT forwarded to ERP PRO.',
    };
  }
  try {
    // A GET to the POST-only endpoint typically returns 404/405 — that still
    // proves the tunnel is UP and routing. A network error means it's DOWN.
    const res = await fetch(endpoint, { method: 'GET', signal: AbortSignal.timeout(8000) });
    return {
      configured: true,
      ok: true,
      detail: `ERP endpoint reachable (HTTP ${res.status}; tunnel is up). POST is used for real quotes.`,
    };
  } catch (e) {
    return {
      configured: true,
      ok: false,
      detail: `ERP endpoint UNREACHABLE: ${(e as Error).message}. The tunnel/ERP is likely down — restart it.`,
    };
  }
}

function probeWebhook(): Channel {
  const url = process.env.LEAD_WEBHOOK_URL;
  return url
    ? { configured: true, ok: null, detail: 'LEAD_WEBHOOK_URL set (not fired during probe to avoid noise).' }
    : { configured: false, ok: false, detail: 'LEAD_WEBHOOK_URL not set (optional zero-cost channel).' };
}

function probeWhatsAppApi(): Channel {
  const ok = !!(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
  return {
    configured: ok,
    ok: ok ? null : false,
    detail: ok
      ? 'WhatsApp Business API credentials present.'
      : 'WhatsApp Business API not set (the site still offers a wa.me deep-link fallback regardless).',
  };
}

function probeSms(): Channel {
  const ok = !!(process.env.AFRICASTALKING_API_KEY && process.env.AFRICASTALKING_USERNAME);
  return {
    configured: ok,
    ok: ok ? null : false,
    detail: ok ? "Africa's Talking SMS credentials present." : "Africa's Talking SMS not set (optional).",
  };
}

function probeFormSubmit(): Channel {
  return {
    configured: true,
    ok: null,
    detail:
      'FormSubmit is always-on (no key). REQUIRES a one-time "Activate Form" click in ' +
      (process.env.SALES_EMAIL || 'emersoneimservices@gmail.com') +
      ' — until then it silently does not deliver.',
  };
}

/** Run a real, clearly-marked TEST lead through the live /api/contact pipeline. */
async function endToEndTest(request: NextRequest): Promise<unknown> {
  // SECURITY: pin the self-call target to a server-configured origin rather than
  // request.nextUrl.origin (which is derived from the attacker-influenceable Host
  // / x-forwarded-host headers — middleware excludes /api so it isn't guarded).
  // Only fall back to the request origin for local development.
  const isProd = (process.env.VERCEL_ENV || process.env.NODE_ENV) === 'production';
  const origin =
    process.env.SITE_ORIGIN ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (isProd ? 'https://www.emersoneims.com' : request.nextUrl.origin);
  const stamp = new Date().toISOString();
  try {
    const res = await fetch(`${origin}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'EIMS DIAGNOSTIC TEST',
        email: 'diagnostics@emersoneims.com',
        phone: '',
        company: 'Internal monitor',
        service: 'general',
        source: 'lead-diagnostics',
        message:
          `This is an automated end-to-end delivery TEST generated at ${stamp}. ` +
          'It confirms the website lead pipeline reaches a human channel. Safe to ignore.',
      }),
      signal: AbortSignal.timeout(15000),
    });
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return { http: res.status, delivered: body.delivered ?? null, leadId: body.leadId ?? null };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!authorize(request)) {
    return json(
      {
        error: 'unauthorized',
        hint: 'Pass ?token=<LEAD_DIAG_TOKEN or ADMIN_API_KEY>. Set LEAD_DIAG_TOKEN in Vercel to enable diagnostics.',
      },
      401,
    );
  }

  const [db, smtp, resend, erp] = await Promise.all([probeDb(), probeSmtp(), probeResend(), probeErp()]);
  const webhook = probeWebhook();
  const whatsappApi = probeWhatsAppApi();
  const sms = probeSms();
  const formsubmit = probeFormSubmit();

  // A lead is "safe" if at least one channel that reliably reaches a human is
  // live: DB persisted + (SMTP ok OR Resend ok OR ERP reachable OR webhook set).
  const humanReach =
    smtp.ok === true || resend.ok === true || erp.ok === true || webhook.configured;
  const leadIsSafe = db.ok === true && humanReach;

  const actions: string[] = [];
  if (!db.ok) actions.push('CRITICAL: ' + db.detail);
  if (!humanReach)
    actions.push(
      'CRITICAL: no delivery channel reaches a human. Configure SMTP (recommended), Resend, ERP_QUOTE_ENDPOINT, or LEAD_WEBHOOK_URL.',
    );
  if (erp.configured && erp.ok === false) actions.push('ERP: ' + erp.detail);
  if (smtp.configured && smtp.ok === false) actions.push('SMTP: ' + smtp.detail);
  if (formsubmit.configured) actions.push('Reminder: ' + formsubmit.detail);

  const result: Record<string, unknown> = {
    checked_at: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
    lead_is_safe: leadIsSafe,
    summary: leadIsSafe
      ? 'OK — leads are stored and at least one human-reaching channel is live.'
      : 'AT RISK — see actions[]. Leads may be silently lost.',
    channels: { database: db, smtp, resend, erp, webhook, whatsapp_api: whatsappApi, sms, formsubmit },
    actions,
  };

  if (request.nextUrl.searchParams.get('send') === '1') {
    // Throttle real test-lead sends so an accidental/abusive loop can't spam every
    // delivery channel (each send fans out to SMTP/ERP/WhatsApp/FormSubmit).
    const now = Date.now();
    if (now - lastTestSendAt < TEST_SEND_COOLDOWN_MS) {
      result.end_to_end_test = {
        skipped: 'cooldown',
        retry_after_seconds: Math.ceil((TEST_SEND_COOLDOWN_MS - (now - lastTestSendAt)) / 1000),
      };
    } else {
      lastTestSendAt = now;
      result.end_to_end_test = await endToEndTest(request);
    }
  }

  return json(result, 200);
}
