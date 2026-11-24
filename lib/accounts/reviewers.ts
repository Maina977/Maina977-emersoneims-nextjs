/**
 * Verified-professional registry and document approvals (Management Priority 5).
 *
 * - A member registers a reviewer PROFILE (legal name, professional body,
 *   registration number, scope, validity). It starts 'pending'. Nothing here
 *   ever verifies a profile automatically, and no profile is seeded.
 * - Only a registry admin (acct_users.is_registry_admin, granted by manual SQL
 *   only), in a second-factor session, with a fresh TOTP code, who is NOT the
 *   applicant, may mark it verified, recording the identity check, evidence
 *   reference, who and when.
 * - An approval is made by a verified, in-date, in-scope reviewer of the
 *   project's own organisation, in a second-factor session with a fresh TOTP
 *   code, against the EXACT current revision hash. The server signs it with
 *   signApproval (lib/solar/design/proposalApproval.ts), binding tool,
 *   document type, organisation, project and revision, and records it in the
 *   approval chain (appendAuditRecord format) and the audit log.
 * - Any later change is a new revision, which has no approval.
 * - Approvals are unavailable unless PROPOSAL_APPROVAL_SIGNING_KEY (32+) is set.
 */
import 'server-only';
import { randomUUID } from 'node:crypto';
import {
  auditRecordHash, signApproval, verifyApproval, verifyAuditChain,
  type ApprovalAuditRecord, type ApprovalVerifier, type AuthorisedReviewer, type VerifiedApproval,
} from '@/lib/solar/design/proposalApproval';
import { appendAudit } from './audit';
import { useTotp } from './auth';
import { APPROVABLE, PROFESSIONAL_BODIES, TOOLS, type Tool } from './config';
import { AcctError, assertUuid, badRequest, contentSha256, forbidden, notFound, type Actor, type Ctx, type Queryable } from './context';
import type { AccountsDb } from './db';
import { toIso } from './db';
import { documentLabel, type ApprovalStatus } from './documentLabels';
import { requireMember } from './orgs';

export const APPROVALS_UNAVAILABLE = 'Approvals are not available: the server approval signing key is not configured.';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const today = (ctx: Ctx) => ctx.now().toISOString().slice(0, 10);

export interface ScopeEntry { tool: Tool; documentType: string }
function checkScope(s: unknown): ScopeEntry[] {
  if (!Array.isArray(s) || s.length < 1 || s.length > 10) throw badRequest('Scope must list 1 to 10 tool and document-type pairs');
  return s.map((e) => {
    const x = e as Partial<ScopeEntry>;
    if (typeof x.tool !== 'string' || !(TOOLS as readonly string[]).includes(x.tool) || typeof x.documentType !== 'string' || !APPROVABLE[x.tool as Tool].includes(x.documentType)) {
      throw badRequest('Scope names a tool or document type that cannot be approved');
    }
    return { tool: x.tool as Tool, documentType: x.documentType };
  });
}
const str = (v: unknown, what: string, max = 200) => {
  if (typeof v !== 'string' || !v.trim() || v.trim().length > max) throw badRequest(`${what} is required (up to ${max} characters)`);
  return v.trim();
};

const REVIEWER_COLS = `id, org_id, user_id, legal_name, identity_check_status, professional_body, registration_number, scope,
  to_char(valid_from, 'YYYY-MM-DD') AS valid_from, to_char(valid_until, 'YYYY-MM-DD') AS valid_until,
  evidence_ref, state, verified_by, verified_at, created_at`;

