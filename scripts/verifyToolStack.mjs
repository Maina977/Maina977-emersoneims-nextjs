/**
 * Audits migrated tool layout: vendor folders on disk + required API route files.
 * Run: node scripts/verifyToolStack.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const vendor = [
  'external/EMERSONEIMS-AQUASCANPRO',
  'external/EMERSONEIMS-SolarGeniusPro',
  'external/EMERSONEIMS-BUILDING-SUITE-PRO',
];

const apiChecks = [
  'app/api/solar/nasa-power/route.ts',
  'app/api/solar/weather/route.ts',
  'app/api/solar/elevation/route.ts',
  'app/api/borehole/analyze-site/route.ts',
  'app/api/borehole/satellite/route.ts',
  'app/api/borehole/nasa-gldas/route.ts',
  'app/api/borehole/nearby-boreholes/route.ts',
  'app/api/borehole/water-quality/route.ts',
  'app/api/building/site-analysis/route.ts',
  'app/api/building/comprehensive-report/route.ts',
  'app/api/ml/analyze-image/route.ts',
  'app/api/ml/parse-boq/route.ts',
];

let failed = false;

for (const rel of vendor) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.error(`[verify] MISSING vendor mirror: ${rel}`);
    failed = true;
  } else {
    console.log(`[verify] OK vendor: ${rel}`);
  }
}

for (const rel of apiChecks) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.error(`[verify] MISSING API: ${rel}`);
    failed = true;
  }
}
console.log(`[verify] API route files checked: ${apiChecks.length}`);

const toolPages = [
  'app/aquascan-pro-v3/page.tsx',
  'app/solar-genius-pro/page.tsx',
  'app/pro-building-suite/page.tsx',
];
for (const rel of toolPages) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.error(`[verify] MISSING page: ${rel}`);
    failed = true;
  }
}

if (failed) {
  console.error('[verify] FAILED');
  process.exit(1);
}
console.log('[verify] PASSED — tool stack and APIs present');
process.exit(0);
