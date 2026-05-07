import { NextRequest } from 'next/server';
import { diagnoseFromSymptoms } from '@/lib/generator-oracle/server/faultIndex';
import { clampInt, clampString, clampStringList, jsonError, jsonOk } from '@/lib/generator-oracle/server/httpUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const symptoms = clampStringList(body.symptoms, 20, 200);
    const alarmText = clampString(body.alarmText, 500);
    if (symptoms.length === 0 && !alarmText) {
      return jsonError('missing_symptoms_or_alarm_text');
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
    if (symptoms.length === 0) return jsonError('missing_q');
    const result = diagnoseFromSymptoms({
      symptoms,
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
