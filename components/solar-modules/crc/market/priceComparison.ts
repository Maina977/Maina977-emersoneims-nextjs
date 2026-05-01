// MARKET INTELLIGENCE - PRICE COMPARISON
// Compares prices across suppliers and components

export interface PriceComparison {
  id: string;
  componentType: string;
  componentName: string;
  suppliers: SupplierPrice[];
  bestPrice: {
    supplier: string;
    price: number;
    savings: number;
  };
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  recommendations: string[];
  timestamp: Date;
}

export interface SupplierPrice {
  supplierId: string;
  supplierName: string;
  price: number;
  currency: string;
  shipping: number;
  total: number;
  deliveryDays: number;
  rating: number;
  inStock: boolean;
}

class PriceComparisonEngine {
  private comparisons: Map<string, PriceComparison> = new Map();
  
  async compareComponent(componentType: string, componentName: string): Promise<PriceComparison> {
    const id = this.generateId();
    const suppliers = await this.getSupplierPrices(componentType, componentName);
    
    const prices = suppliers.map(s => s.total);
    const bestSupplier = suppliers.reduce((best, current) => 
      current.total < best.total ? current : best
    );
    
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const savings = suppliers.length > 1 ? bestSupplier.total - averagePrice : 0;
    
    const comparison: PriceComparison = {
      id,
      componentType,
      componentName,
      suppliers,
      bestPrice: {
        supplier: bestSupplier.supplierName,
        price: bestSupplier.total,
        savings: -savings
      },
      averagePrice,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      recommendations: this.generateRecommendations(suppliers, bestSupplier),
      timestamp: new Date()
    };
    
    this.comparisons.set(id, comparison);
    return comparison;
  }
  
  async compareSystem(components: Array<{ type: string; name: string; quantity: number }>): Promise<{
    totalBySupplier: Array<{ supplier: string; total: number; components: any[] }>;
    bestSupplier: { supplier: string; total: number; savings: number };
    componentDetails: PriceComparison[];
  }> {
    const componentComparisons: PriceComparison[] = [];
    const supplierTotals: Map<string, { total: number; components: any[] }> = new Map();
    
    for (const comp of components) {
      const comparison = await this.compareComponent(comp.type, comp.name);
      componentComparisons.push(comparison);
      
      for (const supplier of comparison.suppliers) {
        const current = supplierTotals.get(supplier.supplierId) || { total: 0, components: [] };
        current.total += supplier.total * comp.quantity;
        current.components.push({
          component: comp.name,
          supplier: supplier.supplierName,
          price: supplier.total * comp.quantity
        });
        supplierTotals.set(supplier.supplierId, current);
      }
    }
    
    const totalBySupplier = Array.from(supplierTotals.entries()).map(([supplierId, data]) => ({
      supplier: data.components[0]?.supplier || supplierId,
      total: data.total,
      components: data.components
    }));
    
    totalBySupplier.sort((a, b) => a.total - b.total);
    
    const bestSupplier = totalBySupplier[0];
    const secondBest = totalBySupplier[1];
    const savings = secondBest ? bestSupplier.total - secondBest.total : 0;
    
    return {
      totalBySupplier,
      bestSupplier: {
        supplier: bestSupplier.supplier,
        total: bestSupplier.total,
        savings: -savings
      },
      componentDetails: componentComparisons
    };
  }
  
  async trackPriceHistory(componentType: string, componentName: string, days: number = 30): Promise<{
    prices: Array<{ date: Date; price: number }>;
    trend: 'up' | 'down' | 'stable';
    averageChange: number;
    bestTimeToBuy: string;
  }> {
    // Simulate price history
    const prices = [];
    const now = new Date();
    let previousPrice = 0;
    let totalChange = 0;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const price = this.simulateHistoricalPrice(componentType, i);
      prices.push({ date, price });
      
      if (i < days) {
        totalChange += price - previousPrice;
      }
      previousPrice = price;
    }
    
    const averageChange = totalChange / days;
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (averageChange > 50) trend = 'up';
    else if (averageChange < -50) trend = 'down';
    
    let bestTimeToBuy = 'Current price is favorable';
    if (trend === 'down') {
      bestTimeToBuy = 'Prices are falling - wait 1-2 weeks';
    } else if (trend === 'up') {
      bestTimeToBuy = 'Prices are rising - buy soon';
    }
    
