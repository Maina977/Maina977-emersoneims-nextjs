/**
 * SolarGeniusPro CRM / business endpoints — real ported logic.
 *
 * Sites, leads, deals, pipeline, conversion, profit and beginner/engineer
 * mode toggle. Ported from the original Express backend (server/business.js).
 *
 * NOTE: state is in-memory per serverless instance — for cross-request
 * persistence in production, set DATABASE_URL to enable the Postgres
 * mode in lib/solar-genius/server/portal-store.js, or front this with a
 * managed database (KV/Redis/Postgres). Empty initial responses are
 * honest, never fabricated.
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleSolarGenius } from '@/lib/solar-genius/adapter';
import { isAdminRequest, adminNotFound } from '@/lib/auth/adminRequest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> },
) => {
  // ADMIN ONLY (2026-10-18 tool audit). These are CRM endpoints: anyone could
  // POST a lead and anyone could GET every lead, deal and profit figure back.
  // Same gate as the dashboards and review moderation.
  if (!isAdminRequest(req)) return adminNotFound();
  const { path = [] } = await ctx.params;
  const res = await handleSolarGenius(req, 'biz', path);
  if (res.status !== 404) return res;
  return NextResponse.json({ success: false, error: 'Endpoint not implemented in biz family.' }, { status: 404 });
};

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
