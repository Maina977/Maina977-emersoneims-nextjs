import { NextRequest, NextResponse } from 'next/server';
import {
  getLicenseByKey,
  activateLicense,
  logActivationAttempt,
  checkRateLimit,
  initOracleTables,
} from '@/lib/generator-oracle/db';

/**
 * License Activation API Endpoint
 * Validates license keys and activates them for specific devices
 *
 * CRITICAL: ONE DEVICE PER LICENSE
 * - First activation binds the device fingerprint permanently
 * - Subsequent activations must match the bound fingerprint
 * - No way to change device without admin intervention
 *
 * Security measures:
 * - Rate limiting: Max 3 activation attempts per hour per device
 * - All activation attempts logged for audit
 * - Server-side expiry validation
 */

interface ActivationRequest {
  key: string;
  deviceId: string;
  heartbeat?: boolean; // True for periodic validation, false for new activation
  deviceInfo?: Record<string, unknown>;
}

// Fallback demo licenses when database is not available
const DEMO_LICENSES = new Map<string, {
  email: string;
  phone: string;
  createdAt: string;
  maxDevices: number;
  activatedDevices: string[];
  status: 'active' | 'revoked' | 'expired';
  expiresAt?: string;
}>([
  // Demo license for testing
  ['EIMS-TEST-0001-DEMO', {
    email: 'test@example.com',
    phone: '+254700000000',
    createdAt: new Date().toISOString(),
    maxDevices: 1, // ONE device only
    activatedDevices: [],
    status: 'active',
  }],
]);

