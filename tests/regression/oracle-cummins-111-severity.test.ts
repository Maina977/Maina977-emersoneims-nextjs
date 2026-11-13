/**
 * R8 (P0 audit 2026-11-13): Cummins fault 111 = SPN 629 FMI 12, ECM critical
 * internal failure, a red-lamp (stop) code. It was rated "warning", and its
 * solution quoted an invented "24V±2V" ECM supply tolerance.
 */
import { describe, it, expect } from 'vitest';
import { CUMMINS_ERROR_CODES } from '@/lib/data/cumminsErrorCodes';
import { GENERATOR_ERROR_CODES } from '@/lib/data/generatorErrorCodes';
import { answerOracle } from '@/lib/generator-oracle/server/answer';

describe('Cummins 111', () => {
  it('is critical in both code databases', () => {
    expect(CUMMINS_ERROR_CODES.find((c) => c.code === '111')?.severity).toBe('critical');
    expect(GENERATOR_ERROR_CODES.find((c) => c.code === '111' && c.brand === 'Cummins')?.severity).toBe('critical');
  });

  it('no longer quotes an unsourced 24 V ± 2 V tolerance', () => {
    expect(JSON.stringify(CUMMINS_ERROR_CODES.find((c) => c.code === '111'))).not.toMatch(/±\s*2\s*V|24V±2V/);
    expect(JSON.stringify(GENERATOR_ERROR_CODES.find((c) => c.code === '111'))).not.toMatch(/±\s*2\s*V/);
  });

  it('the Oracle answer for SPN 629 FMI 12 is not rated as a mere warning', () => {
    const a = answerOracle('SPN 629 FMI 12');
    expect(a.found).toBe(true);
    expect(a.text).not.toMatch(/severity: (warning|info)\)/);
  });
});
