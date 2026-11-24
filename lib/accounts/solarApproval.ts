/**
 * Solar Genius Pro proposals ↔ verified, revision-specific approvals (Report B).
 *
 * The proposal route (app/api/solar/proposal) still refuses any approval sent
 * by the client. This module looks up, SERVER-SIDE, an approval of this exact
 * proposal input (by its revision hash) made by a verified, in-date, in-scope
 * reviewer of an organisation the signed-in user belongs to, re-checked from
 * scratch (lib/accounts/reviewers.ts solarProposalApproval), and returns the
 * verifier and approval for buildProposal.
 *
 * Fails closed. Any of the following leaves the proposal exactly as today
 * (DRAFT): accounts off (always off in production); no accounts database or
 * secret; no session; no verified reviewer anywhere; no approval of this
 * exact input; any error.
 */
import 'server-only';
import type { NextRequest } from 'next/server';
import { proposalRevisionHash, type ApprovalVerifier, type VerifiedApproval } from '@/lib/solar/design/proposalApproval';
import { accountsEnabled, accountsSecret, SESSION_COOKIE } from './config';
import { getAccountsDb } from './db';
import { resolveMailer } from './testMail';
import { sessionActor } from './auth';
import { solarProposalApproval } from './reviewers';
import type { Ctx } from './context';
import { previewDatabaseConfirmed } from './identity';

export interface SolarApprovalLookup { verifier: ApprovalVerifier | null; verifiedApproval: VerifiedApproval | null }
const NONE: SolarApprovalLookup = { verifier: null, verifiedApproval: null };

export async function solarApprovalFor(request: NextRequest, input: object, env: Record<string, string | undefined> = process.env): Promise<SolarApprovalLookup> {
  if (!accountsEnabled(env)) return NONE;
  try {
    const db = await getAccountsDb(env);
    const secret = accountsSecret(env);
    if (!db || !secret) return NONE;
    if (!(await previewDatabaseConfirmed(db, env)).ok) return NONE;
    const ctx: Ctx = { db, secret, mailer: resolveMailer(env, db), now: () => new Date(), env, origin: new URL(request.url).origin };
    const actor = await sessionActor(ctx, request.cookies.get(SESSION_COOKIE)?.value);
    const found = await solarProposalApproval(ctx, actor, proposalRevisionHash(input));
    return found ?? NONE;
  } catch (e) {
    console.error('[accounts] solar approval lookup failed; proposal stays DRAFT', e instanceof Error ? e.name : 'unknown');
    return NONE;
  }
}
