/**
 * GENERATOR ORACLE - DEACTIVATE TEAM MEMBER
 * POST /api/generator-oracle/team/deactivate
 * body: { userId: number }
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSession, deactivateUser } from '@/lib/generator-oracle/authService';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('oracle_session')?.value;
    const sessionResult = sessionToken ? await validateSession(sessionToken) : { success: false };

    if (!sessionResult.success || !sessionResult.user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    if (sessionResult.user.role !== 'admin' && sessionResult.user.role !== 'manager') {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    let body: { userId?: number };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }
    const { userId } = body;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }
    if (userId === sessionResult.user.id) {
      return NextResponse.json({ success: false, error: 'Cannot deactivate yourself' }, { status: 400 });
    }

    const ok = await deactivateUser(userId);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Deactivation failed (database unavailable)' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[team/deactivate]', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed' },
      { status: 500 },
    );
  }
}
