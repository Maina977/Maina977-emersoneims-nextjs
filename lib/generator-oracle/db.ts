/**
 * Generator Oracle - Database Operations
 * PostgreSQL operations for license management
 *
 * ONE DEVICE PER LICENSE - No sharing allowed
 */

import { getPostgresPool } from '@/lib/db';

// Types
export interface OracleLicense {
  id: number;
  license_key: string;
  customer_email: string;
  customer_phone: string;
  customer_name: string | null;
  device_fingerprint: string | null;
  device_info: Record<string, unknown> | null;
  status: 'pending' | 'active' | 'expired' | 'revoked';
  created_at: Date;
  activated_at: Date | null;
  expires_at: Date;
  payment_reference: string | null;
  last_heartbeat: Date | null;
  activation_attempts: number;
  notes: string | null;
}

export interface OraclePayment {
  id: number;
  transaction_code: string;
  payment_method: 'mpesa' | 'bank';
  customer_email: string;
  customer_phone: string;
  customer_name: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'verified' | 'rejected' | 'refunded';
  device_fingerprint: string | null;
  license_key: string | null;
  verified_at: Date | null;
  verified_by: string | null;
  rejection_reason: string | null;
  created_at: Date;
  notes: string | null;
}

export interface ActivationLog {
  license_key: string;
  device_fingerprint: string;
  device_info?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  failure_reason?: string;
}

// Constants
const MAX_ACTIVATION_ATTEMPTS_PER_HOUR = 3;
const MAX_DEVICES_PER_LICENSE = 1; // ONE device only - no sharing

/**
 * Generate a unique license key
 * Format: EIMS-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment = () => {
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  return `EIMS-${segment()}-${segment()}-${segment()}`;
}

/**
 * Initialize Oracle license tables (run on first use)
 */
