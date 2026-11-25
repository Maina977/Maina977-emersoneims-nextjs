import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

// Safety withdrawal review R4 (2026-11-25): sw-oracle.js v1 served pages and /_next chunks
// cache-first from a never-changing cache ('generator-oracle-v1') and pre-cached
// /generator-oracle, so a returning visitor could see the pre-withdrawal Oracle after a deploy.
// These tests run the real worker file in a sandbox with fake caches/clients.

type Listener = (event: any) => void;

function loadWorker(initialCaches: string[] = []) {
  const listeners: Record<string, Listener> = {};
  const store = new Map<string, Map<string, unknown>>(initialCaches.map((n) => [n, new Map()]));
  const addAll = vi.fn(async (urls: string[]) => { void urls; });
  const caches = {
    keys: vi.fn(async () => [...store.keys()]),
    delete: vi.fn(async (n: string) => store.delete(n)),
    open: vi.fn(async (n: string) => {
      if (!store.has(n)) store.set(n, new Map());
      return { addAll, match: vi.fn(async () => undefined), put: vi.fn(async () => undefined) };
    }),
    match: vi.fn(async () => undefined),
  };
  const windowClient = { url: 'https://example.test/generator-oracle', navigate: vi.fn(async () => undefined) };
  const clients = { claim: vi.fn(async () => undefined), matchAll: vi.fn(async () => [windowClient]), openWindow: vi.fn() };
  const self = {
    addEventListener: (t: string, fn: Listener) => { listeners[t] = fn; },
    location: { origin: 'https://example.test' },
    skipWaiting: vi.fn(),
    clients,
    registration: { showNotification: vi.fn() },
  };
  const src = fs.readFileSync(path.resolve('public/sw-oracle.js'), 'utf8');
  vm.runInNewContext(src, { self, caches, clients, location: self.location, URL, Response, fetch: vi.fn(async () => new Response('icon', { status: 200 })), console: { log() {}, warn() {}, error() {} }, Promise });
  return { listeners, store, caches, clients, windowClient, addAll, self };
}

const fetchEvent = (url: string, mode = 'no-cors', method = 'GET') => ({ request: { url, mode, method }, respondWith: vi.fn() });

describe('sw-oracle.js never serves a stale page or script', () => {
  it('uses a new cache name and pre-caches only the notification icons', async () => {
    const src = fs.readFileSync(path.resolve('public/sw-oracle.js'), 'utf8');
    expect(src).toContain("const CACHE_NAME = 'generator-oracle-v2'");
    const w = loadWorker();
    let done: Promise<unknown> = Promise.resolve();
    w.listeners.install({ waitUntil: (p: Promise<unknown>) => { done = p; } });
    await done;
    expect(w.addAll).toHaveBeenCalledWith(['/images/oracle-icon-192.png', '/images/oracle-icon-512.png']);
    expect(w.self.skipWaiting).toHaveBeenCalled();
  });

  it('does not intercept navigations, the Oracle page, /_next scripts, styles or API calls', () => {
    const w = loadWorker();
    for (const e of [
      fetchEvent('https://example.test/generator-oracle', 'navigate'),
      fetchEvent('https://example.test/', 'navigate'),
      fetchEvent('https://example.test/generator-oracle'),
      fetchEvent('https://example.test/_next/static/chunks/app/generator-oracle/page-abc123.js'),
      fetchEvent('https://example.test/_next/static/css/app.css'),
      fetchEvent('https://example.test/api/generator-oracle/health'),
      fetchEvent('https://example.test/images/oracle-icon-192.png', 'no-cors', 'POST'),
      fetchEvent('https://cdn.example.org/images/oracle-icon-192.png'),
    ]) {
      w.listeners.fetch(e);
      expect(e.respondWith, e.request.url).not.toHaveBeenCalled();
    }
  });

  it('answers only the notification icons from its cache', () => {
    const w = loadWorker();
    const e = fetchEvent('https://example.test/images/oracle-icon-512.png');
    w.listeners.fetch(e);
    expect(e.respondWith).toHaveBeenCalledTimes(1);
  });

  it('activate: deletes generator-oracle-v1 (not other workers’ caches), claims clients and reloads windows the old version served', async () => {
    const w = loadWorker(['generator-oracle-v1', 'pages-v12-20260709-chunkretry', 'generator-oracle-v2']);
    let done: Promise<unknown> = Promise.resolve();
    w.listeners.activate({ waitUntil: (p: Promise<unknown>) => { done = p; } });
    await done;
    expect([...w.store.keys()].sort()).toEqual(['generator-oracle-v2', 'pages-v12-20260709-chunkretry']);
    expect(w.clients.claim).toHaveBeenCalled();
    expect(w.windowClient.navigate).toHaveBeenCalledWith('https://example.test/generator-oracle');
  });

  it('activate with no old Oracle cache does not reload anything (no reload loop)', async () => {
    const w = loadWorker(['generator-oracle-v2']);
    let done: Promise<unknown> = Promise.resolve();
    w.listeners.activate({ waitUntil: (p: Promise<unknown>) => { done = p; } });
    await done;
    expect(w.clients.claim).toHaveBeenCalled();
    expect(w.windowClient.navigate).not.toHaveBeenCalled();
  });

  it('keeps push and notification handling', () => {
    const w = loadWorker();
    for (const t of ['push', 'notificationclick', 'notificationclose', 'sync', 'message']) expect(typeof w.listeners[t]).toBe('function');
  });
});
