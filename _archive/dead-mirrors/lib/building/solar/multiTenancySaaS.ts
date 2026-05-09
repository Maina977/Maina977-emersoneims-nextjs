/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   SOLARGENIUS PRO - MULTI-TENANCY SAAS PLATFORM                             ║
 * ║   White-Label Solution with Custom Domains & Billing Portal                 ║
 * ║   Copyright © 2024-2026 EmersonEIMS - All Rights Reserved                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  customDomain?: string;
  branding: TenantBranding;
  subscription: TenantSubscription;
  settings: TenantSettings;
  users: TenantUser[];
  quotas: TenantQuotas;
  analytics: TenantAnalytics;
  createdAt: string;
  status: 'active' | 'suspended' | 'cancelled' | 'trial';
}

export interface TenantBranding {
  logo: string;
  logoLight: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  companyName: string;
  tagline: string;
  favicon: string;
  emailTemplate: {
    headerImage: string;
    footerText: string;
    primaryButtonColor: string;
  };
  reportTemplate: {
    headerLogo: string;
    footerLogo: string;
    watermark: string;
    primaryColor: string;
  };
  hideEmersonEIMSBranding: boolean;
}

export interface TenantSubscription {
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'past_due' | 'cancelled' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  paymentMethod?: {
    type: 'card' | 'mpesa' | 'bank_transfer';
    last4?: string;
    brand?: string;
  };
  invoices: Invoice[];
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  amount: number;
  currency: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  pdfUrl?: string;
}

export interface TenantSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  measurementUnit: 'metric' | 'imperial';
  emailNotifications: boolean;
  twoFactorRequired: boolean;
  ssoEnabled: boolean;
  ssoProvider?: string;
  apiAccess: boolean;
  webhookUrl?: string;
  defaultCountry: string;
  supportEmail: string;
  supportPhone: string;
}

export interface TenantUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'engineer' | 'sales' | 'viewer';
  permissions: string[];
  lastLogin?: string;
  status: 'active' | 'invited' | 'disabled';
  mfaEnabled: boolean;
}

export interface TenantQuotas {
  quotesPerMonth: { used: number; limit: number };
  reportsPerMonth: { used: number; limit: number };
  storageGB: { used: number; limit: number };
  teamMembers: { used: number; limit: number };
  apiCallsPerDay: { used: number; limit: number };
  customBranding: boolean;
  whiteLabel: boolean;
  prioritySupport: boolean;
  slaHours: number;
}

export interface TenantAnalytics {
  totalQuotes: number;
  totalQuotesValue: number;
  totalReports: number;
  conversionRate: number;
  averageQuoteValue: number;
  quotesThisMonth: number;
  reportsThisMonth: number;
  activeUsers: number;
  topDesignedSystems: Array<{ size: string; count: number }>;
  regionBreakdown: Array<{ region: string; count: number; value: number }>;
  monthlyTrend: Array<{ month: string; quotes: number; value: number }>;
  lastUpdated: string;
}

// ============================================================================
// SUBSCRIPTION PLANS
// ============================================================================

export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      '5 Quotes per month',
      '2 Reports per month',
      '1 Team member',
      'Basic design tools',
      'Community support',
    ],
    quotas: {
      quotesPerMonth: 5,
      reportsPerMonth: 2,
      storageGB: 0.5,
      teamMembers: 1,
      apiCallsPerDay: 0,
      customBranding: false,
      whiteLabel: false,
      prioritySupport: false,
      slaHours: 72,
    }
  },
  starter: {
    name: 'Starter',
    price: 29,
    currency: 'USD',
    interval: 'month',
    features: [
      '50 Quotes per month',
      '20 Reports per month',
      '3 Team members',
      'Full design tools',
      '3D visualization',
      'Email support',
    ],
    quotas: {
      quotesPerMonth: 50,
      reportsPerMonth: 20,
      storageGB: 5,
      teamMembers: 3,
      apiCallsPerDay: 100,
      customBranding: false,
      whiteLabel: false,
      prioritySupport: false,
      slaHours: 48,
    }
  },
  professional: {
    name: 'Professional',
    price: 99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited Quotes',
      'Unlimited Reports',
      '10 Team members',
      'Custom branding',
      'API access',
      'Priority support',
      'Advanced analytics',
    ],
    quotas: {
      quotesPerMonth: -1, // Unlimited
      reportsPerMonth: -1,
      storageGB: 50,
      teamMembers: 10,
      apiCallsPerDay: 5000,
      customBranding: true,
      whiteLabel: false,
      prioritySupport: true,
      slaHours: 24,
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 499,
    currency: 'USD',
    interval: 'month',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'White-label solution',
      'Custom domain',
      'SSO integration',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
    quotas: {
      quotesPerMonth: -1,
      reportsPerMonth: -1,
      storageGB: 500,
      teamMembers: -1,
      apiCallsPerDay: -1,
      customBranding: true,
      whiteLabel: true,
      prioritySupport: true,
      slaHours: 4,
    }
  }
};

