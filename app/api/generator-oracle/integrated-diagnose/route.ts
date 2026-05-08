import { NextRequest } from 'next/server';
import { performIntegratedDiagnosis } from '@/lib/generator-oracle/integratedDiagnosticService';
import { jsonError, jsonOk } from '@/lib/generator-oracle/server/httpUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Server-side wrapper for `performIntegratedDiagnosis()`. Lets client panels
 * trigger the full ECM-aware integrated diagnosis without bundling the
 * 451k-record fault index into the browser.
 *
 * Body shape: see `TechnicianInput` in integratedDiagnosticData.ts.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || typeof body !== 'object') {
      return jsonError('invalid_body', 400);
    }

    // Pass the body through as TechnicianInput. The service validates internally
    // and returns a fully-typed IntegratedDiagnosisResult — no leakage of any
    // unrelated server-side state.
    const result = await performIntegratedDiagnosis(body as Parameters<typeof performIntegratedDiagnosis>[0]);
    return jsonOk({ result });
  } catch (e) {
    return jsonError('integrated_diagnose_failed', 500, e instanceof Error ? e.message : 'unknown');
  }
}