export interface ReviewerOut {
  id: string; orgId: string; userId: string; legalName: string; identityCheckStatus: string; professionalBody: string; registrationNumber: string;
  scope: ScopeEntry[]; validFrom: string | null; validUntil: string | null; evidenceRef: string | null; state: string; effectiveState: string;
  verifiedBy: string | null; verifiedAt: string | null;
}
/** verified + identity checked + within validity = 'verified'; past valid_until = 'expired'; otherwise the stored state. */
export function effectiveState(r: { state: string; identity_check_status: string; valid_from: string | null; valid_until: string | null }, day: string): string {
  if (r.state !== 'verified') return r.state;
  if (r.valid_until && day > r.valid_until) return 'expired';
  if (r.identity_check_status !== 'checked' || !r.valid_from || !r.valid_until || day < r.valid_from) return 'pending';
  return 'verified';
}
function reviewerOut(r: Record<string, unknown>, day: string): ReviewerOut {
  const row = r as { state: string; identity_check_status: string; valid_from: string | null; valid_until: string | null };
  return {
    id: String(r.id), orgId: String(r.org_id), userId: String(r.user_id), legalName: String(r.legal_name), identityCheckStatus: String(r.identity_check_status),
    professionalBody: String(r.professional_body), registrationNumber: String(r.registration_number),
    scope: (typeof r.scope === 'string' ? JSON.parse(r.scope) : r.scope) as ScopeEntry[], validFrom: row.valid_from, validUntil: row.valid_until,
    evidenceRef: (r.evidence_ref as string | null) ?? null, state: row.state, effectiveState: effectiveState(row, day),
    verifiedBy: (r.verified_by as string | null) ?? null, verifiedAt: toIso(r.verified_at),
  };
}
const registration = (r: ReviewerOut) => `${r.professionalBody} ${r.registrationNumber}`;
const inScope = (r: ReviewerOut, tool: Tool, documentType: string) => r.scope.some((s) => s.tool === tool && s.documentType === documentType);

// ------------------------------------------------------------------ profiles
export async function registerReviewer(ctx: Ctx, actor: Actor, orgIdIn: unknown, body: Record<string, unknown>) {
  const legalName = str(body.legalName, 'The legal name');
  const professionalBody = str(body.professionalBody, 'The professional body', 20);
  if (!(PROFESSIONAL_BODIES as readonly string[]).includes(professionalBody)) throw badRequest(`Professional body must be one of ${PROFESSIONAL_BODIES.join(', ')}`);
  const registrationNumber = str(body.registrationNumber, 'The registration number', 60);
  const scope = checkScope(body.scope);
  if (!actor.totpEnabled || !actor.mfa) throw new AcctError(403, 'Reviewers must use the second factor: set it up and sign in with it first.', { needMfa: true });
  return ctx.db.tx(async (q) => {
    const { orgId } = await requireMember(q, actor, orgIdIn, 'viewer');
    const id = randomUUID();
    const r = await q.query(
      `INSERT INTO acct_reviewers (id, org_id, user_id, legal_name, professional_body, registration_number, scope, state, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, 'pending', $8, $8) ON CONFLICT (org_id, user_id) DO NOTHING RETURNING id`,
      [id, orgId, actor.userId, legalName, professionalBody, registrationNumber, JSON.stringify(scope), ctx.now().toISOString()],
    );
    if (!r.rows.length) throw new AcctError(409, 'You already have a reviewer profile in this organisation');
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId, action: 'reviewer.registered', objectType: 'reviewer', objectId: id, detail: { professionalBody, scope } }, ctx.now());
    return { id, state: 'pending' };
  });
}

export async function listOrgReviewers(ctx: Ctx, actor: Actor, orgIdIn: unknown) {
  const { orgId } = await requireMember(ctx.db, actor, orgIdIn, 'viewer');
  const r = await ctx.db.query<Record<string, unknown>>(`SELECT ${REVIEWER_COLS} FROM acct_reviewers WHERE org_id = $1 ORDER BY created_at`, [orgId]);
  return r.rows.map((x) => reviewerOut(x, today(ctx)));
}

function requireRegistryAdmin(actor: Actor) {
  if (!actor.isRegistryAdmin) throw notFound();
  if (!actor.mfa) throw new AcctError(403, 'Registry administration needs the second factor in this session.', { needMfa: true });
}

