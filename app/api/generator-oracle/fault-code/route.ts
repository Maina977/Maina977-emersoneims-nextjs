import { NextRequest } from 'next/server';
import { lookupFaultCode } from '@/lib/generator-oracle/server/faultIndex';
import { clampString, jsonError, jsonOk } from '@/lib/generator-oracle/server/httpUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const code = clampString(req.nextUrl.searchParams.get('code'));
    const brand = clampString(req.nextUrl.searchParams.get('brand'));
    if (!code) return jsonError('missing_code');

    const result = lookupFaultCode(code, brand);
    return jsonOk({
      code,
      brand: brand ?? null,
      ...result,
      // exactMatches keep their full ControllerFaultCode payload (diagnostic
      // steps, reset pathways, solutions, safety warnings) — partialMatches
      // are slim summaries to keep payload small.
    });
  } catch (e) {
    return jsonError('fault_code_lookup_failed', 500, e instanceof Error ? e.message : 'unknown');
  }
}
