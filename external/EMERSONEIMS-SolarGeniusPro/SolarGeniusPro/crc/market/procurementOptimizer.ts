// MARKET INTELLIGENCE - PROCUREMENT OPTIMIZER
// Optimizes purchasing decisions across multiple suppliers

export interface ProcurementPlan {
  id: string;
  projectId: string;
  items: ProcurementItem[];
  totalCost: number;
  totalSavings: number;
  recommendations: ProcurementRecommendation[];
  timeline: ProcurementTimeline;
  riskAssessment: RiskAssessment;
  createdAt: Date;
}

export interface ProcurementItem {
  componentId: string;
  componentName: string;
  quantity: number;
  selectedSupplier: string;
  unitPrice: number;
  totalPrice: number;
  deliveryDate: Date;
  alternatives: AlternativeOption[];
}

export interface AlternativeOption {
  supplier: string;
  price: number;
  deliveryDays: number;
  savings: number;
}

export interface ProcurementRecommendation {
  type: 'bulk_discount' | 'supplier_consolidation' | 'timing_optimization' | 'substitution';
  description: string;
  potentialSavings: number;
  action: string;
}

export interface ProcurementTimeline {
  orderDate: Date;
  expectedDelivery: Date;
  criticalPath: string[];
  milestones: Array<{ date: Date; event: string }>;
}

export interface RiskAssessment {
  score: number;
  level: 'low' | 'medium' | 'high';
  factors: string[];
  mitigations: string[];
}

class ProcurementOptimizer {
  private plans: Map<string, ProcurementPlan> = new Map();
  
  async optimizeProcurement(
    projectId: string,
    requirements: Array<{ componentId: string; componentName: string; quantity: number; requiredBy: Date }>
  ): Promise<ProcurementPlan> {
    const id = this.generateId();
    const items: ProcurementItem[] = [];
    let totalCost = 0;
    let totalSavings = 0;
    const allRecommendations: ProcurementRecommendation[] = [];
    
    for (const req of requirements) {
      const optimized = await this.optimizeItem(req);
      items.push(optimized);
      totalCost += optimized.totalPrice;
      totalSavings += optimized.alternatives[0]?.savings || 0;
    }
    
    // Consolidation recommendations
    const consolidationRec = await this.checkConsolidationOpportunities(items);
    if (consolidationRec) {
      allRecommendations.push(consolidationRec);
      totalSavings += consolidationRec.potentialSavings;
    }
    
    // Bulk discount recommendations
    const bulkRec = await this.checkBulkDiscounts(items);
    if (bulkRec) {
      allRecommendations.push(bulkRec);
      totalSavings += bulkRec.potentialSavings;
    }
    
    const timeline = this.createTimeline(items);
    const riskAssessment = await this.assessRisk(items, timeline);
    
    const plan: ProcurementPlan = {
      id,
      projectId,
      items,
      totalCost,
      totalSavings,
      recommendations: allRecommendations,
      timeline,
      riskAssessment,
      createdAt: new Date()
    };
    
    this.plans.set(id, plan);
    return plan;
  }
  
  private async optimizeItem(req: {
    componentId: string;
    componentName: string;
    quantity: number;
    requiredBy: Date;
  }): Promise<ProcurementItem> {
    // Get price comparison for this component
    const comparison = await priceComparison.compareComponent(
      this.getComponentType(req.componentName),
      req.componentName
    );
    
    const bestSupplier = comparison.suppliers[0];
    const alternatives = comparison.suppliers.slice(1, 4).map(s => ({
      supplier: s.supplierName,
      price: s.total,
      deliveryDays: s.deliveryDays,
      savings: bestSupplier.total - s.total
    }));
    
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + bestSupplier.deliveryDays);
    
