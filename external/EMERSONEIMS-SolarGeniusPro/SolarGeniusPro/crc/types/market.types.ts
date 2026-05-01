// Market Intelligence Type Definitions

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
  warranty: number;
  specifications: Record<string, any>;
}

export interface SupplierPerformance {
  onTimeDelivery: number;
  qualityRating: number;
  responseTime: number;
  disputeRate: number;
  lastOrderDate: Date;
  totalOrders: number;
}

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

export interface DemandForecast {
  id: string;
  region: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    expectedDemandMW: number;
    growthRate: number;
    seasonalityFactor: number;
    confidence: number;
  };
  segments: {
    residential: number;
    commercial: number;
    industrial: number;
    agricultural: number;
  };
  drivers: DemandDriver[];
}

export interface DemandDriver {
  name: string;
  impact: number;
  description: string;
}

export interface ProcurementPlan {
  id: string;
  projectId: string;
  items: ProcurementItem[];
  totalCost: number;
  totalSavings: number;
  recommendations: ProcurementRecommendation[];
  timeline: ProcurementTimeline;
  riskAssessment: RiskAssessment;
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