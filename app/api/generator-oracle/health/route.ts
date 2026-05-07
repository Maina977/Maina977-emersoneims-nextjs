import { NextRequest } from 'next/server';
import { buildHealthReport } from '@/lib/generator-oracle/server/faultIndex';
import { jsonError, jsonOk } from '@/lib/generator-oracle/server/httpUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const report = buildHealthReport();
    return jsonOk(report);
  } catch (e) {
    return jsonError('health_report_failed', 500, e instanceof Error ? e.message : 'unknown');
  }
}
