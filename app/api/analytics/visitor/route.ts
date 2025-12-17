/**
 * VISITOR TRACKING API
 * Tracks and stores visitor data for analytics and follow-up
 * 
 * Features:
 * - Rate limiting (100 requests/minute per IP)
 * - Input validation with Zod
 * - Database storage (PostgreSQL)
 * - Hot lead detection and notification
 */

import { NextRequest, NextResponse } from 'next/server';
import { visitorSchema, type VisitorInput } from '@/lib/validation';
import { limiter } from '@/lib/rate-limiter';
import { storeVisitor } from '@/lib/db';
import { queueNotification } from '@/lib/notification-queue';
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
    let validatedData: VisitorInput;
    try {
      validatedData = visitorSchema.parse(body);
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

    const { event, data, timestamp } = validatedData;

    // 4. Database storage
    const recordId = await storeVisitor({
      event,
      data,
      timestamp: typeof timestamp === 'string' ? parseInt(timestamp) : timestamp || Date.now(),
    });

    // 5. Queue notification for hot leads (asynchronous)
    if (
      event === 'page_view' && 
      data.conversion?.probability && 
      data.conversion.probability > 70
    ) {
      await queueNotification({
        type: 'hot_lead',
        visitorId: data.id,
        conversionType: 'high_engagement',
        data: {
          page: data.page,
          engagementScore: data.engagement?.score,
          conversionProbability: data.conversion?.probability,
        },
        timestamp,
      }, request.nextUrl.origin);
    }

    // Return success response
    const response = NextResponse.json(
      { 
        success: true,
        id: recordId,
        message: 'Visitor tracked successfully',
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

    console.error('Visitor tracking error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to track visitor' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  return addCorsHeaders(response);
}

async function sendNotification(data: {
  type: string;
  visitorId: string;
  page: string;
  engagementScore?: number;
  conversionProbability?: number;
}) {
  // TODO: Implement notification system
  // Options:
  // 1. Email notification (SendGrid, Mailgun, etc.)
  // 2. Slack webhook
  // 3. SMS (Twilio)
  // 4. Push notification
  // 5. Dashboard update (WebSocket)
  
  console.log('Notification:', data);
  
  // Example: Send to external notification service
  try {
    await fetch(process.env.NOTIFICATION_WEBHOOK_URL || '', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.warn('Notification failed:', error);
  }
}


