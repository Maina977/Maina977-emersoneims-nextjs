/**
 * Register R-40 (P1-D §6): every result records its standard AND edition.
 * The EN / ISO / BS methods named no edition year (EN 1992-1-1, EN 1993-1-8,
 * EN 1997-1, EN 1998-1, EN 1991-1-4, ISO 6946, BS 8206-2). The editions are
 * the ones whose clauses and equations the code implements (first-generation
 * Eurocodes; ISO 6946:2017; BS 8206-2:2008).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as c from '@/lib/wizard-api/buildingCalcs';

const SRC = readFileSync(join(__dirname, '..', '..', 'lib', 'wizard-api', 'buildingCalcs.ts'), 'utf8');

describe('R-40: standard and edition in every method', () => {
  it('every method string naming an EN, ISO or BS standard carries its edition year', () => {
    const methods = [...SRC.matchAll(/method: ['"`]([^'"`]*)['"`]/g)].map((m) => m[1]);
    const named = methods.filter((m) => /\b(EN|ISO|BS) \d/.test(m));
    expect(named.length).toBeGreaterThanOrEqual(12);
    for (const m of named) {
      // Every standard number in the string is followed by ":YYYY".
      const bare = m.match(/\b(?:EN|ISO|BS) \d[\d-]*(?!-|\d|:\d{4})/g) ?? [];
      expect(bare, `standards without an edition in "${m}"`).toEqual([]);
    }
  });
  it('results carry it: RC beam EN 1992-1-1:2004', () => {
    expect((c.rcBeam({ b_mm: 300, d_mm: 450, As_mm2: 1000, fck_MPa: 25, fyk_MPa: 500 }) as { method: string }).method).toMatch(/EN 1992-1-1:2004/);
    expect(SRC).toContain("method: 'BS EN ISO 6946:2017");
  });
});
