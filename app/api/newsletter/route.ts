import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, use a database like MongoDB, PostgreSQL, or a service like Mailchimp/SendGrid
const subscribers: { email: string; date: string; source: string }[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = 'website' } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
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
  // Admin endpoint to view subscribers (protect in production!)
  const authHeader = request.headers.get('authorization');
  
  // Simple auth check - use proper authentication in production
  if (authHeader !== 'Bearer emerson-admin-key') {
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
