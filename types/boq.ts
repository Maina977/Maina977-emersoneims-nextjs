// Bill of Quantities Types

export interface BOQItem {
  id: string;
  code: string;
  description: string;
  unit: 'sqm' | 'cum' | 'rm' | 'no' | 'kg' | 'ton' | 'lm' | 'ls';
  quantity: number;
  rate: number;
  amount: number;
  category: string;
  subCategory?: string;
  notes?: string;
}

export interface BOQCategory {
  id: string;
  name: string;
  code: string;
  items: BOQItem[];
  subtotal: number;
  order: number;
}

export interface BOQ {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  preparedBy: string;
  preparedDate: string;
  validUntil: string;

  categories: BOQCategory[];

  // Summary
  subtotal: number;
  contingency: number;
  contingencyPercentage: number;
  professionalFees: number;
  professionalFeesPercentage: number;
  vat: number;
  vatPercentage: number;
  grandTotal: number;

  // Metadata
  currency: string;
  version: number;
  status: 'draft' | 'review' | 'approved' | 'revised';
  notes?: string;
  terms?: string[];
}

export interface BOQSummary {
  preliminaries: number;
  substructure: number;
  superstructure: number;
  roofing: number;
  finishes: number;
  services: number;
  external: number;
  contingency: number;
  professionalFees: number;
  total: number;
}