    return {
      prices,
      trend,
      averageChange,
      bestTimeToBuy
    };
  }
  
  async getBulkDiscountAnalysis(componentType: string, componentName: string): Promise<{
    quantity: number;
    unitPrice: number;
    discount: number;
    totalPrice: number;
    savingsFromBase: number;
  }[]> {
    const basePrice = await this.getBasePrice(componentType, componentName);
    const analysis = [];
    
    for (const qty of [1, 5, 10, 20, 50, 100]) {
      let discount = 0;
      if (qty >= 100) discount = 20;
      else if (qty >= 50) discount = 15;
      else if (qty >= 20) discount = 10;
      else if (qty >= 10) discount = 5;
      else if (qty >= 5) discount = 2;
      
      const unitPrice = basePrice * (1 - discount / 100);
      const totalPrice = unitPrice * qty;
      const savingsFromBase = (basePrice * qty) - totalPrice;
      
      analysis.push({
        quantity: qty,
        unitPrice: Math.round(unitPrice),
        discount,
        totalPrice: Math.round(totalPrice),
        savingsFromBase: Math.round(savingsFromBase)
      });
    }
    
    return analysis;
  }
  
  async getPriceAlert(componentType: string, componentName: string, targetPrice: number): Promise<{
    currentPrice: number;
    targetPrice: number;
    difference: number;
    alert: string;
  }> {
    const currentPrice = await this.getCurrentPrice(componentType, componentName);
    const difference = currentPrice - targetPrice;
    
    let alert = '';
    if (difference <= 0) {
      alert = `✅ Price target reached! Current price (${currentPrice}) is at or below your target (${targetPrice})`;
    } else if (difference <= targetPrice * 0.1) {
      alert = `⚠️ Getting close! Only ${difference} above target price`;
    } else {
      alert = `📊 Price is ${difference} above target. Consider waiting.`;
    }
    
    return {
      currentPrice,
      targetPrice,
      difference,
      alert
    };
  }
  
  private async getSupplierPrices(componentType: string, componentName: string): Promise<SupplierPrice[]> {
    // Simulate prices from multiple suppliers
    const suppliers = [
      { id: 'sup1', name: 'Solar Africa', rating: 4.8, shipping: 2500, deliveryDays: 3 },
      { id: 'sup2', name: 'Greentech', rating: 4.6, shipping: 3500, deliveryDays: 5 },
      { id: 'sup3', name: 'Power Solutions', rating: 4.5, shipping: 2000, deliveryDays: 4 },
      { id: 'sup4', name: 'Eco Energy', rating: 4.3, shipping: 4000, deliveryDays: 7 }
    ];
    
    const basePrice = await this.getBasePrice(componentType, componentName);
    
    return suppliers.map(supplier => {
      const priceVariance = 0.85 + Math.random() * 0.3;
      const price = Math.round(basePrice * priceVariance);
      
      return {
        supplierId: supplier.id,
        supplierName: supplier.name,
        price,
        currency: 'KES',
        shipping: supplier.shipping,
        total: price + supplier.shipping,
        deliveryDays: supplier.deliveryDays,
        rating: supplier.rating,
        inStock: Math.random() > 0.2
      };
    });
  }
  
  private async getBasePrice(componentType: string, componentName: string): Promise<number> {
    const prices: Record<string, Record<string, number>> = {
      panel: { 'JA Solar 485W': 12500, 'Longi 540W': 13800, 'Trina 455W': 11500 },
      inverter: { 'Deye 6kW': 95000, 'Solis 5kW': 78000, 'Growatt 6kW': 85000 },
      battery: { 'Dyness 5.12kWh': 185000, 'Pylontech 3.55kWh': 125000, 'BYD 10.24kWh': 350000 }
    };
    
    return prices[componentType]?.[componentName] || 50000;
  }
  
  private async getCurrentPrice(componentType: string, componentName: string): Promise<number> {
    const suppliers = await this.getSupplierPrices(componentType, componentName);
    const bestPrice = suppliers.reduce((best, current) => 
      current.total < best.total ? current : best
    );
    return bestPrice.total;
  }
  
  private generateRecommendations(suppliers: SupplierPrice[], bestSupplier: SupplierPrice): string[] {
    const recommendations = [];
    
    recommendations.push(`Best value: ${bestSupplier.supplierName} at KSh ${bestSupplier.total.toLocaleString()}`);
    
    if (bestSupplier.deliveryDays <= 3) {
      recommendations.push(`Fastest delivery (${bestSupplier.deliveryDays} days) from ${bestSupplier.supplierName}`);
    }
    
    const secondBest = suppliers.filter(s => s.supplierId !== bestSupplier.supplierId)
      .sort((a, b) => a.total - b.total)[0];
    
    if (secondBest && secondBest.total - bestSupplier.total < 5000) {
      recommendations.push(`Consider ${secondBest.supplierName} as alternative (only KSh ${(secondBest.total - bestSupplier.total).toLocaleString()} more)`);
    }
    
    return recommendations;
  }
  
  private simulateHistoricalPrice(componentType: string, daysAgo: number): number {
    const basePrice = componentType === 'panel' ? 12500 : componentType === 'inverter' ? 95000 : 185000;
    const trend = Math.sin(daysAgo / 30) * 0.1;
    const noise = (Math.random() - 0.5) * 0.05;
    return Math.round(basePrice * (1 + trend + noise));
  }
  
  private generateId(): string {
    return `compare_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const priceComparison = new PriceComparisonEngine();