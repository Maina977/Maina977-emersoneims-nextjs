/**
 * Generator fault-code lookup / symptom endpoint (legacy path).
 *
 * POST /api/ai/diagnose  { query, mode: 'lookup' | 'search' | 'analyze' }
 * GET  /api/ai/diagnose?code=… | ?search=… | ?query=…
 *
 * Rewritten 2026-10-25 (audit round 5): it ran its own matcher, which called a
 * DeepSea "Battery Voltage Low" an "Exact match" for "Cummins 111" and ranked
 * a Siemens self-test failure first for "overspeed shutdown". It now answers
 * from the same fault index as /api/generator-oracle/*, with no confidence
 * percentages (they were keyword counts, not probabilities).
 */
import { NextRequest, NextResponse } from 'next/server';
import { searchIndex, diagnoseFromSymptoms } from '@/lib/generator-oracle/server/faultIndex';
import { answerOracle, codeLabel } from '@/lib/generator-oracle/server/answer';

type Mode = 'lookup' | 'search' | 'analyze';

const slim = (r: { code: string; codeKind: 'j1939' | 'j1587' | 'reference'; brand: string; title: string; severity: string; description: string; category: string }) => ({
  code: r.code, label: codeLabel(r), codeKind: r.codeKind, brand: r.brand, title: r.title,
  severity: r.severity, category: r.category, description: r.description,
});

function run(query: string, mode: Mode) {
  if (mode === 'search') {
    const r = searchIndex({ query, pageSize: 20 });
    return { found: r.total > 0, interpretedAs: r.interpretedAs, results: r.results.map(slim), summary: r.total > 0 ? `${r.total} entr${r.total === 1 ? 'y' : 'ies'} match "${query}".` : `Nothing in our fault-code reference matches "${query}".` };
  }
  if (mode === 'analyze') {
    const d = diagnoseFromSymptoms({ symptoms: [query], topN: 10 });
    const found = d.ranked.length > 0 || d.guides.length > 0;
    return {
      found, interpretedAs: null, results: d.ranked.map(slim), guides: d.guides.map((g) => ({ title: g.title, url: g.url })),
      summary: found ? 'Matched on the words used, not a diagnosis. Ranked by keyword match, not measured probability.' : 'Nothing in our reference matched that description. Add the alarm text or what the set is doing.',
    };
  }
  const a = answerOracle(query);
  return { found: a.found, interpretedAs: a.interpretedAs, results: a.results.map(slim), summary: a.text };
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be JSON' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Request body must be a JSON object' }, { status: 400 });
  const { query, mode = 'analyze' } = body as { query?: unknown; mode?: unknown };
  if (typeof query !== 'string' || !query.trim() || query.length > 300) return NextResponse.json({ error: 'Missing or invalid query' }, { status: 400 });
  if (!['lookup', 'search', 'analyze'].includes(String(mode))) return NextResponse.json({ error: 'mode must be lookup, search or analyze' }, { status: 400 });
  return NextResponse.json({ success: true, mode, query, source: 'Generator Oracle fault index (rule-based)', ...run(query.trim(), mode as Mode) });
}

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const code = p.get('code'), search = p.get('search'), query = p.get('query');
  // Same 300-character limit as POST (2026-10-27 audit: GET took 5,000).
  if ([code, search, query].some((v) => v != null && v.length > 300)) return NextResponse.json({ error: 'Query too long (300 characters at most)' }, { status: 400 });
  if (code) return NextResponse.json({ success: true, mode: 'lookup', query: code, ...run(code, 'lookup') });
  if (search) return NextResponse.json({ success: true, mode: 'search', query: search, ...run(search, 'search') });
  if (query) return NextResponse.json({ success: true, mode: 'analyze', query, ...run(query, 'analyze') });
  return NextResponse.json({
    success: false,
    error: 'Missing required parameter: code, search or query',
    usage: { lookup: '/api/ai/diagnose?code=SPN%20110%20FMI%200', search: '/api/ai/diagnose?search=oil%20pressure', analyze: '/api/ai/diagnose?query=generator%20overheating' },
  }, { status: 400 });
}
