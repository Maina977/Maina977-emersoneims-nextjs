/**
 * CONVERSION TRACKING API
 * Tracks conversions and sends notifications
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, visitorId, sessionId, timestamp } = body;

    // Store conversion (in production, use a database)
    console.log('Conversion:', {
      type,
      visitorId,
      sessionId,
      data,
      timestamp: new Date(timestamp).toISOString(),
    });

    // Send immediate notification
    await fetch('/api/notifications/new-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'conversion',
        conversionType: type,
        visitorId,
        sessionId,
        data,
        timestamp,
      }),
    }).catch(() => {
      // Silently fail if notification service is unavailable
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Conversion tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track conversion' },
      { status: 500 }
    );
  }
}


