/**
 * Organisation-scoped project storage: projects, immutable revisions,
 * autosave with optimistic concurrency, restore, JSON export, attachments
 * (chunked, hashed, type allow-listed), soft delete with a 30-day window.
 *
 * EVERY statement carries org_id from requireMember, so a project id from
 * another organisation simply matches no row (404). Browser projects reach
 * this module only through an explicit "Upload this project" request
 * (source = 'browser-upload'); nothing is migrated automatically.
 */
import 'server-only';
import { randomUUID } from 'node:crypto';
import { appendAudit } from './audit';
import {
  ATTACHMENT_TYPES, MAX_ATTACHMENT_BYTES, MAX_CHUNK_BYTES, MAX_PROJECT_CONTENT_BYTES, SOFT_DELETE_RESTORE_DAYS, TOOLS, type Tool,
} from './config';
import { AcctError, assertUuid, badRequest, contentSha256, notFound, type Actor, type Ctx, type Queryable } from './context';
import { sha256HexNode } from './crypto';
import { toBytes, toIso } from './db';
import { requireMember } from './orgs';

const APPROVAL_KEYS = ['approval', 'verifiedApproval', 'approvals', 'signature', 'certification', 'signOff'];
export const CONTENT_APPROVAL_REFUSED = 'A project cannot carry an approval, signature or certification: approvals are recorded separately, by a verified reviewer, against an exact revision.';

function checkContent(content: unknown): { json: string; hash: string } {
  if (content === undefined || content === null || typeof content !== 'object') throw badRequest('The project content must be a JSON object');
  if (!Array.isArray(content) && APPROVAL_KEYS.some((k) => k in (content as Record<string, unknown>))) throw badRequest(CONTENT_APPROVAL_REFUSED);
  const json = JSON.stringify(content);
  if (json.length > MAX_PROJECT_CONTENT_BYTES) throw new AcctError(413, 'The project is too large to store (3.5 MB limit); keep large drawings as attachments');
  return { json, hash: contentSha256(content) };
}
const asTool = (t: unknown): Tool => {
  if (typeof t !== 'string' || !(TOOLS as readonly string[]).includes(t)) throw badRequest('Unknown tool');
  return t as Tool;
};
const asVersion = (v: unknown): number => {
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 1) throw badRequest('baseVersion must be the version you last loaded');
  return v;
};

export interface ProjectMeta { id: string; tool: Tool; name: string; source: string; currentVersion: number; currentRevisionId: string | null; updatedAt: string | null; deletedAt: string | null }
const meta = (r: Record<string, unknown>): ProjectMeta => ({
  id: String(r.id), tool: r.tool as Tool, name: String(r.name), source: String(r.source), currentVersion: Number(r.current_version),
  currentRevisionId: (r.current_revision_id as string | null) ?? null, updatedAt: toIso(r.updated_at), deletedAt: toIso(r.deleted_at),
});
export interface RevisionOut { id: string; version: number; parentRevisionId: string | null; contentSha256: string; restoredFrom: string | null; note: string; createdBy: string; createdAt: string | null; content?: unknown }
const rev = (r: Record<string, unknown>, withContent: boolean): RevisionOut => ({
  id: String(r.id), version: Number(r.version), parentRevisionId: (r.parent_revision_id as string | null) ?? null, contentSha256: String(r.content_sha256),
  restoredFrom: (r.restored_from as string | null) ?? null, note: String(r.note ?? ''), createdBy: String(r.created_by), createdAt: toIso(r.created_at),
  ...(withContent ? { content: typeof r.content === 'string' ? JSON.parse(r.content) : r.content } : {}),
});

/** The project row locked FOR UPDATE, scoped by org; deleted projects only when allowDeleted. */
async function lockProject(q: Queryable, orgId: string, projectIdIn: unknown, allowDeleted = false) {
  const projectId = assertUuid(projectIdIn);
  const p = (await q.query<Record<string, unknown>>('SELECT * FROM acct_projects WHERE org_id = $1 AND id = $2 FOR UPDATE', [orgId, projectId])).rows[0];
  if (!p || (!allowDeleted && p.deleted_at)) throw notFound();
  return p;
}

