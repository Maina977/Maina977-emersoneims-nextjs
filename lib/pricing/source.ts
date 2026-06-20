import 'server-only';
import type { PriceItem } from './types';
import { SEED_CATALOG, seedById } from './catalog';

// ═══════════════════════════════════════════════════════════════════════════════
// PRICE SOURCE — the one function the whole site calls to get prices.
//
//   getPriceCatalog()  →  PriceItem[]
//
// Behaviour:
//   1. If ERP_PRICE_ENDPOINT is set, fetch the live ERP price list (cached in
//      memory for PRICE_TTL_MS to avoid hammering the tunnel) and MERGE it over
//      the local seed catalog (ERP wins on matching `id`). ERP items are tagged
//      source: 'erp'.
//   2. If the env var is unset, or the fetch fails/times out, fall back to the
//      committed SEED_CATALOG so the site always renders prices.
//
// The ERP endpoint must return either a PriceItem[] JSON array, or
// { items: PriceItem[] }. See docs/PRICING-AND-ERP.md for the exact contract.
// Auth (optional): set ERP_PRICE_TOKEN → sent as `Authorization: Bearer <token>`.
// ═══════════════════════════════════════════════════════════════════════════════

const PRICE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const FETCH_TIMEOUT_MS = 8000;

let cache: { at: number; items: PriceItem[] } | null = null;

async function fetchErpPrices(): Promise<PriceItem[] | null> {
  const endpoint = process.env.ERP_PRICE_ENDPOINT;
  if (!endpoint) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (process.env.ERP_PRICE_TOKEN) {
      headers.Authorization = `Bearer ${process.env.ERP_PRICE_TOKEN}`;
    }
    const res = await fetch(endpoint, { headers, signal: controller.signal, cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    const raw: unknown[] = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
    // Keep only well-formed items; tag them as ERP-sourced.
    const items = raw
      .filter((r): r is PriceItem => !!r && typeof (r as PriceItem).id === 'string' && typeof (r as PriceItem).name === 'string')
      .map((r) => ({ ...r, source: 'erp' as const }));
    return items.length ? items : null;
  } catch {
    return null; // network/timeout/parse error → fall back to seed
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Returns the merged price catalog (ERP over seed), cached for 15 minutes.
 * Always returns a usable list (falls back to the committed seed).
 */
export async function getPriceCatalog(): Promise<PriceItem[]> {
  if (cache && Date.now() - cache.at < PRICE_TTL_MS) return cache.items;

  const erp = await fetchErpPrices();
  let items: PriceItem[];
  if (erp && erp.length) {
    const merged = seedById();
    for (const item of erp) merged.set(item.id, item);
    items = [...merged.values()];
  } else {
    items = SEED_CATALOG;
  }

  cache = { at: Date.now(), items };
  return items;
}

/** Convenience: only items in a given category. */
export async function getPricesByCategory(category: PriceItem['category']): Promise<PriceItem[]> {
  return (await getPriceCatalog()).filter((i) => i.category === category);
}

/** Force the next call to re-fetch (e.g. from an ERP webhook). */
export function clearPriceCache(): void {
  cache = null;
}
