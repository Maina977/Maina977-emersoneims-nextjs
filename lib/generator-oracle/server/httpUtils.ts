import 'server-only';

const MAX_STR = 100;
const MAX_LIST = 20;

export function clampString(v: unknown, max = MAX_STR): string | undefined {
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  if (!t) return undefined;
  return t.length > max ? t.slice(0, max) : t;
}

export function clampInt(v: unknown, min: number, max: number, dflt: number): number {
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return dflt;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

export function clampStringList(v: unknown, maxItems = MAX_LIST, maxLen = MAX_STR): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const item of v) {
    const s = clampString(item, maxLen);
    if (s) out.push(s);
    if (out.length >= maxItems) break;
  }
  return out;
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return new Response(JSON.stringify({ ok: false, error: message, details: details ?? null }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export function jsonOk(payload: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify({ ok: true, ...((payload as object) || {}) }), {
    status: init?.status ?? 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...(init?.headers || {}) },
  });
}
