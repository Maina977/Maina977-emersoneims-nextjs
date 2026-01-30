/**
 * Generator Oracle - Licensing System
 * Device-locked license keys with IndexedDB storage
 */

import { initDatabase, saveSetting, getSetting, isDatabaseAvailable } from './indexedDBService';

// License key format: EIMS-XXXX-XXXX-XXXX
export interface License {
  key: string;
  email: string;
  phone: string;
  deviceId: string;
  activatedAt: string;
  expiresAt?: string; // null = lifetime
  status: 'active' | 'pending' | 'expired' | 'revoked';
  tier: 'pro'; // Single tier for now
}

// IndexedDB store name for licenses
const LICENSE_STORE_KEY = 'oracleLicense';

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
 */
export async function isLicensed(): Promise<boolean> {
  const license = await getLicense();

  if (!license) return false;
  if (license.status !== 'active') return false;

  // Check expiration
  if (license.expiresAt) {
    const expiryDate = new Date(license.expiresAt);
    if (expiryDate < new Date()) {
      return false;
    }
  }

  // Verify device fingerprint matches
  const currentDeviceId = await generateDeviceFingerprint();
  if (license.deviceId !== currentDeviceId) {
    // Device mismatch - license may have been transferred
    console.warn('License device mismatch');
    return false;
  }

  return true;
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

  // Try server validation
  try {
    const response = await fetch('/api/generator-oracle/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: normalizedKey,
        deviceId: await generateDeviceFingerprint(),
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        valid: true,
        message: 'License activated successfully',
        license: data.license,
      };
    }

    return {
      valid: false,
      message: data.error || 'License validation failed',
    };
  } catch (error) {
    // Network error - check if we have an existing valid license
    const existingLicense = await getLicense();
    if (existingLicense && existingLicense.key === normalizedKey && existingLicense.status === 'active') {
      return {
        valid: true,
        message: 'License verified offline',
        license: existingLicense,
      };
    }

    return {
      valid: false,
      message: 'Unable to verify license. Please check your internet connection.',
    };
  }
}

/**
 * Activate a new license
 */
export async function activateLicense(
  key: string,
  email: string,
  phone: string
): Promise<{ success: boolean; message: string }> {
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
    ...(validation.license || {}),
  };

  await saveLicense(license);

  return { success: true, message: 'License activated successfully!' };
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
