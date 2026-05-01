// MARKET INTELLIGENCE - SUPPLIER NETWORK
// Manages supplier relationships and procurement

export interface Supplier {
  id: string;
  name: string;
  type: 'panel' | 'inverter' | 'battery' | 'mounting' | 'cable' | 'all';
  location: {
    country: string;
    city: string;
    address: string;
  };
  rating: number;
  certified: boolean;
  leadTime: number; // days
  paymentTerms: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  products: SupplierProduct[];
  performance: SupplierPerformance;
}

export interface SupplierProduct {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  currency: string;
  stock: number;
  warranty: number; // years
  specifications: Record<string, any>;
}

export interface SupplierPerformance {
  onTimeDelivery: number; // percentage
  qualityRating: number;
  responseTime: number; // hours
  disputeRate: number;
  lastOrderDate: Date;
  totalOrders: number;
}

class SupplierNetwork {
  private suppliers: Map<string, Supplier> = new Map();
  
  async registerSupplier(supplier: Omit<Supplier, 'id' | 'performance'>): Promise<Supplier> {
    const id = this.generateId();
    const newSupplier: Supplier = {
      ...supplier,
      id,
      performance: {
        onTimeDelivery: 95,
        qualityRating: 4.5,
        responseTime: 24,
        disputeRate: 2,
        lastOrderDate: new Date(),
        totalOrders: 0
      }
    };
    
    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }
  
  async getSupplier(id: string): Promise<Supplier | null> {
    return this.suppliers.get(id) || null;
  }
  
  async getAllSuppliers(type?: string): Promise<Supplier[]> {
    let suppliers = Array.from(this.suppliers.values());
    if (type) {
      suppliers = suppliers.filter(s => s.type === type || s.type === 'all');
    }
    return suppliers.sort((a, b) => b.rating - a.rating);
  }
  
  async getBestSupplier(productType: string, location: string, maxPrice?: number): Promise<Supplier | null> {
    const suppliers = await this.getAllSuppliers(productType);
    
    const scored = suppliers.map(supplier => {
      let score = supplier.rating * 10;
      score += (supplier.performance.onTimeDelivery / 10);
      score -= supplier.leadTime / 5;
      
      // Find best product price
      const product = supplier.products.find(p => p.type === productType);
      if (product && maxPrice && product.price > maxPrice) {
        score -= 50;
      }
      
      return { supplier, score };
    });
    
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.supplier || null;
  }
  
  async getProductPrice(productId: string): Promise<{
    supplier: Supplier;
    product: SupplierProduct;
    price: number;
  } | null> {
    for (const supplier of this.suppliers.values()) {
      const product = supplier.products.find(p => p.id === productId);
      if (product) {
        return { supplier, product, price: product.price };
      }
    }
    return null;
  }
  
  async comparePrices(productName: string): Promise<Array<{
    supplier: string;
    price: number;
    leadTime: number;
    rating: number;
  }>> {
    const results = [];
    
    for (const supplier of this.suppliers.values()) {
      const product = supplier.products.find(p => 
        p.name.toLowerCase().includes(productName.toLowerCase())
      );
      if (product) {
        results.push({
          supplier: supplier.name,
          price: product.price,
          leadTime: supplier.leadTime,
          rating: supplier.rating
        });
      }
    }
    
    return results.sort((a, b) => a.price - b.price);
  }
  
  async updateSupplierPerformance(supplierId: string, orderData: {
    onTime: boolean;
    quality: number;
    responseHours: number;
  }): Promise<Supplier | null> {
    const supplier = await this.getSupplier(supplierId);
    if (!supplier) return null;
    
    const perf = supplier.performance;
    const totalOrders = perf.totalOrders + 1;
    
    // Update rolling averages
    perf.onTimeDelivery = ((perf.onTimeDelivery * perf.totalOrders) + (orderData.onTime ? 100 : 0)) / totalOrders;
    perf.qualityRating = ((perf.qualityRating * perf.totalOrders) + orderData.quality) / totalOrders;
    perf.responseTime = ((perf.responseTime * perf.totalOrders) + orderData.responseHours) / totalOrders;
    perf.totalOrders = totalOrders;
    perf.lastOrderDate = new Date();
    
    supplier.performance = perf;
    this.suppliers.set(supplierId, supplier);
    
    return supplier;
  }
  
  async getRecommendedSuppliers(projectLocation: string, budget: number): Promise<Supplier[]> {
    const suppliers = await this.getAllSuppliers();
    
    return suppliers
      .filter(s => s.rating >= 4.0 && s.performance.onTimeDelivery >= 90)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }
  
  private generateId(): string {
    return `sup_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const supplierNetwork = new SupplierNetwork();