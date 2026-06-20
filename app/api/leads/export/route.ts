import { NextResponse } from 'next/server';
import { getPostgresPool } from '@/lib/db';

// ═══════════════════════════════════════════════════════════════════════════════
// LEAD EXPORT — token-protected feed of recent website leads.
//
// Lets the local ERP poller (scripts/erp-pull-leads.mjs) PULL new leads from the
// cloud and push them into ERP PRO on localhost:8088 — WITHOUT any inbound tunnel.
// The PC reaches out to the cloud (always possible) instead of the cloud reaching
// the PC (needs a tunnel). Resilient: works whenever the PC is online.
//
// Auth: ?token=<LEAD_DIAG_TOKEN or ADMIN_API_KEY>
// Paging: ?sinceId=<lastId>  (returns leads with id > sinceId), ?limit=<n>
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || '';
  const expected = process.env.LEAD_DIAG_TOKEN || process.env.ADMIN_API_KEY;

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: 'Set LEAD_DIAG_TOKEN (or ADMIN_API_KEY) in the environment to enable lead export.' },
      { status: 503 },
    );
  }
  if (token !== expected) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const sinceId = Number(url.searchParams.get('sinceId') || 0) || 0;
  const limit = Math.min(Number(url.searchParams.get('limit') || 100) || 100, 500);

  try {
    const pool = await getPostgresPool();
    if (!pool) {
      return NextResponse.json({ ok: true, count: 0, leads: [], note: 'No database configured — leads are not stored in Postgres.' });
    }
    const result = await pool.query(
      `SELECT id, name, email, phone, company, message, service, source, location, created_at
         FROM leads
        WHERE id > $1
        ORDER BY id ASC
        LIMIT $2`,
      [sinceId, limit],
    );
    return NextResponse.json({ ok: true, count: result.rows.length, leads: result.rows });
  } catch (err) {
    return NextResponse.json({ ok: false, count: 0, leads: [], error: String(err) }, { status: 200 });
  }
}
