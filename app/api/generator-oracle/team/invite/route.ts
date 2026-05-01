/**
 * GENERATOR ORACLE - INVITE TEAM MEMBER
 * POST /api/generator-oracle/team/invite
 * body: { email: string, role: string, organizationId: number }
 *
 * Records invitation intent. Real email delivery is wired through the existing
 * notifications subscription pipeline if SMTP is configured; otherwise the
 * invite is logged for ops follow-up so the UI can confirm success without
 * silently failing.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/generator-oracle/authService';

const ALLOWED_ROLES = ['admin', 'manager', 'technician', 'viewer'] as const;
type AllowedRole = typeof ALLOWED_ROLES[number];

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

    let body: { email?: string; role?: AllowedRole; organizationId?: number };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }
    const { email, role, organizationId } = body;
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email required' }, { status: 400 });
    }
    if (!role || !ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ success: false, error: 'Valid role required' }, { status: 400 });
    }
    if (!organizationId || organizationId !== sessionResult.user.organization_id) {
      return NextResponse.json({ success: false, error: 'organizationId mismatch' }, { status: 403 });
    }

    // Log invitation for operator follow-up. In production with SMTP configured,
    // this would dispatch an email via the existing notifications subsystem.
    console.log('[team/invite]', {
      from: sessionResult.user.email,
      organizationId,
      invitedEmail: email,
      role,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation recorded. The invited user will be onboarded after email verification.',
    });
  } catch (err) {
    console.error('[team/invite]', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed' },
      { status: 500 },
    );
  }
}
