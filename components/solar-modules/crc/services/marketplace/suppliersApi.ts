// Supplier Network API
// Connects with equipment suppliers

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
  leadTime: number;
  paymentTerms: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  products: SupplierProduct[];
}

export interface SupplierProduct {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  currency: string;
  stock: number;
  warranty: number;
  specifications: Record<string, any>;
}

class SuppliersApiService {
  private baseUrl = 'https://api.solargenius.com/v1/suppliers';

  async getAllSuppliers(type?: string): Promise<Supplier[]> {
    const url = type ? `${this.baseUrl}?type=${type}` : this.baseUrl;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.suppliers || [];
    } catch (error) {
      return this.getMockSuppliers(type);
    }
  }

  async getSupplier(id: string): Promise<Supplier | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      const data = await response.json();
      return data.supplier || null;
    } catch (error) {
      return this.getMockSupplier(id);
    }
  }

  async getProducts(supplierId: string): Promise<SupplierProduct[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${supplierId}/products`);
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      return this.getMockProducts(supplierId);
    }
  }

  async getBestPrice(productName: string, quantity: number = 1): Promise<{
    supplier: Supplier;
    product: SupplierProduct;
    price: number;
  } | null> {
    const suppliers = await this.getAllSuppliers();
    let best = null;
    
    for (const supplier of suppliers) {
      const product = supplier.products.find(p => 
        p.name.toLowerCase().includes(productName.toLowerCase())
      );
      if (product && (!best || product.price < best.price)) {
        best = { supplier, product, price: product.price * quantity };
      }
    }
    
    return best;
  }

  async comparePrices(productName: string): Promise<Array<{
    supplier: string;
    price: number;
    leadTime: number;
    rating: number;
  }>> {
    const suppliers = await this.getAllSuppliers();
    const results = [];
    
    for (const supplier of suppliers) {
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

  private getMockSuppliers(type?: string): Supplier[] {
    const allSuppliers: Supplier[] = [
      {
        id: 'sup1',
        name: 'Solar Africa Ltd',
        type: 'all',
        location: { country: 'Kenya', city: 'Nairobi', address: 'Mombasa Road' },
        rating: 4.8,
        certified: true,
        leadTime: 5,
        paymentTerms: '30% deposit, 70% on delivery',
        contact: { name: 'John Mwangi', email: 'sales@solarafrica.co.ke', phone: '0768-860-665' },
        products: [
          { id: 'p1', name: 'JA Solar 485W', brand: 'JA Solar', model: 'JAM54S30-485', price: 12500, currency: 'KES', stock: 500, warranty: 25, specifications: { wattage: 485, efficiency: 21.5 } },
          { id: 'p2', name: 'Deye 6kW Inverter', brand: 'Deye', model: 'SUN-6K-SG01LP1', price: 95000, currency: 'KES', stock: 100, warranty: 10, specifications: { power: 6000, efficiency: 97.5 } }
        ]
      },
      {
        id: 'sup2',
        name: 'Greentech Solutions',
        type: 'all',
        location: { country: 'Kenya', city: 'Mombasa', address: 'Industrial Area' },
        rating: 4.6,
        certified: true,
        leadTime: 7,
        paymentTerms: '50% deposit, 50% on delivery',
        contact: { name: 'Sarah Wanjiku', email: 'info@greentech.co.ke', phone: '0768-860-665' },
        products: [
          { id: 'p3', name: 'Longi 540W', brand: 'Longi', model: 'LR5-54HPH-540M', price: 13800, currency: 'KES', stock: 300, warranty: 25, specifications: { wattage: 540, efficiency: 21.8 } },
          { id: 'p4', name: 'Solis 5kW Inverter', brand: 'Solis', model: 'S5-GR1P5K', price: 78000, currency: 'KES', stock: 80, warranty: 10, specifications: { power: 5000, efficiency: 97.2 } }
        ]
      }
    ];
    
    if (type) {
      return allSuppliers.filter(s => s.type === type || s.type === 'all');
    }
    return allSuppliers;
  }

  private getMockSupplier(id: string): Supplier | null {
    const suppliers = this.getMockSuppliers();
    return suppliers.find(s => s.id === id) || null;
  }

  private getMockProducts(supplierId: string): SupplierProduct[] {
    const supplier = this.getMockSupplier(supplierId);
    return supplier?.products || [];
  }
}

export const suppliersApi = new SuppliersApiService();