/**
 * Generator Oracle - IndexedDB Service
 * Offline storage for fault codes, diagnosis history, and feedback
 */

import { ControllerFaultCode } from './controllerFaultCodes';

const DB_NAME = 'GeneratorOracleDB';
const DB_VERSION = 2; // Upgraded for sync support

// Store names
export const STORES = {
  FAULT_CODES: 'faultCodes',
  THRESHOLDS: 'parameterThresholds',
  DIAGNOSIS_HISTORY: 'diagnosisHistory',
  FEEDBACK_QUEUE: 'feedbackQueue',
  SETTINGS: 'settings',
  FAULT_VERSIONS: 'faultVersions', // New store for version tracking
} as const;

// Database connection
let dbInstance: IDBDatabase | null = null;

// Initialize the database
export async function initDatabase(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Fault Codes Store
      if (!db.objectStoreNames.contains(STORES.FAULT_CODES)) {
        const faultStore = db.createObjectStore(STORES.FAULT_CODES, { keyPath: 'id' });
        faultStore.createIndex('brand', 'brand', { unique: false });
        faultStore.createIndex('model', 'model', { unique: false });
        faultStore.createIndex('category', 'category', { unique: false });
        faultStore.createIndex('severity', 'severity', { unique: false });
        faultStore.createIndex('code', 'code', { unique: false });
      }

      // Parameter Thresholds Store
      if (!db.objectStoreNames.contains(STORES.THRESHOLDS)) {
        const thresholdStore = db.createObjectStore(STORES.THRESHOLDS, { keyPath: 'id' });
        thresholdStore.createIndex('brand', 'brand', { unique: false });
        thresholdStore.createIndex('model', 'model', { unique: false });
      }

      // Diagnosis History Store
      if (!db.objectStoreNames.contains(STORES.DIAGNOSIS_HISTORY)) {
        const historyStore = db.createObjectStore(STORES.DIAGNOSIS_HISTORY, { keyPath: 'id', autoIncrement: true });
        historyStore.createIndex('timestamp', 'timestamp', { unique: false });
        historyStore.createIndex('resolved', 'resolved', { unique: false });
        historyStore.createIndex('controllerModel', 'controllerModel', { unique: false });
      }

      // Feedback Queue Store
      if (!db.objectStoreNames.contains(STORES.FEEDBACK_QUEUE)) {
        const feedbackStore = db.createObjectStore(STORES.FEEDBACK_QUEUE, { keyPath: 'id', autoIncrement: true });
        feedbackStore.createIndex('synced', 'synced', { unique: false });
        feedbackStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Settings Store
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }

      // Fault Versions Store (for sync tracking)
      if (!db.objectStoreNames.contains(STORES.FAULT_VERSIONS)) {
        const versionStore = db.createObjectStore(STORES.FAULT_VERSIONS, { keyPath: 'version' });
        versionStore.createIndex('releasedAt', 'releasedAt', { unique: false });
        versionStore.createIndex('isCurrent', 'isCurrent', { unique: false });
      }
    };
  });
}

// Close database connection
export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

// Generic store operations
async function getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
  const db = await initDatabase();
  const transaction = db.transaction(storeName, mode);
  return transaction.objectStore(storeName);
}

// ==================== FAULT CODES ====================

