import { NextRequest } from 'next/server';
import { diagnoseFromSymptoms, searchIndex, codeLikeQuery, type DiagnoseResponse } from '@/lib/generator-oracle/server/faultIndex';

/**
 * A code goes to the code index first (2026-10-19 re-audit): passed only as
 * alarm text, "SPN 100 FMI 1" scored below the two-word evidence threshold and
 * came back ranked: []. Exact code matches now head the list.
 */
function withCodeMatches(result: DiagnoseResponse, code: string | undefined, brand: string | undefined, topN: number): DiagnoseResponse {
  if (!code) return result;
  const hits = searchIndex({ query: code, brand, page: 1, pageSize: topN }).results
    .map((r) => ({ ...r, score: 100, matchedTerms: ['code'] }));
  if (hits.length === 0) return result;
  const ids = new Set(hits.map((h) => h.id));
  return { ...result, ranked: [...hits, ...result.ranked.filter((r) => !ids.has(r.id))].slice(0, topN) };
}
import { clampInt, clampString, clampStringList, jsonError, jsonOk } from '@/lib/generator-oracle/server/httpUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const symptoms = clampStringList(body.symptoms, 20, 200);

    /*
     * ACCEPT A FAULT CODE, NOT JUST A DESCRIPTION.
     *
     * This endpoint required `symptoms` or `alarmText` and ignored a fault code
     * entirely, so the most natural request a technician can make —
     *     {"faultCode":"1234","controllerBrand":"DeepSea"}
     * — came back {"ok":false,"error":"missing_symptoms_or_alarm_text"}.
     * Backwards for a fault-code tool: the controller shows a NUMBER, and that
     * number is what someone types first.
     *
     * The index could already do this. Verified against production before
     * changing anything — passing the code through alarmText matches cleanly:
     *     "SPN100" -> SPN100-FMI0, SPN100-FMI1
     *     "1234"   -> 1234
     *     "E-042"  -> 1042, 2042  (fuzzy, sensibly ranked)
     * So the capability was never missing; only the door was shut.
     *
     * `faultCode` and `code` are accepted as aliases and folded into the same
     * free-text field the matcher already uses. Existing callers that send
     * symptoms or alarmText are completely unaffected — this only adds a way in.
     */
    const faultCode = clampString(body.faultCode ?? body.code, 64);
    const alarmText = clampString(body.alarmText, 500) || faultCode;

    if (symptoms.length === 0 && !alarmText) {
      return jsonError('missing_symptoms_alarm_text_or_code');
    }
    const topN = clampInt(body.topN, 1, 50, 10);
    const result = diagnoseFromSymptoms({
      symptoms,
      alarmText,
      brand: clampString(body.brand),
      model: clampString(body.model),
      category: clampString(body.category),
      topN,
    });
    // A code typed into the symptom or alarm box is looked up as a code too
    // (2026-10-29 audit: "Cummins 151" in the Assistant's box returned no alarm).
    const codeText = faultCode || codeLikeQuery(clampString(body.alarmText, 500)) || (symptoms.length === 1 ? codeLikeQuery(symptoms[0]) : null) || undefined;
    return jsonOk(withCodeMatches(result, codeText, clampString(body.brand) || undefined, topN));
  } catch (e) {
    return jsonError('diagnose_failed', 500, e instanceof Error ? e.message : 'unknown');
  }
}

export async function GET(req: NextRequest) {
  // Convenience GET: ?q=symptom1,symptom2&brand=DSE
  try {
    const sp = req.nextUrl.searchParams;
    const q = clampString(sp.get('q'), 500);
    const symptoms = q ? q.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 20) : [];
    // Same reasoning as POST above: ?code=1234 is how a technician actually
    // asks. Falls through to the identical matcher.
    const code = clampString(sp.get('code') ?? sp.get('faultCode'), 64);
    if (symptoms.length === 0 && !code) return jsonError('missing_q_or_code');
    const topN = clampInt(sp.get('topN'), 1, 50, 10);
    const result = diagnoseFromSymptoms({
      symptoms,
      alarmText: code || undefined,
      brand: clampString(sp.get('brand')),
      model: clampString(sp.get('model')),
      category: clampString(sp.get('category')),
      topN,
    });
    // ?q=100-1 is a code, not a symptom (2026-10-29 audit: it returned a derating guide).
    const codeText = code || codeLikeQuery(q) || undefined;
    return jsonOk(withCodeMatches(result, codeText, clampString(sp.get('brand')) || undefined, topN));
  } catch (e) {
    return jsonError('diagnose_failed', 500, e instanceof Error ? e.message : 'unknown');
  }
}
