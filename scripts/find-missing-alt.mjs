#!/usr/bin/env node
// Audit Image / img tags missing alt= across app/ and components/
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name.startsWith('_ARCHIVE')) continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (/\.(tsx|jsx)$/.test(entry.name)) yield p;
  }
}

const skip = (f) =>
  f.includes('node_modules') ||
  f.includes('.next') ||
  /external[\\/]/.test(f) ||
  /-backup/.test(f) ||
  /-old\./.test(f);

const findings = [];
for (const root of ['app', 'components']) {
  for (const file of walk(root)) {
    if (skip(file)) continue;
    const text = readFileSync(file, 'utf8');
    // Match <Image ...> or <img ...> tags (single or multi-line)
    const re = /<(Image|img)\b[^>]*?(?:\/>|>)/gs;
    let m;
    while ((m = re.exec(text)) !== null) {
      const tag = m[0];
      if (!/\balt\s*=/.test(tag)) {
        const lineNum = text.slice(0, m.index).split('\n').length;
        findings.push({
          file: file.replace(/\\/g, '/'),
          line: lineNum,
          tag: m[1],
          snippet: tag.slice(0, 140).replace(/\s+/g, ' '),
        });
      }
    }
  }
}

for (const f of findings) {
  console.log(`${f.file}:${f.line}\t<${f.tag}>\t${f.snippet}`);
}
console.log(`\nTOTAL: ${findings.length}`);
