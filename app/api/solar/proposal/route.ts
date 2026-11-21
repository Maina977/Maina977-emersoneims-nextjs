import { NextRequest, NextResponse } from 'next/server';
import { limiter } from '@/lib/rate-limiter';
import { buildProposal } from '@/lib/solar/design/proposal';
import { checkProposalRequest, proposalFileName } from '@/lib/solar/design/proposalRequest';
import { approvalVerifierFromEnvironment, type AuthorisedReviewer } from '@/lib/solar/design/proposalApproval';

/** PENDING (owner decision on accounts): no authorised-reviewer registry exists, so none is loaded. */
const AUTHORISED_REVIEWER_REGISTRY: readonly AuthorisedReviewer[] | null = null;

/**
 * POST /api/solar/proposal  { input: ProposalInput, format: 'json' | 'xlsx' | 'pdf' }
 * Builds the design-to-proposal (lib/solar/design/proposal.ts) and returns it
 * as JSON, an Excel workbook or a PDF (lib/solar/design/proposalExport.ts).
 * Bad input → 400 with the engine's own message. Never cached.
 * Any `approval` or `verifiedApproval` in the input → 400: approvals are never
 * taken from the client, and every proposal from this route is DRAFT (or
 * REFUSED) until authenticated, authorised reviewers exist.
 */
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const NO_STORE = { 'Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store' };
const MAX_BYTES = 2_000_000;

/** The body as text, or null once more than maxBytes have arrived (reading stops there). */
async function readCapped(req: Request, maxBytes: number): Promise<string | null> {
  if (!req.body) return '';
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) { await reader.cancel().catch(() => {}); return null; }
    chunks.push(value);
  }
  const all = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { all.set(c, off); off += c.byteLength; }
  return new TextDecoder().decode(all);
}

const fail = (error: string, status: number) => NextResponse.json({ error }, { status, headers: NO_STORE });

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!limiter.check(20, `solar-proposal:${ip}`).success) return fail('Too many requests; try again in a minute.', 429);
  // Audit M6 (2026-11-21): refuse on the declared size before reading the body.
  const declared = Number(req.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_BYTES) return fail('Request too large (2 MB limit)', 413);

  // Read with a hard cap so a chunked body with no Content-Length is never
  // buffered past the limit (re-audit LOW 3, 2026-11-21).
  const text = await readCapped(req, MAX_BYTES);
  if (text === null) return fail('Request too large (2 MB limit)', 413);
  let body: unknown;
  try { body = JSON.parse(text); } catch { return fail('Body must be JSON', 400); }
  const parsed = checkProposalRequest(body);
  if ('error' in parsed) return fail(parsed.error, 400);

  // Approval lock: a client-supplied approval was rejected above (400). There
  // is no authenticated reviewer session and no reviewer registry yet, so the
  // verifier is null and the engine fails closed: never FOR ISSUE from here.
  const verifier = approvalVerifierFromEnvironment(process.env, AUTHORISED_REVIEWER_REGISTRY);
  let proposal;
  try { proposal = buildProposal(parsed.input, verifier); }
  catch (e) { return fail(e instanceof Error ? e.message : 'Invalid proposal input', 400); }

  if (parsed.format === 'json') return NextResponse.json(proposal, { headers: NO_STORE });

  const { proposalToXlsx, proposalToPdf } = await import('@/lib/solar/design/proposalExport');
  if (parsed.format === 'xlsx') {
    const buf = await proposalToXlsx(proposal);
    return new NextResponse(new Uint8Array(buf), { headers: { ...NO_STORE, 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': `attachment; filename="${proposalFileName(proposal.reference, 'xlsx')}"` } });
  }
  const pdf = proposalToPdf(proposal);
  return new NextResponse(pdf as unknown as BodyInit, { headers: { ...NO_STORE, 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${proposalFileName(proposal.reference, 'pdf')}"` } });
}
