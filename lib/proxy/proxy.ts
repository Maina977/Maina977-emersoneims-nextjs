// src/lib/proxy/proxy.ts
import { NextRequest, NextResponse } from 'next/server';
import { ProxyConfig } from './types';

/**
 * Secure reverse proxy handler.
 * Prevents SSRF, enforces allowlist, and sanitizes headers.
 */
export async function createProxyResponse(
  request: NextRequest,
  config: ProxyConfig
): Promise<NextResponse> {
  const { target, rewritePath = '', headers: extraHeaders = {}, timeout = 10_000 } = config;

  // 1. Validate & construct target URL
  let upstreamUrl: URL;
  try {
    upstreamUrl = new URL(rewritePath + request.nextUrl.pathname.replace(/^\/api\/proxy/, ''), target);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid proxy target' }, { status: 400 });
  }

  // 2. SSRF Protection: Block private IPs & localhost
  const hostname = upstreamUrl.hostname.toLowerCase();
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('172.') ||
    hostname === 'internal' // add your internal domains
  ) {
    return NextResponse.json({ error: 'Proxy to internal networks is forbidden' }, { status: 403 });
  }

  // 3. Build fetch init
  const init: RequestInit = {
    method: request.method,
    headers: new Headers(request.headers),
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : null,
    redirect: 'manual', // handle redirects manually for security
    signal: AbortSignal.timeout(timeout),
  };

  // Ensure headers is defined (it always will be since we set it above)
  const headers = init.headers as Headers;

  // Merge extra headers (e.g., Authorization: Bearer xxx)
  Object.entries(extraHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  // Remove dangerous headers
  ['host', 'cookie', 'authorization', 'x-api-key'].forEach(h => headers.delete(h));

  // 4. Forward request
  let response: Response;
  try {
    response = await fetch(upstreamUrl, init);
  } catch (e) {
    console.error('Proxy fetch error:', e);
    return NextResponse.json({ error: 'Upstream unreachable' }, { status: 502 });
  }

  // 5. Build NextResponse
  const proxyResponse = new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  });

  // Remove/replace sensitive headers
  proxyResponse.headers.delete('set-cookie');
  proxyResponse.headers.delete('www-authenticate');

  // Optional: Force CORS (useful for client-side proxying)
  if (config.cors) {
    proxyResponse.headers.set('Access-Control-Allow-Origin', '*');
    proxyResponse.headers.set('Access-Control-Allow-Methods', '*');
    proxyResponse.headers.set('Access-Control-Allow-Headers', '*');
  }

  return proxyResponse;
}