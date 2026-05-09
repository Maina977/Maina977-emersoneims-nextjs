/**
 * GENERATOR ORACLE SYNC SERVICE
 * Cloud sync for fault database with delta updates
 *
 * @copyright 2026 Generator Oracle
 */

import {
  getLocalVersion,
  setLocalVersion,
  isSyncNeeded,
  generateFaultChecksum,
  type FaultVersion,
  type VersionComparison,
} from './versionManager';
import {
  saveFaultCodes,
  getAllFaultCodes,
  saveSetting,
} from './indexedDBService';
import type { ControllerFaultCode } from './controllerFaultCodes';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SyncStatus {
  lastSync: Date | null;
  currentVersion: string | null;
  isOutdated: boolean;
  isSyncing: boolean;
}

export interface SyncResult {
  success: boolean;
  version?: string;
  faultsUpdated?: number;
  error?: string;
  isFullSync?: boolean;
}

export interface SyncProgress {
  phase: 'checking' | 'downloading' | 'applying' | 'complete' | 'error';
  progress: number; // 0-100
  message: string;
}

type SyncProgressCallback = (progress: SyncProgress) => void;

// ═══════════════════════════════════════════════════════════════════════════════
// SYNC STATE
// ═══════════════════════════════════════════════════════════════════════════════

let isSyncing = false;
let syncAbortController: AbortController | null = null;

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SYNC FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check for updates without downloading
 */
