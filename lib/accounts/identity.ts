/**
 * DATABASE IDENTITY (Report B database setup approval, safeguards 2, 4 and 8).
 *
 * Accounts run ONLY against a database the owner has marked 'preview'
 * (acct_database_identity, migration 005), and never when ACCOUNTS_DATABASE_URL
 * equals the production DATABASE_URL / POSTGRES_URL. The recovery drill needs
 * its source marked 'preview' and its target marked 'dr-test'. A production
 * database has no such table, so it can never qualify, even if a setting were
 * pointed at it by mistake. Fails closed: any error = not confirmed.
 */
import 'server-only';
import { accountsDatabaseUrl } from './config';
import type { AccountsDb, Queryable } from './db';

export type DatabaseRole = 'preview' | 'dr-test';

/** The owner-set role of this database, or null (no table, no row, or any error). */
export async function databaseRole(q: Queryable): Promise<DatabaseRole | null> {
  try {
    const r = (await q.query<{ role: string }>('SELECT role FROM acct_database_identity WHERE singleton = TRUE')).rows[0];
    return r?.role === 'preview' || r?.role === 'dr-test' ? r.role : null;
  } catch {
    return null;
  }
}

export function productionDatabaseUrl(env: Record<string, string | undefined>): string {
  return (env.DATABASE_URL ?? env.POSTGRES_URL ?? '').trim();
}

// Only a confirmed 'preview' is remembered (one minute per connection pool); a refusal is re-checked every request.
const confirmedAt = new WeakMap<AccountsDb, number>();
const CACHE_MS = 60_000;

/** Is this the owner-marked preview database (and not the production URL)? */
export async function previewDatabaseConfirmed(db: AccountsDb, env: Record<string, string | undefined>): Promise<{ ok: true } | { ok: false; reason: string }> {
  const url = accountsDatabaseUrl(env);
  const prod = productionDatabaseUrl(env);
  if (url && prod && url === prod) return { ok: false, reason: 'Accounts are not available: the accounts database is the production database. Refused.' };
  const at = confirmedAt.get(db);
  if (at !== undefined && Date.now() - at < CACHE_MS) return { ok: true };
  if ((await databaseRole(db)) !== 'preview') {
    confirmedAt.delete(db);
    return { ok: false, reason: 'Accounts are not available: this database is not marked as the preview database (acct_database_identity).' };
  }
  confirmedAt.set(db, Date.now());
  return { ok: true };
}
