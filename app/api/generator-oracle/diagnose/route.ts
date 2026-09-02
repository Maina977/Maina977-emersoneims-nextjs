import { NextRequest } from 'next/server';
import { diagnoseFromSymptoms } from '@/lib/generator-oracle/server/faultIndex';
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
    const result = diagnoseFromSymptoms({
      symptoms,
      alarmText,
      brand: clampString(body.brand),
      model: clampString(body.model),
      category: clampString(body.category),
      topN: clampInt(body.topN, 1, 50, 10),
    });
    return jsonOk(result);
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
    const result = diagnoseFromSymptoms({
      symptoms,
      alarmText: code || undefined,
      brand: clampString(sp.get('brand')),
      model: clampString(sp.get('model')),
      category: clampString(sp.get('category')),
      topN: clampInt(sp.get('topN'), 1, 50, 10),
    });
    return jsonOk(result);
  } catch (e) {
    return jsonError('diagnose_failed', 500, e instanceof Error ? e.message : 'unknown');
  }
}
