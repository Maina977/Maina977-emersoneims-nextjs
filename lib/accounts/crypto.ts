/**
 * Accounts cryptography (server only), all from node:crypto. No third-party
 * code and no external identity provider.
 *
 * - Passwords: scrypt, N = 2^15, r = 8, p = 1, 16-byte random salt per user,
 *   64-byte key. Stored as `scrypt$N$r$p$<salt b64>$<hash b64>`.
 * - Tokens: 32 random bytes (256 bits), base64url. Only SHA-256 is stored.
 * - TOTP: RFC 6238 (HMAC-SHA1, 30 s steps, 6 digits), +-1 step of drift.
 * - Secrets at rest (the TOTP seed): AES-256-GCM under a key derived from
 *   ACCOUNTS_SECRET_KEY.
 */
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

export const SCRYPT_N = 2 ** 15;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 64;
const MAXMEM = 128 * SCRYPT_N * SCRYPT_R * 2;

function scryptAsync(password: string, salt: Buffer, n: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize('NFKC'), salt, KEY_LEN, { N: n, r, p, maxmem: Math.max(MAXMEM, 128 * n * r * 2) }, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, SCRYPT_N, SCRYPT_R, SCRYPT_P);
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString('base64')}$${key.toString('base64')}`;
}

/** Constant-time check. A malformed or disabled ('!') hash never matches. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const n = Number(parts[1]), r = Number(parts[2]), p = Number(parts[3]);
  if (!Number.isInteger(n) || n < SCRYPT_N || !Number.isInteger(r) || !Number.isInteger(p)) return false;
  const salt = Buffer.from(parts[4], 'base64');
  const expected = Buffer.from(parts[5], 'base64');
  if (salt.length < 16 || expected.length !== KEY_LEN) return false;
  const key = await scryptAsync(password, salt, n, r, p);
  return timingSafeEqual(key, expected);
}

/** A fixed hash used when the account does not exist, so timing does not reveal that. */
let dummyHash: Promise<string> | null = null;
export async function burnPasswordCheck(password: string): Promise<void> {
  dummyHash ??= hashPassword('dummy-password-for-timing');
  await verifyPassword(password, await dummyHash);
}

export function randomToken(): string {
  return randomBytes(32).toString('base64url');
}
export function sha256HexNode(s: string | Uint8Array): string {
  return createHash('sha256').update(s).digest('hex');
}
export function hmacHex(key: string, s: string): string {
  return createHmac('sha256', key).update(s).digest('hex');
}
export function safeEqualStr(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

// ------------------------------------------------------------------ secrets at rest
function aesKey(secret: string): Buffer {
  return createHash('sha256').update(`emersoneims-accounts-aes|${secret}`).digest();
}
export function encryptSecret(plain: string, secret: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', aesKey(secret), iv);
  const body = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
  return `v1.${iv.toString('base64url')}.${c.getAuthTag().toString('base64url')}.${body.toString('base64url')}`;
}
export function decryptSecret(enc: string, secret: string): string | null {
  const parts = enc.split('.');
  if (parts.length !== 4 || parts[0] !== 'v1') return null;
  try {
    const d = createDecipheriv('aes-256-gcm', aesKey(secret), Buffer.from(parts[1], 'base64url'));
    d.setAuthTag(Buffer.from(parts[2], 'base64url'));
    return Buffer.concat([d.update(Buffer.from(parts[3], 'base64url')), d.final()]).toString('utf8');
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------ TOTP (RFC 6238)
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function base32Encode(buf: Uint8Array): string {
  let bits = 0, value = 0, out = '';
  for (const b of buf) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) { out += B32[(value >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}
export function base32Decode(s: string): Buffer {
  const clean = s.toUpperCase().replace(/[\s=]/g, '');
  let bits = 0, value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const v = B32.indexOf(ch);
    if (v < 0) throw new Error('Invalid base32');
    value = (value << 5) | v;
    bits += 5;
    if (bits >= 8) { out.push((value >>> (bits - 8)) & 255); bits -= 8; }
  }
  return Buffer.from(out);
}

export const TOTP_STEP_SECONDS = 30;
export function totpStep(nowMs: number): number {
  return Math.floor(nowMs / 1000 / TOTP_STEP_SECONDS);
}
/** HOTP value (RFC 4226) for a counter, `digits` long. */
export function hotp(secret: Buffer, counter: number, digits = 6): string {
  const msg = Buffer.alloc(8);
  msg.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  msg.writeUInt32BE(counter >>> 0, 4);
  const h = createHmac('sha1', secret).update(msg).digest();
  const off = h[h.length - 1] & 15;
  const bin = ((h[off] & 0x7f) << 24) | (h[off + 1] << 16) | (h[off + 2] << 8) | h[off + 3];
  return String(bin % 10 ** digits).padStart(digits, '0');
}
export function totpCode(secretB32: string, nowMs: number, digits = 6): string {
  return hotp(base32Decode(secretB32), totpStep(nowMs), digits);
}
export function newTotpSecret(): string {
  return base32Encode(randomBytes(20));
}
/**
 * The matching step (current, previous or next), or null. The caller must
 * also refuse a step at or before the last one used (replay).
 */
export function matchTotp(secretB32: string, code: string, nowMs: number): number | null {
  if (!/^[0-9]{6}$/.test(code)) return null;
  const secret = base32Decode(secretB32);
  const step = totpStep(nowMs);
  for (const s of [step, step - 1, step + 1]) {
    if (safeEqualStr(hotp(secret, s), code)) return s;
  }
  return null;
}
export function otpauthUri(secretB32: string, account: string): string {
  return `otpauth://totp/${encodeURIComponent(`EmersonEIMS:${account}`)}?secret=${secretB32}&issuer=EmersonEIMS&algorithm=SHA1&digits=6&period=30`;
}
