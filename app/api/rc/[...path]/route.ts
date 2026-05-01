import { NextRequest } from 'next/server';
import { dispatch } from '@/lib/wizard-api/dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> },
) => {
  const { path = [] } = await ctx.params;
  return dispatch(req, path, 'rc');
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
