import { NextRequest } from 'next/server';
import { searchIndex, type Severity } from '@/lib/generator-oracle/server/faultIndex';
import { clampInt, clampString, jsonError, jsonOk } from '@/lib/generator-oracle/server/httpUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SEVERITIES: Severity[] = ['info', 'warning', 'critical', 'shutdown'];

function readSeverity(v: string | undefined): Severity | undefined {
  return v && (SEVERITIES as string[]).includes(v) ? (v as Severity) : undefined;
}

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const result = searchIndex({
      query: clampString(sp.get('q')),
      brand: clampString(sp.get('brand')),
      model: clampString(sp.get('model')),
      severity: readSeverity(clampString(sp.get('severity'))),
      category: clampString(sp.get('category')),
      verifiedOnly: sp.get('verifiedOnly') === '1' || sp.get('verifiedOnly') === 'true',
      page: clampInt(sp.get('page'), 1, 10_000, 1),
      pageSize: clampInt(sp.get('pageSize'), 1, 100, 20),
    });
    return jsonOk(result);
  } catch (e) {
    return jsonError('search_failed', 500, e instanceof Error ? e.message : 'unknown');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const result = searchIndex({
      query: clampString(body.query),
      brand: clampString(body.brand),
      model: clampString(body.model),
      severity: readSeverity(clampString(body.severity)),
      category: clampString(body.category),
      verifiedOnly: body.verifiedOnly === true,
      page: clampInt(body.page, 1, 10_000, 1),
      pageSize: clampInt(body.pageSize, 1, 100, 20),
    });
    return jsonOk(result);
  } catch (e) {
    return jsonError('search_failed', 500, e instanceof Error ? e.message : 'unknown');
  }
}
