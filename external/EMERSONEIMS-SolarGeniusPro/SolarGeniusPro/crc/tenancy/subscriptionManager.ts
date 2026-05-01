// SUBSCRIPTION MANAGEMENT
// Plan management, billing cycles, feature gating

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
  metadata: Record<string, any>;
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

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  limits: SubscriptionLimits;
  isActive: boolean;
}

class SubscriptionManager {
  private plans: Map<string, Plan> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();
  
  constructor() {
    this.initializePlans();
  }
  
  private initializePlans(): void {
    const plans: Plan[] = [
      {
        id: 'free',
        name: 'Free',
        priceMonthly: 0,
        priceYearly: 0,
        features: ['solar_design', 'basic_reports', 'email_support'],
        limits: {
          maxProjects: 5,
          maxUsers: 1,
          maxApiCalls: 1000,
          storageGB: 0.1,
          designsPerMonth: 10,
          reportsPerMonth: 5,
          concurrentUsers: 1,
          supportLevel: 'basic'
        },
        isActive: true
      },
      {
        id: 'pro',
        name: 'Professional',
        priceMonthly: 5000,
        priceYearly: 50000,
        features: ['solar_design', 'advanced_reports', 'digital_twin', 'api_access', 'priority_support'],
        limits: {
          maxProjects: 50,
          maxUsers: 10,
          maxApiCalls: 10000,
          storageGB: 10,
          designsPerMonth: 100,
          reportsPerMonth: 50,
          concurrentUsers: 5,
          supportLevel: 'priority'
        },
        isActive: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        priceMonthly: 25000,
        priceYearly: 250000,
        features: ['all_features', 'white_label', 'custom_integrations', 'dedicated_support', 'sla'],
        limits: {
          maxProjects: 500,
          maxUsers: 100,
          maxApiCalls: 100000,
          storageGB: 100,
          designsPerMonth: 1000,
          reportsPerMonth: 500,
          concurrentUsers: 50,
          supportLevel: 'dedicated'
        },
        isActive: true
      }
    ];
    
    for (const plan of plans) {
      this.plans.set(plan.id, plan);
    }
  }
  
  async createSubscription(tenantId: string, planId: string, paymentMethodId?: string): Promise<Subscription> {
    const plan = this.plans.get(planId);
    if (!plan) {
      throw new Error(`Plan ${planId} not found`);
    }
    
    const subscription: Subscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`,
      tenantId,
      plan: planId as any,
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000),
      cancelAtPeriodEnd: false,
      trialEnd: new Date(Date.now() + 14 * 86400000),
      paymentMethodId,
      features: plan.features,
      limits: plan.limits,
      metadata: {}
    };
    
    this.subscriptions.set(subscription.id, subscription);
    await this.saveSubscription(subscription);
    
    return subscription;
  }
  
  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    return this.subscriptions.get(subscriptionId) || null;
  }
  
  async getSubscriptionByTenant(tenantId: string): Promise<Subscription | null> {
    for (const sub of this.subscriptions.values()) {
      if (sub.tenantId === tenantId) {
        return sub;
      }
    }
    return null;
  }
  
  async cancelSubscription(subscriptionId: string, atPeriodEnd: boolean = true): Promise<Subscription> {
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }
    
    if (atPeriodEnd) {
      subscription.cancelAtPeriodEnd = true;
      subscription.status = 'active';
    } else {
      subscription.status = 'canceled';
      subscription.currentPeriodEnd = new Date();
    }
    
    await this.saveSubscription(subscription);
    return subscription;
  }
  
  async changePlan(subscriptionId: string, newPlanId: string): Promise<Subscription> {
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }
    
    const newPlan = this.plans.get(newPlanId);
    if (!newPlan) {
      throw new Error(`Plan ${newPlanId} not found`);
    }
    
    subscription.plan = newPlanId as any;
    subscription.features = newPlan.features;
    subscription.limits = newPlan.limits;
    
    await this.saveSubscription(subscription);
    return subscription;
  }
  
  async renewSubscription(subscriptionId: string, paymentSuccess: boolean): Promise<Subscription> {
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }
    
    if (paymentSuccess) {
      subscription.currentPeriodStart = new Date();
      subscription.currentPeriodEnd = new Date(Date.now() + 30 * 86400000);
      subscription.status = 'active';
    } else {
      subscription.status = 'past_due';
    }
    
    await this.saveSubscription(subscription);
    return subscription;
  }
  
  async checkFeatureAccess(tenantId: string, feature: string): Promise<boolean> {
    const subscription = await this.getSubscriptionByTenant(tenantId);
    if (!subscription || subscription.status !== 'active') {
      return false;
    }
    
    return subscription.features.includes(feature) || subscription.features.includes('all_features');
  }
  
  async getRemainingQuota(tenantId: string, quotaType: keyof SubscriptionLimits): Promise<number> {
    const subscription = await this.getSubscriptionByTenant(tenantId);
    if (!subscription) {
      return 0;
    }
    
    const limit = subscription.limits[quotaType];
    const used = await this.getUsage(tenantId, quotaType);
    
    return Math.max(0, limit - used);
  }
  
  async consumeQuota(tenantId: string, quotaType: keyof SubscriptionLimits, amount: number = 1): Promise<boolean> {
    const remaining = await this.getRemainingQuota(tenantId, quotaType);
    if (remaining < amount) {
      return false;
    }
    
    await this.incrementUsage(tenantId, quotaType, amount);
    return true;
  }
  
  async getPlan(planId: string): Promise<Plan | null> {
    return this.plans.get(planId) || null;
  }
  
  async getAllPlans(): Promise<Plan[]> {
    return Array.from(this.plans.values()).filter(p => p.isActive);
  }
  
  async getUpcomingInvoice(subscriptionId: string): Promise<{
    amount: number;
    currency: string;
    date: Date;
    items: Array<{ description: string; amount: number }>;
  }> {
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }
    
    const plan = await this.getPlan(subscription.plan);
    if (!plan) {
      throw new Error(`Plan ${subscription.plan} not found`);
    }
    
    return {
      amount: plan.priceMonthly,
      currency: 'KES',
      date: subscription.currentPeriodEnd,
      items: [
        { description: `${plan.name} Plan - Monthly`, amount: plan.priceMonthly }
      ]
    };
  }
  
  private async getUsage(tenantId: string, quotaType: string): Promise<number> {
    // In production, query database for actual usage
    return 0;
  }
  
  private async incrementUsage(tenantId: string, quotaType: string, amount: number): Promise<void> {
    // In production, update usage counters
    console.log(`Incremented ${quotaType} for ${tenantId} by ${amount}`);
  }
  
  private async saveSubscription(subscription: Subscription): Promise<void> {
    // In production, save to database
    console.log(`Saved subscription ${subscription.id}`);
  }
}

export const subscriptionManager = new SubscriptionManager();