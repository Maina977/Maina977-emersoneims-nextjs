/**
 * Privacy correction 2026-11-28 (independent review of 547239cf):
 *  - public/sw.js must never contact a Google host (its install warm-up used to fetch
 *    fonts.googleapis.com, fonts.gstatic.com and www.google-analytics.com before consent);
 *  - its cache version must not be the pre-fix v12, so 'activate' deletes pages cached with the
 *    old pre-consent Google loader;
 *  - the CSP no longer allows Google Fonts (no page uses them; fonts are self-hosted).
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8');
// Strip comments so explanatory notes that name the old hosts do not count.
const code = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

describe('service worker and CSP make no pre-consent Google contact', () => {
  it('sw.js code names no Google host', () => {
    const sw = code(read('public/sw.js'));
    expect(sw).not.toMatch(/google-analytics\.com|googletagmanager\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|doubleclick\.net|googlesyndication\.com/);
  });

  it('sw.js cache version is past the pre-fix v12, so old cached pages are deleted on activate', () => {
    const v = /const CACHE_VERSION = '([^']+)'/.exec(read('public/sw.js'))?.[1] ?? '';
    expect(v).not.toBe('v12-20260709-chunkretry');
    expect(v).toMatch(/^v1[3-9]|^v[2-9]\d/);
    expect(read('public/sw.js')).toMatch(/!cacheName\.includes\(CACHE_VERSION\)/);
  });

  it('the CSP no longer allows Google Fonts', () => {
    const cfg = code(read('next.config.ts'));
    expect(cfg).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/);
  });
});
