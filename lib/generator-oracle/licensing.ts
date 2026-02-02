/**
 * Generator Oracle - Licensing System
 * Device-locked license keys with IndexedDB storage
 *
 * CRITICAL: ONE DEVICE PER LICENSE - NO SHARING ALLOWED
 * - License is bound to the first device that activates it
 * - Cannot be used on any other device without admin intervention
 * - 24-hour heartbeat check required for continued access
 * - Expiry enforcement with renewal flow
 */

import { initDatabase, saveSetting, getSetting, isDatabaseAvailable } from './indexedDBService';

// License key format: EIMS-XXXX-XXXX-XXXX
export interface License {
  key: string;
  email: string;
  phone: string;
  deviceId: string;
  activatedAt: string;
  expiresAt?: string; // null = lifetime (not used in production)
  status: 'active' | 'pending' | 'expired' | 'revoked';
  tier: 'pro'; // Single tier for now
  lastHeartbeat?: string; // Last server validation timestamp
}

// License configuration
export const LICENSE_CONFIG = {
  maxDevices: 1, // ONE device per license - NO SHARING
  heartbeatIntervalMs: 24 * 60 * 60 * 1000, // 24 hours
  expiryWarningDays: 30, // Show warning 30 days before expiry
  priceKES: 20000,
  periodYears: 1,
};

// IndexedDB store name for licenses
const LICENSE_STORE_KEY = 'oracleLicense';

/**
 * Check if license is expired
 */
export function isLicenseExpired(license: License): boolean {
  if (!license.expiresAt) return false; // Lifetime license
  return new Date(license.expiresAt) < new Date();
}

/**
 * Get days until license expires
 * Returns negative number if already expired
 */
export function getDaysUntilExpiry(license: License): number {
  if (!license.expiresAt) return Infinity; // Lifetime
  const diff = new Date(license.expiresAt).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if license needs renewal warning (within 30 days of expiry)
 */
export function needsRenewalWarning(license: License): boolean {
  const daysLeft = getDaysUntilExpiry(license);
  return daysLeft > 0 && daysLeft <= LICENSE_CONFIG.expiryWarningDays;
}

/**
 * Check if heartbeat is stale (over 24 hours old)
 */
export function isHeartbeatStale(license: License): boolean {
  if (!license.lastHeartbeat) return true;
  const lastBeat = new Date(license.lastHeartbeat).getTime();
  return Date.now() - lastBeat > LICENSE_CONFIG.heartbeatIntervalMs;
}

/**
 * Generate a unique device fingerprint based on browser characteristics
 * This ties the license to a specific browser/device
 */
export async function generateDeviceFingerprint(): Promise<string> {
  if (typeof window === 'undefined') return '';

  const components: string[] = [];

  // Screen resolution
  components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Language
  components.push(navigator.language);

  // Platform
  components.push(navigator.platform || 'unknown');

  // Hardware concurrency (CPU cores)
  components.push(String(navigator.hardwareConcurrency || 0));

  // Device memory (if available)
  const nav = navigator as Navigator & { deviceMemory?: number };
  components.push(String(nav.deviceMemory || 0));

  // Canvas fingerprint
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Generator Oracle 🔮', 2, 2);
      components.push(canvas.toDataURL().slice(-50));
    }
  } catch {
    components.push('no-canvas');
  }

  // WebGL renderer
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && gl instanceof WebGLRenderingContext) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown');
      }
    }
  } catch {
    components.push('no-webgl');
  }

  // Generate hash from components
  const str = components.join('|');
  const hash = await hashString(str);
  return hash.substring(0, 16).toUpperCase();
}

/**
 * Simple string hashing function
 */
async function hashString(str: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback simple hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Validate license key format
 * Format: EIMS-XXXX-XXXX-XXXX where X is alphanumeric
 */
export function isValidLicenseFormat(key: string): boolean {
  const pattern = /^EIMS-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return pattern.test(key.toUpperCase());
}

/**
 * Save license to IndexedDB
 */
export async function saveLicense(license: License): Promise<void> {
  if (!isDatabaseAvailable()) {
    console.warn('IndexedDB not available for license storage');
    return;
  }

  await initDatabase();
  await saveSetting(LICENSE_STORE_KEY as any, license as any);

  // Also store in localStorage as backup
  try {
    localStorage.setItem('oracle_license', JSON.stringify(license));
  } catch {
    // localStorage might be unavailable
  }
}

/**
 * Get license from IndexedDB or localStorage
 */
export async function getLicense(): Promise<License | null> {
  if (!isDatabaseAvailable()) {
    // Try localStorage fallback
    try {
      const stored = localStorage.getItem('oracle_license');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore errors
    }
    return null;
  }

  try {
    await initDatabase();
    const license = await getSetting(LICENSE_STORE_KEY as any);

    if (license) {
      return license as unknown as License;
    }

    // Try localStorage fallback
    try {
      const stored = localStorage.getItem('oracle_license');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate to IndexedDB
        await saveLicense(parsed);
        return parsed;
      }
    } catch {
      // Ignore errors
    }

    return null;
  } catch (error) {
    console.error('Error getting license:', error);
    return null;
  }
}

