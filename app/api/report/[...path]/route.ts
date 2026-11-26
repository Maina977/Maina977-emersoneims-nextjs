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
 */
import { NextRequest } from 'next/server';
import { dispatch } from '@/lib/wizard-api/dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> },
) => {
  const { path = [] } = await ctx.params;
  return dispatch(req, path, 'report');
};

export const GET = handler;
export const POST = handler;
