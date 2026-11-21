/**
 * Solar proposal approval lock (P1, 2026-11-21).
 *
 * Management directive: a typed name cannot grant FOR ISSUE. Approval needs an
 * authenticated, authorised reviewer, revision locking and a verifiable audit
 * trail. Until those exist, every proposal stays DRAFT.
 *
 * What is here (pure functions, browser- and server-safe):
 * - proposalRevisionHash: SHA-256 of a canonical JSON of the proposal input,
 *   with any approval left out. Any edit to the input changes it.
 * - VerifiedApproval: { reviewerId, reviewerName, registration, approvedAt,
 *   revisionHash, signature }. The signature is HMAC-SHA256 under a
 *   server-only key (env PROPOSAL_APPROVAL_SIGNING_KEY), so only the server
 *   can produce one. verifyApproval checks the signature, that the reviewer is
 *   in the authorised-reviewer registry, and that the approved revision is
 *   the current one. Anything missing or wrong FAILS CLOSED (DRAFT).
 * - The approval audit record and verifyAuditChain (a hash chain).
 *
 * BLOCKED, pending the owner's decision on user accounts:
 * - Authentication: there is no reviewer login/session, so no server code path
 *   calls signApproval. The route never produces FOR ISSUE today.
 * - Authorised-reviewer registry storage: none exists, so the route has no
 *   registry and approvalVerifierFromEnvironment returns null.
 * - Audit storage: records must be appended (never updated or deleted) in the
 *   accounts database, by the server only, in the same transaction as the
 *   approval/revocation, with the chain head anchored outside the table (for
 *   example signed with the server key) so a full rewrite of the table is also
 *   detected. Not implemented: it needs that database.
 */
import { sha256Hex, hmacSha256Hex, constantTimeEqual } from './sha256';

export const APPROVAL_UNAVAILABLE_REASON =
  'Engineer approval requires an authenticated, authorised reviewer; this is not available yet, so the proposal remains DRAFT';
export const APPROVAL_LOCKED_NOTICE =
  'Approval: not available yet — requires an authenticated, authorised reviewer. All proposals remain DRAFT.';
export const TYPED_APPROVAL_IGNORED_REASON =
  'A typed engineer name, registration or date is not an approval and was ignored';
export const CLIENT_APPROVAL_REJECTED = `A client-supplied approval is not accepted. ${APPROVAL_UNAVAILABLE_REASON}`;

/** Produced only by the server, after authenticating an authorised reviewer. */
export interface VerifiedApproval {
  reviewerId: string;
  reviewerName: string;
  registration: string;
  approvedAt: string;      // ISO 8601
  revisionHash: string;    // proposalRevisionHash of the approved input
  signature: string;       // hex HMAC-SHA256 of approvalSigningPayload under the server key
}
export interface AuthorisedReviewer { reviewerId: string; name: string; registration: string }
export interface ApprovalVerifier {
  /** Server-only secret. Never sent to the browser. */
  signingKey: string;
  /** The authorised-reviewer registry (storage pending: accounts database). */
  registry: readonly AuthorisedReviewer[];
  /** Oldest acceptable approval, in days (default 365). Audit L1, 2026-11-21. */
  maxAgeDays?: number;
  /** Clock for tests; defaults to Date.now(). */
  now?: number;
}

const MIN_KEY_LENGTH = 32;
const HEX64 = /^[0-9a-f]{64}$/;

/**
 * Canonical JSON: object keys sorted, undefined members left out, otherwise
 * the same values JSON.stringify gives (NaN/Infinity → null). The browser and
 * the server therefore hash the same input to the same value, before and
 * after a JSON round trip.
 */
export function canonicalJson(x: unknown): string {
  if (x === null || typeof x !== 'object') {
    const s = JSON.stringify(x);
    return s === undefined ? 'null' : s;
  }
  if (Array.isArray(x)) return `[${x.map((v) => (v === undefined || typeof v === 'function' ? 'null' : canonicalJson(v))).join(',')}]`;
  const o = x as Record<string, unknown>;
  const keys = Object.keys(o).filter((k) => o[k] !== undefined && typeof o[k] !== 'function').sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJson(o[k])}`).join(',')}}`;
}

