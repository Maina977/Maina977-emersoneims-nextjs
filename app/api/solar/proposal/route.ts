import { NextRequest, NextResponse } from 'next/server';
import { limiter } from '@/lib/rate-limiter';
import { buildProposal } from '@/lib/solar/design/proposal';
import { checkProposalRequest, proposalFileName } from '@/lib/solar/design/proposalRequest';
import { approvalVerifierFromEnvironment, type AuthorisedReviewer } from '@/lib/solar/design/proposalApproval';
import { solarApprovalFor } from '@/lib/accounts/solarApproval';

/** No static registry: verified reviewers live in the accounts database (Report B, lib/accounts/solarApproval.ts). */
const AUTHORISED_REVIEWER_REGISTRY: readonly AuthorisedReviewer[] | null = null;

/**
 * POST /api/solar/proposal  { input: ProposalInput, format: 'json' | 'xlsx' | 'pdf' }
 * Builds the design-to-proposal (lib/solar/design/proposal.ts) and returns it
 * as JSON, an Excel workbook or a PDF (lib/solar/design/proposalExport.ts).
 * Bad input → 400 with the engine's own message. Never cached.
 * Any `approval` or `verifiedApproval` in the input → 400: approvals are never
 * taken from the client. A proposal is FOR ISSUE only when the SERVER finds an
 * approval of this exact input by a verified, in-date, in-scope reviewer of an
 * organisation the signed-in user belongs to (accounts; never in production
 * while accounts are hard-off). Otherwise DRAFT (or REFUSED).
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

  // Approval lock: a client-supplied approval was rejected above (400). The only
  // approval ever used is one the server finds and re-verifies for this exact
  // input (fails closed to DRAFT on any problem).
  const found = await solarApprovalFor(req, parsed.input);
  const verifier = found.verifier ?? approvalVerifierFromEnvironment(process.env, AUTHORISED_REVIEWER_REGISTRY);
  const input = found.verifiedApproval ? { ...parsed.input, verifiedApproval: found.verifiedApproval } : parsed.input;
  let proposal;
  try { proposal = buildProposal(input, verifier); }
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
