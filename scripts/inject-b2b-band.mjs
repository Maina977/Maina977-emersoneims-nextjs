// Inserts B2BCommercialBand into Next.js page files.
// Usage: node scripts/inject-b2b-band.mjs

import fs from 'node:fs';
import path from 'node:path';

const targets = [
  ['ai-tools', 'aiTools'],
  ['solar-genius-pro', 'solarGeniusPro'],
  ['solar-design-studio', 'solarDesignStudio'],
  ['aquascan-pro-v3', 'aquascanPro'],
  ['generator-oracle', 'generatorOracle'],
  ['eims-pro', 'eimsPro'],
  ['resources', 'resources'],
  ['knowledge-base', 'knowledgeBase'],
  ['technical-bible', 'technicalBible'],
  ['maintenance-hub', 'maintenanceHub'],
  ['calculators', 'calculators'],
  ['faq', 'faq'],
  ['case-studies', 'caseStudies'],
  ['brands', 'brands'],
  ['blog', 'blog'],
  ['faults', 'faults'],
  ['generator', 'generatorMain'],
  ['generator-services', 'generatorServices'],
  ['generator-problems', 'generatorProblems'],
  ['generator-parts', 'generatorParts'],
  ['fabrication', 'fabricationMain'],
  ['mep-clash', 'mepClash'],
  ['healthcare', 'healthcare'],
  ['high-rise', 'highRise'],
  ['interior', 'interior'],
  ['innovations', 'innovations'],
  ['contact', 'contact'],
  ['booking', 'booking'],
  ['about-us', 'aboutUs'],
  ['solutions/building', 'mepClash'],
  ['solutions/contact', 'contact'],
];

const APP = path.resolve('app');
const IMPORT_BAND = `import B2BCommercialBand from '@/components/b2b/B2BCommercialBand';`;
const IMPORT_PROFILES = `import { B2B_PROFILES } from '@/lib/b2b/pageProfiles';`;

let summary = [];

for (const [route, profileKey] of targets) {
  const file = path.join(APP, route, 'page.tsx');
  if (!fs.existsSync(file)) {
    summary.push({ route, status: 'MISSING_FILE' });
    continue;
  }
  let src = fs.readFileSync(file, 'utf8');

  if (src.includes('B2BCommercialBand')) {
    summary.push({ route, status: 'ALREADY_HAS' });
    continue;
  }

  // 1. Add imports after the last existing import line.
  const lines = src.split('\n');
  let lastImport = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^import\s+/.test(lines[i])) lastImport = i;
  }
  if (lastImport === -1) {
    // No imports — insert after 'use client' line if present, else at top.
    let insertAt = 0;
    if (lines[0]?.includes('use client')) insertAt = 1;
    lines.splice(insertAt, 0, IMPORT_BAND, IMPORT_PROFILES);
  } else {
    lines.splice(lastImport + 1, 0, IMPORT_BAND, IMPORT_PROFILES);
  }
  src = lines.join('\n');

  // 2. Find the first JSX wrapper inside the default export's return.
  // Strategy: match `return (\n   <Tag ...>` and insert band right after the opening tag.
  const returnRe = /return\s*\(\s*\n?(\s*)<([A-Za-z][A-Za-z0-9.]*)([^>]*?)>/;
  const m = src.match(returnRe);
  if (!m) {
    summary.push({ route, status: 'NO_RETURN' });
    fs.writeFileSync(file, src);
    continue;
  }
  // Skip if the outer is a Fragment.
  const tag = m[2];
  const indent = m[1];
  const insertion = `\n${indent}  {/* B2B Commercial Band */}\n${indent}  <B2BCommercialBand profile={B2B_PROFILES.${profileKey}} />\n`;
  const idx = m.index + m[0].length;
  // For self-closing wrappers like `<Foo />`, skip.
  if (m[0].trim().endsWith('/>')) {
    summary.push({ route, status: 'SELF_CLOSING_WRAPPER' });
    fs.writeFileSync(file, src);
    continue;
  }
  src = src.slice(0, idx) + insertion + src.slice(idx);

  fs.writeFileSync(file, src);
  summary.push({ route, status: 'INJECTED', tag });
}

console.log(JSON.stringify(summary, null, 2));