export async function checkForUpdates(): Promise<VersionComparison> {
  const currentVersion = getLocalVersion() || '0.0.0';

  try {
    const response = await fetch(`/api/generator-oracle/sync?version=${currentVersion}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    return {
      hasUpdate: data.hasUpdate,
      currentVersion,
      latestVersion: data.latestVersion || currentVersion,
      changeCount: data.changeCount || 0,
      changelog: data.changelog,
    };
  } catch (error) {
    console.error('Check for updates failed:', error);
    return {
      hasUpdate: false,
      currentVersion,
      latestVersion: currentVersion,
      changeCount: 0,
    };
  }
}

/**
 * Perform full sync with progress callback
 */
export async function syncFaultDatabase(
  onProgress?: SyncProgressCallback,
  force: boolean = false
): Promise<SyncResult> {
  // Prevent concurrent syncs
  if (isSyncing) {
    return { success: false, error: 'Sync already in progress' };
  }

  // Check if sync is needed
  if (!force && !isSyncNeeded(24)) {
    const localVersion = getLocalVersion();
    if (localVersion) {
      return { success: true, version: localVersion, faultsUpdated: 0 };
    }
  }

  isSyncing = true;
  syncAbortController = new AbortController();

  try {
    // Phase 1: Check for updates
    onProgress?.({
      phase: 'checking',
      progress: 10,
      message: 'Checking for updates...',
    });

    const comparison = await checkForUpdates();

    if (!comparison.hasUpdate && !force) {
      onProgress?.({
        phase: 'complete',
        progress: 100,
        message: 'Already up to date',
      });
      isSyncing = false;
      return { success: true, version: comparison.currentVersion, faultsUpdated: 0 };
    }

    // Phase 2: Download updates
    onProgress?.({
      phase: 'downloading',
      progress: 30,
      message: `Downloading ${comparison.changeCount} updates...`,
    });

    const currentVersion = getLocalVersion() || '0.0.0';

    const response = await fetch('/api/generator-oracle/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromVersion: currentVersion,
        toVersion: comparison.latestVersion,
      }),
      signal: syncAbortController.signal,
    });

    if (!response.ok) {
      throw new Error(`Download failed: HTTP ${response.status}`);
    }

    const syncData = await response.json();

    if (!syncData.success) {
      throw new Error(syncData.error || 'Sync failed');
    }

    // Phase 3: Apply updates
    onProgress?.({
      phase: 'applying',
      progress: 60,
      message: 'Applying updates...',
    });

    const faults = syncData.faults as ControllerFaultCode[];

    if (faults && faults.length > 0) {
      // For full sync, replace all
      if (syncData.isFullSync) {
        await saveFaultCodes(faults);
      } else {
        // For delta sync, merge
        await applyDeltaSync(faults, syncData.removed || []);
      }
    }

    onProgress?.({
      phase: 'applying',
      progress: 90,
      message: 'Updating version info...',
    });

    // Update version
    setLocalVersion(syncData.version);
    await saveSetting('lastSyncTimestamp', new Date().toISOString());

    onProgress?.({
      phase: 'complete',
      progress: 100,
      message: `Updated to v${syncData.version}`,
    });

    isSyncing = false;
    return {
      success: true,
      version: syncData.version,
      faultsUpdated: faults?.length || 0,
      isFullSync: syncData.isFullSync,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    onProgress?.({
      phase: 'error',
      progress: 0,
      message: `Sync failed: ${errorMessage}`,
    });

    isSyncing = false;
    return { success: false, error: errorMessage };
  }
}

/**
 * Apply delta sync (merge updates)
 */
async function applyDeltaSync(
  updates: ControllerFaultCode[],
  removedIds: string[]
): Promise<void> {
  // Get current faults
  const currentFaults = await getAllFaultCodes();
  const faultMap = new Map(currentFaults.map(f => [f.id, f]));

  // Apply updates
  for (const fault of updates) {
    faultMap.set(fault.id, fault);
  }

  // Remove deleted
  for (const id of removedIds) {
    faultMap.delete(id);
  }

  // Save all
  await saveFaultCodes(Array.from(faultMap.values()));
}

/**
 * Abort current sync
 */
export function abortSync(): void {
  if (syncAbortController) {
    syncAbortController.abort();
    syncAbortController = null;
  }
  isSyncing = false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SYNC STATUS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get current sync status
 */
export function getSyncStatus(): SyncStatus {
  const lastSyncStr = typeof window !== 'undefined'
    ? localStorage.getItem('oracle_fault_last_sync')
    : null;

  return {
    lastSync: lastSyncStr ? new Date(lastSyncStr) : null,
    currentVersion: getLocalVersion(),
    isOutdated: isSyncNeeded(24),
    isSyncing,
  };
}

/**
 * Check if syncing
 */
export function isSyncInProgress(): boolean {
  return isSyncing;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO SYNC
// ═══════════════════════════════════════════════════════════════════════════════

let autoSyncInterval: NodeJS.Timeout | null = null;

/**
 * Start auto sync at interval
 */
export function startAutoSync(intervalHours: number = 24): void {
  stopAutoSync();

  // Initial sync
  syncFaultDatabase().catch(console.error);

  // Set interval
  autoSyncInterval = setInterval(
    () => syncFaultDatabase().catch(console.error),
    intervalHours * 60 * 60 * 1000
  );
}

/**
 * Stop auto sync
 */
export function stopAutoSync(): void {
  if (autoSyncInterval) {
    clearInterval(autoSyncInterval);
    autoSyncInterval = null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BACKGROUND SYNC (Service Worker)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Register for background sync (if supported)
 */
export async function registerBackgroundSync(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const registration = await navigator.serviceWorker.ready;

    if ('sync' in registration) {
      await (registration as ServiceWorkerRegistration & {
        sync: { register: (tag: string) => Promise<void> }
      }).sync.register('oracle-fault-sync');
      return true;
    }
  } catch (error) {
    console.warn('Background sync not supported:', error);
  }

  return false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT SYNC DATA
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Export fault data for offline backup
 */
export async function exportFaultData(): Promise<Blob> {
  const faults = await getAllFaultCodes();
  const version = getLocalVersion();

  const exportData = {
    version,
    exportedAt: new Date().toISOString(),
    faultCount: faults.length,
    checksum: generateFaultChecksum(faults),
    faults,
  };

  return new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });
}

/**
 * Import fault data from backup
 */
export async function importFaultData(data: string): Promise<SyncResult> {
  try {
    const importData = JSON.parse(data);

    if (!importData.faults || !Array.isArray(importData.faults)) {
      throw new Error('Invalid import data format');
    }

    await saveFaultCodes(importData.faults);

    if (importData.version) {
      setLocalVersion(importData.version);
    }

    return {
      success: true,
      version: importData.version,
      faultsUpdated: importData.faults.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Import failed',
    };
  }
}