    return {
      componentId: req.componentId,
      componentName: req.componentName,
      quantity: req.quantity,
      selectedSupplier: bestSupplier.supplierName,
      unitPrice: bestSupplier.price,
      totalPrice: bestSupplier.total * req.quantity,
      deliveryDate,
      alternatives
    };
  }
  
  private async checkConsolidationOpportunities(items: ProcurementItem[]): Promise<ProcurementRecommendation | null> {
    // Group by supplier
    const supplierGroups: Map<string, { items: ProcurementItem[]; total: number }> = new Map();
    
    for (const item of items) {
      const group = supplierGroups.get(item.selectedSupplier) || { items: [], total: 0 };
      group.items.push(item);
      group.total += item.totalPrice;
      supplierGroups.set(item.selectedSupplier, group);
    }
    
    // Check if consolidating with a single supplier could save money
    const suppliers = Array.from(supplierGroups.entries());
    if (suppliers.length > 1) {
      const totalAllItems = items.reduce((sum, i) => sum + i.totalPrice, 0);
      const estimatedConsolidatedCost = totalAllItems * 0.92; // 8% discount for consolidation
      const savings = totalAllItems - estimatedConsolidatedCost;
      
      if (savings > 50000) {
        const topSupplier = suppliers.sort((a, b) => b[1].total - a[1].total)[0];
        return {
          type: 'supplier_consolidation',
          description: `Consolidate all orders with ${topSupplier[0]} for better pricing`,
          potentialSavings: Math.round(savings),
          action: `Request consolidated quote from ${topSupplier[0]}`
        };
      }
    }
    
    return null;
  }
  
  private async checkBulkDiscounts(items: ProcurementItem[]): Promise<ProcurementRecommendation | null> {
    // Group identical components
    const componentGroups: Map<string, { item: ProcurementItem; total: number }> = new Map();
    
    for (const item of items) {
      const existing = componentGroups.get(item.componentName);
      if (existing) {
        existing.total += item.totalPrice;
      } else {
        componentGroups.set(item.componentName, { item, total: item.totalPrice });
      }
    }
    
    for (const [name, group] of componentGroups) {
      if (group.item.quantity >= 10) {
        const bulkDiscountRate = Math.min(15, Math.floor(group.item.quantity / 10) * 2);
        const savings = group.total * (bulkDiscountRate / 100);
        
        if (savings > 20000) {
          return {
            type: 'bulk_discount',
            description: `Order all ${name} together for ${bulkDiscountRate}% bulk discount`,
            potentialSavings: Math.round(savings),
            action: `Request bulk pricing for ${group.item.quantity} units of ${name}`
          };
        }
      }
    }
    
    return null;
  }
  
  private createTimeline(items: ProcurementItem[]): ProcurementTimeline {
    const orderDate = new Date();
    const deliveryDates = items.map(i => i.deliveryDate);
    const expectedDelivery = new Date(Math.max(...deliveryDates.map(d => d.getTime())));
    
    const milestones = [
      { date: orderDate, event: 'Place orders with suppliers' },
      { date: new Date(orderDate.getTime() + 2 * 86400000), event: 'Confirm order acknowledgements' },
      { date: new Date(orderDate.getTime() + 7 * 86400000), event: 'First deliveries arrive' },
      { date: expectedDelivery, event: 'All components delivered' }
    ];
    
    const criticalPath = items.map(i => `${i.componentName} from ${i.selectedSupplier}`);
    
    return {
      orderDate,
      expectedDelivery,
      criticalPath,
      milestones
    };
  }
  
  private async assessRisk(items: ProcurementItem[], timeline: ProcurementTimeline): Promise<RiskAssessment> {
    let score = 0;
    const factors: string[] = [];
    const mitigations: string[] = [];
    
    // Check for single points of failure
    const suppliers = new Set(items.map(i => i.selectedSupplier));
    if (suppliers.size === 1) {
      score += 30;
      factors.push('Single supplier dependency');
      mitigations.push('Identify backup suppliers');
    }
    
    // Check for tight delivery windows
    const now = new Date();
    const daysToDelivery = Math.max(0, (timeline.expectedDelivery.getTime() - now.getTime()) / 86400000);
    if (daysToDelivery < 14) {
      score += 25;
      factors.push('Tight delivery timeline');
      mitigations.push('Expedite order processing');
    }
    
    // Check for high-value items
    const highValueItems = items.filter(i => i.totalPrice > 500000);
    if (highValueItems.length > 0) {
      score += 20;
      factors.push(`High-value components: ${highValueItems.map(i => i.componentName).join(', ')}`);
      mitigations.push('Request insurance coverage');
    }
    
    let level: 'low' | 'medium' | 'high' = 'low';
    if (score > 60) level = 'high';
    else if (score > 30) level = 'medium';
    
    return {
      score,
      level,
      factors,
      mitigations
    };
  }
  
  private getComponentType(componentName: string): string {
    if (componentName.toLowerCase().includes('panel')) return 'panel';
    if (componentName.toLowerCase().includes('inverter')) return 'inverter';
    if (componentName.toLowerCase().includes('battery')) return 'battery';
    return 'other';
  }
  
  async getPlan(id: string): Promise<ProcurementPlan | null> {
    return this.plans.get(id) || null;
  }
  
  async generatePurchaseOrders(planId: string): Promise<Array<{
    supplier: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    orderDate: Date;
  }>> {
    const plan = await this.getPlan(planId);
    if (!plan) return [];
    
    const supplierOrders: Map<string, { items: Array<{ name: string; quantity: number; price: number }>; total: number }> = new Map();
    
    for (const item of plan.items) {
      const order = supplierOrders.get(item.selectedSupplier) || { items: [], total: 0 };
      order.items.push({
        name: item.componentName,
        quantity: item.quantity,
        price: item.unitPrice
      });
      order.total += item.totalPrice;
      supplierOrders.set(item.selectedSupplier, order);
    }
    
    return Array.from(supplierOrders.entries()).map(([supplier, order]) => ({
      supplier,
      items: order.items,
      total: order.total,
      orderDate: plan.timeline.orderDate
    }));
  }
  
  private generateId(): string {
    return `proc_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const procurementOptimizer = new ProcurementOptimizer();