export async function POST(request: NextRequest) {
  // Get client info for logging
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                   request.headers.get('x-real-ip') ||
                   'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    const body: ActivationRequest = await request.json();

    // Validate input
    if (!body.key || !body.deviceId) {
      return NextResponse.json(
        { success: false, error: 'Missing license key or device ID' },
        { status: 400 }
      );
    }

    // Normalize key format
    const normalizedKey = body.key.toUpperCase().trim();
    const deviceId = body.deviceId.trim();

    // Validate key format
    const keyPattern = /^EIMS-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!keyPattern.test(normalizedKey)) {
      return NextResponse.json(
        { success: false, error: 'Invalid license key format' },
        { status: 400 }
      );
    }

    // Check rate limit
    const withinLimit = await checkRateLimit(deviceId, 'device');
    if (!withinLimit) {
      await logActivationAttempt({
        license_key: normalizedKey,
        device_fingerprint: deviceId,
        device_info: body.deviceInfo,
        ip_address: clientIp,
        user_agent: userAgent,
        success: false,
        failure_reason: 'Rate limit exceeded',
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Too many activation attempts. Please try again in 1 hour.',
        },
        { status: 429 }
      );
    }

    // Initialize tables (if using PostgreSQL)
    await initOracleTables();

    // Try PostgreSQL first
    const dbLicense = await getLicenseByKey(normalizedKey);

    if (dbLicense) {
      // Database license found - use PostgreSQL
      const activationResult = await activateLicense(normalizedKey, deviceId, body.deviceInfo);

      // Log the attempt
      await logActivationAttempt({
        license_key: normalizedKey,
        device_fingerprint: deviceId,
        device_info: body.deviceInfo,
        ip_address: clientIp,
        user_agent: userAgent,
        success: activationResult.success,
        failure_reason: activationResult.error,
      });

      if (!activationResult.success) {
        const statusCode = activationResult.error?.includes('different device') ? 403 :
                          activationResult.error?.includes('expired') ? 403 :
                          activationResult.error?.includes('revoked') ? 403 : 400;

        return NextResponse.json(
          { success: false, error: activationResult.error },
          { status: statusCode }
        );
      }

      const license = activationResult.license!;
      return NextResponse.json({
        success: true,
        message: body.heartbeat ? 'Heartbeat updated' : 'License activated successfully',
        license: {
          key: normalizedKey,
          email: license.customer_email,
          tier: 'pro',
          status: license.status,
          activatedAt: license.activated_at?.toISOString() || new Date().toISOString(),
          expiresAt: license.expires_at?.toISOString() || null,
          deviceCount: 1, // Always 1 - ONE device per license
          maxDevices: 1,
        },
      });
    }

    // Fall back to demo licenses (for development/testing)
    const demoLicense = DEMO_LICENSES.get(normalizedKey);

    if (!demoLicense) {
      await logActivationAttempt({
        license_key: normalizedKey,
        device_fingerprint: deviceId,
        ip_address: clientIp,
        user_agent: userAgent,
        success: false,
        failure_reason: 'License not found',
      });

      return NextResponse.json(
        { success: false, error: 'License key not found. Please check the key and try again.' },
        { status: 404 }
      );
    }

    // Check demo license status
    if (demoLicense.status === 'revoked') {
      return NextResponse.json(
        { success: false, error: 'This license has been revoked. Please contact support.' },
        { status: 403 }
      );
    }

    if (demoLicense.status === 'expired') {
      return NextResponse.json(
        { success: false, error: 'This license has expired. Please renew to continue.' },
        { status: 403 }
      );
    }

    // Check expiration date
    if (demoLicense.expiresAt && new Date(demoLicense.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'This license has expired. Please renew to continue.' },
        { status: 403 }
      );
    }

    // Check device binding - ONE DEVICE ONLY
    const isDeviceRegistered = demoLicense.activatedDevices.includes(deviceId);

    if (!isDeviceRegistered) {
      // Check if license already bound to another device
      if (demoLicense.activatedDevices.length >= demoLicense.maxDevices) {
        await logActivationAttempt({
          license_key: normalizedKey,
          device_fingerprint: deviceId,
          ip_address: clientIp,
          user_agent: userAgent,
          success: false,
          failure_reason: 'License bound to different device',
        });

        return NextResponse.json(
          {
            success: false,
            error: 'This license is already bound to a different device. Each license can only be used on ONE device. Contact support to transfer your license.',
          },
          { status: 403 }
        );
      }

      // First activation - bind device
      demoLicense.activatedDevices.push(deviceId);
      console.log(`New device bound to demo license ${normalizedKey}: ${deviceId}`);
    }

    await logActivationAttempt({
      license_key: normalizedKey,
      device_fingerprint: deviceId,
      ip_address: clientIp,
      user_agent: userAgent,
      success: true,
    });

    // Return success with license details
    return NextResponse.json({
      success: true,
      message: body.heartbeat ? 'Heartbeat updated' : 'License activated successfully',
      license: {
        key: normalizedKey,
        email: demoLicense.email,
        tier: 'pro',
        status: 'active',
        activatedAt: isDeviceRegistered
          ? demoLicense.createdAt
          : new Date().toISOString(),
        expiresAt: demoLicense.expiresAt || null,
        deviceCount: 1,
        maxDevices: 1, // ONE device only
      },
    });

  } catch (error) {
    console.error('License activation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Admin endpoint to create/manage licenses
 * Protected by ADMIN_API_KEY
 */
export async function PUT(request: NextRequest) {
  // Check admin authentication
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { createLicense } = await import('@/lib/generator-oracle/db');

    // Create license in database
    const result = await createLicense({
      email: body.email,
      phone: body.phone,
      name: body.name,
      paymentReference: body.paymentReference,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    console.log(`Admin created license: ${result.licenseKey} for ${body.email}`);

    return NextResponse.json({
      success: true,
      message: 'License created successfully',
      key: result.licenseKey,
    });

  } catch (error) {
    console.error('License creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for admin to list licenses
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
    const { getAllLicenses, getLicenseStats } = await import('@/lib/generator-oracle/db');

    const [licenses, stats] = await Promise.all([
      getAllLicenses(),
      getLicenseStats(),
    ]);

    return NextResponse.json({
      success: true,
      stats,
      licenses,
    });
  } catch (error) {
    console.error('License list error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