export async function initOracleTables(): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) {
    console.warn('Database not available - running in demo mode');
    return false;
  }

  try {
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_licenses (
        id SERIAL PRIMARY KEY,
        license_key VARCHAR(19) UNIQUE NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_name VARCHAR(255),
        device_fingerprint VARCHAR(64),
        device_info JSONB,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        activated_at TIMESTAMP WITH TIME ZONE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        payment_reference VARCHAR(100),
        last_heartbeat TIMESTAMP WITH TIME ZONE,
        activation_attempts INTEGER DEFAULT 0,
        notes TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_payments (
        id SERIAL PRIMARY KEY,
        transaction_code VARCHAR(50) UNIQUE NOT NULL,
        payment_method VARCHAR(20) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_name VARCHAR(255),
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'KES',
        status VARCHAR(20) DEFAULT 'pending',
        device_fingerprint VARCHAR(64),
        license_key VARCHAR(19),
        verified_at TIMESTAMP WITH TIME ZONE,
        verified_by VARCHAR(100),
        rejection_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        notes TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_activation_logs (
        id SERIAL PRIMARY KEY,
        license_key VARCHAR(19) NOT NULL,
        device_fingerprint VARCHAR(64) NOT NULL,
        device_info JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        success BOOLEAN NOT NULL,
        failure_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_rate_limits (
        id SERIAL PRIMARY KEY,
        identifier VARCHAR(100) NOT NULL,
        identifier_type VARCHAR(20) NOT NULL,
        attempts INTEGER DEFAULT 1,
        window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(identifier, identifier_type)
      )
    `);

    // Create indexes
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_oracle_licenses_key ON oracle_licenses(license_key)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_oracle_licenses_device ON oracle_licenses(device_fingerprint)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_oracle_payments_code ON oracle_payments(transaction_code)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_oracle_logs_key ON oracle_activation_logs(license_key)`);

    return true;
  } catch (error) {
    console.error('Failed to initialize Oracle tables:', error);
    return false;
  }
}

// ============================================
// LICENSE OPERATIONS
// ============================================

/**
 * Create a new license (called when admin verifies payment)
 */
export async function createLicense(data: {
  email: string;
  phone: string;
  name?: string;
  paymentReference?: string;
  expiresAt?: Date;
}): Promise<{ success: boolean; licenseKey?: string; error?: string }> {
  const pool = await getPostgresPool();
  if (!pool) {
    return { success: false, error: 'Database not available' };
  }

  await initOracleTables();

  try {
    const licenseKey = generateLicenseKey();

    // Default expiry is 1 year from now
    const expiresAt = data.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    await pool.query(
      `INSERT INTO oracle_licenses
       (license_key, customer_email, customer_phone, customer_name, status, expires_at, payment_reference)
       VALUES ($1, $2, $3, $4, 'active', $5, $6)`,
      [
        licenseKey,
        data.email.toLowerCase().trim(),
        data.phone.trim(),
        data.name?.trim() || null,
        expiresAt,
        data.paymentReference || null,
      ]
    );

    console.log(`✅ License created: ${licenseKey} for ${data.email}`);
    return { success: true, licenseKey };
  } catch (error) {
    console.error('Failed to create license:', error);
    return { success: false, error: 'Failed to create license' };
  }
}

/**
 * Get license by key
 */
export async function getLicenseByKey(licenseKey: string): Promise<OracleLicense | null> {
  const pool = await getPostgresPool();
  if (!pool) return null;

  await initOracleTables();

  try {
    const result = await pool.query(
      `SELECT * FROM oracle_licenses WHERE license_key = $1`,
      [licenseKey.toUpperCase().trim()]
    );
    return (result.rows[0] as unknown as OracleLicense) || null;
  } catch (error) {
    console.error('Failed to get license:', error);
    return null;
  }
}

/**
 * Get license by device fingerprint
 */
export async function getLicenseByDevice(deviceFingerprint: string): Promise<OracleLicense | null> {
  const pool = await getPostgresPool();
  if (!pool) return null;

  await initOracleTables();

  try {
    const result = await pool.query(
      `SELECT * FROM oracle_licenses WHERE device_fingerprint = $1 AND status = 'active'`,
      [deviceFingerprint]
    );
    return (result.rows[0] as unknown as OracleLicense) || null;
  } catch (error) {
    console.error('Failed to get license by device:', error);
    return null;
  }
}

/**
 * Activate license and bind to device
 * CRITICAL: ONE device per license - no sharing
 */
export async function activateLicense(
  licenseKey: string,
  deviceFingerprint: string,
  deviceInfo?: Record<string, unknown>
): Promise<{
  success: boolean;
  error?: string;
  license?: OracleLicense;
}> {
  const pool = await getPostgresPool();
  if (!pool) {
    return { success: false, error: 'Database not available' };
  }

  await initOracleTables();

  try {
    // Get the license
    const license = await getLicenseByKey(licenseKey);

    if (!license) {
      return { success: false, error: 'License key not found. Please check the key and try again.' };
    }

    // Check status
    if (license.status === 'revoked') {
      return { success: false, error: 'This license has been revoked. Please contact support.' };
    }

    if (license.status === 'pending') {
      return { success: false, error: 'License is pending activation. Please wait for payment verification.' };
    }

    // Check expiration
    if (new Date(license.expires_at) < new Date()) {
      // Update status to expired
      await pool.query(
        `UPDATE oracle_licenses SET status = 'expired' WHERE license_key = $1`,
        [licenseKey]
      );
      return { success: false, error: 'This license has expired. Please renew to continue.' };
    }

    // Check device binding - CRITICAL: ONE device only
    if (license.device_fingerprint) {
      // License already bound to a device
      if (license.device_fingerprint !== deviceFingerprint) {
        // Different device trying to use the license
        return {
          success: false,
          error: 'This license is already bound to a different device. Each license can only be used on ONE device. Contact support to transfer your license.',
        };
      }
      // Same device - just update heartbeat
      await pool.query(
        `UPDATE oracle_licenses
         SET last_heartbeat = NOW(), device_info = $2
         WHERE license_key = $1`,
        [licenseKey, JSON.stringify(deviceInfo || {})]
      );
    } else {
      // First activation - bind device
      await pool.query(
        `UPDATE oracle_licenses
         SET device_fingerprint = $2, device_info = $3, activated_at = NOW(), last_heartbeat = NOW()
         WHERE license_key = $1`,
        [licenseKey, deviceFingerprint, JSON.stringify(deviceInfo || {})]
      );
      console.log(`✅ License ${licenseKey} bound to device ${deviceFingerprint}`);
    }

    // Get updated license
    const updatedLicense = await getLicenseByKey(licenseKey);
    return { success: true, license: updatedLicense || undefined };
  } catch (error) {
    console.error('Failed to activate license:', error);
    return { success: false, error: 'Activation failed. Please try again.' };
  }
}

/**
 * Update license heartbeat (called periodically to verify device)
 */
export async function updateHeartbeat(licenseKey: string, deviceFingerprint: string): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    const result = await pool.query(
      `UPDATE oracle_licenses
       SET last_heartbeat = NOW()
       WHERE license_key = $1 AND device_fingerprint = $2 AND status = 'active'
       RETURNING id`,
      [licenseKey, deviceFingerprint]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Failed to update heartbeat:', error);
    return false;
  }
}

