// OFFLINE QUEUE MANAGEMENT
// Manages offline operations queue

export interface QueueItem {
  id: string;
  type: 'api_call' | 'upload' | 'sync' | 'notification';
  operation: string;
  payload: any;
  priority: 'high' | 'normal' | 'low';
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export interface QueueStats {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  total: number;
}

class QueueManager {
  private db: IDBDatabase | null = null;
  private dbName = 'SolarGeniusQueue';
  private dbVersion = 1;
  private processing: Set<string> = new Set();
  private processingInterval: number | null = null;
  
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.startProcessing();
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('queue')) {
          const store = db.createObjectStore('queue', { keyPath: 'id' });
          store.createIndex('status', 'status');
          store.createIndex('priority', 'priority');
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('type', 'type');
        }
      };
    });
  }
  
  async enqueue(
    type: QueueItem['type'],
    operation: string,
    payload: any,
    priority: QueueItem['priority'] = 'normal',
    maxRetries: number = 3
  ): Promise<string> {
    if (!this.db) await this.init();
    
    const id = this.generateId();
    const item: QueueItem = {
      id,
      type,
      operation,
      payload,
      priority,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries,
      status: 'pending'
    };
    
    await this.saveToStore('queue', item);
    
    // Trigger immediate processing for high priority
    if (priority === 'high') {
      this.processQueue();
    }
    
    return id;
  }
  
  async dequeue(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.deleteFromStore('queue', id);
    this.processing.delete(id);
  }
  
  async getItem(id: string): Promise<QueueItem | null> {
    if (!this.db) await this.init();
    return this.getFromStore('queue', id);
  }
  
  async getPendingItems(limit: number = 50): Promise<QueueItem[]> {
    if (!this.db) await this.init();
    
    const all = await this.getAllFromStore('queue');
    return all
      .filter(item => item.status === 'pending' && !this.processing.has(item.id))
      .sort((a, b) => {
        // Sort by priority then timestamp
        const priorityOrder = { high: 0, normal: 1, low: 2 };
        if (a.priority !== b.priority) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return a.timestamp - b.timestamp;
      })
      .slice(0, limit);
  }
  
  async getStats(): Promise<QueueStats> {
    if (!this.db) await this.init();
    
    const all = await this.getAllFromStore('queue');
    
    return {
      pending: all.filter(i => i.status === 'pending').length,
      processing: all.filter(i => i.status === 'processing').length,
      completed: all.filter(i => i.status === 'completed').length,
      failed: all.filter(i => i.status === 'failed').length,
      total: all.length
    };
  }
  
  async retryFailed(): Promise<number> {
    if (!this.db) await this.init();
    
    const all = await this.getAllFromStore('queue');
    const failed = all.filter(i => i.status === 'failed' && i.retryCount < i.maxRetries);
    
    for (const item of failed) {
      item.status = 'pending';
      item.retryCount++;
      await this.saveToStore('queue', item);
    }
    
    this.processQueue();
    return failed.length;
  }
  
  async clearCompleted(): Promise<number> {
    if (!this.db) await this.init();
    
    const all = await this.getAllFromStore('queue');
    const completed = all.filter(i => i.status === 'completed');
    
    for (const item of completed) {
      await this.deleteFromStore('queue', item.id);
    }
    
    return completed.length;
  }
  
  async clearAll(): Promise<void> {
    if (!this.db) await this.init();
    await this.clearStore('queue');
    this.processing.clear();
  }
  
  private async processQueue(): Promise<void> {
    if (!this.db) return;
    
    const items = await this.getPendingItems(5);
    
    for (const item of items) {
      if (this.processing.has(item.id)) continue;
      
      this.processing.add(item.id);
      item.status = 'processing';
      await this.saveToStore('queue', item);
      
      this.processItem(item).catch(async (error) => {
        console.error(`Failed to process ${item.id}:`, error);
        
        item.status = 'failed';
        item.error = error.message;
        await this.saveToStore('queue', item);
      });
    }
  }
  
  private async processItem(item: QueueItem): Promise<void> {
    // Simulate API call based on type
    await this.simulateApiCall(item);
    
    item.status = 'completed';
    await this.saveToStore('queue', item);
    this.processing.delete(item.id);
  }
  
  private async simulateApiCall(_item: QueueItem): Promise<void> {
    // DATA POLICY: this offline queue used to fake a 90% success rate with
    // Math.random(). That gave a misleading impression of real sync. Until
    // a real backend endpoint is wired here, we throw so the caller can
    // surface a clear "sync not configured" state instead of fabricated
    // success/failure events.
    throw new Error(
      'queueManager: real sync endpoint is not configured. ' +
      'Per data policy, success/failure must reflect a real network call — ' +
      'no Math.random() simulation. Wire this method to your backend POST.'
    );
  }
  
  private startProcessing(): void {
    if (this.processingInterval) return;
    
    this.processingInterval = window.setInterval(() => {
      this.processQueue();
    }, 5000);
  }
  
  private stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }
  
  private generateId(): string {
    return `queue_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
  
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
}

export const queueManager = new QueueManager();