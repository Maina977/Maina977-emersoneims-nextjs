/**
 * Server-issued payment order tokens (security sweep 2026-11-26, H7).
 *
 * /api/payments/mpesa used to take the phone number and the amount from the
 * request, so anyone could send an M-Pesa prompt for any amount to any phone.
 * It now needs an order token that only the server can issue: an HMAC-SHA256
 * over { orderId, amount, exp } with ORDER_TOKEN_SECRET. The amount it carries
 * is the one the server priced (CA-43: priced from the stock file, never from
 * the client), so the payment route never trusts a client amount.
 *
 * ORDER_TOKEN_SECRET is not set by this change (no env change). Until it is
 * set (>= 32 characters) no token can be issued or verified, and the payment
 * route refuses every request: payments stay inactive, as they are today.
 * The token is issued by the order flow once that is approved for commerce;
 * nothing in this branch issues one.
 */
import { createHmac, timingSafeEqual } from 'crypto';

export interface PaymentOrder {
  orderId: string;
  amount: number; // KES, whole shillings, priced by the server
  exp: number; // ms since epoch
}

const ORDER_ID = /^[A-Za-z0-9_-]{1,40}$/;
export const MAX_AMOUNT = 150_000; // Daraja STK limit per transaction

function secret(): string | null {
  const s = process.env.ORDER_TOKEN_SECRET;
  return s && s.length >= 32 ? s : null;
}

const b64 = (buf: Buffer) => buf.toString('base64url');
const sign = (key: string, payload: string) => createHmac('sha256', key).update(`order-token.v1.${payload}`).digest();

function validOrder(o: unknown): o is PaymentOrder {
  if (!o || typeof o !== 'object') return false;
  const { orderId, amount, exp } = o as Record<string, unknown>;
  return typeof orderId === 'string' && ORDER_ID.test(orderId)
    && typeof amount === 'number' && Number.isInteger(amount) && amount >= 1 && amount <= MAX_AMOUNT
    && typeof exp === 'number' && Number.isFinite(exp);
}

/** Issue a token for a server-priced order; null when the secret is not configured or the order is invalid. */
export function issueOrderToken(order: PaymentOrder): string | null {
  const key = secret();
  if (!key || !validOrder(order)) return null;
  const payload = b64(Buffer.from(JSON.stringify({ orderId: order.orderId, amount: order.amount, exp: order.exp })));
  return `v1.${payload}.${b64(sign(key, payload))}`;
}

/** Verify a token: signature (constant time), shape and expiry. Null for anything else. */
export function verifyOrderToken(token: unknown, now = Date.now()): PaymentOrder | null {
  const key = secret();
  if (!key || typeof token !== 'string' || token.length > 600) return null;
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'v1') return null;
  const [, payload, sig] = parts;
  let given: Buffer;
  try { given = Buffer.from(sig, 'base64url'); } catch { return null; }
  const expected = sign(key, payload);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  let order: unknown;
  try { order = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')); } catch { return null; }
  if (!validOrder(order) || order.exp <= now) return null;
  return { orderId: order.orderId, amount: order.amount, exp: order.exp };
}
