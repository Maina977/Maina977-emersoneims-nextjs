/**
 * Report B, 24 Nov 2026: the preview build of 8d1bf613 FAILED on Vercel
 * ("Module not found: ../../scripts/db/accounts-lib.cjs") although every local
 * check passed: .vercelignore keeps scripts/ out of deployments, while the local
 * build sees the whole worktree. This test fails if application code imports
 * from any directory that .vercelignore excludes, so the local gate catches it.
 */
import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Reads every source file: slow on a busy machine; changes no assertion.
vi.setConfig({ testTimeout: 60_000 });

const ROOT = process.cwd();
const ignoredDirs = fs.readFileSync(path.join(ROOT, '.vercelignore'), 'utf8')
  .split(/\r?\n/).map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#') && !l.startsWith('!') && l.endsWith('/'))
  .map((l) => l.replace(/^\/+|\/+$/g, ''));

function sources(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) sources(p, out);
    else if (/\.(ts|tsx|js|jsx|cjs|mjs)$/.test(e.name) && !/\.(test|spec)\./.test(e.name)) out.push(p);
  }
  return out;
}

describe('application code never imports from deploy-excluded directories', () => {
  it('.vercelignore excludes scripts/ (the case that broke the preview build)', () => {
    expect(ignoredDirs).toContain('scripts');
  });

  it('no app/, lib/, components/ or middleware import resolves into an excluded directory', () => {
    const files = [...['app', 'lib', 'components'].flatMap((d) => sources(path.join(ROOT, d))), path.join(ROOT, 'middleware.ts')];
    const bad: string[] = [];
    const spec = /(?:require\(\s*|import\s*\(\s*|from\s+)['"]([^'"]+)['"]/g;
    for (const f of files) {
      const text = fs.readFileSync(f, 'utf8');
      for (const m of text.matchAll(spec)) {
        const target = m[1];
        let resolved: string | null = null;
        if (target.startsWith('.')) resolved = path.relative(ROOT, path.resolve(path.dirname(f), target));
        else if (target.startsWith('@/')) resolved = target.slice(2);
        if (!resolved) continue;
        const top = resolved.split(/[\\/]/)[0];
        if (ignoredDirs.includes(top)) bad.push(`${path.relative(ROOT, f)} → ${target}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
