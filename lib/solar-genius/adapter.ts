/**
 * SolarGeniusPro Next.js adapter.
 *
 * Bridges the CommonJS dispatcher in ./dispatch.js to Next.js Route Handlers.
 * Reads body/query, calls the dispatcher, returns NextResponse with the
 * proper JSON or binary payload.
 */
import { NextRequest, NextResponse } from 'next/server';

// CJS interop — dispatch.js lives next to this file.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { dispatch } = require('./dispatch') as {
  dispatch: (
    family: string,
    segs: string[],
    method: string,
    body: Record<string, unknown>,
    query: URLSearchParams,
  ) => Promise<{
    status: number;
    body: unknown;
    headers?: Record<string, string>;
    isBinary?: boolean;
  } | null>;
};

const MAX_BYTES = 1_000_000;

async function readJson(req: NextRequest): Promise<Record<string, unknown>> {
  if (req.method === 'GET' || req.method === 'HEAD') return {};
  const cl = parseInt(req.headers.get('content-length') || '0', 10);
  if (cl > MAX_BYTES) return {};
  const ct = req.headers.get('content-type') || '';
  if (!ct.includes('application/json')) return {};
  try { return (await req.json()) as Record<string, unknown>; } catch { return {}; }
}

export async function handleSolarGenius(
  req: NextRequest,
  family: string,
  segs: string[],
): Promise<NextResponse> {
  const body = await readJson(req);
  const url = new URL(req.url);
  const result = await dispatch(family, segs, req.method, body, url.searchParams);

  if (!result) {
    return NextResponse.json(
      { success: false, error: 'unknown endpoint', family, path: segs.join('/') },
      { status: 404 },
    );
  }

  if (result.isBinary) {
    const bodyBuf = result.body as Buffer | Uint8Array | string;
    return new NextResponse(bodyBuf as BodyInit, {
      status: result.status,
      headers: result.headers || {},
    });
  }

  return NextResponse.json(result.body, {
    status: result.status,
    headers: result.headers,
  });
}