export async function saveFaultCodes(codes: ControllerFaultCode[]): Promise<void> {
  const db = await initDatabase();
  const transaction = db.transaction(STORES.FAULT_CODES, 'readwrite');
  const store = transaction.objectStore(STORES.FAULT_CODES);

  // Clear existing codes first
  await new Promise<void>((resolve, reject) => {
    const clearRequest = store.clear();
    clearRequest.onsuccess = () => resolve();
    clearRequest.onerror = () => reject(clearRequest.error);
  });

  // Add codes in chunks to avoid blocking
  const CHUNK_SIZE = 500;
  for (let i = 0; i < codes.length; i += CHUNK_SIZE) {
    const chunk = codes.slice(i, i + CHUNK_SIZE);
    await Promise.all(chunk.map(code => {
      return new Promise<void>((resolve, reject) => {
        const request = store.put(code);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }));
  }
}

export async function getFaultCodeById(id: string): Promise<ControllerFaultCode | undefined> {
  const store = await getStore(STORES.FAULT_CODES);
  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllFaultCodes(): Promise<ControllerFaultCode[]> {
  const store = await getStore(STORES.FAULT_CODES);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function getFaultCodesByBrand(brand: string): Promise<ControllerFaultCode[]> {
  const store = await getStore(STORES.FAULT_CODES);
  const index = store.index('brand');
  return new Promise((resolve, reject) => {
    const request = index.getAll(brand);
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function getFaultCodesByModel(model: string): Promise<ControllerFaultCode[]> {
  const store = await getStore(STORES.FAULT_CODES);
  const index = store.index('model');
  return new Promise((resolve, reject) => {
    const request = index.getAll(model);
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function searchFaultCodesOffline(query: string): Promise<ControllerFaultCode[]> {
  const allCodes = await getAllFaultCodes();
  const q = query.toLowerCase();
  return allCodes.filter(code =>
    code.code.toLowerCase().includes(q) ||
    code.title.toLowerCase().includes(q) ||
    code.description.toLowerCase().includes(q) ||
    code.brand.toLowerCase().includes(q) ||
    code.model.toLowerCase().includes(q)
  );
}

export async function getFaultCodeCount(): Promise<number> {
  const store = await getStore(STORES.FAULT_CODES);
  return new Promise((resolve, reject) => {
    const request = store.count();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ==================== DIAGNOSIS HISTORY ====================

export interface DiagnosisHistoryEntry {
  id?: number;
  timestamp: string;
  controllerBrand: string;
  controllerModel: string;
  faultCodeId: string;
  faultCode: string;
  faultTitle: string;
  parameters: Record<string, number | null>;
  resolved: boolean;
  resolution?: string;
  notes?: string;
}

export async function saveDiagnosisHistory(entry: DiagnosisHistoryEntry): Promise<number> {
  const store = await getStore(STORES.DIAGNOSIS_HISTORY, 'readwrite');
  return new Promise((resolve, reject) => {
    const request = store.add({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString(),
    });
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export async function getDiagnosisHistory(limit: number = 50): Promise<DiagnosisHistoryEntry[]> {
  const store = await getStore(STORES.DIAGNOSIS_HISTORY);
  const index = store.index('timestamp');
  return new Promise((resolve, reject) => {
    const entries: DiagnosisHistoryEntry[] = [];
    const request = index.openCursor(null, 'prev');

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor && entries.length < limit) {
        entries.push(cursor.value);
        cursor.continue();
      } else {
        resolve(entries);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function updateDiagnosisResolution(
  id: number,
  resolved: boolean,
  resolution?: string
): Promise<void> {
  const db = await initDatabase();
  const transaction = db.transaction(STORES.DIAGNOSIS_HISTORY, 'readwrite');
  const store = transaction.objectStore(STORES.DIAGNOSIS_HISTORY);

  return new Promise((resolve, reject) => {
    const getRequest = store.get(id);
    getRequest.onsuccess = () => {
      const entry = getRequest.result;
      if (entry) {
        entry.resolved = resolved;
        entry.resolution = resolution;
        const updateRequest = store.put(entry);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        reject(new Error('Entry not found'));
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

// ==================== FEEDBACK QUEUE ====================

export interface FeedbackEntry {
  id?: number;
  timestamp: string;
  faultCodeId: string;
  solutionWorked: 'yes' | 'no' | 'partial';
  notes?: string;
  controllerModel: string;
  synced: boolean;
}

export async function saveFeedback(entry: Omit<FeedbackEntry, 'id' | 'timestamp' | 'synced'>): Promise<number> {
  const store = await getStore(STORES.FEEDBACK_QUEUE, 'readwrite');
  return new Promise((resolve, reject) => {
    const request = store.add({
      ...entry,
      timestamp: new Date().toISOString(),
      synced: false,
    });
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export async function getUnsyncedFeedback(): Promise<FeedbackEntry[]> {
  const store = await getStore(STORES.FEEDBACK_QUEUE);
  return new Promise((resolve, reject) => {
    const results: FeedbackEntry[] = [];
    const request = store.openCursor();
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        if (cursor.value.synced === false) {
          results.push(cursor.value);
        }
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function markFeedbackSynced(id: number): Promise<void> {
  const db = await initDatabase();
  const transaction = db.transaction(STORES.FEEDBACK_QUEUE, 'readwrite');
  const store = transaction.objectStore(STORES.FEEDBACK_QUEUE);

  return new Promise((resolve, reject) => {
    const getRequest = store.get(id);
    getRequest.onsuccess = () => {
      const entry = getRequest.result;
      if (entry) {
        entry.synced = true;
        const updateRequest = store.put(entry);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        reject(new Error('Entry not found'));
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

// ==================== SETTINGS ====================

export interface OracleSettings {
  language: string;
  unitSystem: 'metric' | 'imperial';
  lastSelectedBrand?: string;
  lastSelectedModel?: string;
  lastSyncTimestamp?: string;
  offlineDataLoaded: boolean;
  theme?: 'dark' | 'light' | 'system';
}

export const DEFAULT_SETTINGS: OracleSettings = {
  language: 'en',
  unitSystem: 'metric',
  offlineDataLoaded: false,
  theme: 'dark',
};

export async function getSetting<K extends keyof OracleSettings>(key: K): Promise<OracleSettings[K] | undefined> {
  const store = await getStore(STORES.SETTINGS);
  return new Promise((resolve, reject) => {
    const request = store.get(key);
    request.onsuccess = () => {
      resolve(request.result?.value);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveSetting<K extends keyof OracleSettings>(key: K, value: OracleSettings[K]): Promise<void> {
  const store = await getStore(STORES.SETTINGS, 'readwrite');
  return new Promise((resolve, reject) => {
    const request = store.put({ key, value });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getAllSettings(): Promise<Partial<OracleSettings>> {
  const store = await getStore(STORES.SETTINGS);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const settings: Partial<OracleSettings> = {};
      (request.result || []).forEach((item: { key: keyof OracleSettings; value: any }) => {
        settings[item.key] = item.value;
      });
      resolve(settings);
    };
    request.onerror = () => reject(request.error);
  });
}

// ==================== UTILITY FUNCTIONS ====================

export async function clearAllData(): Promise<void> {
  const db = await initDatabase();
  const storeNames = [STORES.FAULT_CODES, STORES.DIAGNOSIS_HISTORY, STORES.FEEDBACK_QUEUE];

  await Promise.all(storeNames.map(storeName => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }));
}

export async function getDatabaseSize(): Promise<{ codes: number; history: number; feedback: number }> {
  const [codes, historyEntries, feedbackEntries] = await Promise.all([
    getFaultCodeCount(),
    getDiagnosisHistory(1000),
    getUnsyncedFeedback(),
  ]);

  return {
    codes,
    history: historyEntries.length,
    feedback: feedbackEntries.length,
  };
}

// Check if database is available (for SSR safety)
export function isDatabaseAvailable(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

// Initialize offline data from the fault code generator
export async function initializeOfflineData(
  faultCodes: ControllerFaultCode[],
  onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  if (!isDatabaseAvailable()) {
    console.warn('IndexedDB not available');
    return;
  }

  const totalCodes = faultCodes.length;
  const CHUNK_SIZE = 500;

  const db = await initDatabase();
  const transaction = db.transaction(STORES.FAULT_CODES, 'readwrite');
  const store = transaction.objectStore(STORES.FAULT_CODES);

  // Clear existing
  await new Promise<void>((resolve, reject) => {
    const clearRequest = store.clear();
    clearRequest.onsuccess = () => resolve();
    clearRequest.onerror = () => reject(clearRequest.error);
  });

  // Add in chunks
  let loaded = 0;
  for (let i = 0; i < faultCodes.length; i += CHUNK_SIZE) {
    const chunk = faultCodes.slice(i, i + CHUNK_SIZE);

    await Promise.all(chunk.map(code => {
      return new Promise<void>((resolve, reject) => {
        const request = store.put(code);
        request.onsuccess = () => {
          loaded++;
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    }));

    onProgress?.(Math.min(loaded, totalCodes), totalCodes);
  }

  await saveSetting('offlineDataLoaded', true);
  await saveSetting('lastSyncTimestamp', new Date().toISOString());
}
