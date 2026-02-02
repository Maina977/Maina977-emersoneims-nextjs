import { NextRequest, NextResponse } from 'next/server';
import {
  createPaymentRequest,
  verifyPayment,
  rejectPayment,
  getPendingPayments,
  getAllPayments,
  initOracleTables,
} from '@/lib/generator-oracle/db';

/**
 * Payment Verification API Endpoint
 *
 * BUSINESS DETAILS:
 * - Company: Emerson Industrial Maintenance Services Limited
 * - Bank: Equity Bank, Embakasi Branch
 * - Account: 1320285133753
 * - Phone: 0782914717
 * - Price: KES 20,000/year
 *
 * FLOW:
 * 1. Customer pays via M-Pesa or Bank Transfer
 * 2. Customer submits transaction code on website
 * 3. Admin receives notification (logged for now)
 * 4. Admin verifies payment and clicks "Verify" in admin dashboard
 * 5. System generates license key automatically
 * 6. License key is returned (displayed on screen, sent via WhatsApp/email)
 */

interface PaymentVerificationRequest {
  transactionCode: string;
  phone: string;
  email: string;
  paymentMethod: 'mpesa' | 'bank';
  deviceId?: string;
  amount?: number;
  currency?: string;
  name?: string;
}

// In-memory fallback when database is not available
const pendingVerifications = new Map<string, PaymentVerificationRequest & {
  createdAt: string;
  status: string;
}>();

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
    const transactionCode = body.transactionCode.trim().toUpperCase();
    if (transactionCode.length < 5) {
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

    // Initialize database tables
    await initOracleTables();

    // Try database storage first
    const result = await createPaymentRequest({
      transactionCode,
      paymentMethod: body.paymentMethod || 'mpesa',
      email: body.email.toLowerCase().trim(),
      phone: body.phone.trim(),
      name: body.name?.trim(),
      amount: body.amount || 20000,
      currency: body.currency || 'KES',
      deviceFingerprint: body.deviceId,
    });

    if (result.success) {
      // Send admin notification
      logPaymentNotification({
        transactionCode,
        phone: body.phone,
        email: body.email,
        paymentMethod: body.paymentMethod,
        amount: body.amount || 20000,
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'Payment verification request submitted successfully',
        verificationId: transactionCode,
        estimatedTime: '1-24 hours',
        nextSteps: [
          'We will verify your payment within 1-24 hours',
          'Your license key will be sent via SMS and email',
          'Contact us on WhatsApp if you have questions',
        ],
      });
    }

    // Check for duplicate submission
    if (result.error?.includes('already been submitted')) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 409 }
      );
    }

    // Fallback to in-memory storage
    if (pendingVerifications.has(transactionCode)) {
      return NextResponse.json(
        { success: false, error: 'This transaction has already been submitted for verification' },
        { status: 409 }
      );
    }

    // Store in memory as fallback
    pendingVerifications.set(transactionCode, {
      ...body,
      transactionCode,
      createdAt: new Date().toISOString(),
      status: 'pending',
    });

    // Log notification
    logPaymentNotification({
      transactionCode,
      phone: body.phone,
      email: body.email,
      paymentMethod: body.paymentMethod,
      amount: body.amount || 20000,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verification request submitted successfully',
      verificationId: transactionCode,
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

/**
 * Admin endpoint - Get pending payments
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    await initOracleTables();

    const url = new URL(request.url);
    const all = url.searchParams.get('all') === 'true';

    const payments = all ? await getAllPayments() : await getPendingPayments();

    // Also include in-memory pending (if any)
    const inMemoryPending = Array.from(pendingVerifications.values())
      .filter(p => p.status === 'pending');

    return NextResponse.json({
      success: true,
      count: payments.length + inMemoryPending.length,
      payments,
      inMemoryPending: inMemoryPending.length > 0 ? inMemoryPending : undefined,
    });
  } catch (error) {
    console.error('Failed to get payments:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Admin endpoint - Verify or reject a payment
 * POST body:
 * - transactionCode: string
 * - action: 'verify' | 'reject'
 * - reason?: string (for rejection)
 */
export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { transactionCode, action, reason } = body;

    if (!transactionCode || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing transactionCode or action' },
        { status: 400 }
      );
    }

    if (action !== 'verify' && action !== 'reject') {
      return NextResponse.json(
        { success: false, error: 'Action must be "verify" or "reject"' },
        { status: 400 }
      );
    }

    await initOracleTables();

    const adminUser = 'admin'; // In production, get from auth token

    if (action === 'verify') {
      // Verify payment and create license
      const result = await verifyPayment(transactionCode.toUpperCase(), adminUser);

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }

      // Log license creation
      console.log('='.repeat(60));
      console.log('LICENSE CREATED');
      console.log('='.repeat(60));
      console.log(`Transaction: ${transactionCode}`);
      console.log(`License Key: ${result.licenseKey}`);
      console.log(`Created At: ${new Date().toISOString()}`);
      console.log('='.repeat(60));

      // Update in-memory store if it was there
      const inMemory = pendingVerifications.get(transactionCode.toUpperCase());
      if (inMemory) {
        inMemory.status = 'verified';
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified and license created',
        licenseKey: result.licenseKey,
        instructions: [
          'License key has been generated',
          'Send this key to the customer via WhatsApp/SMS/Email',
          'Customer can activate at /generator-oracle',
        ],
      });
    } else {
      // Reject payment
      const rejected = await rejectPayment(transactionCode.toUpperCase(), reason || 'No reason provided', adminUser);

      if (!rejected) {
        return NextResponse.json(
          { success: false, error: 'Failed to reject payment (may not exist)' },
          { status: 400 }
        );
      }

      // Update in-memory store if it was there
      const inMemory = pendingVerifications.get(transactionCode.toUpperCase());
      if (inMemory) {
        inMemory.status = 'rejected';
      }

      return NextResponse.json({
        success: true,
        message: 'Payment rejected',
        reason: reason || 'No reason provided',
      });
    }
  } catch (error) {
    console.error('Payment action error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Log payment notification for admin
 * In production, this would send email/WhatsApp/Slack notification
 */
function logPaymentNotification(data: {
  transactionCode: string;
  phone: string;
  email: string;
  paymentMethod: string;
  amount: number;
  createdAt: string;
}) {
  console.log('');
  console.log('='.repeat(60));
  console.log('NEW PAYMENT VERIFICATION REQUEST');
  console.log('='.repeat(60));
  console.log(`Transaction Code: ${data.transactionCode}`);
  console.log(`Phone: ${data.phone}`);
  console.log(`Email: ${data.email}`);
  console.log(`Payment Method: ${data.paymentMethod}`);
  console.log(`Amount: KES ${data.amount.toLocaleString()}`);
  console.log(`Submitted: ${data.createdAt}`);
  console.log('');
  console.log('ADMIN ACTION REQUIRED:');
  console.log('1. Check bank statement for this transaction');
  console.log('2. If payment found, verify via admin dashboard');
  console.log('3. License key will be generated automatically');
  console.log('');
  console.log('Bank Details to Check:');
  console.log('  Equity Bank - 1320285133753 (Embakasi Branch)');
  console.log('  Account: Emerson Industrial Maintenance Services Limited');
  console.log('='.repeat(60));
  console.log('');

  // TODO: In production, implement:
  // - Email notification to admin
  // - WhatsApp notification via API to 0782914717
  // - Slack/Teams webhook
}
