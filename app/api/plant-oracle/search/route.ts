import { NextRequest, NextResponse } from 'next/server';
import { searchPlantCodes, getStats } from '@/lib/plant-oracle/coverage';

/**
 * Plant & Equipment Oracle search.
 *
 * Server-side because verifiedFaultCodes.ts is 516 KB — shipping 2,155 records
 * to a phone on a Kenyan mobile connection to filter them client-side would be
 * a poor trade for a technician standing next to a broken machine.
 *
 * Reads ONLY the curated 2,155 records. The generator side's template-expanded
 * code ranges are deliberately not reachable from here.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const q = (sp.get('q') ?? '').slice(0, 120);
    const brand = (sp.get('brand') ?? '').slice(0, 60) || undefined;
    const limit = Number(sp.get('limit') ?? 40);

    if (!q && !brand) {
      return NextResponse.json({ ok: true, results: [], stats: getStats() });
    }

    const results = searchPlantCodes(q, { brand, limit });
    return NextResponse.json({
      ok: true,
      query: q,
      brand: brand ?? null,
      count: results.length,
      results,
      /*
       * Sent with every response so the interface can never present a result
       * as more authoritative than it is. Anything without a verified record
       * simply is not in here to return.
       */
      provenance: 'EmersonEIMS verified reference data — 2,155 curated records across 11 engine brands. Not transcribed from any manufacturer manual. For official documentation refer to the manufacturer service manual for the specific engine.',
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: 'search_failed', detail: e instanceof Error ? e.message : 'unknown' },
      { status: 500 }
    );
  }
}
