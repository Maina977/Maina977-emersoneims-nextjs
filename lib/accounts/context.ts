/**
 * Shared types for the accounts services: the context every service function
 * receives, the signed-in actor, and the error type routes turn into a status.
 */
import type { AccountsDb, Queryable } from './db';
import type { AccountMailer } from './mailer';
import { canonicalJson } from '@/lib/solar/design/proposalApproval';
import { sha256HexNode } from './crypto';

export interface Ctx {
  db: AccountsDb;
  /** ACCOUNTS_SECRET_KEY (>= 32 characters). */
  secret: string;
  mailer: AccountMailer;
  now: () => Date;
  env: Record<string, string | undefined>;
  /** Origin used in emailed links. */
  origin: string;
}

export interface Actor {
  userId: string;
  email: string;
  /** This session passed the second factor. */
  mfa: boolean;
  totpEnabled: boolean;
  isRegistryAdmin: boolean;
  sessionHash: string;
}

export class AcctError extends Error {
  constructor(public status: number, message: string, public extra?: Record<string, unknown>) {
    super(message);
  }
}
export const notFound = () => new AcctError(404, 'Not found');
export const badRequest = (m: string) => new AcctError(400, m);
export const forbidden = (m = 'Not allowed') => new AcctError(403, m);

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export function assertUuid(id: unknown): string {
  if (typeof id !== 'string' || !UUID_RE.test(id)) throw notFound();
  return id;
}

/** SHA-256 of the canonical JSON of the content (equals proposalRevisionHash for a Solar ProposalInput). */
export function contentSha256(content: unknown): string {
  return sha256HexNode(canonicalJson(content));
}

export type { Queryable };