export async function listRegistry(ctx: Ctx, actor: Actor) {
  requireRegistryAdmin(actor);
  const r = await ctx.db.query<Record<string, unknown>>(`SELECT ${REVIEWER_COLS} FROM acct_reviewers ORDER BY created_at`);
  return r.rows.map((x) => reviewerOut(x, today(ctx)));
}

/** Registry admin, second factor + fresh code, not the applicant: records the documented checks and verifies. */
export async function verifyReviewer(ctx: Ctx, actor: Actor, reviewerIdIn: unknown, body: Record<string, unknown>) {
  requireRegistryAdmin(actor);
  const id = assertUuid(reviewerIdIn);
  if (body.identityCheckStatus !== 'checked') throw badRequest('The identity document must have been checked (identityCheckStatus: "checked")');
  const evidenceRef = str(body.evidenceRef, 'The verification evidence reference', 300);
  const validFrom = str(body.validFrom, 'validFrom', 10);
  const validUntil = str(body.validUntil, 'validUntil', 10);
  if (!DATE_RE.test(validFrom) || !DATE_RE.test(validUntil) || validUntil < validFrom) throw badRequest('Validity dates must be YYYY-MM-DD, with validUntil after validFrom');
  if (validUntil < today(ctx)) throw badRequest('The registration has already expired');
  return ctx.db.tx(async (q) => {
    if (!(await useTotp(q, ctx, actor.userId, body.totp))) throw new AcctError(403, 'A fresh authenticator code is required to verify a reviewer.');
    const r = (await q.query<Record<string, unknown>>(`SELECT ${REVIEWER_COLS} FROM acct_reviewers WHERE id = $1 FOR UPDATE`, [id])).rows[0];
    if (!r) throw notFound();
    if (String(r.user_id) === actor.userId) throw forbidden('You cannot verify your own reviewer profile');
    if (r.state === 'verified') throw badRequest('Already verified');
    const u = (await q.query<{ totp_enabled_at: unknown }>('SELECT totp_enabled_at FROM acct_users WHERE id = $1', [r.user_id])).rows[0];
    if (!u?.totp_enabled_at) throw badRequest('The reviewer must have the second factor enabled');
    await q.query(
      `UPDATE acct_reviewers SET state = 'verified', identity_check_status = 'checked', evidence_ref = $2, valid_from = $3, valid_until = $4,
       verified_by = $5, verified_at = $6, updated_at = $6 WHERE id = $1`,
      [id, evidenceRef, validFrom, validUntil, actor.userId, ctx.now().toISOString()],
    );
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId: String(r.org_id), action: 'reviewer.verified', objectType: 'reviewer', objectId: id, detail: { evidenceRef, validFrom, validUntil } }, ctx.now());
    return { id, state: 'verified' };
  });
}

export async function suspendReviewer(ctx: Ctx, actor: Actor, reviewerIdIn: unknown, reasonIn: unknown) {
  requireRegistryAdmin(actor);
  const id = assertUuid(reviewerIdIn);
  const reason = str(reasonIn, 'A reason', 300);
  await ctx.db.tx(async (q) => {
    const r = await q.query<{ org_id: string }>("UPDATE acct_reviewers SET state = 'suspended', updated_at = $2 WHERE id = $1 RETURNING org_id", [id, ctx.now().toISOString()]);
    if (!r.rows.length) throw notFound();
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId: r.rows[0].org_id, action: 'reviewer.suspended', objectType: 'reviewer', objectId: id, detail: { reason } }, ctx.now());
  });
}

// ------------------------------------------------------------------ approvals
function signingKey(ctx: Ctx): string | null {
  const k = ctx.env.PROPOSAL_APPROVAL_SIGNING_KEY ?? '';
  return k.length >= 32 ? k : null;
}
export const bindingOf = (tool: string, documentType: string, orgId: string, projectId: string, revisionId: string) => `${tool}/${documentType}/${orgId}/${projectId}/${revisionId}`;

