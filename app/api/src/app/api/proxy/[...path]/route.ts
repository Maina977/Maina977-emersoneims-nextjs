// src/app/api/proxy/[...path]/route.ts
import { NextRequest } from 'next/server';
import { createProxyResponse } from '@/lib/proxy/proxy';

// Allowlist of permitted origins (for SSRF prevention + auditability)
const ALLOWED_TARGETS = [
  'https://api.nasa.gov',
  'https://jsonplaceholder.typicode.com',
  // Add your backends here
  // process.env.PROXY_TARGET!, // via env (recommended)
].filter(Boolean);

export async function GET(request: NextRequest) {
  return handleProxy(request);
}
export async function POST(request: NextRequest) {
  return handleProxy(request);
}
export async function PUT(request: NextRequest) {
  return handleProxy(request);
}
export async function DELETE(request: NextRequest) {
  return handleProxy(request);
}

async function handleProxy(request: NextRequest) {
  const url = new URL(request.url);
  const target = url.searchParams.get('target');

  if (!target) {
    return new Response('Missing ?target=URL', { status: 400 });
  }

  // Validate against allowlist (security!)
  if (!ALLOWED_TARGETS.some(allowed => target.startsWith(allowed))) {
    return new Response('Target not allowed', { status: 403 });
  }

  return createProxyResponse(request, {
    target,
    timeout: 15_000,
    cors: true, // enable CORS for frontend consumption
    headers: {
      // Example: inject auth for backend
      // 'Authorization': `Bearer ${process.env.BACKEND_TOKEN}`,
    },
  });
}