// DATA STORAGE PIPELINE
// Manages data persistence for processed data

export interface StorageRecord {
  id: string;
  type: string;
  data: any;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

class DataStorage {
  private storage: Map<string, StorageRecord> = new Map();
  private localStorage: Storage | null = null;
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.localStorage = window.localStorage;
    }
  }
  
  async save(key: string, data: any, metadata?: Record<string, any>): Promise<StorageRecord> {
    const record: StorageRecord = {
      id: key,
      type: metadata?.type || 'unknown',
      data,
      metadata: metadata || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.storage.set(key, record);
    
    // Also save to localStorage for persistence
    if (this.localStorage) {
      try {
        this.localStorage.setItem(`sg_${key}`, JSON.stringify(record));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
    }
    
    return record;
  }
  
  async get(key: string): Promise<any | null> {
    const record = this.storage.get(key);
    if (record) {
      return record.data;
    }
    
    // Try localStorage
    if (this.localStorage) {
      const stored = this.localStorage.getItem(`sg_${key}`);
      if (stored) {
        const record = JSON.parse(stored);
        this.storage.set(key, record);
        return record.data;
      }
    }
    
    return null;
  }
  
  async getRecord(key: string): Promise<StorageRecord | null> {
    const record = this.storage.get(key);
    if (record) return record;
    
    if (this.localStorage) {
      const stored = this.localStorage.getItem(`sg_${key}`);
      if (stored) {
        return JSON.parse(stored);
      }
    }
    
    return null;
  }
  
  async update(key: string, data: any): Promise<StorageRecord | null> {
    const existing = await this.getRecord(key);
    if (!existing) return null;
    
    existing.data = data;
    existing.updatedAt = new Date();
    
    this.storage.set(key, existing);
    
    if (this.localStorage) {
      this.localStorage.setItem(`sg_${key}`, JSON.stringify(existing));
    }
    
    return existing;
  }
  
  async delete(key: string): Promise<boolean> {
    const deleted = this.storage.delete(key);
    
    if (this.localStorage) {
      this.localStorage.removeItem(`sg_${key}`);
    }
    
    return deleted;
  }
  
  async list(type?: string): Promise<StorageRecord[]> {
    let records = Array.from(this.storage.values());
    
    if (type) {
      records = records.filter(r => r.type === type);
    }
    
    return records.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  
  async clear(): Promise<void> {
    this.storage.clear();
    
    if (this.localStorage) {
      const keys = Object.keys(this.localStorage);
      for (const key of keys) {
        if (key.startsWith('sg_')) {
          this.localStorage.removeItem(key);
        }
      }
    }
  }
  
  async getSize(): Promise<number> {
    return this.storage.size;
  }
  
  async export(type?: string): Promise<string> {
    const records = await this.list(type);
    return JSON.stringify(records, null, 2);
  }
  
  async import(jsonData: string): Promise<number> {
    const records: StorageRecord[] = JSON.parse(jsonData);
    let count = 0;
    
    for (const record of records) {
      await this.save(record.id, record.data, record.metadata);
      count++;
    }
    
    return count;
  }
  
  async backup(): Promise<string> {
    const backup = {
      timestamp: new Date(),
      version: '1.0',
      records: Array.from(this.storage.values())
    };
    
    return JSON.stringify(backup, null, 2);
  }
  
  async restore(backupJson: string): Promise<number> {
    const backup = JSON.parse(backupJson);
    let count = 0;
    
    for (const record of backup.records) {
      await this.save(record.id, record.data, record.metadata);
      count++;
    }
    
    return count;
  }
}

export const dataStorage = new DataStorage();