/**
 * Check if device has a valid active license
 * Performs strict device binding and expiry checks
 */
export async function isLicensed(): Promise<boolean> {
  const license = await getLicense();

  if (!license) return false;
  if (license.status !== 'active') return false;

  // Check expiration
  if (isLicenseExpired(license)) {
    console.warn('License has expired');
    return false;
  }

  // Verify device fingerprint matches - CRITICAL for one-device enforcement
  const currentDeviceId = await generateDeviceFingerprint();
  if (license.deviceId !== currentDeviceId) {
    // Device mismatch - ONE DEVICE PER LICENSE
    console.warn('License device mismatch - license bound to different device');
    return false;
  }

  return true;
}

/**
 * Perform server-side license validation with heartbeat
 * Should be called periodically (at least every 24 hours)
 */
export async function validateLicenseWithServer(forceCheck = false): Promise<{
  valid: boolean;
  license: License | null;
  reason?: string;
}> {
  const license = await getLicense();

  if (!license) {
    return { valid: false, license: null, reason: 'No license found' };
  }

  // Check if we need to validate with server
  const needsServerCheck = forceCheck || isHeartbeatStale(license);

  if (needsServerCheck) {
    try {
      const deviceId = await generateDeviceFingerprint();
      const response = await fetch('/api/generator-oracle/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: license.key,
          deviceId,
          heartbeat: true,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update local license with server data
        const updatedLicense: License = {
          ...license,
          status: data.license?.status || 'active',
          expiresAt: data.license?.expiresAt || license.expiresAt,
          lastHeartbeat: new Date().toISOString(),
        };
        await saveLicense(updatedLicense);
        return { valid: true, license: updatedLicense };
      }

      // Server rejected - update local status
      if (data.error?.includes('expired')) {
        const expiredLicense: License = { ...license, status: 'expired' };
        await saveLicense(expiredLicense);
        return { valid: false, license: expiredLicense, reason: 'License has expired' };
      }

      if (data.error?.includes('revoked')) {
        const revokedLicense: License = { ...license, status: 'revoked' };
        await saveLicense(revokedLicense);
        return { valid: false, license: revokedLicense, reason: 'License has been revoked' };
      }

      if (data.error?.includes('different device')) {
        return { valid: false, license, reason: 'License bound to different device' };
      }

      return { valid: false, license, reason: data.error || 'Server validation failed' };
    } catch (error) {
      // Network error - allow offline access if heartbeat isn't too stale (48 hours grace)
      const gracePeriodMs = 48 * 60 * 60 * 1000;
      if (license.lastHeartbeat) {
        const timeSinceHeartbeat = Date.now() - new Date(license.lastHeartbeat).getTime();
        if (timeSinceHeartbeat < gracePeriodMs && license.status === 'active' && !isLicenseExpired(license)) {
          console.log('Offline grace period - allowing access');
          return { valid: true, license };
        }
      }
      return { valid: false, license, reason: 'Unable to verify license. Please connect to the internet.' };
    }
  }

  // Local validation (heartbeat not stale)
  if (license.status !== 'active') {
    return { valid: false, license, reason: `License status: ${license.status}` };
  }

  if (isLicenseExpired(license)) {
    return { valid: false, license, reason: 'License has expired' };
  }

  const currentDeviceId = await generateDeviceFingerprint();
  if (license.deviceId !== currentDeviceId) {
    return { valid: false, license, reason: 'License bound to different device' };
  }

  return { valid: true, license };
}

/**
 * Get license status with details
 */
export async function getLicenseStatus(): Promise<{
  isLicensed: boolean;
  license: License | null;
  reason?: string;
}> {
  const license = await getLicense();

  if (!license) {
    return { isLicensed: false, license: null, reason: 'No license found' };
  }

  if (license.status === 'pending') {
    return { isLicensed: false, license, reason: 'License pending verification' };
  }

  if (license.status === 'expired') {
    return { isLicensed: false, license, reason: 'License has expired' };
  }

  if (license.status === 'revoked') {
    return { isLicensed: false, license, reason: 'License has been revoked' };
  }

  if (license.expiresAt) {
    const expiryDate = new Date(license.expiresAt);
    if (expiryDate < new Date()) {
      return { isLicensed: false, license, reason: 'License has expired' };
    }
  }

  const currentDeviceId = await generateDeviceFingerprint();
  if (license.deviceId !== currentDeviceId) {
    return { isLicensed: false, license, reason: 'License registered to different device' };
  }

  return { isLicensed: true, license };
}

