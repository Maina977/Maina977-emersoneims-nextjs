/**
 * GENERATOR ORACLE - UPDATE TEAM MEMBER ROLE
 * POST /api/generator-oracle/team/update-role
 * body: { userId: number, role: 'admin'|'manager'|'technician'|'viewer' }
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSession, updateUserRole } from '@/lib/generator-oracle/authService';

const ALLOWED_ROLES = ['admin', 'manager', 'technician', 'viewer'] as const;
type AllowedRole = typeof ALLOWED_ROLES[number];

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('oracle_session')?.value;
    const sessionResult = sessionToken ? await validateSession(sessionToken) : { success: false };

    if (!sessionResult.success || !sessionResult.user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const updaterRole = sessionResult.user.role;
    if (updaterRole !== 'admin' && updaterRole !== 'manager') {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    let body: { userId?: number; role?: AllowedRole };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }
    const { userId, role } = body;
    if (!userId || !role || !ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ success: false, error: 'userId and valid role required' }, { status: 400 });
    }

    const ok = await updateUserRole(userId, role, sessionResult.user.id);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Update failed (database unavailable or permission denied)' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[team/update-role]', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed' },
      { status: 500 },
    );
  }
}
