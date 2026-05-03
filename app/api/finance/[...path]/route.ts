/**
 * SolarGeniusPro finance endpoints — real algorithms (Brealey & Myers).
 *
 * Routes: /api/finance/npv, /irr, /loan, /inflation, /margin, /loan-vs-cash,
 * /tariff/<category>, /currency. All implementations are ported from the
 * original Express backend (server/financial.js) — NPV/IRR via
 * Newton–Raphson, PMT amortization, KPLC 2026 tariff schedule, ECB FX.
 *
 * Building Suite Pro shares some path names; wizard dispatcher serves as
 * fallback for any unknown segment.
 */

import { NextRequest } from 'next/server';
import { handleSolarGenius } from '@/lib/solar-genius/adapter';
import { dispatch } from '@/lib/wizard-api/dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> },
) => {
  const { path = [] } = await ctx.params;
  const res = await handleSolarGenius(req, 'finance', path);
  if (res.status !== 404) return res;
  return dispatch(req, path, 'finance');
};

export const GET = handler;
export const POST = handler;

