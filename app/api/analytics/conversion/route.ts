/**
 * CONVERSION TRACKING API
 * Tracks conversions and sends notifications
 * 
 * Features:
 * - Rate limiting (100 requests/minute per IP)
 * - Input validation with Zod
 * - Database storage (PostgreSQL)
 * - Asynchronous notification queue
 */

import { NextRequest, NextResponse } from 'next/server';
import { conversionSchema, type ConversionInput } from '@/lib/validation';
import { limiter } from '@/lib/rate-limiter';
import { storeConversion } from '@/lib/db';
import { queueNotification } from '@/lib/notification-queue';
import { z } from 'zod';
import { 
  checkApiAuth, 
  createUnauthorizedResponse,
  addCorsHeaders 
} from '@/app/api/middleware';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting (100 requests per minute per IP)
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    try {
      limiter.check(100, ip); // 100 requests per minute per IP
    } catch (error: any) {
      if (error.message === 'Rate limit exceeded') {
        return NextResponse.json(
          { success: false, error: 'Too many requests' },
          { status: 429 }
        );
      }
      throw error;
    }

    // 2. Authentication (optional - only if API_KEY is set)
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
    let validatedData: ConversionInput;
    try {
      validatedData = conversionSchema.parse(body);
    } catch (error: any) {
      // Zod validation error
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

    const { type, data, visitorId, sessionId, timestamp } = validatedData;

    // 4. Database storage
    const recordId = await storeConversion({
      type,
      data: data || {},
      visitorId,
      sessionId,
      timestamp: typeof timestamp === 'string' ? parseInt(timestamp) : timestamp || Date.now(),
    });

    // 5. Queue notification (instead of direct fetch)
    await queueNotification({
      type: 'conversion',
      conversionType: type,
      visitorId,
      sessionId,
      data: data || {},
      timestamp,
    }, request.nextUrl.origin);

    // Return success response
    const response = NextResponse.json(
      { 
        success: true,
        id: recordId,
        message: 'Conversion tracked successfully',
      },
      { status: 200 }
    );

    // Add CORS headers
    return addCorsHeaders(response);

  } catch (error: any) {
    // 6. Structured error handling
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

    console.error('Conversion tracking error:', error);
    
    // Use proper logging service
    // await logError(error, 'conversion_tracking');
    
    return NextResponse.json(
      { success: false, error: 'Failed to track conversion' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  return addCorsHeaders(response);
}