/**
 * Validate license key with server (or offline validation)
 * CRITICAL: Server enforces ONE device per license
 */
export async function validateLicense(key: string): Promise<{
  valid: boolean;
  message: string;
  license?: Partial<License>;
}> {
  // Validate format first
  if (!isValidLicenseFormat(key)) {
    return { valid: false, message: 'Invalid license key format' };
  }

  const normalizedKey = key.toUpperCase();
  const deviceId = await generateDeviceFingerprint();

  // Try server validation - this is where ONE device binding is enforced
  try {
    const response = await fetch('/api/generator-oracle/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: normalizedKey,
        deviceId,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        valid: true,
        message: 'License activated successfully',
        license: {
          ...data.license,
          lastHeartbeat: new Date().toISOString(),
        },
      };
    }

    // Specific error handling for device binding
    if (data.error?.includes('different device') || data.error?.includes('bound')) {
      return {
        valid: false,
        message: 'This license is already bound to another device. Each license can only be used on ONE device. Contact support to transfer your license.',
      };
    }

    return {
      valid: false,
      message: data.error || 'License validation failed',
    };
  } catch (error) {
    // Network error - check if we have an existing valid license for this device
    const existingLicense = await getLicense();
    if (
      existingLicense &&
      existingLicense.key === normalizedKey &&
      existingLicense.status === 'active' &&
      existingLicense.deviceId === deviceId &&
      !isLicenseExpired(existingLicense)
    ) {
      // Allow offline if heartbeat isn't too old
      if (existingLicense.lastHeartbeat) {
        const gracePeriodMs = 48 * 60 * 60 * 1000; // 48 hour grace period
        const timeSinceHeartbeat = Date.now() - new Date(existingLicense.lastHeartbeat).getTime();
        if (timeSinceHeartbeat < gracePeriodMs) {
          return {
            valid: true,
            message: 'License verified offline (limited time)',
            license: existingLicense,
          };
        }
      }
    }

    return {
      valid: false,
      message: 'Unable to verify license. Please check your internet connection.',
    };
  }
}

/**
 * Activate a new license
 * CRITICAL: This binds the license to THIS device permanently
 */
export async function activateLicense(
  key: string,
  email: string,
  phone: string
): Promise<{ success: boolean; message: string; license?: License }> {
  const validation = await validateLicense(key);

  if (!validation.valid) {
    return { success: false, message: validation.message };
  }

  const deviceId = await generateDeviceFingerprint();

  const license: License = {
    key: key.toUpperCase(),
    email,
    phone,
    deviceId,
    activatedAt: new Date().toISOString(),
    status: 'active',
    tier: 'pro',
    lastHeartbeat: new Date().toISOString(),
    ...(validation.license || {}),
  };

  await saveLicense(license);

  return { success: true, message: 'License activated successfully!', license };
}

/**
 * Get detailed license info for display
 */
export async function getLicenseInfo(): Promise<{
  isLicensed: boolean;
  license: License | null;
  daysRemaining: number;
  needsRenewal: boolean;
  isExpired: boolean;
  statusMessage: string;
} | null> {
  const license = await getLicense();

  if (!license) {
    return null;
  }

  const isExpired = isLicenseExpired(license);
  const daysRemaining = getDaysUntilExpiry(license);
  const needsRenewal = needsRenewalWarning(license);

  let statusMessage = '';
  if (license.status === 'revoked') {
    statusMessage = 'License has been revoked';
  } else if (isExpired) {
    statusMessage = 'License has expired';
  } else if (needsRenewal) {
    statusMessage = `License expires in ${daysRemaining} days`;
  } else if (license.status === 'active') {
    statusMessage = 'License is active';
  } else {
    statusMessage = `License status: ${license.status}`;
  }

  return {
    isLicensed: license.status === 'active' && !isExpired,
    license,
    daysRemaining,
    needsRenewal,
    isExpired,
    statusMessage,
  };
}

/**
 * Remove license (for testing or transfer)
 */
export async function removeLicense(): Promise<void> {
  if (!isDatabaseAvailable()) return;

  await initDatabase();
  await saveSetting(LICENSE_STORE_KEY as any, null as any);

  try {
    localStorage.removeItem('oracle_license');
  } catch {
    // Ignore errors
  }
}

/**
 * Generate a test license for development
 * Only works in development mode
 */
export function generateTestLicense(): string {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Test licenses only available in development');
  }

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
