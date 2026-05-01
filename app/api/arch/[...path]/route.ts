import { NextRequest } from 'next/server';
import { dispatch } from '@/lib/wizard-api/dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = (prefix: string) =>
  async (req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) => {
    const { path = [] } = await ctx.params;
    return dispatch(req, path, prefix);
  };

export const GET = handler('arch');
export const POST = handler('arch');
export const PUT = handler('arch');
export const DELETE = handler('arch');
