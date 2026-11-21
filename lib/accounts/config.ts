/**
 * Accounts configuration and fixed policy values.
 *
 * The whole feature is behind the SERVER-SIDE flag ACCOUNTS_ENABLED. It is off
 * unless the variable is exactly "true". With it off every accounts route
 * answers 404 and no account UI is rendered.
 *
 * PRODUCTION HARD-OFF (management, 2026-11-22): accounts run only in the
 * isolated preview for controlled internal testing. When VERCEL_ENV is
 * "production" the feature is off even if someone sets the flag.
 */
export function accountsEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.ACCOUNTS_ENABLED === 'true' && env.VERCEL_ENV !== 'production';
}

/**
 * The accounts database: ONLY ACCOUNTS_DATABASE_URL. There is deliberately no
 * fallback to DATABASE_URL / POSTGRES_URL, so the accounts code can never
 * reach the production database.
 */
export function accountsDatabaseUrl(env: Record<string, string | undefined> = process.env): string | null {
  const u = (env.ACCOUNTS_DATABASE_URL ?? '').trim();
  return /^postgres(ql)?:\/\//.test(u) ? u : null;
}
export const NO_ACCOUNTS_DATABASE =
  'Accounts are not available: ACCOUNTS_DATABASE_URL is not set. The accounts feature never uses DATABASE_URL.';

/** Server secret for encrypting TOTP seeds and anchoring the audit head. Missing → accounts answer 503. */
export function accountsSecret(env: Record<string, string | undefined> = process.env): string | null {
  const k = env.ACCOUNTS_SECRET_KEY ?? '';
  return k.length >= 32 ? k : null;
}

export const ROLES = ['owner', 'admin', 'engineer', 'viewer'] as const;
export type Role = (typeof ROLES)[number];
const RANK: Record<Role, number> = { viewer: 0, engineer: 1, admin: 2, owner: 3 };
export const atLeast = (role: Role, min: Role) => RANK[role] >= RANK[min];
/** Roles that must use the second factor (plus the reviewer capability and registry admins). */
export const MFA_ROLES: readonly Role[] = ['owner', 'admin'];

export const TOOLS = ['solar', 'oracle', 'building', 'aquascan'] as const;
export type Tool = (typeof TOOLS)[number];

/**
 * Documents a verified reviewer may approve, per tool. AquaScan has none:
 * nothing in it is offered for approval.
 */
export const APPROVABLE: Record<Tool, readonly string[]> = {
  solar: ['proposal'],
  oracle: ['service-signoff'],
  building: ['boq-certification'],
  aquascan: [],
};

/**
 * Professional bodies a reviewer profile may name. BUSINESS DECISION PENDING:
 * management must confirm which bodies (and which registration classes) are
 * accepted for which documents. Listing a body here verifies nothing: only a
 * registry admin's documented check does.
 */
export const PROFESSIONAL_BODIES = ['EBK', 'EPRA', 'BORAQS', 'WRA', 'NCA'] as const;

export const SESSION_ABSOLUTE_MS = 12 * 3600e3;
export const SESSION_IDLE_MS = 2 * 3600e3;
export const LOCKOUT_THRESHOLD = 5;
export const LOCKOUT_MS = 15 * 60e3;
export const LOGIN_PER_IP_PER_15MIN = 30;
export const TOKEN_TTL_MS = { verify_email: 24 * 3600e3, reset_password: 3600e3, invite: 7 * 24 * 3600e3 } as const;
export const SOFT_DELETE_RESTORE_DAYS = 30;

/** Vercel serverless functions accept at most 4.5 MB per request body. */
export const MAX_JSON_BODY = 4_000_000;
export const MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024;
export const MAX_CHUNK_BYTES = 3 * 1024 * 1024;
export const MAX_PROJECT_CONTENT_BYTES = 3_500_000;

/** Attachment media types allowed (drawings, lab sheets). */
export const ATTACHMENT_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/vnd.dxf': 'dxf',
  'text/csv': 'csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
};

export const SESSION_COOKIE = '__Host-eims_session';
export const CSRF_COOKIE = '__Host-eims_csrf';
export const CSRF_HEADER = 'x-csrf-token';

export const GENERIC_LOGIN_ERROR = 'Sign-in failed. Check your email and password, or try again later.';
export const GENERIC_NOT_FOUND = 'Not found';
