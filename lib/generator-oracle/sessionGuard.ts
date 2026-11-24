/**
 * ACCESS CONTROL FOR GENERATOR ORACLE ACCOUNT ROUTES (security review, 2026-11-24).
 *
 * Several routes accepted a userId from the URL or body and acted on it with
 * no sign-in: anyone could read a user's payment history or usage, cancel
 * their subscription, start an M-Pesa prompt to any phone, or bind a push
 * subscription to another user. These helpers make every such route act only
 * for the signed-in user (the oracle_session cookie, checked by validateSession).
 */
import { NextResponse, type NextRequest } from 'next/server';
import { validateSession, type OracleUser } from './authService';

/** The signed-in, active Oracle user, or null. */
export async function sessionUser(request: NextRequest): Promise<OracleUser | null> {
  const token = request.cookies.get('oracle_session')?.value;
  if (!token) return null;
  const r = await validateSession(token);
  return r.success && r.user ? r.user : null;
}

/**
 * Resolves the user a request may act for: the signed-in user. A userId in
 * the request is accepted only if it IS the signed-in user (old clients send
 * it); any other value is refused, never acted on.
 */
export async function actingUserId(request: NextRequest, claimed: unknown): Promise<{ id: number } | { response: NextResponse }> {
  const user = await sessionUser(request);
  if (!user) return { response: NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 }) };
  if (claimed !== undefined && claimed !== null && claimed !== '' && Number(claimed) !== Number(user.id)) {
    return { response: NextResponse.json({ success: false, error: 'You can only act for your own account' }, { status: 403 }) };
  }
  return { id: Number(user.id) };
}
