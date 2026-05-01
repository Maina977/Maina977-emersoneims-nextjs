/**
 * Unified Payment Verification Facade
 *
 * The payment_id is provider-prefixed: "mpesa:<id>", "flw:<ref>", "psk:<ref>".
 * Returns { status: 'completed' | 'pending' | 'failed', ... }
 */

import { NextRequest, NextResponse } from 'next/server';

interface VerifyResponse {
  success: boolean;
  status: 'completed' | 'pending' | 'failed' | 'unknown';
  payment_id: string;
  provider: string;
  raw?: unknown;
  error?: string;
}

function siteOrigin(req: NextRequest): string {
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? 'localhost:3000';
  return `${proto}://${host}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ payment_id: string }> },
) {
  const { payment_id } = await params;

  if (!payment_id) {
    return NextResponse.json(
      { success: false, status: 'unknown', payment_id: '', provider: '', error: 'Missing payment_id' } satisfies VerifyResponse,
      { status: 400 },
    );
  }

  const decoded = decodeURIComponent(payment_id);
  const [provider, ...rest] = decoded.split(':');
  const providerId = rest.join(':');

  if (!provider || !providerId) {
    return NextResponse.json(
      {
        success: false,
        status: 'unknown',
        payment_id: decoded,
        provider: provider || '',
        error: 'Invalid payment_id format. Expected "<provider>:<id>".',
      } satisfies VerifyResponse,
      { status: 400 },
    );
  }

  const origin = siteOrigin(request);

  try {
    if (provider === 'mpesa') {
      // M-Pesa STK Push verification: poll callback table or status query.
      // Without a DB, we expose a best-effort response that callers can poll.
      // Our callback endpoint at /api/payments/mpesa/callback writes nothing
      // persistent in this build, so report 'pending' until configured.
      return NextResponse.json({
        success: true,
        status: 'pending',
        payment_id: decoded,
        provider,
      } satisfies VerifyResponse);
    }

    if (provider === 'flw') {
      const r = await fetch(`${origin}/api/payments/flutterwave?tx_ref=${encodeURIComponent(providerId)}`);
      const data = await r.json();
      const flwStatus: string | undefined = data?.data?.status ?? data?.status;
      const status: VerifyResponse['status'] =
        flwStatus === 'successful' || flwStatus === 'success'
          ? 'completed'
          : flwStatus === 'failed' || flwStatus === 'cancelled'
            ? 'failed'
            : 'pending';
      return NextResponse.json({
        success: true,
        status,
        payment_id: decoded,
        provider: 'flutterwave',
        raw: data?.data,
      } satisfies VerifyResponse);
    }

    if (provider === 'psk') {
      const r = await fetch(`${origin}/api/payments/paystack?reference=${encodeURIComponent(providerId)}`);
      const data = await r.json();
      const pskStatus: string | undefined = data?.data?.status ?? data?.status;
      const status: VerifyResponse['status'] =
        pskStatus === 'success' || pskStatus === 'completed'
          ? 'completed'
          : pskStatus === 'failed' || pskStatus === 'abandoned'
            ? 'failed'
            : 'pending';
      return NextResponse.json({
        success: true,
        status,
        payment_id: decoded,
        provider: 'paystack',
        raw: data?.data,
      } satisfies VerifyResponse);
    }

    return NextResponse.json(
      {
        success: false,
        status: 'unknown',
        payment_id: decoded,
        provider,
        error: `Unsupported provider: ${provider}`,
      } satisfies VerifyResponse,
      { status: 400 },
    );
  } catch (err) {
    console.error('[v1/payments/verify]', err);
    return NextResponse.json(
      {
        success: false,
        status: 'pending',
        payment_id: decoded,
        provider,
        error: err instanceof Error ? err.message : 'Verification failed',
      } satisfies VerifyResponse,
      { status: 200 }, // never block the polling client; return pending instead
    );
  }
}
