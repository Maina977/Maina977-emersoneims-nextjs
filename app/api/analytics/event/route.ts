/**
 * EVENT TRACKING API
 * Tracks user events (clicks, scrolls, interactions)
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data, visitorId, sessionId, timestamp } = body;

    // Store event (in production, use a database)
    console.log('Event:', {
      event,
      visitorId,
      sessionId,
      data,
      timestamp: new Date(timestamp).toISOString(),
    });

    // Send to Google Analytics if configured
    if (process.env.NEXT_PUBLIC_GA_ID) {
      // TODO: Send to Google Analytics 4
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}


