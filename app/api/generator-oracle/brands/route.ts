import { NextRequest } from 'next/server';
import { listBrandSummaries } from '@/lib/generator-oracle/server/faultIndex';
import { jsonError, jsonOk } from '@/lib/generator-oracle/server/httpUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const brands = listBrandSummaries();
    return jsonOk({ count: brands.length, brands });
  } catch (e) {
    return jsonError('brands_list_failed', 500, e instanceof Error ? e.message : 'unknown');
  }
}
