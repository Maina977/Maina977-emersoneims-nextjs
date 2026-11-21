/**
 * Database access for accounts (server only).
 *
 * One small interface over node-postgres (preview: its OWN database from
 * ACCOUNTS_DATABASE_URL, never DATABASE_URL) and PGlite (tests). Every
 * statement is parameterised; no SQL is ever built from user input.
 *
 * Migrations are NOT run here: they are applied only by scripts/db/migrate.cjs
 * (and by the tests, on PGlite).
 */
import 'server-only';
import { accountsDatabaseUrl } from './config';

export type Row = Record<string, unknown>;
export interface Queryable {
  query<T extends Row = Row>(text: string, params?: unknown[]): Promise<{ rows: T[] }>;
}
export interface AccountsDb extends Queryable {
  /** Runs fn in one transaction (BEGIN ... COMMIT, ROLLBACK on error). */
  tx<T>(fn: (q: Queryable) => Promise<T>): Promise<T>;
}

type PgClient = Queryable & { release: () => void };
type PgPool = Queryable & { connect: () => Promise<PgClient> };

export function fromPgPool(pool: PgPool): AccountsDb {
  return {
    query: (text, params) => pool.query(text, params),
    async tx(fn) {
      const c = await pool.connect();
      try {
        await c.query('BEGIN');
        const out = await fn(c);
        await c.query('COMMIT');
        return out;
      } catch (e) {
        await c.query('ROLLBACK').catch(() => undefined);
        throw e;
      } finally {
        c.release();
      }
    },
  };
}

/** PGlite (tests): structural type so the WASM package is never imported by the app. */
interface PgliteLike {
  query<T>(text: string, params?: unknown[]): Promise<{ rows: T[] }>;
  transaction<T>(fn: (tx: { query<U>(text: string, params?: unknown[]): Promise<{ rows: U[] }> }) => Promise<T>): Promise<T>;
}
export function fromPglite(pg: PgliteLike): AccountsDb {
  let chain: Promise<unknown> = Promise.resolve();
  // PGlite is a single connection: serialise statements and transactions so
  // concurrent requests in a test behave like separate pooled connections.
  const serial = <T>(fn: () => Promise<T>): Promise<T> => {
    const run = chain.then(fn, fn);
    chain = run.catch(() => undefined);
    return run;
  };
  return {
    query: <T extends Row>(text: string, params?: unknown[]) => serial(() => pg.query<T>(text, params)),
    tx: (fn) => serial(() => pg.transaction((t) => fn({ query: <T extends Row>(text: string, params?: unknown[]) => t.query<T>(text, params) }))),
  };
}

let override: AccountsDb | null = null;
/** Tests only: route every accounts query to this database (PGlite). */
export function setAccountsDbForTests(db: AccountsDb | null): void {
  override = db;
}

let pool: { url: string; db: AccountsDb } | null = null;
/**
 * The accounts database, or null when ACCOUNTS_DATABASE_URL is not set (fail
 * closed: routes answer 503 with NO_ACCOUNTS_DATABASE). No fallback to
 * DATABASE_URL, ever.
 */
export async function getAccountsDb(env: Record<string, string | undefined> = process.env): Promise<AccountsDb | null> {
  if (override) return override;
  const url = accountsDatabaseUrl(env);
  if (!url) return null;
  if (pool && pool.url === url) return pool.db;
  const pg = (await import('pg')) as unknown as { Pool: new (c: Record<string, unknown>) => PgPool };
  const p = new pg.Pool({ connectionString: url, max: 5, idleTimeoutMillis: 30000, connectionTimeoutMillis: 10000, ssl: /sslmode=disable/.test(url) ? false : { rejectUnauthorized: true } });
  pool = { url, db: fromPgPool(p) };
  return pool.db;
}

/** Bytes from a bytea column (pg gives a Buffer, PGlite a Uint8Array). */
export function toBytes(v: unknown): Uint8Array {
  if (v instanceof Uint8Array) return v;
  throw new Error('Expected bytea');
}
export function toIso(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  return (v instanceof Date ? v : new Date(String(v))).toISOString();
}
