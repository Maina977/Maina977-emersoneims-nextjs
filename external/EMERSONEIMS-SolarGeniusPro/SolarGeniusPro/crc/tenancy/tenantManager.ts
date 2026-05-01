// MULTI-TENANCY MANAGER
// Tenant lifecycle, isolation, subscription management

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'trial' | 'cancelled';
  settings: TenantSettings;
  quotas: TenantQuotas;
  usage: TenantUsage;
  createdAt: Date;
  trialEndsAt?: Date;
}

export interface TenantSettings {
  logo?: string;
  primaryColor?: string;
  allowWhiteLabel: boolean;
  enableAIAdvisor: boolean;
  enableDigitalTwin: boolean;
  enableMarketIntelligence: boolean;
  maxUsers: number;
  maxProjects: number;
  features: string[];
}

export interface TenantQuotas {
  monthlyApiCalls: number;
  storageMB: number;
  designsPerMonth: number;
  reportsPerMonth: number;
  concurrentUsers: number;
}

export interface TenantUsage {
  apiCallsThisMonth: number;
  storageUsedMB: number;
  designsThisMonth: number;
  reportsThisMonth: number;
  activeUsers: number;
}

export interface TenantContext {
  tenantId: string;
  tenant: Tenant;
  permissions: string[];
}

class TenantManager {
  private tenants: Map<string, Tenant> = new Map();
  private tenantContext: TenantContext | null = null;
  
  async createTenant(data: Partial<Tenant>): Promise<Tenant> {
    const tenantId = this.generateTenantId();
    const subdomain = this.generateSubdomain(data.name || '');
    
    const tenant: Tenant = {
      id: tenantId,
      name: data.name || 'New Organization',
      subdomain,
      customDomain: data.customDomain,
      plan: data.plan || 'free',
      status: 'trial',
      settings: {
        allowWhiteLabel: false,
        enableAIAdvisor: true,
        enableDigitalTwin: false,
        enableMarketIntelligence: false,
        maxUsers: 5,
        maxProjects: 10,
        features: ['solar_design', 'basic_reports']
      },
      quotas: this.getPlanQuotas(data.plan || 'free'),
      usage: {
        apiCallsThisMonth: 0,
        storageUsedMB: 0,
        designsThisMonth: 0,
        reportsThisMonth: 0,
        activeUsers: 0
      },
      createdAt: new Date(),
      trialEndsAt: new Date(Date.now() + 14 * 86400000) // 14 days trial
    };
    
    this.tenants.set(tenantId, tenant);
    await this.saveToDatabase(tenant);
    await this.createTenantSchema(tenantId);
    
    return tenant;
  }
  
  async getTenant(tenantId: string): Promise<Tenant | null> {
    return this.tenants.get(tenantId) || null;
  }
  
