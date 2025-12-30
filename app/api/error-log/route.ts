/**
 * ERROR LOGGING API
 * Logs client-side errors for monitoring
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { error, stack, componentStack, timestamp, userAgent } = body;

    // Log error (in production, send to monitoring service)
    console.error('🚨 Client Error:', {
      error,
      stack,
      componentStack,
      timestamp,
      userAgent,
      url: request.url,
      headers: {
        referer: request.headers.get('referer'),
        userAgent: request.headers.get('user-agent'),
      },
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