/** Currently valid reviewers of one organisation for a tool and document type, as the ApprovalVerifier registry. */
export async function orgRegistry(q: Queryable, orgId: string, tool: Tool, documentType: string, day: string): Promise<AuthorisedReviewer[]> {
  const r = await q.query<Record<string, unknown>>(`SELECT ${REVIEWER_COLS} FROM acct_reviewers WHERE org_id = $1 AND state = 'verified'`, [orgId]);
  return r.rows.map((x) => reviewerOut(x, day)).filter((x) => x.effectiveState === 'verified' && inScope(x, tool, documentType))
    .map((x) => ({ reviewerId: x.id, name: x.legalName, registration: registration(x) }));
}

async function appendApprovalChain(q: Queryable, entry: Omit<ApprovalAuditRecord, 'sequence' | 'previousRecordHash' | 'recordHash'>) {
  const last = (await q.query<{ sequence: number; record: unknown }>('SELECT sequence, record FROM acct_approval_chain ORDER BY sequence DESC LIMIT 1')).rows[0];
  const prev = last ? (typeof last.record === 'string' ? JSON.parse(last.record) : last.record) as ApprovalAuditRecord : null;
  const body = { ...entry, sequence: prev ? prev.sequence + 1 : 0, previousRecordHash: prev ? prev.recordHash : null };
  const rec: ApprovalAuditRecord = { ...body, recordHash: auditRecordHash(body) };
  await q.query('INSERT INTO acct_approval_chain (sequence, record) VALUES ($1, $2::jsonb)', [rec.sequence, JSON.stringify(rec)]);
  return rec;
}
export async function verifyApprovalChain(db: AccountsDb) {
  const rows = (await db.query<{ record: unknown }>('SELECT record FROM acct_approval_chain ORDER BY sequence')).rows;
  return verifyAuditChain(rows.map((r) => (typeof r.record === 'string' ? JSON.parse(r.record) : r.record) as ApprovalAuditRecord));
}

async function loadRevision(q: Queryable, orgId: string, projectIdIn: unknown, revisionIdIn: unknown, lock = false) {
  const projectId = assertUuid(projectIdIn);
  const revisionId = assertUuid(revisionIdIn);
  const p = (await q.query<Record<string, unknown>>(`SELECT * FROM acct_projects WHERE org_id = $1 AND id = $2 AND deleted_at IS NULL${lock ? ' FOR UPDATE' : ''}`, [orgId, projectId])).rows[0];
  if (!p) throw notFound();
  const r = (await q.query<Record<string, unknown>>('SELECT * FROM acct_revisions WHERE org_id = $1 AND project_id = $2 AND id = $3', [orgId, projectId, revisionId])).rows[0];
  if (!r) throw notFound();
  const content = typeof r.content === 'string' ? JSON.parse(r.content) : r.content;
  return { p, r, projectId, revisionId, tool: p.tool as Tool, recomputed: contentSha256(content), stored: String(r.content_sha256) };
}

/**
 * Approves the EXACT revision. Every condition must hold, or it is refused:
 * signing key configured; second-factor session AND a fresh code; member of
 * this organisation; reviewer profile in this organisation, verified, identity
 * checked, in date and in scope; the revision is current and its content still
 * matches its hash, and the hash given matches it.
 */
