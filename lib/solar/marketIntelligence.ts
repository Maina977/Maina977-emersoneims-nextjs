/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   SOLARGENIUS PRO - MARKET INTELLIGENCE ENGINE                              ║
 * ║   Real-Time Pricing, Demand Forecasting, Supplier Analytics                 ║
 * ║   Copyright © 2024-2026 EmersonEIMS - All Rights Reserved                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface Supplier {
  id: string;
  name: string;
  country: string;
  type: 'manufacturer' | 'distributor' | 'wholesaler' | 'retailer';
  brands: string[];
  rating: SupplierRating;
  contacts: {
    email: string;
    phone: string;
    website: string;
  };
  logistics: {
    leadTimeDays: number;
    shippingMethods: string[];
    minimumOrder: number;
    currency: string;
  };
  certifications: string[];
  activeStatus: boolean;
}

export interface SupplierRating {
  overall: number; // 1-5
  quality: number;
  delivery: number;
  pricing: number;
  support: number;
  reviewCount: number;
  lastUpdated: string;
}

export interface PricePoint {
  supplierId: string;
  productId: string;
  price: number;
  currency: string;
  quantity: number;
  timestamp: string;
  validUntil: string;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  targetPrice: number;
  currentPrice: number;
  alertType: 'below' | 'above' | 'change';
  threshold: number; // percentage
  status: 'active' | 'triggered' | 'expired';
  createdAt: string;
  triggeredAt?: string;
  notificationMethod: 'email' | 'sms' | 'push' | 'all';
}

export interface DemandForecast {
  period: string;
  region: string;
  productCategory: string;
  predictedDemand: number;
  confidence: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  seasonalFactor: number;
  marketDrivers: string[];
  recommendations: string[];
}

export interface PriceComparison {
  productId: string;
  productName: string;
  specifications: string;
  suppliers: Array<{
    supplierId: string;
    supplierName: string;
    price: number;
    currency: string;
    leadTime: number;
    inStock: boolean;
    rating: number;
    bulkDiscount?: { quantity: number; discount: number }[];
  }>;
  lowestPrice: number;
  averagePrice: number;
  priceRange: { min: number; max: number };
  recommendation: string;
}

export interface MarketTrend {
  category: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  period: string;
  factors: string[];
  forecast: string;
}

export interface LeadTimeTracking {
  supplierId: string;
  supplierName: string;
  orderHistory: Array<{
    orderId: string;
    orderDate: string;
    promisedDate: string;
    deliveredDate: string;
    onTime: boolean;
    daysVariance: number;
  }>;
  averageLeadTime: number;
  onTimeRate: number;
  reliability: 'excellent' | 'good' | 'fair' | 'poor';
}

// ============================================================================
// SUPPLIER DATABASE
// ============================================================================

