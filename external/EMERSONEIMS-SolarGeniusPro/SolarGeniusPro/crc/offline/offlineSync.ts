// OFFLINE SYNC ENGINE
// Enables offline-first operation for low-internet environments (Africa advantage)

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

class OfflineSync {
  private db: IDBDatabase | null = null;
  private dbName = 'SolarGeniusOffline';
  private dbVersion = 1;
  private onlineStatus: boolean = navigator.onLine;
  private syncInterval: number | null = null;
  private syncCallbacks: Array<(status: SyncStatus) => void> = [];
  
  constructor() {
    this.initDatabase();
    this.setupOnlineOfflineListeners();
    this.startPeriodicSync(300000); // Sync every 5 minutes
  }
  
  private async initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Queue store
        if (!db.objectStoreNames.contains('queue')) {
          const queueStore = db.createObjectStore('queue', { keyPath: 'id' });
          queueStore.createIndex('status', 'status');
          queueStore.createIndex('timestamp', 'timestamp');
        }
        
        // Cache store for offline data
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
          cacheStore.createIndex('expiry', 'expiry');
        }
        
        // Projects store
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
        
        // Designs store
        if (!db.objectStoreNames.contains('designs')) {
          db.createObjectStore('designs', { keyPath: 'id' });
        }
      };
    });
  }
  
  private setupOnlineOfflineListeners(): void {
    window.addEventListener('online', () => {
      this.onlineStatus = true;
      this.triggerSync();
      this.notifySyncStatus();
    });
    
    window.addEventListener('offline', () => {
      this.onlineStatus = false;
      this.notifySyncStatus();
    });
  }
  
  private startPeriodicSync(intervalMs: number): void {
    this.syncInterval = window.setInterval(() => {
      if (this.onlineStatus) {
        this.triggerSync();
      }
    }, intervalMs);
  }
  
  async addToQueue(operation: OfflineQueueItem['operation'], entity: OfflineQueueItem['entity'], data: any): Promise<string> {
    const id = this.generateId();
    const item: OfflineQueueItem = {
      id,
      operation,
      entity,
      data,
      timestamp: new Date(),
      retryCount: 0,
      status: 'pending'
    };
    
    await this.saveToStore('queue', item);
    
    // If online, try to sync immediately
    if (this.onlineStatus) {
      this.triggerSync();
    }
    
    return id;
  }
  
  async getQueue(): Promise<OfflineQueueItem[]> {
    return this.getAllFromStore('queue');
  }
  
  async getPendingOperations(): Promise<OfflineQueueItem[]> {
    const all = await this.getAllFromStore('queue');
    return all.filter(item => item.status === 'pending');
  }
  
  async triggerSync(): Promise<SyncStatus> {
    if (!this.onlineStatus) {
      return this.getSyncStatus();
    }
    
    const pending = await this.getPendingOperations();
    if (pending.length === 0) {
      return this.getSyncStatus();
    }
    
    const syncStatus = this.getSyncStatus();
    (syncStatus as any).syncInProgress = true;
    this.notifySyncStatus();
    
    for (const item of pending) {
      await this.processQueueItem(item);
    }
    
    (syncStatus as any).syncInProgress = false;
    (syncStatus as any).lastSyncTime = new Date();
    (syncStatus as any).lastSuccessfulSync = new Date();
    this.notifySyncStatus();
    
    return this.getSyncStatus();
  }
  
  private async processQueueItem(item: OfflineQueueItem): Promise<void> {
    try {
      // Update status to processing
      item.status = 'processing';
      await this.saveToStore('queue', item);
      
      // Simulate API call
      const response = await this.simulateApiCall(item);
      
      if (response.success) {
        item.status = 'completed';
        await this.saveToStore('queue', item);
        
        // Optionally delete completed items after some time
        setTimeout(() => this.deleteFromStore('queue', item.id), 60000);
      } else {
        throw new Error('API call failed');
      }
    } catch (error) {
      item.retryCount++;
      item.status = item.retryCount >= 3 ? 'failed' : 'pending';
      await this.saveToStore('queue', item);
      
      console.error(`Failed to sync ${item.id}:`, error);
    }
  }
  
  private async simulateApiCall(_item: OfflineQueueItem): Promise<{ success: boolean }> {
    // DATA POLICY: previously faked a 95% success rate via Math.random().
    // That misrepresents the real sync state. Until a real backend endpoint
    // is wired, this method must throw so callers cannot consume fabricated
    // sync results.
    throw new Error(
      'offlineSync: real sync endpoint is not configured. ' +
      'Per data policy, success/failure must reflect a real network call.'
    );
  }
  
  async cacheData(key: string, data: any, ttlSeconds: number = 3600): Promise<void> {
    const cacheItem = {
      key,
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttlSeconds * 1000
    };
    
    await this.saveToStore('cache', cacheItem);
  }
  
  async getCachedData(key: string): Promise<any | null> {
    const cacheItem = await this.getFromStore('cache', key);
    
    if (!cacheItem) return null;
    if (Date.now() > cacheItem.expiry) {
      await this.deleteFromStore('cache', key);
      return null;
    }
    
    return cacheItem.data;
  }
  
  async saveProject(project: any): Promise<void> {
    await this.saveToStore('projects', project);
  }
  
  async getProject(projectId: string): Promise<any> {
    return this.getFromStore('projects', projectId);
  }
  
  async getAllProjects(): Promise<any[]> {
    return this.getAllFromStore('projects');
  }
  
  async saveDesign(design: any): Promise<void> {
    await this.saveToStore('designs', design);
  }
  
  async getDesign(designId: string): Promise<any> {
    return this.getFromStore('designs', designId);
  }
  
  async getAllDesigns(): Promise<any[]> {
    return this.getAllFromStore('designs');
  }
  
  async clearCache(): Promise<void> {
    const cache = await this.getAllFromStore('cache');
    for (const item of cache) {
      await this.deleteFromStore('cache', item.key);
    }
  }
  
  async clearAllOfflineData(): Promise<void> {
    await this.clearStore('queue');
    await this.clearStore('cache');
    await this.clearStore('projects');
    await this.clearStore('designs');
  }
  
  getSyncStatus(): SyncStatus {
    return {
      isOnline: this.onlineStatus,
      pendingOperations: 0, // Will be updated asynchronously
      lastSyncTime: null,
      lastSuccessfulSync: null,
      syncInProgress: false
    };
  }
  
  async getDetailedSyncStatus(): Promise<SyncStatus> {
    const pending = await this.getPendingOperations();
    const status = this.getSyncStatus();
    (status as any).pendingOperations = pending.length;
    return status;
  }
  
  onSyncStatusChange(callback: (status: SyncStatus) => void): void {
    this.syncCallbacks.push(callback);
  }
  
  private async notifySyncStatus(): Promise<void> {
    const status = await this.getDetailedSyncStatus();
    for (const callback of this.syncCallbacks) {
      callback(status);
    }
  }
  
  // IndexedDB helper methods
  private saveToStore(storeName: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
  
  private getFromStore(storeName: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
  
  private getAllFromStore(storeName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
  
  private deleteFromStore(storeName: string, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
  
  private clearStore(storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
  
  private generateId(): string {
    return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const offlineSync = new OfflineSync();