export async function approveRevision(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown, revisionIdIn: unknown, body: Record<string, unknown>) {
  const key = signingKey(ctx);
  if (!key) throw new AcctError(503, APPROVALS_UNAVAILABLE);
  const documentType = typeof body.documentType === 'string' ? body.documentType : '';
  const revisionHash = typeof body.revisionHash === 'string' ? body.revisionHash : '';
  if (!actor.mfa) throw new AcctError(403, 'Approval needs a second-factor session.', { needMfa: true });
  return ctx.db.tx(async (q) => {
    const { orgId } = await requireMember(q, actor, orgIdIn, 'viewer');
    if (!(await useTotp(q, ctx, actor.userId, body.totp))) throw new AcctError(403, 'A fresh authenticator code is required to approve.');
    const rv = (await q.query<Record<string, unknown>>(`SELECT ${REVIEWER_COLS} FROM acct_reviewers WHERE org_id = $1 AND user_id = $2`, [orgId, actor.userId])).rows[0];
    if (!rv) throw forbidden('You are not a registered reviewer in this organisation');
    const reviewer = reviewerOut(rv, today(ctx));
    if (reviewer.effectiveState !== 'verified') throw forbidden(`Your reviewer profile is ${reviewer.effectiveState}, not verified: you cannot approve`);
    const rev = await loadRevision(q, orgId, projectIdIn, revisionIdIn, true);
    if (!APPROVABLE[rev.tool].includes(documentType)) throw badRequest('This document type cannot be approved for this tool');
    if (!inScope(reviewer, rev.tool, documentType)) throw forbidden('This document is outside your scope of authority');
    if (rev.recomputed !== rev.stored) throw new AcctError(409, 'The stored document does not match its hash; it cannot be approved');
    if (revisionHash !== rev.stored) throw new AcctError(409, 'The revision hash you approved is not the hash of this revision');
    if (String(rev.p.current_revision_id) !== rev.revisionId) throw new AcctError(409, 'Only the current revision can be approved; reload the project');
    const approval: VerifiedApproval = signApproval({
      reviewerId: reviewer.id, reviewerName: reviewer.legalName, registration: registration(reviewer),
      approvedAt: ctx.now().toISOString(), revisionHash: rev.stored, binding: bindingOf(rev.tool, documentType, orgId, rev.projectId, rev.revisionId),
    }, key);
    const id = randomUUID();
    const ins = await q.query(
      `INSERT INTO acct_approvals (id, org_id, project_id, revision_id, revision_hash, tool, document_type, reviewer_id, approval, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10) ON CONFLICT (revision_id, reviewer_id, document_type) DO NOTHING RETURNING id`,
      [id, orgId, rev.projectId, rev.revisionId, rev.stored, rev.tool, documentType, reviewer.id, JSON.stringify(approval), ctx.now().toISOString()],
    );
    if (!ins.rows.length) throw new AcctError(409, 'You have already approved this revision');
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId, action: 'approval.granted', objectType: 'revision', objectId: rev.revisionId, detail: { approvalId: id, projectId: rev.projectId, tool: rev.tool, documentType, revisionHash: rev.stored, reviewerId: reviewer.id, signature: approval.signature } }, ctx.now());
    await appendApprovalChain(q, { action: 'APPROVED', proposalReference: `${rev.tool}:${rev.projectId}`, revisionHash: rev.stored, reviewerId: reviewer.id, reviewerName: reviewer.legalName, registration: registration(reviewer), at: approval.approvedAt });
    return { id, approval };
  });
}

