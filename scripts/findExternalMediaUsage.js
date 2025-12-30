/**
 * FIND EXTERNAL MEDIA USAGE
 *
 * Scans source files for external media URLs (especially WordPress /wp-content/uploads)
 * and writes a Markdown report.
 *
 * Usage:
 *   node scripts/findExternalMediaUsage.js
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = process.cwd();

const SCAN_DIRS = ['app', 'components', 'lib'];
const INCLUDE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.md']);

const patterns = [
  {
    name: 'wp-content/uploads',
    regex: /https?:\/\/(?:www\.)?emersoneims\.com\/wp-content\/uploads\/[^\s"')>]+/gi,
  },
  {
    name: 'any http(s) media',
    regex: /https?:\/\/[^\s"')>]+\.(?:png|jpg|jpeg|webp|gif|svg|mp4|webm|mov)(?:\?[^\s"')>]+)?/gi,
  },
];

function isTextFile(filePath) {
  return INCLUDE_EXTS.has(path.extname(filePath).toLowerCase());
}

function walk(dirPath, outFiles) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue;
      walk(fullPath, outFiles);
    } else if (entry.isFile()) {
      if (isTextFile(fullPath)) outFiles.push(fullPath);
    }
  }
}

function toWorkspaceRelative(absPath) {
  const rel = path.relative(WORKSPACE_ROOT, absPath);
  return rel.split(path.sep).join('/');
}

function scanFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/);

  const findings = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const p of patterns) {
      const matches = line.match(p.regex);
      if (matches && matches.length) {
        for (const url of matches) {
          findings.push({
            pattern: p.name,
            lineNumber: i + 1,
            url,
            line: line.trim(),
          });
        }
      }
    }
  }
  return findings;
}

function main() {
  const allFiles = [];
  for (const dir of SCAN_DIRS) {
    walk(path.join(WORKSPACE_ROOT, dir), allFiles);
  }

  const resultsByFile = new Map();

  for (const file of allFiles) {
    const findings = scanFile(file);
    if (findings.length) resultsByFile.set(file, findings);
  }

  const reportLines = [];
  reportLines.push('# External Media Usage Report');
  reportLines.push('');
  reportLines.push(`Generated: ${new Date().toISOString()}`);
  reportLines.push('');

  let totalWp = 0;
  let totalHttpMedia = 0;

  for (const [, findings] of resultsByFile) {
    for (const f of findings) {
      if (f.pattern === 'wp-content/uploads') totalWp += 1;
      if (f.pattern === 'any http(s) media') totalHttpMedia += 1;
    }
  }

  reportLines.push('## Summary');
  reportLines.push(`- Files scanned: ${allFiles.length}`);
  reportLines.push(`- Files with matches: ${resultsByFile.size}`);
  reportLines.push(`- WordPress matches: ${totalWp}`);
  reportLines.push(`- Any external media matches: ${totalHttpMedia}`);
  reportLines.push('');

  reportLines.push('## Matches');
  reportLines.push('');

  const filesSorted = [...resultsByFile.keys()].sort((a, b) => a.localeCompare(b));
  for (const file of filesSorted) {
    const findings = resultsByFile.get(file) || [];
    reportLines.push(`### ${toWorkspaceRelative(file)}`);
    reportLines.push('');
    for (const f of findings) {
      reportLines.push(`- [${f.pattern}] L${f.lineNumber}: ${f.url}`);
    }
    reportLines.push('');
  }

  const outPath = path.join(WORKSPACE_ROOT, 'EXTERNAL_MEDIA_USAGE.md');
  fs.writeFileSync(outPath, reportLines.join('\n'), 'utf8');

  // eslint-disable-next-line no-console
  console.log(`Wrote ${outPath}`);
}

main();
