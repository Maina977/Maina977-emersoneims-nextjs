// src/lib/proxy/types.ts
export interface ProxyConfig {
  target: string; // e.g., 'https://api.example.com'
  rewritePath?: string; // '/v1' → rewrites /proxy/v1/users → /users
  headers?: Record<string, string>; // inject auth, etc.
  timeout?: number; // ms
  cors?: boolean; // enable CORS on proxy responses
}