import { NextRequest } from 'next/server';
import { dispatch } from '@/lib/wizard-api/dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (req: NextRequest) => dispatch(req, [], 'generate');
export const GET = handler;
export const POST = handler;