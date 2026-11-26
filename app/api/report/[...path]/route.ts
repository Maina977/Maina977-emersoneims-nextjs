/**
 * /api/report/* for the Building Suite wizard's Costing tab (quotation,
 * project report, client package) and its Reports screen (2026-11-26).
 *
 * The wizard has always called /api/report/quotation, /comprehensive and
 * /client-package, but no Next.js route existed, so each answered a 404 page
 * and the screens showed "Error generating quotation". The dispatcher already
 * answers these paths with its not-available stub (HTTP 501, success:false,
 * the engineer's number). This route only connects the path to it: nothing is
 * computed, priced or stored here. The withdrawn description-based report
 * generator is NOT behind it (/api/building/comprehensive-report stays 501).
 *
 * Review advisories (2026-11-26): only the three paths the wizard calls are
 * served (A1; anything else is 404), the 501 is never cached (A2:
 * Cache-Control: no-store), and the dispatcher enforces its 1 MB limit on
 * the streamed body (A3, lib/wizard-api/dispatcher.ts).
 */
import { NextRequest, NextResponse } from 'next/server';
import { dispatch } from '@/lib/wizard-api/dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** The only /api/report/* paths the wizard calls. */
const REPORT_PATHS = new Set(['quotation', 'comprehensive', 'client-package']);

const handler = async (
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> },
) => {
  const { path = [] } = await ctx.params;
  if (path.length !== 1 || !REPORT_PATHS.has(path[0])) {
    return NextResponse.json({ success: false, ok: false, error: 'not_found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  }
  const res = await dispatch(req, path, 'report');
  res.headers.set('Cache-Control', 'no-store');
  return res;
};

export const GET = handler;
export const POST = handler;
