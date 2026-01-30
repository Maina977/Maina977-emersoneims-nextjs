import { NextRequest, NextResponse } from 'next/server';

/**
 * Payment Verification API Endpoint
 * Receives payment details and stores them for admin verification
 *
 * In production, this would:
 * 1. Store in database
 * 2. Send notification to admin (email/Slack/webhook)
 * 3. Optionally integrate with M-Pesa API for auto-verification
 */

interface PaymentVerificationRequest {
  transactionCode: string;
  phone: string;
  email: string;
  paymentMethod: 'mpesa' | 'bank';
  deviceId: string;
  amount: number;
  currency: string;
}

// In-memory store for demo (use database in production)
const pendingVerifications: Map<string, PaymentVerificationRequest & { createdAt: string; status: string }> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body: PaymentVerificationRequest = await request.json();

    // Validate required fields
    if (!body.transactionCode || !body.phone || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate transaction code format (basic)
    if (body.transactionCode.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Invalid transaction code' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!body.email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate phone format (basic)
    const phoneDigits = body.phone.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // Check for duplicate submission
    if (pendingVerifications.has(body.transactionCode)) {
      return NextResponse.json(
        { success: false, error: 'This transaction has already been submitted for verification' },
        { status: 409 }
      );
    }

    // Create verification record
    const verification = {
      ...body,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    // Store verification (in production, save to database)
    pendingVerifications.set(body.transactionCode, verification);

    // Send admin notification (in production, send email/webhook)
    console.log('='.repeat(60));
    console.log('NEW PAYMENT VERIFICATION REQUEST');
    console.log('='.repeat(60));
    console.log(`Transaction Code: ${body.transactionCode}`);
    console.log(`Phone: ${body.phone}`);
    console.log(`Email: ${body.email}`);
    console.log(`Payment Method: ${body.paymentMethod}`);
    console.log(`Amount: ${body.currency} ${body.amount}`);
    console.log(`Device ID: ${body.deviceId}`);
    console.log(`Submitted: ${verification.createdAt}`);
    console.log('='.repeat(60));

    // In production, you would:
    // 1. Save to database
    // 2. Send email notification to admin
    // 3. Optionally send WhatsApp notification via API
    // 4. If using M-Pesa API, verify transaction automatically

    return NextResponse.json({
      success: true,
      message: 'Verification request submitted successfully',
      verificationId: body.transactionCode,
      estimatedTime: '1-24 hours',
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Admin endpoint to check pending verifications
export async function GET(request: NextRequest) {
  // In production, this should be protected by admin authentication
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const verifications = Array.from(pendingVerifications.values());

  return NextResponse.json({
    success: true,
    count: verifications.length,
    verifications,
  });
}
