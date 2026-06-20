// ═══════════════════════════════════════════════════════════════════════════════
// Central pricing types — the single shape every price on the site speaks.
// This is also the contract the ERP price endpoint must return (see source.ts
// and docs/PRICING-AND-ERP.md).
// ═══════════════════════════════════════════════════════════════════════════════

export type PriceCategory =
  | 'generator-new'
  | 'generator-used'
  | 'generator-rental'
  | 'generator-lease'
  | 'pump'
  | 'solar'
  | 'inverter'
  | 'battery'
  | 'spare-part'
  | 'service'
  | 'other';

export interface PriceItem {
  /** Stable unique key, e.g. 'voltka-20kva' or ERP SKU 'VKA-VKS20'. */
  id: string;
  category: PriceCategory;
  /** e.g. 'VOLTKA', 'Cummins', 'Deye', 'Felicity', 'Doyin'. */
  brand?: string;
  /** Human label, e.g. 'VOLTKA 20 kVA diesel generator'. */
  name: string;
  /** Spec/size, e.g. '20 kVA', '5 kW', '1 HP'. */
  spec?: string;
  /** Lower bound of the price (KES). Use this alone for "from" pricing. */
  priceFromKes?: number;
  /** Upper bound (KES), if a range. */
  priceToKes?: number;
  /** Pricing unit. */
  unit?: 'each' | 'per month' | 'per day' | 'per week' | 'per metre' | 'per kW' | 'per kWh';
  /** True = ballpark/guide price; the binding figure comes from the ERP quote. */
  indicative: boolean;
  /** YYYY-MM the price was last confirmed. */
  asOf: string;
  /** Where this number came from. */
  source: 'repo-seed' | 'erp';
}