export async function revokeApproval(ctx: Ctx, actor: Actor, orgIdIn: unknown, approvalIdIn: unknown, body: Record<string, unknown>) {
  const approvalId = assertUuid(approvalIdIn);
  if (!actor.mfa) throw new AcctError(403, 'Revoking needs a second-factor session.', { needMfa: true });
  await ctx.db.tx(async (q) => {
    const { orgId } = await requireMember(q, actor, orgIdIn, 'viewer');
    if (!(await useTotp(q, ctx, actor.userId, body.totp))) throw new AcctError(403, 'A fresh authenticator code is required to revoke.');
    const a = (await q.query<Record<string, unknown>>(
      `SELECT a.*, r.user_id AS reviewer_user, r.legal_name, r.professional_body, r.registration_number FROM acct_approvals a JOIN acct_reviewers r ON r.id = a.reviewer_id
       WHERE a.org_id = $1 AND a.id = $2 AND a.revoked_at IS NULL FOR UPDATE OF a`, [orgId, approvalId],
    )).rows[0];
    if (!a || String(a.reviewer_user) !== actor.userId) throw notFound();
    await q.query('UPDATE acct_approvals SET revoked_at = $3 WHERE org_id = $1 AND id = $2', [orgId, approvalId, ctx.now().toISOString()]);
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId, action: 'approval.revoked', objectType: 'revision', objectId: String(a.revision_id), detail: { approvalId } }, ctx.now());
    await appendApprovalChain(q, { action: 'REVOKED', proposalReference: `${a.tool}:${a.project_id}`, revisionHash: String(a.revision_hash), reviewerId: String(a.reviewer_id), reviewerName: String(a.legal_name), registration: `${a.professional_body} ${a.registration_number}`, at: ctx.now().toISOString() });
  });
}

/**
 * REJECTS the exact current revision with a reason (a recorded decision, never
 * an approval). Same conditions as approving: second-factor session and a
 * fresh code; verified, identity-checked, in-date, in-scope reviewer of the
 * project's own organisation; current revision; stored content matches its
 * hash; the hash given is that hash. A reviewer who has an active approval of
 * this revision must revoke it first.
 */
export async function rejectRevision(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown, revisionIdIn: unknown, body: Record<string, unknown>) {
  const documentType = typeof body.documentType === 'string' ? body.documentType : '';
  const revisionHash = typeof body.revisionHash === 'string' ? body.revisionHash : '';
  const reason = str(body.reason, 'A reason for the rejection', 1000);
  if (!actor.mfa) throw new AcctError(403, 'Rejecting needs a second-factor session.', { needMfa: true });
  return ctx.db.tx(async (q) => {
    const { orgId } = await requireMember(q, actor, orgIdIn, 'viewer');
    if (!(await useTotp(q, ctx, actor.userId, body.totp))) throw new AcctError(403, 'A fresh authenticator code is required to reject.');
    const rv = (await q.query<Record<string, unknown>>(`SELECT ${REVIEWER_COLS} FROM acct_reviewers WHERE org_id = $1 AND user_id = $2`, [orgId, actor.userId])).rows[0];
    if (!rv) throw forbidden('You are not a registered reviewer in this organisation');
    const reviewer = reviewerOut(rv, today(ctx));
    if (reviewer.effectiveState !== 'verified') throw forbidden(`Your reviewer profile is ${reviewer.effectiveState}, not verified: you cannot reject`);
    const rev = await loadRevision(q, orgId, projectIdIn, revisionIdIn, true);
    if (!APPROVABLE[rev.tool].includes(documentType)) throw badRequest('This document type cannot be reviewed for this tool');
    if (!inScope(reviewer, rev.tool, documentType)) throw forbidden('This document is outside your scope of authority');
    if (rev.recomputed !== rev.stored) throw new AcctError(409, 'The stored document does not match its hash; it cannot be reviewed');
    if (revisionHash !== rev.stored) throw new AcctError(409, 'The revision hash you reviewed is not the hash of this revision');
    if (String(rev.p.current_revision_id) !== rev.revisionId) throw new AcctError(409, 'Only the current revision can be reviewed; reload the project');
    const active = await q.query('SELECT 1 FROM acct_approvals WHERE revision_id = $1 AND reviewer_id = $2 AND document_type = $3 AND revoked_at IS NULL', [rev.revisionId, reviewer.id, documentType]);
    if (active.rows.length) throw new AcctError(409, 'You have approved this revision: revoke that approval before rejecting it');
    const id = randomUUID();
    const at = ctx.now().toISOString();
    await q.query(
      `INSERT INTO acct_review_decisions (id, org_id, project_id, revision_id, revision_hash, tool, document_type, reviewer_id, decision, reason, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'rejected', $9, $10)`,
      [id, orgId, rev.projectId, rev.revisionId, rev.stored, rev.tool, documentType, reviewer.id, reason, at],
    );
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId, action: 'approval.rejected', objectType: 'revision', objectId: rev.revisionId, detail: { decisionId: id, projectId: rev.projectId, tool: rev.tool, documentType, revisionHash: rev.stored, reviewerId: reviewer.id, reason } }, ctx.now());
    await appendApprovalChain(q, { action: 'REJECTED', proposalReference: `${rev.tool}:${rev.projectId}`, revisionHash: rev.stored, reviewerId: reviewer.id, reviewerName: reviewer.legalName, registration: registration(reviewer), at });
    return { id, decision: 'rejected' as const };
  });
}

