/**
 * Append-only audit log (who, when, action, object) with a hash chain.
 *
 * Each record carries the hash of the previous record and its own hash over
 * every other field. The head (last sequence and hash) is stored apart, with
 * an HMAC under ACCOUNTS_SECRET_KEY, so deleting or rewriting the whole table
 * (or its tail) is detected too. A database trigger refuses UPDATE and DELETE
 * on acct_audit (migration accounts-001-core.sql).
 *
 * Details never hold project content, passwords, tokens or TOTP seeds: only
 * identifiers and hashes.
 */
import 'server-only';
import { canonicalJson } from '@/lib/solar/design/proposalApproval';
import type { AccountsDb, Queryable } from './db';
import { hmacHex, safeEqualStr, sha256HexNode } from './crypto';
import { toIso } from './db';

export interface AuditInput {
  actorUserId: string | null;
  orgId: string | null;
  action: string;
  objectType: string;
  objectId: string;
  detail?: Record<string, unknown>;
}
export interface AuditRecord {
  seq: number;
  at: string;
  actorUserId: string | null;
  orgId: string | null;
  action: string;
  objectType: string;
  objectId: string;
  detail: Record<string, unknown>;
  prevHash: string | null;
  recordHash: string;
}

export function auditHash(r: Omit<AuditRecord, 'recordHash'>): string {
  return sha256HexNode(canonicalJson({
    purpose: 'accounts-audit/v1', seq: r.seq, at: r.at, actorUserId: r.actorUserId, orgId: r.orgId,
    action: r.action, objectType: r.objectType, objectId: r.objectId, detail: r.detail, prevHash: r.prevHash,
  }));
}
export const headHmac = (secret: string, seq: number, hash: string | null) => hmacHex(secret, `accounts-audit-head/v1|${seq}|${hash ?? ''}`);

/** Appends one record. MUST run inside the caller's transaction (q), so it commits or rolls back with the action. */
export async function appendAudit(q: Queryable, secret: string, e: AuditInput, now = new Date()): Promise<AuditRecord> {
  const head = (await q.query<{ seq: unknown; head_hash: string | null }>('SELECT seq, head_hash FROM acct_audit_head WHERE id = 1 FOR UPDATE')).rows[0];
  if (!head) throw new Error('Audit head missing (migrations not applied)');
  const body: Omit<AuditRecord, 'recordHash'> = {
    seq: Number(head.seq) + 1, at: now.toISOString(), actorUserId: e.actorUserId, orgId: e.orgId,
    action: e.action, objectType: e.objectType, objectId: e.objectId, detail: e.detail ?? {}, prevHash: head.head_hash,
  };
  const rec: AuditRecord = { ...body, recordHash: auditHash(body) };
  await q.query(
    `INSERT INTO acct_audit (seq, at, actor_user_id, org_id, action, object_type, object_id, detail, prev_hash, record_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [rec.seq, rec.at, rec.actorUserId, rec.orgId, rec.action, rec.objectType, rec.objectId, JSON.stringify(rec.detail), rec.prevHash, rec.recordHash],
  );
  await q.query('UPDATE acct_audit_head SET seq = $1, head_hash = $2, head_hmac = $3 WHERE id = 1', [rec.seq, rec.recordHash, headHmac(secret, rec.seq, rec.recordHash)]);
  return rec;
}

export function rowToAudit(r: Record<string, unknown>): AuditRecord {
  return {
    seq: Number(r.seq), at: toIso(r.at) as string, actorUserId: (r.actor_user_id as string | null) ?? null, orgId: (r.org_id as string | null) ?? null,
    action: String(r.action), objectType: String(r.object_type), objectId: String(r.object_id),
    detail: (typeof r.detail === 'string' ? JSON.parse(r.detail) : r.detail) as Record<string, unknown>,
    prevHash: (r.prev_hash as string | null) ?? null, recordHash: String(r.record_hash),
  };
}

export type AuditVerify = { ok: true; count: number; headHash: string | null } | { ok: false; seq: number; problem: string };

/** Verifies the whole chain and the anchored head. */
export async function verifyAuditLog(db: AccountsDb, secret: string): Promise<AuditVerify> {
  const rows = (await db.query('SELECT * FROM acct_audit ORDER BY seq')).rows.map(rowToAudit);
  let prev: string | null = null;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (r.seq !== i) return { ok: false, seq: r.seq, problem: `sequence ${r.seq} where ${i} was expected (record missing or inserted)` };
    if (r.prevHash !== prev) return { ok: false, seq: r.seq, problem: 'broken link to the previous record' };
    if (auditHash(r) !== r.recordHash) return { ok: false, seq: r.seq, problem: 'record altered (hash mismatch)' };
    prev = r.recordHash;
  }
  const head = (await db.query<{ seq: unknown; head_hash: string | null; head_hmac: string | null }>('SELECT seq, head_hash, head_hmac FROM acct_audit_head WHERE id = 1')).rows[0];
  const lastSeq = rows.length - 1;
  if (!head || Number(head.seq) !== lastSeq || head.head_hash !== prev) return { ok: false, seq: lastSeq, problem: 'the chain head does not match the stored head (records removed or rewritten)' };
  if (lastSeq >= 0 && !(head.head_hmac && safeEqualStr(head.head_hmac, headHmac(secret, lastSeq, prev)))) return { ok: false, seq: lastSeq, problem: 'the chain head is not signed by the server key' };
  return { ok: true, count: rows.length, headHash: prev };
}