/** SHA-256 (hex) of the canonical input, excluding any approval. */
export function proposalRevisionHash(input: object): string {
  const rest: Record<string, unknown> = { ...(input as Record<string, unknown>) };
  delete rest.approval;
  delete rest.verifiedApproval;
  return sha256Hex(canonicalJson(rest));
}

/** The exact text that is signed. */
export function approvalSigningPayload(a: Omit<VerifiedApproval, 'signature'>): string {
  return canonicalJson({
    purpose: 'solar-proposal-approval/v1',
    reviewerId: a.reviewerId, reviewerName: a.reviewerName, registration: a.registration,
    approvedAt: a.approvedAt, revisionHash: a.revisionHash,
  });
}

/**
 * SERVER ONLY. To be called solely after the reviewer's session is
 * authenticated and the reviewer is found in the registry. No such path exists
 * yet (accounts pending); today only the regression tests call it, with TEST
 * keys and TEST reviewers.
 */
export function signApproval(a: Omit<VerifiedApproval, 'signature'>, signingKey: string): VerifiedApproval {
  if (signingKey.length < MIN_KEY_LENGTH) throw new Error(`The approval signing key must be at least ${MIN_KEY_LENGTH} characters`);
  return { ...a, signature: hmacSha256Hex(signingKey, approvalSigningPayload(a)) };
}

/**
 * The server's verifier, or null (fail closed) when the signing key or the
 * reviewer registry is unavailable.
 */
export function approvalVerifierFromEnvironment(env: Record<string, string | undefined>, registry: readonly AuthorisedReviewer[] | null): ApprovalVerifier | null {
  const key = env.PROPOSAL_APPROVAL_SIGNING_KEY ?? '';
  if (key.length < MIN_KEY_LENGTH || !registry || registry.length === 0) return null;
  return { signingKey: key, registry };
}

export type ApprovalCheck = { ok: true; reviewer: AuthorisedReviewer; approval: VerifiedApproval } | { ok: false; reason: string };

const isStr = (x: unknown): x is string => typeof x === 'string' && x.trim() !== '';

/** FOR ISSUE is allowed only when this returns ok. Everything else is DRAFT, with the reason. */
export function verifyApproval(approval: unknown, currentRevisionHash: string, verifier: ApprovalVerifier | null): ApprovalCheck {
  if (!verifier || verifier.signingKey.length < MIN_KEY_LENGTH || !verifier.registry.length) return { ok: false, reason: APPROVAL_UNAVAILABLE_REASON };
  if (approval === undefined || approval === null) return { ok: false, reason: 'Engineer approval by an authorised reviewer is not yet recorded' };
  const a = approval as Partial<VerifiedApproval>;
  if (!isStr(a.reviewerId) || !isStr(a.reviewerName) || !isStr(a.registration) || !isStr(a.approvedAt) || Number.isNaN(Date.parse(a.approvedAt))
    || !isStr(a.revisionHash) || !HEX64.test(a.revisionHash) || !isStr(a.signature) || !HEX64.test(a.signature)) {
    return { ok: false, reason: 'The approval is incomplete or malformed; the proposal remains DRAFT' };
  }
  const full = a as VerifiedApproval;
  const expected = hmacSha256Hex(verifier.signingKey, approvalSigningPayload(full));
  if (!constantTimeEqual(expected, full.signature)) return { ok: false, reason: 'The approval signature is not valid; the proposal remains DRAFT' };
  const reviewer = verifier.registry.find((r) => r.reviewerId === full.reviewerId);
  if (!reviewer || reviewer.name !== full.reviewerName || reviewer.registration !== full.registration) {
    return { ok: false, reason: `Reviewer ${full.reviewerId} is not in the authorised-reviewer registry; the proposal remains DRAFT` };
  }
  // Audit L1 (2026-11-21): a correctly signed approval must also be current:
  // not dated in the future (5 minutes' clock skew allowed) and not older than maxAgeDays.
  const now = verifier.now ?? Date.now();
  const at = Date.parse(full.approvedAt);
  if (at > now + 5 * 60e3) return { ok: false, reason: 'The approval is dated in the future; the proposal remains DRAFT' };
  if (now - at > (verifier.maxAgeDays ?? 365) * 86400e3) return { ok: false, reason: 'The approval is too old to rely on; the proposal remains DRAFT and needs a new approval' };
  if (full.revisionHash !== currentRevisionHash) {
    return { ok: false, reason: `The proposal has changed since it was approved (approved revision ${full.revisionHash.slice(0, 12)}…, current ${currentRevisionHash.slice(0, 12)}…); it is back to DRAFT and needs a new approval` };
  }
  return { ok: true, reviewer, approval: full };
}

