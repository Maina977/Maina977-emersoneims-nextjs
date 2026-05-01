// MARKET INTELLIGENCE - LIVE PRICING ENGINE
// Real-time component pricing and optimization

export interface PriceQuote {
  id: string;
  componentType: string;
  componentModel: string;
  supplierId: string;
  supplierName: string;
  price: number;
  currency: string;
  quantity: number;
  bulkDiscount?: number;
  shipping: number;
  total: number;
  validUntil: Date;
  timestamp: Date;
}

export interface PriceOptimization {
  components: Array<{
    type: string;
    selectedModel: string;
    selectedSupplier: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalCost: number;
  savings: number;
  alternatives: Array<{
    description: string;
    savings: number;
  }>;
}

class LivePricingEngine {
  private priceCache: Map<string, PriceQuote[]> = new Map();
  private updateInterval: number | null = null;
  
  constructor() {
    this.startAutoUpdate();
  }
  
  private startAutoUpdate(): void {
    this.updateInterval = window.setInterval(() => {
      this.refreshAllPrices();
    }, 3600000); // Update every hour
  }
  
  async getPrice(componentType: string, model: string, quantity: number = 1): Promise<PriceQuote | null> {
    const key = `${componentType}_${model}`;
    let quotes = this.priceCache.get(key);
    
    if (!quotes || quotes.length === 0) {
      quotes = await this.fetchPrices(componentType, model);
      this.priceCache.set(key, quotes);
    }
    
    if (!quotes || quotes.length === 0) return null;
    
    // Get best price
    const bestQuote = quotes.reduce((best, current) => 
      current.price < best.price ? current : best
    );
    
    // Apply bulk discount
    let finalPrice = bestQuote.price * quantity;
    if (quantity >= 10) {
      const discount = bestQuote.bulkDiscount || 5;
      finalPrice = finalPrice * (1 - discount / 100);
    }
    
    return {
      ...bestQuote,
      quantity,
      total: finalPrice + bestQuote.shipping,
      timestamp: new Date()
    };
  }
  
  async getOptimizedProcurement(
    components: Array<{ type: string; model?: string; quantity: number }>
  ): Promise<PriceOptimization> {
    const selectedComponents = [];
    let totalCost = 0;
    let originalCost = 0;
    
    for (const comp of components) {
      let bestQuote: PriceQuote | null = null;
      
      if (comp.model) {
        bestQuote = await this.getPrice(comp.type, comp.model, comp.quantity);
      } else {
        // Find best model for this type
        const models = await this.getModelsForType(comp.type);
        for (const model of models) {
          const quote = await this.getPrice(comp.type, model, comp.quantity);
          if (!bestQuote || (quote && quote.price < bestQuote.price)) {
            bestQuote = quote;
          }
        }
      }
      
      if (bestQuote) {
        selectedComponents.push({
          type: comp.type,
          selectedModel: bestQuote.componentModel,
          selectedSupplier: bestQuote.supplierName,
          quantity: comp.quantity,
          unitPrice: bestQuote.price,
          totalPrice: bestQuote.total
        });
        totalCost += bestQuote.total;
        originalCost += bestQuote.price * comp.quantity * 1.2; // Assume 20% markup
      }
    }
    
    const savings = originalCost - totalCost;
    
    return {
      components: selectedComponents,
      totalCost,
      savings,
      alternatives: [
        { description: 'Bulk purchase discount', savings: totalCost * 0.05 },
        { description: 'Alternative supplier', savings: totalCost * 0.08 },
        { description: 'Payment terms optimization', savings: totalCost * 0.02 }
      ]
    };
  }
  
  private async fetchPrices(componentType: string, model: string): Promise<PriceQuote[]> {
    // Simulate API calls to multiple suppliers
    const suppliers = ['Solar Africa', 'Greentech', 'Power Solutions', 'Eco Energy'];
    const quotes: PriceQuote[] = [];
    
    for (const supplier of suppliers) {
      const basePrice = this.getBasePrice(componentType, model);
      const variance = 0.9 + Math.random() * 0.2;
      
      quotes.push({
        id: this.generateId(),
        componentType,
        componentModel: model,
        supplierId: `sup_${supplier.toLowerCase().replace(/\s/g, '_')}`,
        supplierName: supplier,
        price: Math.round(basePrice * variance),
        currency: 'KES',
        quantity: 1,
        bulkDiscount: Math.random() > 0.7 ? 5 + Math.random() * 10 : undefined,
        shipping: 2500 + Math.random() * 5000,
        total: 0,
        validUntil: new Date(Date.now() + 7 * 86400000),
        timestamp: new Date()
      });
    }
    
    return quotes;
  }
  
  private getBasePrice(componentType: string, model: string): number {
    const prices: Record<string, Record<string, number>> = {
      panel: { 'JA Solar 485W': 12500, 'Longi 540W': 13800, 'Trina 455W': 11500 },
      inverter: { 'Deye 6kW': 95000, 'Solis 5kW': 78000, 'Growatt 6kW': 85000 },
      battery: { 'Dyness 5.12kWh': 185000, 'Pylontech 3.55kWh': 125000, 'BYD 10.24kWh': 350000 }
    };
    
    return prices[componentType]?.[model] || 50000;
  }
  
  private async getModelsForType(componentType: string): Promise<string[]> {
    const models: Record<string, string[]> = {
      panel: ['JA Solar 485W', 'Longi 540W', 'Trina 455W'],
      inverter: ['Deye 6kW', 'Solis 5kW', 'Growatt 6kW'],
      battery: ['Dyness 5.12kWh', 'Pylontech 3.55kWh', 'BYD 10.24kWh']
    };
    
    return models[componentType] || [];
  }
  
  private async refreshAllPrices(): Promise<void> {
    const types = ['panel', 'inverter', 'battery'];
    
    for (const type of types) {
      const models = await this.getModelsForType(type);
      for (const model of models) {
        const key = `${type}_${model}`;
        const quotes = await this.fetchPrices(type, model);
        this.priceCache.set(key, quotes);
      }
    }
  }
  
  async subscribeToPriceAlerts(componentType: string, model: string, targetPrice: number, callback: (quote: PriceQuote) => void): Promise<() => void> {
    const interval = setInterval(async () => {
      const quote = await this.getPrice(componentType, model);
      if (quote && quote.price <= targetPrice) {
        callback(quote);
      }
    }, 3600000); // Check every hour
    
    return () => clearInterval(interval);
  }
  
  private generateId(): string {
    return `price_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const livePricingEngine = new LivePricingEngine();