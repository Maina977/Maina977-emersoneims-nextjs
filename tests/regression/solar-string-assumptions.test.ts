/** String sizing (P0 audit 2026-11-13): silent defaults are now stated, and the cold-Voc formula checked by hand. */
import { describe, it, expect } from 'vitest';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const eng = require('../../lib/solar-genius/server/solar-engineering.js');
const base = { panelVocStc: 49.5, panelVmppStc: 41.5, panelImppStc: 13.2, panelIscStc: 14, inverterMaxDcV: 500, inverterMpptMinV: 120, inverterMpptMaxV: 450, inverterMaxInputA: 13 };

describe('stringConfig', () => {
  it('hand check: 49.5 V × (1 − 0.0027 × (5 − 25)) = 52.17 V → 9 panels on a 500 V input', () => {
    const r = eng.stringConfig(base);
    expect(r.voltages.vocCold).toBeCloseTo(52.17, 2);
    expect(r.panelsPerString.max).toBe(9);
  });
  it('lists every assumed value and warns when the site minimum was not entered', () => {
    const r = eng.stringConfig(base);
    expect(r.assumptions.join(' ')).toMatch(/Voc temperature coefficient[^]*Vmp temperature coefficient[^]*Lowest module temperature 5/);
    expect(r.warning).toMatch(/minimum temperature not entered/);
  });
  it('uses the datasheet Vmp coefficient when given, and no warning when the minimum is entered', () => {
    const r = eng.stringConfig({ ...base, siteTempMinC: -5, betaVocPctPerC: -0.26, betaVmppPctPerC: -0.35, siteTempMaxC: 70, inverterMpptCount: 2 });
    expect(r.voltages.vmppHot).toBeCloseTo(41.5 * (1 - 0.0035 * 45), 2);
    expect(r.warning).toBeUndefined();
    expect(r.assumptions).toEqual([]);
  });
});
