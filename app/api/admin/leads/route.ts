/**
 * Lead pipeline for the owner's team (master brief §10, audit §7).
 *
 * GET   -> counts per stage + the 100 most recent leads (optional ?status=)
 * PATCH -> move one lead to another stage / add notes / values. Never deletes.
 *
 * Admin only (lib/auth/adminRequest: Bearer ADMIN_API_KEY or the admin_session
 * cookie); anyone else gets a plain 404, matching middleware. Cookie-authorised
 * PATCHes must come from this site (Origin check) on top of SameSite=Strict.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getPostgresPool } from '@/lib/db';
import { isAdminRequest, adminNotFound } from '@/lib/auth/adminRequest';
import { LEAD_STAGES, isLeadStage, parseLeadUpdate, buildLeadUpdateSql } from '@/lib/leads/stages';
import { leadReference } from '@/lib/leads/reference';

export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'private, no-store' };

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return adminNotFound();
  const pool = await getPostgresPool();
  if (!pool) return NextResponse.json({ ok: false, error: 'Database not available' }, { status: 503, headers: noStore });

  const status = request.nextUrl.searchParams.get('status');
  const filter = status && isLeadStage(status) ? status : null;
  try {
    const counts = await pool.query('SELECT status, COUNT(*)::int AS n FROM leads GROUP BY status');
    const rows = await pool.query(
      `SELECT id, created_at, name, phone, email, company, service, source, location, status, notes, assigned_to,
              estimated_value, actual_value
         FROM leads ${filter ? 'WHERE status = $1' : ''}
        ORDER BY created_at DESC LIMIT 100`,
      filter ? [filter] : [],
    );
    return NextResponse.json(
      {
        ok: true,
        stages: LEAD_STAGES,
        counts: Object.fromEntries(counts.rows.map((r) => [String(r.status), Number(r.n)])),
        leads: rows.rows.map((r) => ({ ...r, reference: leadReference(r.id) })),
      },
      { headers: noStore },
    );
  } catch (e) {
    console.error('admin/leads GET failed:', e);
    return NextResponse.json({ ok: false, error: 'Query failed' }, { status: 500, headers: noStore });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) return adminNotFound();
  // Cookie sessions: require a same-site Origin. Bearer (server-to-server) calls carry no cookie.
  const usesCookie = !(request.headers.get('authorization') || '').startsWith('Bearer ');
  if (usesCookie) {
    const origin = request.headers.get('origin');
    if (!origin || new URL(origin).host !== request.nextUrl.host) {
      return NextResponse.json({ ok: false, error: 'Bad origin' }, { status: 403, headers: noStore });
    }
  }
  const parsed = parseLeadUpdate(await request.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400, headers: noStore });

  const pool = await getPostgresPool();
  if (!pool) return NextResponse.json({ ok: false, error: 'Database not available' }, { status: 503, headers: noStore });
  try {
    const { text, values } = buildLeadUpdateSql(parsed.id, parsed.update);
    const res = await pool.query(text, values);
    if (res.rows.length === 0) return NextResponse.json({ ok: false, error: 'Lead not found' }, { status: 404, headers: noStore });
    return NextResponse.json({ ok: true, lead: res.rows[0] }, { headers: noStore });
  } catch (e) {
    console.error('admin/leads PATCH failed:', e);
    return NextResponse.json({ ok: false, error: 'Update failed' }, { status: 500, headers: noStore });
  }
}
