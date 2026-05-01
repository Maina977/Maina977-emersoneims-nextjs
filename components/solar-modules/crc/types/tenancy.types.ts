// Multi-Tenancy Type Definitions

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

export interface Subscription {
  id: string;
  tenantId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  paymentMethodId?: string;
  features: string[];
  limits: SubscriptionLimits;
}

export interface SubscriptionLimits {
  maxProjects: number;
  maxUsers: number;
  maxApiCalls: number;
  storageGB: number;
  designsPerMonth: number;
  reportsPerMonth: number;
  concurrentUsers: number;
  supportLevel: 'basic' | 'priority' | 'dedicated';
}