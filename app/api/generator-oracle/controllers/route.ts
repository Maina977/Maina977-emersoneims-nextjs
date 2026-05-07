import { NextRequest } from 'next/server';
import { listControllers } from '@/lib/generator-oracle/server/faultIndex';
import { clampString, jsonError, jsonOk } from '@/lib/generator-oracle/server/httpUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const brand = clampString(req.nextUrl.searchParams.get('brand'));
    const controllers = listControllers(brand);
    return jsonOk({ brand: brand ?? null, count: controllers.length, controllers });
  } catch (e) {
    return jsonError('controllers_list_failed', 500, e instanceof Error ? e.message : 'unknown');
  }
}
