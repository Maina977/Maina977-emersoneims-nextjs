import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

// Simple in-memory storage for demo purposes
// In production, use a database like MongoDB, PostgreSQL, or a service like Mailchimp/SendGrid
const subscribers: { email: string; date: string; source: string }[] = [];

/**
 * Verify admin authorization with timing-safe comparison.
 * Requires ADMIN_API_KEY env var to be set in production.
 * Falls back to denying access (rather than allowing a hard-coded key) if
 * the env var is missing on a production deployment.
 */
function verifyAdminAuth(request: NextRequest): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return false; // never allow unauthenticated admin access

  const authHeader = request.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return false;

  const provided = authHeader.slice(7).trim();
  if (!provided) return false;

  const a = Buffer.from(provided, 'utf8');
  const b = Buffer.from(adminKey, 'utf8');
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = 'website' } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // RFC 5321 max email length is 254. Block oversized payloads early.
    if (email.length > 320 || (typeof source === 'string' && source.length > 200)) {
      return NextResponse.json(
        { success: false, error: 'Field too long' },
        { status: 413 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check for duplicate
    const exists = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return NextResponse.json(
        { success: true, message: 'You are already subscribed!' },
        { status: 200 }
      );
    }

    // Add subscriber
    const newSubscriber = {
      email: email.toLowerCase().trim(),
      date: new Date().toISOString(),
      source
    };
    subscribers.push(newSubscriber);

    // In production, you would:
    // 1. Save to database
    // 2. Send to email marketing service (Mailchimp, SendGrid, etc.)
    // 3. Send welcome email
    // 4. Track analytics

    console.log(`New newsletter subscriber: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Admin endpoint to view subscribers. Requires ADMIN_API_KEY env var.
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    total: subscribers.length,
    subscribers: subscribers.slice(-50) // Return last 50
  });
}
