/**
 * SolarGeniusPro fault catalogue endpoint.
 *
 * Serves the real curated fault-codes catalogue (80+ entries) ported from
 * the original SolarGeniusPro Express backend. Source dataset compiled from
 * public manufacturer service manuals (Deye, Sungrow, Growatt, Solis, SMA,
 * Huawei, GoodWe, Fronius). See `_provenance` in the response payload.
 */
import { NextRequest } from 'next/server';
import { handleSolarGenius } from '@/lib/solar-genius/adapter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handleSolarGenius(req, 'faults', []);
}
