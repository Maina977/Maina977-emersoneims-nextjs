/**
 * Unified Payment Initialization Facade
 *
 * Delegates to provider-specific routes:
 * - mpesa     -> /api/payments/mpesa
 * - flutterwave -> /api/payments/flutterwave
 * - paystack  -> /api/payments/paystack
 *
 * Returns a normalized response so frontends can stay provider-agnostic.
 */

import { NextRequest, NextResponse } from 'next/server';

interface InitializeRequest {
  provider: 'mpesa' | 'flutterwave' | 'paystack';
  amount: number;
  currency?: string;
  report_id?: string;
  analysis_id?: string;
  customer_email: string;
  customer_phone?: string;
  customer_name: string;
}

interface NormalizedResponse {
  success: boolean;
  payment_id: string;            // opaque id usable with /api/v1/payments/verify/:id
  checkout_url?: string;         // for hosted providers (Flutterwave/Paystack)
  checkout_request_id?: string;  // for STK Push (M-Pesa)
  provider: string;
  reference: string;
  error?: string;
  configRequired?: boolean;
}

function siteOrigin(req: NextRequest): string {
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? 'localhost:3000';
  return `${proto}://${host}`;
}

export async function POST(request: NextRequest) {
  let body: InitializeRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { provider, amount, currency, customer_email, customer_phone, customer_name, report_id, analysis_id } = body;

  if (!provider || !amount || !customer_email || !customer_name) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields: provider, amount, customer_email, customer_name' },
      { status: 400 },
    );
  }

  const reference = report_id || analysis_id || `pay_${Date.now()}`;
  const origin = siteOrigin(request);

  try {
    if (provider === 'mpesa') {
      if (!customer_phone) {
        return NextResponse.json({ success: false, error: 'customer_phone required for M-Pesa' }, { status: 400 });
      }
      const r = await fetch(`${origin}/api/payments/mpesa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: customer_phone,
          amount,
          accountReference: reference.substring(0, 12),
          transactionDesc: 'Report Unlock',
        }),
      });
      const data = await r.json();
      if (!r.ok || !data.success) {
        return NextResponse.json(
          {
            success: false,
            error: data.error ?? 'M-Pesa initialization failed',
            configRequired: data.configRequired,
            payment_id: '',
            provider,
            reference,
          } satisfies NormalizedResponse,
          { status: r.status || 502 },
        );
      }
      const checkoutId = data.data?.CheckoutRequestID ?? reference;
      return NextResponse.json({
        success: true,
        payment_id: `mpesa:${checkoutId}`,
        checkout_request_id: checkoutId,
        provider,
        reference,
      } satisfies NormalizedResponse);
    }

    if (provider === 'flutterwave') {
      const r = await fetch(`${origin}/api/payments/flutterwave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: currency ?? 'KES',
          email: customer_email,
          phone: customer_phone,
          name: customer_name,
          reference,
          description: `Report ${reference}`,
        }),
      });
      const data = await r.json();
      if (!r.ok || !data.success) {
        return NextResponse.json(
          {
            success: false,
            error: data.error ?? 'Flutterwave initialization failed',
            configRequired: data.configRequired,
            payment_id: '',
            provider,
            reference,
          } satisfies NormalizedResponse,
          { status: r.status || 502 },
        );
      }
      return NextResponse.json({
        success: true,
        payment_id: `flw:${data.data?.transactionRef ?? reference}`,
        checkout_url: data.data?.link,
        provider,
        reference,
      } satisfies NormalizedResponse);
    }

    if (provider === 'paystack') {
      const r = await fetch(`${origin}/api/payments/paystack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: currency ?? 'NGN',
          email: customer_email,
          name: customer_name,
          reference,
        }),
      });
      const data = await r.json();
      if (!r.ok || !data.success) {
        return NextResponse.json(
          {
            success: false,
            error: data.error ?? 'Paystack initialization failed',
            configRequired: data.configRequired,
            payment_id: '',
            provider,
            reference,
          } satisfies NormalizedResponse,
          { status: r.status || 502 },
        );
      }
      const ref = data.data?.reference ?? reference;
      return NextResponse.json({
        success: true,
        payment_id: `psk:${ref}`,
        checkout_url: data.data?.authorization_url ?? data.data?.link,
        provider,
        reference,
      } satisfies NormalizedResponse);
    }

    return NextResponse.json(
      { success: false, error: `Unsupported provider: ${provider}` },
      { status: 400 },
    );
  } catch (err) {
    console.error('[v1/payments/initialize]', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Payment initialization failed',
        payment_id: '',
        provider,
        reference,
      } satisfies NormalizedResponse,
      { status: 500 },
    );
  }
}