async function insertRevision(q: Queryable, ctx: Ctx, a: { orgId: string; projectId: string; version: number; parent: string | null; json: string; hash: string; by: string; note: string; restoredFrom?: string | null }) {
  const id = randomUUID();
  await q.query(
    `INSERT INTO acct_revisions (id, org_id, project_id, version, parent_revision_id, content, content_sha256, restored_from, note, created_by, created_at)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11)`,
    [id, a.orgId, a.projectId, a.version, a.parent, a.json, a.hash, a.restoredFrom ?? null, a.note.slice(0, 500), a.by, ctx.now().toISOString()],
  );
  return id;
}

export async function createProject(ctx: Ctx, actor: Actor, orgIdIn: unknown, body: { tool?: unknown; name?: unknown; content?: unknown; source?: unknown }) {
  const tool = asTool(body.tool);
  if (typeof body.name !== 'string' || !body.name.trim() || body.name.length > 200) throw badRequest('The project name must be 1 to 200 characters');
  const name = body.name.trim();
  const source = body.source === 'browser-upload' ? 'browser-upload' : 'account';
  const { json, hash } = checkContent(body.content);
  return ctx.db.tx(async (q) => {
    const { orgId } = await requireMember(q, actor, orgIdIn, 'engineer');
    const id = randomUUID();
    const now = ctx.now().toISOString();
    await q.query(
      `INSERT INTO acct_projects (id, org_id, tool, name, source, current_version, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 1, $6, $7, $7)`,
      [id, orgId, tool, name, source, actor.userId, now],
    );
    const revisionId = await insertRevision(q, ctx, { orgId, projectId: id, version: 1, parent: null, json, hash, by: actor.userId, note: source === 'browser-upload' ? 'Uploaded from this browser by the user' : 'Created' });
    await q.query('UPDATE acct_projects SET current_revision_id = $3 WHERE org_id = $1 AND id = $2', [orgId, id, revisionId]);
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId, action: source === 'browser-upload' ? 'project.uploaded_from_browser' : 'project.created', objectType: 'project', objectId: id, detail: { tool, revisionId, contentSha256: hash } }, ctx.now());
    return { id, version: 1, revisionId, contentSha256: hash };
  });
}

export async function listProjects(ctx: Ctx, actor: Actor, orgIdIn: unknown, includeDeleted = false) {
  const { orgId, role } = await requireMember(ctx.db, actor, orgIdIn, 'viewer');
  const showDeleted = includeDeleted && (role === 'admin' || role === 'owner');
  const r = await ctx.db.query<Record<string, unknown>>(
    `SELECT id, tool, name, source, current_version, current_revision_id, updated_at, deleted_at FROM acct_projects
     WHERE org_id = $1 AND ($2::boolean OR deleted_at IS NULL) ORDER BY updated_at DESC`,
    [orgId, showDeleted],
  );
  return r.rows.map(meta);
}

export async function getProject(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown) {
  const { orgId } = await requireMember(ctx.db, actor, orgIdIn, 'viewer');
  const projectId = assertUuid(projectIdIn);
  const p = (await ctx.db.query<Record<string, unknown>>('SELECT * FROM acct_projects WHERE org_id = $1 AND id = $2 AND deleted_at IS NULL', [orgId, projectId])).rows[0];
  if (!p) throw notFound();
  const r = (await ctx.db.query<Record<string, unknown>>('SELECT * FROM acct_revisions WHERE org_id = $1 AND project_id = $2 AND id = $3', [orgId, projectId, p.current_revision_id])).rows[0];
  return { project: meta(p), revision: r ? rev(r, true) : null };
}

/** Autosave: a new immutable revision, only if baseVersion is still current (else 409 with the current version). */
export async function autosave(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown, body: { baseVersion?: unknown; content?: unknown; note?: unknown }) {
  const base = asVersion(body.baseVersion);
  const { json, hash } = checkContent(body.content);
  return ctx.db.tx(async (q) => {
    const { orgId } = await requireMember(q, actor, orgIdIn, 'engineer');
    const p = await lockProject(q, orgId, projectIdIn);
    const cur = Number(p.current_version);
    if (cur !== base) throw new AcctError(409, 'This project was changed elsewhere since you loaded it. Reload it, then save again.', { currentVersion: cur });
    const curRev = (await q.query<{ content_sha256: string }>('SELECT content_sha256 FROM acct_revisions WHERE org_id = $1 AND id = $2', [orgId, p.current_revision_id])).rows[0];
    if (curRev?.content_sha256 === hash) return { id: String(p.id), version: cur, revisionId: String(p.current_revision_id), contentSha256: hash, unchanged: true };
    const version = cur + 1;
    const revisionId = await insertRevision(q, ctx, { orgId, projectId: String(p.id), version, parent: (p.current_revision_id as string | null) ?? null, json, hash, by: actor.userId, note: typeof body.note === 'string' ? body.note : 'Autosave' });
    await q.query('UPDATE acct_projects SET current_version = $3, current_revision_id = $4, updated_at = $5 WHERE org_id = $1 AND id = $2', [orgId, p.id, version, revisionId, ctx.now().toISOString()]);
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId, action: 'revision.created', objectType: 'project', objectId: String(p.id), detail: { revisionId, version, contentSha256: hash } }, ctx.now());
    return { id: String(p.id), version, revisionId, contentSha256: hash, unchanged: false };
  });
}

