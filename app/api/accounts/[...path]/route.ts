/**
 * Accounts API entry point (Report B). Off unless ACCOUNTS_ENABLED is exactly
 * "true", and always off in production (lib/accounts/config.ts). All checks
 * are in lib/accounts/http.ts; the route table is lib/accounts/routes.ts.
 */
import type { NextRequest } from 'next/server';
import { handle } from '@/lib/accounts/http';
import { matchRoute } from '@/lib/accounts/routes';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteCtx = { params: Promise<{ path?: string[] }> };

async function dispatch(request: NextRequest, { params }: RouteCtx) {
  const { path = [] } = await params;
  const m = matchRoute(request.method, path);
  return handle(request, m?.spec ?? null, m?.params ?? {});
}

export const GET = dispatch;
export const POST = dispatch;
export const PUT = dispatch;
export const DELETE = dispatch;
