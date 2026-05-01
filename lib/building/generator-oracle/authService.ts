/**
 * GENERATOR ORACLE AUTH SERVICE
 * User authentication and team management
 *
 * @copyright 2026 Generator Oracle
 */

import bcrypt from 'bcrypt';
import { getPostgresPool } from '@/lib/db';
import { randomBytes, createHash } from 'crypto';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface OracleUser {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  role: 'admin' | 'manager' | 'technician' | 'viewer';
  organization_id: number | null;
  license_key: string | null;
  is_active: boolean;
  created_at: Date;
  last_login: Date | null;
  avatar_url: string | null;
}

export interface OracleOrganization {
  id: number;
  name: string;
  license_key: string | null;
  max_users: number;
  settings: Record<string, unknown>;
  created_at: Date;
}

export interface OracleSession {
  id: number;
  user_id: number;
  session_token: string;
  device_fingerprint: string | null;
  ip_address: string | null;
  user_agent: string | null;
  expires_at: Date;
  created_at: Date;
}

export interface AuthResult {
  success: boolean;
  user?: OracleUser;
  sessionToken?: string;
  error?: string;
}

// Database row types for query results
interface OrgCheckRow {
  max_users: number;
  user_count: string | number;
}

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  phone: string | null;
  role: OracleUser['role'];
  organization_id: number | null;
  license_key: string | null;
  is_active: boolean;
  created_at: Date;
  last_login: Date | null;
  locked_until: Date | null;
  avatar_url: string | null;
  expires_at?: Date;
}