export async function listRevisions(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown) {
  const { orgId } = await requireMember(ctx.db, actor, orgIdIn, 'viewer');
  const projectId = assertUuid(projectIdIn);
  const p = (await ctx.db.query('SELECT 1 FROM acct_projects WHERE org_id = $1 AND id = $2 AND deleted_at IS NULL', [orgId, projectId])).rows[0];
  if (!p) throw notFound();
  const r = await ctx.db.query<Record<string, unknown>>(
    'SELECT id, version, parent_revision_id, content_sha256, restored_from, note, created_by, created_at FROM acct_revisions WHERE org_id = $1 AND project_id = $2 ORDER BY version DESC',
    [orgId, projectId],
  );
  return r.rows.map((x) => rev(x, false));
}

export async function getRevision(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown, revisionIdIn: unknown) {
  const { orgId } = await requireMember(ctx.db, actor, orgIdIn, 'viewer');
  const projectId = assertUuid(projectIdIn);
  const revisionId = assertUuid(revisionIdIn);
  const r = (await ctx.db.query<Record<string, unknown>>(
    `SELECT r.* FROM acct_revisions r JOIN acct_projects p ON p.id = r.project_id AND p.org_id = r.org_id
     WHERE r.org_id = $1 AND r.project_id = $2 AND r.id = $3 AND p.deleted_at IS NULL`,
    [orgId, projectId, revisionId],
  )).rows[0];
  if (!r) throw notFound();
  return rev(r, true);
}

/** Restores an old revision as a NEW revision (history is never rewritten). */
export async function restoreRevision(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown, revisionIdIn: unknown, body: { baseVersion?: unknown }) {
  const base = asVersion(body.baseVersion);
  const revisionId = assertUuid(revisionIdIn);
  return ctx.db.tx(async (q) => {
    const { orgId } = await requireMember(q, actor, orgIdIn, 'engineer');
    const p = await lockProject(q, orgId, projectIdIn);
    const cur = Number(p.current_version);
    if (cur !== base) throw new AcctError(409, 'This project was changed elsewhere since you loaded it. Reload it, then restore again.', { currentVersion: cur });
    const old = (await q.query<Record<string, unknown>>('SELECT * FROM acct_revisions WHERE org_id = $1 AND project_id = $2 AND id = $3', [orgId, p.id, revisionId])).rows[0];
    if (!old) throw notFound();
    const content = typeof old.content === 'string' ? JSON.parse(old.content) : old.content;
    const hash = contentSha256(content);
    if (hash !== old.content_sha256) throw new AcctError(500, 'The stored revision does not match its hash; it was not restored.');
    const version = cur + 1;
    const newId = await insertRevision(q, ctx, { orgId, projectId: String(p.id), version, parent: (p.current_revision_id as string | null) ?? null, json: JSON.stringify(content), hash, by: actor.userId, note: `Restored from version ${old.version}`, restoredFrom: revisionId });
    await q.query('UPDATE acct_projects SET current_version = $3, current_revision_id = $4, updated_at = $5 WHERE org_id = $1 AND id = $2', [orgId, p.id, version, newId, ctx.now().toISOString()]);
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId, action: 'revision.restored', objectType: 'project', objectId: String(p.id), detail: { revisionId: newId, restoredFrom: revisionId, version, contentSha256: hash } }, ctx.now());
    return { id: String(p.id), version, revisionId: newId, contentSha256: hash };
  });
}

