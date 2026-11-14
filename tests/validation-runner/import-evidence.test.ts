import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ingestReviewPack } from '@/lib/generator-oracle/reviewIngest';
import { compareRealSystems } from '@/lib/solar/design/comparison';
import { importBoreholesCsv } from '@/lib/aquascan-validation/importCsv';
import { compareWithReference } from '@/lib/qs/referenceComparison';

/**
 * Evidence import runner (P1, 2026-11-15). Skipped unless EVIDENCE_FILE is set.
 * Reads a reviewer-filled file and writes <file>.report.json next to it. It
 * never edits the tools or marks anything verified.
 *
 *   PowerShell:
 *   $env:EVIDENCE_KIND='oracle-alarms'   # oracle-alarms | oracle-rules | solar-systems | boreholes | qs-boq
 *   $env:EVIDENCE_FILE='C:\path\to\filled.csv'
 *   npx vitest run tests/validation-runner
 */
const kind = process.env.EVIDENCE_KIND;
const file = process.env.EVIDENCE_FILE;

describe.skipIf(!file)('evidence import', () => {
  it(`imports ${kind} from ${file}`, () => {
    const text = fs.readFileSync(path.resolve(file!), 'utf8');
    const report =
      kind === 'oracle-alarms' || kind === 'oracle-rules' ? ingestReviewPack(text)
        : kind === 'solar-systems' ? compareRealSystems(text)
          : kind === 'boreholes' ? importBoreholesCsv(text)
            : kind === 'qs-boq' ? compareWithReference(text)
              : (() => { throw new Error('EVIDENCE_KIND must be oracle-alarms, oracle-rules, solar-systems, boreholes or qs-boq'); })();
    fs.writeFileSync(`${file}.report.json`, JSON.stringify({ kind, file, generatedAt: new Date().toISOString(), report }, null, 2));
    expect(report).toBeTruthy();
  });
});
