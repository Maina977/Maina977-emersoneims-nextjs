import { NextResponse } from 'next/server';
import { getPriceCatalog, getPricesByCategory } from '@/lib/pricing/source';
import type { PriceCategory } from '@/lib/pricing/types';

// Public, read-only price feed for the website. Reads from the ERP price
// endpoint when configured (ERP_PRICE_ENDPOINT), else the committed seed catalog.
// Cached at the edge for ~15 min; the loader also caches in memory.
export const revalidate = 900; // 15 minutes

// GET /api/pricing            → all items
// GET /api/pricing?category=pump → only that category
export async function GET(request: Request) {
  const category = new URL(request.url).searchParams.get('category') as PriceCategory | null;
  try {
    const items = category ? await getPricesByCategory(category) : await getPriceCatalog();
    return NextResponse.json(
      { ok: true, count: items.length, source: items.some((i) => i.source === 'erp') ? 'erp' : 'seed', items },
      { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=86400' } },
    );
  } catch {
    return NextResponse.json({ ok: false, count: 0, items: [] }, { status: 200 });
  }
}