/** JSON export: the project, every revision with content and hash, attachment metadata and approvals. */
export async function exportProject(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown) {
  const { orgId } = await requireMember(ctx.db, actor, orgIdIn, 'viewer');
  const projectId = assertUuid(projectIdIn);
  const p = (await ctx.db.query<Record<string, unknown>>('SELECT * FROM acct_projects WHERE org_id = $1 AND id = $2 AND deleted_at IS NULL', [orgId, projectId])).rows[0];
  if (!p) throw notFound();
  const revisions = (await ctx.db.query<Record<string, unknown>>('SELECT * FROM acct_revisions WHERE org_id = $1 AND project_id = $2 ORDER BY version', [orgId, projectId])).rows.map((r) => rev(r, true));
  const attachments = (await ctx.db.query<Record<string, unknown>>(
    "SELECT id, filename, media_type, size_bytes, sha256, created_at FROM acct_attachments WHERE org_id = $1 AND project_id = $2 AND status = 'complete' AND deleted_at IS NULL ORDER BY created_at",
    [orgId, projectId],
  )).rows.map((a) => ({ id: String(a.id), filename: String(a.filename), mediaType: String(a.media_type), sizeBytes: Number(a.size_bytes), sha256: String(a.sha256), createdAt: toIso(a.created_at) }));
  const approvals = (await ctx.db.query<Record<string, unknown>>('SELECT revision_id, document_type, approval, revoked_at FROM acct_approvals WHERE org_id = $1 AND project_id = $2', [orgId, projectId])).rows
    .map((a) => ({ revisionId: String(a.revision_id), documentType: String(a.document_type), approval: a.approval, revokedAt: toIso(a.revoked_at) }));
  await ctx.db.tx((q) => appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId, action: 'project.exported', objectType: 'project', objectId: projectId }, ctx.now()));
  const body = { format: 'emersoneims-account-project', formatVersion: 1, exportedAt: ctx.now().toISOString(), project: meta(p), revisions, attachments, approvals };
  return { ...body, exportSha256: contentSha256(body) };
}

export async function softDeleteProject(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown) {
  await ctx.db.tx(async (q) => {
    const { orgId } = await requireMember(q, actor, orgIdIn, 'admin');
    const p = await lockProject(q, orgId, projectIdIn);
    await q.query('UPDATE acct_projects SET deleted_at = $3, deleted_by = $4 WHERE org_id = $1 AND id = $2', [orgId, p.id, ctx.now().toISOString(), actor.userId]);
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId, action: 'project.deleted', objectType: 'project', objectId: String(p.id), detail: { restorableDays: SOFT_DELETE_RESTORE_DAYS } }, ctx.now());
  });
}

export async function undeleteProject(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown) {
  await ctx.db.tx(async (q) => {
    const { orgId } = await requireMember(q, actor, orgIdIn, 'admin');
    const p = await lockProject(q, orgId, projectIdIn, true);
    if (!p.deleted_at) throw badRequest('The project is not deleted');
    const at = new Date(toIso(p.deleted_at) as string).getTime();
    if (ctx.now().getTime() - at > SOFT_DELETE_RESTORE_DAYS * 86400e3) throw new AcctError(410, 'The 30-day restore window has passed');
    await q.query('UPDATE acct_projects SET deleted_at = NULL, deleted_by = NULL WHERE org_id = $1 AND id = $2', [orgId, p.id]);
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId, action: 'project.undeleted', objectType: 'project', objectId: String(p.id) }, ctx.now());
  });
}

// ------------------------------------------------------------------ attachments
const HEX64 = /^[0-9a-f]{64}$/;
function sniffOk(mediaType: string, b: Uint8Array): boolean {
  const starts = (sig: number[]) => sig.every((x, i) => b[i] === x);
  switch (mediaType) {
    case 'application/pdf': return starts([0x25, 0x50, 0x44, 0x46, 0x2d]);
    case 'image/png': return starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case 'image/jpeg': return starts([0xff, 0xd8, 0xff]);
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': return starts([0x50, 0x4b, 0x03, 0x04]);
    case 'text/csv':
    case 'image/vnd.dxf': return !b.subarray(0, 65536).includes(0);
    default: return false;
  }
}
function cleanFilename(f: unknown): string {
  if (typeof f !== 'string') throw badRequest('A file name is required');
  const base = f.split(/[\\/]/).pop()?.replace(/[^\w .()-]/g, '_').trim() ?? '';
  if (!base || base.length > 200) throw badRequest('The file name must be 1 to 200 characters');
  return base;
}

