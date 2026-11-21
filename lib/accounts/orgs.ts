/**
 * Organisations, memberships, roles and invitations.
 *
 * requireMember is the gate for EVERY organisation-scoped call: it looks the
 * membership up by (org_id, user_id) in SQL and answers 404 for a stranger, so
 * another organisation's existence is not revealed. Owners and admins must
 * have passed the second factor in this session.
 */
import 'server-only';
import { randomUUID } from 'node:crypto';
import { appendAudit } from './audit';
import { atLeast, MFA_ROLES, ROLES, type Role } from './config';
import { AcctError, assertUuid, badRequest, forbidden, notFound, type Actor, type Ctx, type Queryable } from './context';
import { consumeToken, issueToken, normaliseEmail } from './auth';
import { sha256HexNode } from './crypto';

export async function requireMember(q: Queryable, actor: Actor, orgIdIn: unknown, min: Role = 'viewer'): Promise<{ orgId: string; role: Role }> {
  const orgId = assertUuid(orgIdIn);
  const r = (await q.query<{ role: Role }>('SELECT role FROM acct_memberships WHERE org_id = $1 AND user_id = $2', [orgId, actor.userId])).rows[0];
  if (!r) throw notFound();
  if (MFA_ROLES.includes(r.role) && !actor.mfa) throw new AcctError(403, 'Your role needs the second factor: set up an authenticator app and sign in with it.', { needMfa: true });
  if (!atLeast(r.role, min)) throw forbidden();
  return { orgId, role: r.role };
}

const cleanName = (n: unknown, what: string) => {
  if (typeof n !== 'string' || !n.trim() || n.trim().length > 200) throw badRequest(`${what} must be 1 to 200 characters`);
  return n.trim();
};

export async function createOrg(ctx: Ctx, actor: Actor, nameIn: unknown) {
  const name = cleanName(nameIn, 'The organisation name');
  const id = randomUUID();
  await ctx.db.tx(async (q) => {
    await q.query('INSERT INTO acct_orgs (id, name, created_by, created_at) VALUES ($1, $2, $3, $4)', [id, name, actor.userId, ctx.now().toISOString()]);
    await q.query('INSERT INTO acct_memberships (org_id, user_id, role, created_at) VALUES ($1, $2, $3, $4)', [id, actor.userId, 'owner', ctx.now().toISOString()]);
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId: id, action: 'org.created', objectType: 'org', objectId: id }, ctx.now());
  });
  return { id, name, role: 'owner' as Role };
}

export async function listOrgs(ctx: Ctx, actor: Actor) {
  const r = await ctx.db.query<{ id: string; name: string; role: Role }>(
    'SELECT o.id, o.name, m.role FROM acct_memberships m JOIN acct_orgs o ON o.id = m.org_id WHERE m.user_id = $1 ORDER BY o.name',
    [actor.userId],
  );
  return r.rows;
}

export async function listMembers(ctx: Ctx, actor: Actor, orgIdIn: unknown) {
  const { orgId } = await requireMember(ctx.db, actor, orgIdIn, 'viewer');
  return (await ctx.db.query<{ user_id: string; email: string; display_name: string; role: Role }>(
    'SELECT m.user_id, u.email, u.display_name, m.role FROM acct_memberships m JOIN acct_users u ON u.id = m.user_id WHERE m.org_id = $1 ORDER BY u.email',
    [orgId],
  )).rows;
}

/** Admins may grant engineer or viewer; only owners may grant admin or owner. */
function mayGrant(mine: Role, target: Role) {
  return mine === 'owner' || (mine === 'admin' && (target === 'engineer' || target === 'viewer'));
}
const asRole = (r: unknown): Role => {
  if (typeof r !== 'string' || !(ROLES as readonly string[]).includes(r)) throw badRequest('Unknown role');
  return r as Role;
};

export async function invite(ctx: Ctx, actor: Actor, orgIdIn: unknown, body: { email?: unknown; role?: unknown }) {
  const email = normaliseEmail(body.email);
  const role = asRole(body.role);
  const token = await ctx.db.tx(async (q) => {
    const { orgId, role: mine } = await requireMember(q, actor, orgIdIn, 'admin');
    if (!mayGrant(mine, role)) throw forbidden('Your role cannot invite with that role');
    const t = await issueToken(q, ctx, { purpose: 'invite', orgId, email, role, createdBy: actor.userId });
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId, action: 'member.invited', objectType: 'invitation', objectId: orgId, detail: { role, emailSha256: sha256HexNode(email) } }, ctx.now());
    return t;
  });
  await ctx.mailer.send({ to: email, kind: 'invite', subject: 'You are invited to an EmersonEIMS organisation', text: `Sign in or create an account with this address, then open ${ctx.origin}/accounts?view=invite&token=${token}. The link works once and expires in 7 days.` });
  return { message: 'Invitation sent.' };
}

export async function acceptInvite(ctx: Ctx, actor: Actor, token: unknown) {
  return ctx.db.tx(async (q) => {
    // A wrong account throws below, which rolls the transaction back: the invitation is not used up.
    const t = await consumeToken(q, ctx, token, 'invite');
    if (!t?.org_id || !t.role || t.email !== actor.email) throw badRequest('This invitation is not valid for this account, or has expired.');
    await q.query(
      'INSERT INTO acct_memberships (org_id, user_id, role, created_at) VALUES ($1, $2, $3, $4) ON CONFLICT (org_id, user_id) DO NOTHING',
      [t.org_id, actor.userId, asRole(t.role), ctx.now().toISOString()],
    );
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId: t.org_id, action: 'member.joined', objectType: 'membership', objectId: actor.userId, detail: { role: t.role } }, ctx.now());
    return { orgId: t.org_id, role: t.role };
  });
}

export async function changeRole(ctx: Ctx, actor: Actor, orgIdIn: unknown, userIdIn: unknown, roleIn: unknown) {
  const role = asRole(roleIn);
  const userId = assertUuid(userIdIn);
  await ctx.db.tx(async (q) => {
    const { orgId, role: mine } = await requireMember(q, actor, orgIdIn, 'admin');
    const cur = (await q.query<{ role: Role }>('SELECT role FROM acct_memberships WHERE org_id = $1 AND user_id = $2 FOR UPDATE', [orgId, userId])).rows[0];
    if (!cur) throw notFound();
    if (!mayGrant(mine, role) || !mayGrant(mine, cur.role)) throw forbidden('Your role cannot make that change');
    if (cur.role === 'owner' && role !== 'owner') {
      const owners = (await q.query<{ n: number }>("SELECT COUNT(*)::int AS n FROM acct_memberships WHERE org_id = $1 AND role = 'owner'", [orgId])).rows[0];
      if (Number(owners?.n) <= 1) throw badRequest('An organisation must keep at least one owner');
    }
    await q.query('UPDATE acct_memberships SET role = $3 WHERE org_id = $1 AND user_id = $2', [orgId, userId, role]);
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId, action: 'member.role_changed', objectType: 'membership', objectId: userId, detail: { from: cur.role, to: role } }, ctx.now());
  });
}