/**
 * Re-checks every approval of a revision from scratch: signature (HMAC),
 * reviewer still verified/in date/in scope in this organisation, exact
 * revision hash (the stored content is re-hashed), binding to this tool,
 * document type, organisation, project and revision.
 */
export async function checkApprovals(ctx: Ctx, q: Queryable, orgId: string, projectIdIn: unknown, revisionIdIn: unknown, documentType: string): Promise<ApprovalStatus> {
  return (await checkApprovalsDetailed(ctx, q, orgId, projectIdIn, revisionIdIn, documentType)).status;
}

/** As checkApprovals, plus the one approval that actually passed (never just "the first row"). */
async function checkApprovalsDetailed(ctx: Ctx, q: Queryable, orgId: string, projectIdIn: unknown, revisionIdIn: unknown, documentType: string): Promise<{ status: ApprovalStatus; verified: VerifiedApproval | null; registry: AuthorisedReviewer[] }> {
  const r = await checkApprovalsCore(ctx, q, orgId, projectIdIn, revisionIdIn, documentType);
  if (r.status.approved) return r;
  // Not approved: say so with the latest rejection of this exact revision, if there is one.
  const rej = (await q.query<Record<string, unknown>>(
    `SELECT d.reason, d.created_at, v.legal_name, v.professional_body, v.registration_number
     FROM acct_review_decisions d JOIN acct_reviewers v ON v.id = d.reviewer_id
     WHERE d.org_id = $1 AND d.revision_id = $2 AND d.document_type = $3 AND d.decision = 'rejected'
     ORDER BY d.created_at DESC LIMIT 1`,
    [orgId, String(revisionIdIn), documentType],
  )).rows[0];
  if (!rej) return r;
  const rejection = { name: String(rej.legal_name), registration: `${rej.professional_body} ${rej.registration_number}`, rejectedAt: toIso(rej.created_at) ?? '', reason: String(rej.reason) };
  return { ...r, status: { ...r.status, rejection, reason: `Rejected by ${rejection.name} (${rejection.registration}): ${rejection.reason}` } };
}

