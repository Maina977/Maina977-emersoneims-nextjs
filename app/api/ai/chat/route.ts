/**
 * Generator fault-code chat endpoint.
 *
 * Rewritten 2026-10-25 (audit round 5): it had its own code reader and
 * symptom matcher, so it disagreed with the Generator Oracle search ("Cummins
 * 111" got a greeting), introduced itself as an "AI Assistant" and returned
 * confidence percentages. It now answers from the same fault index as
 * /api/generator-oracle/search and /diagnose, in plain words, with no scores.
 */
import { NextRequest, NextResponse } from 'next/server';
import { answerOracle } from '@/lib/generator-oracle/server/answer';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be JSON' }, { status: 400 });
  }
  const message = body && typeof body === 'object' ? (body as { message?: unknown }).message : undefined;
  if (typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'Missing or invalid message' }, { status: 400 });
  }
  if (message.length > 500) {
    return NextResponse.json({ error: 'Message too long (500 characters at most)' }, { status: 400 });
  }
  const a = answerOracle(message);
  return NextResponse.json({
    response: a.text,
    isDiagnostic: a.kind !== 'none',
    found: a.found,
    interpretedAs: a.interpretedAs,
    results: a.results.slice(0, 5).map((r) => ({ code: r.code, codeKind: r.codeKind, brand: r.brand, title: r.title, severity: r.severity })),
    guides: a.guides.map((g) => ({ title: g.title, url: g.url })),
    source: 'Generator Oracle fault index (rule-based)',
  });
}
