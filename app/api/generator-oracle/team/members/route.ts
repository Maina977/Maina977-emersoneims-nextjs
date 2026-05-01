/**
 * GENERATOR ORACLE - TEAM MEMBERS LIST
 * GET /api/generator-oracle/team/members?orgId=<id>
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSession, getOrganizationMembers } from '@/lib/generator-oracle/authService';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('oracle_session')?.value;
    const sessionResult = sessionToken ? await validateSession(sessionToken) : { success: false };

    const orgIdParam = new URL(request.url).searchParams.get('orgId');
    const orgId = orgIdParam ? parseInt(orgIdParam, 10) : NaN;

    if (!orgId || Number.isNaN(orgId)) {
      return NextResponse.json({ success: false, error: 'orgId required', members: [] }, { status: 400 });
    }

    // Permission gate: must be authenticated & in same org
    if (!sessionResult.success || !sessionResult.user) {
      return NextResponse.json({ success: false, error: 'Not authenticated', members: [] }, { status: 401 });
    }
    if (sessionResult.user.organization_id !== orgId) {
      return NextResponse.json({ success: false, error: 'Forbidden', members: [] }, { status: 403 });
    }

    const members = await getOrganizationMembers(orgId);
    // If DB is unavailable, fallback to showing the requesting user as the sole member
    if (members.length === 0) {
      return NextResponse.json({ success: true, members: [sessionResult.user] });
    }
    return NextResponse.json({ success: true, members });
  } catch (err) {
    console.error('[team/members]', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed', members: [] },
      { status: 500 },
    );
  }
}