async function checkApprovalsCore(ctx: Ctx, q: Queryable, orgId: string, projectIdIn: unknown, revisionIdIn: unknown, documentType: string): Promise<{ status: ApprovalStatus; verified: VerifiedApproval | null; registry: AuthorisedReviewer[] }> {
  const rev = await loadRevision(q, orgId, projectIdIn, revisionIdIn);
  const notApproved = (reason: string, registry: AuthorisedReviewer[] = []) => ({ status: { approved: false, label: documentLabel(rev.tool, documentType, false), reason } as ApprovalStatus, verified: null, registry });
  const key = signingKey(ctx);
  if (!key) return notApproved(APPROVALS_UNAVAILABLE);
  if (!APPROVABLE[rev.tool].includes(documentType)) return notApproved('This document type cannot be approved for this tool');
  if (rev.recomputed !== rev.stored) return notApproved('The stored document does not match its hash (altered); not approved');
  const registry = await orgRegistry(q, orgId, rev.tool, documentType, today(ctx));
  const verifier: ApprovalVerifier = { signingKey: key, registry, now: ctx.now().getTime() };
  const rows = (await q.query<Record<string, unknown>>(
    'SELECT * FROM acct_approvals WHERE org_id = $1 AND project_id = $2 AND revision_id = $3 AND document_type = $4 AND revoked_at IS NULL',
    [orgId, rev.projectId, rev.revisionId, documentType],
  )).rows;
  let reason = rows.length ? '' : 'No approval by a verified reviewer is recorded for this exact revision';
  for (const row of rows) {
    const a = (typeof row.approval === 'string' ? JSON.parse(row.approval) : row.approval) as VerifiedApproval;
    if (a.binding !== bindingOf(rev.tool, documentType, orgId, rev.projectId, rev.revisionId)) { reason = 'The approval belongs to a different document or revision (replay refused)'; continue; }
    const c = verifyApproval(a, rev.recomputed, verifier);
    if (!c.ok) { reason = c.reason; continue; }
    return {
      status: { approved: true, label: documentLabel(rev.tool, documentType, true), reason: '', reviewer: { name: c.reviewer.name, registration: c.reviewer.registration, approvedAt: c.approval.approvedAt } },
      verified: a, registry,
    };
  }
  return notApproved(reason, registry);
}

export async function approvalStatus(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown, revisionIdIn: unknown, documentType: unknown) {
  const { orgId } = await requireMember(ctx.db, actor, orgIdIn, 'viewer');
  return checkApprovals(ctx, ctx.db, orgId, projectIdIn, revisionIdIn, typeof documentType === 'string' ? documentType : '');
}

/** Number of reviewers currently verified (and in date) for this tool and document type, across organisations. */
export async function verifiedReviewerCount(ctx: Ctx, tool: Tool, documentType: string): Promise<number> {
  const r = await ctx.db.query<Record<string, unknown>>(`SELECT ${REVIEWER_COLS} FROM acct_reviewers WHERE state = 'verified'`);
  return r.rows.map((x) => reviewerOut(x, today(ctx))).filter((x) => x.effectiveState === 'verified' && inScope(x, tool, documentType)).length;
}

/**
 * Solar FOR ISSUE path: the approval of this exact proposal input made in an
 * organisation the signed-in user belongs to, re-checked, with the verifier
 * to pass to buildProposal. null = no verified reviewer exists (behaviour
 * unchanged: DRAFT).
 */
export async function solarProposalApproval(ctx: Ctx, actor: Actor | null, revisionHash: string): Promise<{ verifier: ApprovalVerifier; verifiedApproval: VerifiedApproval | null } | null> {
  const key = signingKey(ctx);
  if (!key) return null;
  if ((await verifiedReviewerCount(ctx, 'solar', 'proposal')) === 0) return null;
  const noApproval = { verifier: { signingKey: key, registry: [{ reviewerId: '-', name: '-', registration: '-' }], now: ctx.now().getTime() }, verifiedApproval: null };
  if (!actor) return noApproval;
  const rows = (await ctx.db.query<Record<string, unknown>>(
    `SELECT a.org_id, a.project_id, a.revision_id FROM acct_approvals a JOIN acct_memberships m ON m.org_id = a.org_id AND m.user_id = $1
     WHERE a.revision_hash = $2 AND a.tool = 'solar' AND a.document_type = 'proposal' AND a.revoked_at IS NULL`,
    [actor.userId, revisionHash],
  )).rows;
  for (const row of rows) {
    // The approval returned is the one that passed every check, not merely the first row
    // (a second, revoked-reviewer or tampered approval of the same revision must never be used).
    const d = await checkApprovalsDetailed(ctx, ctx.db, String(row.org_id), row.project_id, row.revision_id, 'proposal');
    if (!d.status.approved || !d.verified) continue;
    return { verifier: { signingKey: key, registry: d.registry, now: ctx.now().getTime() }, verifiedApproval: d.verified };
  }
  return noApproval;
}
