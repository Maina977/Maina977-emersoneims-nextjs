import { NextRequest, NextResponse } from 'next/server';

/**
 * License Activation API Endpoint
 * Validates license keys and activates them for specific devices
 *
 * In production, this would:
 * 1. Check license key against database
 * 2. Verify it hasn't been used on too many devices
 * 3. Record the device fingerprint
 * 4. Return activation status
 */

interface ActivationRequest {
  key: string;
  deviceId: string;
}

// Demo valid license keys (in production, these would be in a database)
// Keys are generated and stored when admin approves a payment
const VALID_LICENSES = new Map<string, {
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
    maxDevices: 2,
    activatedDevices: [],
    status: 'active',
  }],
]);

export async function POST(request: NextRequest) {
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

    // Validate key format
    const keyPattern = /^EIMS-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!keyPattern.test(normalizedKey)) {
      return NextResponse.json(
        { success: false, error: 'Invalid license key format' },
        { status: 400 }
      );
    }

    // Look up license
    const license = VALID_LICENSES.get(normalizedKey);

    if (!license) {
      return NextResponse.json(
        { success: false, error: 'License key not found. Please check the key and try again.' },
        { status: 404 }
      );
    }

    // Check license status
    if (license.status === 'revoked') {
      return NextResponse.json(
        { success: false, error: 'This license has been revoked. Please contact support.' },
        { status: 403 }
      );
    }

    if (license.status === 'expired') {
      return NextResponse.json(
        { success: false, error: 'This license has expired. Please renew to continue.' },
        { status: 403 }
      );
    }

    // Check expiration date
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'This license has expired. Please renew to continue.' },
        { status: 403 }
      );
    }

    // Check device limit
    const isDeviceRegistered = license.activatedDevices.includes(body.deviceId);

    if (!isDeviceRegistered) {
      if (license.activatedDevices.length >= license.maxDevices) {
        return NextResponse.json(
          {
            success: false,
            error: `This license has reached its device limit (${license.maxDevices} devices). Please contact support to deactivate old devices.`,
          },
          { status: 403 }
        );
      }

      // Register new device
      license.activatedDevices.push(body.deviceId);
      console.log(`New device registered for license ${normalizedKey}: ${body.deviceId}`);
    }

    // Return success with license details
    return NextResponse.json({
      success: true,
      message: 'License activated successfully',
      license: {
        key: normalizedKey,
        email: license.email,
        tier: 'pro',
        status: 'active',
        activatedAt: isDeviceRegistered
          ? license.createdAt
          : new Date().toISOString(),
        expiresAt: license.expiresAt || null, // null = lifetime
        deviceCount: license.activatedDevices.length,
        maxDevices: license.maxDevices,
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
 * In production, this would be a separate admin API with proper authentication
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

    // Generate new license key
    const generateKey = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const segment = () => {
        let result = '';
        for (let i = 0; i < 4; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };
      return `EIMS-${segment()}-${segment()}-${segment()}`;
    };

    const newKey = body.key || generateKey();

    // Create license record
    VALID_LICENSES.set(newKey, {
      email: body.email,
      phone: body.phone,
      createdAt: new Date().toISOString(),
      maxDevices: body.maxDevices || 2,
      activatedDevices: [],
      status: 'active',
      expiresAt: body.expiresAt || undefined,
    });

    console.log(`New license created: ${newKey} for ${body.email}`);

    return NextResponse.json({
      success: true,
      message: 'License created successfully',
      key: newKey,
    });

  } catch (error) {
    console.error('License creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
