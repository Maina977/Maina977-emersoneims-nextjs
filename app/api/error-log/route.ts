/**
 * ERROR LOGGING API
 * Logs client-side errors for monitoring.
 * Hardened: caps individual field sizes so a malicious or runaway client
 * cannot flood server logs / monitoring service quota.
 */

import { NextRequest, NextResponse } from 'next/server';

const MAX_FIELD = 4000; // chars per field
function clip(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  return v.length > MAX_FIELD ? v.slice(0, MAX_FIELD) + '…[truncated]' : v;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const error = clip((body as any)?.error);
    const stack = clip((body as any)?.stack);
    const componentStack = clip((body as any)?.componentStack);
    const timestamp = clip((body as any)?.timestamp);

    // Log error (in production, send to monitoring service)
    console.error('🚨 Client Error:', {
      error,
      stack,
      componentStack,
      timestamp,
      url: request.url,
      referer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent')?.slice(0, 200),
    });

    // TODO: Send to Sentry, LogRocket, or similar monitoring service
    // Example: Sentry.captureException(error);

    return NextResponse.json({ success: true, logged: true });
  } catch (error) {
    console.error('Error logging failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log error' },
      { status: 500 }
    );
  }
}
