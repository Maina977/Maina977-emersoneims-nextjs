/**
 * GENERATOR ORACLE VERSION MANAGER
 * Handles version comparison and update detection for fault database
 *
 * @copyright 2026 Generator Oracle
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface FaultVersion {
  version: string;
  faultCount: number;
  checksum: string;
  releasedAt: string;
  isCurrent: boolean;
  changelog?: string[];
}

export interface VersionComparison {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  changeCount: number;
  changelog?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERSION PARSING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Parse semver version string
 */
export function parseVersion(version: string): {
  major: number;
  minor: number;
  patch: number;
} {
  const [major = 0, minor = 0, patch = 0] = version
    .replace(/^v/i, '')
    .split('.')
    .map(Number);
  return { major, minor, patch };
}

/**
 * Compare two versions
 * Returns: -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareVersions(versionA: string, versionB: string): number {
  const a = parseVersion(versionA);
  const b = parseVersion(versionB);

  if (a.major !== b.major) return a.major > b.major ? 1 : -1;
  if (a.minor !== b.minor) return a.minor > b.minor ? 1 : -1;
  if (a.patch !== b.patch) return a.patch > b.patch ? 1 : -1;
  return 0;
}

/**
 * Check if version A is newer than version B
 */
export function isNewerVersion(newVersion: string, currentVersion: string): boolean {
  return compareVersions(newVersion, currentVersion) > 0;
}

/**
 * Get the next version number
 */
export function incrementVersion(
  version: string,
  type: 'major' | 'minor' | 'patch' = 'patch'
): string {
  const v = parseVersion(version);

  switch (type) {
    case 'major':
      return `${v.major + 1}.0.0`;
    case 'minor':
      return `${v.major}.${v.minor + 1}.0`;
    case 'patch':
    default:
      return `${v.major}.${v.minor}.${v.patch + 1}`;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKSUM GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate a simple hash for fault data integrity check
 * Using FNV-1a hash for browser compatibility
 */
export function generateChecksum(data: string): string {
  let hash = 2166136261; // FNV offset basis
  const prime = 16777619; // FNV prime

  for (let i = 0; i < data.length; i++) {
    hash ^= data.charCodeAt(i);
    hash = Math.imul(hash, prime);
  }

  // Convert to hex string
  return ('00000000' + (hash >>> 0).toString(16)).slice(-8);
}

/**
 * Generate checksum for fault code array
 */
export function generateFaultChecksum(faults: Array<{ id: string; code: string }>): string {
  const sortedIds = faults.map(f => `${f.id}:${f.code}`).sort().join('|');
  return generateChecksum(sortedIds);
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERSION INFO
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get current fault database version from localStorage
 */
export function getLocalVersion(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem('oracle_fault_version');
  } catch {
    return null;
  }
}

/**
 * Set local fault database version
 */
export function setLocalVersion(version: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('oracle_fault_version', version);
    localStorage.setItem('oracle_fault_last_sync', new Date().toISOString());
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get last sync timestamp
 */
export function getLastSyncTime(): Date | null {
  if (typeof window === 'undefined') return null;

  try {
    const timestamp = localStorage.getItem('oracle_fault_last_sync');
    return timestamp ? new Date(timestamp) : null;
  } catch {
    return null;
  }
}

/**
 * Check if sync is needed (more than X hours since last sync)
 */
export function isSyncNeeded(maxAgeHours: number = 24): boolean {
  const lastSync = getLastSyncTime();
  if (!lastSync) return true;

  const hoursSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);
  return hoursSinceSync > maxAgeHours;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DELTA CALCULATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface FaultDelta {
  added: string[];     // IDs of new faults
  updated: string[];   // IDs of updated faults
  removed: string[];   // IDs of removed faults
}

/**
 * Calculate delta between two fault sets
 */
export function calculateFaultDelta(
  oldFaults: Map<string, string>, // id -> checksum
  newFaults: Map<string, string>
): FaultDelta {
  const added: string[] = [];
  const updated: string[] = [];
  const removed: string[] = [];

  // Find added and updated
  for (const [id, checksum] of newFaults) {
    if (!oldFaults.has(id)) {
      added.push(id);
    } else if (oldFaults.get(id) !== checksum) {
      updated.push(id);
    }
  }

  // Find removed
  for (const id of oldFaults.keys()) {
    if (!newFaults.has(id)) {
      removed.push(id);
    }
  }

  return { added, updated, removed };
}

/**
 * Format version info for display
 */
export function formatVersionInfo(version: FaultVersion): string {
  const date = new Date(version.releasedAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return `v${version.version} (${formattedDate}) - ${version.faultCount.toLocaleString()} fault codes`;
}