  async getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
    for (const tenant of this.tenants.values()) {
      if (tenant.subdomain === subdomain || tenant.customDomain === subdomain) {
        return tenant;
      }
    }
    return null;
  }
  
  async setTenantContext(tenantId: string): Promise<TenantContext> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found`);
    }
    
    const permissions = this.getTenantPermissions(tenant);
    
    this.tenantContext = {
      tenantId,
      tenant,
      permissions
    };
    
    return this.tenantContext;
  }
  
  getCurrentTenant(): TenantContext | null {
    return this.tenantContext;
  }
  
  async updateTenant(tenantId: string, updates: Partial<Tenant>): Promise<Tenant> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found`);
    }
    
    const updated = { ...tenant, ...updates };
    this.tenants.set(tenantId, updated);
    await this.saveToDatabase(updated);
    
    return updated;
  }
  
  async upgradePlan(tenantId: string, plan: 'free' | 'pro' | 'enterprise'): Promise<Tenant> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found`);
    }
    
    tenant.plan = plan;
    tenant.quotas = this.getPlanQuotas(plan);
    
    // Update features based on plan
    if (plan === 'pro') {
      tenant.settings.enableDigitalTwin = true;
      tenant.settings.maxUsers = 20;
      tenant.settings.maxProjects = 100;
      tenant.settings.features = ['solar_design', 'advanced_reports', 'digital_twin', 'api_access'];
    } else if (plan === 'enterprise') {
      tenant.settings.enableAIAdvisor = true;
      tenant.settings.enableDigitalTwin = true;
      tenant.settings.enableMarketIntelligence = true;
      tenant.settings.allowWhiteLabel = true;
      tenant.settings.maxUsers = 100;
      tenant.settings.maxProjects = 500;
      tenant.settings.features = ['all'];
    }
    
    await this.saveToDatabase(tenant);
    await this.logPlanChange(tenantId, plan);
    
    return tenant;
  }
  
  async checkQuota(tenantId: string, resource: keyof TenantQuotas, requestedAmount: number = 1): Promise<boolean> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return false;
    
    const quota = tenant.quotas[resource];
    const usage = this.getUsageForResource(tenant, resource);
    
    return usage + requestedAmount <= quota;
  }
  
  async incrementUsage(tenantId: string, resource: keyof TenantUsage, amount: number = 1): Promise<void> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return;
    
    const usageKey = this.getUsageKeyForResource(resource);
    (tenant.usage as any)[usageKey] += amount;
    
    await this.saveToDatabase(tenant);
  }
  
  async suspendTenant(tenantId: string, reason: string): Promise<void> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return;
    
    tenant.status = 'suspended';
    await this.saveToDatabase(tenant);
    await this.logSuspension(tenantId, reason);
    await this.notifySuspension(tenant);
  }
  
  async activateTenant(tenantId: string): Promise<void> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return;
    
    tenant.status = 'active';
    await this.saveToDatabase(tenant);
  }
  
  async deleteTenant(tenantId: string): Promise<void> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return;
    
    // Archive data first
    await this.archiveTenantData(tenantId);
    
    // Delete tenant
    this.tenants.delete(tenantId);
    await this.deleteFromDatabase(tenantId);
    await this.dropTenantSchema(tenantId);
  }
  
  async listTenants(options?: { status?: string; plan?: string; limit?: number }): Promise<Tenant[]> {
    let tenants = Array.from(this.tenants.values());
    
    if (options?.status) {
      tenants = tenants.filter(t => t.status === options.status);
    }
    if (options?.plan) {
      tenants = tenants.filter(t => t.plan === options.plan);
    }
    if (options?.limit) {
      tenants = tenants.slice(0, options.limit);
    }
    
    return tenants;
  }
  
  async getTenantAnalytics(tenantId: string): Promise<any> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return null;
    
    return {
      tenantId: tenant.id,
      tenantName: tenant.name,
      plan: tenant.plan,
      status: tenant.status,
      usage: tenant.usage,
      quotas: tenant.quotas,
      usagePercentages: {
        apiCalls: (tenant.usage.apiCallsThisMonth / tenant.quotas.monthlyApiCalls) * 100,
        storage: (tenant.usage.storageUsedMB / tenant.quotas.storageMB) * 100,
        designs: (tenant.usage.designsThisMonth / tenant.quotas.designsPerMonth) * 100,
        reports: (tenant.usage.reportsThisMonth / tenant.quotas.reportsPerMonth) * 100
      },
      createdAt: tenant.createdAt,
      trialEndsAt: tenant.trialEndsAt
    };
  }
  
  // Middleware for tenant isolation
  tenantMiddleware() {
    return async (req: any, res: any, next: any) => {
      const tenantId = req.headers['x-tenant-id'] || req.query.tenantId;
      
      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID required' });
      }
      
      const tenant = await this.getTenant(tenantId);
      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }
      
      if (tenant.status !== 'active' && tenant.status !== 'trial') {
        return res.status(403).json({ error: `Tenant is ${tenant.status}` });
      }
      
      req.tenant = tenant;
      next();
    };
  }
  
  private getPlanQuotas(plan: string): TenantQuotas {
    const quotas: Record<string, TenantQuotas> = {
      free: {
        monthlyApiCalls: 1000,
        storageMB: 100,
        designsPerMonth: 10,
        reportsPerMonth: 10,
        concurrentUsers: 2
      },
      pro: {
        monthlyApiCalls: 10000,
        storageMB: 1000,
        designsPerMonth: 100,
        reportsPerMonth: 100,
        concurrentUsers: 10
      },
      enterprise: {
        monthlyApiCalls: 100000,
        storageMB: 10000,
        designsPerMonth: 1000,
        reportsPerMonth: 1000,
        concurrentUsers: 50
      }
    };
    
    return quotas[plan] || quotas.free;
  }
  
  private getTenantPermissions(tenant: Tenant): string[] {
    const permissions = ['view:own_data'];
    
    if (tenant.plan === 'pro') {
      permissions.push('create:designs', 'export:reports', 'api:access');
    }
    
    if (tenant.plan === 'enterprise') {
      permissions.push('manage:users', 'white_label', 'custom_integrations');
    }
    
    return permissions;
  }
  
  private getUsageForResource(tenant: Tenant, resource: string): number {
    const mapping: Record<string, keyof TenantUsage> = {
      monthlyApiCalls: 'apiCallsThisMonth',
      storageMB: 'storageUsedMB',
      designsPerMonth: 'designsThisMonth',
      reportsPerMonth: 'reportsThisMonth',
      concurrentUsers: 'activeUsers'
    };
    
    const key = mapping[resource];
    return key ? tenant.usage[key] : 0;
  }
  
  private getUsageKeyForResource(resource: keyof TenantUsage): string {
    const mapping = {
      apiCallsThisMonth: 'apiCallsThisMonth',
      storageUsedMB: 'storageUsedMB',
      designsThisMonth: 'designsThisMonth',
      reportsThisMonth: 'reportsThisMonth',
      activeUsers: 'activeUsers'
    };
    return mapping[resource];
  }
  
  private generateTenantId(): string {
    return `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateSubdomain(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 30);
  }
  
  private async saveToDatabase(tenant: Tenant): Promise<void> {
    // Implement database save
    console.log(`Saved tenant ${tenant.id}`);
  }
  
  private async deleteFromDatabase(tenantId: string): Promise<void> {
    console.log(`Deleted tenant ${tenantId}`);
  }
  
  private async createTenantSchema(tenantId: string): Promise<void> {
    console.log(`Created schema for tenant ${tenantId}`);
  }
  
  private async dropTenantSchema(tenantId: string): Promise<void> {
    console.log(`Dropped schema for tenant ${tenantId}`);
  }
  
  private async archiveTenantData(tenantId: string): Promise<void> {
    console.log(`Archived data for tenant ${tenantId}`);
  }
  
  private async logPlanChange(tenantId: string, newPlan: string): Promise<void> {
    console.log(`Tenant ${tenantId} upgraded to ${newPlan}`);
  }
  
  private async logSuspension(tenantId: string, reason: string): Promise<void> {
    console.log(`Tenant ${tenantId} suspended: ${reason}`);
  }
  
  private async notifySuspension(tenant: Tenant): Promise<void> {
    console.log(`Suspension notice sent to ${tenant.name}`);
  }
}

export const tenantManager = new TenantManager();