/**
 * Revoke a license (admin action)
 */
export async function revokeLicense(licenseKey: string, reason?: string): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    await pool.query(
      `UPDATE oracle_licenses
       SET status = 'revoked', notes = COALESCE(notes || E'\\n', '') || $2
       WHERE license_key = $1`,
      [licenseKey, `Revoked: ${reason || 'No reason provided'} (${new Date().toISOString()})`]
    );
    console.log(`❌ License revoked: ${licenseKey}`);
    return true;
  } catch (error) {
    console.error('Failed to revoke license:', error);
    return false;
  }
}

/**
 * Unbind device from license (admin action for device transfer)
 */
export async function unbindDevice(licenseKey: string): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    await pool.query(
      `UPDATE oracle_licenses
       SET device_fingerprint = NULL, device_info = NULL,
           notes = COALESCE(notes || E'\\n', '') || $2
       WHERE license_key = $1`,
      [licenseKey, `Device unbound (${new Date().toISOString()})`]
    );
    console.log(`🔓 Device unbound from license: ${licenseKey}`);
    return true;
  } catch (error) {
    console.error('Failed to unbind device:', error);
    return false;
  }
}

/**
 * Renew license (extend expiry by 1 year)
 */
export async function renewLicense(licenseKey: string, paymentReference?: string): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    const license = await getLicenseByKey(licenseKey);
    if (!license) return false;

    // Extend from current expiry or now, whichever is later
    const baseDate = new Date(license.expires_at) > new Date()
      ? new Date(license.expires_at)
      : new Date();
    const newExpiry = new Date(baseDate.getTime() + 365 * 24 * 60 * 60 * 1000);

    await pool.query(
      `UPDATE oracle_licenses
       SET expires_at = $2, status = 'active',
           payment_reference = COALESCE($3, payment_reference),
           notes = COALESCE(notes || E'\\n', '') || $4
       WHERE license_key = $1`,
      [
        licenseKey,
        newExpiry,
        paymentReference,
        `Renewed until ${newExpiry.toISOString()} (${new Date().toISOString()})`
      ]
    );
    console.log(`🔄 License renewed: ${licenseKey} until ${newExpiry.toISOString()}`);
    return true;
  } catch (error) {
    console.error('Failed to renew license:', error);
    return false;
  }
}

/**
 * Get all licenses (admin)
 */
export async function getAllLicenses(): Promise<OracleLicense[]> {
  const pool = await getPostgresPool();
  if (!pool) return [];

  await initOracleTables();

  try {
    const result = await pool.query(
      `SELECT * FROM oracle_licenses ORDER BY created_at DESC`
    );
    return result.rows as unknown as OracleLicense[];
  } catch (error) {
    console.error('Failed to get licenses:', error);
    return [];
  }
}

// ============================================
// PAYMENT OPERATIONS
// ============================================

/**
 * Create a payment verification request
 */
