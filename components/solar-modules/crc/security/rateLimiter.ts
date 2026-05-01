// RATE LIMITER
// Prevents API abuse and ensures fair usage

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
  statusCode?: number;
  keyGenerator?: (req: any) => string;
}

export interface RateLimitInfo {
  totalRequests: number;
  remainingRequests: number;
  resetTime: Date;
  limit: number;
}

class RateLimiter {
  private stores: Map<string, Map<string, number[]>> = new Map();
  private defaultConfig: RateLimitConfig = {
    windowMs: 60000, // 1 minute
    maxRequests: 100,
    message: 'Too many requests, please try again later.',
    statusCode: 429
  };
  
  async checkLimit(key: string, config?: Partial<RateLimitConfig>): Promise<RateLimitInfo> {
    const fullConfig = { ...this.defaultConfig, ...config };
    const store = this.getStore(fullConfig);
    
    const now = Date.now();
    const windowStart = now - fullConfig.windowMs;
    
    let requests = store.get(key) || [];
    requests = requests.filter(timestamp => timestamp > windowStart);
    
    const totalRequests = requests.length;
    const remainingRequests = Math.max(0, fullConfig.maxRequests - totalRequests);
    const oldestRequest = requests[0] || now;
    const resetTime = new Date(oldestRequest + fullConfig.windowMs);
    
    if (totalRequests >= fullConfig.maxRequests) {
      return {
        totalRequests,
        remainingRequests: 0,
        resetTime,
        limit: fullConfig.maxRequests
      };
    }
    
    requests.push(now);
    store.set(key, requests);
    
    return {
      totalRequests: totalRequests + 1,
      remainingRequests: remainingRequests - 1,
      resetTime,
      limit: fullConfig.maxRequests
    };
  }
  
  async isAllowed(key: string, config?: Partial<RateLimitConfig>): Promise<boolean> {
    const info = await this.checkLimit(key, config);
    return info.remainingRequests > 0;
  }
  
  async getRemaining(key: string, config?: Partial<RateLimitConfig>): Promise<number> {
    const info = await this.checkLimit(key, config);
    return info.remainingRequests;
  }
  
  async reset(key: string, config?: Partial<RateLimitConfig>): Promise<void> {
    const fullConfig = { ...this.defaultConfig, ...config };
    const store = this.getStore(fullConfig);
    store.delete(key);
  }
  
  async resetAll(): Promise<void> {
    this.stores.clear();
  }
  
  middleware(config?: Partial<RateLimitConfig>) {
    const fullConfig = { ...this.defaultConfig, ...config };
    
    return async (req: any, res: any, next: any) => {
      const key = fullConfig.keyGenerator 
        ? fullConfig.keyGenerator(req)
        : this.defaultKeyGenerator(req);
      
      const isAllowed = await this.isAllowed(key, fullConfig);
      
      if (!isAllowed) {
        res.status(fullConfig.statusCode || 429).json({
          error: fullConfig.message || 'Too many requests',
          retryAfter: Math.ceil(fullConfig.windowMs / 1000)
        });
        return;
      }
      
      next();
    };
  }
  
  private getStore(config: RateLimitConfig): Map<string, number[]> {
    const key = `${config.windowMs}_${config.maxRequests}`;
    
    if (!this.stores.has(key)) {
      this.stores.set(key, new Map());
    }
    
    return this.stores.get(key)!;
  }
  
  private defaultKeyGenerator(req: any): string {
    const ip = req.ip || req.connection.remoteAddress;
    const path = req.path;
    return `${ip}:${path}`;
  }
  
  createUserLimiter(userId: string, config?: Partial<RateLimitConfig>) {
    return {
      check: () => this.checkLimit(`user:${userId}`, config),
      isAllowed: () => this.isAllowed(`user:${userId}`, config),
      reset: () => this.reset(`user:${userId}`, config)
    };
  }
  
  createEndpointLimiter(endpoint: string, config?: Partial<RateLimitConfig>) {
    return {
      check: (identifier?: string) => this.checkLimit(`endpoint:${endpoint}:${identifier || 'global'}`, config),
      isAllowed: (identifier?: string) => this.isAllowed(`endpoint:${endpoint}:${identifier || 'global'}`, config),
      reset: (identifier?: string) => this.reset(`endpoint:${endpoint}:${identifier || 'global'}`, config)
    };
  }
}

export const rateLimiter = new RateLimiter();