export async function startAttachment(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown, body: { filename?: unknown; mediaType?: unknown; sizeBytes?: unknown; sha256?: unknown }) {
  const filename = cleanFilename(body.filename);
  const mediaType = typeof body.mediaType === 'string' ? body.mediaType : '';
  if (!ATTACHMENT_TYPES[mediaType]) throw new AcctError(415, `This file type is not accepted. Accepted: ${Object.values(ATTACHMENT_TYPES).join(', ')}`);
  const size = body.sizeBytes;
  if (typeof size !== 'number' || !Number.isInteger(size) || size < 1 || size > MAX_ATTACHMENT_BYTES) throw new AcctError(413, 'Attachments must be 1 byte to 15 MB');
  if (typeof body.sha256 !== 'string' || !HEX64.test(body.sha256)) throw badRequest('sha256 (hex) of the file is required');
  const declared = body.sha256;
  return ctx.db.tx(async (q) => {
    const { orgId } = await requireMember(q, actor, orgIdIn, 'engineer');
    const p = await lockProject(q, orgId, projectIdIn);
    const id = randomUUID();
    await q.query(
      `INSERT INTO acct_attachments (id, org_id, project_id, filename, media_type, size_bytes, sha256, status, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'uploading', $8, $9)`,
      [id, orgId, p.id, filename, mediaType, size, declared, actor.userId, ctx.now().toISOString()],
    );
    return { id, chunkBytes: MAX_CHUNK_BYTES, chunks: Math.ceil(size / MAX_CHUNK_BYTES) };
  });
}

async function lockUpload(q: Queryable, orgId: string, actor: Actor, projectIdIn: unknown, attIdIn: unknown) {
  const projectId = assertUuid(projectIdIn);
  const id = assertUuid(attIdIn);
  const a = (await q.query<Record<string, unknown>>(
    "SELECT * FROM acct_attachments WHERE org_id = $1 AND project_id = $2 AND id = $3 AND status = 'uploading' AND created_by = $4 FOR UPDATE",
    [orgId, projectId, id, actor.userId],
  )).rows[0];
  if (!a) throw notFound();
  return a;
}

export async function putAttachmentChunk(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown, attIdIn: unknown, indexIn: unknown, bytes: Uint8Array) {
  const index = Number(indexIn);
  if (!Number.isInteger(index) || index < 0 || index > 10) throw badRequest('Bad chunk index');
  if (bytes.byteLength < 1 || bytes.byteLength > MAX_CHUNK_BYTES) throw new AcctError(413, 'Each chunk must be 1 byte to 3 MB');
  await ctx.db.tx(async (q) => {
    const { orgId } = await requireMember(q, actor, orgIdIn, 'engineer');
    const a = await lockUpload(q, orgId, actor, projectIdIn, attIdIn);
    const have = (await q.query<{ n: number }>('SELECT COALESCE(SUM(length(data)), 0)::int AS n FROM acct_attachment_chunks WHERE attachment_id = $1', [a.id])).rows[0];
    if (Number(have?.n) + bytes.byteLength > Number(a.size_bytes)) throw new AcctError(413, 'More data than the declared size');
    const r = await q.query('INSERT INTO acct_attachment_chunks (attachment_id, idx, data) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING idx', [a.id, index, bytes]);
    if (!r.rows.length) throw new AcctError(409, 'That chunk was already received');
  });
}

