import { NextRequest, NextResponse } from 'next/server';
import {
  getLicenseByKey,
  activateLicense,
  logActivationAttempt,
  checkRateLimit,
  initOracleTables,
} from '@/lib/generator-oracle/db';
import { limiter } from '@/lib/rate-limiter';
import { isAdminRequest } from '@/lib/generator-oracle/adminAuth';

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
 * - Rate limiting per device AND per client IP (key-guessing protection)
 * - All activation attempts logged for audit
 * - Server-side expiry validation
 * - Only licences that exist in the database can activate
 *
 * SECURITY HOTFIX 2026-11-13:
 * - Removed the built-in demo licence (a hard-coded key in this public
 *   repository) that activated as a working "pro" licence on every
 *   environment, production included, whenever the key was not in the database.
 * - Admin endpoints compared the header with `Bearer ${ADMIN_API_KEY}`: with
 *   the variable unset that string is "Bearer undefined", which then granted
 *   admin access. They now require a configured key and compare in constant time.
 */

interface ActivationRequest {
  key: string;
  deviceId: string;
  heartbeat?: boolean; // True for periodic validation, false for new activation
  deviceInfo?: Record<string, unknown>;
}

/** Activation attempts allowed per client IP per minute (in-memory, per instance). */
const ACTIVATIONS_PER_IP_PER_MINUTE = 10;

export async function POST(request: NextRequest) {
  // Get client info for logging
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                   request.headers.get('x-real-ip') ||
                   'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  // Per-IP limit before any work: a new device ID per request must not give
  // unlimited key guesses.
  if (!limiter.check(ACTIVATIONS_PER_IP_PER_MINUTE, `oracle-activate:${clientIp}`).success) {
    return NextResponse.json(
      { success: false, error: 'Too many activation attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  try {
    const body: ActivationRequest = await request.json();

    // Validate input
    if (!body.key || !body.deviceId || typeof body.key !== 'string' || typeof body.deviceId !== 'string') {
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

    // Check rate limits (device and IP, durable when the database is available)
    const withinLimit = (await checkRateLimit(deviceId, 'device')) && (await checkRateLimit(clientIp, 'ip'));
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

    // Only a licence recorded in the database can activate.
    const dbLicense = await getLicenseByKey(normalizedKey);

    if (!dbLicense) {
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
  if (!isAdminRequest(request)) {
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

    console.log(`Admin created a license for ${body.email}`);

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
  if (!isAdminRequest(request)) {
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
