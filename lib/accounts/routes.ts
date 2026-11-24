/**
 * The accounts API, as one table (Report B). Every entry runs through
 * lib/accounts/http.ts handle(): flag → configuration → cross-site → session
 * → CSRF → body → errors. Organisation membership, roles, second factor and
 * fresh codes are enforced again inside each service function, so a route
 * entry can never grant access by itself.
 */
import 'server-only';
import { NextResponse } from 'next/server';
import * as auth from './auth';
import * as orgs from './orgs';
import * as projects from './projects';
import * as reviewers from './reviewers';
import * as recovery from './recovery';
import { AcctError, type Actor } from './context';
import { clearSessionCookies, clientIp, json, setSessionCookies, type Call, type RouteSpec } from './http';

const me = (c: Call): Actor => {
  if (!c.actor) throw new AcctError(401, 'Please sign in.');
  return c.actor;
};
const p = (c: Call, k: string) => c.params[k];

type Entry = [method: string, pattern: string, spec: RouteSpec];
const pub = (run: RouteSpec['run']): RouteSpec => ({ session: false, run });
const ses = (run: RouteSpec['run'], binary = false): RouteSpec => ({ session: true, run, binary });

export const ROUTES: Entry[] = [
  // ---- authentication (no session) -------------------------------------------
  ['POST', 'signup', pub((c) => auth.signup(c.ctx, c.body, clientIp(c.request)))],
  ['POST', 'verify-email', pub(async (c) => { await auth.verifyEmail(c.ctx, c.body.token); return { verified: true }; })],
  ['POST', 'login', pub(async (c) => {
    const s = await auth.login(c.ctx, c.body, clientIp(c.request));
    if ('needTotp' in s) return { needTotp: true };
    // The CSRF token is also returned in the body for the page to keep in memory.
    return setSessionCookies(json({ success: true, mfa: s.mfa, csrf: s.csrf }), s);
  })],
  ['POST', 'password/reset-request', pub((c) => auth.requestPasswordReset(c.ctx, c.body.email, clientIp(c.request)))],
  ['POST', 'password/reset', pub(async (c) => { await auth.resetPassword(c.ctx, c.body.token, c.body.password); return { reset: true }; })],

  // ---- session ---------------------------------------------------------------
  ['GET', 'me', ses(async (c) => { const a = me(c); return { user: { id: a.userId, email: a.email, mfa: a.mfa, totpEnabled: a.totpEnabled, isRegistryAdmin: a.isRegistryAdmin } }; })],
  ['POST', 'logout', ses(async (c) => { await auth.logout(c.ctx, me(c)); return clearSessionCookies(json({ success: true })); })],
  ['POST', 'totp/setup', ses((c) => auth.totpSetup(c.ctx, me(c)))],
  // Returns the first recovery codes, shown once.
  ['POST', 'totp/enable', ses(async (c) => ({ totpEnabled: true, ...(await auth.totpEnable(c.ctx, me(c), c.body.code)) }))],

  // ---- authenticator recovery --------------------------------------------------
  ['GET', 'recovery-codes', ses((c) => recovery.recoveryCodesRemaining(c.ctx, me(c)))],
  ['POST', 'recovery-codes', ses((c) => recovery.regenerateRecoveryCodes(c.ctx, me(c), c.body))],
  ['POST', 'totp/reset', ses(async (c) => { await recovery.resetOwnAuthenticator(c.ctx, me(c), c.body); return { totpEnabled: false }; })],
  ['POST', 'registry/users/reset-second-factor', ses((c) => recovery.adminResetSecondFactor(c.ctx, me(c), c.body))],

  // ---- organisations ---------------------------------------------------------
  ['GET', 'orgs', ses(async (c) => ({ orgs: await orgs.listOrgs(c.ctx, me(c)) }))],
  ['POST', 'orgs', ses((c) => orgs.createOrg(c.ctx, me(c), c.body.name))],
  ['GET', 'orgs/:org/members', ses(async (c) => ({ members: await orgs.listMembers(c.ctx, me(c), p(c, 'org')) }))],
  ['POST', 'orgs/:org/invites', ses((c) => orgs.invite(c.ctx, me(c), p(c, 'org'), c.body))],
  ['POST', 'invites/accept', ses((c) => orgs.acceptInvite(c.ctx, me(c), c.body.token))],
  ['POST', 'orgs/:org/members/:user/role', ses((c) => orgs.changeRole(c.ctx, me(c), p(c, 'org'), p(c, 'user'), c.body.role))],
  ['GET', 'orgs/:org/audit', ses(async (c) => ({ audit: await projects.readAudit(c.ctx, me(c), p(c, 'org')) }))],

  // ---- projects and revisions ------------------------------------------------
  ['GET', 'orgs/:org/projects', ses(async (c) => ({ projects: await projects.listProjects(c.ctx, me(c), p(c, 'org'), c.query.get('deleted') === '1') }))],
  ['POST', 'orgs/:org/projects', ses((c) => projects.createProject(c.ctx, me(c), p(c, 'org'), c.body))],
  ['GET', 'orgs/:org/projects/:project', ses((c) => projects.getProject(c.ctx, me(c), p(c, 'org'), p(c, 'project')))],
  ['POST', 'orgs/:org/projects/:project/autosave', ses((c) => projects.autosave(c.ctx, me(c), p(c, 'org'), p(c, 'project'), c.body))],
  ['GET', 'orgs/:org/projects/:project/revisions', ses(async (c) => ({ revisions: await projects.listRevisions(c.ctx, me(c), p(c, 'org'), p(c, 'project')) }))],
  ['GET', 'orgs/:org/projects/:project/revisions/:revision', ses((c) => projects.getRevision(c.ctx, me(c), p(c, 'org'), p(c, 'project'), p(c, 'revision')))],
  ['POST', 'orgs/:org/projects/:project/revisions/:revision/restore', ses((c) => projects.restoreRevision(c.ctx, me(c), p(c, 'org'), p(c, 'project'), p(c, 'revision'), c.body))],
  ['GET', 'orgs/:org/projects/:project/export', ses((c) => projects.exportProject(c.ctx, me(c), p(c, 'org'), p(c, 'project')))],
  ['POST', 'orgs/:org/projects/:project/delete', ses(async (c) => { await projects.softDeleteProject(c.ctx, me(c), p(c, 'org'), p(c, 'project')); return { deleted: true }; })],
  ['POST', 'orgs/:org/projects/:project/undelete', ses(async (c) => { await projects.undeleteProject(c.ctx, me(c), p(c, 'org'), p(c, 'project')); return { deleted: false }; })],

  // ---- attachments -----------------------------------------------------------
  ['GET', 'orgs/:org/projects/:project/attachments', ses(async (c) => ({ attachments: await projects.listAttachments(c.ctx, me(c), p(c, 'org'), p(c, 'project')) }))],
  ['POST', 'orgs/:org/projects/:project/attachments', ses((c) => projects.startAttachment(c.ctx, me(c), p(c, 'org'), p(c, 'project'), c.body))],
  ['PUT', 'orgs/:org/projects/:project/attachments/:attachment/chunks/:index', ses((c) => projects.putAttachmentChunk(c.ctx, me(c), p(c, 'org'), p(c, 'project'), p(c, 'attachment'), p(c, 'index'), c.bytes ?? new Uint8Array()), true)],
  ['POST', 'orgs/:org/projects/:project/attachments/:attachment/complete', ses((c) => projects.completeAttachment(c.ctx, me(c), p(c, 'org'), p(c, 'project'), p(c, 'attachment')))],
  ['GET', 'orgs/:org/projects/:project/attachments/:attachment', ses(async (c) => {
    const a = await projects.getAttachment(c.ctx, me(c), p(c, 'org'), p(c, 'project'), p(c, 'attachment'));
    // Always a download, never rendered in the site's origin; filename sanitised.
    const safe = a.filename.replace(/[^\w.\- ]+/g, '_').slice(0, 120) || 'attachment';
    return new NextResponse(Buffer.from(a.data), {
      status: 200,
      headers: { 'Content-Type': 'application/octet-stream', 'Content-Disposition': `attachment; filename="${safe}"`, 'X-Content-SHA256': a.sha256, 'Content-Security-Policy': "default-src 'none'; sandbox" },
    });
  })],
  ['DELETE', 'orgs/:org/projects/:project/attachments/:attachment', ses(async (c) => { await projects.deleteAttachment(c.ctx, me(c), p(c, 'org'), p(c, 'project'), p(c, 'attachment')); return { deleted: true }; })],

  // ---- reviewers and approvals -----------------------------------------------
  ['GET', 'orgs/:org/reviewers', ses(async (c) => ({ reviewers: await reviewers.listOrgReviewers(c.ctx, me(c), p(c, 'org')) }))],
  ['POST', 'orgs/:org/reviewers', ses((c) => reviewers.registerReviewer(c.ctx, me(c), p(c, 'org'), c.body))],
  ['GET', 'registry/reviewers', ses(async (c) => ({ reviewers: await reviewers.listRegistry(c.ctx, me(c)) }))],
  ['POST', 'registry/reviewers/:reviewer/verify', ses((c) => reviewers.verifyReviewer(c.ctx, me(c), p(c, 'reviewer'), c.body))],
  ['POST', 'registry/reviewers/:reviewer/suspend', ses(async (c) => { await reviewers.suspendReviewer(c.ctx, me(c), p(c, 'reviewer'), c.body.reason); return { suspended: true }; })],
  ['POST', 'orgs/:org/projects/:project/revisions/:revision/approve', ses((c) => reviewers.approveRevision(c.ctx, me(c), p(c, 'org'), p(c, 'project'), p(c, 'revision'), c.body))],
  ['GET', 'orgs/:org/projects/:project/revisions/:revision/approval', ses(async (c) => ({ status: await reviewers.approvalStatus(c.ctx, me(c), p(c, 'org'), p(c, 'project'), p(c, 'revision'), c.query.get('documentType')) }))],
  ['POST', 'orgs/:org/approvals/:approval/revoke', ses(async (c) => { await reviewers.revokeApproval(c.ctx, me(c), p(c, 'org'), p(c, 'approval'), c.body); return { revoked: true }; })],
];

/** Finds the entry for a method and path segments; params from ':name' segments. */
export function matchRoute(method: string, segments: readonly string[]): { spec: RouteSpec; params: Record<string, string> } | null {
  for (const [m, pattern, spec] of ROUTES) {
    if (m !== method) continue;
    const parts = pattern.split('/');
    if (parts.length !== segments.length) continue;
    const params: Record<string, string> = {};
    let ok = true;
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].startsWith(':')) params[parts[i].slice(1)] = segments[i];
      else if (parts[i] !== segments[i]) { ok = false; break; }
    }
    if (ok) return { spec, params };
  }
  return null;
}