export async function completeAttachment(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown, attIdIn: unknown) {
  return ctx.db.tx(async (q) => {
    const { orgId } = await requireMember(q, actor, orgIdIn, 'engineer');
    const a = await lockUpload(q, orgId, actor, projectIdIn, attIdIn);
    const chunks = (await q.query<{ idx: number; data: unknown }>('SELECT idx, data FROM acct_attachment_chunks WHERE attachment_id = $1 ORDER BY idx', [a.id])).rows;
    const parts = chunks.map((c, i) => { if (Number(c.idx) !== i) throw badRequest('A chunk is missing'); return toBytes(c.data); });
    const total = parts.reduce((s, p) => s + p.byteLength, 0);
    if (total !== Number(a.size_bytes)) throw badRequest('The upload is incomplete');
    const all = new Uint8Array(total);
    let off = 0;
    for (const p of parts) { all.set(p, off); off += p.byteLength; }
    const hash = sha256HexNode(all);
    if (hash !== a.sha256) throw badRequest('The file does not match its declared SHA-256; it was not stored');
    if (!sniffOk(String(a.media_type), all)) throw new AcctError(415, 'The file content does not match its declared type');
    await q.query("UPDATE acct_attachments SET data = $2, status = 'complete' WHERE id = $1", [a.id, all]);
    await q.query('DELETE FROM acct_attachment_chunks WHERE attachment_id = $1', [a.id]);
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId, action: 'attachment.added', objectType: 'attachment', objectId: String(a.id), detail: { projectId: String(a.project_id), sha256: hash, sizeBytes: total, mediaType: String(a.media_type) } }, ctx.now());
    return { id: String(a.id), sha256: hash, sizeBytes: total };
  });
}

export async function listAttachments(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown) {
  const { orgId } = await requireMember(ctx.db, actor, orgIdIn, 'viewer');
  const projectId = assertUuid(projectIdIn);
  const r = await ctx.db.query<Record<string, unknown>>(
    `SELECT a.id, a.filename, a.media_type, a.size_bytes, a.sha256, a.created_at FROM acct_attachments a JOIN acct_projects p ON p.id = a.project_id AND p.org_id = a.org_id
     WHERE a.org_id = $1 AND a.project_id = $2 AND a.status = 'complete' AND a.deleted_at IS NULL AND p.deleted_at IS NULL ORDER BY a.created_at`,
    [orgId, projectId],
  );
  return r.rows.map((a) => ({ id: String(a.id), filename: String(a.filename), mediaType: String(a.media_type), sizeBytes: Number(a.size_bytes), sha256: String(a.sha256), createdAt: toIso(a.created_at) }));
}

export async function getAttachment(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown, attIdIn: unknown) {
  const { orgId } = await requireMember(ctx.db, actor, orgIdIn, 'viewer');
  const projectId = assertUuid(projectIdIn);
  const id = assertUuid(attIdIn);
  const a = (await ctx.db.query<Record<string, unknown>>(
    `SELECT a.* FROM acct_attachments a JOIN acct_projects p ON p.id = a.project_id AND p.org_id = a.org_id
     WHERE a.org_id = $1 AND a.project_id = $2 AND a.id = $3 AND a.status = 'complete' AND a.deleted_at IS NULL AND p.deleted_at IS NULL`,
    [orgId, projectId, id],
  )).rows[0];
  if (!a) throw notFound();
  const data = toBytes(a.data);
  if (sha256HexNode(data) !== a.sha256) throw new AcctError(500, 'The stored file does not match its hash');
  return { filename: String(a.filename), mediaType: String(a.media_type), sha256: String(a.sha256), data };
}

export async function deleteAttachment(ctx: Ctx, actor: Actor, orgIdIn: unknown, projectIdIn: unknown, attIdIn: unknown) {
  await ctx.db.tx(async (q) => {
    const { orgId } = await requireMember(q, actor, orgIdIn, 'engineer');
    const projectId = assertUuid(projectIdIn);
    const id = assertUuid(attIdIn);
    const r = await q.query('UPDATE acct_attachments SET deleted_at = $4 WHERE org_id = $1 AND project_id = $2 AND id = $3 AND deleted_at IS NULL RETURNING id', [orgId, projectId, id, ctx.now().toISOString()]);
    if (!r.rows.length) throw notFound();
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId, action: 'attachment.deleted', objectType: 'attachment', objectId: id }, ctx.now());
  });
}

export async function readAudit(ctx: Ctx, actor: Actor, orgIdIn: unknown) {
  const { orgId } = await requireMember(ctx.db, actor, orgIdIn, 'admin');
  const r = await ctx.db.query<Record<string, unknown>>('SELECT seq, at, actor_user_id, action, object_type, object_id, record_hash FROM acct_audit WHERE org_id = $1 ORDER BY seq DESC LIMIT 500', [orgId]);
  return r.rows.map((x) => ({ seq: Number(x.seq), at: toIso(x.at), actorUserId: x.actor_user_id ?? null, action: String(x.action), objectType: String(x.object_type), objectId: String(x.object_id), recordHash: String(x.record_hash) }));
}