export async function createPaymentRequest(data: {
  transactionCode: string;
  paymentMethod: 'mpesa' | 'bank';
  email: string;
  phone: string;
  name?: string;
  amount: number;
  currency?: string;
  deviceFingerprint?: string;
}): Promise<{ success: boolean; error?: string }> {
  const pool = await getPostgresPool();
  if (!pool) {
    return { success: false, error: 'Database not available' };
  }

  await initOracleTables();

  try {
    // Check for duplicate
    const existing = await pool.query(
      `SELECT id FROM oracle_payments WHERE transaction_code = $1`,
      [data.transactionCode.toUpperCase().trim()]
    );

    if (existing.rows.length > 0) {
      return { success: false, error: 'This transaction has already been submitted for verification' };
    }

    await pool.query(
      `INSERT INTO oracle_payments
       (transaction_code, payment_method, customer_email, customer_phone, customer_name,
        amount, currency, device_fingerprint, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')`,
      [
        data.transactionCode.toUpperCase().trim(),
        data.paymentMethod,
        data.email.toLowerCase().trim(),
        data.phone.trim(),
        data.name?.trim() || null,
        data.amount,
        data.currency || 'KES',
        data.deviceFingerprint || null,
      ]
    );

    console.log(`💳 Payment request created: ${data.transactionCode}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to create payment request:', error);
    return { success: false, error: 'Failed to submit payment verification' };
  }
}

/**
 * Verify a payment and create license (admin action)
 */
export async function verifyPayment(
  transactionCode: string,
  adminUser: string
): Promise<{ success: boolean; licenseKey?: string; error?: string }> {
  const pool = await getPostgresPool();
  if (!pool) {
    return { success: false, error: 'Database not available' };
  }

  await initOracleTables();

  try {
    // Get payment
    const paymentResult = await pool.query(
      `SELECT * FROM oracle_payments WHERE transaction_code = $1`,
      [transactionCode.toUpperCase().trim()]
    );

    const payment = paymentResult.rows[0] as unknown as OraclePayment | undefined;
    if (!payment) {
      return { success: false, error: 'Payment not found' };
    }

    if (payment.status === 'verified') {
      return { success: false, error: 'Payment already verified', licenseKey: payment.license_key || undefined };
    }

    // Create license
    const licenseResult = await createLicense({
      email: payment.customer_email,
      phone: payment.customer_phone,
      name: payment.customer_name || undefined,
      paymentReference: transactionCode,
    });

    if (!licenseResult.success || !licenseResult.licenseKey) {
      return { success: false, error: licenseResult.error || 'Failed to create license' };
    }

    // Update payment
    await pool.query(
      `UPDATE oracle_payments
       SET status = 'verified', license_key = $2, verified_at = NOW(), verified_by = $3
       WHERE transaction_code = $1`,
      [transactionCode, licenseResult.licenseKey, adminUser]
    );

    console.log(`✅ Payment verified: ${transactionCode} → License: ${licenseResult.licenseKey}`);
    return { success: true, licenseKey: licenseResult.licenseKey };
  } catch (error) {
    console.error('Failed to verify payment:', error);
    return { success: false, error: 'Failed to verify payment' };
  }
}

/**
 * Reject a payment (admin action)
 */
export async function rejectPayment(
  transactionCode: string,
  reason: string,
  adminUser: string
): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    await pool.query(
      `UPDATE oracle_payments
       SET status = 'rejected', rejection_reason = $2, verified_at = NOW(), verified_by = $3
       WHERE transaction_code = $1`,
      [transactionCode, reason, adminUser]
    );
    console.log(`❌ Payment rejected: ${transactionCode}`);
    return true;
  } catch (error) {
    console.error('Failed to reject payment:', error);
    return false;
  }
}

/**
 * Get pending payments (admin)
 */
export async function getPendingPayments(): Promise<OraclePayment[]> {
  const pool = await getPostgresPool();
  if (!pool) return [];

  await initOracleTables();

  try {
    const result = await pool.query(
      `SELECT * FROM oracle_payments WHERE status = 'pending' ORDER BY created_at ASC`
    );
    return result.rows as unknown as OraclePayment[];
  } catch (error) {
    console.error('Failed to get pending payments:', error);
    return [];
  }
}

/**
 * Get all payments (admin)
 */
export async function getAllPayments(): Promise<OraclePayment[]> {
  const pool = await getPostgresPool();
  if (!pool) return [];

  await initOracleTables();

  try {
    const result = await pool.query(
      `SELECT * FROM oracle_payments ORDER BY created_at DESC`
    );
    return result.rows as unknown as OraclePayment[];
  } catch (error) {
    console.error('Failed to get payments:', error);
    return [];
  }
}

// ============================================
// LOGGING & RATE LIMITING
// ============================================

/**
 * Log activation attempt
 */
export async function logActivationAttempt(log: ActivationLog): Promise<void> {
  const pool = await getPostgresPool();
  if (!pool) return;

  await initOracleTables();

  try {
    await pool.query(
      `INSERT INTO oracle_activation_logs
       (license_key, device_fingerprint, device_info, ip_address, user_agent, success, failure_reason)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        log.license_key,
        log.device_fingerprint,
        JSON.stringify(log.device_info || {}),
        log.ip_address || null,
        log.user_agent || null,
        log.success,
        log.failure_reason || null,
      ]
    );
  } catch (error) {
    console.error('Failed to log activation:', error);
  }
}