// ------------------------------------------------------------------ audit trail
/**
 * One approval event. Records form a hash chain: each carries the hash of the
 * previous record, and its own hash over every other field.
 * STORAGE PENDING (accounts database): see the header of this file.
 */
export interface ApprovalAuditRecord {
  sequence: number;                  // 0, 1, 2, …
  action: 'APPROVED' | 'REVOKED';
  proposalReference: string;
  revisionHash: string;
  reviewerId: string;                // who
  reviewerName: string;
  registration: string;
  at: string;                        // when (ISO 8601)
  previousRecordHash: string | null; // null only for the first record
  recordHash: string;
}
export type AuditEntry = Omit<ApprovalAuditRecord, 'sequence' | 'previousRecordHash' | 'recordHash'>;

export function auditRecordHash(r: Omit<ApprovalAuditRecord, 'recordHash'>): string {
  return sha256Hex(canonicalJson({
    purpose: 'solar-proposal-audit/v1',
    sequence: r.sequence, action: r.action, proposalReference: r.proposalReference, revisionHash: r.revisionHash,
    reviewerId: r.reviewerId, reviewerName: r.reviewerName, registration: r.registration, at: r.at,
    previousRecordHash: r.previousRecordHash,
  }));
}

/** A new chain with the entry appended (the input chain is not changed). */
export function appendAuditRecord(chain: readonly ApprovalAuditRecord[], entry: AuditEntry): ApprovalAuditRecord[] {
  const prev = chain.length ? chain[chain.length - 1] : null;
  const body = { ...entry, sequence: chain.length, previousRecordHash: prev ? prev.recordHash : null };
  return [...chain, { ...body, recordHash: auditRecordHash(body) }];
}

export type AuditChainCheck = { ok: true; headHash: string | null } | { ok: false; index: number; problem: string };

/**
 * Verifies a chain: sequence numbers, links, each record's own hash, times in
 * order, and that a REVOKED follows an APPROVED (not yet revoked) of the same
 * revision. Any edit, insertion, removal or reordering is detected, except a
 * rewrite of the whole chain, which needs the anchored head (storage pending).
 */
export function verifyAuditChain(chain: readonly ApprovalAuditRecord[]): AuditChainCheck {
  const approved = new Set<string>();
  let lastTime = -Infinity;
  for (let i = 0; i < chain.length; i++) {
    const r = chain[i];
    const fail = (problem: string): AuditChainCheck => ({ ok: false, index: i, problem });
    if (r.sequence !== i) return fail(`sequence ${r.sequence} where ${i} was expected (record missing, inserted or reordered)`);
    const expectedPrev = i === 0 ? null : chain[i - 1].recordHash;
    if (r.previousRecordHash !== expectedPrev) return fail('broken link: previousRecordHash does not match the previous record');
    if (auditRecordHash(r) !== r.recordHash) return fail('record hash does not match its contents (record altered)');
    if (r.action !== 'APPROVED' && r.action !== 'REVOKED') return fail(`unknown action ${String(r.action)}`);
    if (!HEX64.test(r.revisionHash)) return fail('revisionHash is not a SHA-256 hex digest');
    if (![r.reviewerId, r.reviewerName, r.registration, r.proposalReference].every(isStr)) return fail('who (reviewer id, name, registration) and the proposal reference are required');
    const t = Date.parse(r.at);
    if (Number.isNaN(t)) return fail('time is not a valid date');
    if (t < lastTime) return fail('time is earlier than the previous record');
    lastTime = t;
    const key = `${r.proposalReference}\u0000${r.revisionHash}`;
    if (r.action === 'APPROVED') approved.add(key);
    else if (!approved.delete(key)) return fail('REVOKED without a matching APPROVED of the same revision');
  }
  return { ok: true, headHash: chain.length ? chain[chain.length - 1].recordHash : null };
}