export const SUPPLIERS: Supplier[] = [
  {
    id: 'sup-001',
    name: 'SunPower East Africa',
    country: 'KE',
    type: 'distributor',
    brands: ['LONGi', 'JinkoSolar', 'Canadian Solar', 'Trina Solar'],
    rating: { overall: 4.5, quality: 4.7, delivery: 4.3, pricing: 4.4, support: 4.6, reviewCount: 156, lastUpdated: '2026-03-15' },
    contacts: { email: 'sales@sunpowerea.com', phone: '+254 700 123 456', website: 'www.sunpowereastafrica.com' },
    logistics: { leadTimeDays: 14, shippingMethods: ['Air Freight', 'Sea Freight', 'Local Pickup'], minimumOrder: 5000, currency: 'USD' },
    certifications: ['ISO 9001', 'IEC Certified Partner'],
    activeStatus: true
  },
  {
    id: 'sup-002',
    name: 'Solartech Nigeria',
    country: 'NG',
    type: 'wholesaler',
    brands: ['Huawei', 'Sungrow', 'Growatt', 'Deye'],
    rating: { overall: 4.2, quality: 4.4, delivery: 4.0, pricing: 4.3, support: 4.1, reviewCount: 89, lastUpdated: '2026-03-10' },
    contacts: { email: 'info@solartechng.com', phone: '+234 800 123 4567', website: 'www.solartechng.com' },
    logistics: { leadTimeDays: 21, shippingMethods: ['Sea Freight', 'Local Delivery'], minimumOrder: 10000, currency: 'USD' },
    certifications: ['NERC Approved'],
    activeStatus: true
  },
  {
    id: 'sup-003',
    name: 'Solar Warehouse SA',
    country: 'ZA',
    type: 'wholesaler',
    brands: ['BYD', 'Pylontech', 'Dyness', 'Freedom Won'],
    rating: { overall: 4.7, quality: 4.8, delivery: 4.6, pricing: 4.5, support: 4.8, reviewCount: 234, lastUpdated: '2026-03-18' },
    contacts: { email: 'orders@solarwarehousesa.co.za', phone: '+27 11 234 5678', website: 'www.solarwarehousesa.co.za' },
    logistics: { leadTimeDays: 7, shippingMethods: ['Courier', 'Collection', 'Freight'], minimumOrder: 2000, currency: 'ZAR' },
    certifications: ['NERSA Approved', 'ISO 9001'],
    activeStatus: true
  },
  {
    id: 'sup-004',
    name: 'Green Energy Supplies',
    country: 'KE',
    type: 'retailer',
    brands: ['Felicity', 'Must', 'Narada', 'Ritar'],
    rating: { overall: 4.0, quality: 4.1, delivery: 4.2, pricing: 4.5, support: 3.8, reviewCount: 67, lastUpdated: '2026-03-12' },
    contacts: { email: 'sales@greenenergy.co.ke', phone: '+254 722 987 654', website: 'www.greenenergy.co.ke' },
    logistics: { leadTimeDays: 3, shippingMethods: ['Local Delivery', 'Pickup'], minimumOrder: 500, currency: 'KES' },
    certifications: ['KEBS Certified'],
    activeStatus: true
  },
  {
    id: 'sup-005',
    name: 'Shenzhen Solar Direct',
    country: 'CN',
    type: 'manufacturer',
    brands: ['JA Solar', 'Risen', 'Astronergy', 'Seraphim'],
    rating: { overall: 4.3, quality: 4.5, delivery: 4.0, pricing: 4.8, support: 3.9, reviewCount: 312, lastUpdated: '2026-03-20' },
    contacts: { email: 'export@szsolar.cn', phone: '+86 755 1234 5678', website: 'www.shenzhensolardirect.com' },
    logistics: { leadTimeDays: 35, shippingMethods: ['Sea Freight', 'Air Freight'], minimumOrder: 50000, currency: 'USD' },
    certifications: ['TUV', 'CE', 'IEC 61215', 'IEC 61730'],
    activeStatus: true
  },
];

// ============================================================================
// MARKET INTELLIGENCE ENGINE
// ============================================================================

export class MarketIntelligenceEngine {
  private priceHistory: Map<string, PricePoint[]> = new Map();
  private alerts: PriceAlert[] = [];
  private demandForecasts: DemandForecast[] = [];

  // ============================================================================
  // PRICE COMPARISON
  // ============================================================================

  comparePrices(productId: string, productName: string, specs: string, country: string): PriceComparison {
    const relevantSuppliers = SUPPLIERS.filter(s => s.activeStatus);
    const supplierPrices = relevantSuppliers.map(supplier => {
      // Simulate price fetching
      const basePrice = this.getBasePrice(productId, supplier.id);
      const exchangeAdjusted = this.adjustForCurrency(basePrice, supplier.logistics.currency, country);

      return {
        supplierId: supplier.id,
        supplierName: supplier.name,
        price: exchangeAdjusted,
        currency: this.getLocalCurrency(country),
        leadTime: supplier.logistics.leadTimeDays,
        inStock: Math.random() > 0.2, // 80% in stock
        rating: supplier.rating.overall,
        bulkDiscount: [
          { quantity: 10, discount: 3 },
          { quantity: 50, discount: 7 },
          { quantity: 100, discount: 12 },
          { quantity: 500, discount: 18 },
        ]
      };
    });

    const prices = supplierPrices.map(s => s.price);
    const lowestPrice = Math.min(...prices);
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Sort by best value (price + rating + lead time)
    supplierPrices.sort((a, b) => {
      const scoreA = a.price * 0.5 - a.rating * 1000 + a.leadTime * 100;
      const scoreB = b.price * 0.5 - b.rating * 1000 + b.leadTime * 100;
      return scoreA - scoreB;
    });

    const bestOption = supplierPrices[0];
    const recommendation = `Best value: ${bestOption.supplierName} at ${this.formatCurrency(bestOption.price, bestOption.currency)} ` +
      `(${bestOption.leadTime} days lead time, ${bestOption.rating} rating)`;

    return {
      productId,
      productName,
      specifications: specs,
      suppliers: supplierPrices,
      lowestPrice,
      averagePrice,
      priceRange: { min: lowestPrice, max: Math.max(...prices) },
      recommendation
    };
  }

