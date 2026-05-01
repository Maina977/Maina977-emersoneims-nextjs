// LOCAL CACHE FOR OFFLINE MODE
// IndexedDB storage for offline data access

export interface CacheEntry {
  key: string;
  data: any;
  timestamp: number;
  expiry: number;
  version: string;
}

export interface CacheConfig {
  defaultTTL: number; // seconds
  maxEntries: number;
  version: string;
}

class LocalCache {
  private db: IDBDatabase | null = null;
  private dbName = 'SolarGeniusCache';
  private dbVersion = 2;
  private config: CacheConfig = {
    defaultTTL: 3600, // 1 hour
    maxEntries: 1000,
    version: '1.0.0'
  };
  
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('cache')) {
          const store = db.createObjectStore('cache', { keyPath: 'key' });
          store.createIndex('expiry', 'expiry');
          store.createIndex('timestamp', 'timestamp');
        }
        
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }
  
  async set(key: string, data: any, ttlSeconds?: number): Promise<void> {
    if (!this.db) await this.init();
    
    const entry: CacheEntry = {
      key,
      data,
      timestamp: Date.now(),
      expiry: Date.now() + (ttlSeconds || this.config.defaultTTL) * 1000,
      version: this.config.version
    };
    
    await this.saveToStore('cache', entry);
    await this.enforceMaxEntries();
  }
  
  async get(key: string): Promise<any | null> {
    if (!this.db) await this.init();
    
    const entry = await this.getFromStore('cache', key);
    
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      await this.delete(key);
      return null;
    }
    if (entry.version !== this.config.version) {
      await this.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<T> {
    const cached = await this.get(key);
    if (cached !== null) return cached;
    
    const fresh = await fetcher();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  }
  
  async delete(key: string): Promise<void> {
    if (!this.db) await this.init();
    await this.deleteFromStore('cache', key);
  }
  
  async clear(): Promise<void> {
    if (!this.db) await this.init();
    await this.clearStore('cache');
  }
  
  async clearExpired(): Promise<number> {
    if (!this.db) await this.init();
    
    const all = await this.getAllFromStore('cache');
    let count = 0;
    
    for (const entry of all) {
      if (Date.now() > entry.expiry) {
        await this.delete(entry.key);
        count++;
      }
    }
    
    return count;
  }
  
  async getSize(): Promise<number> {
    if (!this.db) await this.init();
    const all = await this.getAllFromStore('cache');
    return all.length;
  }
  
  async getStats(): Promise<{
    size: number;
    maxSize: number;
    expiredCount: number;
    hitRate: number;
  }> {
    const size = await this.getSize();
    const expiredCount = await this.clearExpired();
    
    return {
      size,
      maxSize: this.config.maxEntries,
      expiredCount,
      hitRate: 0 // Would need to track hits/misses
    };
  }
  
  async setMetadata(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    await this.saveToStore('metadata', { key, value });
  }
  
  async getMetadata(key: string): Promise<any> {
    if (!this.db) await this.init();
    const entry = await this.getFromStore('metadata', key);
    return entry?.value;
  }
  
  async batchSet(entries: Array<{ key: string; data: any; ttl?: number }>): Promise<void> {
    for (const entry of entries) {
      await this.set(entry.key, entry.data, entry.ttl);
    }
  }
  
  async batchGet(keys: string[]): Promise<Map<string, any>> {
    const results = new Map();
    for (const key of keys) {
      const value = await this.get(key);
      if (value !== null) results.set(key, value);
    }
    return results;
  }
  
  private async saveToStore(storeName: string, data: any): Promise<void> {
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
  
  private async getFromStore(storeName: string, key: string): Promise<any> {
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
  
  private async getAllFromStore(storeName: string): Promise<any[]> {
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
  
  private async deleteFromStore(storeName: string, key: string): Promise<void> {
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
  
  private async clearStore(storeName: string): Promise<void> {
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
  
  private async enforceMaxEntries(): Promise<void> {
    const size = await this.getSize();
    if (size <= this.config.maxEntries) return;
    
    const all = await this.getAllFromStore('cache');
    all.sort((a, b) => a.timestamp - b.timestamp);
    
    const toDelete = all.slice(0, size - this.config.maxEntries);
    for (const entry of toDelete) {
      await this.delete(entry.key);
    }
  }
  
  updateConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export const localCache = new LocalCache();