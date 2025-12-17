/**
 * EVENT TRACKING API
 * Tracks user events (clicks, scrolls, interactions)
 * 
 * Features:
 * - Rate limiting (100 requests/minute per IP)
 * - Input validation with Zod
 * - Database storage (PostgreSQL)
 * - Google Analytics integration (optional)
 */

import { NextRequest, NextResponse } from 'next/server';
import { eventSchema, type EventInput } from '@/lib/validation';
import { limiter } from '@/lib/rate-limiter';
import { storeEvent } from '@/lib/db';
import { z } from 'zod';
import { 
  getClientIP,
  checkApiAuth, 
  createUnauthorizedResponse,
  addCorsHeaders 
} from '@/app/api/middleware';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting (100 requests per minute per IP)
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    try {
      limiter.check(100, ip);
    } catch (error: any) {
      if (error.message === 'Rate limit exceeded') {
        return NextResponse.json(
          { success: false, error: 'Too many requests' },
          { status: 429 }
        );
      }
      throw error;
    }

    // 2. Authentication (optional)
    const authResult = checkApiAuth(request);
    if (!authResult.authorized) {
      return createUnauthorizedResponse(authResult.error || 'Unauthorized');
    }

    // 3. Parse and validate request body
    let body: any;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // 3. Validation
    let validatedData: EventInput;
    try {
      validatedData = eventSchema.parse(body);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid input',
            details: error.errors,
          },
          { status: 400 }
        );
      }
      throw error;
    }

    const { event, data, visitorId, sessionId, timestamp } = validatedData;

    // 4. Database storage
    const recordId = await storeEvent({
      event,
      data: data || {},
      visitorId,
      sessionId,
      timestamp: typeof timestamp === 'string' ? parseInt(timestamp) : timestamp || Date.now(),
    });

    // 5. Send to Google Analytics if configured (server-side)
    const gaId = process.env.GA_MEASUREMENT_ID;
    if (gaId) {
      // TODO: Send to Google Analytics 4 Measurement Protocol
      // Example: POST to https://www.google-analytics.com/mp/collect
    }

    // Return success response
    const response = NextResponse.json(
      { 
        success: true,
        id: recordId,
        message: 'Event tracked successfully',
      },
      { status: 200 }
    );

    return addCorsHeaders(response);

  } catch (error: any) {
    // Structured error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error.message === 'Rate limit exceeded') {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      );
    }

    console.error('Event tracking error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  return addCorsHeaders(response);
}


