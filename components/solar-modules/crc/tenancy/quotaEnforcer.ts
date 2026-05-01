// QUOTA ENFORCEMENT
// Enforces usage limits per tenant

export interface QuotaViolation {
  tenantId: string;
  quotaType: string;
  limit: number;
  current: number;
  timestamp: Date;
  action: 'warn' | 'block' | 'throttle';
}

class QuotaEnforcer {
  private violations: Map<string, QuotaViolation[]> = new Map();
  private throttledRequests: Map<string, Map<string, number>> = new Map();
  
  async checkQuota(tenantId: string, quotaType: string, requestedAmount: number = 1): Promise<{
    allowed: boolean;
    remaining: number;
    message?: string;
  }> {
    // Get quota limit from subscription
    const limit = await this.getQuotaLimit(tenantId, quotaType);
    const current = await this.getCurrentUsage(tenantId, quotaType);
    const remaining = limit - current;
    
    if (remaining < requestedAmount) {
      const violation: QuotaViolation = {
        tenantId,
        quotaType,
        limit,
        current: current + requestedAmount,
        timestamp: new Date(),
        action: this.getActionForQuotaType(quotaType)
      };
      
      await this.recordViolation(violation);
      
      return {
        allowed: false,
        remaining: 0,
        message: `${quotaType} limit exceeded. Limit: ${limit}, Current: ${current}`
      };
    }
    
    return {
      allowed: true,
      remaining
    };
  }
  
  async consumeQuota(tenantId: string, quotaType: string, amount: number = 1): Promise<boolean> {
    const check = await this.checkQuota(tenantId, quotaType, amount);
    
    if (!check.allowed) {
      return false;
    }
    
    await this.incrementUsage(tenantId, quotaType, amount);
    return true;
  }
  
  async checkRateLimit(tenantId: string, endpoint: string, limit: number = 100, windowMs: number = 60000): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: Date;
  }> {
    const key = `${tenantId}:${endpoint}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    let requests = this.throttledRequests.get(key) || new Map();
    
    // Clean old requests
    for (const [timestamp] of requests) {
      if (parseInt(timestamp) < windowStart) {
        requests.delete(timestamp);
      }
    }
    
    const currentCount = requests.size;
    
    if (currentCount >= limit) {
      const oldestRequest = Math.min(...Array.from(requests.keys()).map(Number));
      const resetTime = new Date(oldestRequest + windowMs);
      
      return {
        allowed: false,
        remaining: 0,
        resetTime
      };
    }
    
    requests.set(now.toString(), now);
    this.throttledRequests.set(key, requests);
    
    return {
      allowed: true,
      remaining: limit - currentCount - 1,
      resetTime: new Date(now + windowMs)
    };
  }
  
  async checkStorageQuota(tenantId: string, fileSizeBytes: number): Promise<boolean> {
    const currentStorage = await this.getCurrentStorage(tenantId);
    const storageLimit = await this.getStorageLimit(tenantId);
    
    return currentStorage + fileSizeBytes <= storageLimit;
  }
  
  async getQuotaStatus(tenantId: string): Promise<{
    quotas: Array<{
      name: string;
      limit: number;
      used: number;
      remaining: number;
      percentage: number;
    }>;
    isOverLimit: boolean;
  }> {
    const quotaTypes = ['api_calls', 'designs', 'reports', 'storage', 'users', 'projects'];
    const quotas = [];
    let isOverLimit = false;
    
    for (const quotaType of quotaTypes) {
      const limit = await this.getQuotaLimit(tenantId, quotaType);
      const used = await this.getCurrentUsage(tenantId, quotaType);
      const remaining = limit - used;
      const percentage = limit > 0 ? (used / limit) * 100 : 0;
      
      quotas.push({
        name: quotaType,
        limit,
        used,
        remaining: Math.max(0, remaining),
        percentage
      });
      
      if (used >= limit) {
        isOverLimit = true;
      }
    }
    
    return { quotas, isOverLimit };
  }
  
  async getViolations(tenantId: string, hours: number = 24): Promise<QuotaViolation[]> {
    const allViolations = this.violations.get(tenantId) || [];
    const cutoff = Date.now() - hours * 3600000;
    return allViolations.filter(v => v.timestamp.getTime() > cutoff);
  }
  
  async resetQuota(tenantId: string, quotaType?: string): Promise<void> {
    if (quotaType) {
      await this.resetUsage(tenantId, quotaType);
    } else {
      const quotaTypes = ['api_calls', 'designs', 'reports', 'storage', 'users', 'projects'];
      for (const qt of quotaTypes) {
        await this.resetUsage(tenantId, qt);
      }
    }
    
    console.log(`Reset quotas for ${tenantId}`);
  }
  
  private async getQuotaLimit(tenantId: string, quotaType: string): Promise<number> {
    // Get from subscription manager
    const limits: Record<string, number> = {
      api_calls: 10000,
      designs: 100,
      reports: 50,
      storage: 10 * 1024 * 1024 * 1024, // 10 GB
      users: 10,
      projects: 50
    };
    return limits[quotaType] || 1000;
  }
  
  private async getCurrentUsage(tenantId: string, quotaType: string): Promise<number> {
    // In production, query database
    return 0;
  }
  
  private async getCurrentStorage(tenantId: string): Promise<number> {
    return 0;
  }
  
  private async getStorageLimit(tenantId: string): Promise<number> {
    return 10 * 1024 * 1024 * 1024; // 10 GB
  }
  
  private async incrementUsage(tenantId: string, quotaType: string, amount: number): Promise<void> {
    console.log(`Incremented ${quotaType} for ${tenantId} by ${amount}`);
  }
  
  private async resetUsage(tenantId: string, quotaType: string): Promise<void> {
    console.log(`Reset ${quotaType} for ${tenantId}`);
  }
  
  private async recordViolation(violation: QuotaViolation): Promise<void> {
    const tenantViolations = this.violations.get(violation.tenantId) || [];
    tenantViolations.push(violation);
    this.violations.set(violation.tenantId, tenantViolations);
    
    console.log(`Quota violation for ${violation.tenantId}: ${violation.quotaType}`);
  }
  
  private getActionForQuotaType(quotaType: string): QuotaViolation['action'] {
    if (quotaType === 'api_calls') return 'throttle';
    if (quotaType === 'storage') return 'block';
    return 'warn';
  }
}

export const quotaEnforcer = new QuotaEnforcer();