interface CountRow {
  count: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const BCRYPT_ROUNDS = 12;
const SESSION_DURATION_HOURS = 24 * 7; // 1 week
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize auth tables in database
 */
export async function initAuthTables(): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) {
    console.warn('Database not available for auth tables');
    return false;
  }

  try {
    // Organizations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_organizations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        license_key VARCHAR(19),
        max_users INTEGER DEFAULT 5,
        settings JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'technician',
        organization_id INTEGER REFERENCES oracle_organizations(id),
        license_key VARCHAR(19),
        is_active BOOLEAN DEFAULT TRUE,
        avatar_url TEXT,
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login TIMESTAMP WITH TIME ZONE,
        failed_login_attempts INTEGER DEFAULT 0,
        locked_until TIMESTAMP WITH TIME ZONE
      )
    `);

    // Sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES oracle_users(id) ON DELETE CASCADE,
        session_token VARCHAR(64) UNIQUE NOT NULL,
        device_fingerprint VARCHAR(64),
        ip_address VARCHAR(45),
        user_agent TEXT,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Login attempts tracking
    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_login_attempts (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45),
        success BOOLEAN NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create indexes
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_oracle_users_email ON oracle_users(email)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_oracle_users_org ON oracle_users(organization_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_oracle_sessions_token ON oracle_sessions(session_token)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_oracle_sessions_user ON oracle_sessions(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_oracle_login_attempts_email ON oracle_login_attempts(email, created_at)`);

    return true;
  } catch (error) {
    console.error('Failed to initialize auth tables:', error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// USER REGISTRATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Register a new user
 */
export async function registerUser(data: {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  organizationId?: number;
  licenseKey?: string;
  role?: OracleUser['role'];
}): Promise<AuthResult> {
  const pool = await getPostgresPool();
  if (!pool) {
    return { success: false, error: 'Database not available' };
  }

  await initAuthTables();

  try {
    const email = data.email.toLowerCase().trim();

    // Validate email
    if (!isValidEmail(email)) {
      return { success: false, error: 'Invalid email address' };
    }

    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
    }

    // Check if email exists
    const existingUser = await pool.query(
      'SELECT id FROM oracle_users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Check organization user limit
    if (data.organizationId) {
      const orgCheck = await pool.query(
        `SELECT o.max_users, COUNT(u.id) as user_count
         FROM oracle_organizations o
         LEFT JOIN oracle_users u ON u.organization_id = o.id
         WHERE o.id = $1
         GROUP BY o.id`,
        [data.organizationId]
      );

      if (orgCheck.rows.length > 0) {
        const row = orgCheck.rows[0] as unknown as OrgCheckRow;
        const userCount = typeof row.user_count === 'string' ? parseInt(row.user_count) : row.user_count;
        if (userCount >= row.max_users) {
          return { success: false, error: 'Organization has reached maximum user limit' };
        }
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    // Create user
    const result = await pool.query(
      `INSERT INTO oracle_users
       (email, password_hash, name, phone, organization_id, license_key, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, name, phone, role, organization_id, license_key, is_active, created_at`,
      [
        email,
        passwordHash,
        data.name?.trim() || null,
        data.phone?.trim() || null,
        data.organizationId || null,
        data.licenseKey || null,
        data.role || 'technician',
      ]
    );

    const user = result.rows[0] as unknown as OracleUser;

    console.log(`✅ User registered: ${email}`);
    return { success: true, user };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// USER LOGIN
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Authenticate user and create session
 */
export async function loginUser(data: {
  email: string;
  password: string;
  deviceFingerprint?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<AuthResult> {
  const pool = await getPostgresPool();
  if (!pool) {
    return { success: false, error: 'Database not available' };
  }

  await initAuthTables();

  try {
    const email = data.email.toLowerCase().trim();

    // Check rate limiting
    const recentAttempts = await pool.query(
      `SELECT COUNT(*) as count FROM oracle_login_attempts
       WHERE email = $1 AND created_at > NOW() - INTERVAL '${LOCKOUT_DURATION_MINUTES} minutes'
       AND success = false`,
      [email]
    );

    const attemptCount = (recentAttempts.rows[0] as unknown as CountRow).count;
    if (parseInt(attemptCount) >= MAX_LOGIN_ATTEMPTS) {
      return {
        success: false,
        error: `Too many failed attempts. Please try again in ${LOCKOUT_DURATION_MINUTES} minutes.`,
      };
    }

    // Get user
    const userResult = await pool.query(
      `SELECT id, email, password_hash, name, phone, role, organization_id,
              license_key, is_active, created_at, locked_until
       FROM oracle_users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      await logLoginAttempt(pool, email, data.ipAddress, false);
      return { success: false, error: 'Invalid email or password' };
    }

    const user = userResult.rows[0] as unknown as UserRow;

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return { success: false, error: 'Account is temporarily locked. Please try again later.' };
    }

    // Check if active
    if (!user.is_active) {
      return { success: false, error: 'Account is deactivated. Please contact support.' };
    }

    // Verify password
    const passwordValid = await bcrypt.compare(data.password, user.password_hash);
    if (!passwordValid) {
      await logLoginAttempt(pool, email, data.ipAddress, false);

      // Increment failed attempts
      await pool.query(
        'UPDATE oracle_users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = $1',
        [user.id]
      );

      return { success: false, error: 'Invalid email or password' };
    }

    // Create session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000);

    await pool.query(
      `INSERT INTO oracle_sessions
       (user_id, session_token, device_fingerprint, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        user.id,
        sessionToken,
        data.deviceFingerprint || null,
        data.ipAddress || null,
        data.userAgent || null,
        expiresAt,
      ]
    );

    // Update last login and reset failed attempts
    await pool.query(
      `UPDATE oracle_users
       SET last_login = NOW(), failed_login_attempts = 0, locked_until = NULL
       WHERE id = $1`,
      [user.id]
    );

    await logLoginAttempt(pool, email, data.ipAddress, true);

    // Build user object (without password)
    const safeUser: OracleUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      organization_id: user.organization_id,
      license_key: user.license_key,
      is_active: user.is_active,
      created_at: user.created_at,
      last_login: new Date(),
      avatar_url: user.avatar_url,
    };

    console.log(`✅ User logged in: ${email}`);
    return { success: true, user: safeUser, sessionToken };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Validate session and get user
 */
export async function validateSession(sessionToken: string): Promise<AuthResult> {
  const pool = await getPostgresPool();
  if (!pool) {
    return { success: false, error: 'Database not available' };
  }

  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.name, u.phone, u.role, u.organization_id,
              u.license_key, u.is_active, u.created_at, u.last_login, u.avatar_url,
              s.expires_at
       FROM oracle_sessions s
       JOIN oracle_users u ON u.id = s.user_id
       WHERE s.session_token = $1`,
      [sessionToken]
    );

    if (result.rows.length === 0) {
      return { success: false, error: 'Invalid session' };
    }

    const session = result.rows[0] as unknown as UserRow;

    // Check expiration
    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      // Delete expired session
      await pool.query('DELETE FROM oracle_sessions WHERE session_token = $1', [sessionToken]);
      return { success: false, error: 'Session expired' };
    }

    // Check if user is active
    if (!session.is_active) {
      return { success: false, error: 'Account is deactivated' };
    }

    const user: OracleUser = {
      id: session.id,
      email: session.email,
      name: session.name,
      phone: session.phone,
      role: session.role,
      organization_id: session.organization_id,
      license_key: session.license_key,
      is_active: session.is_active,
      created_at: session.created_at,
      last_login: session.last_login,
      avatar_url: session.avatar_url,
    };

    return { success: true, user, sessionToken };
  } catch (error) {
    console.error('Session validation error:', error);
    return { success: false, error: 'Session validation failed' };
  }
}

/**
 * Logout - invalidate session
 */
export async function logoutUser(sessionToken: string): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    await pool.query('DELETE FROM oracle_sessions WHERE session_token = $1', [sessionToken]);
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

/**
 * Logout from all devices
 */
export async function logoutAllDevices(userId: number): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    await pool.query('DELETE FROM oracle_sessions WHERE user_id = $1', [userId]);
    return true;
  } catch (error) {
    console.error('Logout all error:', error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create an organization
 */
export async function createOrganization(data: {
  name: string;
  licenseKey?: string;
  maxUsers?: number;
}): Promise<{ success: boolean; organization?: OracleOrganization; error?: string }> {
  const pool = await getPostgresPool();
  if (!pool) {
    return { success: false, error: 'Database not available' };
  }

  await initAuthTables();

  try {
    const result = await pool.query(
      `INSERT INTO oracle_organizations (name, license_key, max_users)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.name.trim(), data.licenseKey || null, data.maxUsers || 5]
    );

    return { success: true, organization: result.rows[0] as unknown as OracleOrganization };
  } catch (error) {
    console.error('Create organization error:', error);
    return { success: false, error: 'Failed to create organization' };
  }
}

/**
 * Get organization members
 */
export async function getOrganizationMembers(organizationId: number): Promise<OracleUser[]> {
  const pool = await getPostgresPool();
  if (!pool) return [];

  try {
    const result = await pool.query(
      `SELECT id, email, name, phone, role, organization_id, license_key,
              is_active, created_at, last_login, avatar_url
       FROM oracle_users
       WHERE organization_id = $1
       ORDER BY created_at DESC`,
      [organizationId]
    );

    return result.rows as unknown as OracleUser[];
  } catch (error) {
    console.error('Get members error:', error);
    return [];
  }
}

/**
 * Update user role (admin/manager only)
 */
export async function updateUserRole(
  userId: number,
  newRole: OracleUser['role'],
  updatedBy: number
): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    // Verify updater has permission
    const updaterResult = await pool.query(
      'SELECT role FROM oracle_users WHERE id = $1',
      [updatedBy]
    );

    if (updaterResult.rows.length === 0) return false;

    const updaterRole = updaterResult.rows[0].role;
    if (updaterRole !== 'admin' && updaterRole !== 'manager') {
      return false;
    }

    // Managers cannot create admins
    if (updaterRole === 'manager' && newRole === 'admin') {
      return false;
    }

    await pool.query(
      'UPDATE oracle_users SET role = $2 WHERE id = $1',
      [userId, newRole]
    );

    return true;
  } catch (error) {
    console.error('Update role error:', error);
    return false;
  }
}

/**
 * Deactivate user
 */
export async function deactivateUser(userId: number): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    await pool.query('UPDATE oracle_users SET is_active = false WHERE id = $1', [userId]);
    await pool.query('DELETE FROM oracle_sessions WHERE user_id = $1', [userId]);
    return true;
  } catch (error) {
    console.error('Deactivate user error:', error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PASSWORD MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Change password
 */
export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const pool = await getPostgresPool();
  if (!pool) {
    return { success: false, error: 'Database not available' };
  }

  try {
    // Get current password hash
    const userResult = await pool.query(
      'SELECT password_hash FROM oracle_users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return { success: false, error: 'User not found' };
    }

    // Verify current password
    const userData = userResult.rows[0] as unknown as UserRow;
    const valid = await bcrypt.compare(currentPassword, userData.password_hash);
    if (!valid) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Validate new password
    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Hash and update
    const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await pool.query(
      'UPDATE oracle_users SET password_hash = $2 WHERE id = $1',
      [userId, newHash]
    );

    // Invalidate all sessions
    await logoutAllDevices(userId);

    return { success: true };
  } catch (error) {
    console.error('Change password error:', error);
    return { success: false, error: 'Failed to change password' };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate secure session token
 */
function generateSessionToken(): string {
  const bytes = randomBytes(32);
  return createHash('sha256').update(bytes).digest('hex');
}

/**
 * Log login attempt
 */
async function logLoginAttempt(
  pool: Awaited<ReturnType<typeof getPostgresPool>>,
  email: string,
  ipAddress: string | undefined,
  success: boolean
): Promise<void> {
  if (!pool) return;

  try {
    await pool.query(
      `INSERT INTO oracle_login_attempts (email, ip_address, success)
       VALUES ($1, $2, $3)`,
      [email, ipAddress || null, success]
    );
  } catch (error) {
    console.error('Log login attempt error:', error);
  }
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  return { valid: true };
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const pool = await getPostgresPool();
  if (!pool) return 0;

  try {
    const result = await pool.query(
      `DELETE FROM oracle_sessions WHERE expires_at < NOW() RETURNING id`
    );
    return result.rows.length;
  } catch (error) {
    console.error('Cleanup sessions error:', error);
    return 0;
  }
}
