import type { PriceItem } from './types';
import { VOLTKA_CONFIRMED_PRICES, VOLTKA_PRICES_AS_OF } from '@/lib/pricing/voltkaConfirmedPrices';
import { SOLAR_PANELS, INVERTERS, BATTERIES } from '@/lib/solar-data';
import { PUMP_PRICING } from '@/lib/data/pumpPricing';

// Parse 'KES 500,000' → 500000
const toKes = (s: string): number => Number(String(s).replace(/[^\d]/g, '')) || 0;
const slug = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// VOLTKA generators: owner-confirmed prices only (2026-11-05; new, prime,
// ex-warehouse, excl. VAT), from lib/pricing/voltkaConfirmedPrices.ts.
// priceFromKes is the open-frame set where one exists, priceToKes the silent
// set. Sizes not listed are "Request current price" and have no entry.
const VOLTKA_GENERATORS: PriceItem[] = VOLTKA_CONFIRMED_PRICES.map((p) => {
  const from = p.openKes ?? p.silentKes;
  const to = p.openKes && p.silentKes ? p.silentKes : undefined;
  return {
    id: `voltka-${p.kva}kva`,
    category: 'generator-new' as const,
    brand: 'VOLTKA',
    name: `VOLTKA ${p.kva} kVA diesel generator (prime, ex-warehouse, excl. VAT)`,
    spec: p.openKes ? `${p.kva} kVA, open frame to silent` : `${p.kva} kVA, silent`,
    priceFromKes: from,
    ...(to ? { priceToKes: to } : {}),
    unit: 'each' as const,
    indicative: false,
    asOf: VOLTKA_PRICES_AS_OF.slice(0, 7),
    source: 'repo-seed' as const,
  };
});

// ═══════════════════════════════════════════════════════════════════════════════
// SEED / FALLBACK PRICE CATALOG
//
// This is the local source-of-truth used when the ERP price feed is not
// configured or is unreachable. Numbers are consolidated from values already in
// the site. New VOLTKA generators use the owner-confirmed list (2026-11-05);
// the other entries are marked `indicative` and the binding figure is always
// the quotation.
//
// To make the site show LIVE ERP prices, set ERP_PRICE_ENDPOINT (see source.ts
// and docs/PRICING-AND-ERP.md). ERP items override seed items with the same id.
// ═══════════════════════════════════════════════════════════════════════════════

const ASOF = '2026-06';

// ── Solar panels / inverters / batteries — from lib/solar-data.ts (real data) ──
const SOLAR_PANEL_ITEMS: PriceItem[] = SOLAR_PANELS.map((p) => ({
  id: `panel-${slug(p.brand)}-${slug(p.model)}`,
  category: 'solar', brand: p.brand, name: `${p.brand} ${p.model} ${p.watts}W solar panel`,
  spec: `${p.watts}W`, priceFromKes: p.price, unit: 'each', indicative: true, asOf: ASOF, source: 'repo-seed',
}));

const INVERTER_ITEMS: PriceItem[] = INVERTERS.map((i) => ({
  id: `inverter-${slug(i.brand)}-${slug(i.model)}`,
  category: 'inverter', brand: i.brand, name: `${i.brand} ${i.model} ${(i.power / 1000)}kW ${i.type} inverter`,
  spec: `${(i.power / 1000)}kW`, priceFromKes: i.price, unit: 'each', indicative: true, asOf: ASOF, source: 'repo-seed',
}));

const BATTERY_ITEMS: PriceItem[] = BATTERIES.map((b) => ({
  id: `battery-${slug(b.brand)}-${slug(b.model)}`,
  category: 'battery', brand: b.brand, name: `${b.brand} ${b.model} ${b.capacity}kWh ${b.chemistry}`,
  spec: `${b.capacity}kWh`, priceFromKes: b.price, unit: 'each', indicative: true, asOf: ASOF, source: 'repo-seed',
}));

// ── Borehole pumps — from lib/data/pumpPricing.ts (real indicative ranges) ─────
const PUMP_ITEMS: PriceItem[] = PUMP_PRICING.map((row) => {
  const m = row.pumpPrice.match(/[\d,]+/g) || [];
  const from = toKes(m[0] || '');
  const to = toKes(m[1] || m[0] || '');
  return {
    id: `pump-${slug(row.size)}`,
    category: 'pump' as const, name: `Submersible pump ${row.size}`, spec: row.size,
    priceFromKes: from, priceToKes: to, unit: 'each' as const, indicative: true, asOf: ASOF, source: 'repo-seed' as const,
  };
});

export const SEED_CATALOG: PriceItem[] = [
  // ── New generators — VOLTKA, owner-confirmed sizes only ─────────────────────
  ...VOLTKA_GENERATORS,

  // ── Used / pre-owned generators (owner: from KES 200,000) ─────────────────────
  { id: 'used-generator-entry', category: 'generator-used', name: 'Used / refurbished generator', spec: 'from 20 kVA', priceFromKes: 200_000, unit: 'each', indicative: true, asOf: ASOF, source: 'repo-seed' },

  // ── Solar, inverters, batteries, pumps — all from the site's real data ────────
  ...SOLAR_PANEL_ITEMS,
  ...INVERTER_ITEMS,
  ...BATTERY_ITEMS,
  ...PUMP_ITEMS,
];

export function seedById(): Map<string, PriceItem> {
  return new Map(SEED_CATALOG.map((i) => [i.id, i]));
}
