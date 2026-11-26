/**
 * SolarGeniusPro engineering-PRO (Aurora-grade) catch-all.
 * Real algorithms ported from server/engineering-pro.js: hourly shading,
 * Monte-Carlo battery sizing, full lightning risk, P50/P90 yield, JWT
 * client portal, structural wind ballast, BS 7430 earth electrode.
 */
import { NextRequest } from 'next/server';
import { handleSolarGenius } from '@/lib/solar-genius/adapter';
import { dispatch } from '@/lib/wizard-api/dispatcher';
import { isAdminRequest, adminNotFound } from '@/lib/auth/adminRequest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> },
) => {
  const { path = [] } = await ctx.params;
  // ADMIN ONLY for the client-portal token endpoints (security sweep
  // 2026-11-26): portal-jwt and portal-revoke wrote caller strings of any size
  // into Postgres (when DATABASE_URL is set) and anyone could revoke any token
  // id. No page uses them (the only UI is AdvancedFeaturesPage, which no route
  // mounts). Same gate as /api/biz. The calculators stay public.
  if ((path[0] || '').toLowerCase().startsWith('portal-') && !isAdminRequest(req)) return adminNotFound();
  const res = await handleSolarGenius(req.clone() as NextRequest, 'engpro', path);
  if (res.status !== 404) return res;
  return dispatch(req, path, 'engpro');
};

export const GET = handler;
export const POST = handler;
