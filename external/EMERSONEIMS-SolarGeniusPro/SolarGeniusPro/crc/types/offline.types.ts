// Offline Mode Type Definitions

export interface OfflineQueueItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  entity: 'design' | 'report' | 'quote' | 'project';
  data: any;
  timestamp: Date;
  retryCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface SyncStatus {
  isOnline: boolean;
  pendingOperations: number;
  lastSyncTime: Date | null;
  lastSuccessfulSync: Date | null;
  syncInProgress: boolean;
}

export interface CacheEntry {
  key: string;
  data: any;
  timestamp: number;
  expiry: number;
  version: string;
}

export interface Conflict {
  id: string;
  entityType: string;
  entityId: string;
  localVersion: any;
  remoteVersion: any;
  timestamp: Date;
  resolution?: 'local' | 'remote' | 'merge';
  resolvedAt?: Date;
}

export interface ServiceWorkerConfig {
  swUrl: string;
  scope: string;
  updateInterval: number;
  onUpdateFound?: () => void;
  onUpdateReady?: () => void;
  onOfflineReady?: () => void;
}