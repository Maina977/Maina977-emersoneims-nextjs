import { jsonError } from '@/lib/generator-oracle/server/httpUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * RETIRED (2026-11-05 audit). This endpoint looked codes up in an older table
 * and answered "No matching fault found" for real codes such as SPN 100 FMI 1,
 * and did not refuse impossible ones. No page uses it. Rather than give wrong
 * answers on a public URL, it now says where the working lookups are.
 */
export async function POST() {
  return jsonError(
    'retired',
    410,
    'This endpoint is retired. Use /api/generator-oracle/fault-code?code=SPN%20100%20FMI%201 to look up a code, or POST /api/generator-oracle/diagnose {"symptoms":["low oil pressure"]} for symptoms.',
  );
}
