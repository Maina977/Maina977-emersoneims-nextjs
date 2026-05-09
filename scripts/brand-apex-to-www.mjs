#!/usr/bin/env node
/**
 * Brand canonical fix — apex → www
 * --------------------------------------------------
 * Per /memories/brand-identity.md the canonical host is
 * https://www.emersoneims.com (always www, never apex —
 * closes the PageRank split). This script rewrites every
 * remaining apex literal in active source code.
 *
 * Skipped:
 *  - _archive/      (frozen historical mirrors)
 *  - reports/       (third-party Lighthouse output)
 *  - node_modules/, .next/, .git/
 *  - scripts/probe*, scripts/waitForDeploy.mjs, scripts/verifyHubInNav.mjs,
 *    scripts/probeRestoreVerify.mjs, scripts/URGENT_RESTORE_SITE.ps1
 *      (these probes test live apex→www redirect and must keep apex)
 *  - this script itself
 *  - lighthouse-*.json, *.report.html
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const SKIP_DIR_NAMES = new Set([
  'node_modules', '.next', '.git', '_archive', 'reports', 'external',
  '.vercel', 'dist', 'build', 'coverage', '.turbo', '.cache',
]);

const SKIP_FILE_PATTERNS = [
  /\.lock$/i,
  /package-lock\.json$/i,
  /\.report\.(json|html)$/i,
  /^lighthouse[-_].*\.(json|html)$/i,
  /^lh.*\.json$/i,
  /^_stash\d*\.patch$/i,
  /^_diff_.*\.txt$/i,
  /^build[-_].*\.txt$/i,
  /^_build_.*\.txt$/i,
  /^_routes\.txt$/i,
  /\.tmp_.*\.json$/i,
  /^chunk-[a-f0-9]+\.js$/i,
];

const SKIP_FILES_REL = new Set([
  'scripts/brand-apex-to-www.mjs',
  'scripts/brand-cleanup.mjs',
  'scripts/brand-restore-legal-name.mjs',
  'scripts/probeNavFooter.mjs',
  'scripts/probeRestoreVerify.mjs',
  'scripts/probeResourcesHub.mjs',
  'scripts/probeFooterLinks.mjs',
  'scripts/probeDupes.mjs',
  'scripts/probeBucketAStruct.mjs',
  'scripts/probeBucketADeep.mjs',
  'scripts/probeBucketA.mjs',
  'scripts/probeLiveAudit.mjs',
  'scripts/verifyHubInNav.mjs',
  'scripts/waitForDeploy.mjs',
  'scripts/URGENT_RESTORE_SITE.ps1',
]);

const ALLOWED_EXT = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.json', '.md', '.txt', '.env', '.example', '.conf',
  '.html', '.xml', '.yaml', '.yml',
]);

// Match apex inside any quote/backtick that is NOT preceded by 'www.'
// We replace https://emersoneims.com → https://www.emersoneims.com
// But NEVER touch https://www.emersoneims.com (already www).
const APEX_RE = /(?<!www\.)https:\/\/emersoneims\.com/g;

let files = 0, changedFiles = 0, totalReplacements = 0;
const changes = [];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIR_NAMES.has(e.name)) continue;
      await walk(full);
    } else if (e.isFile()) {
      const rel = path.relative(ROOT, full).replaceAll('\\', '/');
      if (SKIP_FILES_REL.has(rel)) continue;
      if (SKIP_FILE_PATTERNS.some((re) => re.test(e.name))) continue;
      const ext = path.extname(e.name).toLowerCase();
      // .env.example has no recognised ext — handle by name
      if (!ALLOWED_EXT.has(ext) && e.name !== '.env.example' && e.name !== '.env') continue;
      files++;
      let buf;
      try { buf = await fs.readFile(full, 'utf8'); }
      catch { continue; }
      if (!buf.includes('https://emersoneims.com')) continue;
      const matches = buf.match(APEX_RE);
      if (!matches) continue;
      const next = buf.replace(APEX_RE, 'https://www.emersoneims.com');
      if (next === buf) continue;
      await fs.writeFile(full, next, 'utf8');
      changedFiles++;
      totalReplacements += matches.length;
      changes.push({ file: rel, count: matches.length });
    }
  }
}

await walk(ROOT);

changes.sort((a, b) => b.count - a.count);
console.log(`Scanned: ${files} files`);
console.log(`Changed: ${changedFiles} files`);
console.log(`Replacements: ${totalReplacements}`);
console.log('');
for (const c of changes) {
  console.log(`  ${c.count.toString().padStart(3)}  ${c.file}`);
}