  // ============================================================================
  // PRICE ALERTS
  // ============================================================================

  createPriceAlert(alert: Omit<PriceAlert, 'id' | 'createdAt' | 'status'>): PriceAlert {
    const newAlert: PriceAlert = {
      ...alert,
      id: `ALERT-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    this.alerts.push(newAlert);
    return newAlert;
  }

  checkPriceAlerts(): PriceAlert[] {
    const triggered: PriceAlert[] = [];

    this.alerts.forEach(alert => {
      if (alert.status !== 'active') return;

      // Simulate current price check
      const currentPrice = this.getCurrentPrice(alert.productId);
      alert.currentPrice = currentPrice;

      let shouldTrigger = false;

      switch (alert.alertType) {
        case 'below':
          shouldTrigger = currentPrice <= alert.targetPrice;
          break;
        case 'above':
          shouldTrigger = currentPrice >= alert.targetPrice;
          break;
        case 'change':
          const priceChange = Math.abs((currentPrice - alert.targetPrice) / alert.targetPrice * 100);
          shouldTrigger = priceChange >= alert.threshold;
          break;
      }

      if (shouldTrigger) {
        alert.status = 'triggered';
        alert.triggeredAt = new Date().toISOString();
        triggered.push(alert);
      }
    });

    return triggered;
  }

  getActiveAlerts(): PriceAlert[] {
    return this.alerts.filter(a => a.status === 'active');
  }

  deleteAlert(alertId: string): boolean {
    const index = this.alerts.findIndex(a => a.id === alertId);
    if (index !== -1) {
      this.alerts.splice(index, 1);
      return true;
    }
    return false;
  }

  // ============================================================================
  // DEMAND FORECASTING
  // ============================================================================

  generateDemandForecast(region: string, category: string, months: number = 12): DemandForecast[] {
    const forecasts: DemandForecast[] = [];
    const baseDate = new Date();

    const seasonalFactors: Record<string, number[]> = {
      'KE': [1.0, 1.0, 1.1, 1.2, 1.1, 1.0, 0.9, 0.85, 0.9, 1.0, 1.1, 1.2], // Peak in dry seasons
      'ZA': [0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 0.9, 0.85, 0.8], // Peak in winter (load shedding)
      'NG': [1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 0.95, 0.9, 0.95, 1.0, 1.05, 1.1], // Peak in hot dry season
    };

    const categoryMultipliers: Record<string, number> = {
      'panels': 1.0,
      'inverters': 0.8,
      'batteries': 1.5, // Growing fast
      'mounting': 0.6,
      'cables': 0.4,
    };

    const baseDemand = 1000; // Units per month
    const growthRate = 0.02; // 2% monthly growth

    for (let i = 0; i < months; i++) {
      const forecastDate = new Date(baseDate);
      forecastDate.setMonth(forecastDate.getMonth() + i);
      const monthIndex = forecastDate.getMonth();

      const seasonalFactor = (seasonalFactors[region] || seasonalFactors['KE'])[monthIndex];
      const categoryMultiplier = categoryMultipliers[category] || 1.0;
      const growthFactor = Math.pow(1 + growthRate, i);

      const predictedDemand = Math.round(baseDemand * seasonalFactor * categoryMultiplier * growthFactor);

      let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
      if (i > 0 && forecasts[i - 1]) {
        const change = (predictedDemand - forecasts[i - 1].predictedDemand) / forecasts[i - 1].predictedDemand;
        if (change > 0.05) trend = 'increasing';
        else if (change < -0.05) trend = 'decreasing';
      }

      forecasts.push({
        period: forecastDate.toISOString().slice(0, 7),
        region,
        productCategory: category,
        predictedDemand,
        confidence: 85 - (i * 2), // Confidence decreases further out
        trend,
        seasonalFactor,
        marketDrivers: this.getMarketDrivers(region, category),
        recommendations: this.getRecommendations(trend, seasonalFactor)
      });
    }

    this.demandForecasts = forecasts;
    return forecasts;
  }

  private getMarketDrivers(region: string, category: string): string[] {
    const drivers: Record<string, string[]> = {
      'KE': ['Grid reliability concerns', 'Rising electricity tariffs', 'Government solar incentives', 'Commercial sector growth'],
      'ZA': ['Load shedding crisis', 'Net metering implementation', 'Carbon tax', 'Mining sector demand'],
      'NG': ['Grid infrastructure gaps', 'Diesel cost increases', 'Banking sector expansion', 'Telecom tower demand'],
    };
    return drivers[region] || ['General market growth', 'Energy cost savings', 'Environmental awareness'];
  }

  private getRecommendations(trend: string, seasonalFactor: number): string[] {
    const recs: string[] = [];
    if (trend === 'increasing') {
      recs.push('Consider increasing inventory levels');
      recs.push('Lock in supplier contracts at current prices');
    }
    if (seasonalFactor > 1.1) {
      recs.push('High season approaching - prepare marketing campaigns');
      recs.push('Ensure installation team capacity');
    }
    if (seasonalFactor < 0.9) {
      recs.push('Consider promotional pricing to maintain volume');
      recs.push('Focus on maintenance contracts during slow period');
    }
    return recs;
  }

  // ============================================================================
  // SUPPLIER RATINGS
  // ============================================================================

  getSupplierRatings(category?: string): Supplier[] {
    let suppliers = [...SUPPLIERS];
    if (category) {
      suppliers = suppliers.filter(s =>
        s.brands.some(b => this.brandBelongsToCategory(b, category))
      );
    }
    return suppliers.sort((a, b) => b.rating.overall - a.rating.overall);
  }

  updateSupplierRating(supplierId: string, newRating: Partial<SupplierRating>): Supplier | null {
    const supplier = SUPPLIERS.find(s => s.id === supplierId);
    if (!supplier) return null;

    supplier.rating = { ...supplier.rating, ...newRating, lastUpdated: new Date().toISOString() };

    // Recalculate overall
    supplier.rating.overall = (
      supplier.rating.quality * 0.3 +
      supplier.rating.delivery * 0.25 +
      supplier.rating.pricing * 0.25 +
      supplier.rating.support * 0.2
    );

    return supplier;
  }

  // ============================================================================
  // LEAD TIME TRACKING
  // ============================================================================

  getLeadTimeAnalytics(supplierId: string): LeadTimeTracking {
    const supplier = SUPPLIERS.find(s => s.id === supplierId);
    if (!supplier) {
      throw new Error(`Supplier ${supplierId} not found`);
    }

    // Simulate order history
    const orderHistory = [];
    for (let i = 0; i < 20; i++) {
      const orderDate = new Date(Date.now() - (i * 15 + Math.random() * 10) * 24 * 60 * 60 * 1000);
      const promisedDays = supplier.logistics.leadTimeDays;
      const actualVariance = Math.floor(Math.random() * 10) - 3; // -3 to +7 days
      const promisedDate = new Date(orderDate.getTime() + promisedDays * 24 * 60 * 60 * 1000);
      const deliveredDate = new Date(promisedDate.getTime() + actualVariance * 24 * 60 * 60 * 1000);

      orderHistory.push({
        orderId: `ORD-${(1000 + i).toString()}`,
        orderDate: orderDate.toISOString().split('T')[0],
        promisedDate: promisedDate.toISOString().split('T')[0],
        deliveredDate: deliveredDate.toISOString().split('T')[0],
        onTime: actualVariance <= 0,
        daysVariance: actualVariance
      });
    }

    const onTimeCount = orderHistory.filter(o => o.onTime).length;
    const onTimeRate = Math.round((onTimeCount / orderHistory.length) * 100);
    const avgLeadTime = Math.round(
      orderHistory.reduce((sum, o) => {
        const days = (new Date(o.deliveredDate).getTime() - new Date(o.orderDate).getTime()) / (24 * 60 * 60 * 1000);
        return sum + days;
      }, 0) / orderHistory.length
    );

    let reliability: 'excellent' | 'good' | 'fair' | 'poor' = 'good';
    if (onTimeRate >= 90) reliability = 'excellent';
    else if (onTimeRate >= 75) reliability = 'good';
    else if (onTimeRate >= 60) reliability = 'fair';
    else reliability = 'poor';

    return {
      supplierId,
      supplierName: supplier.name,
      orderHistory,
      averageLeadTime: avgLeadTime,
      onTimeRate,
      reliability
    };
  }

  // ============================================================================
  // MARKET TRENDS
  // ============================================================================

  getMarketTrends(): MarketTrend[] {
    return [
      {
        category: 'Solar Panels',
        trend: 'down',
        changePercent: -8.5,
        period: 'Last 6 months',
        factors: ['Increased production capacity', 'New manufacturing plants in Asia', 'Technology improvements'],
        forecast: 'Prices expected to stabilize in Q3 2026'
      },
      {
        category: 'Lithium Batteries',
        trend: 'down',
        changePercent: -12.3,
        period: 'Last 6 months',
        factors: ['LFP technology adoption', 'Lithium price correction', 'Chinese production scaling'],
        forecast: 'Further 5-10% reduction expected'
      },
      {
        category: 'Inverters',
        trend: 'stable',
        changePercent: 1.2,
        period: 'Last 6 months',
        factors: ['Stable silicon prices', 'Chip shortage resolved', 'Competition intensifying'],
        forecast: 'Prices stable with feature improvements'
      },
      {
        category: 'Mounting Systems',
        trend: 'up',
        changePercent: 5.8,
        period: 'Last 6 months',
        factors: ['Aluminum price increase', 'Shipping costs', 'Quality improvements'],
        forecast: 'Moderate increase expected'
      },
      {
        category: 'Installation Labor',
        trend: 'up',
        changePercent: 15.2,
        period: 'Last 12 months',
        factors: ['Skilled labor shortage', 'Increased demand', 'Training requirements'],
        forecast: 'Continued upward pressure'
      }
    ];
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private getBasePrice(productId: string, supplierId: string): number {
    // Simulate base price lookup
    const basePrices: Record<string, number> = {
      'panel-600w': 400,
      'panel-550w': 320,
      'inverter-10kw': 2500,
      'inverter-5kw': 1400,
      'battery-10kwh': 3500,
      'battery-5kwh': 1800,
    };
    const base = basePrices[productId] || 1000;
    const supplierVariance = (Math.random() - 0.5) * 0.2; // ±10%
    return Math.round(base * (1 + supplierVariance));
  }

  private getCurrentPrice(productId: string): number {
    return this.getBasePrice(productId, 'default');
  }

  private adjustForCurrency(priceUSD: number, supplierCurrency: string, targetCountry: string): number {
    const rates: Record<string, number> = {
      'USD': 1,
      'KES': 130,
      'ZAR': 18.5,
      'NGN': 1550,
      'EUR': 0.92,
      'GBP': 0.79,
    };
    const targetCurrency = this.getLocalCurrency(targetCountry);
    return Math.round(priceUSD * (rates[targetCurrency] || 1));
  }

  private getLocalCurrency(country: string): string {
    const currencies: Record<string, string> = {
      'KE': 'KES',
      'ZA': 'ZAR',
      'NG': 'NGN',
      'US': 'USD',
      'GB': 'GBP',
      'DE': 'EUR',
    };
    return currencies[country] || 'USD';
  }

  private formatCurrency(amount: number, currency: string): string {
    const symbols: Record<string, string> = {
      'USD': '$',
      'KES': 'KSh',
      'ZAR': 'R',
      'NGN': '₦',
      'EUR': '€',
      'GBP': '£',
    };
    return `${symbols[currency] || ''}${amount.toLocaleString()}`;
  }

  private brandBelongsToCategory(brand: string, category: string): boolean {
    const categoryBrands: Record<string, string[]> = {
      'panels': ['LONGi', 'JinkoSolar', 'Canadian Solar', 'Trina Solar', 'JA Solar', 'Risen'],
      'inverters': ['Huawei', 'Sungrow', 'Growatt', 'Deye', 'Victron', 'SolaX', 'Fronius', 'SMA'],
      'batteries': ['BYD', 'Pylontech', 'Dyness', 'Freedom Won', 'Felicity', 'Narada'],
    };
    return (categoryBrands[category] || []).includes(brand);
  }
}

// Export singleton
export const marketIntelligence = new MarketIntelligenceEngine();
