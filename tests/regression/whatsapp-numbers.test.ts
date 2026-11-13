/**
 * Every hard-coded wa.me number on the site is one of the two company numbers.
 *
 * Moved out of tests/api/contact-route.test.ts on 2026-11-13 (management review
 * item 7). It scans the whole codebase: measured 2,041 source files, 31 MB,
 * about 1.3-1.5 s on its own, but over vitest's default 5 s under full-suite
 * parallel load, so it failed intermittently. Same assertion as before; the
 * walk uses directory entry types (no stat per file) and skips files without
 * "wa.me/" before the regex; the 30 s limit is an explicit bound, not a retry.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const COMPANY_NUMBERS = ['254768860665', '254782914717'];

describe('WhatsApp links', () => {
  it('every hard-coded wa.me number on the site is one of the two company numbers', () => {
    const root = join(__dirname, '..', '..');
    const found = new Set<string>();
    let files = 0;
    const walk = (d: string) => {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
        const p = join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (/\.(tsx?|jsx?)$/.test(e.name)) {
          files += 1;
          const text = readFileSync(p, 'utf8');
          if (text.includes('wa.me/')) for (const m of text.matchAll(/wa\.me\/(\d{9,15})/g)) found.add(m[1]);
        }
      }
    };
    for (const d of ['app', 'components', 'lib']) walk(join(root, d));
    expect(files).toBeGreaterThan(1000); // the scan really covered the codebase
    expect([...found].sort()).toEqual(COMPANY_NUMBERS);
  }, 30_000);
});
