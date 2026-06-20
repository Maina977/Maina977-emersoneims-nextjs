import type { PriceItem } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// SEED / FALLBACK PRICE CATALOG
//
// This is the local source-of-truth used when the ERP price feed is not
// configured or is unreachable. Numbers are consolidated from values already in
// the site plus the owner's confirmed anchors (VOLTKA from KES 500k @ 20 kVA up
// to 5M @ 500 kVA; used generators from KES 200k). All entries are marked
// `indicative` — the binding figure is always the ERP quotation.
//
// To make the site show LIVE ERP prices, set ERP_PRICE_ENDPOINT (see source.ts
// and docs/PRICING-AND-ERP.md). ERP items override seed items with the same id.
// ═══════════════════════════════════════════════════════════════════════════════

const ASOF = '2026-06';

export const SEED_CATALOG: PriceItem[] = [
  // ── New generators — VOLTKA house brand (owner-confirmed anchors) ──────────────
  { id: 'voltka-20kva',  category: 'generator-new', brand: 'VOLTKA', name: 'VOLTKA 20 kVA diesel generator',  spec: '20 kVA',  priceFromKes: 500_000,   unit: 'each', indicative: true, asOf: ASOF, source: 'repo-seed' },
  { id: 'voltka-500kva', category: 'generator-new', brand: 'VOLTKA', name: 'VOLTKA 500 kVA diesel generator', spec: '500 kVA', priceFromKes: 5_000_000, unit: 'each', indicative: true, asOf: ASOF, source: 'repo-seed' },
  // VOLTKA spans 20→500 kVA, KES 500k→5M. Intermediate sizes are quoted on the
  // ERP — intentionally NOT invented here.

  // ── Used / pre-owned generators (owner: from KES 200,000) ─────────────────────
  { id: 'used-generator-entry', category: 'generator-used', name: 'Used / refurbished generator', spec: 'from 20 kVA', priceFromKes: 200_000, unit: 'each', indicative: true, asOf: ASOF, source: 'repo-seed' },

  // ── Borehole pumps (indicative ranges; brands incl. Doyin quoted on ERP) ──────
  { id: 'pump-0p5hp', category: 'pump', name: 'Submersible pump 0.5 HP', spec: '0.5 HP (0.37 kW)', priceFromKes: 25_000,  priceToKes: 35_000,  unit: 'each', indicative: true, asOf: ASOF, source: 'repo-seed' },
  { id: 'pump-1hp',   category: 'pump', name: 'Submersible pump 1 HP',   spec: '1 HP (0.75 kW)',  priceFromKes: 35_000,  priceToKes: 50_000,  unit: 'each', indicative: true, asOf: ASOF, source: 'repo-seed' },
  { id: 'pump-3hp',   category: 'pump', name: 'Submersible pump 3 HP',   spec: '3 HP (2.2 kW)',   priceFromKes: 75_000,  priceToKes: 110_000, unit: 'each', indicative: true, asOf: ASOF, source: 'repo-seed' },
  { id: 'pump-10hp',  category: 'pump', name: 'Submersible pump 10 HP',  spec: '10 HP (7.5 kW)',  priceFromKes: 250_000, priceToKes: 380_000, unit: 'each', indicative: true, asOf: ASOF, source: 'repo-seed' },

  // ── Solar (Deye/Felicity entries already in the site — confirm on ERP) ────────
  { id: 'deye-5kw-inverter',   category: 'inverter', brand: 'Deye',     name: 'Deye 5 kW hybrid inverter',  spec: '5 kW',  priceFromKes: 110_000, unit: 'each', indicative: true, asOf: ASOF, source: 'repo-seed' },
  { id: 'deye-8kw-inverter',   category: 'inverter', brand: 'Deye',     name: 'Deye 8 kW hybrid inverter',  spec: '8 kW',  priceFromKes: 165_000, unit: 'each', indicative: true, asOf: ASOF, source: 'repo-seed' },
  { id: 'felicity-5kwh-batt',  category: 'battery',  brand: 'Felicity', name: 'Felicity 5.12 kWh LiFePO4',  spec: '5.12 kWh', priceFromKes: 85_000,  unit: 'each', indicative: true, asOf: ASOF, source: 'repo-seed' },
  { id: 'felicity-10kwh-batt', category: 'battery',  brand: 'Felicity', name: 'Felicity 10.24 kWh LiFePO4', spec: '10.24 kWh', priceFromKes: 165_000, unit: 'each', indicative: true, asOf: ASOF, source: 'repo-seed' },
];

export function seedById(): Map<string, PriceItem> {
  return new Map(SEED_CATALOG.map((i) => [i.id, i]));
}