/**
 * Check rate limit for activation attempts
 * Returns true if within limit, false if exceeded
 */
export async function checkRateLimit(identifier: string, type: 'device' | 'ip'): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return true; // Allow if no database

  await initOracleTables();

  try {
    // Clean up old entries
    await pool.query(
      `DELETE FROM oracle_rate_limits WHERE window_start < NOW() - INTERVAL '1 hour'`
    );

    // Check/update rate limit
    const result = await pool.query(
      `INSERT INTO oracle_rate_limits (identifier, identifier_type, attempts, window_start)
       VALUES ($1, $2, 1, NOW())
       ON CONFLICT (identifier, identifier_type)
       DO UPDATE SET
         attempts = CASE
           WHEN oracle_rate_limits.window_start < NOW() - INTERVAL '1 hour'
           THEN 1
           ELSE oracle_rate_limits.attempts + 1
         END,
         window_start = CASE
           WHEN oracle_rate_limits.window_start < NOW() - INTERVAL '1 hour'
           THEN NOW()
           ELSE oracle_rate_limits.window_start
         END
       RETURNING attempts`,
      [identifier, type]
    );

    const attempts = result.rows[0]?.attempts as number || 0;
    return attempts <= MAX_ACTIVATION_ATTEMPTS_PER_HOUR;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // Allow if error
  }
}

/**
 * Get license statistics (admin dashboard)
 */
export async function getLicenseStats(): Promise<{
  total: number;
  active: number;
  expired: number;
  revoked: number;
  pending: number;
  pendingPayments: number;
  revenueTotal: number;
}> {
  const pool = await getPostgresPool();
  if (!pool) {
    return { total: 0, active: 0, expired: 0, revoked: 0, pending: 0, pendingPayments: 0, revenueTotal: 0 };
  }

  await initOracleTables();

  try {
    const licenseStats = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE status = 'expired') as expired,
        COUNT(*) FILTER (WHERE status = 'revoked') as revoked,
        COUNT(*) FILTER (WHERE status = 'pending') as pending
      FROM oracle_licenses
    `);

    const paymentStats = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pending') as pending_payments,
        COALESCE(SUM(amount) FILTER (WHERE status = 'verified'), 0) as revenue
      FROM oracle_payments
    `);

    const ls = licenseStats.rows[0] || {};
    const ps = paymentStats.rows[0] || {};

    return {
      total: Number(ls.total) || 0,
      active: Number(ls.active) || 0,
      expired: Number(ls.expired) || 0,
      revoked: Number(ls.revoked) || 0,
      pending: Number(ls.pending) || 0,
      pendingPayments: Number(ps.pending_payments) || 0,
      revenueTotal: Number(ps.revenue) || 0,
    };
  } catch (error) {
    console.error('Failed to get stats:', error);
    return { total: 0, active: 0, expired: 0, revoked: 0, pending: 0, pendingPayments: 0, revenueTotal: 0 };
  }
}
