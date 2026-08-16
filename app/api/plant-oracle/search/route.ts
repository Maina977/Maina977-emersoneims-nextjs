import { NextRequest, NextResponse } from 'next/server';
import { searchPlantCodes, getStats } from '@/lib/plant-oracle/coverage';
import { decodeJ1939 } from '@/lib/plant-oracle/j1939';

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
    /*
     * J1939 decode path. Composed on demand from the two verified tables —
     * nothing is pre-generated, so we can never hand back a combination we
     * have not actually been asked about as though it were catalogued.
     *
     * This is how John Deere, JCB, Komatsu and Doosan are served without a
     * manufacturer table: they all speak the same SAE standard.
     */
    const spnRaw = sp.get('spn');
    const fmiRaw = sp.get('fmi');
    if (spnRaw !== null && fmiRaw !== null) {
      const decoded = decodeJ1939(Number(spnRaw), Number(fmiRaw));
      return NextResponse.json({
        ok: true,
        mode: 'j1939',
        decoded,
        provenance:
          'SAE J1939 standard tables. FMI values cross-checked across two independent references; ' +
          'SPN names triangulated from a published OEM J1939 fault table and shape-validated, with 8 ' +
          'confirmed against independent sources. Manufacturer-proprietary SPNs are deliberately excluded.',
      });
    }

    const q = (sp.get('q') ?? '').slice(0, 120);
    const brand = (sp.get('brand') ?? '').slice(0, 60) || undefined;
    const limit = Number(sp.get('limit') ?? 40);

    if (!q && !brand) {
      return NextResponse.json({ ok: true, results: [], stats: getStats() });
    }

    const results = searchPlantCodes(q, { brand, limit });
    const stats = getStats();
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
      /*
       * Counts come from getStats(), never a literal — the same rule the
       * generator side now enforces via scripts/check-code-counts.mjs.
       */
      provenance:
        `EmersonEIMS curated reference data — ${stats.codes} records ` +
        `(${stats.engineCodes} engine-brand, ${stats.oemCodes} machine-maker) across ${stats.brands} brands. ` +
        'Descriptions are written in our own words; nothing is transcribed from a manufacturer service manual. ' +
        'For official documentation refer to the manufacturer service manual for the specific machine.',
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: 'search_failed', detail: e instanceof Error ? e.message : 'unknown' },
      { status: 500 }
    );
  }
}
