// CACHING INFRASTRUCTURE
// Redis-based caching for performance

export interface CacheOptions {
  ttl: number; // seconds
  namespace?: string;
  compress?: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

class CacheManager {
  private cache: Map<string, { value: any; expires: number }> = new Map();
  private stats: CacheStats = { hits: 0, misses: 0, size: 0, hitRate: 0 };
  private defaultTTL: number = 3600; // 1 hour
  
  async get<T>(key: string, options?: Partial<CacheOptions>): Promise<T | null> {
    const fullKey = this.buildKey(key, options?.namespace);
    const entry = this.cache.get(fullKey);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }
    
    if (Date.now() > entry.expires) {
      this.cache.delete(fullKey);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }
    
    this.stats.hits++;
    this.updateHitRate();
    return entry.value as T;
  }
  
  async set<T>(key: string, value: T, options?: Partial<CacheOptions>): Promise<void> {
    const fullKey = this.buildKey(key, options?.namespace);
    const ttl = (options?.ttl || this.defaultTTL) * 1000;
    
    this.cache.set(fullKey, {
      value,
      expires: Date.now() + ttl
    });
    
    this.stats.size = this.cache.size;
  }
  
  async delete(key: string, namespace?: string): Promise<boolean> {
    const fullKey = this.buildKey(key, namespace);
    const deleted = this.cache.delete(fullKey);
    if (deleted) {
      this.stats.size = this.cache.size;
    }
    return deleted;
  }
  
  async clear(namespace?: string): Promise<number> {
    let count = 0;
    
    if (namespace) {
      const prefix = `${namespace}:`;
      for (const key of this.cache.keys()) {
        if (key.startsWith(prefix)) {
          this.cache.delete(key);
          count++;
        }
      }
    } else {
      count = this.cache.size;
      this.cache.clear();
    }
    
    this.stats.size = this.cache.size;
    return count;
  }
  
  async exists(key: string, namespace?: string): Promise<boolean> {
    const fullKey = this.buildKey(key, namespace);
    return this.cache.has(fullKey);
  }
  
  async remember<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: Partial<CacheOptions>
  ): Promise<T> {
    const cached = await this.get<T>(key, options);
    if (cached !== null) return cached;
    
    const fresh = await fetcher();
    await this.set(key, fresh, options);
    return fresh;
  }
  
  async rememberForever<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    return this.remember(key, fetcher, { ttl: 31536000 }); // 1 year
  }
  
  async increment(key: string, delta: number = 1, namespace?: string): Promise<number> {
    const fullKey = this.buildKey(key, namespace);
    const current = await this.get<number>(key, { namespace });
    const newValue = (current || 0) + delta;
    await this.set(key, newValue, { namespace });
    return newValue;
  }
  
  async decrement(key: string, delta: number = 1, namespace?: string): Promise<number> {
    return this.increment(key, -delta, namespace);
  }
  
  async getMultiple<T>(keys: string[], namespace?: string): Promise<Map<string, T>> {
    const results = new Map<string, T>();
    
    for (const key of keys) {
      const value = await this.get<T>(key, { namespace });
      if (value !== null) {
        results.set(key, value);
      }
    }
    
    return results;
  }
  
  async setMultiple<T>(
    entries: Array<{ key: string; value: T }>,
    options?: Partial<CacheOptions>
  ): Promise<void> {
    for (const entry of entries) {
      await this.set(entry.key, entry.value, options);
    }
  }
  
  async getStats(): Promise<CacheStats> {
    return { ...this.stats };
  }
  
  async resetStats(): Promise<void> {
    this.stats = { hits: 0, misses: 0, size: this.cache.size, hitRate: 0 };
  }
  
  private buildKey(key: string, namespace?: string): string {
    return namespace ? `${namespace}:${key}` : key;
  }
  
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }
  
  // TTL helpers
  ttlSeconds(seconds: number): number {
    return seconds;
  }
  
  ttlMinutes(minutes: number): number {
    return minutes * 60;
  }
  
  ttlHours(hours: number): number {
    return hours * 3600;
  }
  
  ttlDays(days: number): number {
    return days * 86400;
  }
}

export const cacheManager = new CacheManager();