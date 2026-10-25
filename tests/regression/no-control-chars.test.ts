/**
 * Source files must not contain stray control characters.
 *
 * 2026-10-25: three regexes had a literal backspace (0x08) where "\b" was meant,
 * written by a shell that unescaped the backslash. Each one silently never
 * matched: the J1939 guard in /api/ai/diagnose and the placeholder-name check
 * in scripts/verify-parts-identification.mjs (which then passed 145
 * "Battery Accessory Part #4" rows). Nothing else caught them.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOTS = ['app', 'lib', 'components', 'scripts', 'external/borehole-ai-engine/src', 'tests', 'middleware.ts'];
const EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.html', '.css', '.json']);
// Tab, LF and CR are normal; form feed is tolerated. Everything else below 0x20 is not.
const BAD = /[\x00-\x08\x0B\x0E-\x1F]/;

function* walk(p: string): Generator<string> {
  const s = statSync(p);
  if (s.isFile()) { if (EXT.has(extname(p))) yield p; return; }
  for (const name of readdirSync(p)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    yield* walk(join(p, name));
  }
}

describe('source hygiene', () => {
  it('has no stray control characters (e.g. a backspace where \\b was meant)', () => {
    const hits: string[] = [];
    for (const root of ROOTS) {
      for (const f of walk(root)) {
        const lines = readFileSync(f, 'utf8').split('\n');
        lines.forEach((l, i) => { if (BAD.test(l)) hits.push(`${f}:${i + 1}`); });
      }
    }
    expect(hits).toEqual([]);
  });
});