// ============================================================================
// MULTI-TENANCY ENGINE
// ============================================================================

export class MultiTenancyEngine {
  private tenants: Map<string, Tenant> = new Map();

  // ============================================================================
  // TENANT MANAGEMENT
  // ============================================================================

  createTenant(data: {
    name: string;
    email: string;
    plan: keyof typeof SUBSCRIPTION_PLANS;
    country: string;
  }): Tenant {
    const id = `tenant-${Date.now().toString(36)}`;
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const plan = SUBSCRIPTION_PLANS[data.plan];

    const tenant: Tenant = {
      id,
      name: data.name,
      slug,
      branding: {
        logo: '/default-logo.png',
        logoLight: '/default-logo-light.png',
        primaryColor: '#1e40af',
        secondaryColor: '#3b82f6',
        accentColor: '#10b981',
        companyName: data.name,
        tagline: 'Solar Design Made Simple',
        favicon: '/favicon.ico',
        emailTemplate: {
          headerImage: '/email-header.png',
          footerText: `© ${new Date().getFullYear()} ${data.name}. All rights reserved.`,
          primaryButtonColor: '#1e40af',
        },
        reportTemplate: {
          headerLogo: '/default-logo.png',
          footerLogo: '/default-logo.png',
          watermark: data.name,
          primaryColor: '#1e40af',
        },
        hideEmersonEIMSBranding: plan.quotas.whiteLabel,
      },
      subscription: {
        plan: data.plan,
        status: data.plan === 'free' ? 'active' : 'trialing',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        trialEnd: data.plan !== 'free' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        invoices: [],
      },
      settings: {
        language: 'en',
        timezone: 'Africa/Nairobi',
        dateFormat: 'DD/MM/YYYY',
        currency: 'KES',
        measurementUnit: 'metric',
        emailNotifications: true,
        twoFactorRequired: data.plan === 'enterprise',
        ssoEnabled: false,
        apiAccess: plan.quotas.apiCallsPerDay > 0,
        defaultCountry: data.country,
        supportEmail: `support@${slug}.solargeniuspro.com`,
        supportPhone: '',
      },
      users: [
        {
          id: `user-${Date.now().toString(36)}`,
          email: data.email,
          name: 'Account Owner',
          role: 'owner',
          permissions: ['*'],
          status: 'active',
          mfaEnabled: false,
        }
      ],
      quotas: {
        quotesPerMonth: { used: 0, limit: plan.quotas.quotesPerMonth },
        reportsPerMonth: { used: 0, limit: plan.quotas.reportsPerMonth },
        storageGB: { used: 0, limit: plan.quotas.storageGB },
        teamMembers: { used: 1, limit: plan.quotas.teamMembers },
        apiCallsPerDay: { used: 0, limit: plan.quotas.apiCallsPerDay },
        customBranding: plan.quotas.customBranding,
        whiteLabel: plan.quotas.whiteLabel,
        prioritySupport: plan.quotas.prioritySupport,
        slaHours: plan.quotas.slaHours,
      },
      analytics: {
        totalQuotes: 0,
        totalQuotesValue: 0,
        totalReports: 0,
        conversionRate: 0,
        averageQuoteValue: 0,
        quotesThisMonth: 0,
        reportsThisMonth: 0,
        activeUsers: 1,
        topDesignedSystems: [],
        regionBreakdown: [],
        monthlyTrend: [],
        lastUpdated: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    this.tenants.set(id, tenant);
    return tenant;
  }

  getTenant(tenantId: string): Tenant | undefined {
    return this.tenants.get(tenantId);
  }

  getTenantBySlug(slug: string): Tenant | undefined {
    return Array.from(this.tenants.values()).find(t => t.slug === slug);
  }

  getTenantByDomain(domain: string): Tenant | undefined {
    return Array.from(this.tenants.values()).find(t => t.customDomain === domain);
  }

  // ============================================================================
  // CUSTOM DOMAIN MANAGEMENT
  // ============================================================================

  setCustomDomain(tenantId: string, domain: string): { success: boolean; message: string; dnsRecords?: any[] } {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) {
      return { success: false, message: 'Tenant not found' };
    }

    if (!tenant.quotas.whiteLabel) {
      return { success: false, message: 'Custom domains require Enterprise plan' };
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return { success: false, message: 'Invalid domain format' };
    }

    tenant.customDomain = domain;

    return {
      success: true,
      message: 'Domain configured. Please add the following DNS records:',
      dnsRecords: [
        { type: 'CNAME', name: domain, value: 'proxy.solargeniuspro.com', ttl: 3600 },
        { type: 'TXT', name: `_solargeniuspro.${domain}`, value: `v=spf1 include:solargeniuspro.com ~all`, ttl: 3600 },
        { type: 'TXT', name: domain, value: `solargeniuspro-verification=${tenantId}`, ttl: 3600 },
      ]
    };
  }

  verifyCustomDomain(tenantId: string): { verified: boolean; sslStatus: string } {
    const tenant = this.tenants.get(tenantId);
    if (!tenant?.customDomain) {
      return { verified: false, sslStatus: 'pending' };
    }

    // In production, this would actually verify DNS records
    // Simulating verification
    return {
      verified: Math.random() > 0.3, // 70% success rate for simulation
      sslStatus: 'issued' // or 'pending', 'failed'
    };
  }

  // ============================================================================
  // BRANDING MANAGEMENT
  // ============================================================================

  updateBranding(tenantId: string, branding: Partial<TenantBranding>): Tenant | null {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    if (!tenant.quotas.customBranding && Object.keys(branding).length > 0) {
      throw new Error('Custom branding requires Professional plan or higher');
    }

    tenant.branding = { ...tenant.branding, ...branding };
    return tenant;
  }

  // ============================================================================
  // BILLING PORTAL
  // ============================================================================

  getBillingPortalData(tenantId: string): {
    subscription: TenantSubscription;
    invoices: Invoice[];
    usage: TenantQuotas;
    availablePlans: typeof SUBSCRIPTION_PLANS;
  } | null {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    return {
      subscription: tenant.subscription,
      invoices: tenant.subscription.invoices,
      usage: tenant.quotas,
      availablePlans: SUBSCRIPTION_PLANS,
    };
  }

  generateInvoice(tenantId: string): Invoice | null {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    const plan = SUBSCRIPTION_PLANS[tenant.subscription.plan];
    const invoiceNumber = `INV-${tenant.slug.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const invoice: Invoice = {
      id: `inv-${Date.now().toString(36)}`,
      number: invoiceNumber,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'open',
      amount: plan.price,
      currency: plan.currency,
      lineItems: [
        {
          description: `${plan.name} Plan - Monthly Subscription`,
          quantity: 1,
          unitPrice: plan.price,
          total: plan.price,
        }
      ],
    };

    tenant.subscription.invoices.push(invoice);
    return invoice;
  }

  updateSubscription(tenantId: string, newPlan: keyof typeof SUBSCRIPTION_PLANS): Tenant | null {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    const plan = SUBSCRIPTION_PLANS[newPlan];
    tenant.subscription.plan = newPlan;
    tenant.quotas = {
      quotesPerMonth: { used: tenant.quotas.quotesPerMonth.used, limit: plan.quotas.quotesPerMonth },
      reportsPerMonth: { used: tenant.quotas.reportsPerMonth.used, limit: plan.quotas.reportsPerMonth },
      storageGB: { used: tenant.quotas.storageGB.used, limit: plan.quotas.storageGB },
      teamMembers: { used: tenant.quotas.teamMembers.used, limit: plan.quotas.teamMembers },
      apiCallsPerDay: { used: tenant.quotas.apiCallsPerDay.used, limit: plan.quotas.apiCallsPerDay },
      customBranding: plan.quotas.customBranding,
      whiteLabel: plan.quotas.whiteLabel,
      prioritySupport: plan.quotas.prioritySupport,
      slaHours: plan.quotas.slaHours,
    };

    return tenant;
  }

  // ============================================================================
  // TENANT ANALYTICS
  // ============================================================================

  updateTenantAnalytics(tenantId: string): TenantAnalytics | null {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    // Simulate analytics update
    const baseQuotes = 50 + Math.floor(Math.random() * 200);
    const avgValue = 5000 + Math.floor(Math.random() * 15000);

    tenant.analytics = {
      totalQuotes: baseQuotes,
      totalQuotesValue: baseQuotes * avgValue,
      totalReports: Math.floor(baseQuotes * 0.6),
      conversionRate: 15 + Math.random() * 25,
      averageQuoteValue: avgValue,
      quotesThisMonth: Math.floor(baseQuotes * 0.15),
      reportsThisMonth: Math.floor(baseQuotes * 0.1),
      activeUsers: tenant.users.filter(u => u.status === 'active').length,
      topDesignedSystems: [
        { size: '5kW', count: Math.floor(baseQuotes * 0.3) },
        { size: '10kW', count: Math.floor(baseQuotes * 0.25) },
        { size: '15kW', count: Math.floor(baseQuotes * 0.2) },
        { size: '20kW+', count: Math.floor(baseQuotes * 0.15) },
      ],
      regionBreakdown: [
        { region: 'Nairobi', count: Math.floor(baseQuotes * 0.4), value: Math.floor(baseQuotes * 0.4 * avgValue) },
        { region: 'Coast', count: Math.floor(baseQuotes * 0.2), value: Math.floor(baseQuotes * 0.2 * avgValue) },
        { region: 'Central', count: Math.floor(baseQuotes * 0.15), value: Math.floor(baseQuotes * 0.15 * avgValue) },
        { region: 'Other', count: Math.floor(baseQuotes * 0.25), value: Math.floor(baseQuotes * 0.25 * avgValue) },
      ],
      monthlyTrend: Array.from({ length: 6 }, (_, i) => ({
        month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
        quotes: Math.floor(baseQuotes / 6 * (0.8 + Math.random() * 0.4)),
        value: Math.floor(avgValue * baseQuotes / 6 * (0.8 + Math.random() * 0.4)),
      })),
      lastUpdated: new Date().toISOString(),
    };

    return tenant.analytics;
  }

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================

  inviteUser(tenantId: string, email: string, role: TenantUser['role']): TenantUser | null {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    if (tenant.quotas.teamMembers.limit !== -1 &&
        tenant.quotas.teamMembers.used >= tenant.quotas.teamMembers.limit) {
      throw new Error('Team member limit reached. Upgrade plan for more seats.');
    }

    const newUser: TenantUser = {
      id: `user-${Date.now().toString(36)}`,
      email,
      name: email.split('@')[0],
      role,
      permissions: this.getRolePermissions(role),
      status: 'invited',
      mfaEnabled: false,
    };

    tenant.users.push(newUser);
    tenant.quotas.teamMembers.used++;

    return newUser;
  }

  private getRolePermissions(role: TenantUser['role']): string[] {
    const permissions: Record<TenantUser['role'], string[]> = {
      owner: ['*'],
      admin: ['manage:users', 'manage:settings', 'manage:billing', 'create:quotes', 'create:reports', 'view:analytics'],
      engineer: ['create:quotes', 'create:reports', 'view:analytics'],
      sales: ['create:quotes', 'view:analytics'],
      viewer: ['view:quotes', 'view:reports'],
    };
    return permissions[role];
  }

  // ============================================================================
  // QUOTA ENFORCEMENT
  // ============================================================================

  checkQuota(tenantId: string, quotaType: 'quotesPerMonth' | 'reportsPerMonth' | 'apiCallsPerDay'): {
    allowed: boolean;
    remaining: number;
    limit: number;
  } {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) {
      return { allowed: false, remaining: 0, limit: 0 };
    }

    const quota = tenant.quotas[quotaType];
    if (quota.limit === -1) {
      return { allowed: true, remaining: -1, limit: -1 };
    }

    return {
      allowed: quota.used < quota.limit,
      remaining: Math.max(0, quota.limit - quota.used),
      limit: quota.limit,
    };
  }

  incrementQuotaUsage(tenantId: string, quotaType: 'quotesPerMonth' | 'reportsPerMonth' | 'apiCallsPerDay'): boolean {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return false;

    const quota = tenant.quotas[quotaType];
    if (quota.limit !== -1 && quota.used >= quota.limit) {
      return false;
    }

    quota.used++;
    return true;
  }
}

// Export singleton
export const multiTenancy = new MultiTenancyEngine();
